# Validation Report

- **Package:** `us-tax-advantaged-params@0.5.0`
- **Run:** 2026-09-16T14:28:59.943Z through 2026-09-16T14:29:06.479Z
- **Overall:** PASS
- **Tax years:** 1975-2026
- **Shared vectors:** 613
- **Node:** v24.11.0
- **npm:** 11.6.1
- **TypeScript:** Version 7.0.2
- **PHP:** 8.5.10
- **Composer:** Composer version 2.10.3 2026-08-27 13:34:23

## Check summary

| Check | Result | Exit | Duration |
|---|---:|---:|---:|
| Canonical parameter and vector validation | PASS | 0 | 56 ms |
| Generated native parameter blocks | PASS | 0 | 75 ms |
| Source manifests and publication files | PASS | 0 | 38 ms |
| Strict TypeScript typecheck | PASS | 0 | 133 ms |
| TypeScript unit and conformance tests | PASS | 0 | 722 ms |
| PHP engine syntax | PASS | 0 | 67 ms |
| PHP unit-test syntax | PASS | 0 | 57 ms |
| PHP conformance-test syntax | PASS | 0 | 58 ms |
| PHP parity runner syntax | PASS | 0 | 56 ms |
| PHP unit tests | PASS | 0 | 89 ms |
| PHP conformance vectors | PASS | 0 | 1410 ms |
| ESM, CommonJS, and declaration build | PASS | 0 | 963 ms |
| ESM/CommonJS smoke imports | PASS | 0 | 52 ms |
| Complete TypeScript/PHP output parity | PASS | 0 | 1615 ms |
| Built-package manifest validation | PASS | 0 | 37 ms |
| npm package dry run | PASS | 0 | 394 ms |
| Composer manifest validation | PASS | 0 | 282 ms |

## Runtime qualification note

The local PHP run satisfied the Composer PHP requirement.

## Detailed output

### Canonical parameter and vector validation

Command: `node scripts/validate-data.mjs`

**stdout**

```text
Canonical data validation passed: 52 contiguous retirement tax years, 24 contiguous HSA tax years, 45 contiguous FSA tax years, 36 contiguous payroll tax years, 31 contiguous education tax years, 12 contiguous ABLE tax years, 30 contiguous adoption tax years, 10 contiguous HRA tax years, 28 contiguous commuter tax years, 233 sources, 613 conformance vectors.
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

> us-tax-advantaged-params@0.5.0 test:ts
> npm run test:compile && node --test dist-tests/tests/USTaxAdvantagedParams.test.js dist-tests/tests/conformance.test.js


> us-tax-advantaged-params@0.5.0 test:compile
> node scripts/clean-tests.mjs && tsc -p tsconfig.tests.json

✔ supports the first general IRA year through the generated year without extrapolation (1.239125ms)
✔ exposes the IRC 414(q), 416(i) and 25B figures from the first year each has one (0.180166ms)
✔ normalizes common filing-status and account aliases (0.222666ms)
✔ 2026 ordinary 401(k) distinguishes employee maximum from plan-term-dependent 415(c) capacity (15.695958ms)
✔ 2026 age-60-to-63 catch-up is forced to Roth above the prior-year wage threshold (0.507042ms)
✔ high-wage participant receives no catch-up when supplied plan terms omit Roth catch-up (0.252209ms)
✔ 2026 Roth IRA MFJ phase-out is linear and rounded under the IRS method (0.55375ms)
✔ 2026 active-participant traditional IRA deduction phases out while total contribution remains available (0.425083ms)
✔ traditional and Roth IRAs share one owner-level contribution pool (0.322167ms)
✔ reports the quantified amount of an existing contribution above an account ceiling (0.274916ms)
✔ 401(k) and 457(b) employee limits are separate (1.328125ms)
✔ two 401(k) plans share the owner-level 402(g) limit but retain separate employer 415(c) groups (0.275041ms)
✔ mega-backdoor-capable 401(k) fills remaining 415(c) space after deferral and employer amount (0.234417ms)
✔ self-employed solo 401(k) uses the 20% equivalent employer rate and can fill after-tax space (0.186459ms)
✔ self-employed SEP maximum uses the reduced 20% net-earnings rate (0.186416ms)
✔ 403(b) 15-year catch-up is applied after the ordinary 402(g) amount and before age catch-up (0.18225ms)
✔ 457(b) last-three-years catch-up is selected when larger than the age catch-up (0.962208ms)
✔ 1994 employer-plan limits use historical 402(g), 415(c), and compensation-fraction values (0.159416ms)
✔ pre-1987 401(k) maximum is explicitly indeterminate rather than invented (0.105417ms)
✔ 1981 active employer-plan participant is ineligible for the modeled IRA contribution (0.142917ms)
✔ 1982 one-earner spousal IRA allows $2,000 to the spousal account when the worker contributes nothing (0.116541ms)
✔ 1982 one-earner spousal IRA is limited to the $2,250 household residue after the worker's own $2,000 (0.16125ms)
✔ pre-2020 traditional IRA age-70½ restriction is enforced (0.204542ms)
✔ IRA-to-Roth conversion applies aggregate Form 8606 pro-rata basis and does not consume contribution limits (0.442208ms)
✔ in-plan Roth rollover reports only the pre-tax portion as taxable (0.214ms)
✔ defined-benefit and cash-balance contributions remain actuarially indeterminate (0.141042ms)
✔ 2026 enhanced SIMPLE limit and age-60-to-63 catch-up are both applied (0.253083ms)
✔ self-employed plan deduction includes elective deferral and employer contribution but excludes IRA deductions (0.158917ms)
✔ pre-2010 MFS taxpayer living apart may convert when under the historical MAGI ceiling (0.13475ms)
✔ additional SIMPLE nonelective contribution is capped by 10% of recognized compensation (0.145375ms)
✔ SIMPLE IRA catch-up remains pre-tax for a high-wage participant because IRC 408(p) is excluded (0.12425ms)
✔ multiple 403(b) accounts share one owner-level 15-year catch-up pool (0.182958ms)
✔ Roth employer contributions are rejected before their 2023 effective year (0.136916ms)
✔ multiple IRA conversions allocate aggregate pro-rata basis without penny over-allocation (0.206625ms)
✔ duplicate taxpayer or spouse roles are rejected (0.122708ms)
✔ ambiguous M alias is accepted but produces a diagnostic (0.112375ms)
✔ 1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate (0.116542ms)
✔ 1997 employer nonelective formula applies the 401(a)(17) compensation ceiling (0.192458ms)
✔ 1997 employer match uses recognized compensation without capping employee elective deferrals (0.130834ms)
✔ 1997 self-employed SEP applies both the reduced-rate and recognized-compensation worksheet ceilings (0.101ms)
✔ 1997 self-employed qualified-plan formula applies both reduced-rate and recognized-compensation ceilings (0.104916ms)
✔ exposes the 2027 IRC 223 amounts Rev. Proc. 2026-24 publishes, and no later year (0.134ms)
✔ exposes the IRC 125 and IRC 129 parameter table without extrapolating it (0.115417ms)
✔ exposes the IRC 530, IRC 127 and IRC 529 parameter table from the statutes that set it (0.173ms)
✔ exposes the IRC 529A ABLE table and its 2026 separation from the IRC 2503(b) exclusion (0.097792ms)
✔ exposes the IRC 23 and IRC 137 adoption table through each statutory change (0.157ms)
✔ exposes the QSEHRA, excepted benefit HRA and individual coverage HRA table (0.1235ms)
✔ exposes the IRC 132(f) commuter table with every retroactive correction applied (0.1505ms)
✔ rejects a bare FSA account type but accepts each unambiguous spelling (0.070875ms)
✔ validates health FSA plan facts before calculating anything (0.3285ms)
✔ the health FSA builder reaches every IRC 125(i) plan fact (0.263209ms)
✔ validates IRC 129 earned income facts before calculating anything (0.2415ms)
✔ the dependent care builder reaches the IRC 129(b) earned income facts (0.256292ms)
✔ the IRC 223(b)(5)(B)(ii) division diagnostic does not claim a shared limit it is not reporting (2.555166ms)
✔ HSA owner normalization: complete and unusable account is invariant under account permutation (0.557916ms)
✔ HSA owner normalization: person agrees with only one account is invariant under account permutation (0.482125ms)
✔ HSA owner normalization: missing capped-year deductible is invariant under account permutation (0.303667ms)
✔ HSA owner normalization: reordered eligible months is invariant under account permutation (0.592292ms)
✔ HSA owner normalization: equivalent monthly representation is invariant under account permutation (0.274416ms)
✔ HSA owner normalization: empty account with person coverage is invariant under account permutation (0.281875ms)
✔ HSA owner normalization: spouse capped-year deductible is invariant under account permutation (1.37225ms)
✔ HSA owner normalization: person and account explicit no coverage is invariant under account permutation (0.290875ms)
✔ nonempty unusable person HSA statements never assert no coverage (1.219334ms)
✔ the married capped-year comparison preserves deductible conflict provenance (1.382041ms)
✔ missing married person records leave the Archer operand unestablished even with a whole share (1.402542ms)
✔ an agreed whole share with both person records retains paragraph-5 Archer ordering for either owner role (0.855208ms)
✔ payroll parameter and scenario builder snapshots are detached (0.126958ms)
✔ conformance: ordinary 2026 401k plan-term capacity (19.399917ms)
✔ conformance: 2026 high-wage age-60-to-63 Roth catch-up (0.479584ms)
✔ conformance: 2026 Roth IRA MFJ phaseout (0.336542ms)
✔ conformance: shared traditional and Roth IRA pool (0.337583ms)
✔ conformance: 401k and governmental 457b are separate (1.31725ms)
✔ conformance: mega backdoor 401k fills 415c (0.2495ms)
✔ conformance: self-employed solo 401k (0.281834ms)
✔ conformance: 403b 15-year catch-up (0.263666ms)
✔ conformance: 457b special last-three-years catch-up (0.280125ms)
✔ conformance: 1994 historical employer-plan limits (0.188667ms)
✔ conformance: 1985 employer-plan limit remains indeterminate (0.115333ms)
✔ conformance: 1979 spousal IRA is indeterminate under the former IRC 220 twice-the-lesser rule (0.185417ms)
✔ conformance: 1982 nonworking spouse IRA (0.091209ms)
✔ conformance: IRA conversion Form 8606 pro-rata (0.39775ms)
✔ conformance: in-plan Roth rollover basis (0.193667ms)
✔ conformance: 2026 enhanced SIMPLE (0.236125ms)
✔ conformance: cash-balance contribution is actuarial (0.1405ms)
✔ conformance: self-employed retirement deduction classification (0.122291ms)
✔ conformance: 2009 MFS living apart Roth conversion (0.102125ms)
✔ conformance: SIMPLE additional nonelective 10 percent cap (0.10625ms)
✔ conformance: SIMPLE IRA Roth catch-up wage-test exclusion (0.077167ms)
✔ conformance: aggregate 403b 15-year catch-up pool (0.131292ms)
✔ conformance: pre-2023 Roth employer contribution unavailable (0.081083ms)
✔ conformance: aggregate IRA conversion basis penny allocation (0.132375ms)
✔ conformance: 1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate (0.137667ms)
✔ conformance: 1997 nonelective formula applies 401a17 compensation ceiling (0.132167ms)
✔ conformance: 2026 the OBRA '93 grandfathered governmental compensation limit lifts the IRC 401(a)(17) ceiling (0.077958ms)
✔ conformance: 2026 the same plan without the OBRA '93 assertion takes the ordinary IRC 401(a)(17) limit (0.067041ms)
✔ conformance: 1997 the grandfathered governmental limit is asserted for a year the IRS never published one (0.066625ms)
✔ conformance: 1994 unknown grandfathered compensation withholds traditional_401k capacity and preserves existing amounts (0.071792ms)
✔ conformance: 1995 unknown grandfathered compensation withholds sep_ira capacity and preserves existing amounts (0.05675ms)
✔ conformance: 1996 unknown grandfathered compensation withholds profit_sharing_plan capacity and preserves existing amounts (0.054458ms)
✔ conformance: 1997 unknown grandfathered compensation withholds simple_ira capacity and preserves existing amounts (0.057625ms)
✔ conformance: 1997 unknown grandfathered compensation withholds simple_401k capacity and preserves existing amounts (0.065083ms)
✔ conformance: 1997 unknown grandfathered compensation also withholds a companion shared-pool ceiling (0.08225ms)
✔ conformance: 1993 grandfathered compensation unknown-year guard respects effective and published boundaries (0.219208ms)
✔ conformance: 1998 grandfathered compensation unknown-year guard respects effective and published boundaries (0.065958ms)
✔ conformance: 1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings (0.063083ms)
✔ conformance: 1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings (0.057875ms)
✔ conformance: 1998 SEP compensation below 400 reports maximum-excludable threshold (0.103792ms)
✔ conformance: 2005 designated Roth governmental 457b unavailable (0.073292ms)
✔ conformance: 2011 first-year designated Roth governmental 457b (0.162333ms)
✔ conformance: 2025 SIMPLE 401k match capped by 401a17 compensation (0.090584ms)
✔ conformance: 2025 SIMPLE IRA match exempt from 401a17 compensation cap (0.089833ms)
✔ conformance: 2026 MFS living together Roth IRA phase-out (0.101959ms)
✔ conformance: 2026 MFS living together covered traditional IRA deduction phase-out (0.082167ms)
✔ conformance: 2026 modern spousal IRA from joint compensation (0.080625ms)
✔ conformance: 2026 noncovered spouse deduction phase-out band (0.087791ms)
✔ conformance: 2026 ordinary age-50 catch-up at age 56 (0.082625ms)
✔ conformance: 2026 age-64 reversion from enhanced catch-up (0.069042ms)
✔ conformance: 2023 first-year Roth employer contribution (0.085291ms)
✔ conformance: 2010 Roth conversion after MAGI repeal (0.073ms)
✔ conformance: 2020 traditional IRA contribution after age-70-half repeal (0.0695ms)
✔ conformance: 1975 first-year traditional IRA fifteen percent limit (0.055375ms)
✔ conformance: unsupported tax year 1974 (0.201334ms)
✔ conformance: duplicate account id (0.188041ms)
✔ conformance: unknown account owner (0.098458ms)
✔ conformance: negative compensation is invalid money (0.072875ms)
✔ conformance: invalid filing status alias (0.049417ms)
✔ conformance: 2026 full-year self-only HSA limit (1.375459ms)
✔ conformance: 2026 full-year family HSA limit (0.245208ms)
✔ conformance: 2026 mid-year HSA coverage change prorated by month, with no December eligible month (0.419958ms)
✔ conformance: 2026 the same mid-year change takes the IRC 223(b)(8) greater-of without being asked (0.26025ms)
✔ conformance: 2026 both spouses age 55 receive separate HSA catch-ups (1.040083ms)
✔ conformance: 2026 spouses divide the single family HSA limit as agreed (0.446666ms)
✔ conformance: 2026 HSA last-month rule with a satisfied testing period (0.224208ms)
✔ conformance: 2026 HSA last-month rule failed in the testing period (0.164041ms)
✔ conformance: 2005 HSA monthly limit capped by the plan annual deductible (0.213375ms)
✔ conformance: 2006 HSA monthly limit capped by the statutory dollar amount (0.140792ms)
✔ conformance: 2006 the IRC 223(b)(8) greater-of does not reach a year before the rule existed (0.134667ms)
✔ conformance: 2005 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate (0.623875ms)
✔ conformance: 2004 married couple with family coverage and no stated annual deductible leaves the IRC 223(b)(5) household limit indeterminate (0.374833ms)
✔ conformance: 2005 married couple with family coverage under two plans takes the lower annual deductible and stays determinate (0.288333ms)
✔ conformance: 2005 a spouse's self-only deductible does not lower the IRC 223(b)(5) family limitation (0.228125ms)
✔ conformance: 2005 two family plans take the lower annual deductible under IRC 223(b)(5)(A) (0.216125ms)
✔ conformance: 2005 a family-covered spouse who omits their annual deductible leaves the family limitation indeterminate (0.275708ms)
✔ conformance: 2005 one spouse's conflicting coverage facts leave the other spouse's share of the family limitation indeterminate (0.663916ms)
✔ conformance: 2005 a spouse's family plan sets the deductible only for the months that plan was in force (0.255ms)
✔ conformance: 2005 an omitted annual deductible and an explicit null are the same fact (0.901041ms)
✔ conformance: 2007 no annual deductible is required once the IRC 223(b)(2) cap is repealed (0.260166ms)
✔ conformance: a missing birth year leaves the IRC 223(b)(5) household limit determinable (0.347667ms)
✔ conformance: 2026 employer HSA contribution is excluded rather than deducted (0.140958ms)
✔ conformance: 2003 predates IRC 223 health savings accounts (0.110916ms)
✔ conformance: 2026 HSA last-month rule with an unresolved testing period (0.165834ms)
✔ conformance: 2026 married filing separately family coverage recharacterizes the other spouse (0.19675ms)
✔ conformance: 2026 spouse family and self-only months divide only the family portion (0.221959ms)
✔ conformance: 2026 spouses with unequal family-coverage months each divide their own refigured family limit (0.184417ms)
✔ conformance: 2026 married last-month rule measures the attributable amount against the divided limit (0.269333ms)
✔ conformance: 2026 spouse family coverage without an HSA recharacterizes the taxpayer's self-only months (0.152167ms)
✔ conformance: 2026 unstated spouse coverage leaves a self-only HSA limit indeterminate (0.516125ms)
✔ conformance: 2026 spouse without high deductible coverage leaves the self-only HSA limit intact (0.154875ms)
✔ conformance: 2026 unmarried Archer MSA contribution reduces the HSA limit under IRC 223(b)(4)(A) (0.141041ms)
✔ conformance: 2026 married Archer MSA reduction is taken before the IRC 223(b)(5)(B)(ii) division (0.314ms)
✔ conformance: 2026 IRC 223(b)(4)(A) reduces the whole subsection (b) limitation including the age 55 amount (0.109291ms)
✔ conformance: 2026 IRC 223(b)(5)(B) leaves the age 55 additional contribution amount untouched (0.157625ms)
✔ conformance: 2026 Archer MSA contribution above the HSA limit reduces it to zero, never below (0.098875ms)
✔ conformance: 2026 Archer MSA reduction follows the IRC 223(b)(8) last-month rule (0.116458ms)
✔ conformance: persons entry that is not an object is rejected (0.059583ms)
✔ conformance: accounts entry that is not an object is rejected (0.055125ms)
✔ conformance: conversions entry that is not an object is rejected (0.05675ms)
✔ conformance: account without an ownerId is rejected (0.047416ms)
✔ conformance: conversion without an ownerId is rejected (0.055916ms)
✔ conformance: unrecognized contributionPreference is rejected (0.054417ms)
✔ conformance: unrecognized employerContributionTaxTreatment is rejected (0.046875ms)
✔ conformance: rate outside 0 through 1 is rejected (0.042125ms)
✔ conformance: existing contributions above the account ceiling name the amounts (0.116209ms)
✔ conformance: taxYear that is not an integer is rejected (0.024125ms)
✔ conformance: missing filingStatus is rejected rather than defaulted (0.056875ms)
✔ conformance: filingStatus that is not a string is rejected (0.042708ms)
✔ conformance: accounts that is not an array is rejected (0.045209ms)
✔ conformance: conversions that is not an array is rejected (0.052041ms)
✔ conformance: account type that is not a string is rejected (0.045083ms)
✔ conformance: person id that is not a string is rejected (0.043583ms)
✔ conformance: structured input field that is not an object is rejected (0.040792ms)
✔ conformance: unrecognized simpleEmployerContributionMethod is rejected (0.044167ms)
✔ conformance: 1989 fractional plan-term capacity keeps its fraction in the message (0.108542ms)
✔ conformance: flag field that is not a boolean is rejected (0.051542ms)
✔ conformance: 2026 unmarried qualified HSA funding distribution reduces the limit under IRC 223(b)(4)(C) (0.154792ms)
✔ conformance: 2026 qualified HSA funding distribution reaches the IRC 223(b)(3) additional contribution amount (0.126708ms)
✔ conformance: 2026 IRC 223(b)(4) reduces by the sum of subparagraphs (A) and (C) but not below zero (0.132666ms)
✔ conformance: 2026 married qualified HSA funding distribution is taken after the IRC 223(b)(5)(B)(ii) division (0.233542ms)
✔ conformance: 2026 matched Archer MSA contribution of the same amount is taken before the division instead (0.215417ms)
✔ conformance: 2026 married qualified HSA funding distribution reaches that spouse's IRC 223(b)(3) amount (0.201583ms)
✔ conformance: 2026 qualified HSA funding distribution follows the IRC 223(b)(8) last-month rule on both sides (0.123583ms)
✔ conformance: 2026 family-limit shares totalling exactly one may still give a spouse nothing (0.219375ms)
✔ conformance: 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything (0.19975ms)
✔ conformance: 2026 flexible spending arrangement parameters are published in the result (0.071833ms)
✔ conformance: 2012 health FSA exists with no statutory ceiling rather than not existing (0.057417ms)
✔ conformance: 1986 has an IRC 129 row with no dollar ceiling; 1981 has no row at all (0.050375ms)
✔ conformance: 2026 health FSA election at the IRC 125(i) limit (0.2465ms)
✔ conformance: 2013 is the first year IRC 125(i) limits a health FSA election (0.092542ms)
✔ conformance: 2012 health FSA has no statutory salary-reduction ceiling (0.075209ms)
✔ conformance: 2026 health FSA carryover is capped by the 2025 cap and the excess is forfeited (0.092292ms)
✔ conformance: 2026 health FSA carryover sits on top of the IRC 125(i) limit (0.093208ms)
✔ conformance: a health FSA grace period precludes a carryover (0.07875ms)
✔ conformance: a health FSA offering neither carryover nor grace period forfeits the whole unused amount (0.071125ms)
✔ conformance: a health FSA carryover and grace period asserted together are refused (0.070584ms)
✔ conformance: nothing may be carried into 2013, the first year the carryover existed (0.06675ms)
✔ conformance: a 2021 health FSA carryover out of 2020 discloses that CAA 2021 section 214 relief is not modelled (0.088375ms)
✔ conformance: a prior-year unused amount without a stated plan option asks for the fact (0.085625ms)
✔ conformance: a health FSA election above the IRC 125(i) limit is reported, not truncated (0.112333ms)
✔ conformance: an account type that did not exist for the tax year reports no exclusion (0.088959ms)
✔ conformance: a pre-2013 health FSA still excludes its salary reduction under IRC 125(a) (0.075833ms)
✔ conformance: a pre-2013 health FSA with a supplied plan maximum reports that maximum (0.071542ms)
✔ conformance: two unrelated employers each carry a full health FSA limit (0.083625ms)
✔ conformance: two health FSAs of one employer share a single IRC 125(i) limit (0.070708ms)
✔ conformance: spouses filing jointly each carry a full health FSA limit (0.081542ms)
✔ conformance: non-elective employer flex credits stay outside the IRC 125(i) limit (0.066583ms)
✔ conformance: flex credits electable as cash consume the IRC 125(i) limit (0.060167ms)
✔ conformance: flex credits without a stated cash election ask for the fact (0.058375ms)
✔ conformance: a lower plan-document health FSA limit binds (0.065417ms)
✔ conformance: a lower plan-document limit caps its own arrangement, not the employer group (0.071791ms)
✔ conformance: exceeding a plan-document limit is not the IRC 125(i) qualification failure (0.061791ms)
✔ conformance: a non-calendar cafeteria plan year makes the IRC 125(i) figure indeterminate (0.057209ms)
✔ conformance: a bare FSA account type is rejected as ambiguous (0.050666ms)
✔ conformance: an unrecognised health FSA purpose is rejected (0.047042ms)
✔ conformance: 2025 dependent care assistance exclusion on a single return (0.217583ms)
✔ conformance: 2025 dependent care exclusion is halved on a married separate return (0.095125ms)
✔ conformance: an IRC 21(e)(4) considered-unmarried separate return takes the undivided amount (0.077667ms)
✔ conformance: a separate return that states it is still married keeps the halved amount (0.264209ms)
✔ conformance: 2021 only, the ARPA dependent care exclusion is 10500 (0.147584ms)
✔ conformance: 2022 reverts to the pre-ARPA dependent care exclusion (0.104291ms)
✔ conformance: 2026 dependent care exclusion rises to 7500 under Pub. L. 119-21 (0.089584ms)
✔ conformance: the IRC 129(b)(1) earned income limitation binds below the statutory amount (0.088291ms)
✔ conformance: the IRC 129(b)(1) limitation is asked for when the earned income facts are absent (0.115417ms)
✔ conformance: the IRC 129(b)(2) deemed earned income schedule is disclosed as unmodelled (0.112875ms)
✔ conformance: spouses filing jointly share one IRC 129 household exclusion (0.239167ms)
✔ conformance: married separate spouses do not share one IRC 129 exclusion (0.135083ms)
✔ conformance: the IRC 129(b)(1) ceiling is a return-level figure across two dependent care FSAs (0.113208ms)
✔ conformance: a dependent care plan document below the IRC 129 amount binds this arrangement (0.2205ms)
✔ conformance: a dependent care plan document caps its own arrangement, not the household amount (0.138667ms)
✔ conformance: the IRC 129(b)(1) ceiling does not pool across married separate returns (0.127708ms)
✔ conformance: 1986 dependent care has no statutory ceiling, so the earned income limitation is the ceiling (0.090834ms)
✔ conformance: 1986 dependent care with no ceiling from any source stays indeterminate (0.084417ms)
✔ conformance: 1981 predates IRC 129 entirely (0.056042ms)
✔ conformance: a health FSA and a dependent care FSA carry independent limits (0.09125ms)
✔ conformance: a general-purpose health FSA is diagnosed against an HSA without changing the IRC 223 figures (0.16875ms)
✔ conformance: a limited-purpose health FSA raises no IRC 223 conflict (0.137083ms)
✔ conformance: a post-deductible health FSA raises no IRC 223 conflict (0.114083ms)
✔ conformance: a health FSA of unstated purpose makes the IRC 223 limitation indeterminate (0.122625ms)
✔ conformance: a spouse's general-purpose health FSA disqualifies the other spouse's HSA (0.150417ms)
✔ conformance: a general-purpose health FSA carryover disqualifies the whole receiving plan year (0.126333ms)
✔ conformance: a general-purpose health FSA grace period extends the IRC 223 disqualification (0.115333ms)
✔ conformance: a dependent care FSA raises no IRC 223 conflict at all (0.109959ms)
✔ conformance: 2026 defined benefit plan reports the IRC 415(b)(1)(A) annual benefit limit (0.091458ms)
✔ conformance: 2011 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit (0.059417ms)
✔ conformance: 2012 cash balance plan reports the transcribed IRC 415(b)(1)(A) annual benefit limit (0.056166ms)
✔ conformance: 2001 403(b) is indeterminate because the IRC 403(b)(2) exclusion allowance still governs (0.079666ms)
✔ conformance: 2002 403(b) is determinable because EGTRRA repealed the exclusion allowance (0.089625ms)
✔ conformance: 1986 403(b) still reports the missing IRC 415(c) limit rather than the exclusion allowance (0.05975ms)
✔ conformance: 2001 401(k) is unaffected by the IRC 403(b)(2) exclusion allowance (0.061792ms)
✔ conformance: 2026 pension-linked emergency savings account is capped by IRC 402A(e)(3)(A)(i) (0.166167ms)
✔ conformance: 2025 pension-linked emergency savings room is the IRC 402A(e)(3)(A) cap less the participant contribution balance (0.072458ms)
✔ conformance: a pension-linked emergency savings account already at the IRC 402A(e)(3)(A) cap accepts nothing (0.069875ms)
✔ conformance: 2024 pension-linked emergency savings uses the unadjusted statutory IRC 402A(e)(3)(A)(i) amount (0.077708ms)
✔ conformance: 2023 has no pension-linked emergency savings account (0.07575ms)
✔ conformance: a pension-linked emergency savings account without a supplied participant contribution balance is indeterminate (0.060041ms)
✔ conformance: a pension-linked emergency savings account shares the IRC 402(g) limit with the plan's 401(k) (0.108917ms)
✔ conformance: a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds below the statutory figure (0.069042ms)
✔ conformance: a pension-linked emergency savings account needs no birth year (0.0735ms)
✔ conformance: 2026 a spouse's contradictory coverage tiers leave IRC 223(b)(5)(A) applicability unknown, self-only account listed first (0.350709ms)
✔ conformance: 2026 the same contradictory spouse coverage gives the same answer with the family account listed first (0.271ms)
✔ conformance: 2026 a spouse's coverage facts that conflict only in the annual deductible leave the other spouse determinate (0.167583ms)
✔ conformance: 2026 a spouse's coverage conflict reaches a December-only owner through the IRC 223(b)(8) year (0.302541ms)
✔ conformance: 2026 the same conflict leaves an owner the IRC 223(b)(8) year does not reach determinate (0.194209ms)
✔ conformance: 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies (0.236291ms)
✔ conformance: 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit (0.523333ms)
✔ conformance: 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate (0.31425ms)
✔ conformance: 2026 an HSA whose planRules.hsa states no coverage facts is a missing fact, not an assertion of no coverage (0.447708ms)
✔ conformance: 2026 an empty persons[].hsaCoverage is the documented statement of no coverage and leaves the other spouse determinate (0.135292ms)
✔ conformance: 2026 a spouse's self-only-versus-no-coverage disagreement leaves the household ceiling indeterminate, all-year account first (0.544583ms)
✔ conformance: 2026 the same self-only-versus-no-coverage disagreement gives the same answer with the December-only account first (0.40825ms)
✔ conformance: 2005 a spouse's conflicting self-only deductibles reach the household ceiling in a capped year (0.478458ms)
✔ conformance: 2026 a person-level coverage statement does not disagree with the account that repeats it (0.19875ms)
✔ conformance: 2026 an age-50 catch-up fills pension-linked emergency savings room the 401(k) host's base pool has no space for (0.156584ms)
✔ conformance: 2026 the same age-50 catch-up fills pension-linked emergency savings room on a 403(b) host (0.116375ms)
✔ conformance: 2026 a plan sponsor's lower IRC 402A(e)(3)(A)(ii) amount binds the base and the catch-up together (0.103209ms)
✔ conformance: 2026 the pension-linked emergency savings balance and existing contributions are not subtracted twice (0.09725ms)
✔ conformance: 2026 a replenished pension-linked emergency savings account may take more in the year than the balance cap (0.071709ms)
✔ conformance: 2026 a pension-linked emergency savings account needs a birth year only once a catch-up could reach its room (0.116791ms)
✔ conformance: 2026 a pension-linked emergency savings catch-up needs no prior-year FICA wages (0.078708ms)
✔ conformance: 2026 a 457(b) plan-document deferral limit lowers the contributable amount but not the statutory maximum (0.178125ms)
✔ conformance: 2026 a 457(b) account with no plan-document limit is unchanged by the statutory-maximum split (0.749666ms)
✔ conformance: 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount caps the balance and not the year's deferrals (0.187083ms)
✔ conformance: 2026 an unwithdrawn balance leaves the sponsor's IRC 402A(e)(3)(A)(ii) room correctly reduced (0.0895ms)
✔ conformance: 2026 a governmental 457(b)-hosted PLESA draws the IRC 457(e)(15) pool and not IRC 402(g) (0.166791ms)
✔ conformance: 2026 a governmental 457(b)-hosted PLESA joins no IRC 415(c) group even when one is supplied (0.168667ms)
✔ conformance: 2026 the two PLESA hosts share no pool with each other (0.129ms)
✔ conformance: 2023 a governmental 457(b)-hosted PLESA does not yet exist (0.065833ms)
✔ conformance: 2026 an IRC 414(v) catch-up fills governmental 457(b) PLESA room the IRC 457(e)(15) pool cannot (0.233542ms)
✔ conformance: 2026 the IRC 457(b)(3) last-three-years catch-up fills governmental 457(b) PLESA room (0.174708ms)
✔ conformance: 2026 an IRC 457(b)(3) year needs no birth date, because IRC 414(v)(6)(C) removes the age catch-up (0.147417ms)
✔ conformance: 2026 a governmental 457(b) PLESA needs a birth date once a catch-up could reach its room (0.230792ms)
✔ conformance: 2026 a sponsor's IRC 402A(e)(3)(A)(ii) amount binds base and catch-up together on the 457(b) host (0.127459ms)
✔ conformance: 2026 the sponsor's clause (ii) amount caps the balance on the 457(b) host too (0.097292ms)
✔ conformance: 2026 an IRC 457(b)(3) extra below the year's largest age catch-up still needs the birth date (0.131958ms)
✔ conformance: 2026 the same IRC 457(b)(3) facts with a known age take the larger IRC 414(v) catch-up instead (0.109666ms)
✔ conformance: 2026 an IRC 457(b)(3) extra equal to the year's largest age catch-up still needs the birth date (0.114458ms)
✔ conformance: 2026 the same equal IRC 457(b)(3) amount with a known age of 61 takes the IRC 414(v) route (0.10175ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up to a Roth governmental 457(b) is Roth, not pre-tax (0.098084ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up to a traditional governmental 457(b) stays pre-tax (0.10025ms)
✔ conformance: 2026 an explicitly null plan-document limit means the sponsor set no IRC 402A(e)(3)(A)(ii) amount (0.069709ms)
✔ conformance: 2026 a governmental 457(b) PLESA seeds neither the IRC 402(g) pool nor an IRC 415(c) group (0.142959ms)
✔ conformance: 2026 an existing Roth IRC 457(b)(3) catch-up seeds the IRC 457(b)(3) pool, not the age pool (0.121333ms)
✔ conformance: 2026 a qualified-plan PLESA ignores a pretax_first preference and stays Roth (0.0845ms)
✔ conformance: 2026 a governmental 457(b) PLESA ignores a pretax_first preference and stays Roth (0.092125ms)
✔ conformance: 2026 a qualified-plan PLESA age-based catch-up ignores a pretax_first preference (0.118541ms)
✔ conformance: 2026 a governmental 457(b) PLESA age-based catch-up ignores a pretax_first preference (0.132542ms)
✔ conformance: 2026 a PLESA IRC 457(b)(3) catch-up ignores a pretax_first preference and stays Roth (0.106041ms)
✔ conformance: 2026 a PLESA whose supplied plan rules forbid Roth still contributes Roth, not pre-tax (0.082042ms)
✔ conformance: 2026 an ordinary designated Roth 401(k) still honours a pretax_first preference (0.078875ms)
✔ conformance: 2026 an explicitly null PLESA participant-contribution balance is indeterminate (0.058666ms)
✔ conformance: 2026 an explicitly null PLESA balance is indeterminate on the governmental 457(b) host (0.078334ms)
✔ conformance: 2026 two governmental 457(b) accounts cannot use both catch-up methods in one year (0.103625ms)
✔ conformance: 2026 reversing two governmental 457(b) accounts changes neither method nor total (0.112292ms)
✔ conformance: 2026 two plans' IRC 457(b)(3) amounts take the largest, not the sum (0.130125ms)
✔ conformance: 2026 the largest-of rule for two IRC 457(b)(3) plans does not depend on input order (0.108542ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling is reduced by catch-ups already made under it (0.093ms)
✔ conformance: 2026 catch-ups supplied under both IRC 457 methods are diagnosed as a pair (0.182083ms)
✔ conformance: 2026 a governmental 457(b) with no birth date is indeterminate, not a confident zero (0.115375ms)
✔ conformance: 2026 the same governmental 457(b) with a birth year reaches a different number (0.092916ms)
✔ conformance: 2026 a nongovernmental 457(b) with no birth date stays silent (0.080084ms)
✔ conformance: 2026 a governmental 457(b) whose compensation binds asks no age question (0.082958ms)
✔ conformance: 2026 an IRC 457(b)(3) amount above the year's largest age catch-up settles the method (0.080375ms)
✔ conformance: 2006 the 26 CFR 1.457-5(d) Example 2 ceiling across four eligible plans (0.154ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling stands above the compensation the basic limitation exhausts (0.082458ms)
✔ conformance: 2026 compensation above the base limitation bounds the catch-up to what is left (0.0885ms)
✔ conformance: 2026 an isolated governmental PLESA whose room the base deferral fills asks no age question (0.097584ms)
✔ conformance: 2026 a governmental PLESA whose room outlives the base pool still asks the age question (0.145542ms)
✔ conformance: 2026 both IRC 457 catch-up methods are invalid together even below the dollar ceiling (0.099125ms)
✔ conformance: 2026 the two IRC 457 catch-up methods are exclusive across employers, not just within a plan (0.160958ms)
✔ conformance: 2026 existing catch-up under the one selected IRC 457 method is not a mutual-exclusivity breach (0.088125ms)
✔ conformance: 2026 the IRC 457(b)(3) plan ceiling beats the age-based one on a compensation the age method cannot use (0.089167ms)
✔ conformance: 2026 an unknown age settles nothing where compensation leaves no room for an age-based catch-up (0.091084ms)
✔ conformance: 2006 a plan already holding its whole IRC 457(b)(3) amount takes none of the participant's remainder (0.104917ms)
✔ conformance: 2026 a catch-up recorded under the unselected IRC 457 method is diagnosed on its own (0.088917ms)
✔ conformance: 2026 two plans' existing age-based catch-ups exceed the participant's one IRC 414(v) amount (0.120084ms)
✔ conformance: 2026 two plans' existing IRC 457(b)(3) catch-ups exceed the largest amount any one of them provides (0.10925ms)
✔ conformance: 2026 an age-based catch-up recorded on a tax-exempt entity's IRC 457(b) plan is rejected (0.153666ms)
✔ conformance: 2026 an IRC 457(b)(3) catch-up recorded on a plan providing no such provision is rejected (0.106834ms)
✔ conformance: 2026 an existing IRC 457(b)(3) catch-up above its own plan's amount is rejected on that plan (0.113083ms)
✔ conformance: 2023 an account type the year does not offer contaminates no valid plan's ceiling or method (0.117917ms)
✔ conformance: 2026 the participant's IRC 414(v) amount is the largest one plan's compensation allows, not the sum (0.111917ms)
✔ conformance: 2026 an age-based catch-up recorded where IRC 457(b)(3) applies is diagnosed on its own (0.101042ms)
✔ conformance: 2023 an unavailable account's existing contributions seed no valid plan's pool (0.107542ms)
✔ conformance: 2026 the IRC 457(b)(3) sum limb is built on the compensation-bounded paragraph (2) ceiling (0.099709ms)
✔ conformance: 2026 the IRC 457(b)(3) ceiling stops at twice the IRC 457(e)(15) amount (0.078875ms)
✔ conformance: 2026 an existing IRC 457 catch-up still needs age classification when no new room remains (0.1155ms)
✔ conformance: 2026 one plan's catch-up classification error blocks participant-wide catch-up allocation (0.133542ms)
✔ conformance: 2026 missing PLESA balance does not hide its local or participant-wide IRC 457 catch-up classification effects (0.109833ms)
✔ conformance: 2026 a base-only IRC 457 plan is withheld only the basic room another plan's unselected catch-up may occupy (0.118875ms)
✔ conformance: 2026 a missing-balance PLESA outside the selected method does not inherit another plan's classification block (0.1905ms)
✔ conformance: 2026 a plan without required Roth catch-up does not inherit another plan's classification block (0.120292ms)
✔ conformance: 2026 an exhausted governmental PLESA remains determinate when another plan blocks special catch-up (0.117625ms)
✔ conformance: 2026 missing PLESA balance preserves age-independent mutually exclusive catch-up error (0.096709ms)
✔ conformance: 2026 missing-balance PLESA with no account-local age catch-up room does not inherit a classification block (0.103ms)
✔ conformance: 2026 missing-balance PLESA preserves its unsupported existing special catch-up diagnostic (0.101291ms)
✔ conformance: 2026 roth_401k needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer (0.0825ms)
✔ conformance: 2026 roth_403b needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer (0.064708ms)
✔ conformance: 2026 roth_tsp needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer (0.06275ms)
✔ conformance: 2026 roth_governmental_457b needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer (0.084875ms)
✔ conformance: 2026 roth_solo_401k needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer (0.070292ms)
✔ conformance: 2026 prior-year FICA wages above the threshold change nothing on a designated Roth 401(k) (0.060084ms)
✔ conformance: 2026 a pre-tax 401(k) still requires the prior-year FICA wages the IRC 414(v)(7)(A) test decides on (0.060542ms)
✔ conformance: 2026 a designated Roth 401(k) electing pretax_first still requires the prior-year FICA wages (0.065958ms)
✔ conformance: 2026 a designated Roth 401(k) whose plan permits no Roth catch-up still requires the prior-year FICA wages (0.068709ms)
✔ conformance: 2026 a PLESA permitsRothCatchUp of false is disregarded and asks for no prior-year FICA wages (0.069542ms)
✔ conformance: 2026 an existing pre-tax catch-up on a designated Roth 401(k) still requires the prior-year FICA wages (0.063333ms)
✔ conformance: 2026 an existing Roth catch-up on a designated Roth 401(k) needs no prior-year FICA wages (0.05775ms)
✔ conformance: 2026 an existing pre-tax catch-up below the IRC 414(v)(7)(A) threshold is determinate and stands (0.061959ms)
✔ conformance: 2026 an inconsistent division leaves the division indeterminate but not the couple's limitation (1.22225ms)
✔ conformance: 2026 an unknown division of a limitation of nothing is still determinate (0.255667ms)
✔ conformance: 2005 an unknowable amount and an unknowable division are reported together and independently (0.353375ms)
✔ conformance: 2005 an unstated spouse leaves a family-coverage owner's limitation indeterminate (0.166167ms)
✔ conformance: 2005 a spouse stated to hold no coverage leaves that same limitation determinate (0.169542ms)
✔ conformance: 2026 an eligible spouse without an HSA halves the limit where an ineligible one would not (0.154042ms)
✔ conformance: 2007 an unstated spouse stops mattering to the amount but still bears on the division (0.305625ms)
✔ conformance: 2026 an unknown division bounds allowable existing family-pool usage (1.407958ms)
✔ conformance: 2026 an age-55 contribution above the family limitation draws no assertion of excess (0.651209ms)
✔ conformance: 2026 an unknown birth year leaves the IRC 223(b)(5) draw unstated rather than guessed (0.261791ms)
✔ conformance: 2026 funding beyond every possible base collapses family usage to zero (1.019542ms)
✔ conformance: 2005 a spouse's family deductible below the IRC 223(c)(2) minimum is inconsistent input, not a lower ceiling (0.429583ms)
✔ conformance: 2005 a spouse's subminimum self-only plan leaves the division unresolved even with no account (0.632792ms)
✔ conformance: 2005 a family deductible exactly at the IRC 223(c)(2) minimum stays determinate (0.212708ms)
✔ conformance: 2026 a subminimum family deductible is inconsistent input even though IRC 223(b)(2) no longer reads it (0.124542ms)
✔ conformance: 2005 an owner's own subminimum self-only deductible is diagnosed on their own account (0.127208ms)
✔ conformance: 2005 a self-only contradiction leaves the family limitation known and its division unknown (0.398792ms)
✔ conformance: 2005 an agreed division of nothing to the impeached spouse is conclusive despite the doubt (0.177417ms)
✔ conformance: 2005 a deductible below the minimum by less than a cent is still below the minimum (0.137666ms)
✔ conformance: 2005 two contradictory family deductibles are both diagnosed as coverage conflict and as subminimum (0.108792ms)
✔ conformance: 2005 a spouse's subminimum family plan reaches only the months it was in force (0.164ms)
✔ conformance: 2005 the same subminimum family plan does reach a month the owner shares with it (0.345583ms)
✔ conformance: 2005 a spouse's January-only contradiction leaves the other eleven monthly limits reported (0.252792ms)
✔ conformance: an account-level familyLimitShare is rejected rather than read (0.085916ms)
✔ conformance: an account-level useLastMonthRule is rejected, because IRC 223(b)(8) is not an election (0.055791ms)
✔ conformance: an account-level testing-period fact is rejected under the same rule (0.050375ms)
✔ conformance: 2026 the spouses may agree to allocate the whole family limitation to one of them (0.18525ms)
✔ conformance: 2026 a spouse allocated nothing of the family limitation keeps their own age 55 catch-up (0.178917ms)
✔ conformance: 2026 an agreed division is inoperative where only one spouse is an eligible individual (0.1655ms)
✔ conformance: 2026 a disputed division is not an unknown where only one spouse is an eligible individual (0.149708ms)
✔ conformance: 2026 the division reaches only the months in which both spouses were eligible individuals (0.150833ms)
✔ conformance: 2026 a sole-eligible family month is not divided, so the pre-division amount alone cannot rebuild the ceiling (0.180125ms)
✔ conformance: 2026 a relocated division field is rejected on the person as well as on the account (0.05675ms)
✔ conformance: 2026 an Archer MSA reduction meeting mixed family months leaves the division unresolved (0.210042ms)
✔ conformance: 2026 an Archer MSA aggregate exhausting the family union leaves the IRC 223(b)(3) amount whole across mixed months (0.242667ms)
✔ conformance: 2026 the last-month rule does not reduce a limit the ordinary months already earned (0.104291ms)
✔ conformance: 2026 last-month rule deemed months take each month's own spouse eligibility (0.159708ms)
✔ conformance: 2026 the last-month counterfactual is divided the same way the applied limit is (0.130125ms)
✔ conformance: 2026 spouses eligible in disjoint halves of the year each take their own months whole (0.17225ms)
✔ conformance: 2026 spouses with partially overlapping family months neither contains the other (0.170083ms)
✔ conformance: 2026 an unstated spouse leaves the division unresolved rather than assumed equal (0.291083ms)
✔ conformance: 2026 an unsettled division of months no spouse shares withholds the share but not the amount (0.179542ms)
✔ conformance: 2005 an agreed zero share makes an accountless spouse's contradiction immaterial (0.144125ms)
✔ conformance: 2008 Notice 2008-52 Example 3 takes December's tier for the whole year, not for the gaps (0.098375ms)
✔ conformance: 2008 Notice 2008-52 Example 8 lets the monthly candidate win, so the rule lowers nothing (0.088ms)
✔ conformance: 2008 Notice 2008-52 Example 5 compares the whole age 55 amount against the monthly one (0.106ms)
✔ conformance: 2026 the full-contribution candidate is not December's tier poured into the ineligible months (0.10325ms)
✔ conformance: 2008 Notice 2008-52 Example 14 takes the greater-of on the couple's combined limitation (0.188625ms)
✔ conformance: 2026 one spouse's IRC 223(b)(8) year cannot stack a family limitation on the other's self-only months (0.173791ms)
✔ conformance: 2026 that pair does not depend on which spouse's account is allocated first (0.158042ms)
✔ conformance: 2026 an Archer MSA reduction meeting disjoint sole-eligible months leaves the allocation unresolved (0.293666ms)
✔ conformance: 2026 a candidate that does not exceed the monthly one increases nothing, and does not redivide it (0.170208ms)
✔ conformance: 2026 an owner's contradictory coverage statements withhold the whole IRC 223 detail, all-year account first (0.098291ms)
✔ conformance: 2026 that pair reports the same nothing with the December-only account first (0.088334ms)
✔ conformance: 2026 an unknown birth year leaves the IRC 223(b)(8) winner itself unsettled (0.094584ms)
✔ conformance: 2026 an unknown division leaves the last-month amount a range, not a nil (0.701375ms)
✔ conformance: 2026 an unknown division of months no spouse shares still states each owner's own reduction (0.188791ms)
✔ conformance: 2026 contradictory coverage asserts no IRC 223(b)(5)(A) recharacterization, self-only account first (0.14375ms)
✔ conformance: 2026 that pair reports the same absence with the family account first (0.126208ms)
✔ conformance: 2026 an unestablished ceiling reports no fall at all, rather than a fall of nothing (0.107625ms)
✔ conformance: 2026 a spouse's eligibility conflict announces no division branch, covered account first (0.370958ms)
✔ conformance: 2026 that pair announces the same absence with the uncovered account first (0.32625ms)
✔ conformance: HSA owner normalization: complete and unusable account (0.099959ms)
✔ conformance: HSA owner normalization: complete and unusable account reversed (0.0865ms)
✔ conformance: HSA owner normalization: person agrees with only one account (0.094083ms)
✔ conformance: HSA owner normalization: person agrees with only one account reversed (0.092709ms)
✔ conformance: HSA owner normalization: missing capped-year deductible (0.111ms)
✔ conformance: HSA owner normalization: missing capped-year deductible reversed (0.094875ms)
✔ conformance: HSA owner normalization: reordered eligible months (0.096583ms)
✔ conformance: HSA owner normalization: reordered eligible months reversed (0.28175ms)
✔ conformance: HSA owner normalization: equivalent monthly representation (0.152084ms)
✔ conformance: HSA owner normalization: equivalent monthly representation reversed (0.126291ms)
✔ conformance: HSA owner normalization: empty account with person coverage (0.11775ms)
✔ conformance: HSA owner normalization: empty account with person coverage reversed (0.110958ms)
✔ conformance: HSA owner normalization: spouse capped-year deductible (0.463417ms)
✔ conformance: HSA owner normalization: spouse capped-year deductible reversed (0.36975ms)
✔ conformance: HSA owner normalization: person and account explicit no coverage (0.118208ms)
✔ conformance: HSA owner normalization: person and account explicit no coverage reversed (0.112209ms)
✔ conformance: 2026 nonempty unusable person HSA coverage is not explicit no coverage (0.380292ms)
✔ conformance: 2005 supplied conflicting HSA deductibles A first (0.127167ms)
✔ conformance: 2005 supplied conflicting HSA deductibles B first (0.111292ms)
✔ conformance: 2026 sole spouse HSA owner receives the agreed whole despite unknown taxpayer eligibility (0.120584ms)
✔ conformance: 2005 incomplete person deductible statement cannot establish an owner ceiling (0.102625ms)
✔ conformance: 2026 missing spouse record cannot bypass an agreed HSA family division (0.091542ms)
✔ conformance: 2026 absent partner leaves Archer reduction unknown for sole taxpayer HSA owner agreed whole (0.105584ms)
✔ conformance: 2026 absent partner leaves Archer reduction unknown for sole spouse HSA owner agreed whole (0.085125ms)
✔ conformance: 2026 known partner agreed whole preserves the age-55 amount after Archer reduction (0.213292ms)
✔ conformance: 2026 known accountless partner Archer amount reduces an agreed whole share (0.159375ms)
✔ conformance: 2026 Archer spill reduces the household base once across two undivided owners (0.297958ms)
✔ conformance: 2026 Archer spill leaves the separate age-55 monthly amount intact (0.292792ms)
✔ conformance: 2026 accountless spouse capacity can absorb the Archer aggregate (0.292041ms)
✔ conformance: 2026 a December-ineligible owner has no personal last-month testing exposure (0.205083ms)
✔ conformance: 2026 disputed sole eligibility cannot establish an inoperative family agreement (0.594875ms)
✔ conformance: 2026 the last-month rule candidate is December's tier for the whole year, not a hybrid (0.149125ms)
✔ conformance: 2026 an accountless spouse's December family coverage enters the household greater-of (0.13375ms)
✔ conformance: 2026 the same December family coverage gives the same answer when that spouse owns an HSA (0.142541ms)
✔ conformance: 2026 an unusable spouse statement leaves the household Archer base unstated (0.192375ms)
✔ conformance: 2026 an unknown division of an exhausted family residue leaves the self-only months determinate (0.1745ms)
✔ conformance: 2026 the rejected account still reports the supplied pre-tax component and its tax effect for audit (0.176625ms)
✔ conformance: 2026 an existing Roth catch-up above the threshold is what the provision requires and stands (0.082291ms)
✔ conformance: 2026 an existing pre-tax catch-up filling the IRC 414(v) pool is still rejected on a governmental 457(b) (0.158875ms)
✔ conformance: 2026 an existing pre-tax catch-up above the IRC 414(v)(7)(A) threshold is rejected on a 401(k) (0.0715ms)
✔ conformance: 2026 an existing pre-tax catch-up above the threshold is rejected on a 403(b) (0.069542ms)
✔ conformance: 2026 an existing pre-tax catch-up below the IRC 414(v)(7)(A) threshold stands (0.065583ms)
✔ conformance: 2026 the same rejection on a designated Roth 401(k), which no longer reports a Roth allocation (0.055ms)
✔ conformance: 2026 an unreconciled IRC 401(k) catch-up does not block the same participant's governmental 457(b) (0.1355ms)
✔ conformance: 2026 a PLESA missing its balance still reports an invalid pre-tax catch-up alongside (0.066666ms)
✔ conformance: 2026 an employer identifier of "0" is a real identifier, not an absent one (0.081917ms)
✔ conformance: 2026 an employer identifier of "0" with no wages asks for the wages, not for the identifier (0.064292ms)
✔ conformance: 2026 a plan offering no Roth catch-up is not blocked by another plan's unreconciled amount (0.090209ms)
✔ conformance: 2026 a blocked plan still reports the prior-year wages its own employer requires (0.092583ms)
✔ conformance: 2026 a SIMPLE IRA is outside the IRC 414(v)(7)(A) test, by IRC 414(v)(7)(C) (0.067125ms)
✔ conformance: 2026 a SIMPLE 401(k) is inside the IRC 414(v)(7)(A) test, because IRC 414(v)(6)(A)(iv) does not describe it (0.062542ms)
✔ conformance: a numeric employerId is rejected rather than coerced by either runtime (0.064916ms)
✔ conformance: an empty-string employerId is rejected under the same rule as a numeric one (0.044542ms)
✔ conformance: a numeric annualAdditionsGroupId is rejected under the same identifier rule (0.047333ms)
✔ conformance: 2026 an account the shared IRC 414(v) pool left nothing for reports no Roth allocation (0.083583ms)
✔ conformance: 2026 the IRC 457(b)(3) special method displaces the IRC 414(v)(7)(A) wage test entirely (0.102334ms)
✔ conformance: 2026 an unreconciled IRC 457 sibling that fills the pool still blocks the next plan (0.113625ms)
✔ conformance: 2026 a valid contribution that exhausts the IRC 457 catch-up pool leaves the next plan determinate (0.109958ms)
✔ conformance: 2026 an ordinary scenario reports settled pool usage as figures, not as ranges (0.07925ms)
✔ conformance: 2026 the two pools one unresolved amount widened are never spent at both maxima at once (0.093875ms)
✔ conformance: 2026 a rejected pre-tax catch-up leaves only the IRC 402(g) room guaranteed under either reading (0.063334ms)
✔ conformance: 2026 a demand inside the guaranteed residue is allocated whole and not blocked (0.069875ms)
✔ conformance: 2026 an account with unresolved further capacity still announces the catch-up it did take (0.074292ms)
✔ conformance: 2026 an unreconciled contribution that appears to exhaust the IRC 457 pool leaves the next plan indeterminate (0.100208ms)
✔ conformance: 2026 an unreconciled pre-tax catch-up leaves the sibling its guaranteed catch-up and no more (0.082ms)
✔ conformance: 2026 a condemned catch-up consumes the plan's own annual-additions ceiling too (0.068917ms)
✔ conformance: 2026 a condemned catch-up widens the IRC 415(c) group, not only the elective-deferral limit (0.064625ms)
✔ conformance: 2026 a condemned catch-up consumes the plan's own deferral ceiling on one reading (0.0595ms)
✔ conformance: 2026 a condemned catch-up consumes a governmental IRC 457(b) plan's own deferral ceiling (0.079667ms)
✔ conformance: 2026 unresolved catch-up reserves the plan annual ceiling for later employer capacity (0.060041ms)
✔ conformance: 2026 unresolved catch-up reserves the plan annual ceiling for later after-tax capacity (0.085917ms)
✔ conformance: 2026 unresolved catch-up reserves the plan annual ceiling for later special 403b capacity (0.06425ms)
✔ conformance: 2026 unresolved catch-up reserves the plan annual ceiling for later plan-term capacity (0.059583ms)
✔ conformance: 2026 a compensation-bounded 457 catch-up fits within guaranteed sibling pool room while its ordinary room stays open (0.113792ms)
✔ conformance: 2026 HSA component usage is a feasible interval while total capacity stays exact (0.179375ms)
✔ conformance: 2026 HSA usage collapses for zero contributions (0.1285ms)
✔ conformance: 2026 HSA usage collapses for no catch-up (0.116375ms)
✔ conformance: 2026 HSA usage collapses for full exhaustion (0.115041ms)
✔ conformance: 2026 HSA usage collapses for zero base (0.291959ms)
✔ conformance: 2026 HSA usage collapses for aggregate excess (0.256916ms)
✔ conformance: 2026 HSA owner-total allocation survives account order False (0.202708ms)
✔ conformance: 2026 HSA owner-total allocation survives account order True (0.199584ms)
✔ conformance: 2026 HSA family usage extrema preserve the spouses correlated division (1.943458ms)
✔ conformance: 2005 missing spouse deductible reduction 5250 owner born 1980 (0.297208ms)
✔ conformance: 2005 missing spouse deductible reduction 5250 owner born 1950 (0.16025ms)
✔ conformance: 2005 missing spouse deductible reduction 4999 owner born 1980 (0.214084ms)
✔ conformance: 2026 aggregate excess across HSAs is diagnosed without inventing catch-up usage (0.14375ms)
✔ conformance: 2026 HSA household rounding preserves the shared final cent False (0.166708ms)
✔ conformance: 2026 HSA household rounding preserves the shared final cent True (0.154708ms)
✔ conformance: 2026 unavoidable married HSA aggregate excess is known even without a division (1.768375ms)
✔ conformance: 2026 an excess on a zero-share HSA still reserves the household guard False (0.196083ms)
✔ conformance: 2026 an excess on a zero-share HSA still reserves the household guard True (0.166583ms)
✔ conformance: 2026 HSA unknown division retains reachable cent-rounding extrema (1.456458ms)
✔ conformance: 2026 a near-half-cent HSA division rounds the statutory monthly expression once (0.213792ms)
✔ conformance: 2008 funding above annual beneficiary ceiling preserves spouse capacity without beneficiary account (0.1765ms)
✔ conformance: 2008 funding above annual beneficiary ceiling preserves spouse capacity with beneficiary account (0.192834ms)
✔ conformance: 2026 unused spouse HSA catch-up cannot offset another owner aggregate excess (0.616875ms)
✔ conformance: 2026 a winning monthly candidate survives every coherent January spouse statement (0.390375ms)
✔ conformance: 2026 a winning monthly candidate survives every coherent January spouse statement with spouse statements reversed (0.358375ms)
✔ conformance: 2026 coherent monthly winner applies statutory division after candidate selection (0.463958ms)
✔ conformance: 2026 recovered owner allocation advances family usage before refused spouse readback (0.536792ms)
✔ conformance: 2026 unusable spouse tier preserves stated January eligibility in coherent completions (0.315583ms)
✔ conformance: 2026 wholly unknown spouse schedule recovers invariant money and withholds varying audit portion (14.702084ms)
✔ conformance: 2026 coherent coverage collapse retains the individual funding-distribution reduction (0.613458ms)
✔ conformance: 2026 absent spouse person still withholds the unestablished Archer operand (0.107167ms)
✔ conformance: 2005 unknown capped-year spouse facts remain conservative (0.1775ms)
✔ conformance: 2026 unknown spouse coverage can change a self-only owner tier (0.1785ms)
✔ conformance: 2026 person-only established coverage participates in coherent spouse recovery (0.293084ms)
✔ conformance: 2026 explicit unusable account coverage is not an omitted account statement (0.148375ms)
✔ conformance: 2026 coherent partial-tier completion applies aggregate Archer reduction before division (0.387917ms)
✔ conformance: 2005 coherent competing family deductible variants retain a differing result (0.464834ms)
✔ conformance: 2026 correlated spouse schedules preserve exactly one shared month (0.468958ms)
✔ conformance: 2026 correlated spouse schedules preserve exactly one shared month with source order reversed (0.310084ms)
✔ conformance: 2026 partial January spouse coverage needs no accountless spouse age for invariant owner result (0.2705ms)
✔ conformance: 2026 coherent recovery preserves marginal base-catch-up draws and later account usage (0.434375ms)
✔ conformance: 2005 coherent partial January coverage with an established deductible (0.271916ms)
✔ conformance: 2005 coherent wholly unknown coverage with an established deductible (14.740459ms)
✔ conformance: 2005 coherent explicit zero eligible months needs no missing deductible (0.351125ms)
✔ conformance: 2005 coherent a competing lower family deductible does not collapse (0.218375ms)
✔ conformance: 2026 coherent recovery preserves numeric-string person ID representation (0.381ms)
✔ conformance: 2026 a plan group carries a host IRC 457(b) plan's IRC 457(b)(3) provision to its emergency savings record (0.33675ms)
✔ conformance: 2026 without a plan group an emergency savings record is its own plan and provides no IRC 457(b)(3) catch-up (0.162916ms)
✔ conformance: 2026 one plan's IRC 457(b)(3) ceiling bounds what its two records absorb between them (0.139708ms)
✔ conformance: 2026 the same two records without a plan group are two plans with two ceilings (0.162ms)
✔ conformance: 2026 records of one IRC 457 plan group stating different IRC 457(b)(3) provisions are rejected (0.0995ms)
✔ conformance: 2026 records of one IRC 457 plan group stating different includible compensation are rejected (0.075917ms)
✔ conformance: 2026 an unknown age reserves an IRC 457(b)(3) catch-up the age-based method could displace (0.159583ms)
✔ conformance: 2026 an unknown age reserves only the catch-up an attainable IRC 457 method leaves ordinary (0.157666ms)
✔ conformance: 2026 an unselected-method IRC 457 catch-up reserves the account's plan-document deferral limit (0.094709ms)
✔ conformance: 2026 an IRC 457 record naming no employer takes its plan group's sponsor for the Roth catch-up wage test (0.169125ms)
✔ conformance: 2026 a special catch-up recorded under the unselected age method reserves its IRC 457 plan group's basic ceiling (0.1045ms)
✔ conformance: 2026 an unselected-method IRC 457 catch-up reserves the participant's basic annual limitation for a separate plan (0.09775ms)
✔ conformance: 2026 existing IRC 457(b)(3) catch-up across one plan group above that plan's own amount is rejected (0.135708ms)
✔ conformance: a non-string IRC 457 plan group id is rejected rather than coerced (0.064ms)
✔ conformance: 2026 an explicitly null IRC 457 plan group id is absent, not a group of its own (0.103209ms)
✔ conformance: 2026 one plan's compensation-bounded IRC 457(b)(2) ceiling is shared by its records (0.11475ms)
✔ conformance: 2026 a nongovernmental record cannot be one plan with a governmental one (0.069667ms)
✔ conformance: 2026 two participants' plan groups stay separate however their identifiers are arranged (0.115333ms)
✔ conformance: 2026 existing deferrals across one plan's records above its own IRC 457(b)(2) ceiling are rejected (0.228958ms)
✔ conformance: 2026 one plan's includible compensation cannot be deferred twice by two of its records (0.110541ms)
✔ conformance: 2026 one IRC 457 plan cannot name two sponsoring employers (0.07825ms)
✔ conformance: 2026 two records of one IRC 457 plan stating the same very large IRC 457(b)(3) provision agree (0.119458ms)
✔ conformance: 2026 two records of one IRC 457 plan stating very large IRC 457(b)(3) provisions a dollar apart are rejected (0.067834ms)
✔ conformance: 2026 a nonelective employer contribution fills an IRC 457 plan's ceiling without spending the salary its catch-up needs (0.118875ms)
✔ conformance: 2026 the same dollars deferred by the employee do spend the salary an IRC 457 plan's catch-up needs (0.101959ms)
✔ conformance: 2026 a diagnostic renders a very large amount the same way in both engines (0.211375ms)
✔ conformance: 2026 unresolved IRC 457 age catch-up reserves the shared plan base ceiling (0.176666ms)
✔ conformance: 2026 existing salary deferrals cannot overdraw one IRC 457 plan across records (0.134958ms)
✔ conformance: 2026 unresolved IRC 457 age catch-up also reserves plan base room from new employer deposits (0.158458ms)
✔ conformance: 2026 Unicode IRC 457 plan keys use UTF8 byte lengths (0.104708ms)
✔ conformance: 2026 existing special IRC 457 deferrals reserve salary before sibling base allocation (0.11325ms)
✔ conformance: 2026 IRC 457 base overage consumes combined special plan ceiling (0.112292ms)
✔ conformance: 2026 IRC 457 special room with ordinary deposits on all 1 records (0.081417ms)
✔ conformance: 2026 IRC 457 special room with ordinary deposits on all 2 records (0.107458ms)
✔ conformance: 2026 IRC 457 true combined special excess remains blocked (0.104417ms)
✔ conformance: Payroll: below base (0.413625ms)
✔ conformance: Payroll: at base (0.058959ms)
✔ conformance: Payroll: above base (0.039542ms)
✔ conformance: Payroll: 1991 Medicare cap transition (0.043125ms)
✔ conformance: Payroll: 1992 Medicare cap transition (0.054792ms)
✔ conformance: Payroll: 1993 Medicare cap transition (0.053ms)
✔ conformance: Payroll: 1994 Medicare cap transition (0.043833ms)
✔ conformance: Payroll: 2010 holiday and additional Medicare transition (0.032916ms)
✔ conformance: Payroll: 2011 holiday and additional Medicare transition (0.04675ms)
✔ conformance: Payroll: 2012 holiday and additional Medicare transition (0.035583ms)
✔ conformance: Payroll: 2013 holiday and additional Medicare transition (0.030917ms)
✔ conformance: Payroll: MFJ additional Medicare threshold plus 0 (0.028916ms)
✔ conformance: Payroll: MFJ additional Medicare threshold plus 1000 (0.034ms)
✔ conformance: Payroll: MFS additional Medicare threshold plus 0 (0.707042ms)
✔ conformance: Payroll: MFS additional Medicare threshold plus 1000 (0.031041ms)
✔ conformance: Payroll: single additional Medicare threshold plus 0 (0.0225ms)
✔ conformance: Payroll: single additional Medicare threshold plus 1000 (0.021209ms)
✔ conformance: Payroll: HOH additional Medicare threshold plus 0 (0.021708ms)
✔ conformance: Payroll: HOH additional Medicare threshold plus 1000 (0.02225ms)
✔ conformance: Payroll: QSS additional Medicare threshold plus 0 (0.022041ms)
✔ conformance: Payroll: QSS additional Medicare threshold plus 1000 (0.022625ms)
✔ conformance: Payroll: MFJ overwithholding (0.027833ms)
✔ conformance: Payroll: MFS underwithholding (0.022166ms)
✔ conformance: Payroll: wages consume OASDI base and Medicare threshold before SE (0.04675ms)
✔ conformance: Payroll: below400 (0.038458ms)
✔ conformance: Payroll: exact400 (0.033208ms)
✔ conformance: Payroll: above400 (0.028834ms)
✔ conformance: Payroll: loss (0.024583ms)
✔ conformance: Payroll: 164f excludes additional SE Medicare (0.03225ms)
✔ conformance: Payroll: 2011 SE holiday preserves adjustment and special deduction (0.021542ms)
✔ conformance: Payroll: 2012 SE holiday preserves adjustment and special deduction (0.02175ms)
✔ conformance: Payroll: multiple employers retain separate employer caps (0.025333ms)
✔ conformance: Payroll: spouses have independent OASDI caps (0.029084ms)
✔ conformance: Payroll: 1990 unavailable parameters (0.054209ms)
✔ conformance: Payroll: 2027 unavailable parameters (0.030916ms)
✔ conformance: Payroll: missing filing status (0.022625ms)
✔ conformance: Payroll: missing spouse (0.02525ms)
✔ conformance: Payroll: duplicate person (0.052333ms)
✔ conformance: Payroll: negative wages (0.03ms)
✔ conformance: Payroll: string earnings (0.0405ms)
✔ conformance: Payroll: missing wage measure (0.0535ms)
✔ conformance: Payroll: integration health_fsa (0.421208ms)
✔ conformance: Payroll: integration traditional_401k (0.168666ms)
✔ conformance: Payroll: corrected 2018 determination (0.035666ms)
✔ conformance: Payroll: unmatched employer (0.104ms)
✔ conformance: Payroll: insufficient wages (0.081875ms)
✔ conformance: Payroll: wage exclusion opens SECA base (0.101666ms)
✔ conformance: Payroll: historical HI wages consume SE base (0.027292ms)
✔ conformance: Payroll: explicit empty wage list (0.026542ms)
✔ conformance: Payroll: explicit empty wage map (0.032833ms)
✔ conformance: Payroll: null scenario payroll input (0.066542ms)
✔ conformance: Payroll review: MFJ rejects other replacing spouse (0.098125ms)
✔ conformance: Payroll review: single rejects spouse replacing taxpayer (0.065625ms)
✔ conformance: Payroll review: MFS rejects other replacing taxpayer (0.057417ms)
✔ conformance: Payroll review: correct explicit roles (0.086416ms)
✔ conformance: Payroll review: correct default roles (0.075291ms)
✔ conformance: Payroll review: correct reversed explicit roles (0.069042ms)
✔ conformance: Payroll review: ambiguous M standalone (0.053458ms)
✔ conformance: Payroll review: ambiguous M scenario (0.081459ms)
✔ conformance: Payroll review: indeterminate HSA known zero exclusion (0.182917ms)
✔ conformance: Payroll review: indeterminate HSA potential exclusion (0.095542ms)
✔ conformance: Payroll review: existing HSA exclusion remains unresolved (0.091125ms)
✔ conformance: Payroll review: other person exclusion does not affect filed return (0.091792ms)
✔ conformance: Payroll review: duplicate taxpayer role is ambiguous (0.080125ms)
✔ conformance: 457 review: special overage bounds employee base draw (0.157541ms)
✔ conformance: 457 review: special overage bounds employer base draw (0.118708ms)
✔ conformance: 457 review: ordinary overage bounds age catch-up with 0 existing (0.111125ms)
✔ conformance: 457 review: ordinary overage bounds age catch-up with 2000 existing (0.1035ms)
✔ conformance: 457 review: special-only member shares combined excess diagnostic (0.098625ms)
✔ conformance: Payroll: numeric-key wage object is the same JSON list in both runtimes (0.043375ms)
✔ conformance: Payroll: numeric-key person object is the same JSON list in both runtimes (0.025ms)
✔ conformance: Payroll: exact decimal Social Security half-cent rounds up (0.02325ms)
✔ conformance: Fractional priorities retain their ordering (0.122041ms)
✔ conformance: Priority must be a finite number (0.062875ms)
✔ conformance: Parameter lookup: 2026 retirement limits (0.107375ms)
✔ conformance: Parameter lookup: 2026 HSA limits (0.084084ms)
✔ conformance: Parameter lookup: 2026 FSA limits (0.032166ms)
✔ conformance: Parameter lookup: 2026 payroll limits (0.026417ms)
✔ conformance: Parameter lookup: 2026 education limits (0.04125ms)
✔ conformance: Parameter lookup: 2026 ABLE limits (0.032791ms)
✔ conformance: Parameter lookup: 2026 adoption limits (0.034375ms)
✔ conformance: Parameter lookup: 2026 HRA limits (0.032625ms)
✔ conformance: Parameter lookup: 2026 commuter limits (0.03025ms)
✔ conformance: Parameter lookup: fractional year is rejected (0.02475ms)
✔ conformance: Parameter lookup: unsafe integer year is rejected (0.02ms)
✔ conformance: Parameter lookup: nonportable integer year is rejected (0.01925ms)
ℹ tests 680
ℹ suites 0
ℹ pass 680
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 267.976208
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
ok - exposes the IRC 414(q), 416(i) and 25B figures from the first year each has one
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
ok - exposes the 2027 IRC 223 amounts Rev. Proc. 2026-24 publishes, and no later year
ok - exposes the IRC 125 and IRC 129 parameter table without extrapolating it
ok - exposes the IRC 530, IRC 127 and IRC 529 parameter table from the statutes that set it
ok - exposes the IRC 529A ABLE table and its 2026 separation from the IRC 2503(b) exclusion
ok - exposes the IRC 23 and IRC 137 adoption table through each statutory change
ok - exposes the QSEHRA, excepted benefit HRA and individual coverage HRA table
ok - exposes the IRC 132(f) commuter table with every retroactive correction applied
ok - rejects a bare FSA account type but accepts each unambiguous spelling
ok - validates health FSA plan facts before calculating anything
ok - the health FSA builder reaches every IRC 125(i) plan fact
ok - validates IRC 129 earned income facts before calculating anything
ok - the dependent care builder reaches the IRC 129(b) earned income facts
ok - the IRC 223(b)(5)(B)(ii) division diagnostic does not claim a shared limit it is not reporting
ok - HSA owner normalization: complete and unusable account is invariant under account permutation
ok - HSA owner normalization: person agrees with only one account is invariant under account permutation
ok - HSA owner normalization: missing capped-year deductible is invariant under account permutation
ok - HSA owner normalization: reordered eligible months is invariant under account permutation
ok - HSA owner normalization: equivalent monthly representation is invariant under account permutation
ok - HSA owner normalization: empty account with person coverage is invariant under account permutation
ok - HSA owner normalization: spouse capped-year deductible is invariant under account permutation
ok - HSA owner normalization: person and account explicit no coverage is invariant under account permutation
ok - nonempty unusable person HSA statements never assert no coverage
ok - the married capped-year comparison preserves deductible conflict provenance
ok - missing married person records leave the Archer operand unestablished even with a whole share
ok - an agreed whole share with both person records retains paragraph-5 Archer ordering for either owner role
ok - payroll parameter and scenario builder snapshots are detached

67 tests, 0 failed (0.019s)
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
ok - 2026 the OBRA '93 grandfathered governmental compensation limit lifts the IRC 401(a)(17) ceiling
ok - 2026 the same plan without the OBRA '93 assertion takes the ordinary IRC 401(a)(17) limit
ok - 1997 the grandfathered governmental limit is asserted for a year the IRS never published one
ok - 1994 unknown grandfathered compensation withholds traditional_401k capacity and preserves existing amounts
ok - 1995 unknown grandfathered compensation withholds sep_ira capacity and preserves existing amounts
ok - 1996 unknown grandfathered compensation withholds profit_sharing_plan capacity and preserves existing amounts
ok - 1997 unknown grandfathered compensation withholds simple_ira capacity and preserves existing amounts
ok - 1997 unknown grandfathered compensation withholds simple_401k capacity and preserves existing amounts
ok - 1997 unknown grandfathered compensation also withholds a companion shared-pool ceiling
ok - 1993 grandfathered compensation unknown-year guard respects effective and published boundaries
ok - 1998 grandfathered compensation unknown-year guard respects effective and published boundaries
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
ok - 2026 mid-year HSA coverage change prorated by month, with no December eligible month
ok - 2026 the same mid-year change takes the IRC 223(b)(8) greater-of without being asked
ok - 2026 both spouses age 55 receive separate HSA catch-ups
ok - 2026 spouses divide the single family HSA limit as agreed
ok - 2026 HSA last-month rule with a satisfied testing period
ok - 2026 HSA last-month rule failed in the testing period
ok - 2005 HSA monthly limit capped by the plan annual deductible
ok - 2006 HSA monthly limit capped by the statutory dollar amount
ok - 2006 the IRC 223(b)(8) greater-of does not reach a year before the rule existed
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
ok - 2026 family-limit shares totalling exactly one may still give a spouse nothing
ok - 2026 sole HSA-owning spouse may agree a share below one without forfeiting anything
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
ok - 2026 a spouse's coverage conflict reaches a December-only owner through the IRC 223(b)(8) year
ok - 2026 the same conflict leaves an owner the IRC 223(b)(8) year does not reach determinate
ok - 2026 family sharing survives a spouse's conflict confined to an annual deductible that no longer applies
ok - 2005 a spouse's conflict between two family-plan annual deductibles does reach the shared family limit
ok - 2026 a spouse's person-level family coverage contradicting their account's self-only leaves the other spouse indeterminate
ok - 2026 an HSA whose planRules.hsa states no coverage facts is a missing fact, not an assertion of no coverage
ok - 2026 an empty persons[].hsaCoverage is the documented statement of no coverage and leaves the other spouse determinate
ok - 2026 a spouse's self-only-versus-no-coverage disagreement leaves the household ceiling indeterminate, all-year account first
ok - 2026 the same self-only-versus-no-coverage disagreement gives the same answer with the December-only account first
ok - 2005 a spouse's conflicting self-only deductibles reach the household ceiling in a capped year
ok - 2026 a person-level coverage statement does not disagree with the account that repeats it
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
ok - 2026 a base-only IRC 457 plan is withheld only the basic room another plan's unselected catch-up may occupy
ok - 2026 a missing-balance PLESA outside the selected method does not inherit another plan's classification block
ok - 2026 a plan without required Roth catch-up does not inherit another plan's classification block
ok - 2026 an exhausted governmental PLESA remains determinate when another plan blocks special catch-up
ok - 2026 missing PLESA balance preserves age-independent mutually exclusive catch-up error
ok - 2026 missing-balance PLESA with no account-local age catch-up room does not inherit a classification block
ok - 2026 missing-balance PLESA preserves its unsupported existing special catch-up diagnostic
ok - 2026 roth_401k needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer
ok - 2026 roth_403b needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer
ok - 2026 roth_tsp needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer
ok - 2026 roth_governmental_457b needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer
ok - 2026 roth_solo_401k needs no prior-year FICA wages, because the IRC 414(v)(7)(A) test cannot change its answer
ok - 2026 prior-year FICA wages above the threshold change nothing on a designated Roth 401(k)
ok - 2026 a pre-tax 401(k) still requires the prior-year FICA wages the IRC 414(v)(7)(A) test decides on
ok - 2026 a designated Roth 401(k) electing pretax_first still requires the prior-year FICA wages
ok - 2026 a designated Roth 401(k) whose plan permits no Roth catch-up still requires the prior-year FICA wages
ok - 2026 a PLESA permitsRothCatchUp of false is disregarded and asks for no prior-year FICA wages
ok - 2026 an existing pre-tax catch-up on a designated Roth 401(k) still requires the prior-year FICA wages
ok - 2026 an existing Roth catch-up on a designated Roth 401(k) needs no prior-year FICA wages
ok - 2026 an existing pre-tax catch-up below the IRC 414(v)(7)(A) threshold is determinate and stands
ok - 2026 an inconsistent division leaves the division indeterminate but not the couple's limitation
ok - 2026 an unknown division of a limitation of nothing is still determinate
ok - 2005 an unknowable amount and an unknowable division are reported together and independently
ok - 2005 an unstated spouse leaves a family-coverage owner's limitation indeterminate
ok - 2005 a spouse stated to hold no coverage leaves that same limitation determinate
ok - 2026 an eligible spouse without an HSA halves the limit where an ineligible one would not
ok - 2007 an unstated spouse stops mattering to the amount but still bears on the division
ok - 2026 an unknown division bounds allowable existing family-pool usage
ok - 2026 an age-55 contribution above the family limitation draws no assertion of excess
ok - 2026 an unknown birth year leaves the IRC 223(b)(5) draw unstated rather than guessed
ok - 2026 funding beyond every possible base collapses family usage to zero
ok - 2005 a spouse's family deductible below the IRC 223(c)(2) minimum is inconsistent input, not a lower ceiling
ok - 2005 a spouse's subminimum self-only plan leaves the division unresolved even with no account
ok - 2005 a family deductible exactly at the IRC 223(c)(2) minimum stays determinate
ok - 2026 a subminimum family deductible is inconsistent input even though IRC 223(b)(2) no longer reads it
ok - 2005 an owner's own subminimum self-only deductible is diagnosed on their own account
ok - 2005 a self-only contradiction leaves the family limitation known and its division unknown
ok - 2005 an agreed division of nothing to the impeached spouse is conclusive despite the doubt
ok - 2005 a deductible below the minimum by less than a cent is still below the minimum
ok - 2005 two contradictory family deductibles are both diagnosed as coverage conflict and as subminimum
ok - 2005 a spouse's subminimum family plan reaches only the months it was in force
ok - 2005 the same subminimum family plan does reach a month the owner shares with it
ok - 2005 a spouse's January-only contradiction leaves the other eleven monthly limits reported
ok - an account-level familyLimitShare is rejected rather than read
ok - an account-level useLastMonthRule is rejected, because IRC 223(b)(8) is not an election
ok - an account-level testing-period fact is rejected under the same rule
ok - 2026 the spouses may agree to allocate the whole family limitation to one of them
ok - 2026 a spouse allocated nothing of the family limitation keeps their own age 55 catch-up
ok - 2026 an agreed division is inoperative where only one spouse is an eligible individual
ok - 2026 a disputed division is not an unknown where only one spouse is an eligible individual
ok - 2026 the division reaches only the months in which both spouses were eligible individuals
ok - 2026 a sole-eligible family month is not divided, so the pre-division amount alone cannot rebuild the ceiling
ok - 2026 a relocated division field is rejected on the person as well as on the account
ok - 2026 an Archer MSA reduction meeting mixed family months leaves the division unresolved
ok - 2026 an Archer MSA aggregate exhausting the family union leaves the IRC 223(b)(3) amount whole across mixed months
ok - 2026 the last-month rule does not reduce a limit the ordinary months already earned
ok - 2026 last-month rule deemed months take each month's own spouse eligibility
ok - 2026 the last-month counterfactual is divided the same way the applied limit is
ok - 2026 spouses eligible in disjoint halves of the year each take their own months whole
ok - 2026 spouses with partially overlapping family months neither contains the other
ok - 2026 an unstated spouse leaves the division unresolved rather than assumed equal
ok - 2026 an unsettled division of months no spouse shares withholds the share but not the amount
ok - 2005 an agreed zero share makes an accountless spouse's contradiction immaterial
ok - 2008 Notice 2008-52 Example 3 takes December's tier for the whole year, not for the gaps
ok - 2008 Notice 2008-52 Example 8 lets the monthly candidate win, so the rule lowers nothing
ok - 2008 Notice 2008-52 Example 5 compares the whole age 55 amount against the monthly one
ok - 2026 the full-contribution candidate is not December's tier poured into the ineligible months
ok - 2008 Notice 2008-52 Example 14 takes the greater-of on the couple's combined limitation
ok - 2026 one spouse's IRC 223(b)(8) year cannot stack a family limitation on the other's self-only months
ok - 2026 that pair does not depend on which spouse's account is allocated first
ok - 2026 an Archer MSA reduction meeting disjoint sole-eligible months leaves the allocation unresolved
ok - 2026 a candidate that does not exceed the monthly one increases nothing, and does not redivide it
ok - 2026 an owner's contradictory coverage statements withhold the whole IRC 223 detail, all-year account first
ok - 2026 that pair reports the same nothing with the December-only account first
ok - 2026 an unknown birth year leaves the IRC 223(b)(8) winner itself unsettled
ok - 2026 an unknown division leaves the last-month amount a range, not a nil
ok - 2026 an unknown division of months no spouse shares still states each owner's own reduction
ok - 2026 contradictory coverage asserts no IRC 223(b)(5)(A) recharacterization, self-only account first
ok - 2026 that pair reports the same absence with the family account first
ok - 2026 an unestablished ceiling reports no fall at all, rather than a fall of nothing
ok - 2026 a spouse's eligibility conflict announces no division branch, covered account first
ok - 2026 that pair announces the same absence with the uncovered account first
ok - HSA owner normalization: complete and unusable account
ok - HSA owner normalization: complete and unusable account reversed
ok - HSA owner normalization: person agrees with only one account
ok - HSA owner normalization: person agrees with only one account reversed
ok - HSA owner normalization: missing capped-year deductible
ok - HSA owner normalization: missing capped-year deductible reversed
ok - HSA owner normalization: reordered eligible months
ok - HSA owner normalization: reordered eligible months reversed
ok - HSA owner normalization: equivalent monthly representation
ok - HSA owner normalization: equivalent monthly representation reversed
ok - HSA owner normalization: empty account with person coverage
ok - HSA owner normalization: empty account with person coverage reversed
ok - HSA owner normalization: spouse capped-year deductible
ok - HSA owner normalization: spouse capped-year deductible reversed
ok - HSA owner normalization: person and account explicit no coverage
ok - HSA owner normalization: person and account explicit no coverage reversed
ok - 2026 nonempty unusable person HSA coverage is not explicit no coverage
ok - 2005 supplied conflicting HSA deductibles A first
ok - 2005 supplied conflicting HSA deductibles B first
ok - 2026 sole spouse HSA owner receives the agreed whole despite unknown taxpayer eligibility
ok - 2005 incomplete person deductible statement cannot establish an owner ceiling
ok - 2026 missing spouse record cannot bypass an agreed HSA family division
ok - 2026 absent partner leaves Archer reduction unknown for sole taxpayer HSA owner agreed whole
ok - 2026 absent partner leaves Archer reduction unknown for sole spouse HSA owner agreed whole
ok - 2026 known partner agreed whole preserves the age-55 amount after Archer reduction
ok - 2026 known accountless partner Archer amount reduces an agreed whole share
ok - 2026 Archer spill reduces the household base once across two undivided owners
ok - 2026 Archer spill leaves the separate age-55 monthly amount intact
ok - 2026 accountless spouse capacity can absorb the Archer aggregate
ok - 2026 a December-ineligible owner has no personal last-month testing exposure
ok - 2026 disputed sole eligibility cannot establish an inoperative family agreement
ok - 2026 the last-month rule candidate is December's tier for the whole year, not a hybrid
ok - 2026 an accountless spouse's December family coverage enters the household greater-of
ok - 2026 the same December family coverage gives the same answer when that spouse owns an HSA
ok - 2026 an unusable spouse statement leaves the household Archer base unstated
ok - 2026 an unknown division of an exhausted family residue leaves the self-only months determinate
ok - 2026 the rejected account still reports the supplied pre-tax component and its tax effect for audit
ok - 2026 an existing Roth catch-up above the threshold is what the provision requires and stands
ok - 2026 an existing pre-tax catch-up filling the IRC 414(v) pool is still rejected on a governmental 457(b)
ok - 2026 an existing pre-tax catch-up above the IRC 414(v)(7)(A) threshold is rejected on a 401(k)
ok - 2026 an existing pre-tax catch-up above the threshold is rejected on a 403(b)
ok - 2026 an existing pre-tax catch-up below the IRC 414(v)(7)(A) threshold stands
ok - 2026 the same rejection on a designated Roth 401(k), which no longer reports a Roth allocation
ok - 2026 an unreconciled IRC 401(k) catch-up does not block the same participant's governmental 457(b)
ok - 2026 a PLESA missing its balance still reports an invalid pre-tax catch-up alongside
ok - 2026 an employer identifier of "0" is a real identifier, not an absent one
ok - 2026 an employer identifier of "0" with no wages asks for the wages, not for the identifier
ok - 2026 a plan offering no Roth catch-up is not blocked by another plan's unreconciled amount
ok - 2026 a blocked plan still reports the prior-year wages its own employer requires
ok - 2026 a SIMPLE IRA is outside the IRC 414(v)(7)(A) test, by IRC 414(v)(7)(C)
ok - 2026 a SIMPLE 401(k) is inside the IRC 414(v)(7)(A) test, because IRC 414(v)(6)(A)(iv) does not describe it
ok - a numeric employerId is rejected rather than coerced by either runtime
ok - an empty-string employerId is rejected under the same rule as a numeric one
ok - a numeric annualAdditionsGroupId is rejected under the same identifier rule
ok - 2026 an account the shared IRC 414(v) pool left nothing for reports no Roth allocation
ok - 2026 the IRC 457(b)(3) special method displaces the IRC 414(v)(7)(A) wage test entirely
ok - 2026 an unreconciled IRC 457 sibling that fills the pool still blocks the next plan
ok - 2026 a valid contribution that exhausts the IRC 457 catch-up pool leaves the next plan determinate
ok - 2026 an ordinary scenario reports settled pool usage as figures, not as ranges
ok - 2026 the two pools one unresolved amount widened are never spent at both maxima at once
ok - 2026 a rejected pre-tax catch-up leaves only the IRC 402(g) room guaranteed under either reading
ok - 2026 a demand inside the guaranteed residue is allocated whole and not blocked
ok - 2026 an account with unresolved further capacity still announces the catch-up it did take
ok - 2026 an unreconciled contribution that appears to exhaust the IRC 457 pool leaves the next plan indeterminate
ok - 2026 an unreconciled pre-tax catch-up leaves the sibling its guaranteed catch-up and no more
ok - 2026 a condemned catch-up consumes the plan's own annual-additions ceiling too
ok - 2026 a condemned catch-up widens the IRC 415(c) group, not only the elective-deferral limit
ok - 2026 a condemned catch-up consumes the plan's own deferral ceiling on one reading
ok - 2026 a condemned catch-up consumes a governmental IRC 457(b) plan's own deferral ceiling
ok - 2026 unresolved catch-up reserves the plan annual ceiling for later employer capacity
ok - 2026 unresolved catch-up reserves the plan annual ceiling for later after-tax capacity
ok - 2026 unresolved catch-up reserves the plan annual ceiling for later special 403b capacity
ok - 2026 unresolved catch-up reserves the plan annual ceiling for later plan-term capacity
ok - 2026 a compensation-bounded 457 catch-up fits within guaranteed sibling pool room while its ordinary room stays open
ok - 2026 HSA component usage is a feasible interval while total capacity stays exact
ok - 2026 HSA usage collapses for zero contributions
ok - 2026 HSA usage collapses for no catch-up
ok - 2026 HSA usage collapses for full exhaustion
ok - 2026 HSA usage collapses for zero base
ok - 2026 HSA usage collapses for aggregate excess
ok - 2026 HSA owner-total allocation survives account order False
ok - 2026 HSA owner-total allocation survives account order True
ok - 2026 HSA family usage extrema preserve the spouses correlated division
ok - 2005 missing spouse deductible reduction 5250 owner born 1980
ok - 2005 missing spouse deductible reduction 5250 owner born 1950
ok - 2005 missing spouse deductible reduction 4999 owner born 1980
ok - 2026 aggregate excess across HSAs is diagnosed without inventing catch-up usage
ok - 2026 HSA household rounding preserves the shared final cent False
ok - 2026 HSA household rounding preserves the shared final cent True
ok - 2026 unavoidable married HSA aggregate excess is known even without a division
ok - 2026 an excess on a zero-share HSA still reserves the household guard False
ok - 2026 an excess on a zero-share HSA still reserves the household guard True
ok - 2026 HSA unknown division retains reachable cent-rounding extrema
ok - 2026 a near-half-cent HSA division rounds the statutory monthly expression once
ok - 2008 funding above annual beneficiary ceiling preserves spouse capacity without beneficiary account
ok - 2008 funding above annual beneficiary ceiling preserves spouse capacity with beneficiary account
ok - 2026 unused spouse HSA catch-up cannot offset another owner aggregate excess
ok - 2026 a winning monthly candidate survives every coherent January spouse statement
ok - 2026 a winning monthly candidate survives every coherent January spouse statement with spouse statements reversed
ok - 2026 coherent monthly winner applies statutory division after candidate selection
ok - 2026 recovered owner allocation advances family usage before refused spouse readback
ok - 2026 unusable spouse tier preserves stated January eligibility in coherent completions
ok - 2026 wholly unknown spouse schedule recovers invariant money and withholds varying audit portion
ok - 2026 coherent coverage collapse retains the individual funding-distribution reduction
ok - 2026 absent spouse person still withholds the unestablished Archer operand
ok - 2005 unknown capped-year spouse facts remain conservative
ok - 2026 unknown spouse coverage can change a self-only owner tier
ok - 2026 person-only established coverage participates in coherent spouse recovery
ok - 2026 explicit unusable account coverage is not an omitted account statement
ok - 2026 coherent partial-tier completion applies aggregate Archer reduction before division
ok - 2005 coherent competing family deductible variants retain a differing result
ok - 2026 correlated spouse schedules preserve exactly one shared month
ok - 2026 correlated spouse schedules preserve exactly one shared month with source order reversed
ok - 2026 partial January spouse coverage needs no accountless spouse age for invariant owner result
ok - 2026 coherent recovery preserves marginal base-catch-up draws and later account usage
ok - 2005 coherent partial January coverage with an established deductible
ok - 2005 coherent wholly unknown coverage with an established deductible
ok - 2005 coherent explicit zero eligible months needs no missing deductible
ok - 2005 coherent a competing lower family deductible does not collapse
ok - 2026 coherent recovery preserves numeric-string person ID representation
ok - 2026 a plan group carries a host IRC 457(b) plan's IRC 457(b)(3) provision to its emergency savings record
ok - 2026 without a plan group an emergency savings record is its own plan and provides no IRC 457(b)(3) catch-up
ok - 2026 one plan's IRC 457(b)(3) ceiling bounds what its two records absorb between them
ok - 2026 the same two records without a plan group are two plans with two ceilings
ok - 2026 records of one IRC 457 plan group stating different IRC 457(b)(3) provisions are rejected
ok - 2026 records of one IRC 457 plan group stating different includible compensation are rejected
ok - 2026 an unknown age reserves an IRC 457(b)(3) catch-up the age-based method could displace
ok - 2026 an unknown age reserves only the catch-up an attainable IRC 457 method leaves ordinary
ok - 2026 an unselected-method IRC 457 catch-up reserves the account's plan-document deferral limit
ok - 2026 an IRC 457 record naming no employer takes its plan group's sponsor for the Roth catch-up wage test
ok - 2026 a special catch-up recorded under the unselected age method reserves its IRC 457 plan group's basic ceiling
ok - 2026 an unselected-method IRC 457 catch-up reserves the participant's basic annual limitation for a separate plan
ok - 2026 existing IRC 457(b)(3) catch-up across one plan group above that plan's own amount is rejected
ok - a non-string IRC 457 plan group id is rejected rather than coerced
ok - 2026 an explicitly null IRC 457 plan group id is absent, not a group of its own
ok - 2026 one plan's compensation-bounded IRC 457(b)(2) ceiling is shared by its records
ok - 2026 a nongovernmental record cannot be one plan with a governmental one
ok - 2026 two participants' plan groups stay separate however their identifiers are arranged
ok - 2026 existing deferrals across one plan's records above its own IRC 457(b)(2) ceiling are rejected
ok - 2026 one plan's includible compensation cannot be deferred twice by two of its records
ok - 2026 one IRC 457 plan cannot name two sponsoring employers
ok - 2026 two records of one IRC 457 plan stating the same very large IRC 457(b)(3) provision agree
ok - 2026 two records of one IRC 457 plan stating very large IRC 457(b)(3) provisions a dollar apart are rejected
ok - 2026 a nonelective employer contribution fills an IRC 457 plan's ceiling without spending the salary its catch-up needs
ok - 2026 the same dollars deferred by the employee do spend the salary an IRC 457 plan's catch-up needs
ok - 2026 a diagnostic renders a very large amount the same way in both engines
ok - 2026 unresolved IRC 457 age catch-up reserves the shared plan base ceiling
ok - 2026 existing salary deferrals cannot overdraw one IRC 457 plan across records
ok - 2026 unresolved IRC 457 age catch-up also reserves plan base room from new employer deposits
ok - 2026 Unicode IRC 457 plan keys use UTF8 byte lengths
ok - 2026 existing special IRC 457 deferrals reserve salary before sibling base allocation
ok - 2026 IRC 457 base overage consumes combined special plan ceiling
ok - 2026 IRC 457 special room with ordinary deposits on all 1 records
ok - 2026 IRC 457 special room with ordinary deposits on all 2 records
ok - 2026 IRC 457 true combined special excess remains blocked
ok - Payroll: below base
ok - Payroll: at base
ok - Payroll: above base
ok - Payroll: 1991 Medicare cap transition
ok - Payroll: 1992 Medicare cap transition
ok - Payroll: 1993 Medicare cap transition
ok - Payroll: 1994 Medicare cap transition
ok - Payroll: 2010 holiday and additional Medicare transition
ok - Payroll: 2011 holiday and additional Medicare transition
ok - Payroll: 2012 holiday and additional Medicare transition
ok - Payroll: 2013 holiday and additional Medicare transition
ok - Payroll: MFJ additional Medicare threshold plus 0
ok - Payroll: MFJ additional Medicare threshold plus 1000
ok - Payroll: MFS additional Medicare threshold plus 0
ok - Payroll: MFS additional Medicare threshold plus 1000
ok - Payroll: single additional Medicare threshold plus 0
ok - Payroll: single additional Medicare threshold plus 1000
ok - Payroll: HOH additional Medicare threshold plus 0
ok - Payroll: HOH additional Medicare threshold plus 1000
ok - Payroll: QSS additional Medicare threshold plus 0
ok - Payroll: QSS additional Medicare threshold plus 1000
ok - Payroll: MFJ overwithholding
ok - Payroll: MFS underwithholding
ok - Payroll: wages consume OASDI base and Medicare threshold before SE
ok - Payroll: below400
ok - Payroll: exact400
ok - Payroll: above400
ok - Payroll: loss
ok - Payroll: 164f excludes additional SE Medicare
ok - Payroll: 2011 SE holiday preserves adjustment and special deduction
ok - Payroll: 2012 SE holiday preserves adjustment and special deduction
ok - Payroll: multiple employers retain separate employer caps
ok - Payroll: spouses have independent OASDI caps
ok - Payroll: 1990 unavailable parameters
ok - Payroll: 2027 unavailable parameters
ok - Payroll: missing filing status
ok - Payroll: missing spouse
ok - Payroll: duplicate person
ok - Payroll: negative wages
ok - Payroll: string earnings
ok - Payroll: missing wage measure
ok - Payroll: integration health_fsa
ok - Payroll: integration traditional_401k
ok - Payroll: corrected 2018 determination
ok - Payroll: unmatched employer
ok - Payroll: insufficient wages
ok - Payroll: wage exclusion opens SECA base
ok - Payroll: historical HI wages consume SE base
ok - Payroll: explicit empty wage list
ok - Payroll: explicit empty wage map
ok - Payroll: null scenario payroll input
ok - Payroll review: MFJ rejects other replacing spouse
ok - Payroll review: single rejects spouse replacing taxpayer
ok - Payroll review: MFS rejects other replacing taxpayer
ok - Payroll review: correct explicit roles
ok - Payroll review: correct default roles
ok - Payroll review: correct reversed explicit roles
ok - Payroll review: ambiguous M standalone
ok - Payroll review: ambiguous M scenario
ok - Payroll review: indeterminate HSA known zero exclusion
ok - Payroll review: indeterminate HSA potential exclusion
ok - Payroll review: existing HSA exclusion remains unresolved
ok - Payroll review: other person exclusion does not affect filed return
ok - Payroll review: duplicate taxpayer role is ambiguous
ok - 457 review: special overage bounds employee base draw
ok - 457 review: special overage bounds employer base draw
ok - 457 review: ordinary overage bounds age catch-up with 0 existing
ok - 457 review: ordinary overage bounds age catch-up with 2000 existing
ok - 457 review: special-only member shares combined excess diagnostic
ok - Payroll: numeric-key wage object is the same JSON list in both runtimes
ok - Payroll: numeric-key person object is the same JSON list in both runtimes
ok - Payroll: exact decimal Social Security half-cent rounds up
ok - Fractional priorities retain their ordering
ok - Priority must be a finite number
ok - Parameter lookup: 2026 retirement limits
ok - Parameter lookup: 2026 HSA limits
ok - Parameter lookup: 2026 FSA limits
ok - Parameter lookup: 2026 payroll limits
ok - Parameter lookup: 2026 education limits
ok - Parameter lookup: 2026 ABLE limits
ok - Parameter lookup: 2026 adoption limits
ok - Parameter lookup: 2026 HRA limits
ok - Parameter lookup: 2026 commuter limits
ok - Parameter lookup: fractional year is rejected
ok - Parameter lookup: unsafe integer year is rejected
ok - Parameter lookup: nonportable integer year is rejected

613 conformance vectors, 0 failed
```

**stderr**

_(no output)_

### ESM, CommonJS, and declaration build

Command: `npm run build`

**stdout**

```text

> us-tax-advantaged-params@0.5.0 build
> npm run generate:check && npm run clean && tsc -p tsconfig.esm.json && tsc -p tsconfig.cjs.json && tsc -p tsconfig.types.json && node scripts/finalize-build.mjs


> us-tax-advantaged-params@0.5.0 generate:check
> node scripts/generate.mjs --check


> us-tax-advantaged-params@0.5.0 clean
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
TypeScript/PHP full-output parity passed for 613 vectors and 358 parameter-table lookups across 9 tables.
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
    "id": "us-tax-advantaged-params@0.5.0",
    "name": "us-tax-advantaged-params",
    "version": "0.5.0",
    "size": 592586,
    "unpackedSize": 4047237,
    "shasum": "d07a7f436508ee23bb6c12543b160278ceac5770",
    "integrity": "sha512-R6g9phK2VfWZoJpAGWQkaRTsa0mBRwDO3Hf7akrvwMkpfRMMeNDI1MJagYpEcKV/HKh82S35QsLELtr7InmiHw==",
    "filename": "us-tax-advantaged-params-0.5.0.tgz",
    "files": [
      {
        "path": "LICENSE",
        "size": 1067,
        "mode": 420
      },
      {
        "path": "README.md",
        "size": 140943,
        "mode": 420
      },
      {
        "path": "SOURCES.md",
        "size": 54237,
        "mode": 420
      },
      {
        "path": "data/able-parameters.json",
        "size": 9357,
        "mode": 420
      },
      {
        "path": "data/adoption-parameters.json",
        "size": 29544,
        "mode": 420
      },
      {
        "path": "data/commuter-parameters.json",
        "size": 21662,
        "mode": 420
      },
      {
        "path": "data/education-parameters.json",
        "size": 34298,
        "mode": 420
      },
      {
        "path": "data/fsa-parameters.json",
        "size": 28829,
        "mode": 420
      },
      {
        "path": "data/hra-parameters.json",
        "size": 11181,
        "mode": 420
      },
      {
        "path": "data/hsa-parameters.json",
        "size": 20864,
        "mode": 420
      },
      {
        "path": "data/payroll-tax-parameters.json",
        "size": 43828,
        "mode": 420
      },
      {
        "path": "data/retirement-parameters.json",
        "size": 207560,
        "mode": 420
      },
      {
        "path": "dist/cjs/package.json",
        "size": 25,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js",
        "size": 1091030,
        "mode": 420
      },
      {
        "path": "dist/cjs/USTaxAdvantagedParams.js.map",
        "size": 537920,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js",
        "size": 1090008,
        "mode": 420
      },
      {
        "path": "dist/esm/USTaxAdvantagedParams.js.map",
        "size": 538073,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.cts",
        "size": 90633,
        "mode": 420
      },
      {
        "path": "dist/types/USTaxAdvantagedParams.d.ts",
        "size": 90633,
        "mode": 420
      },
      {
        "path": "package.json",
        "size": 5545,
        "mode": 420
      }
    ],
    "entryCount": 20,
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

