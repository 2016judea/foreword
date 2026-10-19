import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadRegister, flagsByTier, stopsIntake } from '../src/register.js';

test('loads every flag in the register', () => {
  const reg = loadRegister();
  assert.equal(reg.flags.length, 20);
  assert.equal(flagsByTier(reg, 'A').length, 4);
  assert.equal(flagsByTier(reg, 'B').length, 7);
  assert.equal(flagsByTier(reg, 'C').length, 8);
  assert.equal(flagsByTier(reg, 'D').length, 1);
});

test('tiers A, B and D stop the intake; C does not', () => {
  const reg = loadRegister();
  assert.equal(stopsIntake(reg, 'A'), true);
  assert.equal(stopsIntake(reg, 'B'), true);
  assert.equal(stopsIntake(reg, 'D'), true);
  assert.equal(stopsIntake(reg, 'C'), false);
});

test('rejects a flag with no citation', () => {
  assert.throws(
    () => loadRegister(new URL('./fixtures/no-source.json', import.meta.url)),
    /no source/,
  );
});

test('rejects an unknown tier', () => {
  assert.throws(
    () => loadRegister(new URL('./fixtures/bad-tier.json', import.meta.url)),
    /invalid tier/,
  );
});

test('every flag carries at least one detection pattern', () => {
  const reg = loadRegister();
  for (const flag of reg.flags) {
    assert.ok(Array.isArray(flag.patterns) && flag.patterns.length > 0, `${flag.id} has no patterns`);
    for (const p of flag.patterns) {
      assert.ok(Array.isArray(p.all) && p.all.length > 0, `${flag.id} has an empty pattern`);
      for (const term of p.all) new RegExp(term, 'i'); // throws on a bad regex
    }
  }
});

test('rejects a flag with no detection patterns', () => {
  assert.throws(
    () => loadRegister(new URL('./fixtures/no-patterns.json', import.meta.url)),
    /no patterns/,
  );
});

test('rejects a pattern that is not a valid regex', () => {
  assert.throws(
    () => loadRegister(new URL('./fixtures/bad-regex.json', import.meta.url)),
    /bad regex/,
  );
});
