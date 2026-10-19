import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRegister } from '../src/register.js';
import { scan, detect } from '../src/detector.js';

const reg = loadRegister();

// One sentence a patient would actually type, per flag. A flag whose patterns
// cannot fire on its own sentence is a flag that can never match — a silent gap
// in the register, not a strict detector.
const SAYS = {
  cardiac_pattern: 'my chest feels tight and heavy and it keeps coming back',
  stroke_pattern: 'sudden numbness down my left arm this morning',
  cervical_vascular: 'neck pain and my speech has gone slurred',
  pulmonary_embolism: "i'm short of breath and my calf is swollen",
  ces_saddle_sensory: "i can't feel anything when i wipe after the toilet",
  ces_bladder: "i'm having trouble passing urine since yesterday",
  ces_bowel: "i had a bowel accident and couldn't control it",
  ces_sexual: "i can't get an erection since the back pain started",
  ces_bilateral_progression: 'the pain started in one leg and now both legs are weak',
  progressive_neuro_deficit: 'my leg weakness is getting worse every day',
  lower_extremity_dvt: 'my calf is swollen, warm and red',
  cancer_history_spinal_pain: 'i had cancer in 2019 and now my mid back hurts',
  night_pain_unrelieved: "at night i can't get back to sleep whatever i do",
  systemically_unwell: "i've lost a lot of weight without trying",
  band_like_pain: 'it feels like a band around my chest',
  fever_with_spinal_pain: 'i have a fever and my back is sore',
  infection_risk_context: 'i am on long term steroids for rheumatoid arthritis',
  fracture_risk_context: 'i have osteoporosis and my back went when i lifted the washing',
  unfamiliar_pain_after_trauma: 'i fell off a ladder last week and the pain is not like my usual pain',
  self_harm: "i don't want to be here any more",
};

test('every flag fires on a sentence a patient would say', () => {
  for (const flag of reg.flags) {
    assert.ok(SAYS[flag.id], `no sentence for ${flag.id}`);
    const ids = scan(SAYS[flag.id], reg).map((h) => h.id);
    assert.ok(ids.includes(flag.id), `${flag.id} did not fire on: ${SAYS[flag.id]} (fired: ${ids})`);
  }
});

test('scan fires on saddle numbness in the patient\'s own phrasing', () => {
  const hits = scan("i can't feel anything when i wipe after the toilet", reg);
  assert.equal(hits.length >= 1, true);
  assert.equal(hits[0].id, 'ces_saddle_sensory');
  assert.equal(hits[0].tier, 'B');
});

test('iOS smart apostrophes (can’t) match the register\'s can\'?t terms', () => {
  const hits = scan('i can’t feel anything when i wipe after the toilet', reg);
  assert.equal(hits.map((h) => h.id).includes('ces_saddle_sensory'), true);
  const bladder = scan('i can’t pee properly since this started', reg);
  assert.equal(bladder.map((h) => h.id).includes('ces_bladder'), true);
});

test('scan does not fire on ordinary musculoskeletal language', () => {
  const benign = [
    'my knee hurts when i run downhill',
    'it aches after sitting at my desk all day',
    'i felt a pop in my shoulder at the gym',
    'the pain is a 6 out of 10 and it eases when i walk',
    'i had a cortisone injection in my knee in march',
    'the physio said my archive of old scans was fine',
    "i've had trouble all week with my hip",
    'i have trouble during the night turning over',
    'my leg is tired and sore after work',
    'i had an accident at the pool last summer',
    'my husband drove me here because my ribs are bruised',
  ];
  for (const text of benign) {
    assert.deepEqual(scan(text, reg), [], `false positive on: ${text}`);
  }
});

test('the patient\'s own words are carried on the hit, not the register label', () => {
  const words = 'i had cancer in 2019 and now my mid back hurts';
  const [hit] = scan(words, reg);
  assert.equal(hit.words, words);
});

test('detect ORs the model path with the scan path', () => {
  const out = detect({ text: 'nothing notable here', register: reg, modelFlags: ['ces_bowel'] });
  assert.equal(out.fired, true);
  assert.equal(out.hits[0].id, 'ces_bowel');
  assert.equal(out.hits[0].via, 'model');
});

test('detect FAILS OPEN — a broken scan escalates rather than passing clean', () => {
  const broken = { flags: null, tier_definitions: {} };
  const out = detect({ text: 'anything', register: broken });
  assert.equal(out.fired, true);
  assert.equal(out.hits[0].id, 'detector_error');
  assert.equal(out.hits[0].tier, 'B');
});

test('the highest tier present wins for the response', () => {
  const out = detect({ text: 'my chest feels tight', register: reg, modelFlags: ['fever_with_spinal_pain'] });
  assert.equal(out.tier, 'A');
});

test('an empty or null turn fires nothing and does not throw', () => {
  assert.deepEqual(scan('', reg), []);
  assert.deepEqual(scan(null, reg), []);
  assert.equal(detect({ text: undefined, register: reg }).fired, false);
});
