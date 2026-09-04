# Validation Report

- **Package:** `us-tax-advantaged-params@0.4.0`
- **Run:** 2026-09-04T05:54:45.876Z through 2026-09-04T05:54:51.478Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 288
- **Node:** v24.17.0
- **npm:** 11.13.0
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.6
- **Composer:** Composer version 2.10.1 2026-06-04 10:25:59

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 113 ms |
| Generated native parameter blocks | PASS | 0 | 93 ms |
| Source manifests and publication files | PASS | 0 | 67 ms |
| Strict TypeScript typecheck | PASS | 0 | 225 ms |
| TypeScript unit and conformance tests | PASS | 0 | 1079 ms |
| PHP engine syntax | PASS | 0 | 74 ms |
| PHP unit-test syntax | PASS | 0 | 44 ms |
| PHP conformance-test syntax | PASS | 0 | 44 ms |
| PHP parity runner syntax | PASS | 0 | 42 ms |
| PHP unit tests | PASS | 0 | 87 ms |
| PHP conformance vectors | PASS | 0 | 163 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 1541 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 88 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 368 ms |
| Built-package manifest validation | PASS | 0 | 65 ms |
| npm package dry run | PASS | 0 | 643 ms |
| Composer manifest validation | PASS | 0 | 301 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 23 contiguous HSA tax years, 45 contiguous FSA tax years, 70 sources, 288 conformance vectors.
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

> us-tax-advantaged-params@0.4.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USTaxAdvantagedParams.test.js dist-tests/tests/conformance.test.js


> us-tax-advantaged-params@0.4.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

✔ supports the first general IRA year through the generated year without extrapolation (3.083183ms)
✔ normalizes common filing-status and account aliases (0.493089ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (26.070899ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (1.025139ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.668808ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (1.06937ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.973775ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.717077ms)
✔ reports the quantified amount of an existing contribution above an account ceiling (0.667581ms)
✔ 401(k) and 457(b) employee limits are separate (1.875551ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.799102ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.624933ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.538554ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.51676ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.546796ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.535346ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.396056ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (1.41828ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.415356ms)
✔ 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing (0.316859ms)
✔ 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000 (0.384326ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.546473ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (1.035376ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.569048ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.402109ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.665101ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.476206ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.389115ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.414867ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.321812ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.529965ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.430921ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.554244ms)
✔ duplicate taxpayer or spouse roles are rejected (0.320581ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.358125ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.380099ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.552163ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.387026ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.331142ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.32493ms)
✔ exposes the IRC 125 and IRC 129 parameter table without extrapolating it (0.347846ms)
✔ rejects a bare FSA account type but accepts each unambiguous spelling (0.194082ms)
✔ validates health FSA plan facts before calculating anything (0.8725ms)
✔ the health FSA builder reaches every IRC 125(i) plan fact (0.706406ms)
✔ validates IRC 129 earned income facts before calculating anything (0.693371ms)
✔ the dependent care builder reaches the IRC 129(b) earned income facts (0.72885ms)
✔ conformance: ordinary 2026 401k plan-term capacity (31.957402ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.806999ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.766101ms)
✔ conformance: shared traditional and Roth IRA pool (0.963904ms)
✔ conformance: 401k and governmental 457b are separate (1.566518ms)
✔ conformance: mega backdoor 401k fills 415c (0.571264ms)
✔ conformance: self-employed solo 401k (0.513557ms)
✔ conformance: 403b 15-year catch-up (0.56611ms)
✔ conformance: 457b special last-three-years catch-up (0.5106ms)
✔ conformance: 1994 historical employer-plan limits (0.537904ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.335206ms)
✔ conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule (0.410492ms)
✔ conformance: 1982 nonworking spouse IRA (0.207743ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.826338ms)
✔ conformance: in-plan Roth rollover basis (0.581025ms)
✔ conformance: 2026 enhanced SIMPLE (0.636492ms)
✔ conformance: cash-balance contribution is actuarial (0.41388ms)
✔ conformance: self-employed retirement deduction classification (0.35419ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.276011ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.274301ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.249353ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.435145ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.346232ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.377801ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.447332ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.400588ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.242076ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.277701ms)
✔ conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold (0.328894ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.247726ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.273595ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.27689ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.349293ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.304886ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.279171ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.34222ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.296283ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.351579ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.361829ms)
✔ conformance: 2023 first-year Roth employer contribution (0.280691ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.264406ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.262531ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.209424ms)
✔ conformance: unsupported tax year 1974 (0.544922ms)
✔ conformance: duplicate account id (0.209934ms)
✔ conformance: unknown account owner (0.177808ms)
✔ conformance: negative compensation is invalid money (0.144243ms)
✔ conformance: invalid filing status alias (0.122307ms)
✔ conformance: 2026 full-year self-only HSA limit (1.919362ms)
✔ conformance: 2026 full-year family HSA limit (0.526865ms)
✔ conformance: 2026 mid-year HSA coverage change prorated by month (1.307357ms)
✔ conformance: 2026 both spouses age 55 receive separate HSA catch-ups (1.109762ms)
✔ conformance: 2026 spouses divide the single family HSA limit as agreed (0.853352ms)
✔ conformance: 2026 HSA last-month rule with a satisfied testing period (1.863097ms)
✔ conformance: 2026 HSA last-month rule failed in the testing period (0.545883ms)
✔ conformance: 2005 HSA monthly limit capped by the plan annual deductible (0.403705ms)
✔ conformance: 2006 HSA monthly limit capped by the statutory dollar amount (0.308331ms)
✔ conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate (0.457936ms)
✔ conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate (0.326091ms)
✔ conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate (0.552094ms)
✔ conformance: 2005 a spouse's self-only deductible does not lower the IRC 223(b)(5) family limitation (0.396225ms)
✔ conformance: 2005 two family plans take the lower annual deductible under IRC 223(b)(5)(A) (0.283283ms)
✔ conformance: 2005 a family-covered spouse who omits their annual deductible leaves the family limitation indeterminate (0.274557ms)
✔ conformance: 2005 one spouse's conflicting coverage facts leave the other spouse's share of the family limitation indeterminate (0.470678ms)
✔ conformance: 2005 a spouse's family plan sets the deductible only for the months that plan was in force (0.393206ms)
✔ conformance: 2005 an omitted annual deductible and an explicit null are the same fact (0.292786ms)
✔ conformance: 2007 no annual deductible is required once the IRC 223(b)(2) cap is repealed (0.30513ms)
✔ conformance: a missing birth year leaves the IRC 223(b)(5) household limit determinable (0.389799ms)
✔ conformance: 2026 employer HSA contribution is excluded rather than deducted (0.28854ms)
✔ conformance: 2003 predates IRC 223 health savings accounts (0.265608ms)
✔ conformance: 2026 HSA last-month rule with an unresolved testing period (0.328264ms)
✔ conformance: 2026 married filing separately family coverage recharacterizes the other spouse (0.396227ms)
✔ conformance: 2026 spouse family and self-only months divide only the family portion (0.454663ms)
✔ conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit (0.421789ms)
✔ conformance: 2026 married last-month rule measures the attributable amount against the divided limit (0.522995ms)
✔ conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months (0.394904ms)
✔ conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate (0.451279ms)
✔ conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact (0.39777ms)
✔ conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A) (0.361908ms)
✔ conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division (0.394587ms)
✔ conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount (0.298955ms)
✔ conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched (0.441817ms)
✔ conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below (0.308881ms)
✔ conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule (0.339752ms)
✔ conformance: persons entry that is not an object is rejected (0.190553ms)
✔ conformance: accounts entry that is not an object is rejected (0.159826ms)
✔ conformance: conversions entry that is not an object is rejected (0.24024ms)
✔ conformance: account without an ownerId is rejected (0.192398ms)
✔ conformance: conversion without an ownerId is rejected (0.23635ms)
✔ conformance: unrecognized contributionPreference is rejected (0.168554ms)
✔ conformance: unrecognized employerContributionTaxTreatment is rejected (0.140296ms)
✔ conformance: rate outside 0 through 1 is rejected (0.130638ms)
✔ conformance: existing contributions above the account ceiling name the amounts (0.341531ms)
✔ conformance: taxYear that is not an integer is rejected (0.088031ms)
✔ conformance: missing filingStatus is rejected rather than defaulted (0.195003ms)
✔ conformance: filingStatus that is not a string is rejected (0.11914ms)
✔ conformance: accounts that is not an array is rejected (0.121454ms)
✔ conformance: conversions that is not an array is rejected (0.183532ms)
✔ conformance: account type that is not a string is rejected (0.180495ms)
✔ conformance: person id that is not a string is rejected (0.13271ms)
✔ conformance: structured input field that is not an object is rejected (0.161421ms)
✔ conformance: unrecognized simpleEmployerContributionMethod is rejected (0.143859ms)
✔ conformance: 1989 fractional plan-term capacity keeps its fraction in the message (0.306912ms)
✔ conformance: flag field that is not a boolean is rejected (0.211583ms)
✔ conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C) (0.353136ms)
✔ conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount (1.480296ms)
✔ conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero (0.295417ms)
✔ conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division (0.332139ms)
✔ conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead (0.333394ms)
✔ conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount (0.296395ms)
✔ conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides (0.271042ms)
✔ conformance: 2026 family-limit shares that do not exhaust the limitation are not a division (0.386367ms)
✔ conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing (0.346618ms)
✔ conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything (0.362224ms)
✔ conformance: 2026 incomplete family-limit shares report only the missing-share error (0.350423ms)
✔ conformance: 2026 flexible spending arrangement parameters are published in the result (0.253308ms)
✔ conformance: 2012 health FSA exists with no statutory ceiling rather than not existing (0.158769ms)
✔ conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all (0.118104ms)
✔ conformance: 2026 health FSA election at the IRC 125(i) limit (0.517298ms)
✔ conformance: 2013 is the first year IRC 125(i) limits a health FSA election (0.242222ms)
✔ conformance: 2012 health FSA has no statutory salary-reduction ceiling (0.199681ms)
✔ conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited (0.265174ms)
✔ conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit (0.237688ms)
✔ conformance: a health FSA grace period precludes a carryover (0.239774ms)
✔ conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount (0.237195ms)
✔ conformance: a health FSA carryover and grace period asserted together are refused (0.200025ms)
✔ conformance: nothing may be carried into 2013, the first year the carryover existed (0.175914ms)
✔ conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled (0.20586ms)
✔ conformance: a prior-year unused amount without a stated plan option asks for the fact (0.239387ms)
✔ conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated (0.242744ms)
✔ conformance: an account type that did not exist for the tax year reports no exclusion (0.277299ms)
✔ conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a) (0.227318ms)
✔ conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum (0.196281ms)
✔ conformance: two unrelated employers each carry a full health FSA limit (0.208687ms)
✔ conformance: two health FSAs of one employer share a single IRC 125(i) limit (0.189885ms)
✔ conformance: spouses filing jointly each carry a full health FSA limit (0.243186ms)
✔ conformance: non-elective employer flex credits stay outside the IRC 125(i) limit (0.207138ms)
✔ conformance: flex credits electable as cash consume the IRC 125(i) limit (0.18243ms)
✔ conformance: flex credits without a stated cash election ask for the fact (0.255811ms)
✔ conformance: a lower plan-document health FSA limit binds (0.371913ms)
✔ conformance: a lower plan-document limit caps its own arrangement, not the employer group (0.299809ms)
✔ conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure (0.226545ms)
✔ conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate (0.179343ms)
✔ conformance: a bare FSA account type is rejected as ambiguous (0.147101ms)
✔ conformance: an unrecognised health FSA purpose is rejected (0.121109ms)
✔ conformance: 2025 dependent care assistance exclusion on a single return (0.530757ms)
✔ conformance: 2025 dependent care exclusion is halved on a married separate return (0.275703ms)
✔ conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount (0.22583ms)
✔ conformance: a separate return that states it is still married keeps the halved amount (0.30234ms)
✔ conformance: 2021 only, the ARPA dependent care exclusion is 10500 (0.326973ms)
✔ conformance: 2022 reverts to the pre-ARPA dependent care exclusion (0.216907ms)
✔ conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21 (0.186112ms)
✔ conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount (0.204042ms)
✔ conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent (0.26681ms)
✔ conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled (0.253861ms)
✔ conformance: spouses filing jointly share one IRC 129 household exclusion (0.360715ms)
✔ conformance: married separate spouses do not share one IRC 129 exclusion (0.23142ms)
✔ conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs (0.223394ms)
✔ conformance: a dependent care plan document below the IRC 129 amount binds this arrangement (0.24967ms)
✔ conformance: a dependent care plan document caps its own arrangement, not the household amount (0.213355ms)
✔ conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns (0.228749ms)
✔ conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling (0.212149ms)
✔ conformance: 1986 dependent care with no ceiling from any source stays indeterminate (0.178735ms)
✔ conformance: 1981 predates IRC 129 entirely (0.156302ms)
✔ conformance: a health FSA and a dependent care FSA carry independent limits (0.266532ms)
✔ conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures (0.389543ms)
✔ conformance: a limited-purpose health FSA raises no IRC 223 conflict (0.273655ms)
✔ conformance: a post-deductible health FSA raises no IRC 223 conflict (0.287092ms)
✔ conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate (1.27771ms)
✔ conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA (0.473652ms)
✔ conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year (0.445477ms)
✔ conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification (0.313348ms)
✔ conformance: a dependent care FSA raises no IRC 223 conflict at all (0.259249ms)
✔ conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit (0.30107ms)
✔ conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit (0.200163ms)
✔ conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit (0.178594ms)
✔ conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs (0.238638ms)
✔ conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance (0.211615ms)
✔ conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance (0.167775ms)
✔ conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance (0.204757ms)
✔ conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i) (0.461543ms)
✔ conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance (0.2297ms)
✔ conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing (0.213588ms)
✔ conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount (0.24134ms)
✔ conformance: 2023 has no pension-linked emergency savings account (0.185745ms)
✔ conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate (0.189562ms)
✔ conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k) (0.296222ms)
✔ conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure (0.26188ms)
✔ conformance: a pension-linked emergency savings account needs no birth year (0.234474ms)
✔ conformance: 2026 a spouse's contradictory coverage tiers leave IRC 223(b)(5)(A) applicability unknown, self-only account listed first (0.315725ms)
✔ conformance: 2026 the same contradictory spouse coverage gives the same answer with the family account listed first (0.281737ms)
✔ conformance: 2026 a spouse's coverage facts that conflict only in the annual deductible leave the other spouse determinate (0.297553ms)
✔ conformance: 2026 a spouse's coverage conflict outside the owner's eligible months leaves the owner determinate (0.498556ms)
✔ conformance: 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies (0.366451ms)
✔ conformance: 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit (0.491211ms)
✔ conformance: 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate (0.409148ms)
✔ conformance: 2026 an HSA whose planRules.hsa states no coverage facts is a missing fact, not an assertion of no coverage (0.311117ms)
✔ conformance: 2026 an empty persons[].hsaCoverage is the documented statement of no coverage and leaves the other spouse determinate (0.241306ms)
✔ conformance: 2026 a spouse's self-only-versus-no-coverage disagreement leaves the household ceiling indeterminate, all-year account first (0.284712ms)
✔ conformance: 2026 the same self-only-versus-no-coverage disagreement gives the same answer with the December-only account first (0.284981ms)
✔ conformance: 2026 a spouse's conflicting IRC 223(b)(8) election leaves the household ceiling indeterminate, election-true account first (0.345514ms)
✔ conformance: 2026 the same conflicting IRC 223(b)(8) election gives the same answer with the non-electing account first (0.355736ms)
✔ conformance: 2026 a spouse's conflicting IRC 223(b)(8)(B)(iii) testing-period fact leaves the household ceiling knowable (0.379734ms)
✔ conformance: 2005 a spouse's conflicting self-only deductibles reach the household ceiling in a capped year (0.336463ms)
✔ conformance: 2026 a person-level coverage statement does not disagree with an account-only familyLimitShare (0.309436ms)
✔ conformance: 2026 an age-50 catch-up fills pension-linked emergency savings room the 401(k) host's base pool has no space for (0.451905ms)
✔ conformance: 2026 the same age-50 catch-up fills pension-linked emergency savings room on a 403(b) host (0.349633ms)
✔ conformance: 2026 a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds the base and the catch-up together (0.272354ms)
✔ conformance: 2026 the pension-linked emergency savings balance and existing contributions are not subtracted twice (0.259006ms)
✔ conformance: 2026 a replenished pension-linked emergency savings account may take more in the year than the balance cap (0.219859ms)
✔ conformance: 2026 a pension-linked emergency savings account needs a birth year only once a catch-up could reach its room (0.539749ms)
✔ conformance: 2026 a pension-linked emergency savings catch-up needs no prior-year FICA wages (0.304394ms)
✔ conformance: 2026 a 457(b) plan-document deferral limit lowers the contributable amount but not the statutory maximum (0.251818ms)
✔ conformance: 2026 a 457(b) account with no plan-document limit is unchanged by the statutory-maximum split (0.261535ms)
✔ conformance: 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount caps the balance and not the year's deferrals (0.264249ms)
✔ conformance: 2026 an unwithdrawn balance leaves the sponsor's IRC 402A(e)(3)(A)(ii) room correctly reduced (0.20673ms)
✔ conformance: 2026 a governmental 457(b)-hosted PLESA draws the IRC 457(e)(15) pool and not IRC 402(g) (0.241557ms)
✔ conformance: 2026 a governmental 457(b)-hosted PLESA joins no IRC 415(c) group even when one is supplied (0.283338ms)
✔ conformance: 2026 the two PLESA hosts share no pool with each other (0.255194ms)
✔ conformance: 2023 a governmental 457(b)-hosted PLESA does not yet exist (0.17157ms)
✔ conformance: 2026 an IRC 414(v) catch-up fills governmental 457(b) PLESA room the IRC 457(e)(15) pool cannot (1.521326ms)
✔ conformance: 2026 the IRC 457(b)(3) last-three-years catch-up fills governmental 457(b) PLESA room (0.313231ms)
✔ conformance: 2026 an IRC 457(b)(3) year needs no birth date, because IRC 414(v)(6)(C) removes the age catch-up (0.294528ms)
✔ conformance: 2026 a governmental 457(b) PLESA needs a birth date once a catch-up could reach its room (0.238077ms)
✔ conformance: 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount binds base and catch-up together on the 457(b) host (0.314671ms)
✔ conformance: 2026 the sponsor's clause (ii) amount caps the balance on the 457(b) host too (0.221432ms)
✔ conformance: 2026 an IRC 457(b)(3) extra below the year's largest age catch-up still needs the birth date (0.234836ms)
✔ conformance: 2026 the same IRC 457(b)(3) facts with a known age take the larger IRC 414(v) catch-up instead (0.235211ms)
✔ conformance: 2026 an IRC 457(b)(3) extra equal to the year's largest age catch-up still needs the birth date (0.219331ms)
✔ conformance: 2026 the same equal IRC 457(b)(3) amount with a known age of 61 takes the IRC 414(v) route (0.220417ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up to a Roth governmental 457(b) is Roth, not pre-tax (0.265437ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up to a traditional governmental 457(b) stays pre-tax (0.200223ms)
✔ conformance: 2026 an explicitly null plan-document limit means the sponsor set no IRC 402A(e)(3)(A)(ii) amount (0.195563ms)
✔ conformance: 2026 a governmental 457(b) PLESA seeds neither the IRC 402(g) pool nor an IRC 415(c) group (0.293938ms)
✔ conformance: 2026 an existing Roth IRC 457(b)(3) catch-up seeds the IRC 457(b)(3) pool, not the age pool (0.262295ms)
✔ conformance: 2026 a qualified-plan PLESA ignores a pretax_first preference and stays Roth (0.222765ms)
✔ conformance: 2026 a governmental 457(b) PLESA ignores a pretax_first preference and stays Roth (0.207742ms)
✔ conformance: 2026 a qualified-plan PLESA age-based catch-up ignores a pretax_first preference (0.287519ms)
✔ conformance: 2026 a governmental 457(b) PLESA age-based catch-up ignores a pretax_first preference (0.268914ms)
✔ conformance: 2026 a PLESA IRC 457(b)(3) catch-up ignores a pretax_first preference and stays Roth (0.25202ms)
✔ conformance: 2026 a PLESA whose supplied plan rules forbid Roth still contributes Roth, not pre-tax (0.21273ms)
✔ conformance: 2026 an ordinary designated Roth 401(k) still honours a pretax_first preference (0.234579ms)
✔ conformance: 2026 an explicitly null PLESA participant-contribution balance is indeterminate (0.172423ms)
✔ conformance: 2026 an explicitly null PLESA balance is indeterminate on the governmental 457(b) host (0.19191ms)
✔ conformance: 2026 two governmental 457(b) accounts cannot use both catch-up methods in one year (0.223382ms)
✔ conformance: 2026 reversing two governmental 457(b) accounts changes neither method nor total (0.202388ms)
✔ conformance: 2026 two plans' IRC 457(b)(3) amounts take the largest, not the sum (0.198299ms)
✔ conformance: 2026 the largest-of rule for two IRC 457(b)(3) plans does not depend on input order (0.19174ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling is reduced by catch-ups already made under it (0.246115ms)
✔ conformance: 2026 catch-ups supplied under both IRC 457 methods are diagnosed as a pair (0.357392ms)
✔ conformance: 2026 a governmental 457(b) with no birth date is indeterminate, not a confident zero (0.307438ms)
✔ conformance: 2026 the same governmental 457(b) with a birth year reaches a different number (0.19665ms)
✔ conformance: 2026 a nongovernmental 457(b) with no birth date stays silent (0.169136ms)
✔ conformance: 2026 a governmental 457(b) whose compensation binds asks no age question (0.161359ms)
✔ conformance: 2026 an IRC 457(b)(3) amount above the year's largest age catch-up settles the method (0.195282ms)
✔ conformance: 2006 the 26 CFR 1.457-5(d) Example 2 ceiling across four eligible plans (0.490487ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling stands above the compensation the basic limitation exhausts (0.2863ms)
✔ conformance: 2026 compensation above the base limitation bounds the catch-up to what is left (0.239047ms)
✔ conformance: 2026 an isolated governmental PLESA whose room the base deferral fills asks no age question (0.21229ms)
✔ conformance: 2026 a governmental PLESA whose room outlives the base pool still asks the age question (0.240435ms)
✔ conformance: 2026 both IRC 457 catch-up methods are invalid together even below the dollar ceiling (0.217789ms)
✔ conformance: 2026 the two IRC 457 catch-up methods are exclusive across employers, not just within a plan (0.276484ms)
✔ conformance: 2026 existing catch-up under the one selected IRC 457 method is not a mutual-exclusivity breach (0.198769ms)
✔ conformance: 2026 the IRC 457(b)(3) plan ceiling beats the age-based one on a compensation the age method cannot use (0.188142ms)
✔ conformance: 2026 an unknown age settles nothing where compensation leaves no room for an age-based catch-up (0.182358ms)
✔ conformance: 2006 a plan already holding its whole IRC 457(b)(3) amount takes none of the participant's remainder (0.210305ms)
✔ conformance: 2026 a catch-up recorded under the unselected IRC 457 method is diagnosed on its own (0.19328ms)
✔ conformance: 2026 two plans' existing age-based catch-ups exceed the participant's one IRC 414(v) amount (0.277205ms)
✔ conformance: 2026 two plans' existing IRC 457(b)(3) catch-ups exceed the largest amount any one of them provides (0.283538ms)
✔ conformance: 2026 an age-based catch-up recorded on a tax-exempt entity's IRC 457(b) plan is rejected (0.311492ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up recorded on a plan providing no such provision is rejected (0.282805ms)
✔ conformance: 2026 an existing IRC 457(b)(3) catch-up above its own plan's amount is rejected on that plan (0.262826ms)
✔ conformance: 2023 an account type the year does not offer contaminates no valid plan's ceiling or method (0.280162ms)
✔ conformance: 2026 the participant's IRC 414(v) amount is the largest one plan's compensation allows, not the sum (0.215137ms)
✔ conformance: 2026 an age-based catch-up recorded where IRC 457(b)(3) applies is diagnosed on its own (0.252656ms)
✔ conformance: 2023 an unavailable account's existing contributions seed no valid plan's pool (0.287102ms)
✔ conformance: 2026 the IRC 457(b)(3) sum limb is built on the compensation-bounded paragraph (2) ceiling (0.192832ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling stops at twice the IRC 457(e)(15) amount (0.177319ms)
✔ conformance: 2026 an existing IRC 457 catch-up still needs age classification when no new room remains (0.23797ms)
✔ conformance: 2026 one plan's catch-up classification error blocks participant-wide catch-up allocation (0.271542ms)
✔ conformance: 2026 missing PLESA balance does not hide its local or participant-wide IRC 457 catch-up classification effects (0.280759ms)
✔ conformance: 2026 a base-only IRC 457 plan remains determinate when another plan blocks special catch-up (0.337694ms)
✔ conformance: 2026 a missing-balance PLESA outside the selected method does not inherit another plan's classification block (0.444569ms)
✔ conformance: 2026 a plan without required Roth catch-up does not inherit another plan's classification block (1.361879ms)
✔ conformance: 2026 an exhausted governmental PLESA remains determinate when another plan blocks special catch-up (0.263416ms)
✔ conformance: 2026 missing PLESA balance preserves age-independent mutually exclusive catch-up error (0.212664ms)
✔ conformance: 2026 missing-balance PLESA with no account-local age catch-up room does not inherit a classification block (0.227558ms)
✔ conformance: 2026 missing-balance PLESA preserves its unsupported existing special catch-up diagnostic (0.217742ms)
ℹ tests 334
ℹ suites 0
ℹ pass 334
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 317.483865
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

46 tests, 0 failed (0.011s)
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
ok - 2026 an HSA whose planRules.hsa states no coverage facts is a missing fact, not an assertion of no coverage
ok - 2026 an empty persons[].hsaCoverage is the documented statement of no coverage and leaves the other spouse determinate
ok - 2026 a spouse's self-only-versus-no-coverage disagreement leaves the household ceiling indeterminate, all-year account first
ok - 2026 the same self-only-versus-no-coverage disagreement gives the same answer with the December-only account first
ok - 2026 a spouse's conflicting IRC 223(b)(8) election leaves the household ceiling indeterminate, election-true account first
ok - 2026 the same conflicting IRC 223(b)(8) election gives the same answer with the non-electing account first
ok - 2026 a spouse's conflicting IRC 223(b)(8)(B)(iii) testing-period fact leaves the household ceiling knowable
ok - 2005 a spouse's conflicting self-only deductibles reach the household ceiling in a capped year
ok - 2026 a person-level coverage statement does not disagree with an account-only familyLimitShare
ok - 2026 an age-50 catch-up fills pension-linked emergency savings room the 401(k) host's base pool has no space for
ok - 2026 the same age-50 catch-up fills pension-linked emergency savings room on a 403(b) host
ok - 2026 a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds the base and the catch-up together
ok - 2026 the pension-linked emergency savings balance and existing contributions are not subtracted twice
ok - 2026 a replenished pension-linked emergency savings account may take more in the year than the balance cap
ok - 2026 a pension-linked emergency savings account needs a birth year only once a catch-up could reach its room
ok - 2026 a pension-linked emergency savings catch-up needs no prior-year FICA wages
ok - 2026 a 457(b) plan-document deferral limit lowers the contributable amount but not the statutory maximum
ok - 2026 a 457(b) account with no plan-document limit is unchanged by the statutory-maximum split
ok - 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount caps the balance and not the year's deferrals
ok - 2026 an unwithdrawn balance leaves the sponsor's IRC 402A(e)(3)(A)(ii) room correctly reduced
ok - 2026 a governmental 457(b)-hosted PLESA draws the IRC 457(e)(15) pool and not IRC 402(g)
ok - 2026 a governmental 457(b)-hosted PLESA joins no IRC 415(c) group even when one is supplied
ok - 2026 the two PLESA hosts share no pool with each other
ok - 2023 a governmental 457(b)-hosted PLESA does not yet exist
ok - 2026 an IRC 414(v) catch-up fills governmental 457(b) PLESA room the IRC 457(e)(15) pool cannot
ok - 2026 the IRC 457(b)(3) last-three-years catch-up fills governmental 457(b) PLESA room
ok - 2026 an IRC 457(b)(3) year needs no birth date, because IRC 414(v)(6)(C) removes the age catch-up
ok - 2026 a governmental 457(b) PLESA needs a birth date once a catch-up could reach its room
ok - 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount binds base and catch-up together on the 457(b) host
ok - 2026 the sponsor's clause (ii) amount caps the balance on the 457(b) host too
ok - 2026 an IRC 457(b)(3) extra below the year's largest age catch-up still needs the birth date
ok - 2026 the same IRC 457(b)(3) facts with a known age take the larger IRC 414(v) catch-up instead
ok - 2026 an IRC 457(b)(3) extra equal to the year's largest age catch-up still needs the birth date
ok - 2026 the same equal IRC 457(b)(3) amount with a known age of 61 takes the IRC 414(v) route
ok - 2026 an IRC 457(b)(3) catch-up to a Roth governmental 457(b) is Roth, not pre-tax
ok - 2026 an IRC 457(b)(3) catch-up to a traditional governmental 457(b) stays pre-tax
ok - 2026 an explicitly null plan-document limit means the sponsor set no IRC 402A(e)(3)(A)(ii) amount
ok - 2026 a governmental 457(b) PLESA seeds neither the IRC 402(g) pool nor an IRC 415(c) group
ok - 2026 an existing Roth IRC 457(b)(3) catch-up seeds the IRC 457(b)(3) pool, not the age pool
ok - 2026 a qualified-plan PLESA ignores a pretax_first preference and stays Roth
ok - 2026 a governmental 457(b) PLESA ignores a pretax_first preference and stays Roth
ok - 2026 a qualified-plan PLESA age-based catch-up ignores a pretax_first preference
ok - 2026 a governmental 457(b) PLESA age-based catch-up ignores a pretax_first preference
ok - 2026 a PLESA IRC 457(b)(3) catch-up ignores a pretax_first preference and stays Roth
ok - 2026 a PLESA whose supplied plan rules forbid Roth still contributes Roth, not pre-tax
ok - 2026 an ordinary designated Roth 401(k) still honours a pretax_first preference
ok - 2026 an explicitly null PLESA participant-contribution balance is indeterminate
ok - 2026 an explicitly null PLESA balance is indeterminate on the governmental 457(b) host
ok - 2026 two governmental 457(b) accounts cannot use both catch-up methods in one year
ok - 2026 reversing two governmental 457(b) accounts changes neither method nor total
ok - 2026 two plans' IRC 457(b)(3) amounts take the largest, not the sum
ok - 2026 the largest-of rule for two IRC 457(b)(3) plans does not depend on input order
ok - 2026 the IRC 457(b)(3) ceiling is reduced by catch-ups already made under it
ok - 2026 catch-ups supplied under both IRC 457 methods are diagnosed as a pair
ok - 2026 a governmental 457(b) with no birth date is indeterminate, not a confident zero
ok - 2026 the same governmental 457(b) with a birth year reaches a different number
ok - 2026 a nongovernmental 457(b) with no birth date stays silent
ok - 2026 a governmental 457(b) whose compensation binds asks no age question
ok - 2026 an IRC 457(b)(3) amount above the year's largest age catch-up settles the method
ok - 2006 the 26 CFR 1.457-5(d) Example 2 ceiling across four eligible plans
ok - 2026 the IRC 457(b)(3) ceiling stands above the compensation the basic limitation exhausts
ok - 2026 compensation above the base limitation bounds the catch-up to what is left
ok - 2026 an isolated governmental PLESA whose room the base deferral fills asks no age question
ok - 2026 a governmental PLESA whose room outlives the base pool still asks the age question
ok - 2026 both IRC 457 catch-up methods are invalid together even below the dollar ceiling
ok - 2026 the two IRC 457 catch-up methods are exclusive across employers, not just within a plan
ok - 2026 existing catch-up under the one selected IRC 457 method is not a mutual-exclusivity breach
ok - 2026 the IRC 457(b)(3) plan ceiling beats the age-based one on a compensation the age method cannot use
ok - 2026 an unknown age settles nothing where compensation leaves no room for an age-based catch-up
ok - 2006 a plan already holding its whole IRC 457(b)(3) amount takes none of the participant's remainder
ok - 2026 a catch-up recorded under the unselected IRC 457 method is diagnosed on its own
ok - 2026 two plans' existing age-based catch-ups exceed the participant's one IRC 414(v) amount
ok - 2026 two plans' existing IRC 457(b)(3) catch-ups exceed the largest amount any one of them provides
ok - 2026 an age-based catch-up recorded on a tax-exempt entity's IRC 457(b) plan is rejected
ok - 2026 an IRC 457(b)(3) catch-up recorded on a plan providing no such provision is rejected
ok - 2026 an existing IRC 457(b)(3) catch-up above its own plan's amount is rejected on that plan
ok - 2023 an account type the year does not offer contaminates no valid plan's ceiling or method
ok - 2026 the participant's IRC 414(v) amount is the largest one plan's compensation allows, not the sum
ok - 2026 an age-based catch-up recorded where IRC 457(b)(3) applies is diagnosed on its own
ok - 2023 an unavailable account's existing contributions seed no valid plan's pool
ok - 2026 the IRC 457(b)(3) sum limb is built on the compensation-bounded paragraph (2) ceiling
ok - 2026 the IRC 457(b)(3) ceiling stops at twice the IRC 457(e)(15) amount
ok - 2026 an existing IRC 457 catch-up still needs age classification when no new room remains
ok - 2026 one plan's catch-up classification error blocks participant-wide catch-up allocation
ok - 2026 missing PLESA balance does not hide its local or participant-wide IRC 457 catch-up classification effects
ok - 2026 a base-only IRC 457 plan remains determinate when another plan blocks special catch-up
ok - 2026 a missing-balance PLESA outside the selected method does not inherit another plan's classification block
ok - 2026 a plan without required Roth catch-up does not inherit another plan's classification block
ok - 2026 an exhausted governmental PLESA remains determinate when another plan blocks special catch-up
ok - 2026 missing PLESA balance preserves age-independent mutually exclusive catch-up error
ok - 2026 missing-balance PLESA with no account-local age catch-up room does not inherit a classification block
ok - 2026 missing-balance PLESA preserves its unsupported existing special catch-up diagnostic

288 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> us-tax-advantaged-params@0.4.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> us-tax-advantaged-params@0.4.0 generate:check
> node scripts/generate.mjs --check


> us-tax-advantaged-params@0.4.0 clean
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
TypeScript/PHP full-output parity passed for 288 vectors.
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
    "id": "us-tax-advantaged-params@0.4.0",
    "name": "us-tax-advantaged-params",
    "version": "0.4.0",
    "size": 323315,
    "unpackedSize": 2389653,
    "shasum": "b72795fe6c819e9b42185835af5c67a8a2143bbe",
    "integrity": "sha512-EbSpqmhrxH8tbNYzF6yeYhHeqeNng50N4oCUcG5JEg29xDWWsE+QGswnBNkrj9+SGWANextu9vdlnusZsXK1gw==",
    "filename": "us-tax-advantaged-params-0.4.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 70788,
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
        "size": 637219,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 341707,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 636295,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 341832,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 54804,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 54804,
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

