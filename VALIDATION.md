# Validation Report

- **Package:** `us-tax-advantaged-params@0.3.0`
- **Run:** 2026-09-02T06:47:36.757Z through 2026-09-02T06:47:40.795Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 196
- **Node:** v22.22.2
- **npm:** 10.9.7
- **TypeScript:** Version 7.0.2
- **PHP:** 8.4.19
- **Composer:** Composer version 2.8.12 2025-09-19 13:41:59

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 63 ms |
| Generated native parameter blocks | PASS | 0 | 67 ms |
| Source manifests and publication files | PASS | 0 | 63 ms |
| Strict TypeScript typecheck | PASS | 0 | 196 ms |
| TypeScript unit and conformance tests | PASS | 0 | 955 ms |
| PHP engine syntax | PASS | 0 | 42 ms |
| PHP unit-test syntax | PASS | 0 | 31 ms |
| PHP conformance-test syntax | PASS | 0 | 30 ms |
| PHP parity runner syntax | PASS | 0 | 31 ms |
| PHP unit tests | PASS | 0 | 46 ms |
| PHP conformance vectors | PASS | 0 | 88 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 1205 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 64 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 184 ms |
| Built-package manifest validation | PASS | 0 | 63 ms |
| npm package dry run | PASS | 0 | 421 ms |
| Composer manifest validation | PASS | 0 | 259 ms |

## Runtime qualification note

The local container provides PHP 8.4.19, below the PHP 8.5 floor composer.json declares. The GitHub Actions workflow tests the supported matrix. Do not publish without a green PHP CI matrix.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 45 contiguous FSA tax years, 70 sources, 196 conformance vectors.
```

**stderr**

_(no output)_

### Generated native parameter blocks

Command: `node scripts/generate.mjs --check`

**stdout**

_(no output)_

**stderr**

_(no output)_

### Source manifests and publication files

Command: `node scripts/validate-manifests.mjs`

**stdout**

```text
Manifest validation passed.
```

**stderr**

_(no output)_

### Strict TypeScript typecheck

Command: `tsc -p tsconfig.json --noEmit`

**stdout**

_(no output)_

**stderr**

_(no output)_

### TypeScript unit and conformance tests

Command: `npm run test:ts`

**stdout**

```text

> us-tax-advantaged-params@0.3.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USTaxAdvantagedParams.test.js dist-tests/tests/conformance.test.js


> us-tax-advantaged-params@0.3.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

TAP version 13
# Subtest: supports the first general IRA year through the generated year without extrapolation
ok 1 - supports the first general IRA year through the generated year without extrapolation
  ---
  duration_ms: 3.846948
  type: 'test'
  ...
# Subtest: normalizes common filing-status and account aliases
ok 2 - normalizes common filing-status and account aliases
  ---
  duration_ms: 0.498257
  type: 'test'
  ...
# Subtest: 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
ok 3 - 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
  ---
  duration_ms: 15.348363
  type: 'test'
  ...
# Subtest: 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
ok 4 - 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
  ---
  duration_ms: 0.642939
  type: 'test'
  ...
# Subtest: high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
ok 5 - high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
  ---
  duration_ms: 0.600414
  type: 'test'
  ...
# Subtest: 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
ok 6 - 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
  ---
  duration_ms: 0.899575
  type: 'test'
  ...
# Subtest: 2026 active-participant traditional IRA deduction phases out while total contribution remains available
ok 7 - 2026 active-participant traditional IRA deduction phases out while total contribution remains available
  ---
  duration_ms: 0.931335
  type: 'test'
  ...
# Subtest: traditional and Roth IRAs share one owner-level contribution pool
ok 8 - traditional and Roth IRAs share one owner-level contribution pool
  ---
  duration_ms: 0.629903
  type: 'test'
  ...
# Subtest: reports the quantified amount of an existing contribution above an account ceiling
ok 9 - reports the quantified amount of an existing contribution above an account ceiling
  ---
  duration_ms: 0.668359
  type: 'test'
  ...
# Subtest: 401(k) and 457(b) employee limits are separate
ok 10 - 401(k) and 457(b) employee limits are separate
  ---
  duration_ms: 1.285621
  type: 'test'
  ...
# Subtest: two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
ok 11 - two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
  ---
  duration_ms: 0.74469
  type: 'test'
  ...
# Subtest: mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
ok 12 - mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
  ---
  duration_ms: 0.481399
  type: 'test'
  ...
# Subtest: self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
ok 13 - self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
  ---
  duration_ms: 0.543642
  type: 'test'
  ...
# Subtest: self-employed SEP maximum uses the reduced 20% net-earnings rate
ok 14 - self-employed SEP maximum uses the reduced 20% net-earnings rate
  ---
  duration_ms: 0.509755
  type: 'test'
  ...
# Subtest: 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
ok 15 - 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
  ---
  duration_ms: 0.577346
  type: 'test'
  ...
# Subtest: 457(b) last-three-years catch-up is selected when larger than the age catch-up
ok 16 - 457(b) last-three-years catch-up is selected when larger than the age catch-up
  ---
  duration_ms: 0.406494
  type: 'test'
  ...
# Subtest: 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
ok 17 - 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
  ---
  duration_ms: 0.33157
  type: 'test'
  ...
# Subtest: pre-1987 401(k) maximum is explicitly indeterminate rather than invented
ok 18 - pre-1987 401(k) maximum is explicitly indeterminate rather than invented
  ---
  duration_ms: 0.257254
  type: 'test'
  ...
# Subtest: 1981 active employer-plan participant is ineligible for the modeled IRA contribution
ok 19 - 1981 active employer-plan participant is ineligible for the modeled IRA contribution
  ---
  duration_ms: 0.378127
  type: 'test'
  ...
# Subtest: 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing
ok 20 - 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing
  ---
  duration_ms: 0.331941
  type: 'test'
  ...
# Subtest: 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000
ok 21 - 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000
  ---
  duration_ms: 0.355611
  type: 'test'
  ...
# Subtest: pre-2020 traditional IRA age-70½ restriction is enforced
ok 22 - pre-2020 traditional IRA age-70½ restriction is enforced
  ---
  duration_ms: 0.538084
  type: 'test'
  ...
# Subtest: IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
ok 23 - IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
  ---
  duration_ms: 0.845295
  type: 'test'
  ...
# Subtest: in-plan Roth rollover reports only the pre-tax portion as taxable
ok 24 - in-plan Roth rollover reports only the pre-tax portion as taxable
  ---
  duration_ms: 0.565628
  type: 'test'
  ...
# Subtest: defined-benefit and cash-balance contributions remain actuarially indeterminate
ok 25 - defined-benefit and cash-balance contributions remain actuarially indeterminate
  ---
  duration_ms: 0.403805
  type: 'test'
  ...
# Subtest: 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
ok 26 - 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
  ---
  duration_ms: 0.575637
  type: 'test'
  ...
# Subtest: self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
ok 27 - self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
  ---
  duration_ms: 0.369341
  type: 'test'
  ...
# Subtest: pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
ok 28 - pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
  ---
  duration_ms: 0.318381
  type: 'test'
  ...
# Subtest: additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
ok 29 - additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
  ---
  duration_ms: 0.385283
  type: 'test'
  ...
# Subtest: SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
ok 30 - SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
  ---
  duration_ms: 0.370387
  type: 'test'
  ...
# Subtest: multiple 403(b) accounts share one owner-level 15-year catch-up pool
ok 31 - multiple 403(b) accounts share one owner-level 15-year catch-up pool
  ---
  duration_ms: 1.217985
  type: 'test'
  ...
# Subtest: Roth employer contributions are rejected before their 2023 effective year
ok 32 - Roth employer contributions are rejected before their 2023 effective year
  ---
  duration_ms: 0.526029
  type: 'test'
  ...
# Subtest: multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
ok 33 - multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
  ---
  duration_ms: 0.434053
  type: 'test'
  ...
# Subtest: duplicate taxpayer or spouse roles are rejected
ok 34 - duplicate taxpayer or spouse roles are rejected
  ---
  duration_ms: 0.324808
  type: 'test'
  ...
# Subtest: ambiguous M alias is accepted but produces a diagnostic
ok 35 - ambiguous M alias is accepted but produces a diagnostic
  ---
  duration_ms: 0.298993
  type: 'test'
  ...
# Subtest: 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
ok 36 - 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
  ---
  duration_ms: 0.242573
  type: 'test'
  ...
# Subtest: 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
ok 37 - 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
  ---
  duration_ms: 0.434615
  type: 'test'
  ...
# Subtest: 1997 employer match uses recognized compensation without capping employee elective deferrals
ok 38 - 1997 employer match uses recognized compensation without capping employee elective deferrals
  ---
  duration_ms: 0.370581
  type: 'test'
  ...
# Subtest: 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
ok 39 - 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
  ---
  duration_ms: 0.212813
  type: 'test'
  ...
# Subtest: 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
ok 40 - 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
  ---
  duration_ms: 0.256702
  type: 'test'
  ...
# Subtest: exposes the IRC 125 and IRC 129 parameter table without extrapolating it
ok 41 - exposes the IRC 125 and IRC 129 parameter table without extrapolating it
  ---
  duration_ms: 0.229695
  type: 'test'
  ...
# Subtest: rejects a bare FSA account type but accepts each unambiguous spelling
ok 42 - rejects a bare FSA account type but accepts each unambiguous spelling
  ---
  duration_ms: 0.126728
  type: 'test'
  ...
# Subtest: validates health FSA plan facts before calculating anything
ok 43 - validates health FSA plan facts before calculating anything
  ---
  duration_ms: 0.743711
  type: 'test'
  ...
# Subtest: the health FSA builder reaches every IRC 125(i) plan fact
ok 44 - the health FSA builder reaches every IRC 125(i) plan fact
  ---
  duration_ms: 0.533992
  type: 'test'
  ...
# Subtest: validates IRC 129 earned income facts before calculating anything
ok 45 - validates IRC 129 earned income facts before calculating anything
  ---
  duration_ms: 0.481398
  type: 'test'
  ...
# Subtest: the dependent care builder reaches the IRC 129(b) earned income facts
ok 46 - the dependent care builder reaches the IRC 129(b) earned income facts
  ---
  duration_ms: 0.479308
  type: 'test'
  ...
# Subtest: conformance: ordinary 2026 401k plan-term capacity
ok 47 - conformance: ordinary 2026 401k plan-term capacity
  ---
  duration_ms: 18.526059
  type: 'test'
  ...
# Subtest: conformance: 2026 high-wage age-60-to-63 Roth catch-up
ok 48 - conformance: 2026 high-wage age-60-to-63 Roth catch-up
  ---
  duration_ms: 0.593159
  type: 'test'
  ...
# Subtest: conformance: 2026 Roth IRA MFJ phaseout
ok 49 - conformance: 2026 Roth IRA MFJ phaseout
  ---
  duration_ms: 0.488644
  type: 'test'
  ...
# Subtest: conformance: shared traditional and Roth IRA pool
ok 50 - conformance: shared traditional and Roth IRA pool
  ---
  duration_ms: 0.799718
  type: 'test'
  ...
# Subtest: conformance: 401k and governmental 457b are separate
ok 51 - conformance: 401k and governmental 457b are separate
  ---
  duration_ms: 0.807807
  type: 'test'
  ...
# Subtest: conformance: mega backdoor 401k fills 415c
ok 52 - conformance: mega backdoor 401k fills 415c
  ---
  duration_ms: 0.466487
  type: 'test'
  ...
# Subtest: conformance: self-employed solo 401k
ok 53 - conformance: self-employed solo 401k
  ---
  duration_ms: 0.418218
  type: 'test'
  ...
# Subtest: conformance: 403b 15-year catch-up
ok 54 - conformance: 403b 15-year catch-up
  ---
  duration_ms: 0.365921
  type: 'test'
  ...
# Subtest: conformance: 457b special last-three-years catch-up
ok 55 - conformance: 457b special last-three-years catch-up
  ---
  duration_ms: 0.589416
  type: 'test'
  ...
# Subtest: conformance: 1994 historical employer-plan limits
ok 56 - conformance: 1994 historical employer-plan limits
  ---
  duration_ms: 0.485132
  type: 'test'
  ...
# Subtest: conformance: 1985 employer-plan limit remains indeterminate
ok 57 - conformance: 1985 employer-plan limit remains indeterminate
  ---
  duration_ms: 0.319717
  type: 'test'
  ...
# Subtest: conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule
ok 58 - conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule
  ---
  duration_ms: 0.308901
  type: 'test'
  ...
# Subtest: conformance: 1982 nonworking spouse IRA
ok 59 - conformance: 1982 nonworking spouse IRA
  ---
  duration_ms: 0.175227
  type: 'test'
  ...
# Subtest: conformance: IRA conversion Form 8606 pro-rata
ok 60 - conformance: IRA conversion Form 8606 pro-rata
  ---
  duration_ms: 0.712858
  type: 'test'
  ...
# Subtest: conformance: in-plan Roth rollover basis
ok 61 - conformance: in-plan Roth rollover basis
  ---
  duration_ms: 0.607465
  type: 'test'
  ...
# Subtest: conformance: 2026 enhanced SIMPLE
ok 62 - conformance: 2026 enhanced SIMPLE
  ---
  duration_ms: 0.487591
  type: 'test'
  ...
# Subtest: conformance: cash-balance contribution is actuarial
ok 63 - conformance: cash-balance contribution is actuarial
  ---
  duration_ms: 0.315372
  type: 'test'
  ...
# Subtest: conformance: self-employed retirement deduction classification
ok 64 - conformance: self-employed retirement deduction classification
  ---
  duration_ms: 0.332035
  type: 'test'
  ...
# Subtest: conformance: 2009 MFS living apart Roth conversion
ok 65 - conformance: 2009 MFS living apart Roth conversion
  ---
  duration_ms: 0.188114
  type: 'test'
  ...
# Subtest: conformance: SIMPLE additional nonelective 10 percent cap
ok 66 - conformance: SIMPLE additional nonelective 10 percent cap
  ---
  duration_ms: 0.18779
  type: 'test'
  ...
# Subtest: conformance: SIMPLE IRA Roth catch-up wage-test exclusion
ok 67 - conformance: SIMPLE IRA Roth catch-up wage-test exclusion
  ---
  duration_ms: 1.003129
  type: 'test'
  ...
# Subtest: conformance: aggregate 403b 15-year catch-up pool
ok 68 - conformance: aggregate 403b 15-year catch-up pool
  ---
  duration_ms: 0.388664
  type: 'test'
  ...
# Subtest: conformance: pre-2023 Roth employer contribution unavailable
ok 69 - conformance: pre-2023 Roth employer contribution unavailable
  ---
  duration_ms: 0.172466
  type: 'test'
  ...
# Subtest: conformance: aggregate IRA conversion basis penny allocation
ok 70 - conformance: aggregate IRA conversion basis penny allocation
  ---
  duration_ms: 0.290077
  type: 'test'
  ...
# Subtest: conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
ok 71 - conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
  ---
  duration_ms: 0.260371
  type: 'test'
  ...
# Subtest: conformance: 1997 nonelective formula applies 401a17 compensation ceiling
ok 72 - conformance: 1997 nonelective formula applies 401a17 compensation ceiling
  ---
  duration_ms: 0.30891
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
ok 73 - conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
  ---
  duration_ms: 0.132603
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
ok 74 - conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
  ---
  duration_ms: 0.102551
  type: 'test'
  ...
# Subtest: conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold
ok 75 - conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold
  ---
  duration_ms: 0.171968
  type: 'test'
  ...
# Subtest: conformance: 2005 designated Roth governmental 457b unavailable
ok 76 - conformance: 2005 designated Roth governmental 457b unavailable
  ---
  duration_ms: 0.115974
  type: 'test'
  ...
# Subtest: conformance: 2011 first-year designated Roth governmental 457b
ok 77 - conformance: 2011 first-year designated Roth governmental 457b
  ---
  duration_ms: 0.105303
  type: 'test'
  ...
# Subtest: conformance: 2025 SIMPLE 401k match capped by 401a17 compensation
ok 78 - conformance: 2025 SIMPLE 401k match capped by 401a17 compensation
  ---
  duration_ms: 0.200427
  type: 'test'
  ...
# Subtest: conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap
ok 79 - conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap
  ---
  duration_ms: 0.10417
  type: 'test'
  ...
# Subtest: conformance: 2026 MFS living together Roth IRA phase-out
ok 80 - conformance: 2026 MFS living together Roth IRA phase-out
  ---
  duration_ms: 0.121357
  type: 'test'
  ...
# Subtest: conformance: 2026 MFS living together covered traditional IRA deduction phase-out
ok 81 - conformance: 2026 MFS living together covered traditional IRA deduction phase-out
  ---
  duration_ms: 0.174739
  type: 'test'
  ...
# Subtest: conformance: 2026 modern spousal IRA from joint compensation
ok 82 - conformance: 2026 modern spousal IRA from joint compensation
  ---
  duration_ms: 0.133166
  type: 'test'
  ...
# Subtest: conformance: 2026 noncovered spouse deduction phase-out band
ok 83 - conformance: 2026 noncovered spouse deduction phase-out band
  ---
  duration_ms: 0.114842
  type: 'test'
  ...
# Subtest: conformance: 2026 ordinary age-50 catch-up at age 56
ok 84 - conformance: 2026 ordinary age-50 catch-up at age 56
  ---
  duration_ms: 0.175448
  type: 'test'
  ...
# Subtest: conformance: 2026 age-64 reversion from enhanced catch-up
ok 85 - conformance: 2026 age-64 reversion from enhanced catch-up
  ---
  duration_ms: 0.115731
  type: 'test'
  ...
# Subtest: conformance: 2023 first-year Roth employer contribution
ok 86 - conformance: 2023 first-year Roth employer contribution
  ---
  duration_ms: 0.120642
  type: 'test'
  ...
# Subtest: conformance: 2010 Roth conversion after MAGI repeal
ok 87 - conformance: 2010 Roth conversion after MAGI repeal
  ---
  duration_ms: 0.122342
  type: 'test'
  ...
# Subtest: conformance: 2020 traditional IRA contribution after age-70-half repeal
ok 88 - conformance: 2020 traditional IRA contribution after age-70-half repeal
  ---
  duration_ms: 0.113402
  type: 'test'
  ...
# Subtest: conformance: 1975 first-year traditional IRA fifteen percent limit
ok 89 - conformance: 1975 first-year traditional IRA fifteen percent limit
  ---
  duration_ms: 0.098989
  type: 'test'
  ...
# Subtest: conformance: unsupported tax year 1974
ok 90 - conformance: unsupported tax year 1974
  ---
  duration_ms: 0.413943
  type: 'test'
  ...
# Subtest: conformance: duplicate account id
ok 91 - conformance: duplicate account id
  ---
  duration_ms: 0.17973
  type: 'test'
  ...
# Subtest: conformance: unknown account owner
ok 92 - conformance: unknown account owner
  ---
  duration_ms: 0.145783
  type: 'test'
  ...
# Subtest: conformance: negative compensation is invalid money
ok 93 - conformance: negative compensation is invalid money
  ---
  duration_ms: 0.081508
  type: 'test'
  ...
# Subtest: conformance: invalid filing status alias
ok 94 - conformance: invalid filing status alias
  ---
  duration_ms: 0.072797
  type: 'test'
  ...
# Subtest: conformance: 2026 full-year self-only HSA limit
ok 95 - conformance: 2026 full-year self-only HSA limit
  ---
  duration_ms: 0.89772
  type: 'test'
  ...
# Subtest: conformance: 2026 full-year family HSA limit
ok 96 - conformance: 2026 full-year family HSA limit
  ---
  duration_ms: 0.355857
  type: 'test'
  ...
# Subtest: conformance: 2026 mid-year HSA coverage change prorated by month
ok 97 - conformance: 2026 mid-year HSA coverage change prorated by month
  ---
  duration_ms: 0.733434
  type: 'test'
  ...
# Subtest: conformance: 2026 both spouses age 55 receive separate HSA catch-ups
ok 98 - conformance: 2026 both spouses age 55 receive separate HSA catch-ups
  ---
  duration_ms: 1.007661
  type: 'test'
  ...
# Subtest: conformance: 2026 spouses divide the single family HSA limit as agreed
ok 99 - conformance: 2026 spouses divide the single family HSA limit as agreed
  ---
  duration_ms: 0.424352
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule with a satisfied testing period
ok 100 - conformance: 2026 HSA last-month rule with a satisfied testing period
  ---
  duration_ms: 5.390508
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule failed in the testing period
ok 101 - conformance: 2026 HSA last-month rule failed in the testing period
  ---
  duration_ms: 6.889117
  type: 'test'
  ...
# Subtest: conformance: 2005 HSA monthly limit capped by the plan annual deductible
ok 102 - conformance: 2005 HSA monthly limit capped by the plan annual deductible
  ---
  duration_ms: 0.364789
  type: 'test'
  ...
# Subtest: conformance: 2006 HSA monthly limit capped by the statutory dollar amount
ok 103 - conformance: 2006 HSA monthly limit capped by the statutory dollar amount
  ---
  duration_ms: 0.257115
  type: 'test'
  ...
# Subtest: conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok 104 - conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
  ---
  duration_ms: 0.287561
  type: 'test'
  ...
# Subtest: conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok 105 - conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
  ---
  duration_ms: 0.180482
  type: 'test'
  ...
# Subtest: conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate
ok 106 - conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate
  ---
  duration_ms: 0.45913
  type: 'test'
  ...
# Subtest: conformance: 2005 a spouse's self-only deductible does not lower the IRC 223(b)(5) family limitation
ok 107 - conformance: 2005 a spouse's self-only deductible does not lower the IRC 223(b)(5) family limitation
  ---
  duration_ms: 0.216832
  type: 'test'
  ...
# Subtest: conformance: 2005 two family plans take the lower annual deductible under IRC 223(b)(5)(A)
ok 108 - conformance: 2005 two family plans take the lower annual deductible under IRC 223(b)(5)(A)
  ---
  duration_ms: 0.169968
  type: 'test'
  ...
# Subtest: conformance: 2005 a family-covered spouse who omits their annual deductible leaves the family limitation indeterminate
ok 109 - conformance: 2005 a family-covered spouse who omits their annual deductible leaves the family limitation indeterminate
  ---
  duration_ms: 0.238932
  type: 'test'
  ...
# Subtest: conformance: 2005 one spouse's conflicting coverage facts leave the other spouse's share of the family limitation indeterminate
ok 110 - conformance: 2005 one spouse's conflicting coverage facts leave the other spouse's share of the family limitation indeterminate
  ---
  duration_ms: 0.427098
  type: 'test'
  ...
# Subtest: conformance: 2005 a spouse's family plan sets the deductible only for the months that plan was in force
ok 111 - conformance: 2005 a spouse's family plan sets the deductible only for the months that plan was in force
  ---
  duration_ms: 0.268908
  type: 'test'
  ...
# Subtest: conformance: 2005 an omitted annual deductible and an explicit null are the same fact
ok 112 - conformance: 2005 an omitted annual deductible and an explicit null are the same fact
  ---
  duration_ms: 0.366197
  type: 'test'
  ...
# Subtest: conformance: 2007 no annual deductible is required once the IRC 223(b)(2) cap is repealed
ok 113 - conformance: 2007 no annual deductible is required once the IRC 223(b)(2) cap is repealed
  ---
  duration_ms: 0.219998
  type: 'test'
  ...
# Subtest: conformance: a missing birth year leaves the IRC 223(b)(5) household limit determinable
ok 114 - conformance: a missing birth year leaves the IRC 223(b)(5) household limit determinable
  ---
  duration_ms: 0.297229
  type: 'test'
  ...
# Subtest: conformance: 2026 employer HSA contribution is excluded rather than deducted
ok 115 - conformance: 2026 employer HSA contribution is excluded rather than deducted
  ---
  duration_ms: 0.153453
  type: 'test'
  ...
# Subtest: conformance: 2003 predates IRC 223 health savings accounts
ok 116 - conformance: 2003 predates IRC 223 health savings accounts
  ---
  duration_ms: 0.129442
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule with an unresolved testing period
ok 117 - conformance: 2026 HSA last-month rule with an unresolved testing period
  ---
  duration_ms: 0.213697
  type: 'test'
  ...
# Subtest: conformance: 2026 married filing separately family coverage recharacterizes the other spouse
ok 118 - conformance: 2026 married filing separately family coverage recharacterizes the other spouse
  ---
  duration_ms: 0.186517
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse family and self-only months divide only the family portion
ok 119 - conformance: 2026 spouse family and self-only months divide only the family portion
  ---
  duration_ms: 0.188282
  type: 'test'
  ...
# Subtest: conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit
ok 120 - conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit
  ---
  duration_ms: 0.142071
  type: 'test'
  ...
# Subtest: conformance: 2026 married last-month rule measures the attributable amount against the divided limit
ok 121 - conformance: 2026 married last-month rule measures the attributable amount against the divided limit
  ---
  duration_ms: 0.206069
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months
ok 122 - conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months
  ---
  duration_ms: 0.283031
  type: 'test'
  ...
# Subtest: conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate
ok 123 - conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate
  ---
  duration_ms: 0.234225
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact
ok 124 - conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact
  ---
  duration_ms: 0.208633
  type: 'test'
  ...
# Subtest: conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A)
ok 125 - conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A)
  ---
  duration_ms: 0.204233
  type: 'test'
  ...
# Subtest: conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division
ok 126 - conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division
  ---
  duration_ms: 0.274046
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount
ok 127 - conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount
  ---
  duration_ms: 0.1482
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched
ok 128 - conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched
  ---
  duration_ms: 0.152683
  type: 'test'
  ...
# Subtest: conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below
ok 129 - conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below
  ---
  duration_ms: 0.172998
  type: 'test'
  ...
# Subtest: conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule
ok 130 - conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule
  ---
  duration_ms: 0.232779
  type: 'test'
  ...
# Subtest: conformance: persons entry that is not an object is rejected
ok 131 - conformance: persons entry that is not an object is rejected
  ---
  duration_ms: 0.113232
  type: 'test'
  ...
# Subtest: conformance: accounts entry that is not an object is rejected
ok 132 - conformance: accounts entry that is not an object is rejected
  ---
  duration_ms: 0.083332
  type: 'test'
  ...
# Subtest: conformance: conversions entry that is not an object is rejected
ok 133 - conformance: conversions entry that is not an object is rejected
  ---
  duration_ms: 0.08596
  type: 'test'
  ...
# Subtest: conformance: account without an ownerId is rejected
ok 134 - conformance: account without an ownerId is rejected
  ---
  duration_ms: 0.205012
  type: 'test'
  ...
# Subtest: conformance: conversion without an ownerId is rejected
ok 135 - conformance: conversion without an ownerId is rejected
  ---
  duration_ms: 0.109069
  type: 'test'
  ...
# Subtest: conformance: unrecognized contributionPreference is rejected
ok 136 - conformance: unrecognized contributionPreference is rejected
  ---
  duration_ms: 0.073841
  type: 'test'
  ...
# Subtest: conformance: unrecognized employerContributionTaxTreatment is rejected
ok 137 - conformance: unrecognized employerContributionTaxTreatment is rejected
  ---
  duration_ms: 0.078551
  type: 'test'
  ...
# Subtest: conformance: rate outside 0 through 1 is rejected
ok 138 - conformance: rate outside 0 through 1 is rejected
  ---
  duration_ms: 0.102284
  type: 'test'
  ...
# Subtest: conformance: existing contributions above the account ceiling name the amounts
ok 139 - conformance: existing contributions above the account ceiling name the amounts
  ---
  duration_ms: 0.277373
  type: 'test'
  ...
# Subtest: conformance: taxYear that is not an integer is rejected
ok 140 - conformance: taxYear that is not an integer is rejected
  ---
  duration_ms: 0.052552
  type: 'test'
  ...
# Subtest: conformance: missing filingStatus is rejected rather than defaulted
ok 141 - conformance: missing filingStatus is rejected rather than defaulted
  ---
  duration_ms: 0.110401
  type: 'test'
  ...
# Subtest: conformance: filingStatus that is not a string is rejected
ok 142 - conformance: filingStatus that is not a string is rejected
  ---
  duration_ms: 0.082976
  type: 'test'
  ...
# Subtest: conformance: accounts that is not an array is rejected
ok 143 - conformance: accounts that is not an array is rejected
  ---
  duration_ms: 0.071845
  type: 'test'
  ...
# Subtest: conformance: conversions that is not an array is rejected
ok 144 - conformance: conversions that is not an array is rejected
  ---
  duration_ms: 0.083667
  type: 'test'
  ...
# Subtest: conformance: account type that is not a string is rejected
ok 145 - conformance: account type that is not a string is rejected
  ---
  duration_ms: 0.082077
  type: 'test'
  ...
# Subtest: conformance: person id that is not a string is rejected
ok 146 - conformance: person id that is not a string is rejected
  ---
  duration_ms: 0.057434
  type: 'test'
  ...
# Subtest: conformance: structured input field that is not an object is rejected
ok 147 - conformance: structured input field that is not an object is rejected
  ---
  duration_ms: 0.054163
  type: 'test'
  ...
# Subtest: conformance: unrecognized simpleEmployerContributionMethod is rejected
ok 148 - conformance: unrecognized simpleEmployerContributionMethod is rejected
  ---
  duration_ms: 0.080535
  type: 'test'
  ...
# Subtest: conformance: 1989 fractional plan-term capacity keeps its fraction in the message
ok 149 - conformance: 1989 fractional plan-term capacity keeps its fraction in the message
  ---
  duration_ms: 0.19037
  type: 'test'
  ...
# Subtest: conformance: flag field that is not a boolean is rejected
ok 150 - conformance: flag field that is not a boolean is rejected
  ---
  duration_ms: 0.071905
  type: 'test'
  ...
# Subtest: conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C)
ok 151 - conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C)
  ---
  duration_ms: 0.4898
  type: 'test'
  ...
# Subtest: conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount
ok 152 - conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount
  ---
  duration_ms: 0.227792
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero
ok 153 - conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero
  ---
  duration_ms: 0.285613
  type: 'test'
  ...
# Subtest: conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division
ok 154 - conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division
  ---
  duration_ms: 0.265077
  type: 'test'
  ...
# Subtest: conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead
ok 155 - conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead
  ---
  duration_ms: 0.262302
  type: 'test'
  ...
# Subtest: conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount
ok 156 - conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount
  ---
  duration_ms: 0.210946
  type: 'test'
  ...
# Subtest: conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides
ok 157 - conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides
  ---
  duration_ms: 0.2896
  type: 'test'
  ...
# Subtest: conformance: 2026 family-limit shares that do not exhaust the limitation are not a division
ok 158 - conformance: 2026 family-limit shares that do not exhaust the limitation are not a division
  ---
  duration_ms: 1.000398
  type: 'test'
  ...
# Subtest: conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing
ok 159 - conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing
  ---
  duration_ms: 0.296233
  type: 'test'
  ...
# Subtest: conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
ok 160 - conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
  ---
  duration_ms: 0.248873
  type: 'test'
  ...
# Subtest: conformance: 2026 incomplete family-limit shares report only the missing-share error
ok 161 - conformance: 2026 incomplete family-limit shares report only the missing-share error
  ---
  duration_ms: 0.172903
  type: 'test'
  ...
# Subtest: conformance: 2026 flexible spending arrangement parameters are published in the result
ok 162 - conformance: 2026 flexible spending arrangement parameters are published in the result
  ---
  duration_ms: 0.077656
  type: 'test'
  ...
# Subtest: conformance: 2012 health FSA exists with no statutory ceiling rather than not existing
ok 163 - conformance: 2012 health FSA exists with no statutory ceiling rather than not existing
  ---
  duration_ms: 0.062676
  type: 'test'
  ...
# Subtest: conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all
ok 164 - conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all
  ---
  duration_ms: 0.05342
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA election at the IRC 125(i) limit
ok 165 - conformance: 2026 health FSA election at the IRC 125(i) limit
  ---
  duration_ms: 0.509221
  type: 'test'
  ...
# Subtest: conformance: 2013 is the first year IRC 125(i) limits a health FSA election
ok 166 - conformance: 2013 is the first year IRC 125(i) limits a health FSA election
  ---
  duration_ms: 0.203205
  type: 'test'
  ...
# Subtest: conformance: 2012 health FSA has no statutory salary-reduction ceiling
ok 167 - conformance: 2012 health FSA has no statutory salary-reduction ceiling
  ---
  duration_ms: 0.110917
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited
ok 168 - conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited
  ---
  duration_ms: 0.235006
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit
ok 169 - conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit
  ---
  duration_ms: 0.189056
  type: 'test'
  ...
# Subtest: conformance: a health FSA grace period precludes a carryover
ok 170 - conformance: a health FSA grace period precludes a carryover
  ---
  duration_ms: 0.124622
  type: 'test'
  ...
# Subtest: conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount
ok 171 - conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount
  ---
  duration_ms: 0.095013
  type: 'test'
  ...
# Subtest: conformance: a health FSA carryover and grace period asserted together are refused
ok 172 - conformance: a health FSA carryover and grace period asserted together are refused
  ---
  duration_ms: 0.082299
  type: 'test'
  ...
# Subtest: conformance: nothing may be carried into 2013, the first year the carryover existed
ok 173 - conformance: nothing may be carried into 2013, the first year the carryover existed
  ---
  duration_ms: 0.168921
  type: 'test'
  ...
# Subtest: conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled
ok 174 - conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled
  ---
  duration_ms: 0.127469
  type: 'test'
  ...
# Subtest: conformance: a prior-year unused amount without a stated plan option asks for the fact
ok 175 - conformance: a prior-year unused amount without a stated plan option asks for the fact
  ---
  duration_ms: 0.158609
  type: 'test'
  ...
# Subtest: conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated
ok 176 - conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated
  ---
  duration_ms: 0.171945
  type: 'test'
  ...
# Subtest: conformance: an account type that did not exist for the tax year reports no exclusion
ok 177 - conformance: an account type that did not exist for the tax year reports no exclusion
  ---
  duration_ms: 0.183045
  type: 'test'
  ...
# Subtest: conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a)
ok 178 - conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a)
  ---
  duration_ms: 0.136219
  type: 'test'
  ...
# Subtest: conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum
ok 179 - conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum
  ---
  duration_ms: 0.095482
  type: 'test'
  ...
# Subtest: conformance: two unrelated employers each carry a full health FSA limit
ok 180 - conformance: two unrelated employers each carry a full health FSA limit
  ---
  duration_ms: 0.091482
  type: 'test'
  ...
# Subtest: conformance: two health FSAs of one employer share a single IRC 125(i) limit
ok 181 - conformance: two health FSAs of one employer share a single IRC 125(i) limit
  ---
  duration_ms: 0.070289
  type: 'test'
  ...
# Subtest: conformance: spouses filing jointly each carry a full health FSA limit
ok 182 - conformance: spouses filing jointly each carry a full health FSA limit
  ---
  duration_ms: 0.076605
  type: 'test'
  ...
# Subtest: conformance: non-elective employer flex credits stay outside the IRC 125(i) limit
ok 183 - conformance: non-elective employer flex credits stay outside the IRC 125(i) limit
  ---
  duration_ms: 0.097109
  type: 'test'
  ...
# Subtest: conformance: flex credits electable as cash consume the IRC 125(i) limit
ok 184 - conformance: flex credits electable as cash consume the IRC 125(i) limit
  ---
  duration_ms: 0.070361
  type: 'test'
  ...
# Subtest: conformance: flex credits without a stated cash election ask for the fact
ok 185 - conformance: flex credits without a stated cash election ask for the fact
  ---
  duration_ms: 0.331466
  type: 'test'
  ...
# Subtest: conformance: a lower plan-document health FSA limit binds
ok 186 - conformance: a lower plan-document health FSA limit binds
  ---
  duration_ms: 0.163879
  type: 'test'
  ...
# Subtest: conformance: a lower plan-document limit caps its own arrangement, not the employer group
ok 187 - conformance: a lower plan-document limit caps its own arrangement, not the employer group
  ---
  duration_ms: 0.099246
  type: 'test'
  ...
# Subtest: conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure
ok 188 - conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure
  ---
  duration_ms: 0.081727
  type: 'test'
  ...
# Subtest: conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate
ok 189 - conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate
  ---
  duration_ms: 0.063679
  type: 'test'
  ...
# Subtest: conformance: a bare FSA account type is rejected as ambiguous
ok 190 - conformance: a bare FSA account type is rejected as ambiguous
  ---
  duration_ms: 0.08158
  type: 'test'
  ...
# Subtest: conformance: an unrecognised health FSA purpose is rejected
ok 191 - conformance: an unrecognised health FSA purpose is rejected
  ---
  duration_ms: 0.052672
  type: 'test'
  ...
# Subtest: conformance: 2025 dependent care assistance exclusion on a single return
ok 192 - conformance: 2025 dependent care assistance exclusion on a single return
  ---
  duration_ms: 0.42386
  type: 'test'
  ...
# Subtest: conformance: 2025 dependent care exclusion is halved on a married separate return
ok 193 - conformance: 2025 dependent care exclusion is halved on a married separate return
  ---
  duration_ms: 0.197069
  type: 'test'
  ...
# Subtest: conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount
ok 194 - conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount
  ---
  duration_ms: 0.120755
  type: 'test'
  ...
# Subtest: conformance: a separate return that states it is still married keeps the halved amount
ok 195 - conformance: a separate return that states it is still married keeps the halved amount
  ---
  duration_ms: 0.294655
  type: 'test'
  ...
# Subtest: conformance: 2021 only, the ARPA dependent care exclusion is 10500
ok 196 - conformance: 2021 only, the ARPA dependent care exclusion is 10500
  ---
  duration_ms: 0.222778
  type: 'test'
  ...
# Subtest: conformance: 2022 reverts to the pre-ARPA dependent care exclusion
ok 197 - conformance: 2022 reverts to the pre-ARPA dependent care exclusion
  ---
  duration_ms: 0.268234
  type: 'test'
  ...
# Subtest: conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21
ok 198 - conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21
  ---
  duration_ms: 0.13667
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount
ok 199 - conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount
  ---
  duration_ms: 0.120207
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent
ok 200 - conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent
  ---
  duration_ms: 0.225045
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled
ok 201 - conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled
  ---
  duration_ms: 0.292187
  type: 'test'
  ...
# Subtest: conformance: spouses filing jointly share one IRC 129 household exclusion
ok 202 - conformance: spouses filing jointly share one IRC 129 household exclusion
  ---
  duration_ms: 0.244475
  type: 'test'
  ...
# Subtest: conformance: married separate spouses do not share one IRC 129 exclusion
ok 203 - conformance: married separate spouses do not share one IRC 129 exclusion
  ---
  duration_ms: 0.129792
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs
ok 204 - conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs
  ---
  duration_ms: 0.128976
  type: 'test'
  ...
# Subtest: conformance: a dependent care plan document below the IRC 129 amount binds this arrangement
ok 205 - conformance: a dependent care plan document below the IRC 129 amount binds this arrangement
  ---
  duration_ms: 0.265566
  type: 'test'
  ...
# Subtest: conformance: a dependent care plan document caps its own arrangement, not the household amount
ok 206 - conformance: a dependent care plan document caps its own arrangement, not the household amount
  ---
  duration_ms: 0.134627
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns
ok 207 - conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns
  ---
  duration_ms: 0.127387
  type: 'test'
  ...
# Subtest: conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling
ok 208 - conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling
  ---
  duration_ms: 0.117795
  type: 'test'
  ...
# Subtest: conformance: 1986 dependent care with no ceiling from any source stays indeterminate
ok 209 - conformance: 1986 dependent care with no ceiling from any source stays indeterminate
  ---
  duration_ms: 0.092631
  type: 'test'
  ...
# Subtest: conformance: 1981 predates IRC 129 entirely
ok 210 - conformance: 1981 predates IRC 129 entirely
  ---
  duration_ms: 0.097782
  type: 'test'
  ...
# Subtest: conformance: a health FSA and a dependent care FSA carry independent limits
ok 211 - conformance: a health FSA and a dependent care FSA carry independent limits
  ---
  duration_ms: 0.191798
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures
ok 212 - conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures
  ---
  duration_ms: 0.206198
  type: 'test'
  ...
# Subtest: conformance: a limited-purpose health FSA raises no IRC 223 conflict
ok 213 - conformance: a limited-purpose health FSA raises no IRC 223 conflict
  ---
  duration_ms: 0.154312
  type: 'test'
  ...
# Subtest: conformance: a post-deductible health FSA raises no IRC 223 conflict
ok 214 - conformance: a post-deductible health FSA raises no IRC 223 conflict
  ---
  duration_ms: 0.144723
  type: 'test'
  ...
# Subtest: conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate
ok 215 - conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate
  ---
  duration_ms: 0.135971
  type: 'test'
  ...
# Subtest: conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA
ok 216 - conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA
  ---
  duration_ms: 0.187689
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year
ok 217 - conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year
  ---
  duration_ms: 0.253186
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification
ok 218 - conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification
  ---
  duration_ms: 0.27592
  type: 'test'
  ...
# Subtest: conformance: a dependent care FSA raises no IRC 223 conflict at all
ok 219 - conformance: a dependent care FSA raises no IRC 223 conflict at all
  ---
  duration_ms: 0.196138
  type: 'test'
  ...
# Subtest: conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit
ok 220 - conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.211285
  type: 'test'
  ...
# Subtest: conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok 221 - conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.149199
  type: 'test'
  ...
# Subtest: conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok 222 - conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.101949
  type: 'test'
  ...
# Subtest: conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs
ok 223 - conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs
  ---
  duration_ms: 0.13809
  type: 'test'
  ...
# Subtest: conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance
ok 224 - conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance
  ---
  duration_ms: 0.117689
  type: 'test'
  ...
# Subtest: conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance
ok 225 - conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance
  ---
  duration_ms: 0.085481
  type: 'test'
  ...
# Subtest: conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance
ok 226 - conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance
  ---
  duration_ms: 1.258313
  type: 'test'
  ...
# Subtest: conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i)
ok 227 - conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i)
  ---
  duration_ms: 0.361347
  type: 'test'
  ...
# Subtest: conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance
ok 228 - conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance
  ---
  duration_ms: 0.168049
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing
ok 229 - conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing
  ---
  duration_ms: 0.125651
  type: 'test'
  ...
# Subtest: conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount
ok 230 - conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount
  ---
  duration_ms: 0.113256
  type: 'test'
  ...
# Subtest: conformance: 2023 has no pension-linked emergency savings account
ok 231 - conformance: 2023 has no pension-linked emergency savings account
  ---
  duration_ms: 0.180889
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate
ok 232 - conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate
  ---
  duration_ms: 0.142106
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k)
ok 233 - conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k)
  ---
  duration_ms: 0.274765
  type: 'test'
  ...
# Subtest: conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure
ok 234 - conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure
  ---
  duration_ms: 0.160605
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account needs no birth year
ok 235 - conformance: a pension-linked emergency savings account needs no birth year
  ---
  duration_ms: 0.16048
  type: 'test'
  ...
# Subtest: conformance: 2026 a spouse's contradictory coverage tiers leave IRC 223(b)(5)(A) applicability unknown, self-only account listed first
ok 236 - conformance: 2026 a spouse's contradictory coverage tiers leave IRC 223(b)(5)(A) applicability unknown, self-only account listed first
  ---
  duration_ms: 0.287134
  type: 'test'
  ...
# Subtest: conformance: 2026 the same contradictory spouse coverage gives the same answer with the family account listed first
ok 237 - conformance: 2026 the same contradictory spouse coverage gives the same answer with the family account listed first
  ---
  duration_ms: 0.18697
  type: 'test'
  ...
# Subtest: conformance: 2026 a spouse's coverage facts that conflict only in the annual deductible leave the other spouse determinate
ok 238 - conformance: 2026 a spouse's coverage facts that conflict only in the annual deductible leave the other spouse determinate
  ---
  duration_ms: 0.174305
  type: 'test'
  ...
# Subtest: conformance: 2026 a spouse's coverage conflict outside the owner's eligible months leaves the owner determinate
ok 239 - conformance: 2026 a spouse's coverage conflict outside the owner's eligible months leaves the owner determinate
  ---
  duration_ms: 0.17374
  type: 'test'
  ...
# Subtest: conformance: 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies
ok 240 - conformance: 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies
  ---
  duration_ms: 0.172466
  type: 'test'
  ...
# Subtest: conformance: 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit
ok 241 - conformance: 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit
  ---
  duration_ms: 0.285096
  type: 'test'
  ...
# Subtest: conformance: 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate
ok 242 - conformance: 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate
  ---
  duration_ms: 0.246399
  type: 'test'
  ...
1..242
# tests 242
# suites 0
# pass 242
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 233.473745
```

**stderr**

_(no output)_

### PHP engine syntax

Command: `php -l php/src/USTaxAdvantagedParams.php`

**stdout**

```text
No syntax errors detected in php/src/USTaxAdvantagedParams.php
```

**stderr**

_(no output)_

### PHP unit-test syntax

Command: `php -l php/tests/USTaxAdvantagedParamsTest.php`

**stdout**

```text
No syntax errors detected in php/tests/USTaxAdvantagedParamsTest.php
```

**stderr**

_(no output)_

### PHP conformance-test syntax

Command: `php -l php/tests/ConformanceVectorsTest.php`

**stdout**

```text
No syntax errors detected in php/tests/ConformanceVectorsTest.php
```

**stderr**

_(no output)_

### PHP parity runner syntax

Command: `php -l scripts/php-parity-runner.php`

**stdout**

```text
No syntax errors detected in scripts/php-parity-runner.php
```

**stderr**

_(no output)_

### PHP unit tests

Command: `php php/tests/USTaxAdvantagedParamsTest.php`

**stdout**

```text
ok - supports 1975 through 2026 without extrapolation
ok - normalizes common aliases
ok - builder pattern calculates an ordinary 2026 401k
ok - 2026 age 60 to 63 high wage catch-up is Roth
ok - reports the quantified amount of an existing contribution above an account ceiling
ok - high wage catch-up is unavailable without plan Roth catch-up
ok - Roth IRA MFJ phase-out
ok - traditional IRA deduction phases out without reducing total contribution
ok - traditional and Roth IRA share owner pool
ok - 401k and 457b limits are separate
ok - two 401k plans share 402g and retain separate 415c groups
ok - mega backdoor fills remaining 415c space
ok - self employed solo 401k uses 20 percent equivalent rate
ok - self employed SEP uses 20 percent equivalent rate
ok - 403b 15-year catch-up
ok - 457b special catch-up selected when larger
ok - 1994 historical limits
ok - 1985 401k is indeterminate
ok - 1981 active participant is ineligible for IRA
ok - 1982 one earner spousal IRA allows 2000 to the spousal account when the worker contributes nothing
ok - 1982 one earner spousal IRA is limited to the 2250 household residue after the worker uses 2000
ok - 2019 traditional IRA age 70.5 restriction
ok - IRA conversion applies Form 8606 pro rata basis
ok - in plan Roth rollover taxes pre-tax portion only
ok - cash balance contribution remains indeterminate
ok - 2026 enhanced SIMPLE and age 60 to 63 catch-up
ok - self employed plan deduction excludes IRA deduction classification
ok - pre 2010 MFS taxpayer living apart may convert under MAGI ceiling
ok - additional SIMPLE nonelective contribution is capped at 10 percent compensation
ok - SIMPLE IRA catch-up remains pre-tax under 408p exclusion
ok - multiple 403b accounts share one 15-year catch-up pool
ok - Roth employer contributions are rejected before 2023
ok - multiple IRA conversions do not over-allocate basis by pennies
ok - duplicate taxpayer or spouse roles are rejected
ok - ambiguous M alias emits diagnostic
ok - 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
ok - 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
ok - 1997 employer match uses recognized compensation without capping employee elective deferrals
ok - 1997 self-employed SEP applies reduced-rate and recognized-compensation worksheet ceilings
ok - 1997 self-employed qualified-plan formula applies reduced-rate and recognized-compensation ceilings
ok - exposes the IRC 125 and IRC 129 parameter table without extrapolating it
ok - rejects a bare FSA account type but accepts each unambiguous spelling
ok - validates health FSA plan facts before calculating anything
ok - the health FSA builder reaches every IRC 125(i) plan fact
ok - validates IRC 129 earned income facts before calculating anything
ok - the dependent care builder reaches the IRC 129(b) earned income facts

46 tests, 0 failed (0.006s)
```

**stderr**

_(no output)_

### PHP conformance vectors

Command: `php php/tests/ConformanceVectorsTest.php`

**stdout**

```text
ok - ordinary 2026 401k plan-term capacity
ok - 2026 high-wage age-60-to-63 Roth catch-up
ok - 2026 Roth IRA MFJ phaseout
ok - shared traditional and Roth IRA pool
ok - 401k and governmental 457b are separate
ok - mega backdoor 401k fills 415c
ok - self-employed solo 401k
ok - 403b 15-year catch-up
ok - 457b special last-three-years catch-up
ok - 1994 historical employer-plan limits
ok - 1985 employer-plan limit remains indeterminate
ok - 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule
ok - 1982 nonworking spouse IRA
ok - IRA conversion Form 8606 pro-rata
ok - in-plan Roth rollover basis
ok - 2026 enhanced SIMPLE
ok - cash-balance contribution is actuarial
ok - self-employed retirement deduction classification
ok - 2009 MFS living apart Roth conversion
ok - SIMPLE additional nonelective 10 percent cap
ok - SIMPLE IRA Roth catch-up wage-test exclusion
ok - aggregate 403b 15-year catch-up pool
ok - pre-2023 Roth employer contribution unavailable
ok - aggregate IRA conversion basis penny allocation
ok - 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
ok - 1997 nonelective formula applies 401a17 compensation ceiling
ok - 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
ok - 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
ok - 1998 SEP compensation below 400 reports maximum-excludable threshold
ok - 2005 designated Roth governmental 457b unavailable
ok - 2011 first-year designated Roth governmental 457b
ok - 2025 SIMPLE 401k match capped by 401a17 compensation
ok - 2025 SIMPLE IRA match exempt from 401a17 compensation cap
ok - 2026 MFS living together Roth IRA phase-out
ok - 2026 MFS living together covered traditional IRA deduction phase-out
ok - 2026 modern spousal IRA from joint compensation
ok - 2026 noncovered spouse deduction phase-out band
ok - 2026 ordinary age-50 catch-up at age 56
ok - 2026 age-64 reversion from enhanced catch-up
ok - 2023 first-year Roth employer contribution
ok - 2010 Roth conversion after MAGI repeal
ok - 2020 traditional IRA contribution after age-70-half repeal
ok - 1975 first-year traditional IRA fifteen percent limit
ok - unsupported tax year 1974
ok - duplicate account id
ok - unknown account owner
ok - negative compensation is invalid money
ok - invalid filing status alias
ok - 2026 full-year self-only HSA limit
ok - 2026 full-year family HSA limit
ok - 2026 mid-year HSA coverage change prorated by month
ok - 2026 both spouses age 55 receive separate HSA catch-ups
ok - 2026 spouses divide the single family HSA limit as agreed
ok - 2026 HSA last-month rule with a satisfied testing period
ok - 2026 HSA last-month rule failed in the testing period
ok - 2005 HSA monthly limit capped by the plan annual deductible
ok - 2006 HSA monthly limit capped by the statutory dollar amount
ok - 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok - 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok - 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate
ok - 2005 a spouse's self-only deductible does not lower the IRC 223(b)(5) family limitation
ok - 2005 two family plans take the lower annual deductible under IRC 223(b)(5)(A)
ok - 2005 a family-covered spouse who omits their annual deductible leaves the family limitation indeterminate
ok - 2005 one spouse's conflicting coverage facts leave the other spouse's share of the family limitation indeterminate
ok - 2005 a spouse's family plan sets the deductible only for the months that plan was in force
ok - 2005 an omitted annual deductible and an explicit null are the same fact
ok - 2007 no annual deductible is required once the IRC 223(b)(2) cap is repealed
ok - a missing birth year leaves the IRC 223(b)(5) household limit determinable
ok - 2026 employer HSA contribution is excluded rather than deducted
ok - 2003 predates IRC 223 health savings accounts
ok - 2026 HSA last-month rule with an unresolved testing period
ok - 2026 married filing separately family coverage recharacterizes the other spouse
ok - 2026 spouse family and self-only months divide only the family portion
ok - 2026 spouses with unequal family-coverage months each divide their own refigured family limit
ok - 2026 married last-month rule measures the attributable amount against the divided limit
ok - 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months
ok - 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate
ok - 2026 spouse without high deductible coverage leaves the self-only HSA limit intact
ok - 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A)
ok - 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division
ok - 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount
ok - 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched
ok - 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below
ok - 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule
ok - persons entry that is not an object is rejected
ok - accounts entry that is not an object is rejected
ok - conversions entry that is not an object is rejected
ok - account without an ownerId is rejected
ok - conversion without an ownerId is rejected
ok - unrecognized contributionPreference is rejected
ok - unrecognized employerContributionTaxTreatment is rejected
ok - rate outside 0 through 1 is rejected
ok - existing contributions above the account ceiling name the amounts
ok - taxYear that is not an integer is rejected
ok - missing filingStatus is rejected rather than defaulted
ok - filingStatus that is not a string is rejected
ok - accounts that is not an array is rejected
ok - conversions that is not an array is rejected
ok - account type that is not a string is rejected
ok - person id that is not a string is rejected
ok - structured input field that is not an object is rejected
ok - unrecognized simpleEmployerContributionMethod is rejected
ok - 1989 fractional plan-term capacity keeps its fraction in the message
ok - flag field that is not a boolean is rejected
ok - 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C)
ok - 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount
ok - 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero
ok - 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division
ok - 2026 matched Archer MSA contribution of the same amount is taken before the division instead
ok - 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount
ok - 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides
ok - 2026 family-limit shares that do not exhaust the limitation are not a division
ok - 2026 family-limit shares totalling exactly one may still give a spouse nothing
ok - 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
ok - 2026 incomplete family-limit shares report only the missing-share error
ok - 2026 flexible spending arrangement parameters are published in the result
ok - 2012 health FSA exists with no statutory ceiling rather than not existing
ok - 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all
ok - 2026 health FSA election at the IRC 125(i) limit
ok - 2013 is the first year IRC 125(i) limits a health FSA election
ok - 2012 health FSA has no statutory salary-reduction ceiling
ok - 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited
ok - 2026 health FSA carryover sits on top of the IRC 125(i) limit
ok - a health FSA grace period precludes a carryover
ok - a health FSA offering neither carryover nor grace period forfeits the whole unused amount
ok - a health FSA carryover and grace period asserted together are refused
ok - nothing may be carried into 2013, the first year the carryover existed
ok - a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled
ok - a prior-year unused amount without a stated plan option asks for the fact
ok - a health FSA election above the IRC 125(i) limit is reported, not truncated
ok - an account type that did not exist for the tax year reports no exclusion
ok - a pre-2013 health FSA still excludes its salary reduction under IRC 125(a)
ok - a pre-2013 health FSA with a supplied plan maximum reports that maximum
ok - two unrelated employers each carry a full health FSA limit
ok - two health FSAs of one employer share a single IRC 125(i) limit
ok - spouses filing jointly each carry a full health FSA limit
ok - non-elective employer flex credits stay outside the IRC 125(i) limit
ok - flex credits electable as cash consume the IRC 125(i) limit
ok - flex credits without a stated cash election ask for the fact
ok - a lower plan-document health FSA limit binds
ok - a lower plan-document limit caps its own arrangement, not the employer group
ok - exceeding a plan-document limit is not the IRC 125(i) qualification failure
ok - a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate
ok - a bare FSA account type is rejected as ambiguous
ok - an unrecognised health FSA purpose is rejected
ok - 2025 dependent care assistance exclusion on a single return
ok - 2025 dependent care exclusion is halved on a married separate return
ok - an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount
ok - a separate return that states it is still married keeps the halved amount
ok - 2021 only, the ARPA dependent care exclusion is 10500
ok - 2022 reverts to the pre-ARPA dependent care exclusion
ok - 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21
ok - the IRC 129(b)(1) earned income limitation binds below the statutory amount
ok - the IRC 129(b)(1) limitation is asked for when the earned income facts are absent
ok - the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled
ok - spouses filing jointly share one IRC 129 household exclusion
ok - married separate spouses do not share one IRC 129 exclusion
ok - the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs
ok - a dependent care plan document below the IRC 129 amount binds this arrangement
ok - a dependent care plan document caps its own arrangement, not the household amount
ok - the IRC 129(b)(1) ceiling does not pool across married separate returns
ok - 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling
ok - 1986 dependent care with no ceiling from any source stays indeterminate
ok - 1981 predates IRC 129 entirely
ok - a health FSA and a dependent care FSA carry independent limits
ok - a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures
ok - a limited-purpose health FSA raises no IRC 223 conflict
ok - a post-deductible health FSA raises no IRC 223 conflict
ok - a health FSA of unstated purpose makes the IRC 223 limitation indeterminate
ok - a spouse's general-purpose health FSA disqualifies the other spouse's HSA
ok - a general-purpose health FSA carryover disqualifies the whole receiving plan year
ok - a general-purpose health FSA grace period extends the IRC 223 disqualification
ok - a dependent care FSA raises no IRC 223 conflict at all
ok - 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit
ok - 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok - 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok - 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs
ok - 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance
ok - 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance
ok - 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance
ok - 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i)
ok - 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance
ok - a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing
ok - 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount
ok - 2023 has no pension-linked emergency savings account
ok - a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate
ok - a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k)
ok - a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure
ok - a pension-linked emergency savings account needs no birth year
ok - 2026 a spouse's contradictory coverage tiers leave IRC 223(b)(5)(A) applicability unknown, self-only account listed first
ok - 2026 the same contradictory spouse coverage gives the same answer with the family account listed first
ok - 2026 a spouse's coverage facts that conflict only in the annual deductible leave the other spouse determinate
ok - 2026 a spouse's coverage conflict outside the owner's eligible months leaves the owner determinate
ok - 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies
ok - 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit
ok - 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate

196 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> us-tax-advantaged-params@0.3.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> us-tax-advantaged-params@0.3.0 generate:check
> node scripts/generate.mjs --check


> us-tax-advantaged-params@0.3.0 clean
> node scripts/clean.mjs
```

**stderr**

_(no output)_

### ESM/CommonJS smoke imports

Command: `node scripts/smoke-imports.mjs`

**stdout**

```text
ESM and CommonJS smoke imports passed.
```

**stderr**

_(no output)_

### Complete TypeScript/PHP output parity

Command: `node scripts/check-parity.mjs`

**stdout**

```text
TypeScript/PHP full-output parity passed for 196 vectors.
```

**stderr**

_(no output)_

### Built-package manifest validation

Command: `node scripts/validate-manifests.mjs --built`

**stdout**

```text
Manifest validation passed with built artifacts.
```

**stderr**

_(no output)_

### npm package dry run

Command: `npm pack --dry-run --ignore-scripts --json`

**stdout**

```text
[
  {
    "id": "us-tax-advantaged-params@0.3.0",
    "name": "us-tax-advantaged-params",
    "version": "0.3.0",
    "size": 278653,
    "unpackedSize": 2200518,
    "shasum": "62835a91c245aaa4338577866db36b2efe151c50",
    "integrity": "sha512-dIw8A4OztCZUn4YVUR4Sf7P2WxyP1FCcUJWpjN0ZgwQF70LWf5gRxht+g0G9Jn46CwvD1BLjwWsTdYtOQQFqHQ==",
    "filename": "us-tax-advantaged-params-0.3.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 55565,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 15897,
        "mode": 420
      },
      {
        "path": "data/fsa-parameters.json",
        "size": 28829,
        "mode": 420
      },
      {
        "path": "data/hsa-parameters.json",
        "size": 19834,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 182178,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 575517,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 317807,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 574593,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 317932,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 53450,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 53450,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 4374,
        "mode": 420
      }
    ],
    "entryCount": 14,
    "bundled": []
  }
]
```

**stderr**

_(no output)_

### Composer manifest validation

Command: `composer validate --strict`

**stdout**

```text
./composer.json is valid
```

**stderr**

```text
Composer plugins have been disabled for safety in this non-interactive session.
Set COMPOSER_ALLOW_SUPERUSER=1 if you want to allow plugins to run as root/super user.
Do not run Composer as root/super user! See https://getcomposer.org/root for details
```

