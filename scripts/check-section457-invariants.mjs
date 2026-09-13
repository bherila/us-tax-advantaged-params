#!/usr/bin/env node
/** Structural characterization tests, independent of agreement between runtimes.
 * 26 CFR 1.457-4(a), (c)(1)(i) and (c)(3)(i) scope deferrals and ceilings to
 * one plan; 1.457-5(b) aggregates across a participant's plans. Splitting a
 * record cannot create capacity, and a different participant cannot spend it.
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import U from '../dist/esm/USTaxAdvantagedParams.js';

const cases = [];
const person = (id) => ({ id, birthYear: 1990, compensation: { w2Compensation: 100000 } });
const record = (id, ownerId, group, compensation, existing = 0, priority = 0) => ({
  id, ownerId, type: 'governmental_457b', employerId: 'employer', priority,
  planRules: { section457PlanGroupId: group, includibleCompensation457: compensation },
  existingContributions: { employeePreTaxDeferral: existing },
});
const scenario = (accounts, persons = [person('participant')]) => ({
  taxYear: 2026, filingStatus: 'S', persons, accounts,
});
const total = (result) => result.accounts.reduce((sum, row) =>
  sum + Object.values(row.contributionComponents).reduce((a, b) => a + b, 0), 0);
const row = (result, id) => result.accounts.find((entry) => entry.accountId === id);
const amount = (result, id, component = 'employeePreTaxDeferral') => row(result, id).contributionComponents[component];
const add = (name, input, check) => cases.push({ name, input, check });

// Synthetic compensation is below the 2026 $24,500 dollar amount (Notice
// 2025-67): min(24,500, 1,200) = 1,200 for the plan, however it is partitioned.
for (const count of [1, 2, 3, 6]) {
  for (const existing of [0, 600, 1200]) {
    add(`split ${count} records with ${existing} already contributed`, scenario(
      Array.from({ length: count }, (_, i) => record(`r${i}`, 'participant', 'plan', 1200, existing / count)),
    ), (result) => {
      assert.equal(total(result), 1200);
      for (const entry of result.accounts) assert.equal(entry.status, 'determinate');
      assert.equal(amount(result, 'r0'), 1200 - existing + existing / count);
      for (let i = 1; i < count; i++) assert.equal(amount(result, `r${i}`), existing / count);
    });
  }
}

// Group initialization must not regroup allocation. The outside plan, first in
// priority (or input order on a tie), takes 24,000 of the owner's 24,500. Only
// 500 remains for the two records of the other plan, despite their shared 1,200.
for (const tied of [false, true]) {
  const a = record('a', 'participant', 'group', 1200, 0, tied ? 0 : 2);
  const b = record('b', 'participant', 'group', 1200, 0, tied ? 0 : 3);
  const outside = record('outside', 'participant', 'outside', 24000, 0, 0);
  add(`global ${tied ? 'input' : 'priority'} order survives grouping`,
    scenario(tied ? [outside, a, b] : [a, b, outside]), (result) => {
      assert.equal(amount(result, 'outside'), 24000);
      assert.equal(amount(result, 'a'), 500);
      assert.equal(amount(result, 'b'), 0);
      assert.equal(total(result), 24500);
    });
}

add('same group identifier across owners is isolated', scenario([
  record('a', 'participant', 'same', 1200), record('b', 'other', 'same', 1800),
], [person('participant'), person('other')]), (result) => {
  assert.equal(amount(result, 'a'), 1200);
  assert.equal(amount(result, 'b'), 1800);
});

// IRC 457(b)(3): B=10,000, D=24,500, U=5,000 gives min(2D-B,U)=5,000
// special headroom. Employer deposits spend B but no salary (457(e)(5),
// 415(c)(3)(D)); employee deferrals spend both. Compare supplied deposits with
// newly allocated deposits and a replay of the completed allocation.
for (const employer of [false, true]) {
  for (const seeded of [false, true]) {
    const host = record('host', 'participant', 'plan', 10000);
    host.planRules.section457SpecialCatchUp = { eligible: true, unusedDeferralsFromPriorYears: 5000 };
    if (employer) {
      if (seeded) host.existingContributions = { employerPreTax: 10000 };
      else host.planRules.expectedEmployerContribution = 10000;
    } else if (seeded) host.existingContributions.employeePreTaxDeferral = 10000;
    const sibling = record('sibling', 'participant', 'plan', 10000, 0, 1);
    add(`${employer ? 'employer' : 'employee'} ${seeded ? 'existing' : 'new'} uses the same resources`,
      scenario([host, sibling]), (result) => {
        assert.equal(total(result), employer ? 15000 : 10000);
        assert.equal(amount(result, 'host', 'special457CatchUp'), employer ? 5000 : 0);
        assert.equal(amount(result, 'sibling', 'special457CatchUp'), 0);
        assert.equal(amount(result, 'host', employer ? 'employerPreTax' : 'employeePreTaxDeferral'), 10000);
      });
  }
}

// Existing special salary reduces every sibling's ordinary salary capacity,
// regardless of how the supplied amount is partitioned (457(e)(5)).
for (const count of [1, 2, 4]) {
  for (const special of [2500, 5000]) {
    const accounts = Array.from({ length: count }, (_, i) => {
      const account = record(`seed${i}`, 'participant', 'salary', 10000, 0, 1);
      account.existingContributions = { special457CatchUp: special / count };
      account.planRules.section457SpecialCatchUp = { eligible: true, unusedDeferralsFromPriorYears: 5000 };
      return account;
    });
    accounts.unshift(record('sibling', 'participant', 'salary', 10000, 0, 0));
    add(`special salary ${special} split into ${count} records`, scenario(accounts), (result) => {
      assert.equal(total(result), 10000);
      assert.equal(amount(result, 'sibling'), 10000 - special);
    });
  }
}
// The full 20,000+5,000 plan ceiling includes ordinary employer overages;
// splitting 21,000 of deposits never restores the whole special increment.
for (const count of [1, 2, 3]) {
  const accounts = Array.from({ length: count }, (_, i) => {
    const account = record(`deposit${i}`, 'participant', 'combined', 20000, 0, 1);
    account.existingContributions = { employerPreTax: 21000 / count };
    account.planRules.section457SpecialCatchUp = { eligible: true, unusedDeferralsFromPriorYears: 5000 };
    return account;
  });
  add(`ordinary overage on all ${count} records`, scenario(structuredClone(accounts)), (result) => {
    assert.equal(total(result), 25000);
    assert.equal(amount(result, 'deposit0', 'special457CatchUp'), 4000);
    for (const entry of result.accounts) assert.equal(entry.status, 'determinate');
  });
  accounts.unshift(record('sibling', 'participant', 'combined', 20000, 0, 0));
  add(`ordinary overage split into ${count} records`, scenario(accounts), (result) => {
    assert.equal(total(result), 25000);
    assert.equal(amount(result, 'sibling', 'special457CatchUp'), 4000);
  });
}

// The combined ceiling must bind every draw path, including existing amounts
// carrying invalid component labels. Partition and order cannot restore room.
for (const method of ['special', 'age']) {
  for (const count of [1, 2, 3]) {
    for (const reverse of [false, true]) {
      const special = method === 'special';
      const deposits = Array.from({ length: count }, (_, i) => {
        const account = record(`existing${i}`, 'participant', 'combined-review', 100000);
        account.existingContributions = special
          ? { special457CatchUp: 6000 / count }
          : { employerPreTax: i === 0 ? 25000 - Math.floor(25000 / count) * (count - 1) : Math.floor(25000 / count) };
        return account;
      });
      const empty = [record('draw0', 'participant', 'combined-review', 100000),
        record('draw1', 'participant', 'combined-review', 100000)];
      const accounts = reverse ? [...deposits, ...empty] : [...empty, ...deposits];
      if (special) for (const account of accounts) {
        account.planRules.section457SpecialCatchUp = { eligible: true, unusedDeferralsFromPriorYears: 5000 };
      }
      const input = scenario(accounts);
      input.persons[0].birthYear = special ? 1990 : 1971;
      input.persons[0].priorYearFicaWagesByEmployer = { employer: 0 };
      add(`${method} total ceiling with ${count} deposit records, reverse=${reverse}`, input, (result) => {
        assert.equal(total(result), special ? 29500 : 32500);
        // No record may newly allocate beyond the one shared total, including
        // when prior allocations are replayed as existing contributions below.
        if (!reverse) assert.equal(amount(result, 'draw0', special ? 'employeePreTaxDeferral' : 'employeePreTaxCatchUp'), special ? 23500 : 7500);
      });
    }
  }
}

function phpResults(inputs) {
  const process = spawnSync('php', [new URL('./php-parity-runner.php', import.meta.url).pathname], {
    input: JSON.stringify(inputs), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  if (process.error) throw process.error;
  assert.equal(process.status, 0, process.stderr);
  return JSON.parse(process.stdout);
}
const inputs = cases.map((entry) => entry.input);
for (const [runtime, results, calculate] of [
  ['TypeScript', inputs.map((input) => U.calculate(input)), (input) => U.calculate(input)],
  ['PHP', phpResults(inputs), (input) => phpResults([input])[0]],
]) {
  for (const [index, entry] of cases.entries()) {
    try {
      entry.check(results[index]);
      // Once all allocations are supplied as existing, no new capacity appears.
      const replay = structuredClone(entry.input);
      for (const account of replay.accounts) {
        account.existingContributions = row(results[index], account.id).contributionComponents;
      }
      entry.check(calculate(replay));
    } catch (error) {
      throw new Error(`${runtime}: ${entry.name}`, { cause: error });
    }
  }
}
console.log(`Section 457 structural invariants passed for ${cases.length} scenarios plus replays in each runtime.`);
