# Validation Report

- **Package:** `us-tax-advantaged-params@0.1.0`
- **Run:** 2026-08-30T22:25:08.064Z through 2026-08-30T22:25:11.113Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 46
- **Node:** v24.11.0
- **npm:** 11.6.1
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.9
- **Composer:** Composer version 2.10.2 2026-07-01 11:24:45

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 38 ms |
| Generated native parameter blocks | PASS | 0 | 33 ms |
| Source manifests and publication files | PASS | 0 | 37 ms |
| Strict TypeScript typecheck | PASS | 0 | 95 ms |
| TypeScript unit and conformance tests | PASS | 0 | 508 ms |
| PHP engine syntax | PASS | 0 | 66 ms |
| PHP unit-test syntax | PASS | 0 | 62 ms |
| PHP conformance-test syntax | PASS | 0 | 63 ms |
| PHP parity runner syntax | PASS | 0 | 61 ms |
| PHP unit tests | PASS | 0 | 68 ms |
| PHP conformance vectors | PASS | 0 | 68 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 768 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 41 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 126 ms |
| Built-package manifest validation | PASS | 0 | 36 ms |
| npm package dry run | PASS | 0 | 287 ms |
| Composer manifest validation | PASS | 0 | 247 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous tax years, 10 sources, 46 conformance vectors.
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

> us-tax-advantaged-params@0.1.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USTaxAdvantagedParams.test.js dist-tests/tests/conformance.test.js


> us-tax-advantaged-params@0.1.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

✔ supports the first general IRA year through the generated year without extrapolation (1.128667ms)
✔ normalizes common filing-status and account aliases (0.198ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (13.926792ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (0.421791ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.318ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (0.460375ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.36275ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.266375ms)
✔ 401(k) and 457(b) employee limits are separate (0.385042ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.393958ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.277125ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.273542ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.194209ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.200833ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.160416ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.122416ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (0.099167ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.126292ms)
✔ 1982 one-earner spousal IRA preserves the historical $250 nonworking-spouse cap (0.10375ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.176042ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (0.399167ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.196ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.099542ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.226917ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.136625ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.12875ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.127792ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.107125ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.141459ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.101541ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.174125ms)
✔ duplicate taxpayer or spouse roles are rejected (0.111166ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.100667ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.103625ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.157459ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.111125ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.096583ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.095958ms)
✔ conformance: ordinary 2026 401k plan-term capacity (14.906125ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.320208ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.322833ms)
✔ conformance: shared traditional and Roth IRA pool (0.334959ms)
✔ conformance: 401k and governmental 457b are separate (0.34525ms)
✔ conformance: mega backdoor 401k fills 415c (0.208125ms)
✔ conformance: self-employed solo 401k (0.1455ms)
✔ conformance: 403b 15-year catch-up (0.171208ms)
✔ conformance: 457b special last-three-years catch-up (0.163458ms)
✔ conformance: 1994 historical employer-plan limits (0.15925ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.118542ms)
✔ conformance: 1982 nonworking spouse IRA (0.149417ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.356916ms)
✔ conformance: in-plan Roth rollover basis (0.30325ms)
✔ conformance: 2026 enhanced SIMPLE (0.260416ms)
✔ conformance: cash-balance contribution is actuarial (0.116334ms)
✔ conformance: self-employed retirement deduction classification (0.106791ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.091834ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.083375ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.066709ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.119709ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.093583ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.150042ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.131834ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.123416ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.06125ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.058833ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.0545ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.071167ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.081542ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.056959ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.074708ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.075958ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.067709ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.075541ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.079875ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.462709ms)
✔ conformance: 2023 first-year Roth employer contribution (0.090625ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.072417ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.064125ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.049458ms)
✔ conformance: unsupported tax year 1974 (0.227125ms)
✔ conformance: duplicate account id (0.049541ms)
✔ conformance: unknown account owner (0.046167ms)
✔ conformance: negative compensation is invalid money (0.042833ms)
✔ conformance: invalid filing status alias (0.053875ms)
ℹ tests 84
ℹ suites 0
ℹ pass 84
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 81.575167
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

38 tests, 0 failed (0.002s)
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

46 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> us-tax-advantaged-params@0.1.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> us-tax-advantaged-params@0.1.0 generate:check
> node scripts/generate.mjs --check


> us-tax-advantaged-params@0.1.0 clean
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
TypeScript/PHP full-output parity passed for 46 vectors.
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
    "id": "us-tax-advantaged-params@0.1.0",
    "name": "us-tax-advantaged-params",
    "version": "0.1.0",
    "size": 123416,
    "unpackedSize": 1314740,
    "shasum": "ada55d346cc50bee2e874000a1ff287dadf4a544",
    "integrity": "sha512-/mfgb+s+8ToOjWYWJcsLqREJXvv99svc6GjiOYRZ8axVxDzMir4gR8olHxuVPqf0VF5yC/Qj2r0SsPjymZY24w==",
    "filename": "us-tax-advantaged-params-0.1.0.tgz",
    "files": [
      {
        "path": "CHANGELOG.md",
        "size": 4476,
        "mode": 420
      },
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 17452,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 5191,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 161962,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 339126,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 201937,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 338062,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 202071,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 19907,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 19907,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 3557,
        "mode": 420
      }
    ],
    "entryCount": 13,
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

_(no output)_

