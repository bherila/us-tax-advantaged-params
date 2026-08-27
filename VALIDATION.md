# Validation Report

- **Package:** `usa-retirement-account-parameters@0.1.0`
- **Run:** 2026-08-27T18:13:41.714Z through 2026-08-27T18:14:01.044Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 27
- **Node:** v22.16.0
- **npm:** 10.9.2
- **TypeScript:** Version 5.8.3
- **PHP:** 8.4.23
- **Composer:** not installed locally

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 169 ms |
| Generated native parameter blocks | PASS | 0 | 195 ms |
| Source manifests and publication files | PASS | 0 | 184 ms |
| Strict TypeScript typecheck | PASS | 0 | 2433 ms |
| TypeScript unit and conformance tests | PASS | 0 | 4102 ms |
| PHP engine syntax | PASS | 0 | 76 ms |
| PHP unit-test syntax | PASS | 0 | 98 ms |
| PHP conformance-test syntax | PASS | 0 | 64 ms |
| PHP parity runner syntax | PASS | 0 | 61 ms |
| PHP unit tests | PASS | 0 | 98 ms |
| PHP conformance vectors | PASS | 0 | 88 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 9423 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 187 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 367 ms |
| Built-package manifest validation | PASS | 0 | 189 ms |
| npm package dry run | PASS | 0 | 877 ms |
| Composer manifest validation | SKIPPED | — | 8 ms |

## Runtime qualification note

The local container provides PHP 8.4.23, so the native suite was exercised here as a compatibility run below the declared PHP 8.5 floor. The GitHub Actions workflow separately requires PHP 8.5. Do not publish without a green PHP 8.5 CI run.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous tax years, 10 sources, 27 conformance vectors.
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

> usa-retirement-account-parameters@0.1.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USARetirementAccountParameters.test.js dist-tests/tests/conformance.test.js


> usa-retirement-account-parameters@0.1.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

TAP version 13
# Subtest: supports the first general IRA year through the generated year without extrapolation
ok 1 - supports the first general IRA year through the generated year without extrapolation
  ---
  duration_ms: 6.033383
  type: 'test'
  ...
# Subtest: normalizes common filing-status and account aliases
ok 2 - normalizes common filing-status and account aliases
  ---
  duration_ms: 1.26084
  type: 'test'
  ...
# Subtest: 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
ok 3 - 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity
  ---
  duration_ms: 58.898086
  type: 'test'
  ...
# Subtest: 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
ok 4 - 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold
  ---
  duration_ms: 1.558787
  type: 'test'
  ...
# Subtest: high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
ok 5 - high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up
  ---
  duration_ms: 1.323061
  type: 'test'
  ...
# Subtest: 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
ok 6 - 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method
  ---
  duration_ms: 2.152472
  type: 'test'
  ...
# Subtest: 2026 active-participant traditional IRA deduction phases out while total contribution remains available
ok 7 - 2026 active-participant traditional IRA deduction phases out while total contribution remains available
  ---
  duration_ms: 2.730838
  type: 'test'
  ...
# Subtest: traditional and Roth IRAs share one owner-level contribution pool
ok 8 - traditional and Roth IRAs share one owner-level contribution pool
  ---
  duration_ms: 1.26079
  type: 'test'
  ...
# Subtest: 401(k) and 457(b) employee limits are separate
ok 9 - 401(k) and 457(b) employee limits are separate
  ---
  duration_ms: 2.775821
  type: 'test'
  ...
# Subtest: two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
ok 10 - two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups
  ---
  duration_ms: 2.264648
  type: 'test'
  ...
# Subtest: mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
ok 11 - mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount
  ---
  duration_ms: 1.668262
  type: 'test'
  ...
# Subtest: self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
ok 12 - self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space
  ---
  duration_ms: 0.82929
  type: 'test'
  ...
# Subtest: self-employed SEP maximum uses the reduced 20% net-earnings rate
ok 13 - self-employed SEP maximum uses the reduced 20% net-earnings rate
  ---
  duration_ms: 0.835875
  type: 'test'
  ...
# Subtest: 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
ok 14 - 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up
  ---
  duration_ms: 1.860036
  type: 'test'
  ...
# Subtest: 457(b) last-three-years catch-up is selected when larger than the age catch-up
ok 15 - 457(b) last-three-years catch-up is selected when larger than the age catch-up
  ---
  duration_ms: 0.659006
  type: 'test'
  ...
# Subtest: 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
ok 16 - 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values
  ---
  duration_ms: 0.658006
  type: 'test'
  ...
# Subtest: pre-1987 401(k) maximum is explicitly indeterminate rather than invented
ok 17 - pre-1987 401(k) maximum is explicitly indeterminate rather than invented
  ---
  duration_ms: 3.979189
  type: 'test'
  ...
# Subtest: 1981 active employer-plan participant is ineligible for the modeled IRA contribution
ok 18 - 1981 active employer-plan participant is ineligible for the modeled IRA contribution
  ---
  duration_ms: 0.785061
  type: 'test'
  ...
# Subtest: 1982 one-earner spousal IRA preserves the historical $250 nonworking-spouse cap
ok 19 - 1982 one-earner spousal IRA preserves the historical $250 nonworking-spouse cap
  ---
  duration_ms: 0.741222
  type: 'test'
  ...
# Subtest: pre-2020 traditional IRA age-70½ restriction is enforced
ok 20 - pre-2020 traditional IRA age-70½ restriction is enforced
  ---
  duration_ms: 1.142529
  type: 'test'
  ...
# Subtest: IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
ok 21 - IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits
  ---
  duration_ms: 1.991903
  type: 'test'
  ...
# Subtest: in-plan Roth rollover reports only the pre-tax portion as taxable
ok 22 - in-plan Roth rollover reports only the pre-tax portion as taxable
  ---
  duration_ms: 1.119265
  type: 'test'
  ...
# Subtest: defined-benefit and cash-balance contributions remain actuarially indeterminate
ok 23 - defined-benefit and cash-balance contributions remain actuarially indeterminate
  ---
  duration_ms: 0.642824
  type: 'test'
  ...
# Subtest: 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
ok 24 - 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied
  ---
  duration_ms: 1.11343
  type: 'test'
  ...
# Subtest: self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
ok 25 - self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions
  ---
  duration_ms: 0.803019
  type: 'test'
  ...
# Subtest: pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
ok 26 - pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling
  ---
  duration_ms: 0.75162
  type: 'test'
  ...
# Subtest: additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
ok 27 - additional SIMPLE nonelective contribution is capped by 10% of recognized compensation
  ---
  duration_ms: 0.734504
  type: 'test'
  ...
# Subtest: SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
ok 28 - SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded
  ---
  duration_ms: 0.534998
  type: 'test'
  ...
# Subtest: multiple 403(b) accounts share one owner-level 15-year catch-up pool
ok 29 - multiple 403(b) accounts share one owner-level 15-year catch-up pool
  ---
  duration_ms: 1.049554
  type: 'test'
  ...
# Subtest: Roth employer contributions are rejected before their 2023 effective year
ok 30 - Roth employer contributions are rejected before their 2023 effective year
  ---
  duration_ms: 0.948037
  type: 'test'
  ...
# Subtest: multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
ok 31 - multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation
  ---
  duration_ms: 1.379246
  type: 'test'
  ...
# Subtest: duplicate taxpayer or spouse roles are rejected
ok 32 - duplicate taxpayer or spouse roles are rejected
  ---
  duration_ms: 0.666333
  type: 'test'
  ...
# Subtest: ambiguous M alias is accepted but produces a diagnostic
ok 33 - ambiguous M alias is accepted but produces a diagnostic
  ---
  duration_ms: 0.523347
  type: 'test'
  ...
# Subtest: 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
ok 34 - 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate
  ---
  duration_ms: 0.556863
  type: 'test'
  ...
# Subtest: 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
ok 35 - 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling
  ---
  duration_ms: 0.958337
  type: 'test'
  ...
# Subtest: 1997 employer match uses recognized compensation without capping employee elective deferrals
ok 36 - 1997 employer match uses recognized compensation without capping employee elective deferrals
  ---
  duration_ms: 1.158386
  type: 'test'
  ...
# Subtest: 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
ok 37 - 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings
  ---
  duration_ms: 0.80119
  type: 'test'
  ...
# Subtest: 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
ok 38 - 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings
  ---
  duration_ms: 1.519144
  type: 'test'
  ...
# Subtest: conformance: ordinary 2026 401k plan-term capacity
ok 39 - conformance: ordinary 2026 401k plan-term capacity
  ---
  duration_ms: 54.653218
  type: 'test'
  ...
# Subtest: conformance: 2026 high-wage age-60-to-63 Roth catch-up
ok 40 - conformance: 2026 high-wage age-60-to-63 Roth catch-up
  ---
  duration_ms: 7.383238
  type: 'test'
  ...
# Subtest: conformance: 2026 Roth IRA MFJ phaseout
ok 41 - conformance: 2026 Roth IRA MFJ phaseout
  ---
  duration_ms: 1.720897
  type: 'test'
  ...
# Subtest: conformance: shared traditional and Roth IRA pool
ok 42 - conformance: shared traditional and Roth IRA pool
  ---
  duration_ms: 2.335934
  type: 'test'
  ...
# Subtest: conformance: 401k and governmental 457b are separate
ok 43 - conformance: 401k and governmental 457b are separate
  ---
  duration_ms: 2.234091
  type: 'test'
  ...
# Subtest: conformance: mega backdoor 401k fills 415c
ok 44 - conformance: mega backdoor 401k fills 415c
  ---
  duration_ms: 0.832406
  type: 'test'
  ...
# Subtest: conformance: self-employed solo 401k
ok 45 - conformance: self-employed solo 401k
  ---
  duration_ms: 0.877414
  type: 'test'
  ...
# Subtest: conformance: 403b 15-year catch-up
ok 46 - conformance: 403b 15-year catch-up
  ---
  duration_ms: 1.023103
  type: 'test'
  ...
# Subtest: conformance: 457b special last-three-years catch-up
ok 47 - conformance: 457b special last-three-years catch-up
  ---
  duration_ms: 2.174297
  type: 'test'
  ...
# Subtest: conformance: 1994 historical employer-plan limits
ok 48 - conformance: 1994 historical employer-plan limits
  ---
  duration_ms: 1.519833
  type: 'test'
  ...
# Subtest: conformance: 1985 employer-plan limit remains indeterminate
ok 49 - conformance: 1985 employer-plan limit remains indeterminate
  ---
  duration_ms: 0.906887
  type: 'test'
  ...
# Subtest: conformance: 1982 nonworking spouse IRA
ok 50 - conformance: 1982 nonworking spouse IRA
  ---
  duration_ms: 0.629147
  type: 'test'
  ...
# Subtest: conformance: IRA conversion Form 8606 pro-rata
ok 51 - conformance: IRA conversion Form 8606 pro-rata
  ---
  duration_ms: 1.573275
  type: 'test'
  ...
# Subtest: conformance: in-plan Roth rollover basis
ok 52 - conformance: in-plan Roth rollover basis
  ---
  duration_ms: 1.01273
  type: 'test'
  ...
# Subtest: conformance: 2026 enhanced SIMPLE
ok 53 - conformance: 2026 enhanced SIMPLE
  ---
  duration_ms: 1.199896
  type: 'test'
  ...
# Subtest: conformance: cash-balance contribution is actuarial
ok 54 - conformance: cash-balance contribution is actuarial
  ---
  duration_ms: 0.546347
  type: 'test'
  ...
# Subtest: conformance: self-employed retirement deduction classification
ok 55 - conformance: self-employed retirement deduction classification
  ---
  duration_ms: 0.67348
  type: 'test'
  ...
# Subtest: conformance: 2009 MFS living apart Roth conversion
ok 56 - conformance: 2009 MFS living apart Roth conversion
  ---
  duration_ms: 0.468884
  type: 'test'
  ...
# Subtest: conformance: SIMPLE additional nonelective 10 percent cap
ok 57 - conformance: SIMPLE additional nonelective 10 percent cap
  ---
  duration_ms: 0.545251
  type: 'test'
  ...
# Subtest: conformance: SIMPLE IRA Roth catch-up wage-test exclusion
ok 58 - conformance: SIMPLE IRA Roth catch-up wage-test exclusion
  ---
  duration_ms: 0.380583
  type: 'test'
  ...
# Subtest: conformance: aggregate 403b 15-year catch-up pool
ok 59 - conformance: aggregate 403b 15-year catch-up pool
  ---
  duration_ms: 0.582418
  type: 'test'
  ...
# Subtest: conformance: pre-2023 Roth employer contribution unavailable
ok 60 - conformance: pre-2023 Roth employer contribution unavailable
  ---
  duration_ms: 0.509745
  type: 'test'
  ...
# Subtest: conformance: aggregate IRA conversion basis penny allocation
ok 61 - conformance: aggregate IRA conversion basis penny allocation
  ---
  duration_ms: 0.522957
  type: 'test'
  ...
# Subtest: conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
ok 62 - conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate
  ---
  duration_ms: 0.668548
  type: 'test'
  ...
# Subtest: conformance: 1997 nonelective formula applies 401a17 compensation ceiling
ok 63 - conformance: 1997 nonelective formula applies 401a17 compensation ceiling
  ---
  duration_ms: 0.588127
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
ok 64 - conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings
  ---
  duration_ms: 0.370597
  type: 'test'
  ...
# Subtest: conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
ok 65 - conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings
  ---
  duration_ms: 0.395364
  type: 'test'
  ...
1..65
# tests 65
# suites 0
# pass 65
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 452.283332
```

**stderr**

_(no output)_

### PHP engine syntax

Command: `php -l php/src/USARetirementAccountParameters.php`

**stdout**

```text
No syntax errors detected in php/src/USARetirementAccountParameters.php
```

**stderr**

_(no output)_

### PHP unit-test syntax

Command: `php -l php/tests/USARetirementAccountParametersTest.php`

**stdout**

```text
No syntax errors detected in php/tests/USARetirementAccountParametersTest.php
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

Command: `php php/tests/USARetirementAccountParametersTest.php`

**stdout**

```text
ok - supports 1975 through 2026 without extrapolation
ok - normalizes common aliases
ok - builder pattern calculates an ordinary 2026 401k
ok - 2026 age 60 to 63 high wage catch-up is Roth
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
ok - 1982 one earner spousal IRA cap
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

38 tests, 0 failed (0.007s)
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

27 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> usa-retirement-account-parameters@0.1.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> usa-retirement-account-parameters@0.1.0 generate:check
> node scripts/generate.mjs --check


> usa-retirement-account-parameters@0.1.0 clean
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
TypeScript/PHP full-output parity passed for 27 vectors.
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
    "id": "usa-retirement-account-parameters@0.1.0",
    "name": "usa-retirement-account-parameters",
    "version": "0.1.0",
    "size": 117690,
    "unpackedSize": 1289864,
    "shasum": "057fd71df8e534943b8b5caa077f326ba0e259d8",
    "integrity": "sha512-x+iob2OcL/bZXDGFm31UY+oU7JkmcMDhQ0llxXtwE/TS0xmpkQM8SnEJzXV8lp7dGYp6dupt9B0NwtmQf4TPzw==",
    "filename": "usa-retirement-account-parameters-0.1.0.tgz",
    "files": [
      {
        "path": "CHANGELOG.md",
        "size": 1863,
        "mode": 420
      },
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 17115,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 5200,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 161971,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USARetirementAccountParameters.js",
        "size": 338597,
        "mode": 420
      },
      {
        "path": "dist/cjs/USARetirementAccountParameters.js.map",
        "size": 201807,
        "mode": 420
      },
      {
        "path": "dist/esm/USARetirementAccountParameters.js",
        "size": 337506,
        "mode": 420
      },
      {
        "path": "dist/esm/USARetirementAccountParameters.js.map",
        "size": 201796,
        "mode": 420
      },
      {
        "path": "dist/types/USARetirementAccountParameters.d.ts",
        "size": 19845,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 3072,
        "mode": 420
      }
    ],
    "entryCount": 12,
    "bundled": []
  }
]
```

**stderr**

_(no output)_

### Composer manifest validation

Command: `composer validate --strict`

**stdout**

_(no output)_

**stderr**

```text
composer is not installed in this local environment; the CI workflow performs this check.
```

