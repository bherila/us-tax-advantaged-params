# Validation Report

- **Package:** `us-tax-advantaged-params@0.2.0`
- **Run:** 2026-08-31T03:39:05.975Z through 2026-08-31T03:39:09.250Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 103
- **Node:** v24.11.0
- **npm:** 11.6.1
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.9
- **Composer:** Composer version 2.10.2 2026-07-01 11:24:45

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 44 ms |
| Generated native parameter blocks | PASS | 0 | 38 ms |
| Source manifests and publication files | PASS | 0 | 42 ms |
| Strict TypeScript typecheck | PASS | 0 | 98 ms |
| TypeScript unit and conformance tests | PASS | 0 | 563 ms |
| PHP engine syntax | PASS | 0 | 73 ms |
| PHP unit-test syntax | PASS | 0 | 65 ms |
| PHP conformance-test syntax | PASS | 0 | 65 ms |
| PHP parity runner syntax | PASS | 0 | 62 ms |
| PHP unit tests | PASS | 0 | 70 ms |
| PHP conformance vectors | PASS | 0 | 73 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 838 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 46 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 142 ms |
| Built-package manifest validation | PASS | 0 | 38 ms |
| npm package dry run | PASS | 0 | 306 ms |
| Composer manifest validation | PASS | 0 | 270 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 37 sources, 103 conformance vectors.
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

> us-tax-advantaged-params@0.2.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USTaxAdvantagedParams.test.js dist-tests/tests/conformance.test.js


> us-tax-advantaged-params@0.2.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

✔ supports the first general IRA year through the generated year without extrapolation (1.108958ms)
✔ normalizes common filing-status and account aliases (0.219917ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (13.790042ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (0.396417ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.283667ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (0.446ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.35825ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.264583ms)
✔ reports the quantified amount of an existing contribution above an account ceiling (0.239875ms)
✔ 401(k) and 457(b) employee limits are separate (0.761041ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.338042ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.327167ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.247375ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.203208ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.182ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.139667ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.134292ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (0.09375ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.128125ms)
✔ 1982 one-earner spousal IRA preserves the historical $250 nonworking-spouse cap (0.103833ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.639292ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (0.435792ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.207917ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.110083ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.220042ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.136291ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.116292ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.135625ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.097ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.138959ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.106916ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.18325ms)
✔ duplicate taxpayer or spouse roles are rejected (0.131166ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.099959ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.098708ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.188375ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.145208ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.100542ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.090417ms)
✔ conformance: ordinary 2026 401k plan-term capacity (15.677625ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.3015ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.291708ms)
✔ conformance: shared traditional and Roth IRA pool (0.316791ms)
✔ conformance: 401k and governmental 457b are separate (0.335875ms)
✔ conformance: mega backdoor 401k fills 415c (0.71775ms)
✔ conformance: self-employed solo 401k (0.139834ms)
✔ conformance: 403b 15-year catch-up (0.189125ms)
✔ conformance: 457b special last-three-years catch-up (0.147958ms)
✔ conformance: 1994 historical employer-plan limits (0.17025ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.10425ms)
✔ conformance: 1982 nonworking spouse IRA (0.142583ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.391417ms)
✔ conformance: in-plan Roth rollover basis (0.179875ms)
✔ conformance: 2026 enhanced SIMPLE (0.208708ms)
✔ conformance: cash-balance contribution is actuarial (0.10475ms)
✔ conformance: self-employed retirement deduction classification (0.106583ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.101083ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.095208ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.073ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.115125ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.095833ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.152833ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.131625ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.138375ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.070875ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.06325ms)
✔ conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold (0.095917ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.067042ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.065ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.083167ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.067042ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.113ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.17825ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.480125ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.078083ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.091125ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.066542ms)
✔ conformance: 2023 first-year Roth employer contribution (0.059291ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.068417ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.059792ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.046917ms)
✔ conformance: unsupported tax year 1974 (0.216625ms)
✔ conformance: duplicate account id (0.055834ms)
✔ conformance: unknown account owner (0.048167ms)
✔ conformance: negative compensation is invalid money (0.049208ms)
✔ conformance: invalid filing status alias (0.035917ms)
✔ conformance: 2026 full-year self-only HSA limit (0.448875ms)
✔ conformance: 2026 full-year family HSA limit (0.103458ms)
✔ conformance: 2026 mid-year HSA coverage change prorated by month (0.40225ms)
✔ conformance: 2026 both spouses age 55 receive separate HSA catch-ups (0.277459ms)
✔ conformance: 2026 spouses divide the single family HSA limit as agreed (0.214542ms)
✔ conformance: 2026 HSA last-month rule with a satisfied testing period (0.1465ms)
✔ conformance: 2026 HSA last-month rule failed in the testing period (0.104833ms)
✔ conformance: 2005 HSA monthly limit capped by the plan annual deductible (0.119125ms)
✔ conformance: 2006 HSA monthly limit capped by the statutory dollar amount (0.100667ms)
✔ conformance: 2026 employer HSA contribution is excluded rather than deducted (0.085958ms)
✔ conformance: 2003 predates IRC 223 health savings accounts (0.067208ms)
✔ conformance: 2026 HSA last-month rule with an unresolved testing period (0.072166ms)
✔ conformance: 2026 married filing separately family coverage recharacterizes the other spouse (0.104334ms)
✔ conformance: 2026 spouse family and self-only months divide only the family portion (0.107875ms)
✔ conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit (0.099958ms)
✔ conformance: 2026 married last-month rule measures the attributable amount against the divided limit (0.114875ms)
✔ conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months (0.115667ms)
✔ conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate (0.099583ms)
✔ conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact (0.097458ms)
✔ conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A) (0.081708ms)
✔ conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division (0.093334ms)
✔ conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount (0.464417ms)
✔ conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched (0.095083ms)
✔ conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below (0.05825ms)
✔ conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule (0.059208ms)
✔ conformance: persons entry that is not an object is rejected (0.0485ms)
✔ conformance: accounts entry that is not an object is rejected (0.043791ms)
✔ conformance: conversions entry that is not an object is rejected (0.05125ms)
✔ conformance: account without an ownerId is rejected (0.0445ms)
✔ conformance: conversion without an ownerId is rejected (0.050833ms)
✔ conformance: unrecognized contributionPreference is rejected (0.047333ms)
✔ conformance: unrecognized employerContributionTaxTreatment is rejected (0.038334ms)
✔ conformance: rate outside 0 through 1 is rejected (0.503125ms)
✔ conformance: existing contributions above the account ceiling name the amounts (0.194625ms)
✔ conformance: taxYear that is not an integer is rejected (0.036208ms)
✔ conformance: missing filingStatus is rejected rather than defaulted (0.087291ms)
✔ conformance: filingStatus that is not a string is rejected (0.04125ms)
✔ conformance: accounts that is not an array is rejected (0.0425ms)
✔ conformance: conversions that is not an array is rejected (0.058334ms)
✔ conformance: account type that is not a string is rejected (0.044625ms)
✔ conformance: person id that is not a string is rejected (0.042125ms)
✔ conformance: structured input field that is not an object is rejected (0.03775ms)
✔ conformance: unrecognized simpleEmployerContributionMethod is rejected (0.040084ms)
✔ conformance: 1989 fractional plan-term capacity keeps its fraction in the message (0.105625ms)
✔ conformance: flag field that is not a boolean is rejected (0.050292ms)
✔ conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C) (0.123333ms)
✔ conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount (0.079375ms)
✔ conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero (0.079167ms)
✔ conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division (0.137708ms)
✔ conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead (0.101708ms)
✔ conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount (0.087833ms)
✔ conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides (0.075792ms)
✔ conformance: 2026 family-limit shares that do not exhaust the limitation are not a division (0.110166ms)
✔ conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing (0.096667ms)
✔ conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything (0.076292ms)
✔ conformance: 2026 incomplete family-limit shares report only the missing-share error (0.080792ms)
ℹ tests 142
ℹ suites 0
ℹ pass 142
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 96.460125
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

39 tests, 0 failed (0.003s)
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

103 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> us-tax-advantaged-params@0.2.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> us-tax-advantaged-params@0.2.0 generate:check
> node scripts/generate.mjs --check


> us-tax-advantaged-params@0.2.0 clean
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
TypeScript/PHP full-output parity passed for 103 vectors.
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
    "id": "us-tax-advantaged-params@0.2.0",
    "name": "us-tax-advantaged-params",
    "version": "0.2.0",
    "size": 186478,
    "unpackedSize": 1688685,
    "shasum": "942d0e8d9b30dc93461c598d0e044f4ee2f23480",
    "integrity": "sha512-y2JDZhAe+rfhZEKnC/DvAIAEe1UQwMNkV7qDSK4Hv3TopTnIoldWGkuf4KWn3oPH/34xy1vgAiOW43qAs4r6AA==",
    "filename": "us-tax-advantaged-params-0.2.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 34588,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 7166,
        "mode": 420
      },
      {
        "path": "data/hsa-parameters.json",
        "size": 19834,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 169654,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 434777,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 257104,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 433853,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 257229,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 34704,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 34704,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 3980,
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

