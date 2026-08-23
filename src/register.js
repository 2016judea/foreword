// The register is a CLINICAL artifact. Amending clinical/red-flags.json requires
// the sign-off named in docs/clinical-scope-boundary.md §8. This loader's job is
// to refuse to run on a register that has drifted out of that shape.
import { readFileSync } from 'node:fs';

const DEFAULT_PATH = new URL('../clinical/red-flags.json', import.meta.url);
const TIERS = ['A', 'B', 'C', 'D'];

export function loadRegister(path = DEFAULT_PATH) {
  const reg = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(reg.flags) || reg.flags.length === 0) {
    throw new Error('register: no flags');
  }
  const seen = new Set();
  for (const flag of reg.flags) {
    if (!flag.id) throw new Error('register: flag with no id');
    if (seen.has(flag.id)) throw new Error(`register: duplicate id ${flag.id}`);
    seen.add(flag.id);
    if (!TIERS.includes(flag.tier)) {
      throw new Error(`register: ${flag.id} has invalid tier ${flag.tier}`);
    }
    // Every clinical claim carries a citation — boundary doc, Rules.
    if (!flag.source) throw new Error(`register: ${flag.id} has no source`);
  }
  return reg;
}

export function flagsByTier(reg, tier) {
  return reg.flags.filter((f) => f.tier === tier);
}

export function stopsIntake(reg, tier) {
  const action = reg.tier_definitions?.[tier]?.action ?? '';
  return action.startsWith('stop');
}
