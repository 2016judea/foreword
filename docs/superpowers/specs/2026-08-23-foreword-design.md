# Foreword — design

**Date:** 2026-08-23
**Status:** approved (approach questions answered by Aidan, this session)
**Depends on:** [`docs/clinical-scope-boundary.md`](../../clinical-scope-boundary.md) — step 1, already written. Every clinical rule referenced here lives there; this document never restates a clinical claim, it points at one.

## Goal

An AI intake agent that replaces a PT clinic's paper intake form with an adaptive
conversation, and hands the clinician a one-page briefing that is better than the
form — including the patient's words verbatim.

## Decisions taken

| Question | Answer | Consequence |
|---|---|---|
| Pilot path | **Synthetic-only until proven** | No real patient data, no BAA work yet, no clinic contact. Every persona is scripted. A real pilot is a separate, later decision gated on §6 of the boundary doc. |
| Design scope | **Three archetypes, deep** | Gym athlete (knee/shoulder), acute low back, post-surgical. Everything else routes to a competent generic path rather than a stub. |
| Intake length | **Adaptive, 10–14 turns, hard cap** | The agent stops when a turn stops teaching it something. Patient may end at any point and the note still ships with what exists. |

## Architecture

Four units, each independently testable, chosen so the clinical and legal rules
from step 1 are enforced by structure rather than by prompt discipline.

```
   patient phone                      serverless                     clinician
┌────────────────┐   turn+transcript  ┌──────────────┐   note      ┌──────────────┐
│  index.html    │ ─────────────────► │ interviewer  │ ──────────► │  note page   │
│  (no clinical  │ ◄───────────────── │  + detector  │             │  (one page)  │
│   output ever) │   next question    └──────┬───────┘             └──────────────┘
└────────────────┘                           │ fired flag
                                             ▼
                                      ┌──────────────┐
                                      │  escalation  │  fixed strings + clinic notify
                                      └──────────────┘
```

**1. `interviewer`** — decides the next question. Input: the transcript plus an
`IntakeState` (which clinical domains are covered, what is still unknown, the
archetype it has provisionally routed to). Output: one question, plus the updated
state. It is the only unit that talks to the patient.

**2. `detector`** — decides whether a red flag fired. Two independent paths over
every patient turn, OR-gated, per boundary doc §4.1:
- the model's structured output on that turn, and
- a deterministic scan against `clinical/red-flags.json`.
Either fires. Disagreement resolves to escalation. It never scores or combines
(§2). It returns the flag id and the patient's own words.

**3. `noter`** — renders the clinician briefing. One call at completion. Emits
structured JSON, rendered to one page.

**4. `sim`** — a scripted patient. A model given a hidden persona brief that
answers as that patient would, so an eight-persona run is repeatable and does not
require a human typing 112 turns. This is test infrastructure, not product, but
it is the only way step 5 of the session prompt is executable more than once.

### Transcript custody — a legal decision, not a technical one

**The transcript lives in the client during the intake and is posted with each
turn. Nothing is persisted server-side until the intake completes or a flag
fires.** An abandoned intake therefore leaves nothing at rest, which answers item
9 of the boundary doc's minimum-viable posture by construction rather than by
policy. The store is an interface with a local-file implementation now, so the
production implementation can be swapped without touching the units above.

### Stack

Node serverless functions plus one static HTML page. No framework, no build step,
no client-side dependencies — the same posture as the bricks platform, and it
keeps the patient page free of third-party requests, which the boundary doc §6
item 4 requires. `@anthropic-ai/sdk` is the only runtime dependency. Deployable
to Vercel when it is worth showing; local until then.

## The conversation (step 2 of the session prompt)

The domains an experienced DPT covers, which the `IntakeState` tracks as
covered / partial / unknown:

mechanism of injury · onset and duration · aggravating factors · easing factors ·
24-hour behaviour · pain quality and referral pattern · prior episodes · prior
imaging or surgery · goals and current functional loss · work and sport demands ·
irritability

**Adaptive means it diverges on evidence, not on a decision tree.** The two
worked examples from the session prompt are the acceptance test: a runner with
insidious anterior knee pain and a 58-year-old with acute low back pain after
lifting must be asking materially different questions **by turn three**. What
makes that happen is that the next question is chosen against *what is still
unknown and most informative for this presentation*, not against a fixed list.

Archetype routing is provisional and revisable — a "post-surgical" that turns out
to be new unrelated pain re-routes. Anything outside the three archetypes gets the
generic path, which asks the same eleven domains in a sensible default order. The
generic path must never announce itself as a fallback.

**Turn budget.** Soft target 10–14. Hard cap 16, after which it closes out
gracefully. A turn that adds nothing (patient answers "I don't know" twice on the
same domain) closes that domain rather than re-asking a third time.

## The note (step 3 of the session prompt)

One page, in this order:

1. **Flag banner** — only when a flag fired, at the very top.
2. **The presentation in one sentence.**
3. **Structured findings** — the eleven domains, blank where unestablished.
4. **In their words** — verbatim quotes, never paraphrased.
5. **What I could not establish** — explicit, not implied by absence.
6. **Impressions** — visibly fenced, clearly the agent's inference, never a
   diagnosis, uncertainty labelled.

**Two deliberate departures from the session prompt's ordering, both with a
reason:**
- The prompt puts flags last. A fired Tier A/B flag goes **first**. A DPT reading
  top-down must not learn about saddle anaesthesia in the final section.
- The prompt allows impressions; they sit **below the quotes that produced them**,
  because boundary doc §1 makes reviewability of the basis the thing that keeps
  the note inside 21 U.S.C. § 360j(o)(1)(E)(iii).

The note is written for a DPT with minutes. Target: readable in 90 seconds.

## Identifiers, and what the patient sees

Minimum viable identity: first name, last initial, and which appointment or
clinician the intake is for — enough that the DPT knows whose note this is,
nothing more. No date of birth, no insurance, no address; none of it improves the
briefing.

At the end the patient sees a **receipt**: their own answers, in their own words,
and a line saying a human will read it before their visit. They never see the
impressions block, and never any clinical content — boundary doc §1: no device
exclusion exists on the patient side.

## Error handling

- **Model call fails** — the patient sees a neutral retry, never a stack trace or
  an apology that implies clinical failure. Two retries, then it closes out and
  hands over whatever it has.
- **Detector fails open, always.** If the deterministic scan throws, the turn is
  treated as flagged rather than clean. Boundary doc §4.1 makes the asymmetry
  explicit; the code must encode it.
- **Escalation strings never interpolate model output.** They are constants; a
  failure to load them is a fatal error, not a fallback to generated text.
- **Abandoned intake** — nothing persisted, nothing to clean up.

## Testing

Two layers, because the memory of the coffee-shop bug applies exactly here:
synthetic-input unit tests cannot catch a bad conversation.

**Deterministic (TDD, unit):** register loads and validates; detector fires on
each of the 20 flags; detector fails open; escalation text is a constant and
carries no interpolation; turn cap holds; note renders with missing domains; note
never contains a condition name from a banned-terms list; patient receipt contains
no impressions.

**Live (persona runs, graded by reading):** the eight personas from the session
prompt — athlete, post-surgical, chronic low back, vague-and-unhelpful, anxious
over-explainer, three-words-per-turn, "so what do you think it is?" on repeat, and
one deliberately presenting a red flag. Each produces a note I read end to end.
The grading is qualitative and written down, not a pass/fail flag.

**The acceptance bar** (from the session prompt, made testable):
- the runner and the 58-year-old diverge by turn three;
- the red-flag persona stops the intake, gets the fixed string, and the clinic is
  notified;
- the "what do you think it is?" persona never receives a guess across five asks;
- every note contains verbatim quotes that survived unparaphrased;
- every note names what it could not establish;
- a DPT could read any note in 90 seconds.

## Out of scope

Scheduling, billing, insurance verification, EMR integration, patient portal,
real patient data, deployment to a public URL with a real clinic's name on it.
