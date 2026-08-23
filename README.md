# Foreword

**An AI intake agent for a physical therapy clinic. It does not diagnose.**

A new patient fills in a form: what hurts, where, how bad out of ten. The form is
the same for everyone, so it asks a marathon runner with insidious knee pain and a
58-year-old whose back went while lifting exactly the same questions, and it
learns nothing from either answer.

Foreword replaces that form with a conversation. It asks what an experienced DPT
would ask, it branches on what it hears, and it hands the clinician a one-page
briefing before the patient walks in — including the patient's own words, exactly
as they typed them. The name is the job: the patient is the author, and this
writes the foreword.

## What it is not

It is not a symptom checker. It never tells a patient what is wrong with them,
what to do about it, or that it is probably nothing.

That is not caution, it is the product thesis. The interesting move with AI in a
small business is not "chatbot that solves the customer's problem" — it is a thing
that sits out front and makes information-gathering better for the person who
*does* solve the problem. An agent that answers the patient is a worse version of
something that already exists. An agent that briefs the clinician is a thing that
doesn't.

It is also the law. In Minnesota, practising medicine includes offering to
*"diagnose, correct, or treat in any manner or by any means, methods, devices, or
instrumentalities, any disease, illness, pain…"* (Minn. Stat. § 147.081 subd. 3).
The word *devices* is in the statute. A chatbot that names your injury is inside
that sentence.

So the boundary runs down the middle of the product:

| | Patient side | Clinician side |
|---|---|---|
| Gathers what the patient reports | yes | — |
| Carries a clinical opinion | **never** | yes, fenced as an impression, with the quotes that produced it directly beneath |

Read **[docs/clinical-scope-boundary.md](docs/clinical-scope-boundary.md)** before
anything else in this repo. It is the design document: where the line is, why it
is there, what the agent does when a patient reports something serious, and what
HIPAA requires before a real patient ever sees it. Every clinical claim in it
carries a citation.

## Status

Step 1 of 5. The scope boundary is written; nothing is built. The red-flag
register at `clinical/red-flags.json` is **drafted from the literature and not yet
signed off by a clinician** — see §8 of the boundary doc. No real patient data has
touched anything, and none will until the BAAs in §6 exist.

## Licence

MIT for the code. The clinical content in `docs/` and `clinical/` is drafted from
cited public literature and is not clinical advice; it requires review by a
licensed clinician before use with patients.
