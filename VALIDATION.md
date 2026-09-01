# Validation Report

- **Package:** `us-tax-advantaged-params@0.3.0`
- **Run:** 2026-09-01T22:45:49.827Z through 2026-09-01T22:45:53.631Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 185
- **Node:** v22.22.2
- **npm:** 10.9.7
- **TypeScript:** Version 7.0.2
- **PHP:** 8.4.19
- **Composer:** Composer version 2.8.12 2025-09-19 13:41:59

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 64 ms |
| Generated native parameter blocks | PASS | 0 | 64 ms |
| Source manifests and publication files | PASS | 0 | 61 ms |
| Strict TypeScript typecheck | PASS | 0 | 189 ms |
| TypeScript unit and conformance tests | PASS | 0 | 807 ms |
| PHP engine syntax | PASS | 0 | 41 ms |
| PHP unit-test syntax | PASS | 0 | 29 ms |
| PHP conformance-test syntax | PASS | 0 | 28 ms |
| PHP parity runner syntax | PASS | 0 | 28 ms |
| PHP unit tests | PASS | 0 | 42 ms |
| PHP conformance vectors | PASS | 0 | 52 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 1136 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 67 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 202 ms |
| Built-package manifest validation | PASS | 0 | 63 ms |
| npm package dry run | PASS | 0 | 460 ms |
| Composer manifest validation | PASS | 0 | 147 ms |

## Runtime qualification note

The local container provides PHP 8.4.19, below the PHP 8.5 floor composer.json declares. The GitHub Actions workflow tests the supported matrix. Do not publish without a green PHP CI matrix.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 45 contiguous FSA tax years, 70 sources, 185 conformance vectors.
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
  duration_ms: 3.439765
  type: 'test'
  ...
# Subtest: normalizes common filing-status and account aliases
ok 2 - normalizes common filing-status and account aliases
  ---
  duration_ms: 0.509126
  type: 'test'
  ...
# Subtest: 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
ok 3 - 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
  ---
  duration_ms: 14.839031
  type: 'test'
  ...
# Subtest: 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
ok 4 - 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
  ---
  duration_ms: 0.629699
  type: 'test'
  ...
# Subtest: high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
ok 5 - high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
  ---
  duration_ms: 0.467882
  type: 'test'
  ...
# Subtest: 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
ok 6 - 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
  ---
  duration_ms: 0.946042
  type: 'test'
  ...
# Subtest: 2026 active-participant traditional IRA deduction phases out while total contribution remains available
ok 7 - 2026 active-participant traditional IRA deduction phases out while total contribution remains available
  ---
  duration_ms: 0.864694
  type: 'test'
  ...
# Subtest: traditional and Roth IRAs share one owner-level contribution pool
ok 8 - traditional and Roth IRAs share one owner-level contribution pool
  ---
  duration_ms: 0.572661
  type: 'test'
  ...
# Subtest: reports the quantified amount of an existing contribution above an account ceiling
ok 9 - reports the quantified amount of an existing contribution above an account ceiling
  ---
  duration_ms: 0.62052
  type: 'test'
  ...
# Subtest: 401(k) and 457(b) employee limits are separate
ok 10 - 401(k) and 457(b) employee limits are separate
  ---
  duration_ms: 1.258388
  type: 'test'
  ...
# Subtest: two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
ok 11 - two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
  ---
  duration_ms: 0.73049
  type: 'test'
  ...
# Subtest: mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
ok 12 - mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
  ---
  duration_ms: 0.419219
  type: 'test'
  ...
# Subtest: self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
ok 13 - self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
  ---
  duration_ms: 0.48739
  type: 'test'
  ...
# Subtest: self-employed SEP maximum uses the reduced 20% net-earnings rate
ok 14 - self-employed SEP maximum uses the reduced 20% net-earnings rate
  ---
  duration_ms: 0.420379
  type: 'test'
  ...
# Subtest: 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
ok 15 - 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
  ---
  duration_ms: 0.635263
  type: 'test'
  ...
# Subtest: 457(b) last-three-years catch-up is selected when larger than the age catch-up
ok 16 - 457(b) last-three-years catch-up is selected when larger than the age catch-up
  ---
  duration_ms: 0.344035
  type: 'test'
  ...
# Subtest: 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
ok 17 - 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
  ---
  duration_ms: 0.310704
  type: 'test'
  ...
# Subtest: pre-1987 401(k) maximum is explicitly indeterminate rather than invented
ok 18 - pre-1987 401(k) maximum is explicitly indeterminate rather than invented
  ---
  duration_ms: 0.32313
  type: 'test'
  ...
# Subtest: 1981 active employer-plan participant is ineligible for the modeled IRA contribution
ok 19 - 1981 active employer-plan participant is ineligible for the modeled IRA contribution
  ---
  duration_ms: 0.399167
  type: 'test'
  ...
# Subtest: 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing
ok 20 - 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing
  ---
  duration_ms: 0.263213
  type: 'test'
  ...
# Subtest: 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000
ok 21 - 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000
  ---
  duration_ms: 0.357235
  type: 'test'
  ...
# Subtest: pre-2020 traditional IRA age-70½ restriction is enforced
ok 22 - pre-2020 traditional IRA age-70½ restriction is enforced
  ---
  duration_ms: 0.385397
  type: 'test'
  ...
# Subtest: IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
ok 23 - IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
  ---
  duration_ms: 0.812636
  type: 'test'
  ...
# Subtest: in-plan Roth rollover reports only the pre-tax portion as taxable
ok 24 - in-plan Roth rollover reports only the pre-tax portion as taxable
  ---
  duration_ms: 0.524146
  type: 'test'
  ...
# Subtest: defined-benefit and cash-balance contributions remain actuarially indeterminate
ok 25 - defined-benefit and cash-balance contributions remain actuarially indeterminate
  ---
  duration_ms: 0.329952
  type: 'test'
  ...
# Subtest: 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
ok 26 - 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
  ---
  duration_ms: 0.587611
  type: 'test'
  ...
# Subtest: self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
ok 27 - self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
  ---
  duration_ms: 0.425946
  type: 'test'
  ...
# Subtest: pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
ok 28 - pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
  ---
  duration_ms: 0.328448
  type: 'test'
  ...
# Subtest: additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
ok 29 - additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
  ---
  duration_ms: 0.371256
  type: 'test'
  ...
# Subtest: SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
ok 30 - SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
  ---
  duration_ms: 0.290026
  type: 'test'
  ...
# Subtest: multiple 403(b) accounts share one owner-level 15-year catch-up pool
ok 31 - multiple 403(b) accounts share one owner-level 15-year catch-up pool
  ---
  duration_ms: 0.99411
  type: 'test'
  ...
# Subtest: Roth employer contributions are rejected before their 2023 effective year
ok 32 - Roth employer contributions are rejected before their 2023 effective year
  ---
  duration_ms: 0.382058
  type: 'test'
  ...
# Subtest: multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
ok 33 - multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
  ---
  duration_ms: 0.334478
  type: 'test'
  ...
# Subtest: duplicate taxpayer or spouse roles are rejected
ok 34 - duplicate taxpayer or spouse roles are rejected
  ---
  duration_ms: 0.195627
  type: 'test'
  ...
# Subtest: ambiguous M alias is accepted but produces a diagnostic
ok 35 - ambiguous M alias is accepted but produces a diagnostic
  ---
  duration_ms: 0.256939
  type: 'test'
  ...
# Subtest: 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
ok 36 - 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
  ---
  duration_ms: 0.279056
  type: 'test'
  ...
# Subtest: 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
ok 37 - 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
  ---
  duration_ms: 0.437554
  type: 'test'
  ...
# Subtest: 1997 employer match uses recognized compensation without capping employee elective deferrals
ok 38 - 1997 employer match uses recognized compensation without capping employee elective deferrals
  ---
  duration_ms: 0.24808
  type: 'test'
  ...
# Subtest: 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
ok 39 - 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
  ---
  duration_ms: 0.255971
  type: 'test'
  ...
# Subtest: 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
ok 40 - 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
  ---
  duration_ms: 0.174346
  type: 'test'
  ...
# Subtest: exposes the IRC 125 and IRC 129 parameter table without extrapolating it
ok 41 - exposes the IRC 125 and IRC 129 parameter table without extrapolating it
  ---
  duration_ms: 0.213717
  type: 'test'
  ...
# Subtest: rejects a bare FSA account type but accepts each unambiguous spelling
ok 42 - rejects a bare FSA account type but accepts each unambiguous spelling
  ---
  duration_ms: 0.096362
  type: 'test'
  ...
# Subtest: validates health FSA plan facts before calculating anything
ok 43 - validates health FSA plan facts before calculating anything
  ---
  duration_ms: 0.610666
  type: 'test'
  ...
# Subtest: the health FSA builder reaches every IRC 125(i) plan fact
ok 44 - the health FSA builder reaches every IRC 125(i) plan fact
  ---
  duration_ms: 0.454723
  type: 'test'
  ...
# Subtest: validates IRC 129 earned income facts before calculating anything
ok 45 - validates IRC 129 earned income facts before calculating anything
  ---
  duration_ms: 0.457172
  type: 'test'
  ...
# Subtest: the dependent care builder reaches the IRC 129(b) earned income facts
ok 46 - the dependent care builder reaches the IRC 129(b) earned income facts
  ---
  duration_ms: 0.43956
  type: 'test'
  ...
# Subtest: conformance: ordinary 2026 401k plan-term capacity
ok 47 - conformance: ordinary 2026 401k plan-term capacity
  ---
  duration_ms: 15.086121
  type: 'test'
  ...
# Subtest: conformance: 2026 high-wage age-60-to-63 Roth catch-up
ok 48 - conformance: 2026 high-wage age-60-to-63 Roth catch-up
  ---
  duration_ms: 1.669959
  type: 'test'
  ...
# Subtest: conformance: 2026 Roth IRA MFJ phaseout
ok 49 - conformance: 2026 Roth IRA MFJ phaseout
  ---
  duration_ms: 0.548453
  type: 'test'
  ...
# Subtest: conformance: shared traditional and Roth IRA pool
ok 50 - conformance: shared traditional and Roth IRA pool
  ---
  duration_ms: 0.752054
  type: 'test'
  ...
# Subtest: conformance: 401k and governmental 457b are separate
ok 51 - conformance: 401k and governmental 457b are separate
  ---
  duration_ms: 0.829796
  type: 'test'
  ...
# Subtest: conformance: mega backdoor 401k fills 415c
ok 52 - conformance: mega backdoor 401k fills 415c
  ---
  duration_ms: 0.421759
  type: 'test'
  ...
# Subtest: conformance: self-employed solo 401k
ok 53 - conformance: self-employed solo 401k
  ---
  duration_ms: 0.350125
  type: 'test'
  ...
# Subtest: conformance: 403b 15-year catch-up
ok 54 - conformance: 403b 15-year catch-up
  ---
  duration_ms: 0.417299
  type: 'test'
  ...
# Subtest: conformance: 457b special last-three-years catch-up
ok 55 - conformance: 457b special last-three-years catch-up
  ---
  duration_ms: 0.627508
  type: 'test'
  ...
# Subtest: conformance: 1994 historical employer-plan limits
ok 56 - conformance: 1994 historical employer-plan limits
  ---
  duration_ms: 0.523777
  type: 'test'
  ...
# Subtest: conformance: 1985 employer-plan limit remains indeterminate
ok 57 - conformance: 1985 employer-plan limit remains indeterminate
  ---
  duration_ms: 0.268039
  type: 'test'
  ...
# Subtest: conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule
ok 58 - conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule
  ---
  duration_ms: 0.363369
  type: 'test'
  ...
# Subtest: conformance: 1982 nonworking spouse IRA
ok 59 - conformance: 1982 nonworking spouse IRA
  ---
  duration_ms: 0.17566
  type: 'test'
  ...
# Subtest: conformance: IRA conversion Form 8606 pro-rata
ok 60 - conformance: IRA conversion Form 8606 pro-rata
  ---
  duration_ms: 0.569161
  type: 'test'
  ...
# Subtest: conformance: in-plan Roth rollover basis
ok 61 - conformance: in-plan Roth rollover basis
  ---
  duration_ms: 0.490975
  type: 'test'
  ...
# Subtest: conformance: 2026 enhanced SIMPLE
ok 62 - conformance: 2026 enhanced SIMPLE
  ---
  duration_ms: 0.408365
  type: 'test'
  ...
# Subtest: conformance: cash-balance contribution is actuarial
ok 63 - conformance: cash-balance contribution is actuarial
  ---
  duration_ms: 0.36072
  type: 'test'
  ...
# Subtest: conformance: self-employed retirement deduction classification
ok 64 - conformance: self-employed retirement deduction classification
  ---
  duration_ms: 0.338726
  type: 'test'
  ...
# Subtest: conformance: 2009 MFS living apart Roth conversion
ok 65 - conformance: 2009 MFS living apart Roth conversion
  ---
  duration_ms: 0.189786
  type: 'test'
  ...
# Subtest: conformance: SIMPLE additional nonelective 10 percent cap
ok 66 - conformance: SIMPLE additional nonelective 10 percent cap
  ---
  duration_ms: 0.195663
  type: 'test'
  ...
# Subtest: conformance: SIMPLE IRA Roth catch-up wage-test exclusion
ok 67 - conformance: SIMPLE IRA Roth catch-up wage-test exclusion
  ---
  duration_ms: 0.17087
  type: 'test'
  ...
# Subtest: conformance: aggregate 403b 15-year catch-up pool
ok 68 - conformance: aggregate 403b 15-year catch-up pool
  ---
  duration_ms: 0.234279
  type: 'test'
  ...
# Subtest: conformance: pre-2023 Roth employer contribution unavailable
ok 69 - conformance: pre-2023 Roth employer contribution unavailable
  ---
  duration_ms: 0.147147
  type: 'test'
  ...
# Subtest: conformance: aggregate IRA conversion basis penny allocation
ok 70 - conformance: aggregate IRA conversion basis penny allocation
  ---
  duration_ms: 1.132563
  type: 'test'
  ...
# Subtest: conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
ok 71 - conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
  ---
  duration_ms: 0.427892
  type: 'test'
  ...
# Subtest: conformance: 1997 nonelective formula applies 401a17 compensation ceiling
ok 72 - conformance: 1997 nonelective formula applies 401a17 compensation ceiling
  ---
  duration_ms: 0.279777
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
ok 73 - conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
  ---
  duration_ms: 0.130352
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
ok 74 - conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
  ---
  duration_ms: 0.102489
  type: 'test'
  ...
# Subtest: conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold
ok 75 - conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold
  ---
  duration_ms: 0.166981
  type: 'test'
  ...
# Subtest: conformance: 2005 designated Roth governmental 457b unavailable
ok 76 - conformance: 2005 designated Roth governmental 457b unavailable
  ---
  duration_ms: 0.175492
  type: 'test'
  ...
# Subtest: conformance: 2011 first-year designated Roth governmental 457b
ok 77 - conformance: 2011 first-year designated Roth governmental 457b
  ---
  duration_ms: 0.11147
  type: 'test'
  ...
# Subtest: conformance: 2025 SIMPLE 401k match capped by 401a17 compensation
ok 78 - conformance: 2025 SIMPLE 401k match capped by 401a17 compensation
  ---
  duration_ms: 0.195496
  type: 'test'
  ...
# Subtest: conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap
ok 79 - conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap
  ---
  duration_ms: 0.096857
  type: 'test'
  ...
# Subtest: conformance: 2026 MFS living together Roth IRA phase-out
ok 80 - conformance: 2026 MFS living together Roth IRA phase-out
  ---
  duration_ms: 0.12135
  type: 'test'
  ...
# Subtest: conformance: 2026 MFS living together covered traditional IRA deduction phase-out
ok 81 - conformance: 2026 MFS living together covered traditional IRA deduction phase-out
  ---
  duration_ms: 0.186004
  type: 'test'
  ...
# Subtest: conformance: 2026 modern spousal IRA from joint compensation
ok 82 - conformance: 2026 modern spousal IRA from joint compensation
  ---
  duration_ms: 0.172359
  type: 'test'
  ...
# Subtest: conformance: 2026 noncovered spouse deduction phase-out band
ok 83 - conformance: 2026 noncovered spouse deduction phase-out band
  ---
  duration_ms: 0.124414
  type: 'test'
  ...
# Subtest: conformance: 2026 ordinary age-50 catch-up at age 56
ok 84 - conformance: 2026 ordinary age-50 catch-up at age 56
  ---
  duration_ms: 0.135482
  type: 'test'
  ...
# Subtest: conformance: 2026 age-64 reversion from enhanced catch-up
ok 85 - conformance: 2026 age-64 reversion from enhanced catch-up
  ---
  duration_ms: 0.100577
  type: 'test'
  ...
# Subtest: conformance: 2023 first-year Roth employer contribution
ok 86 - conformance: 2023 first-year Roth employer contribution
  ---
  duration_ms: 0.098868
  type: 'test'
  ...
# Subtest: conformance: 2010 Roth conversion after MAGI repeal
ok 87 - conformance: 2010 Roth conversion after MAGI repeal
  ---
  duration_ms: 0.108124
  type: 'test'
  ...
# Subtest: conformance: 2020 traditional IRA contribution after age-70-half repeal
ok 88 - conformance: 2020 traditional IRA contribution after age-70-half repeal
  ---
  duration_ms: 0.092653
  type: 'test'
  ...
# Subtest: conformance: 1975 first-year traditional IRA fifteen percent limit
ok 89 - conformance: 1975 first-year traditional IRA fifteen percent limit
  ---
  duration_ms: 0.090699
  type: 'test'
  ...
# Subtest: conformance: unsupported tax year 1974
ok 90 - conformance: unsupported tax year 1974
  ---
  duration_ms: 0.452756
  type: 'test'
  ...
# Subtest: conformance: duplicate account id
ok 91 - conformance: duplicate account id
  ---
  duration_ms: 0.144319
  type: 'test'
  ...
# Subtest: conformance: unknown account owner
ok 92 - conformance: unknown account owner
  ---
  duration_ms: 0.089572
  type: 'test'
  ...
# Subtest: conformance: negative compensation is invalid money
ok 93 - conformance: negative compensation is invalid money
  ---
  duration_ms: 0.059585
  type: 'test'
  ...
# Subtest: conformance: invalid filing status alias
ok 94 - conformance: invalid filing status alias
  ---
  duration_ms: 0.114735
  type: 'test'
  ...
# Subtest: conformance: 2026 full-year self-only HSA limit
ok 95 - conformance: 2026 full-year self-only HSA limit
  ---
  duration_ms: 0.786873
  type: 'test'
  ...
# Subtest: conformance: 2026 full-year family HSA limit
ok 96 - conformance: 2026 full-year family HSA limit
  ---
  duration_ms: 0.231405
  type: 'test'
  ...
# Subtest: conformance: 2026 mid-year HSA coverage change prorated by month
ok 97 - conformance: 2026 mid-year HSA coverage change prorated by month
  ---
  duration_ms: 0.805862
  type: 'test'
  ...
# Subtest: conformance: 2026 both spouses age 55 receive separate HSA catch-ups
ok 98 - conformance: 2026 both spouses age 55 receive separate HSA catch-ups
  ---
  duration_ms: 0.868672
  type: 'test'
  ...
# Subtest: conformance: 2026 spouses divide the single family HSA limit as agreed
ok 99 - conformance: 2026 spouses divide the single family HSA limit as agreed
  ---
  duration_ms: 0.400084
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule with a satisfied testing period
ok 100 - conformance: 2026 HSA last-month rule with a satisfied testing period
  ---
  duration_ms: 0.29749
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule failed in the testing period
ok 101 - conformance: 2026 HSA last-month rule failed in the testing period
  ---
  duration_ms: 0.377951
  type: 'test'
  ...
# Subtest: conformance: 2005 HSA monthly limit capped by the plan annual deductible
ok 102 - conformance: 2005 HSA monthly limit capped by the plan annual deductible
  ---
  duration_ms: 0.30135
  type: 'test'
  ...
# Subtest: conformance: 2006 HSA monthly limit capped by the statutory dollar amount
ok 103 - conformance: 2006 HSA monthly limit capped by the statutory dollar amount
  ---
  duration_ms: 0.211089
  type: 'test'
  ...
# Subtest: conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok 104 - conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
  ---
  duration_ms: 1.105823
  type: 'test'
  ...
# Subtest: conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
ok 105 - conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate
  ---
  duration_ms: 0.234053
  type: 'test'
  ...
# Subtest: conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate
ok 106 - conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate
  ---
  duration_ms: 0.235843
  type: 'test'
  ...
# Subtest: conformance: 2026 employer HSA contribution is excluded rather than deducted
ok 107 - conformance: 2026 employer HSA contribution is excluded rather than deducted
  ---
  duration_ms: 0.198961
  type: 'test'
  ...
# Subtest: conformance: 2003 predates IRC 223 health savings accounts
ok 108 - conformance: 2003 predates IRC 223 health savings accounts
  ---
  duration_ms: 0.125853
  type: 'test'
  ...
# Subtest: conformance: 2026 HSA last-month rule with an unresolved testing period
ok 109 - conformance: 2026 HSA last-month rule with an unresolved testing period
  ---
  duration_ms: 0.311914
  type: 'test'
  ...
# Subtest: conformance: 2026 married filing separately family coverage recharacterizes the other spouse
ok 110 - conformance: 2026 married filing separately family coverage recharacterizes the other spouse
  ---
  duration_ms: 0.30511
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse family and self-only months divide only the family portion
ok 111 - conformance: 2026 spouse family and self-only months divide only the family portion
  ---
  duration_ms: 0.261454
  type: 'test'
  ...
# Subtest: conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit
ok 112 - conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit
  ---
  duration_ms: 0.163158
  type: 'test'
  ...
# Subtest: conformance: 2026 married last-month rule measures the attributable amount against the divided limit
ok 113 - conformance: 2026 married last-month rule measures the attributable amount against the divided limit
  ---
  duration_ms: 0.199767
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months
ok 114 - conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months
  ---
  duration_ms: 0.127686
  type: 'test'
  ...
# Subtest: conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate
ok 115 - conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate
  ---
  duration_ms: 0.239254
  type: 'test'
  ...
# Subtest: conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact
ok 116 - conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact
  ---
  duration_ms: 0.159627
  type: 'test'
  ...
# Subtest: conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A)
ok 117 - conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A)
  ---
  duration_ms: 0.147792
  type: 'test'
  ...
# Subtest: conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division
ok 118 - conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division
  ---
  duration_ms: 0.145357
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount
ok 119 - conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount
  ---
  duration_ms: 0.095403
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched
ok 120 - conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched
  ---
  duration_ms: 0.097915
  type: 'test'
  ...
# Subtest: conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below
ok 121 - conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below
  ---
  duration_ms: 0.107903
  type: 'test'
  ...
# Subtest: conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule
ok 122 - conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule
  ---
  duration_ms: 0.147989
  type: 'test'
  ...
# Subtest: conformance: persons entry that is not an object is rejected
ok 123 - conformance: persons entry that is not an object is rejected
  ---
  duration_ms: 0.082156
  type: 'test'
  ...
# Subtest: conformance: accounts entry that is not an object is rejected
ok 124 - conformance: accounts entry that is not an object is rejected
  ---
  duration_ms: 0.075591
  type: 'test'
  ...
# Subtest: conformance: conversions entry that is not an object is rejected
ok 125 - conformance: conversions entry that is not an object is rejected
  ---
  duration_ms: 0.124615
  type: 'test'
  ...
# Subtest: conformance: account without an ownerId is rejected
ok 126 - conformance: account without an ownerId is rejected
  ---
  duration_ms: 0.184531
  type: 'test'
  ...
# Subtest: conformance: conversion without an ownerId is rejected
ok 127 - conformance: conversion without an ownerId is rejected
  ---
  duration_ms: 0.103995
  type: 'test'
  ...
# Subtest: conformance: unrecognized contributionPreference is rejected
ok 128 - conformance: unrecognized contributionPreference is rejected
  ---
  duration_ms: 0.070878
  type: 'test'
  ...
# Subtest: conformance: unrecognized employerContributionTaxTreatment is rejected
ok 129 - conformance: unrecognized employerContributionTaxTreatment is rejected
  ---
  duration_ms: 0.05419
  type: 'test'
  ...
# Subtest: conformance: rate outside 0 through 1 is rejected
ok 130 - conformance: rate outside 0 through 1 is rejected
  ---
  duration_ms: 0.066542
  type: 'test'
  ...
# Subtest: conformance: existing contributions above the account ceiling name the amounts
ok 131 - conformance: existing contributions above the account ceiling name the amounts
  ---
  duration_ms: 0.300965
  type: 'test'
  ...
# Subtest: conformance: taxYear that is not an integer is rejected
ok 132 - conformance: taxYear that is not an integer is rejected
  ---
  duration_ms: 0.051668
  type: 'test'
  ...
# Subtest: conformance: missing filingStatus is rejected rather than defaulted
ok 133 - conformance: missing filingStatus is rejected rather than defaulted
  ---
  duration_ms: 0.138451
  type: 'test'
  ...
# Subtest: conformance: filingStatus that is not a string is rejected
ok 134 - conformance: filingStatus that is not a string is rejected
  ---
  duration_ms: 0.048798
  type: 'test'
  ...
# Subtest: conformance: accounts that is not an array is rejected
ok 135 - conformance: accounts that is not an array is rejected
  ---
  duration_ms: 0.054623
  type: 'test'
  ...
# Subtest: conformance: conversions that is not an array is rejected
ok 136 - conformance: conversions that is not an array is rejected
  ---
  duration_ms: 0.065004
  type: 'test'
  ...
# Subtest: conformance: account type that is not a string is rejected
ok 137 - conformance: account type that is not a string is rejected
  ---
  duration_ms: 0.052885
  type: 'test'
  ...
# Subtest: conformance: person id that is not a string is rejected
ok 138 - conformance: person id that is not a string is rejected
  ---
  duration_ms: 0.04806
  type: 'test'
  ...
# Subtest: conformance: structured input field that is not an object is rejected
ok 139 - conformance: structured input field that is not an object is rejected
  ---
  duration_ms: 0.041826
  type: 'test'
  ...
# Subtest: conformance: unrecognized simpleEmployerContributionMethod is rejected
ok 140 - conformance: unrecognized simpleEmployerContributionMethod is rejected
  ---
  duration_ms: 0.05545
  type: 'test'
  ...
# Subtest: conformance: 1989 fractional plan-term capacity keeps its fraction in the message
ok 141 - conformance: 1989 fractional plan-term capacity keeps its fraction in the message
  ---
  duration_ms: 0.23534
  type: 'test'
  ...
# Subtest: conformance: flag field that is not a boolean is rejected
ok 142 - conformance: flag field that is not a boolean is rejected
  ---
  duration_ms: 0.081243
  type: 'test'
  ...
# Subtest: conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C)
ok 143 - conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C)
  ---
  duration_ms: 0.183283
  type: 'test'
  ...
# Subtest: conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount
ok 144 - conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount
  ---
  duration_ms: 0.122121
  type: 'test'
  ...
# Subtest: conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero
ok 145 - conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero
  ---
  duration_ms: 0.134906
  type: 'test'
  ...
# Subtest: conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division
ok 146 - conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division
  ---
  duration_ms: 0.298741
  type: 'test'
  ...
# Subtest: conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead
ok 147 - conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead
  ---
  duration_ms: 0.25044
  type: 'test'
  ...
# Subtest: conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount
ok 148 - conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount
  ---
  duration_ms: 0.183168
  type: 'test'
  ...
# Subtest: conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides
ok 149 - conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides
  ---
  duration_ms: 0.123109
  type: 'test'
  ...
# Subtest: conformance: 2026 family-limit shares that do not exhaust the limitation are not a division
ok 150 - conformance: 2026 family-limit shares that do not exhaust the limitation are not a division
  ---
  duration_ms: 0.151364
  type: 'test'
  ...
# Subtest: conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing
ok 151 - conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing
  ---
  duration_ms: 0.16681
  type: 'test'
  ...
# Subtest: conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
ok 152 - conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
  ---
  duration_ms: 0.188989
  type: 'test'
  ...
# Subtest: conformance: 2026 incomplete family-limit shares report only the missing-share error
ok 153 - conformance: 2026 incomplete family-limit shares report only the missing-share error
  ---
  duration_ms: 0.195423
  type: 'test'
  ...
# Subtest: conformance: 2026 flexible spending arrangement parameters are published in the result
ok 154 - conformance: 2026 flexible spending arrangement parameters are published in the result
  ---
  duration_ms: 0.088944
  type: 'test'
  ...
# Subtest: conformance: 2012 health FSA exists with no statutory ceiling rather than not existing
ok 155 - conformance: 2012 health FSA exists with no statutory ceiling rather than not existing
  ---
  duration_ms: 0.075492
  type: 'test'
  ...
# Subtest: conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all
ok 156 - conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all
  ---
  duration_ms: 7.979826
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA election at the IRC 125(i) limit
ok 157 - conformance: 2026 health FSA election at the IRC 125(i) limit
  ---
  duration_ms: 0.512457
  type: 'test'
  ...
# Subtest: conformance: 2013 is the first year IRC 125(i) limits a health FSA election
ok 158 - conformance: 2013 is the first year IRC 125(i) limits a health FSA election
  ---
  duration_ms: 0.200769
  type: 'test'
  ...
# Subtest: conformance: 2012 health FSA has no statutory salary-reduction ceiling
ok 159 - conformance: 2012 health FSA has no statutory salary-reduction ceiling
  ---
  duration_ms: 0.129999
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited
ok 160 - conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited
  ---
  duration_ms: 0.235673
  type: 'test'
  ...
# Subtest: conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit
ok 161 - conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit
  ---
  duration_ms: 0.142979
  type: 'test'
  ...
# Subtest: conformance: a health FSA grace period precludes a carryover
ok 162 - conformance: a health FSA grace period precludes a carryover
  ---
  duration_ms: 0.172037
  type: 'test'
  ...
# Subtest: conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount
ok 163 - conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount
  ---
  duration_ms: 0.129287
  type: 'test'
  ...
# Subtest: conformance: a health FSA carryover and grace period asserted together are refused
ok 164 - conformance: a health FSA carryover and grace period asserted together are refused
  ---
  duration_ms: 0.099076
  type: 'test'
  ...
# Subtest: conformance: nothing may be carried into 2013, the first year the carryover existed
ok 165 - conformance: nothing may be carried into 2013, the first year the carryover existed
  ---
  duration_ms: 0.094929
  type: 'test'
  ...
# Subtest: conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled
ok 166 - conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled
  ---
  duration_ms: 0.105218
  type: 'test'
  ...
# Subtest: conformance: a prior-year unused amount without a stated plan option asks for the fact
ok 167 - conformance: a prior-year unused amount without a stated plan option asks for the fact
  ---
  duration_ms: 0.142385
  type: 'test'
  ...
# Subtest: conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated
ok 168 - conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated
  ---
  duration_ms: 0.137093
  type: 'test'
  ...
# Subtest: conformance: an account type that did not exist for the tax year reports no exclusion
ok 169 - conformance: an account type that did not exist for the tax year reports no exclusion
  ---
  duration_ms: 0.1791
  type: 'test'
  ...
# Subtest: conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a)
ok 170 - conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a)
  ---
  duration_ms: 0.148643
  type: 'test'
  ...
# Subtest: conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum
ok 171 - conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum
  ---
  duration_ms: 0.12934
  type: 'test'
  ...
# Subtest: conformance: two unrelated employers each carry a full health FSA limit
ok 172 - conformance: two unrelated employers each carry a full health FSA limit
  ---
  duration_ms: 0.2133
  type: 'test'
  ...
# Subtest: conformance: two health FSAs of one employer share a single IRC 125(i) limit
ok 173 - conformance: two health FSAs of one employer share a single IRC 125(i) limit
  ---
  duration_ms: 0.171827
  type: 'test'
  ...
# Subtest: conformance: spouses filing jointly each carry a full health FSA limit
ok 174 - conformance: spouses filing jointly each carry a full health FSA limit
  ---
  duration_ms: 0.145504
  type: 'test'
  ...
# Subtest: conformance: non-elective employer flex credits stay outside the IRC 125(i) limit
ok 175 - conformance: non-elective employer flex credits stay outside the IRC 125(i) limit
  ---
  duration_ms: 2.354205
  type: 'test'
  ...
# Subtest: conformance: flex credits electable as cash consume the IRC 125(i) limit
ok 176 - conformance: flex credits electable as cash consume the IRC 125(i) limit
  ---
  duration_ms: 0.251269
  type: 'test'
  ...
# Subtest: conformance: flex credits without a stated cash election ask for the fact
ok 177 - conformance: flex credits without a stated cash election ask for the fact
  ---
  duration_ms: 0.14672
  type: 'test'
  ...
# Subtest: conformance: a lower plan-document health FSA limit binds
ok 178 - conformance: a lower plan-document health FSA limit binds
  ---
  duration_ms: 0.146903
  type: 'test'
  ...
# Subtest: conformance: a lower plan-document limit caps its own arrangement, not the employer group
ok 179 - conformance: a lower plan-document limit caps its own arrangement, not the employer group
  ---
  duration_ms: 0.19224
  type: 'test'
  ...
# Subtest: conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure
ok 180 - conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure
  ---
  duration_ms: 0.129879
  type: 'test'
  ...
# Subtest: conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate
ok 181 - conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate
  ---
  duration_ms: 0.095193
  type: 'test'
  ...
# Subtest: conformance: a bare FSA account type is rejected as ambiguous
ok 182 - conformance: a bare FSA account type is rejected as ambiguous
  ---
  duration_ms: 0.080668
  type: 'test'
  ...
# Subtest: conformance: an unrecognised health FSA purpose is rejected
ok 183 - conformance: an unrecognised health FSA purpose is rejected
  ---
  duration_ms: 0.063115
  type: 'test'
  ...
# Subtest: conformance: 2025 dependent care assistance exclusion on a single return
ok 184 - conformance: 2025 dependent care assistance exclusion on a single return
  ---
  duration_ms: 0.384265
  type: 'test'
  ...
# Subtest: conformance: 2025 dependent care exclusion is halved on a married separate return
ok 185 - conformance: 2025 dependent care exclusion is halved on a married separate return
  ---
  duration_ms: 0.235036
  type: 'test'
  ...
# Subtest: conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount
ok 186 - conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount
  ---
  duration_ms: 2.611526
  type: 'test'
  ...
# Subtest: conformance: a separate return that states it is still married keeps the halved amount
ok 187 - conformance: a separate return that states it is still married keeps the halved amount
  ---
  duration_ms: 0.452914
  type: 'test'
  ...
# Subtest: conformance: 2021 only, the ARPA dependent care exclusion is 10500
ok 188 - conformance: 2021 only, the ARPA dependent care exclusion is 10500
  ---
  duration_ms: 0.202796
  type: 'test'
  ...
# Subtest: conformance: 2022 reverts to the pre-ARPA dependent care exclusion
ok 189 - conformance: 2022 reverts to the pre-ARPA dependent care exclusion
  ---
  duration_ms: 0.130686
  type: 'test'
  ...
# Subtest: conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21
ok 190 - conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21
  ---
  duration_ms: 0.101096
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount
ok 191 - conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount
  ---
  duration_ms: 0.113249
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent
ok 192 - conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent
  ---
  duration_ms: 0.215667
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled
ok 193 - conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled
  ---
  duration_ms: 0.228152
  type: 'test'
  ...
# Subtest: conformance: spouses filing jointly share one IRC 129 household exclusion
ok 194 - conformance: spouses filing jointly share one IRC 129 household exclusion
  ---
  duration_ms: 0.24963
  type: 'test'
  ...
# Subtest: conformance: married separate spouses do not share one IRC 129 exclusion
ok 195 - conformance: married separate spouses do not share one IRC 129 exclusion
  ---
  duration_ms: 0.133485
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs
ok 196 - conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs
  ---
  duration_ms: 0.136557
  type: 'test'
  ...
# Subtest: conformance: a dependent care plan document below the IRC 129 amount binds this arrangement
ok 197 - conformance: a dependent care plan document below the IRC 129 amount binds this arrangement
  ---
  duration_ms: 0.259918
  type: 'test'
  ...
# Subtest: conformance: a dependent care plan document caps its own arrangement, not the household amount
ok 198 - conformance: a dependent care plan document caps its own arrangement, not the household amount
  ---
  duration_ms: 0.144009
  type: 'test'
  ...
# Subtest: conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns
ok 199 - conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns
  ---
  duration_ms: 0.127242
  type: 'test'
  ...
# Subtest: conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling
ok 200 - conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling
  ---
  duration_ms: 0.115456
  type: 'test'
  ...
# Subtest: conformance: 1986 dependent care with no ceiling from any source stays indeterminate
ok 201 - conformance: 1986 dependent care with no ceiling from any source stays indeterminate
  ---
  duration_ms: 0.094067
  type: 'test'
  ...
# Subtest: conformance: 1981 predates IRC 129 entirely
ok 202 - conformance: 1981 predates IRC 129 entirely
  ---
  duration_ms: 0.072381
  type: 'test'
  ...
# Subtest: conformance: a health FSA and a dependent care FSA carry independent limits
ok 203 - conformance: a health FSA and a dependent care FSA carry independent limits
  ---
  duration_ms: 0.121573
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures
ok 204 - conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures
  ---
  duration_ms: 0.212528
  type: 'test'
  ...
# Subtest: conformance: a limited-purpose health FSA raises no IRC 223 conflict
ok 205 - conformance: a limited-purpose health FSA raises no IRC 223 conflict
  ---
  duration_ms: 0.128532
  type: 'test'
  ...
# Subtest: conformance: a post-deductible health FSA raises no IRC 223 conflict
ok 206 - conformance: a post-deductible health FSA raises no IRC 223 conflict
  ---
  duration_ms: 0.106593
  type: 'test'
  ...
# Subtest: conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate
ok 207 - conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate
  ---
  duration_ms: 0.122914
  type: 'test'
  ...
# Subtest: conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA
ok 208 - conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA
  ---
  duration_ms: 0.166561
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year
ok 209 - conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year
  ---
  duration_ms: 0.180145
  type: 'test'
  ...
# Subtest: conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification
ok 210 - conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification
  ---
  duration_ms: 0.211541
  type: 'test'
  ...
# Subtest: conformance: a dependent care FSA raises no IRC 223 conflict at all
ok 211 - conformance: a dependent care FSA raises no IRC 223 conflict at all
  ---
  duration_ms: 0.19862
  type: 'test'
  ...
# Subtest: conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit
ok 212 - conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.160161
  type: 'test'
  ...
# Subtest: conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok 213 - conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.111558
  type: 'test'
  ...
# Subtest: conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
ok 214 - conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit
  ---
  duration_ms: 0.096457
  type: 'test'
  ...
# Subtest: conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs
ok 215 - conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs
  ---
  duration_ms: 0.162367
  type: 'test'
  ...
# Subtest: conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance
ok 216 - conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance
  ---
  duration_ms: 0.194489
  type: 'test'
  ...
# Subtest: conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance
ok 217 - conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance
  ---
  duration_ms: 0.109799
  type: 'test'
  ...
# Subtest: conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance
ok 218 - conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance
  ---
  duration_ms: 0.215281
  type: 'test'
  ...
# Subtest: conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i)
ok 219 - conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i)
  ---
  duration_ms: 0.278377
  type: 'test'
  ...
# Subtest: conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance
ok 220 - conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance
  ---
  duration_ms: 0.188073
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing
ok 221 - conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing
  ---
  duration_ms: 0.123588
  type: 'test'
  ...
# Subtest: conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount
ok 222 - conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount
  ---
  duration_ms: 0.123339
  type: 'test'
  ...
# Subtest: conformance: 2023 has no pension-linked emergency savings account
ok 223 - conformance: 2023 has no pension-linked emergency savings account
  ---
  duration_ms: 0.097244
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate
ok 224 - conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate
  ---
  duration_ms: 0.099964
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k)
ok 225 - conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k)
  ---
  duration_ms: 0.162907
  type: 'test'
  ...
# Subtest: conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure
ok 226 - conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure
  ---
  duration_ms: 0.139402
  type: 'test'
  ...
# Subtest: conformance: a pension-linked emergency savings account needs no birth year
ok 227 - conformance: a pension-linked emergency savings account needs no birth year
  ---
  duration_ms: 0.194558
  type: 'test'
  ...
# Subtest: conformance: 2026 governmental 457(b)-hosted PLESA runs against the IRC 457(e)(15) limit
ok 228 - conformance: 2026 governmental 457(b)-hosted PLESA runs against the IRC 457(e)(15) limit
  ---
  duration_ms: 0.182937
  type: 'test'
  ...
# Subtest: conformance: 2026 governmental 457(b)-hosted PLESA joins no IRC 415(c) annual-additions group
ok 229 - conformance: 2026 governmental 457(b)-hosted PLESA joins no IRC 415(c) annual-additions group
  ---
  duration_ms: 0.185889
  type: 'test'
  ...
# Subtest: conformance: 2026 PLESAs in a governmental 457(b) and a 401(k) draw on separate deferral pools
ok 230 - conformance: 2026 PLESAs in a governmental 457(b) and a 401(k) draw on separate deferral pools
  ---
  duration_ms: 0.1775
  type: 'test'
  ...
# Subtest: conformance: a governmental 457(b)-hosted PLESA is unavailable before 2024
ok 231 - conformance: a governmental 457(b)-hosted PLESA is unavailable before 2024
  ---
  duration_ms: 0.1098
  type: 'test'
  ...
1..231
# tests 231
# suites 0
# pass 231
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 204.348229
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

46 tests, 0 failed (0.007s)
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
ok - 2026 governmental 457(b)-hosted PLESA runs against the IRC 457(e)(15) limit
ok - 2026 governmental 457(b)-hosted PLESA joins no IRC 415(c) annual-additions group
ok - 2026 PLESAs in a governmental 457(b) and a 401(k) draw on separate deferral pools
ok - a governmental 457(b)-hosted PLESA is unavailable before 2024

185 conformance vectors, 0 failed
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
TypeScript/PHP full-output parity passed for 185 vectors.
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
    "size": 274012,
    "unpackedSize": 2187279,
    "shasum": "5e28b0c904fd0d2c867651ae41a6952e1057ba01",
    "integrity": "sha512-j8Ug9WoiSu/7Qqo4RcaZjpZpl+JBYR5XWY8s/kuaXeU8jAS93u6TnBNGh7uxyU7CXOd5dQNGIJYog1bHdd86+w==",
    "filename": "us-tax-advantaged-params-0.3.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 57478,
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
        "size": 570484,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 314785,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 569560,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 314910,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 53929,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 53929,
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

