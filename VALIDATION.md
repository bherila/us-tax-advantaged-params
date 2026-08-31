# Validation Report

- **Package:** `us-tax-advantaged-params@0.2.0`
- **Run:** 2026-08-31T16:36:32.403Z through 2026-08-31T16:36:35.861Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 160
- **Node:** v24.11.0
- **npm:** 11.6.1
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.9
- **Composer:** Composer version 2.10.2 2026-07-01 11:24:45

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 42 ms |
| Generated native parameter blocks | PASS | 0 | 42 ms |
| Source manifests and publication files | PASS | 0 | 40 ms |
| Strict TypeScript typecheck | PASS | 0 | 105 ms |
| TypeScript unit and conformance tests | PASS | 0 | 571 ms |
| PHP engine syntax | PASS | 0 | 70 ms |
| PHP unit-test syntax | PASS | 0 | 67 ms |
| PHP conformance-test syntax | PASS | 0 | 80 ms |
| PHP parity runner syntax | PASS | 0 | 67 ms |
| PHP unit tests | PASS | 0 | 76 ms |
| PHP conformance vectors | PASS | 0 | 85 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 879 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 50 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 162 ms |
| Built-package manifest validation | PASS | 0 | 39 ms |
| npm package dry run | PASS | 0 | 341 ms |
| Composer manifest validation | PASS | 0 | 278 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 40 contiguous FSA tax years, 65 sources, 160 conformance vectors.
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

✔ supports the first general IRA year through the generated year without extrapolation (1.277834ms)
✔ normalizes common filing-status and account aliases (0.257541ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (14.742083ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (0.444333ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.271416ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (0.465333ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.413916ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.318166ms)
✔ reports the quantified amount of an existing contribution above an account ceiling (0.2825ms)
✔ 401(k) and 457(b) employee limits are separate (0.506833ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.264958ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.237791ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.199667ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.190833ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.185542ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.140291ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.623583ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (0.107417ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.130958ms)
✔ 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing (0.103041ms)
✔ 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000 (0.127083ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.193625ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (0.445208ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.214125ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.112708ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.232458ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.1595ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.137042ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.131792ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.106583ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.148792ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.13725ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.213958ms)
✔ duplicate taxpayer or spouse roles are rejected (0.114417ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.099167ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.116834ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.183958ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.113209ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.091292ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.088542ms)
✔ exposes the IRC 125 and IRC 129 parameter table without extrapolating it (0.115ms)
✔ rejects a bare FSA account type but accepts each unambiguous spelling (0.062ms)
✔ validates health FSA plan facts before calculating anything (0.315ms)
✔ the health FSA builder reaches every IRC 125(i) plan fact (0.249416ms)
✔ validates IRC 129 earned income facts before calculating anything (0.237667ms)
✔ the dependent care builder reaches the IRC 129(b) earned income facts (0.253458ms)
✔ conformance: ordinary 2026 401k plan-term capacity (16.768125ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.359792ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.3455ms)
✔ conformance: shared traditional and Roth IRA pool (0.378833ms)
✔ conformance: 401k and governmental 457b are separate (0.398084ms)
✔ conformance: mega backdoor 401k fills 415c (0.221791ms)
✔ conformance: self-employed solo 401k (0.167625ms)
✔ conformance: 403b 15-year catch-up (0.184458ms)
✔ conformance: 457b special last-three-years catch-up (0.159375ms)
✔ conformance: 1994 historical employer-plan limits (0.205291ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.127833ms)
✔ conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule (0.177083ms)
✔ conformance: 1982 nonworking spouse IRA (0.09975ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.390875ms)
✔ conformance: in-plan Roth rollover basis (0.20225ms)
✔ conformance: 2026 enhanced SIMPLE (0.232208ms)
✔ conformance: cash-balance contribution is actuarial (0.176917ms)
✔ conformance: self-employed retirement deduction classification (0.110083ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.794459ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.142375ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.113792ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.177042ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.10725ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.170958ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.152625ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.136292ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.068ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.063417ms)
✔ conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold (0.103708ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.066958ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.065666ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.080958ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.073375ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.086459ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.071666ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.093292ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.075042ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.076042ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.05975ms)
✔ conformance: 2023 first-year Roth employer contribution (0.066584ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.065708ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.067708ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.047708ms)
✔ conformance: unsupported tax year 1974 (0.202334ms)
✔ conformance: duplicate account id (0.049167ms)
✔ conformance: unknown account owner (0.046417ms)
✔ conformance: negative compensation is invalid money (0.04425ms)
✔ conformance: invalid filing status alias (0.035167ms)
✔ conformance: 2026 full-year self-only HSA limit (0.472167ms)
✔ conformance: 2026 full-year family HSA limit (0.11075ms)
✔ conformance: 2026 mid-year HSA coverage change prorated by month (0.399541ms)
✔ conformance: 2026 both spouses age 55 receive separate HSA catch-ups (0.303291ms)
✔ conformance: 2026 spouses divide the single family HSA limit as agreed (0.225584ms)
✔ conformance: 2026 HSA last-month rule with a satisfied testing period (0.185458ms)
✔ conformance: 2026 HSA last-month rule failed in the testing period (0.258375ms)
✔ conformance: 2005 HSA monthly limit capped by the plan annual deductible (0.154291ms)
✔ conformance: 2006 HSA monthly limit capped by the statutory dollar amount (0.103625ms)
✔ conformance: 2026 employer HSA contribution is excluded rather than deducted (0.09875ms)
✔ conformance: 2003 predates IRC 223 health savings accounts (0.078041ms)
✔ conformance: 2026 HSA last-month rule with an unresolved testing period (0.094292ms)
✔ conformance: 2026 married filing separately family coverage recharacterizes the other spouse (0.167334ms)
✔ conformance: 2026 spouse family and self-only months divide only the family portion (0.205042ms)
✔ conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit (0.15375ms)
✔ conformance: 2026 married last-month rule measures the attributable amount against the divided limit (0.178125ms)
✔ conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months (0.140666ms)
✔ conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate (0.132083ms)
✔ conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact (0.096917ms)
✔ conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A) (0.095875ms)
✔ conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division (0.121542ms)
✔ conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount (0.083208ms)
✔ conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched (0.106667ms)
✔ conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below (0.073209ms)
✔ conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule (0.083625ms)
✔ conformance: persons entry that is not an object is rejected (0.06175ms)
✔ conformance: accounts entry that is not an object is rejected (0.046792ms)
✔ conformance: conversions entry that is not an object is rejected (0.05875ms)
✔ conformance: account without an ownerId is rejected (0.131208ms)
✔ conformance: conversion without an ownerId is rejected (0.05875ms)
✔ conformance: unrecognized contributionPreference is rejected (0.05475ms)
✔ conformance: unrecognized employerContributionTaxTreatment is rejected (0.045917ms)
✔ conformance: rate outside 0 through 1 is rejected (0.044625ms)
✔ conformance: existing contributions above the account ceiling name the amounts (0.115833ms)
✔ conformance: taxYear that is not an integer is rejected (0.0255ms)
✔ conformance: missing filingStatus is rejected rather than defaulted (0.072917ms)
✔ conformance: filingStatus that is not a string is rejected (0.042167ms)
✔ conformance: accounts that is not an array is rejected (0.04375ms)
✔ conformance: conversions that is not an array is rejected (0.050375ms)
✔ conformance: account type that is not a string is rejected (0.044667ms)
✔ conformance: person id that is not a string is rejected (0.0465ms)
✔ conformance: structured input field that is not an object is rejected (0.055334ms)
✔ conformance: unrecognized simpleEmployerContributionMethod is rejected (0.046416ms)
✔ conformance: 1989 fractional plan-term capacity keeps its fraction in the message (0.165459ms)
✔ conformance: flag field that is not a boolean is rejected (0.121209ms)
✔ conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C) (0.213958ms)
✔ conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount (0.109041ms)
✔ conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero (0.682ms)
✔ conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division (0.20025ms)
✔ conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead (0.112209ms)
✔ conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount (0.101666ms)
✔ conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides (0.084208ms)
✔ conformance: 2026 family-limit shares that do not exhaust the limitation are not a division (0.128583ms)
✔ conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing (0.102167ms)
✔ conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything (0.083ms)
✔ conformance: 2026 incomplete family-limit shares report only the missing-share error (0.082708ms)
✔ conformance: 2026 flexible spending arrangement parameters are published in the result (0.045833ms)
✔ conformance: 2012 carries no IRC 125(i) health FSA parameters (0.04075ms)
✔ conformance: 1986 predates the IRC 129 dependent care exclusion limitation (0.037042ms)
✔ conformance: 2026 health FSA election at the IRC 125(i) limit (0.214ms)
✔ conformance: 2013 is the first year IRC 125(i) limits a health FSA election (0.076792ms)
✔ conformance: 2012 health FSA has no statutory salary-reduction ceiling (0.061459ms)
✔ conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited (0.07525ms)
✔ conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit (0.076083ms)
✔ conformance: a health FSA grace period precludes a carryover (0.065542ms)
✔ conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount (0.056958ms)
✔ conformance: a health FSA carryover and grace period asserted together are refused (0.06425ms)
✔ conformance: nothing may be carried into 2013, the first year the carryover existed (0.051042ms)
✔ conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled (0.066833ms)
✔ conformance: a prior-year unused amount without a stated plan option asks for the fact (0.060792ms)
✔ conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated (0.103708ms)
✔ conformance: an account type that did not exist for the tax year reports no exclusion (0.08125ms)
✔ conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a) (0.097041ms)
✔ conformance: two unrelated employers each carry a full health FSA limit (0.067541ms)
✔ conformance: two health FSAs of one employer share a single IRC 125(i) limit (0.055708ms)
✔ conformance: spouses filing jointly each carry a full health FSA limit (0.060042ms)
✔ conformance: non-elective employer flex credits stay outside the IRC 125(i) limit (0.055333ms)
✔ conformance: flex credits electable as cash consume the IRC 125(i) limit (0.0485ms)
✔ conformance: flex credits without a stated cash election ask for the fact (0.052584ms)
✔ conformance: a lower plan-document health FSA limit binds (0.064041ms)
✔ conformance: a lower plan-document limit caps its own arrangement, not the employer group (0.077875ms)
✔ conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure (0.067375ms)
✔ conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate (0.053667ms)
✔ conformance: a bare FSA account type is rejected as ambiguous (0.057833ms)
✔ conformance: an unrecognised health FSA purpose is rejected (0.044042ms)
✔ conformance: 2025 dependent care assistance exclusion on a single return (0.208625ms)
✔ conformance: 2025 dependent care exclusion is halved on a married separate return (0.083125ms)
✔ conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount (0.069916ms)
✔ conformance: a separate return that states it is still married keeps the halved amount (0.076834ms)
✔ conformance: 2021 only, the ARPA dependent care exclusion is 10500 (0.089458ms)
✔ conformance: 2022 reverts to the pre-ARPA dependent care exclusion (0.068792ms)
✔ conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21 (0.059584ms)
✔ conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount (0.064709ms)
✔ conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent (0.073167ms)
✔ conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled (0.074792ms)
✔ conformance: spouses filing jointly share one IRC 129 household exclusion (0.109042ms)
✔ conformance: married separate spouses do not share one IRC 129 exclusion (0.072292ms)
✔ conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs (0.071125ms)
✔ conformance: a dependent care plan document below the IRC 129 amount binds this arrangement (0.079208ms)
✔ conformance: a dependent care plan document caps its own arrangement, not the household amount (0.075291ms)
✔ conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns (0.078167ms)
✔ conformance: 1986 predates the IRC 129(a)(2)(A) limitation of exclusion (0.070083ms)
✔ conformance: 1981 predates IRC 129 entirely (0.049417ms)
✔ conformance: a health FSA and a dependent care FSA carry independent limits (0.07125ms)
✔ conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures (0.115583ms)
✔ conformance: a limited-purpose health FSA raises no IRC 223 conflict (0.090208ms)
✔ conformance: a post-deductible health FSA raises no IRC 223 conflict (0.07375ms)
✔ conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate (0.074584ms)
✔ conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA (0.0905ms)
✔ conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year (0.081958ms)
✔ conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification (0.43225ms)
✔ conformance: a dependent care FSA raises no IRC 223 conflict at all (0.233042ms)
ℹ tests 206
ℹ suites 0
ℹ pass 206
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 110.149042
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
ok - 2012 carries no IRC 125(i) health FSA parameters
ok - 1986 predates the IRC 129 dependent care exclusion limitation
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
ok - 1986 predates the IRC 129(a)(2)(A) limitation of exclusion
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

160 conformance vectors, 0 failed
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
TypeScript/PHP full-output parity passed for 160 vectors.
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
    "size": 247293,
    "unpackedSize": 2016249,
    "shasum": "d0c925c269ce7d661bf356bd4077bc2c8012fa7d",
    "integrity": "sha512-MjQgIuf0tR8WTl8lWp/0L+CVdtfgxiiiXcnuM0fXGFTaauwG8H3xV99cgkenJaOui6H5HK2fH7BfKmvAcA1xBg==",
    "filename": "us-tax-advantaged-params-0.2.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 47799,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 11830,
        "mode": 420
      },
      {
        "path": "data/fsa-parameters.json",
        "size": 19191,
        "mode": 420
      },
      {
        "path": "data/hsa-parameters.json",
        "size": 19834,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 173101,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 523260,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 298053,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 522336,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 298178,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 48664,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 48664,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 4247,
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

