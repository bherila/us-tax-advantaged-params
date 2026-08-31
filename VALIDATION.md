# Validation Report

- **Package:** `us-tax-advantaged-params@0.3.0`
- **Run:** 2026-08-31T21:38:12.880Z through 2026-08-31T21:38:16.196Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 177
- **Node:** v24.11.0
- **npm:** 11.6.1
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.9
- **Composer:** Composer version 2.10.2 2026-07-01 11:24:45

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 40 ms |
| Generated native parameter blocks | PASS | 0 | 40 ms |
| Source manifests and publication files | PASS | 0 | 37 ms |
| Strict TypeScript typecheck | PASS | 0 | 135 ms |
| TypeScript unit and conformance tests | PASS | 0 | 518 ms |
| PHP engine syntax | PASS | 0 | 63 ms |
| PHP unit-test syntax | PASS | 0 | 59 ms |
| PHP conformance-test syntax | PASS | 0 | 60 ms |
| PHP parity runner syntax | PASS | 0 | 59 ms |
| PHP unit tests | PASS | 0 | 66 ms |
| PHP conformance vectors | PASS | 0 | 78 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 808 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 45 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 148 ms |
| Built-package manifest validation | PASS | 0 | 36 ms |
| npm package dry run | PASS | 0 | 400 ms |
| Composer manifest validation | PASS | 0 | 284 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 45 contiguous FSA tax years, 70 sources, 177 conformance vectors.
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

✔ supports the first general IRA year through the generated year without extrapolation (1.201084ms)
✔ normalizes common filing-status and account aliases (0.239667ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (14.210875ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (0.470792ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.257833ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (0.492125ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.380208ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.279542ms)
✔ reports the quantified amount of an existing contribution above an account ceiling (0.299291ms)
✔ 401(k) and 457(b) employee limits are separate (0.648917ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.298667ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.241041ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.189208ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.187583ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.187417ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.141625ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.131625ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (0.651291ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.184959ms)
✔ 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing (0.125416ms)
✔ 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000 (0.142042ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.188459ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (0.419625ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.207666ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.13175ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.225417ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.148458ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.129375ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.128666ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.110459ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.160625ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.130042ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.1915ms)
✔ duplicate taxpayer or spouse roles are rejected (0.11125ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.096667ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.114333ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.17575ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.105333ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.087792ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.085417ms)
✔ exposes the IRC 125 and IRC 129 parameter table without extrapolating it (0.117875ms)
✔ rejects a bare FSA account type but accepts each unambiguous spelling (0.057584ms)
✔ validates health FSA plan facts before calculating anything (0.303083ms)
✔ the health FSA builder reaches every IRC 125(i) plan fact (0.245916ms)
✔ validates IRC 129 earned income facts before calculating anything (0.226208ms)
✔ the dependent care builder reaches the IRC 129(b) earned income facts (0.244666ms)
✔ conformance: ordinary 2026 401k plan-term capacity (15.347291ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.357958ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.342042ms)
✔ conformance: shared traditional and Roth IRA pool (0.383333ms)
✔ conformance: 401k and governmental 457b are separate (0.4375ms)
✔ conformance: mega backdoor 401k fills 415c (0.233709ms)
✔ conformance: self-employed solo 401k (0.171042ms)
✔ conformance: 403b 15-year catch-up (0.181167ms)
✔ conformance: 457b special last-three-years catch-up (0.173167ms)
✔ conformance: 1994 historical employer-plan limits (0.175083ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.12775ms)
✔ conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule (0.168958ms)
✔ conformance: 1982 nonworking spouse IRA (0.113417ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.839042ms)
✔ conformance: in-plan Roth rollover basis (0.185583ms)
✔ conformance: 2026 enhanced SIMPLE (0.199208ms)
✔ conformance: cash-balance contribution is actuarial (0.144584ms)
✔ conformance: self-employed retirement deduction classification (0.120625ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.09075ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.082083ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.07275ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.114125ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.083958ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.133ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.144875ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.136416ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.064084ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.058958ms)
✔ conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold (0.097083ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.067167ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.064916ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.080208ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.066416ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.079416ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.072875ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.072541ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.081125ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.07225ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.05675ms)
✔ conformance: 2023 first-year Roth employer contribution (0.060125ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.063084ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.0615ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.048791ms)
✔ conformance: unsupported tax year 1974 (0.201416ms)
✔ conformance: duplicate account id (0.049291ms)
✔ conformance: unknown account owner (0.047ms)
✔ conformance: negative compensation is invalid money (0.043666ms)
✔ conformance: invalid filing status alias (0.035292ms)
✔ conformance: 2026 full-year self-only HSA limit (0.471292ms)
✔ conformance: 2026 full-year family HSA limit (0.103833ms)
✔ conformance: 2026 mid-year HSA coverage change prorated by month (0.482166ms)
✔ conformance: 2026 both spouses age 55 receive separate HSA catch-ups (0.359166ms)
✔ conformance: 2026 spouses divide the single family HSA limit as agreed (0.245ms)
✔ conformance: 2026 HSA last-month rule with a satisfied testing period (0.176625ms)
✔ conformance: 2026 HSA last-month rule failed in the testing period (0.129083ms)
✔ conformance: 2005 HSA monthly limit capped by the plan annual deductible (0.130792ms)
✔ conformance: 2006 HSA monthly limit capped by the statutory dollar amount (0.102417ms)
✔ conformance: 2026 employer HSA contribution is excluded rather than deducted (0.091ms)
✔ conformance: 2003 predates IRC 223 health savings accounts (0.069041ms)
✔ conformance: 2026 HSA last-month rule with an unresolved testing period (0.095333ms)
✔ conformance: 2026 married filing separately family coverage recharacterizes the other spouse (0.136834ms)
✔ conformance: 2026 spouse family and self-only months divide only the family portion (0.123125ms)
✔ conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit (0.116791ms)
✔ conformance: 2026 married last-month rule measures the attributable amount against the divided limit (0.140583ms)
✔ conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months (0.119667ms)
✔ conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate (0.114ms)
✔ conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact (0.088833ms)
✔ conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A) (0.097583ms)
✔ conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division (0.114791ms)
✔ conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount (0.074833ms)
✔ conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched (0.087042ms)
✔ conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below (0.070125ms)
✔ conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule (0.073125ms)
✔ conformance: persons entry that is not an object is rejected (0.057834ms)
✔ conformance: accounts entry that is not an object is rejected (0.044166ms)
✔ conformance: conversions entry that is not an object is rejected (0.061292ms)
✔ conformance: account without an ownerId is rejected (0.0495ms)
✔ conformance: conversion without an ownerId is rejected (0.055333ms)
✔ conformance: unrecognized contributionPreference is rejected (0.053084ms)
✔ conformance: unrecognized employerContributionTaxTreatment is rejected (0.04475ms)
✔ conformance: rate outside 0 through 1 is rejected (0.041625ms)
✔ conformance: existing contributions above the account ceiling name the amounts (0.104042ms)
✔ conformance: taxYear that is not an integer is rejected (0.025125ms)
✔ conformance: missing filingStatus is rejected rather than defaulted (0.061333ms)
✔ conformance: filingStatus that is not a string is rejected (0.064584ms)
✔ conformance: accounts that is not an array is rejected (0.088167ms)
✔ conformance: conversions that is not an array is rejected (0.074125ms)
✔ conformance: account type that is not a string is rejected (0.058542ms)
✔ conformance: person id that is not a string is rejected (0.4545ms)
✔ conformance: structured input field that is not an object is rejected (0.044958ms)
✔ conformance: unrecognized simpleEmployerContributionMethod is rejected (0.042958ms)
✔ conformance: 1989 fractional plan-term capacity keeps its fraction in the message (0.112625ms)
✔ conformance: flag field that is not a boolean is rejected (0.048625ms)
✔ conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C) (0.123666ms)
✔ conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount (0.085042ms)
✔ conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero (0.081917ms)
✔ conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division (0.129333ms)
✔ conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead (0.098167ms)
✔ conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount (0.088917ms)
✔ conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides (0.078375ms)
✔ conformance: 2026 family-limit shares that do not exhaust the limitation are not a division (0.112708ms)
✔ conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing (0.098875ms)
✔ conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything (0.077ms)
✔ conformance: 2026 incomplete family-limit shares report only the missing-share error (0.081791ms)
✔ conformance: 2026 flexible spending arrangement parameters are published in the result (0.046833ms)
✔ conformance: 2012 health FSA exists with no statutory ceiling rather than not existing (0.044458ms)
✔ conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all (0.035833ms)
✔ conformance: 2026 health FSA election at the IRC 125(i) limit (0.209833ms)
✔ conformance: 2013 is the first year IRC 125(i) limits a health FSA election (0.083209ms)
✔ conformance: 2012 health FSA has no statutory salary-reduction ceiling (0.061084ms)
✔ conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited (0.073208ms)
✔ conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit (0.076709ms)
✔ conformance: a health FSA grace period precludes a carryover (0.065917ms)
✔ conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount (0.055583ms)
✔ conformance: a health FSA carryover and grace period asserted together are refused (0.054458ms)
✔ conformance: nothing may be carried into 2013, the first year the carryover existed (0.056083ms)
✔ conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled (0.058666ms)
✔ conformance: a prior-year unused amount without a stated plan option asks for the fact (0.065042ms)
✔ conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated (0.080167ms)
✔ conformance: an account type that did not exist for the tax year reports no exclusion (0.071834ms)
✔ conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a) (0.078792ms)
✔ conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum (0.059958ms)
✔ conformance: two unrelated employers each carry a full health FSA limit (0.070708ms)
✔ conformance: two health FSAs of one employer share a single IRC 125(i) limit (0.062708ms)
✔ conformance: spouses filing jointly each carry a full health FSA limit (0.068625ms)
✔ conformance: non-elective employer flex credits stay outside the IRC 125(i) limit (0.064083ms)
✔ conformance: flex credits electable as cash consume the IRC 125(i) limit (0.056542ms)
✔ conformance: flex credits without a stated cash election ask for the fact (0.068417ms)
✔ conformance: a lower plan-document health FSA limit binds (0.068ms)
✔ conformance: a lower plan-document limit caps its own arrangement, not the employer group (0.067417ms)
✔ conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure (0.06275ms)
✔ conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate (0.052542ms)
✔ conformance: a bare FSA account type is rejected as ambiguous (0.048541ms)
✔ conformance: an unrecognised health FSA purpose is rejected (0.045333ms)
✔ conformance: 2025 dependent care assistance exclusion on a single return (0.204167ms)
✔ conformance: 2025 dependent care exclusion is halved on a married separate return (0.086833ms)
✔ conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount (0.068208ms)
✔ conformance: a separate return that states it is still married keeps the halved amount (0.068209ms)
✔ conformance: 2021 only, the ARPA dependent care exclusion is 10500 (0.090708ms)
✔ conformance: 2022 reverts to the pre-ARPA dependent care exclusion (0.07025ms)
✔ conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21 (0.063291ms)
✔ conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount (0.063292ms)
✔ conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent (0.073125ms)
✔ conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled (0.084666ms)
✔ conformance: spouses filing jointly share one IRC 129 household exclusion (0.117708ms)
✔ conformance: married separate spouses do not share one IRC 129 exclusion (0.076166ms)
✔ conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs (0.075375ms)
✔ conformance: a dependent care plan document below the IRC 129 amount binds this arrangement (0.080458ms)
✔ conformance: a dependent care plan document caps its own arrangement, not the household amount (0.066208ms)
✔ conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns (0.071208ms)
✔ conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling (0.07525ms)
✔ conformance: 1986 dependent care with no ceiling from any source stays indeterminate (0.058458ms)
✔ conformance: 1981 predates IRC 129 entirely (0.051458ms)
✔ conformance: a health FSA and a dependent care FSA carry independent limits (0.075125ms)
✔ conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures (0.100916ms)
✔ conformance: a limited-purpose health FSA raises no IRC 223 conflict (0.083333ms)
✔ conformance: a post-deductible health FSA raises no IRC 223 conflict (0.080834ms)
✔ conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate (0.078375ms)
✔ conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA (0.511042ms)
✔ conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year (0.151417ms)
✔ conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification (0.102375ms)
✔ conformance: a dependent care FSA raises no IRC 223 conflict at all (0.089ms)
✔ conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit (0.088417ms)
✔ conformance: a cash balance plan in a year with no transcribed IRC 415(b)(1)(A) figure reports no annual benefit limit (0.060208ms)
✔ conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs (0.096791ms)
✔ conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance (0.078959ms)
✔ conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance (0.058959ms)
✔ conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance (0.064459ms)
✔ conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i) (0.1165ms)
✔ conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance (0.074875ms)
✔ conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing (0.085125ms)
✔ conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount (0.071583ms)
✔ conformance: 2023 has no pension-linked emergency savings account (0.052292ms)
✔ conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate (0.0545ms)
✔ conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k) (0.090041ms)
✔ conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure (0.05825ms)
✔ conformance: a pension-linked emergency savings account needs no birth year (0.062958ms)
ℹ tests 223
ℹ suites 0
ℹ pass 223
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 106.560916
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

46 tests, 0 failed (0.004s)
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
ok - a cash balance plan in a year with no transcribed IRC 415(b)(1)(A) figure reports no annual benefit limit
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

177 conformance vectors, 0 failed
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
TypeScript/PHP full-output parity passed for 177 vectors.
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
    "size": 267408,
    "unpackedSize": 2158210,
    "shasum": "a7e5b5087d302e9e590d8d87f10e92183d93a08f",
    "integrity": "sha512-Cdep0p/l/igD5PNnY3Zn+1irAXGZGdirU7mpVmrhnsv3Tf52T3QcIguxtfDYOxTnuk/T79ji6SNCVopSLWxrEg==",
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
        "size": 182174,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 560422,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 312219,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 559498,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 312344,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 52981,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 52981,
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

_(no output)_

