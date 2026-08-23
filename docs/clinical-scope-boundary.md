# The clinical scope boundary

**Status: written before any code, and not yet clinically signed off.**
This document is step 1 of the build. No patient — real or test — touches this
system until Eric, Mason or Lucas have read §8 and signed off on the register in
§3 and the scripts in §5. A red-flag list is a clinical artifact. I researched
and drafted it; a licensed clinician has to own it.

Grounded: 2026-08-23. Written for Maverick Physiotherapy, 155 Eaton St, Saint
Paul MN — a **direct-access** clinic, which is the fact that raises the stakes on
everything below.

---

## 0. The rule, in one paragraph

This agent replaces a paper intake form with a conversation. It gathers what the
patient reports and hands the clinician a better briefing than the form ever
produced. **It does not diagnose, does not advise treatment, does not reassure,
and does not triage.** It has exactly one clinical reflex: when a patient reports
something on the register in §3, it stops asking questions, says one of the fixed
sentences in §5, and tells the clinic. That is the entire clinical surface of the
product. Everything else is a transcript and a note.

## 1. This is a legal boundary, not a stylistic one

Four separate instruments draw the same line, and three of them have teeth in
Minnesota specifically.

**Practising medicine in Minnesota explicitly includes doing it with software.**
Minn. Stat. § 147.081 subd. 3 defines practising medicine as offering or
undertaking to *"diagnose, correct, or treat in any manner or by any means,
methods, **devices**, or instrumentalities, any disease, illness, pain, wound,
fracture, infirmity, deformity or defect"* [1]. Note the word *devices*, and note
*pain* sitting in the list of things you may not offer to correct. A chatbot that
tells a patient what is wrong with their knee is inside that sentence. Violation
is a gross misdemeanour. This is why the rule in §0 is absolute rather than
hedged — "it might be patellar tendinopathy, but see a professional" is not a
softer version of the offence, it is the offence with a disclaimer attached.

**The clinic itself cannot do what the agent must not do.** Minn. Stat. § 148.65
subd. 1 defines physical therapy as evaluation or treatment by physical measures
and states that it *"does not include the practice of medicine"* as defined in
§ 147.081 [2]. The agent stands in front of licensed DPTs who are themselves
outside the practice of medicine. It cannot have a wider clinical remit than the
clinicians it reports to. That single sentence resolves most edge cases: *if a
DPT could not lawfully say it, the agent cannot say it.*

**Direct access means there is no referring diagnosis to lean on.** Minn. Stat.
§ 148.76 permits treatment without a physician order for an initial 90-day
period, after which an order or referral is required, except for *"prevention,
wellness, education, or exercise"* [3]. Maverick runs direct access, so a real
share of intakes are the patient's genuine first contact with the healthcare
system for that complaint. Nobody upstream has ruled out the serious causes. A
symptom checker in front of a referral-only clinic is merely redundant; in front
of a direct-access clinic it is the last filter before someone with cauda equina
compression books a Thursday appointment. Hence the register in §3 exists, and
hence it fires on report rather than on inference.

**Federal device law draws the line between the two sides of this product.**
FD&C Act § 520(o)(1)(E) (21 U.S.C. § 360j(o)(1)(E)) excludes a software function
from the device definition where it is intended for *"displaying, analyzing, or
printing medical information about a patient"*, for *"supporting or providing
recommendations to a health care professional about prevention, diagnosis, or
treatment of a disease or condition"*, and for *"enabling such health care
professional to independently review the basis for such recommendations… so that
it is not the intent that such health care professional rely primarily on any of
such recommendations to make a clinical diagnosis or treatment decision"* [4].
Every clause of that exclusion is about a **health care professional**. FDA's CDS
guidance — the 2022 final version and the January 2026 revision alike — addresses
only HCP-facing CDS; as Covington's analysis of the revision puts it, *"FDA did
not announce any new or clarified policies for consumer-facing tools such as
patient decision support, health chatbots, or symptom checkers"* [5]. Consumer
symptom checkers get no exclusion; they are generally devices.

So the product's asymmetry is not a design preference, it is where the law puts
the wall:

| Surface | Audience | May it carry a clinical opinion? |
|---|---|---|
| The conversation | patient | **Never.** No exclusion exists on this side. |
| The clinician note | the DPT | Yes, fenced as an impression, **only if the DPT can independently review its basis.** |

**This is why verbatim patient language is a regulatory feature and not a nicety.**
The impressions block in the note is defensible precisely because the quotes that
produced it sit directly beneath it, so the DPT reviews the basis rather than
relying on the machine. Summarising the patient's words away doesn't just lose
clinical signal — it removes the thing that keeps the note inside § 520(o)(1)(E).

## 2. Intake, triage, diagnosis — the operative test

The distinction is not topic, it is **who assigns the meaning**.

| | The agent | Why |
|---|---|---|
| **Intake** — records what the patient reports, in their words, and asks a further question because of it | **Yes.** This is the product. | Recording a report is not a clinical act. A paper form does it. |
| **Triage** — ranks urgency, likelihood, or who should be seen first | **No.** | Assigning urgency is clinical reasoning. The one exception is §3: a fixed, pre-authorised stop on a named report — not a judgement of urgency. |
| **Diagnosis** — names or ranks a cause | **No.** | § 147.081 subd. 3 [1]. |
| **Advice** — what to do, take, stretch, rest, ice, or avoid | **No.** | Also § 147.081 subd. 3 ("correct, or treat… any pain") [1]. Includes *reassurance*: "that sounds like nothing serious" is a clinical judgement wearing a friendly voice. |

The literature forces the same conclusion from the other direction. The IFOMPT
international framework's own definition is that *"Red flags are clinical
prediction guides—they are not diagnostic tests, and they are not necessarily
predictors of diagnosis or prognosis. The main role of red flags is that, when
combined, they help to raise the clinician's index of suspicion"*, and it states
plainly that *"Few red flags, when used in isolation, are informative"* [6].

Read that carefully, because it kills the obvious feature. The value in red flags
lives in **combining** them into an index of suspicion — and combining them *is*
the clinical reasoning act, performed by the clinician, on evidence the framework
itself grades as low. Therefore:

> **Rule: the agent never combines. It reports presence.**
> No scoring, no risk tier computed from multiple items, no "3 of 5 flags
> present, moderate concern." One named item, reported by the patient, fires one
> fixed response. The combining happens in the DPT's head, which is the only
> place it is both lawful and evidenced.

This also means the agent is not a screening instrument and we must never
describe it as one. It has no sensitivity or specificity because it makes no
determination. It is a form that knows when to stop being a form.

## 3. The register — what stops the intake

Tiers use the framework's own referral vocabulary: **emergency** = *"as a guide,
on the same day"*; **urgent** = *"as a guide, within 5 days"* [6].

Every trigger below is written as *what the patient reports*, because that is all
the agent can act on. Nothing here requires the agent to examine, measure,
interpret or weigh.

### Tier A — stop, 911 or emergency department now

| Trigger, as reported | Source |
|---|---|
| Chest discomfort lasting more than a few minutes, or coming and going; discomfort in one or both arms, back, shoulders, neck, jaw or upper stomach; shortness of breath; cold sweat, nausea, lightheadedness | MedlinePlus/NIH heart attack: *"Call 911 if you or someone else is having them. You should call, even if you are not sure that it is a heart attack"* [7] |
| Sudden numbness or weakness of face, arm or leg (especially one side); sudden confusion or trouble speaking; sudden trouble seeing; sudden difficulty walking, dizziness or loss of balance; sudden severe headache with no known cause | MedlinePlus/NIH stroke: *"call 911 right away. Every minute counts"* [8] |
| Neck or head pain **with** any of: unsteadiness or ataxia, slurred or disturbed speech, difficulty swallowing, facial droop, drooping eyelid, double vision or visual disturbance, facial numbness, nausea and vomiting, loss of consciousness | IFOMPT Cervical Framework — these are the reported signs of vertebrobasilar and internal carotid dissection (unsteadiness/ataxia 67%, dysphasia/dysarthria/aphasia 44%, limb weakness 41%/33%, dysphagia 26%, nausea/vomiting 26%, facial palsy 22%, dizziness 20%, ptosis 19%, LOC 15%) [9] |
| Sudden shortness of breath or chest pain with calf pain or swelling | VTE CPG — PE is the emergency end of the DVT presentation [10] |

Note on the cervical row: the framework is explicit that its percentages *"are
not intended to inform any judgement on relative risk"* [9]. We do not use them
to weigh. They are used only to decide **which reported items belong on the
list** — the weighing is exactly what §2 forbids.

### Tier B — stop, contact the clinic today (emergency = same day)

| Trigger, as reported | Source |
|---|---|
| New numbness in the buttocks, inner thighs or genitals ("saddle"), including loss of normal sensation when wiping after toileting | IFOMPT CES cue card: *"Reduced saddle sensation (subjective or objective pinprick)"* [6] |
| New difficulty passing urine, incomplete emptying, hesitancy, not feeling the bladder fill, or incontinence | *"Bladder disturbance"*; *"Incomplete bladder emptying, urinary hesitancy, incontinence, nocturia"* [6] |
| New bowel incontinence or inability to control the bowels | *"Bowel disturbance"* [6] |
| New sexual dysfunction (change in ability to achieve an erection or ejaculate) alongside back or leg symptoms | *"Sexual disturbance"* [6] |
| Leg pain that began on one side and is now both sides, or alternates sides, with new weakness | *"Presentations that increase the probability of acute threatened CES: … Unilateral onset progressing to bilateral leg pain; Alternating leg pain; Presence of new motor weakness"* [6] |
| Leg weakness that is getting worse, or new trouble walking | *"Abnormal and progressing neurological deficit"* [6] |
| Calf or leg pain with swelling, warmth, redness or discoloration | VTE CPG key action statement: *"When a patient presents with pain, tenderness, swelling, warmth and/or discoloration in the lower extremity, establish the likelihood of a LE DVT and take appropriate action"* — and note the guideline's own caution that such signs *"should raise suspicion of LE DVT but are insufficient for diagnosis"* [10] |

The DVT row is the cleanest illustration of the whole architecture. The guideline
tells the *therapist* to establish likelihood using a validated instrument (Wells
criteria) [10]. The agent does not touch that instrument. It reports the four
words the patient said and gets a DPT looking at it the same day.

### Tier C — finish the intake, flag it at the top of the note (urgent ≤ 5 days)

These do not warrant sending someone to an emergency department, and stopping an
intake on them would produce alarm out of proportion to the finding. They belong
in front of a DPT quickly. **This tier's "finish, don't stop" behaviour is the
main clinical judgement call in this document and is explicitly listed for
sign-off in §8.**

| Trigger, as reported | Source |
|---|---|
| History of cancer, with new spinal pain — particularly thoracic | IFOMPT malignancy: ~25% of people with metastatic spinal cord compression have no known primary; 70% of metastases occur in the thoracic spine [6] |
| Night pain where they cannot get back to sleep — walking the floors, sitting in a chair, lying on the floor with minimal relief | *"People who report having to walk the floors or sit in a chair or lie on the floor, with minimal relief"* — distinguished in the framework from ordinary back pain that eases on position change [6] |
| Unexplained weight loss, or feeling systemically unwell — fatigue, nausea, loss of appetite | *"Systemically unwell"* [6] |
| Band-like pain around the trunk | *"Band-like pain should be considered a concern and may indicate MSCC"* [6] |
| Fever or chills with spinal pain | Infection: *"The classic triad of clinical features comprises back pain, fever, and neurological dysfunction"*, with the caution that *"Absence of fever cannot rule out"* infection — absent in ~50% [6] |
| Known immunosuppression (diabetes, HIV, rheumatoid arthritis, long-term steroids, heavy alcohol use), recent infection, recent spinal or abdominal surgery, or intravenous drug use, with new spinal pain | Infection risk factors [6] |
| Known osteoporosis, previous fragility fracture, or steroid tablets/inhalers taken over months, with new spinal pain | Fracture: *"Steroid use of 7.5 mg for >3 mo increases the risk of osteoporosis"*; previous osteoporotic fracture carries a 5.4-fold increased vertebral fracture risk [6] |
| Recent fall, trauma or lifting event followed by pain unlike their usual pain | Fracture: *"Describes pain that is unfamiliar and possibly worsening"*; 70% of non-traumatic spinal fractures are thoracic [6] |

### Tier D — crisis, non-musculoskeletal

| Trigger, as reported | Response |
|---|---|
| Anything indicating thoughts of suicide or self-harm | Stop. Give the 988 Suicide & Crisis Lifeline — *"Call or Text 988"* [11] — and notify the clinic. Do not counsel, do not ask assessment questions, do not continue the intake. |

An intake conversation about chronic pain will occasionally meet this. Pretending
otherwise is how a product ships with a hole in it. The agent has no business
assessing risk here; it has business knowing the number.

### What is deliberately *not* on the register

Everything the DPT is better placed to catch on the day and the patient cannot
self-report: reflex changes, myotome or dermatome mapping, anal tone, gait
observation, blood pressure, pulses, thermometer readings. The framework's own
sign tables require examination *"by a suitably trained clinician"* [6]. The
agent asks, it does not test. If a trigger cannot be phrased as a sentence a
patient would say about themselves, it does not belong in this system.

## 4. How a flag fires

1. **Two independent detectors, either of which fires: the model and a
   deterministic scan.** The model flags in structured output; a plain rules pass
   over the transcript looks for the register's own vocabulary. Disagreement
   resolves to escalation, always. *Why: a missed Tier A is unbounded harm; a
   false Tier A costs one phone call and some embarrassment. These are not
   symmetric, so the system must not be tuned as if they were.*
2. **Any single item fires. No thresholds, no scoring, no combining.** Per §2 and
   [6].
3. **A fired flag ends the intake.** It does not "collect a bit more first."
   *Why: continuing to ask questions after a Tier A/B report is the machine
   deciding the report can wait, which is precisely the clinical judgement it is
   not allowed to make.*
4. **The escalation text is a constant, not a generation.** Fixed strings from
   §5, signed off by the clinic, interpolated with nothing. *Why: the one moment
   the agent speaks about something serious is the one moment a language model
   must not be improvising. A generated escalation is where "you should probably
   get that looked at, it's likely just a disc" comes from.*
5. **No silent close.** A Tier A/B/D flag notifies the clinic on a channel the
   clinic actually watches, in addition to writing the note. *Why: a patient told
   to go to an ED by a web page, with nobody at the clinic aware it happened, is
   worse than no agent — the clinic has lost the ability to follow up on a
   presentation it now has a record of.*
6. **The flag records the patient's own words, not the register's label.** The
   note says what they typed; the label is metadata. *Why: § 520(o)(1)(E)(iii) —
   the DPT reviews the basis, not our classification of it [4].*
7. **Never retracted, never downgraded.** Once fired, a flag is in the note even
   if the patient walks it back a turn later ("actually maybe it's fine"). *Why:
   patients minimise, and the DPT should see both statements.*

## 5. What the agent says

House voice: their reviews say *"the vibe is encouraging, not intimidating."*
That is the register these have to hold — calm, brief, specific, no alarm words,
no reassurance. Each is a constant; the clinic edits the wording and owns it.

**Tier A:**
> Thank you for telling me that. I'm going to stop here, because what you've
> described needs someone to look at it right now, today — not at an appointment.
> Please call 911 or go to your nearest emergency department. I've let the clinic
> know we spoke. Nothing you've typed is lost.

**Tier B:**
> Thanks — I want to stop the questions here. What you've described is something
> Eric, Mason or Lucas need to hear about today rather than at a scheduled visit.
> Please call the clinic now at [number]; I've also flagged this conversation for
> them. If you can't reach anyone, go to urgent care or an emergency department
> today.

**Tier D:**
> I'm glad you told me. I'm not the right thing to talk to about this, but people
> are — you can call or text 988 any time, and someone will pick up. I'm going to
> stop our intake here and let the clinic know you reached out.

**"So what do you think it is?"** — asked once, asked five times, asked angrily.
It never gets a guess and it never gets testy. Three variants, then hold:

> 1. I genuinely can't tell you — I'm not able to say what's causing this, and
>    I'd be guessing. What I can do is make sure Eric, Mason or Lucas walk in
>    already knowing your story, so you're not spending your first appointment
>    repeating it.
> 2. Still not something I can answer, and I'd rather be straight with you than
>    make something up. That's a question for the person who can actually examine
>    you. Can I ask you two more things so they're ready for you?
> 3. I know it's frustrating not to get an answer. I'm the intake, not the
>    diagnosis. Everything you've told me goes to them before you arrive.

**Forbidden constructions, at any tier.** No condition names, ever, even the
patient's own ("your sciatica" → "the pain you described"). No probability,
likelihood, or severity language. No "it's probably", "that sounds like",
"nothing to worry about", "good news". No treatment, exercise, position, ice,
heat, rest, or medication suggestion. No prognosis or timeline. No urgency
judgement other than the fixed tier strings above. No "you don't need to worry
about X" — that is a differential ruled out.

**One honest tension, named rather than hidden.** Telling someone to call 911 is
an action instruction, and an action instruction is arguably triage. It stays in
for three reasons: it is what a trained front-desk person is expected to do, it
is pre-authorised in writing by the clinic rather than composed by the model, and
the alternative — a machine that has just been told about saddle anaesthesia and
responds by asking about aggravating factors — is indefensible. This is the one
place the product accepts the smaller wrong to avoid the larger one, and it is
worth the clinic knowing that is a deliberate decision.

## 6. HIPAA, the BAA, and Minnesota's stricter rule — the finding

You asked for the honest answer rather than a design that routes around it. Here
it is.

**The clinic is a covered entity, and this content is PHI.** 45 C.F.R. § 160.103
defines individually identifiable health information as information *"created or
received by"* a covered entity that relates to a person's past, present or future
health and that identifies them or could reasonably be used to identify them;
PHI is that information transmitted or maintained in any medium [12]. An intake
conversation about what hurts, attached to a name, phone number or email, is
squarely inside that definition. It does not matter that they are not yet a
patient of record.

**We would be a business associate, and Anthropic would be our subcontractor.**
A business associate is a person who, on behalf of a covered entity, *"creates,
receives, maintains, or transmits protected health information"*, and the same
section pulls in *"a person to whom a business associate delegates a function,
activity, or service"* [12]. § 164.502(e)(1)(i) permits the clinic to let us hold
PHI *"if the covered entity obtains satisfactory assurance"* that we will
safeguard it; § 164.502(e)(1)(ii) applies the same requirement from us down to
our subcontractors; and § 164.502(e)(2) requires those assurances be *"documented
through a written contract"* [13]. Two agreements, in writing, in both
directions. There is no volume threshold, no pilot exemption, and no "it's only
a test" carve-out.

**Anthropic will sign a BAA, but not for everything, and not at every tier.** Per
Anthropic's own privacy centre: the BAA covers the Anthropic API and Claude
Enterprise; it does **not** cover Claude Console, Cowork, or beta features, and
covered models *"require 30-day data retention and aren't available with zero
data retention (ZDR) enabled"*; you sign it via your Anthropic contact or sales
[14]. The alternative path is Bedrock or Vertex, where the hyperscaler's BAA
covers the inference leg.

Two consequences worth flagging before you decide anything:
- **The retention condition is counter-intuitive and needs saying out loud.** The
  BAA-covered configuration requires 30-day retention; ZDR is *not* the compliant
  option. If instinct says "turn off retention and we're safer," the instinct is
  backwards.
- **Nothing I have built or tested with so far would be covered.** Console and
  Workbench are explicitly outside it. Every prototype turn runs on synthetic
  patients only, and that is now a rule in this repo, not a habit.

**Minnesota is stricter than HIPAA and this is the part people miss.** Minn.
Stat. § 144.293 subd. 2 provides that a provider *"may not release a patient's
health records to a person without"* a signed and dated consent, specific
statutory authorisation, or a representation from a provider holding such consent
[15]. Minnesota is a consent state, not a notice state. The note flowing from us
to the clinic is fine — we act on their behalf as their business associate — but
anything sideways is not: no analytics vendor on the patient page, no third-party
font or CDN request from a page carrying an intake, no transcripts into a shared
drive, no me reading real conversations for quality, no model training. Consent
under subd. 4 is generally valid for one year [15].

### The finding, plainly

**A pilot with real Maverick patients needs a signed BAA with the clinic and a
signed BAA with Anthropic (or Bedrock/Vertex) before the first conversation.
There is no lawful shortcut and I am not going to build one.**

### What I recommend, and what I need from you

**Recommendation: build and prove the whole thing on synthetic patients first,
and only start the paperwork once the conversation is worth the paperwork.**
Nothing about the hard part of this product — does the branching actually beat a
PDF, is the clinician note readable in ninety seconds — requires a single real
patient. Eight synthetic intakes (step 5 of your prompt) need no BAA at all. If
the conversation turns out mediocre, you have spent no legal effort discovering
it; if it turns out good, you walk into the clinic with a working thing and the
BAA is a formality rather than a bet.

The runner-up, named as such: pursue the BAAs now in parallel, so a good demo can
go live the same week. It's the faster path to a real pilot and it spends effort
on paperwork for a product that hasn't proven itself yet.

**Your call, and it is genuinely yours** — the sequencing question is a business
one, not a technical one:
1. Synthetic-only until the conversation is proven, then paperwork. *(recommended)*
2. Start both now.
3. Something else — e.g. approach Eric/Mason/Lucas with the boundary doc first
   and let their appetite set the pace.

### Minimum-viable posture for a real pilot, once BAAs exist

Ten items, each because of a specific failure mode:
1. BAA with the clinic; BAA with Anthropic or the cloud provider. *(§ 164.502(e))*
2. No PHI in application logs, error traces, or analytics. Log a session id, never a field value.
3. TLS in transit; encryption at rest; a named retention window with automatic deletion.
4. Zero third-party requests from the patient page — no CDN, no Google Fonts, no pixel. *A page carrying an intake must not phone anyone.*
5. Named access control: who at the clinic can read notes, and nobody else.
6. A written breach notification path before there is anything to notify about.
7. No transcript used for prompt iteration or evaluation without either consent or de-identification.
8. A plain-language notice on the patient page: what this is, that it is not a diagnosis, where their words go, and that a human reads them.
9. An abandonment rule: a half-finished intake is still PHI. Decide its fate deliberately, don't let it rot in a table.
10. The clinic — not us — owns the record. We are custodians on their behalf.

## 7. What this means for the build

Falling straight out of the above, before any code is written:
- The patient page carries no clinical output. Not even a summary back to them.
  (§1: no exclusion exists on the patient side.)
- The register is data, not prose in a prompt — see `clinical/red-flags.json` —
  so the deterministic detector and the model read the same list, and a clinician
  can amend it without touching a prompt.
- Verbatim quotes are structurally required in the note, not encouraged. (§1.)
- The impressions block sits *below* the quotes that produced it, never above.
  (§ 520(o)(1)(E)(iii): the basis must be reviewable [4].)
- Escalation strings live in a constants file with a clinician sign-off comment,
  never interpolated by the model. (§4.4.)
- Every synthetic-patient run stays synthetic until §6 is resolved.

## 8. Clinician sign-off — the questions for Eric, Mason and Lucas

I drafted this from the published literature. They practise here, and these are
the calls I am not qualified to make:

1. **Is Tier C right to let the intake finish?** It is the one place this
   document chooses "flag it prominently" over "stop everything." A cancer
   history with new thoracic pain is a real finding; is a completed intake with a
   flag at the top the right handling, or should it stop like Tier B?
2. **Does anything belong on the register that isn't there?** The spinal
   framework, the cervical framework and the VTE guideline cover the spine, neck
   and legs. Shoulder, hip and post-operative presentations are not represented,
   and Maverick sees post-surgical patients.
3. **Gym population.** Los Campeones members present with acute lifting injuries
   and return-to-sport questions. Is there a red flag specific to that group —
   exertional chest symptoms in a young athlete, suspected fracture after a drop
   — worth naming explicitly?
4. **Work hardening / workers' comp intakes.** Do they carry any obligation the
   register should reflect, and does an injured worker's intake need to say
   anything different?
5. **Escalation route.** For Tier B, what is the actual instruction — a specific
   phone number, a same-day slot, urgent care? And what channel do they want the
   notification on: text, email, something else?
6. **The wording in §5.** Read as a patient. Does it sound like the clinic?
7. **Who signs?** One of them should be named in this repo as the clinician of
   record for the register, with a date.

---

## Sources

Every clinical claim above traces to one of these. Verified by reading the
source, not from memory.

1. Minn. Stat. § 147.081 subd. 3 — practising medicine without a license.
   https://www.revisor.mn.gov/statutes/cite/147.081
2. Minn. Stat. § 148.65 subd. 1 — definition of physical therapy.
   https://www.revisor.mn.gov/statutes/cite/148.65
3. Minn. Stat. § 148.76 — prohibited conduct; the 90-day direct-access limit.
   https://www.revisor.mn.gov/statutes/cite/148.76
4. 21 U.S.C. § 360j(o)(1)(E) — FD&C Act § 520(o), software functions excluded
   from the device definition.
   https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title21-section360j
5. Covington & Burling, "5 Key Takeaways from FDA's Revised Clinical Decision
   Support (CDS) Software Guidance", January 2026.
   https://www.cov.com/en/news-and-insights/insights/2026/01/5-key-takeaways-from-fdas-revised-clinical-decision-support-cds-software-guidance
   *Secondary source, used only for the guidance's date and scope. FDA's own
   guidance page and federalregister.gov both refused requests from this machine;
   the statutory text in [4] is the primary authority and was read directly.*
6. Finucane LM, Downie A, Mercer C, Greenhalgh SM, Boissonnault WG,
   Pool-Goudzwaard AL, Beneciuk JM, Leech RL, Selfe J. "International Framework
   for Red Flags for Potential Serious Spinal Pathologies." *J Orthop Sports Phys
   Ther.* 2020;50(7):350-372. doi:10.2519/jospt.2020.9971.
   https://www.jospt.org/doi/10.2519/jospt.2020.9971 — full text read via
   https://i.clinref.com/data/uploads/International-Framework-on-Spinal-Red-Flags-JOSPT.2020.9971.pdf
   *Every Tier B and Tier C item, the referral timeframes, and the definitions of
   red flag / index of suspicion / safety netting come from here.*
7. MedlinePlus (NIH), "Heart Attack". https://medlineplus.gov/heartattack.html
8. MedlinePlus (NIH), "Stroke". https://medlineplus.gov/stroke.html
9. Rushton A, Carlesso LC, Flynn T, Hing WA, Kerry R, Rubinstein SM, Vogel S.
   "International Framework for Examination of the Cervical Region for Potential
   of Vascular Pathologies of the Neck Prior to Musculoskeletal Intervention."
   IFOMPT, September 2020.
   https://www.ifompt.org/site/ifompt/IFOMPT%20Cervical%20Framework%20final%20September%202020.pdf
10. Hillegass E, Lukaszewicz K, Puthoff M. "Role of Physical Therapists in the
    Management of Individuals at Risk for or Diagnosed With Venous
    Thromboembolism: Evidence-Based Clinical Practice Guideline 2022." *Phys
    Ther.* 2022;102:pzac057. doi:10.1093/ptj/pzac057.
    https://www.aptacvp.org/assets/docs/CPG/vtemay2022.pdf
11. SAMHSA, 988 Suicide & Crisis Lifeline. https://www.samhsa.gov/find-help/988
12. 45 C.F.R. § 160.103 — definitions of business associate, individually
    identifiable health information, protected health information.
    https://www.law.cornell.edu/cfr/text/45/160.103
13. 45 C.F.R. § 164.502(e) — disclosures to business associates; satisfactory
    assurances; documentation.
    https://www.law.cornell.edu/cfr/text/45/164.502
14. Anthropic, "Business Associate Agreements (BAA) for Commercial Customers."
    https://privacy.claude.com/en/articles/8114513-business-associate-agreements-baa-for-commercial-customers
15. Minn. Stat. § 144.293 — release of health records; patient consent
    (Minnesota Health Records Act). https://www.revisor.mn.gov/statutes/cite/144.293

**Sourcing honesty note.** hhs.gov, fda.gov, federalregister.gov, heart.org and
cdc.gov all refused requests from this machine, so where those bodies are the
authority I went to the underlying statute or regulation (uscode.house.gov,
Cornell LII, revisor.mn.gov) or to an NIH consumer-health page, and read it. The
one secondary citation is [5], and it is used only for a date and a scope
statement. Nothing clinical in this document rests on a paraphrase.
