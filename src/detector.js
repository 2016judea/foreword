// Boundary doc §4: two independent detectors, either fires. No scoring, no
// combining — one named report, one response. Ordering A > B > D > C so the
// response matches the most urgent thing reported.
const TIER_ORDER = ['A', 'B', 'D', 'C'];

// Patients type on phones. iOS smart punctuation turns can't into can’t
// (U+2019), and every "can'?t" term in the register would then never match.
// Normalise here, once, rather than in twenty patterns.
export function normalise(text) {
  return String(text ?? '')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function scan(text, register) {
  const hay = normalise(text);
  const hits = [];
  for (const flag of register.flags) {
    for (const pattern of flag.patterns ?? []) {
      if (pattern.all.every((term) => new RegExp(term, 'i').test(hay))) {
        hits.push({ id: flag.id, tier: flag.tier, via: 'scan', words: String(text ?? '').trim() });
        break; // one hit per flag; we report presence, never count
      }
    }
  }
  return hits;
}

export function detect({ text, register, modelFlags = [] }) {
  let hits = [];
  try {
    hits = scan(text, register);
    for (const id of modelFlags) {
      const flag = register.flags.find((f) => f.id === id);
      if (!flag) continue;
      if (hits.some((h) => h.id === id)) continue;
      hits.push({ id, tier: flag.tier, via: 'model', words: String(text ?? '').trim() });
    }
  } catch (err) {
    // FAIL OPEN. A bug must not read as "nothing reported". Tier B, not A: a
    // code fault should not dispatch an ambulance, but it must not be silent.
    return {
      fired: true,
      tier: 'B',
      hits: [{ id: 'detector_error', tier: 'B', via: 'error', words: String(text ?? '').trim(), error: err.message }],
    };
  }
  if (hits.length === 0) return { fired: false, tier: null, hits: [] };
  const tier = TIER_ORDER.find((t) => hits.some((h) => h.tier === t)) ?? null;
  return { fired: true, tier, hits };
}
