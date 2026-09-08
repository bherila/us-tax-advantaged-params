# us-tax-advantaged-params

[![CI](https://github.com/bherila/us-tax-advantaged-params/actions/workflows/ci.yml/badge.svg)](https://github.com/bherila/us-tax-advantaged-params/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

`us-tax-advantaged-params` is a dependency-free calculation engine for historical and current U.S. tax-advantaged account parameters. It calculates account-level and household-level contribution capacity, IRA phase-outs, shared statutory limits, federal income effects, and Roth-conversion taxability for retirement accounts, and contribution capacity for health savings accounts under IRC §223.

The repository contains two native implementations with the same behavior:

- **TypeScript** for npm, exported as `USTaxAdvantagedParams`.
- **PHP 8.4+** for Packagist, in the `USTaxAdvantagedParams` namespace.

Annual legal parameters are maintained once in `data/retirement-parameters.json` and `data/hsa-parameters.json`, and generated into each single-file runtime. Shared conformance vectors and a full-output parity check keep the TypeScript and PHP engines synchronized.

> **Tax-software scope, not tax advice.** This package calculates statutory parameters from caller-supplied facts. It does not determine whether a plan document permits a contribution, perform ERISA nondiscrimination testing, calculate self-employment tax, replace Form 8606, provide an actuarial valuation, or prepare a tax return. Review material results against the governing plan document and current primary authority.

## Supported tax years

The encoded range is **1975 through 2026**. The package does not extrapolate a future year. Calling a year outside the range throws `UnsupportedTaxYearError` in TypeScript or `UnsupportedTaxYearException` in PHP.

The 1975 starting point corresponds to the first generally available IRA contribution year. Some early employer-plan years cannot be reduced to a universal modern dollar ceiling from tax year alone. In those cases the engine returns an explicit `indeterminate` status and diagnostic rather than inventing a value.

```ts
USTaxAdvantagedParams.supportedTaxYears();
// { minimum: 1975, maximum: 2026 }
```

Health savings accounts have their own range, **2004 through 2026**, because IRC §223 was
added by the Medicare Prescription Drug, Improvement, and Modernization Act of 2003
effective for taxable years beginning after 2003. A year before 2004 returns an
`unavailable` HSA result rather than an extrapolated one.

```ts
USTaxAdvantagedParams.supportedHsaTaxYears();
// { minimum: 2004, maximum: 2026 }
```

Flexible spending arrangements have their own range, **1987 through 2026**. It starts at
1987 because the Tax Reform Act of 1986 §1163 added the §129(a)(2)(A) dependent care
exclusion limitation for taxable years beginning after December 31, 1986; before that
§129(a) carried no dollar cap. The §125(i) health FSA limit starts later, at **2013**,
because the Affordable Care Act §9005 added it for plan years beginning after December 31,
2012. A year between the two returns dependent care figures and a null `healthFsa`.

```ts
USTaxAdvantagedParams.supportedFsaTaxYears();
// { minimum: 1987, maximum: 2026 }
USTaxAdvantagedParams.fsaParametersForYear(2012)?.healthFsa;
// null
```

## Installation

### npm

```bash
npm install us-tax-advantaged-params
```

The npm package provides ESM, CommonJS, and TypeScript declarations and supports Node.js 20 or later.

```js
// ESM
import USTaxAdvantagedParams from "us-tax-advantaged-params";

// CommonJS — the class is the module's default export
const USTaxAdvantagedParams = require("us-tax-advantaged-params").default;
```

### Composer / Packagist

```bash
composer require bherila/us-tax-advantaged-params
```

The PHP package requires PHP 8.4 or later and loads the native single-file implementation through Composer.

## TypeScript builder example

```ts
import USTaxAdvantagedParams, {
  AccountType,
  ConversionType,
  FilingStatus,
} from "us-tax-advantaged-params";

const result = USTaxAdvantagedParams.forTaxYear(2026)
  .filingStatus(FilingStatus.MARRIED_FILING_JOINTLY)
  .taxpayer("taxpayer", (person) => {
    person
      .bornIn(1963)
      .iraCompensation(180_000)
      .w2Compensation(180_000)
      .rothIraMagi(240_000)
      .traditionalIraDeductionMagi(240_000)
      .coveredByEmployerPlan(true)
      .priorYearFicaWages("employer-a", 180_000)
      .aggregateTraditionalSepSimpleIraBasis(20_000)
      .yearEndTraditionalSepSimpleIraValue(80_000);
  })
  .spouse("spouse", (person) => {
    person
      .bornIn(1970)
      .iraCompensation(0)
      .rothIraMagi(240_000)
      .traditionalIraDeductionMagi(240_000)
      .coveredByEmployerPlan(false);
  })
  .account(
    "taxpayer-401k",
    "taxpayer",
    AccountType.TRADITIONAL_401K,
    (account) => {
      account
        .employer("employer-a")
        .annualAdditionsGroup("employer-a")
        .planCompensation(180_000)
        .permitsRothContributions()
        .permitsRothCatchUp()
        .permitsAfterTaxContributions()
        .expectedEmployerContribution(9_000)
        .priority(10);
    },
  )
  .account("taxpayer-roth-ira", "taxpayer", AccountType.ROTH_IRA, (account) => {
    account.priority(20);
  })
  .account("spouse-traditional-ira", "spouse", AccountType.TRADITIONAL_IRA, (account) => {
    account.priority(30);
  })
  .conversion(
    "ira-conversion",
    "taxpayer",
    ConversionType.IRA_TO_ROTH_IRA,
    10_000,
  )
  .calculate();

console.log(result.accounts[0].maximumAnnualContributionBasedOnInputs);
console.log(result.totals.federalAgiReduction);
console.log(result.conversions[0].taxableAmount);
```

A built scenario can be inspected and calculated repeatedly:

```ts
const scenario = USTaxAdvantagedParams.forTaxYear(2026)
  .filingStatus("MFJ")
  .taxpayer("taxpayer", (person) => person.bornIn(1980).w2Compensation(200_000))
  .build();

const input = scenario.toInput();
const result = scenario.calculate();
```

## PHP builder example

```php
<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

use USTaxAdvantagedParams\AccountType;
use USTaxAdvantagedParams\FilingStatus;
use USTaxAdvantagedParams\PersonBuilder;
use USTaxAdvantagedParams\AccountBuilder;
use USTaxAdvantagedParams\USTaxAdvantagedParams as TaxAdvantagedParams;

$result = TaxAdvantagedParams::forTaxYear(2026)
    ->filingStatus(FilingStatus::MARRIED_FILING_JOINTLY)
    ->taxpayer('taxpayer', static function (PersonBuilder $person): void {
        $person
            ->bornIn(1963)
            ->iraCompensation(180_000)
            ->w2Compensation(180_000)
            ->rothIraMagi(240_000)
            ->traditionalIraDeductionMagi(240_000)
            ->coveredByEmployerPlan(true)
            ->priorYearFicaWages('employer-a', 180_000);
    })
    ->spouse('spouse', static function (PersonBuilder $person): void {
        $person
            ->bornIn(1970)
            ->iraCompensation(0)
            ->rothIraMagi(240_000)
            ->traditionalIraDeductionMagi(240_000)
            ->coveredByEmployerPlan(false);
    })
    ->account(
        'taxpayer-401k',
        'taxpayer',
        AccountType::TRADITIONAL_401K,
        static function (AccountBuilder $account): void {
            $account
                ->employer('employer-a')
                ->annualAdditionsGroup('employer-a')
                ->planCompensation(180_000)
                ->permitsRothContributions()
                ->permitsRothCatchUp()
                ->permitsAfterTaxContributions()
                ->expectedEmployerContribution(9_000)
                ->priority(10);
        },
    )
    ->account('spouse-ira', 'spouse', AccountType::TRADITIONAL_IRA)
    ->calculate();

var_dump($result['totals']);
```

The PHP result is an associative-array equivalent of the TypeScript result. Enum values serialize to the same snake-case strings.

## Direct unified interface

Builders are optional. Both engines accept the same language-neutral scenario shape, which is useful for services, fixtures, database records, and cross-runtime integrations.

```ts
const result = USTaxAdvantagedParams.calculate({
  taxYear: 2026,
  filingStatus: "HOH",
  persons: [
    {
      id: "taxpayer",
      role: "taxpayer",
      birthYear: 1975,
      compensation: { iraCompensation: 140_000, w2Compensation: 140_000 },
      magi: { rothIra: 158_000, traditionalIraDeduction: 158_000 },
      coveredByEmployerRetirementPlan: true,
    },
  ],
  accounts: [
    {
      id: "401k",
      ownerId: "taxpayer",
      type: "traditional_401k",
      employerId: "employer-a",
      planRules: {
        planCompensation: 140_000,
        annualAdditionsGroupId: "employer-a",
        expectedEmployerContribution: 7_000,
      },
    },
    { id: "roth-ira", ownerId: "taxpayer", type: "roth_ira", priority: 20 },
  ],
});
```

Filing-status aliases include `S`, `SINGLE`, `MFJ`, `MFS`, `HOH`, `QSS`, and `QW`. The alias `M` is accepted as MFJ but emits an ambiguity diagnostic. Canonical values are preferred in persisted data.

### Input rejection

The unified interface is where stale, mistyped, and cross-runtime data arrives, so an
input it cannot honour is rejected rather than coerced. Both engines throw the same error
code and the same message for the same bad input.

| Code | Raised for |
|---|---|
| `INVALID_TAX_YEAR` | A `taxYear` that is not an integer |
| `INVALID_FILING_STATUS` | A missing `filingStatus`, a non-string, or an unrecognized alias |
| `PERSON_REQUIRED` | `persons` missing, not a list, or empty |
| `INVALID_ACCOUNTS` / `INVALID_CONVERSIONS` | `accounts` or `conversions` present but not a list |
| `INVALID_PERSON` / `INVALID_ACCOUNT` / `INVALID_CONVERSION` | An entry of `persons`, `accounts`, or `conversions` that is not an object |
| `PERSON_ID_REQUIRED` / `ACCOUNT_ID_REQUIRED` / `CONVERSION_ID_REQUIRED` | An `id` that is missing, blank, or not a string |
| `ACCOUNT_OWNER_REQUIRED` / `CONVERSION_OWNER_REQUIRED` | An `ownerId` that is missing, blank, or not a string |
| `UNKNOWN_ACCOUNT_OWNER` / `UNKNOWN_CONVERSION_OWNER` | An `ownerId` that names no supplied person |
| `INVALID_ACCOUNT_TYPE` / `INVALID_CONVERSION_TYPE` | A type that is not a string, or an unrecognized one |
| `INVALID_INPUT_OBJECT` | A structured field — `planRules`, `existingContributions`, `compensation`, `magi`, `priorYearFicaWagesByEmployer`, `hsa`, `hsaCoverage`, `special403bCatchUp`, `section457SpecialCatchUp` — holding something other than an object |
| `INVALID_CONTRIBUTION_PREFERENCE` | A `contributionPreference` outside `account_type`, `pretax_first`, `roth_first` (a *valid* preference that a pension-linked emergency savings account cannot honour is reported as a diagnostic, not rejected — see [Pension-linked emergency savings accounts](#pension-linked-emergency-savings-accounts-irc-402ae)) |
| `INVALID_EMPLOYER_CONTRIBUTION_TAX_TREATMENT` | An `employerContributionTaxTreatment` outside `pretax`, `roth` |
| `INVALID_SIMPLE_EMPLOYER_CONTRIBUTION_METHOD` | A `simpleEmployerContributionMethod` outside `match_3_percent`, `nonelective_2_percent`, `custom` |
| `INVALID_EMPLOYER_ID` / `INVALID_ANNUAL_ADDITIONS_GROUP_ID` / `INVALID_SECTION_457_PLAN_GROUP_ID` | An identifier field holding something other than a non-empty string |
| `INVALID_MONEY` / `INVALID_RATE` | A negative or non-finite amount, or a rate outside 0 through 1 |
| `INVALID_BOOLEAN` | A flag field holding something other than `true` or `false` |

Enum-valued fields in particular are checked rather than compared loosely: a stale or
camel-cased value such as `"rothFirst"` would otherwise fall through to a different branch
and return a plausible but wrong allocation. Structured fields are checked for the same
reason — a scalar where an object belongs used to be ignored in silence, taking every rule
it carried with it. Flag fields must be actual booleans, because JavaScript and PHP
disagree about the truthiness of `"0"` and of an empty array.

Two shapes are deliberately *not* rejected. A missing `accounts` or `conversions` key, and
an explicit `null` in its place, both mean an empty list. And a JSON object whose keys are
exactly `"0"`, `"1"`, … is accepted wherever a list is expected, because `json_decode`
cannot tell it apart from a JSON array, so neither engine may.

## Account coverage

| Family | Account types |
|---|---|
| Individual retirement arrangements | Traditional IRA, Roth IRA, rollover IRA, payroll-deduction IRA, deemed traditional/Roth IRA, inherited traditional/Roth IRA |
| Small-employer arrangements | SEP IRA, Roth SEP IRA, SIMPLE IRA, Roth SIMPLE IRA, grandfathered SARSEP |
| Qualified elective plans | Traditional/Roth 401(k), Solo/Roth Solo 401(k), SIMPLE/Roth SIMPLE 401(k), starter 401(k), pension-linked emergency savings account (PLESA) |
| Tax-sheltered annuities | Traditional/Roth 403(b), safe-harbor deferral-only 403(b) — see the §403(b)(2) note below for tax years 1987-2001 |
| Deferred compensation | Governmental/Roth governmental 457(b), nongovernmental eligible 457(b), 457(f), governmental 457(b)-hosted PLESA |
| Federal plan | Traditional and Roth TSP |
| Employer-only defined-contribution plans | 401(a), profit-sharing, money-purchase, Keogh, ESOP |
| Pension arrangements | Defined-benefit and cash-balance plans |
| Health accounts | Health savings account (HSA), health flexible spending arrangement (health FSA) |
| Dependent care | Dependent care assistance program (dependent care FSA) |

Defined-benefit and cash-balance *contributions* are deliberately returned as `indeterminate`;
their funding requires the plan formula, census, assets, actuarial assumptions, and funding
rules. The §415(b)(1)(A) limitation on the annual *benefit* is a different thing — a flat
statutory ceiling published in the same annual notice as the defined-contribution figures,
requiring no actuary — so it is reported alongside that indeterminate contribution status:

```ts
const result = USTaxAdvantagedParams.calculate({
  taxYear: 2026,
  filingStatus: "S",
  persons: [{ id: "t", birthYear: 1970 }],
  accounts: [{ id: "db", ownerId: "t", type: "defined_benefit_plan", employerId: "e" }],
});
result.accounts[0].status;                             // "indeterminate"
result.accounts[0].statutoryMaximumAnnualContribution; // null
result.accounts[0].definedBenefit?.annualBenefitLimit; // 290000
```

| Rule | Treatment |
|---|---|
| §415(b)(1)(A) annual benefit | Reported on `definedBenefit.annualBenefitLimit` for both defined-benefit and cash-balance accounts, with an `info` diagnostic stating it |
| §415(b)(2) and §415(b)(5) adjustments | **Not** applied. The published figure assumes a straight life annuity beginning between ages 62 and 65; adjusting it for another benefit form, another starting age, or fewer than ten years of participation or service is participant-specific |
| Years with no transcribed figure | `null`. The encoded figures are those transcribed from the notices committed under `evidence/retirement-limits/`, which cover 2009, 2010, and 2013 onward. A year outside that set reports `null` rather than a carried-forward or extrapolated amount |
| Contribution and funding | Still `indeterminate`; a benefit ceiling is not a contribution ceiling, and nothing here computes a funding requirement |

## Pension-linked emergency savings accounts (IRC §402A(e))

SECURE 2.0 §127 added §402A(e), effective for plan years beginning after
December 31, 2023. §402A(e)(1)(A)(i) treats a PLESA "for purposes of this title
as a designated Roth account", so its contributions are always Roth.

That is a characteristic of the account rather than an election, so it precedes
the caller's: `planRules.contributionPreference`, `permitsRothContributions` and
`permitsRothCatchUp` are disregarded on a PLESA — with an INFO
`PENSION_LINKED_EMERGENCY_SAVINGS_CONTRIBUTIONS_ARE_ALWAYS_ROTH` saying so —
rather than honoured into a pre-tax contribution the statute leaves no capacity
for. No accepted input produces a pre-tax contribution to a PLESA. On every
other account type, including an ordinary designated Roth 401(k) or 403(b),
those fields keep their ordinary effect: §402A(b)(1) offers the designated Roth
election *in addition to* pre-tax deferrals, so there the split is a plan and
participant choice.

§402A(f)(1) names three plans that may host one, and **which limits apply turns
on the host**, so the third is a distinct account type:

| Host | Account type | Deferral limit | §415(c) |
|---|---|---|---|
| §401(a) trust — §402A(f)(1)(A) | `pension_linked_emergency_savings` | §402(g) | Yes |
| §403(b) plan — §402A(f)(1)(B) | `pension_linked_emergency_savings` | §402(g) | Yes |
| Governmental §457(b) — §402A(f)(1)(C) | `governmental_457b_pension_linked_emergency_savings` | §457(e)(15) | **No** |

For the first two, model the account inside the plan with the same
`annualAdditionsGroupId` as the plan's other accounts. For the third, use the same
`section457PlanGroupId` as its host §457(b) account, so that one record's §457(b)(3)
provision and includible compensation cover both — see
[One eligible plan, several records](#one-eligible-plan-several-records). The third
shares no §415(c) pool with them: §402(g)(3) enumerates elective deferrals exhaustively and lists no
§457(b) deferral, so its contributions run against the §457(e)(15) applicable
dollar amount through §457(b)(2)(A); and §415(a)(1)–(2) enumerates the plans the
annual-additions limit reaches without naming §457(b), so it joins no
annual-additions group at all. One person may hold a PLESA on more than one host
in the same year, and the ceilings then stand side by side rather than as one —
§402A(e)(3)(A) caps "the portion of the account balance", so each account has its
own.

**The §402A(e)(3)(A)(i) figure is a cap on a balance, not an annual allowance.**
The statute bars a contribution "to the extent such contribution would cause the
portion of the account balance attributable to participant contributions to
exceed" the lesser of that figure and an amount the plan sponsor sets. That
portion of the balance carries across years, and §402A(e)(7) — which requires the
plan to permit withdrawal at least monthly — moves it back down. So the balance
must be supplied; the year alone does not determine what is left:

```ts
const result = USTaxAdvantagedParams.calculate({
  taxYear: 2026,
  filingStatus: "S",
  persons: [{ id: "t", compensation: { w2Compensation: 90000 } }],
  accounts: [{
    id: "plesa",
    ownerId: "t",
    type: "pension_linked_emergency_savings",
    employerId: "e",
    planRules: { pensionLinkedEmergencySavingsParticipantContributionBalance: 1000 },
  }],
});
result.accounts[0].statutoryMaximumAnnualContribution; // 1600 — 2600 less the 1000 balance
result.accounts[0].contributionComponents.employeeRothDeferral; // 1600
```

Because the cap is on a balance, a year's gross contributions may exceed it. A
participant who contributed $600, withdrew $400 under §402A(e)(7), and so holds
$200 attributable to participant contributions has $2,400 of room left and may
reach $3,000 for the year — the Department of Labor's PLESA guidance is explicit
that a plan may **not** impose a separate annual PLESA contribution limit,
precisely so the account can be replenished.

| Rule | Treatment |
|---|---|
| §402A(e)(3)(A)(i) dollar figure | `parameters.pensionLinkedEmergencySavingsBalanceCap402A`. $2,500 for 2024 and 2025, $2,600 for 2026 |
| §402A(e)(3)(A)(ii) plan sponsor amount | Supplied as `planRules.planDocumentEmployeeDeferralLimit`; it lowers the contributable amount but not the reported statutory maximum |
| Participant-contribution balance | **Required.** Supplied as `planRules.pensionLinkedEmergencySavingsParticipantContributionBalance`: the portion of the balance attributable to participant contributions **immediately before the proposed allocation** — including amounts contributed earlier in the same year that are still in the account, net of withdrawals under the plan's accounting, excluding earnings. Pass 0 for a new account. Omitted — or supplied as an explicit `null`, which states the absence of the fact in exactly the same way — the account is `indeterminate` with `PENSION_LINKED_EMERGENCY_SAVINGS_PRIOR_BALANCE_REQUIRED` (whose "prior" means *immediately prior to the allocation*, not an opening or prior-year figure) rather than defaulted to an empty account. This differs from the optional §402A(e)(3)(A)(ii) sponsor amount above, where a `null` means the sponsor set none |
| §402(g) and §415(c) | On a §401(a)- or §403(b)-hosted account, base deferrals are consumed like any other elective deferral and annual addition, in the owner's and the employer group's shared pools; a §414(v) catch-up draws the owner's catch-up pool and, per §414(v)(3)(A)(i), not the annual-additions group. A governmental §457(b)-hosted account consumes neither: it draws the owner's §457(e)(15) pool and joins no annual-additions group, whatever `annualAdditionsGroupId` the caller supplies |
| §457(b)(2)(B) includible compensation | Applies to a §457(b)-hosted account, capped at 100 percent of includible compensation like any other deferral under that plan |
| §457(b)(3) last-three-years catch-up | Available on a §457(b)-hosted account, within the balance cap, on the same reasoning as §414(v): it raises "the ceiling set forth in paragraph (2)", a limit on deferrals under the plan, while §402A(e)(3)(A) gates the account balance. §457(e)(18) gives the participant the greater of it and the §414(v) catch-up, never their sum, and that choice is made once for the participant across every eligible plan — see [Choosing between the two §457 catch-ups](#choosing-between-the-two-457-catch-ups). Reported as `special457RothCatchUp`, since a PLESA contribution is Roth whatever limitation supplied its capacity |
| §402A(e)(3)(A) room | An account-local pool, reported in `sharedLimits` as `plesa402Ae3:{accountId}`, seeded with the supplied balance and drawn by base deferrals and catch-up alike |
| Age-based catch-up | Available, within the balance cap. §402A(e)(3)(A) gates a *balance*, while §414(v) relieves a plan- or employee-level *deferral* limit — 26 CFR §1.414(v)-1(b)(1)(i) lists them and none is account-level — so the two compose and both bind. Once the host's §402(g) pool is spent, remaining room may be filled from the §414(v) catch-up; a catch-up is outside §415(c) under §414(v)(3)(A)(i). As elsewhere in this package, capacity follows from age rather than a plan-document election, under the standing assumption that the plan permits and so characterises it. A birth year is required only where a catch-up could reach unfilled room — not where the host's base capacity already covers it, and not on a §457(b) host where the §457(b)(3) catch-up **exceeds** the largest age-based catch-up the year offers at any age, since §414(v)(6)(C) then removes the age-based one whatever the participant's age. An equal §457(b)(3) amount is not enough: §414(v)(6)(C) speaks of a *higher* limitation, so the age still decides which route applies. Where the route is unresolved, no catch-up is allocated under either heading — §457(e)(18) chooses between pools that are reported separately, so a figure known to be reachable one way or the other is still not attributable to either |
| Employer contributions | Never allocated here. §402A(e)(6)(A) directs any match earned on PLESA contributions to the participant's *other* account under the plan, and §402A(e)(8)(B) bars transfers in |
| 2023 and earlier | `unavailable`, on every host. Pub. L. 117-328 §127(g) applies §127 to plan years beginning after December 31, 2023 |

The 2024 figure comes from the Code rather than from a notice: Notice 2023-75
does not state one, and the flush text of §402A(e)(3)(A) adjusts the $2,500 only
"[i]n the case of contributions made in taxable years beginning after December
31, 2024", leaving the first effective year on the unadjusted statutory amount.

## Health savings accounts (IRC §223)

HSA contribution capacity is calculated from caller-supplied coverage facts. Whether a
person is an eligible individual under §223(c)(1) — including Medicare entitlement under
§223(b)(7) — is an input, not something the engine infers.

| Rule | Treatment |
|---|---|
| §223(b)(2) monthly limitation | The limit is the sum of the monthly amounts divided by 12, so partial-year eligibility prorates by month of coverage |
| §223(b)(3) age-55 additional amount | Per spouse and **not** shareable; each spouse's catch-up must be contributed to that spouse's own HSA |
| §223(b)(5) family coverage | Spouses share a single family limit, divided equally or as agreed. Only the family-months portion is divided; self-only months stay with the individual |
| §223(b)(5)(B)(ii) agreed division | One scenario-level `taxpayerShare` gives the taxpayer that share and the spouse its complement, including when either spouse owns no HSA (see below) |
| §223(b)(5)(A) | If either spouse has family coverage, both are treated as having family coverage for those months — whether or not that spouse owns an HSA (see below) |
| §223(b)(8) last-month rule | Applied automatically, never elected. An individual eligible on December 1 takes the **greater of** the month-by-month sum and December's tier for the whole year; where the greater one is the second, the difference carries a 13-month testing-period obligation (see below) |
| Testing-period failure | The attributable amount is included in income in the following year and carries a 10% additional tax, unless failure is by death or disability |
| Pre-2007 years | §223(b)(2) capped the monthly limitation at 1/12 of the *lesser* of the plan's annual deductible and the dollar amount, until the Tax Relief and Health Care Act of 2006 §303 removed it |
| §106(d) employer contributions | Excluded from income rather than deducted, reducing W-2 box 1 and FICA wages and reducing the §223(b)(4)(B) deduction |
| §223(b)(4)(A) Archer MSA reduction | The aggregate amount paid for the year to that individual's Archer MSAs reduces the whole subsection (b) limitation — the §223(b)(3) increase included — but not below zero |
| §223(b)(5)(B)(i) Archer MSA reduction | For a married individual to whom §223(b)(5) applies, both spouses' aggregate reduces the single family limitation **before** §223(b)(5)(B)(ii) divides it, and never touches the §223(b)(3) amount |
| §223(b)(4)(C) qualified HSA funding distribution | The amount contributed under §408(d)(9) reduces that individual's own subsection (b) limitation — the §223(b)(3) increase included — but not below zero. It is never withdrawn by the flush text and never taken before the §223(b)(5)(B)(ii) division |

The testing period spans two tax years, so a caller who has not yet resolved it receives
an explicit obligation in the result rather than an assumed outcome.

### Spousal coverage: `persons[].hsaCoverage`

§223(b)(5)(A) turns on whether **either spouse has family coverage**, not on whether either
spouse owns a health savings account. A spouse with family HDHP coverage and no HSA of their
own still changes the other spouse's limitation, so that coverage is stated on the person:

```ts
const result = USTaxAdvantagedParams.forTaxYear(2026)
  .filingStatus(FilingStatus.MARRIED_FILING_JOINTLY)
  .taxpayer("taxpayer", (person) => person.bornIn(1985))
  // The spouse has family HDHP coverage but no HSA of their own.
  .spouse("spouse", (person) => person.bornIn(1986).hsaCoverage("family"))
  .account("taxpayer-hsa", "taxpayer", AccountType.HSA, (account) => {
    account.hsaCoverage("self_only");
  })
  .calculate();
```

`persons[].hsaCoverage` takes the same coverage fields as `planRules.hsa`
(`coverageTier`, `eligibleMonths`, `monthlyCoverage`, `hdhpAnnualDeductible`). Where a person
owns an HSA, `planRules.hsa` already carries these facts; supplying both is allowed but they
must be identical, and a contradiction returns
`HSA_PERSON_AND_ACCOUNT_COVERAGE_FACTS_CONFLICT`.

**An empty object explicitly states no coverage.** The shape
`{ id: "s", hsaCoverage: {} }`, or `.noHsaCoverage()` on the builder — records that the
spouse held no high deductible health plan coverage in any month. A nonempty object
without a usable tier/month schedule leaves coverage unknown, even if a deductible is supplied.

**An accountless spouse's coverage is read like anyone else's.** Whose coverage
builds the limitation and where the money may be put are separate questions:
§223(c)(1) does not mention accounts, and Notice 2008-52 Example 14 takes the
§223(b)(8) greater-of on the couple's *combined* figures. So a spouse who states
coverage on `persons[].hsaCoverage` takes part in that comparison and in the
§223(b)(5)(B)(ii) division whether or not they own an HSA. Adding an HSA to a
spouse whose coverage facts are unchanged never changes the other spouse's limit.

The `hsa223b5` shared pool is narrower, and deliberately: it is a capacity guard
for the represented HSA accounts, not a complete calculation of every accountless
spouse's personal allowance. An accountless spouse's own capacity reaches no
account in the scenario, so it stays out of the guard — except where an Archer
aggregate can consume it, since §223(b)(5)(B)(i) subtracts that aggregate once
from the family-month union plus undivided self-only portions and it has to come
out of the whole household's capacity. A known household residue does not
establish which spouse's undivided months absorbed it; those owner limits remain
indeterminate. A separately established age-55 amount remains outside that
reduction. Where the spouses paid into an Archer MSA and an accountless spouse's
coverage statement is nonempty but unusable, the household amount itself is
withheld rather than computed as though that spouse had no capacity.

### Archer MSA contributions: `persons[].archerMsaContributions`

§223(b)(4)(A) reduces the §223(b) limitation by "the aggregate amount paid for such taxable
year to Archer MSAs of such individual", and §223(b)(5)(B)(i) reduces the single family
limitation by "the aggregate amount paid to Archer MSAs of such spouses". Both take an
amount **paid**, not a §220 limitation, so the amount is a caller-supplied fact in the same
way eligible-individual status is, and no part of §220 is modelled or checked against it.

```ts
const result = USTaxAdvantagedParams.forTaxYear(2026)
  .filingStatus(FilingStatus.SINGLE)
  .taxpayer("taxpayer", (person) => person.bornIn(1986).archerMsaContributions(1200))
  .account("taxpayer-hsa", "taxpayer", AccountType.HSA, (account) => {
    account.hsaCoverage("self_only");
  })
  .calculate();
// 4400 - 1200 = 3200
```

Because §223(b)(5)(B)(i) reads the *couple's* aggregate, the amount belongs to the person
rather than to an account: a spouse who owns no HSA can still carry one, and it still
reduces the limitation the other spouse divides.

**The ordering is not cosmetic.** The §223(b)(4) flush text says "Subparagraph (A) shall not
apply with respect to any individual to whom paragraph (5) applies", so a married individual
with family coverage is reduced under §223(b)(5)(B)(i) — before the equal division, not
after. Two spouses with a 2026 family limitation of 8750 and 3000 of aggregate Archer
contributions get (8750 − 3000) ÷ 2 = 2875 each, not 4375 − 3000 = 1375 each, which would
subtract the aggregate twice. §223(b)(5)(B) also operates "without regard to any additional
contribution amount under paragraph (3)", so a married individual's age-55 amount survives a
reduction that would have consumed it under §223(b)(4)(A).

Each account's `hsa` detail reports `archerMsaContributionsApplied`,
`archerMsaReductionPrecedesFamilyDivision`, and `archerMsaLimitReduction`, and an
`HSA_ARCHER_MSA_CONTRIBUTIONS_REDUCE_LIMIT` diagnostic names the paragraph that applied. For a
married couple whose division was never settled, `archerMsaLimitReduction` is `null` and the
diagnostic states the reduction at couple level instead — see
[A share nobody established is not a zero](#a-share-nobody-established-is-not-a-zero).

### Qualified HSA funding distributions: `persons[].qualifiedHsaFundingDistributions`

§223(b)(4)(C) reduces the §223(b) limitation by "the aggregate amount contributed to health
savings accounts of such individual for such taxable year under section 408(d)(9)" — a
once-in-a-lifetime IRA-to-HSA rollover. Like the Archer amount it is a fact about the
person, taken as supplied: the §408(d)(9)(C) once-per-lifetime limitation and the separate
§408(d)(9)(D) testing period are **not** modelled, and the amount is not checked against the
IRA it came from.

```ts
const result = USTaxAdvantagedParams.forTaxYear(2026)
  .filingStatus(FilingStatus.SINGLE)
  .taxpayer("taxpayer", (person) => person.bornIn(1986).qualifiedHsaFundingDistributions(1500))
  .account("taxpayer-hsa", "taxpayer", AccountType.HSA, (account) => {
    account.hsaCoverage("self_only");
  })
  .calculate();
// 4400 - 1500 = 2900
```

**It behaves the opposite way to the Archer reduction for a married couple, and the flush
text is why.** "Subparagraph (A) shall not apply with respect to any individual to whom
paragraph (5) applies" names subparagraph (A) alone, and §223(b)(5)(B)(i) reduces the family
limitation only by the Archer amount, so nothing routes (C) through paragraph (5). It stays
an amount of "such individual" reducing the limitation applying to that individual under
subsection (b) — which for a married spouse is the share left by the §223(b)(5)(B)(ii)
division, **after** the division rather than before it, plus their own §223(b)(3) amount.

Two spouses with the 2026 family limitation of 8750 divide it to 4375 each. A $2,000
rollover by one spouse leaves 2375 and 4375; the same $2,000 paid to an Archer MSA instead
leaves 3375 and 3375, because that reduction comes off the 8750 first. And since (C) is not
governed by §223(b)(5)(B)'s "without regard to any additional contribution amount under
paragraph (3)", it reaches a married individual's age-55 amount where the Archer reduction
cannot.

When both reductions apply, §223(b)(4) reduces by "the sum of" them but not below zero. The
fall is attributed in subparagraph order, so `archerMsaLimitReduction` is reported in full
and `qualifiedHsaFundingLimitReduction` reports only what was left for (C) to reach. Each
account's `hsa` detail reports `qualifiedHsaFundingDistributionsApplied` and
`qualifiedHsaFundingLimitReduction`, and an
`HSA_QUALIFIED_HSA_FUNDING_DISTRIBUTION_REDUCES_LIMIT` diagnostic states which ordering
applied.

### The last-month rule is a greater-of, not an election

**Breaking change in 0.5.0.** §223(b)(8) is applied automatically to anyone eligible in
December. There is no input for switching it on, and `useLastMonthRule` is gone.

§223(b)(8)(A) says an individual who is an eligible individual during the last month of the
taxable year "shall be treated" as an eligible individual for each month of that year. Notice
2008-52 states the resulting maximum as **the greater of**

1. the sum of the monthly limitations on the facts as they stand, "based on eligibility and
   HDHP coverage on the first day of each month", plus monthly catch-up amounts; and
2. the whole annual amount for the coverage tier held on December 1, plus the whole §223(b)(3)
   amount.

Neither limb is conditioned on a taxpayer's choice: there is no election statement, no Form
8889 checkbox and no revocation, and the Form 8889 instructions simply tell a
December-eligible taxpayer whose coverage changed to enter the greater amount on line 3. The
instructions' "you may consider yourself an eligible individual for the entire year" is the
practical decision to *fund* the extra capacity — and a taxpayer may always contribute less
than a statutory maximum without lowering it.

What follows from actually funding it is the testing period, and that is measured on conduct
rather than on any flag. §223(b)(8)(B)(i) reaches only contributions "which could not have
been made but for" the rule, which is
`hsa.amountAttributableToLastMonthRule`. Where that figure is zero — because the month-by-month
candidate won, or because a spousal division left this owner no more room than their own months
gave them — no testing-period obligation is reported at all, and `hsa.testingPeriod` is `null`.

Two fields report the outcome, and they answer different questions:

| Field | Question |
|---|---|
| `hsa.fullContributionCandidateSelected` | Which candidate was the ceiling built from? True means candidate (2) |
| `hsa.amountAttributableToLastMonthRule` | What was the rule worth *to this owner*, and so what is exposed if the testing period fails? |

Testing-period facts are stated per person, and only the consequence is stateable:

```ts
{ id: "t", hsaLastMonthRuleTestingPeriod: { satisfied: true } }
{ id: "t", hsaLastMonthRuleTestingPeriod: { satisfied: false, failureByDeathOrDisability: true } }
```

Omitting them leaves the period unresolved, which is reported
(`HSA_LAST_MONTH_RULE_TESTING_PERIOD_UNRESOLVED`, status `determinate_with_assumptions`) rather
than assumed satisfied — but only where the attributable amount is positive. The attributable
amount measures this individual's potential recapture exposure. It is zero for an
owner established ineligible on December 1, even if the household's full candidate
increases their ceiling through the other spouse. That owner receives no testing
period, income-inclusion amount, additional tax, or testing-period warning.

**Conflicting spouse coverage.** A complete coverage statement remains one schedule,
including its annual deductible. The engine evaluates each coherent spouse statement
through both Notice 2008-52 candidates, the household comparison, monthly eligibility,
and the family division. An established owner's result can remain determinate when
all completions give identical contribution amounts, shared-limit usage, candidate
selection, and testing-period state. `HSA_COHERENT_COVERAGE_COMPLETIONS_AGREE`
records that proof; the spouse's own contradictory statements remain unresolved.
Varying nullable audit amounts, such as `dividedFamilyContributionLimit`, are `null`.

For example, an under-55 owner with family coverage January–November and self-only
coverage in December has a monthly candidate of `(11 × 8750 + 4400) / 12 = 8387.50`
in 2026. With an agreed whole share, contradictory January-only spouse statements
(family versus self-only) cannot make the full-year candidate overtake it. The owner
retains 8387.50. A December-only self-only owner remains indeterminate: the same
statements give 4400 versus 4762.50.

Partial statements retain the facts they supply: `eligibleMonths: [1]` without a
tier leaves the common self-only/family tier unresolved, not January eligibility.
For entirely unknown schedules with all relevant deductible amounts supplied, or
after the 2006 deductible-cap repeal, the evaluator traverses every schedule
up to permutations of equivalent January–November months, with December separate.
It does not sample or truncate the possibilities. Missing continuous deductible
facts in capped years remain conservative. A missing spouse person still leaves
the Archer operand unestablished. Coverage may be supplied on the person alone;
an absent account statement differs from an explicitly unusable account `{}`.

**Reading the division off the result.** `sharedFamilyContributionLimit` is the whole family
limitation an owner refigured for their own family months, and Q&A-31 does not divide all of it:
a month only one spouse was eligible for goes to that spouse whole. `dividedFamilyContributionLimit`
is the part `familyLimitShare` actually multiplies, so with no Archer MSA amount in play

```
proratedContributionLimit - dividedFamilyContributionLimit * (1 - familyLimitShare)
```

is the owner's §223(b)(1) limitation. A taxpayer family-covered all year beside a spouse eligible
in December alone holds 8750 and divides only December's 729.17 of it: 8750 - 729.17 × 0.5 =
8385.42. Multiplying the share by the whole 8750 instead gives 4375, which is wrong by 4010.42.
The published figures are rounded to cents while the engine divides the unrounded monthly amounts,
so treat the identity as a description of the composition rather than a way to re-derive the ceiling.
The divided portion is also `null` when an Archer MSA reduction leaves family capacity but its
placement between shared and sole-eligible months is unresolved. The total family limitation
can remain known in that case; exhausting it establishes a divided portion of zero.

**A married spouse's own share can fall while the couple's limitation rises.** Notice 2008-52
Example 14 compares the *couple's combined* candidates and divides the winner, and Form 8889
follows that order — line 3 and line 5 before the spousal division on line 6. So where one
spouse holds family coverage in December alone and the other is eligible all year with
self-only coverage, the couple's combined candidate (2) of 8750 beats their combined candidate
(1) of 4762.50, and the equal division gives 4375 each — below the 4397.92 the all-year spouse's
own months would have earned undivided. Nothing is wrong there and nothing is diagnosed: the
rule raised the couple's limitation, and §223(b)(5)(A) plus the default equal division moved
part of it across. Spouses who would rather not move it may agree a different division under
§223(b)(5)(B)(ii). The spouse whose share fell has an attributable amount of zero and no
testing-period exposure, because none of their ceiling depends on the rule.

### The division is one fact about the couple

**Breaking change in 0.5.0.** Four fields moved off `planRules.hsa`. An account that still
carries one is rejected rather than read, so a stale call fails loudly instead of quietly
using half of what it stated:

| Removed from `planRules.hsa` | Now | Error code if still supplied |
|---|---|---|
| `familyLimitShare` | `hsaFamilyLimitDivision` on the **scenario** | `HSA_ACCOUNT_LEVEL_FAMILY_LIMIT_SHARE_REMOVED` |
| `useLastMonthRule` | **nowhere — §223(b)(8) is not an election** | `HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED` |
| `testingPeriodSatisfied` | `persons[].hsaLastMonthRuleTestingPeriod.satisfied` | `HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED` |
| `testingPeriodFailureByDeathOrDisability` | `persons[].hsaLastMonthRuleTestingPeriod.failureByDeathOrDisability` | `HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED` |

The same four are rejected on `persons[].hsaCoverage` too. That object is the nearest-looking
home for a field you have just been told to move off the account, and reading them there would
be the worse of the two failures: an ignored `familyLimitShare` falls back to the §223(b)(5)(B)(ii)
statutory equal split, so acting on the error and moving the field one object sideways would hand
you **half** the limitation you asked for, with nothing saying so.

None of the four was ever a fact about an account. §223(b)(5)(B)(ii) divides the limitation
between "them" — the married individuals — and §223(b)(8) operates on "an individual". An
owner's two HSAs cannot disagree about any of them, and Pub. 969 is explicit that multiple HSAs
do not subdivide their owner's maximum: "If you have more than one HSA in 2005, your total
contributions to all the HSAs cannot be more than the limits discussed earlier."

`useLastMonthRule` did not move: it stated a thing the Code does not have. **Delete it** —
the ceiling it used to unlock is now computed from the coverage facts, so removing it changes
no answer except where it was wrongly withholding one.

`hsaFamilyLimitDivision` is one statement, on the scenario:

```ts
{ status: "statutory_equal" }                  // the default; omit it for the same effect
{ status: "agreed", taxpayerShare: 0.25 }      // the spouse takes the remaining 0.75
{ status: "unknown" }                          // whether they agreed anything is not known
{ status: "disputed" }                         // the spouses report different divisions
{ status: "inconsistent" }                     // two records of one division conflict
```

`taxpayerShare` is the share belonging to the person whose `role` is `taxpayer`; the spouse
takes `1 - taxpayerShare`. Because there is one number rather than one per account, shares
can no longer fail to total 1, and the three diagnostics that policed that
(`HSA_FAMILY_LIMIT_SHARES_EXCEED_ONE`, `HSA_FAMILY_LIMIT_SHARES_BELOW_ONE`,
`HSA_FAMILY_LIMIT_SHARE_REQUIRED_FOR_BOTH_SPOUSES`) are gone with the states they described.

0 and 1 are both valid. Notice 2004-50 Q&A-32: spouses "can divide the annual HSA contribution
in any way they want, **including allocating nothing to one spouse**". The spouse allocated
nothing still keeps their own §223(b)(3) age-55 amount — Notice 2008-59 Q&A-22 holds that an
individual eligible for the catch-up "may only make such contributions to his or her own HSA",
and §223(b)(5)(B) divides the limitation "without regard to any additional contribution amount
under paragraph (3)", so a division cannot reach it either way.

**Omitting the field means `statutory_equal`, not unknown.** The statute divides equally
"unless they agree on a different division", so silence is the default rule rather than a
missing fact, and the Instructions for Form 8889 say the same. The three non-numeric statuses
exist because failing to establish the agreement is not the same input state as establishing
its absence: contradictory records are equally consistent with "they agreed equally and one is
wrong" and "they agreed 25/75 and the other is wrong", and defaulting those to 50/50 would
overstate one spouse's limitation in the second case. `unknown`, `disputed` and `inconsistent`
differ only in the wording of the diagnostic they produce; they are deliberately identical in
effect, and should stay that way.

**A spouse who owns the only HSA still gets half — unless they are the only *eligible* one.** §223(b)(5)(B)(ii) divides "equally between
them", and *them* is "individuals who are married to each other" from the opening clause of
paragraph (5) — a phrase about a marriage, not about a pair of accounts. Owning an HSA is not a
condition of being an eligible individual under §223(c)(1), so a spouse with family coverage and
no account still holds their half and simply has nowhere to put it. A sole owner therefore takes
$4,375 of an $8,750 limitation, reports `HSA_SOLE_SPOUSE_ACCOUNT_TAKES_ONLY_ITS_EQUAL_SHARE`, and
reaches the whole $8,750 only through an agreement:

```ts
{ status: "agreed", taxpayerShare: 1 }   // Notice 2004-50 Q&A-32 permits exactly this
```

The distinction is eligibility, not account ownership. Where the other spouse is stated to have held no
HDHP coverage in any month (`hsaCoverage: {}`), they are not an eligible individual under §223(c)(1), take
no share, and the owner gets the whole limitation — Notice 2004-50 Q&A-31: "if only one spouse is an
eligible individual, only that spouse may contribute to an HSA (**notwithstanding** the treatment under
section 223(b)(5)(A) of both spouses as having only family coverage)", worked by Example (1) of that Q&A.
That case reports `HSA_SOLE_ELIGIBLE_SPOUSE_TAKES_WHOLE_FAMILY_LIMIT` instead. If the other spouse
states nothing, eligibility remains unknown: the owner might receive half or the whole. Where
those readings change the answer, the engine reports `HSA_FAMILY_LIMIT_DIVISION_INDETERMINATE`,
`familyLimitShare: null`, and a null maximum.
For an MFJ or MFS family-covered HSA owner, supply both person records. An absent
partner does not establish either their eligibility or their Archer MSA amount, so
`HSA_SPOUSE_COVERAGE_FACTS_REQUIRED` withholds the result even with an agreed whole
share. That agreement settles the eligibility-dependent division but cannot settle
the aggregate reduction in §223(b)(5)(B)(i). On a supplied person record an omitted
Archer amount defaults to zero. The reduction precedes division and never consumes
the separate age-55 amount. A missing spouse deductible can still matter in
2004–2006, and missing coverage can still change self-only months.

Earlier versions assumed a sole HSA owner had agreed to take everything when no
account-level share was supplied, reporting `HSA_SOLE_SPOUSE_ACCOUNT_ASSUMED_FULL_FAMILY_LIMIT`.
The scenario-level contract applies the statutory default when the supplied eligibility
and coverage establish it; otherwise the division remains unknown. **If you relied on
that earlier assumption, state the agreement explicitly.**

**An unknown division of nothing is still determinate.** The division is only ever a fact about
something: where the limitation left after the §223(b)(5)(B)(i) Archer reduction is zero, every
division yields the same zero monetary maximum, so that maximum remains determinate. The
division itself is still unestablished and `familyLimitShare` remains null. What counts as
"nothing" depends on the doubt: a doubtful *share* divides only the family portion, so an
exhausted family residue makes it immaterial even where undivided self-only months survive,
while an Archer aggregate whose placement among undivided months is open is immaterial only
once the whole paragraph (1) residue is gone. The same principle
applies one level down — an eligibility doubt about a spouse
whose agreed share is already exactly `0` stands aside, because that spouse gets nothing whether
they are an eligible individual or not. Both rules exist because an unknown that cannot change
an answer is not worth withholding an answer for.

Two shapes are rejected outright, because each states an agreement and denies it in the same
object: `{ status: "agreed" }` with no share raises
`HSA_FAMILY_LIMIT_DIVISION_SHARE_REQUIRED`, and a `taxpayerShare` beside any other status
raises `HSA_FAMILY_LIMIT_DIVISION_SHARE_NOT_PERMITTED`.

### The `hsa` detail is withheld, never completed

`account.hsa` is an audit trail of **one** chosen coverage schedule and **one** chosen winner of the
§223(b)(8) comparison — the months, the monthly amounts applied to them, both limitation figures,
the selected candidate and the amount attributable to the rule. Where the input leaves several
completions open, there is no such trail, and the whole object is `null` rather than filled in from
whichever statement happened to be read first:

- an owner's two HSAs, or an HSA and `persons[].hsaCoverage`, stating different coverage months (or,
  in a capped year, different annual deductibles);
- no usable coverage statement at all;
- a spouse's family coverage neither supplied nor reconcilable, where it could rewrite a month of
  either schedule;
- a birth year that would decide which candidate wins, because §223(b)(3) is prorated in one and
  whole in the other;
- an unapportionable §223(b)(5)(B)(i) Archer reduction, where which spouse's undivided months
  absorbed it decides the pre-division amount.

Where the couple's *combined* candidates are what the greater-of compares, one spouse's open
candidate withholds the other's detail too. **An unsettled §223(b)(5)(B)(ii) division does not**: it
leaves both candidates exactly as computable, so every figure describing the owner's own undivided
months or the couple's limitation stays. What it does null is the four figures that are this owner's
*share* of the result rather than the result — see below.

### A share nobody established is not a zero

`familyLimitShare` is not the only field an unsettled §223(b)(5)(B)(ii) division reaches. Four more
report a fall in, or a slice of, **this owner's** ceiling, and each of them is that owner's share of
a couple-level figure:

| Field | Why the share decides it |
|---|---|
| `archerMsaLimitReduction` | §223(b)(5)(B)(i) takes the spouses' aggregate off the one limitation *before* (B)(ii) divides it, so an owner's own fall is their share of that reduction |
| `qualifiedHsaFundingLimitReduction` | §223(b)(4)(C) reduces the share (B)(ii) left them, so how far their ceiling fell is bounded by it |
| `amountAttributableToLastMonthRule` | §223(b)(8)(B)(i) recaptures what "could not have been made but for subparagraph (A)" — the owner's share of the couple's increase |
| `testingPeriod` | it exists only where that attributable amount is positive |

These four, plus `familyLimitShare`, are also `null` where the account's **ceiling itself** was never
established — a plan whose stated deductible contradicts §223(c)(2)(A)(i), say. A fall is the
difference between two ceilings, so a $100 Archer MSA contribution against no established limitation
took an unknown amount off an unknown amount; `0` would say the paragraph applied and cost nothing.
`archerMsaContributionsApplied` and `qualifiedHsaFundingDistributionsApplied` still report what was
supplied, and `0` is still exact where nothing was supplied — the operand settles that without a
ceiling.

Each is `null` where a share is genuinely in question, not `0`. Two spouses whose only coverage is
family in December 2026 have a couple's limitation of 8750 against a month-by-month 729.17, so each
owner's attributable amount is somewhere between nothing and 8020.83 — and a `0` there would say
§223(b)(8)(B)(i) has nothing to recapture from them. `testingPeriod` is `null` both where no
obligation arises and where none can be computed; `amountAttributableToLastMonthRule` separates the
two, being `0` in the first case and `null` in the second.

**A share is only in question where a month is shared.** Spouses eligible in disjoint halves of the
year each take their own months whole under Notice 2004-50 Q&A-31, so nothing of theirs is divided
and all four figures stay numeric while `familyLimitShare` is still `null`. And the immateriality
that rescues a *maximum* does not rescue these: where an Archer reduction exhausts the limitation to
a zero every division yields alike, both ceilings end at zero, but how far each spouse fell to get
there is still their share, so the maximum stays `0` and `archerMsaLimitReduction` is `null`.

`null` here is not the same as the key being absent, which still means "not an HSA account". The
account's status, its null maximum, its shared limits and its diagnostics are all reported as before
— only the completion is withheld. The point is order-independence: reversing two contradictory
account records must not change any fact the engine reports, and a field-by-field completion beside
a diagnostic saying the fact was never established is exactly the shape that lets it.

### HSA usage describes feasible attribution

IRC §223 and §4973(g) compare aggregate contributions with the owner's combined limitation.
They do not specify whether a contribution consumes base capacity before the age-55 increase.
The audit pools therefore report feasible attribution, not a base-first convention. For base
`B`, age-55 increase `C`, counted owner contributions `T`, and `A = min(T, B + C)`:

```text
base usage     = [max(0, A - C), min(A, B)]
age-55 usage   = [max(0, A - B), min(A, C)]
```

`usedBeforeAccount` and `remainingAfterAccount` are numbers when their range collapses, and
otherwise null beside `possibleUsedBeforeAccount` and `possibleRemainingAfterAccount`.
`usedByAccount` follows the same rule; `possibleUsedByAccount` carries the feasible component
attribution of a newly allocated amount. These ranges can be open even with an established
`familyLimitShare`. A settled aggregate allocation does not establish its component attribution.

For example, a 2026 owner with base 4,375, age-55 increase 1,000 and existing contributions
2,000 has base usage `[1000, 2000]` and age-55 usage `[0, 1000]`. The owner still has exactly
3,375 of additional capacity. Allocation uses that combined capacity and preserves the family
guard, including deterministic assignment of its final cent; it does not add independent pool
remainders and lose the correlation between them.

An unknown division is evaluated with one common taxpayer-share variable for both spouses.
The family range combines feasible usages under the **same division**. Missing coverage,
unknown age and unresolved Archer placement remain unknown when no feasible capacity model is
established; reporting then supplies nulls without invented endpoints. Coherent coverage
completions recover only invariant contribution amounts, candidate state and shared-limit
usage, as described above; varying nullable audit fields remain null.

Component usage excludes aggregate excess rather than assigning it to an invented component.
`SUPPLIED_EXISTING_CONTRIBUTIONS_EXCEED_SHARED_LIMIT` separately diagnoses known excess across
one owner's HSAs, or necessary base usage above the family limit after allowing each owner's
nontransferable age-55 capacity. Supplied excess remains counted against the household allocation guard pending
correction, even though it is excluded from allowable component usage. The latter can be known while the division remains unknown.

Qualified HSA funding distributions reduce only their beneficiary's individual ceiling under
IRC §223(b)(4)(C). They are not an aggregate family reduction. Notice 2008-51 Example 5
permits a distribution exceeding the beneficiary's annual deductible limit; reserving that
excess against the other spouse would wrongly withhold their capacity. Funding qualification
and its separate testing period remain outside this calculation.

Shared-month amounts and the spouse's complementary share are combined before final cent
rounding. Modern statutory monthly amounts retain their annual-cents-over-twelve precision;
capped-year raw deductible amounts retain their supplied represented precision.

In 2004–2006 a missing deductible need not always withhold the final answer. If established
Archer contributions exhaust the upper bound on the couple's unreduced base, every deductible
leaves zero base. `HSA_ARCHER_REDUCTION_COLLAPSES_MISSING_DEDUCTIBLE` reports this proof. The
separate age-55 amount survives, and `hsa` detail is null because the pre-reduction figures
remain unknown. This does not assume that an absent plan fact establishes HDHP eligibility.

### An unknown division does not make the limitation unknown

§223(b)(5) settles two things, and they fail separately. Subparagraph (A) fixes **one family
limitation** for the couple; (B)(ii) **divides** it between them. A disagreement about the
division — an `hsaFamilyLimitDivision` status of `unknown`, `disputed` or `inconsistent` —
reaches only the second. Subparagraph (A) has already fixed the amount from coverage facts by the time (B)(ii)
is reached, so the couple's ceiling is still a number even though nobody can say whose it is.

A **disagreement about eligibility** reaches it too, and only that kind does. Two of a spouse's
statements saying self-only and family both assert an eligible individual and leave the division
branch fixed; one saying family and another saying no covered month do not, because §223(b)(5)(B)(ii)
divides the limitation between spouses who are each an eligible individual while Notice 2004-50
Q&A-31 gives the whole of it to the other spouse when only one is. Neither branch is then established,
so no `HSA_FAMILY_LIMIT_DIVIDED_EQUALLY_BY_DEFAULT` and no
`HSA_SOLE_ELIGIBLE_SPOUSE_TAKES_WHOLE_FAMILY_LIMIT` is announced — those name a statutory branch, not
an arithmetic result. A deductible disagreement in a year that no longer reads the deductible is not
an eligibility disagreement.

The engine reports the two separately:

| Unknown | Diagnostic | `hsa223b5` shared limit | Account maximum |
|---|---|---|---|
| The amount — coverage or a 2004–2006 annual deductible | `HSA_SHARED_FAMILY_LIMIT_INDETERMINATE` | `null` | `null` |
| The division — an unsettled `hsaFamilyLimitDivision`, or an impeached eligibility assertion | `HSA_FAMILY_LIMIT_DIVISION_INDETERMINATE` | the limitation | `null` |

Both are `ERROR` and both leave every account's `statutoryMaximumAnnualContribution` null: a
share of a known amount is still unknown when the share is. What differs is the couple-wide
figure. `sharedFamilyContributionLimit` follows the **amount**, because that is its contract —
the limitation this owner divides, reported before the share is applied — so a caller settling
an unsettled division can still see the 8750 they are dividing.

### When the other spouse's coverage is required

§223(b)(5)(A) does two things, and each makes the other spouse's coverage matter in a
different case. On a married return, an owner with no stated spousal coverage returns
`indeterminate` with `HSA_SPOUSE_COVERAGE_FACTS_REQUIRED` — rather than a number the input
cannot support — whenever either applies:

| Sentence | Bites when the owner has | Years |
|---|---|---|
| Both spouses treated as having family coverage if either does | at least one **self-only** month, which it can raise | all |
| Spouses with family coverage under different plans take the **lowest** annual deductible | at least one **family** month, whose deductible it can lower | 2004–2006 only |

The first can only ever raise a self-only month to a family month, so an owner whose months
are all family months is unaffected by it — family is already the higher tier. The second is
why that owner is still not safe in 2004–2006: §223(b)(2) capped each month by the plan's
annual deductible in those years, and an unstated spouse may hold a family plan with a lower
one, which would make the couple's limitation *lower* than the owner's own plan produces.
Section 303 of the Tax Relief and Health Care Act of 2006 struck that comparison for years
after 2006, so from 2007 an unstated spouse's deductible cannot move any amount.

Absence is not an assertion. If the spouse genuinely held no HDHP coverage, say so with
`persons[].hsaCoverage: {}` — the documented way to record exactly that — and the limitation
stays determinate. The engine will not read silence as "no competing family plan", because
that would answer the comparison from a fact you never supplied, and in the direction that
costs a taxpayer the §4973 excise.

Coverage is resolved across every statement for an owner, independently of account order.
Equivalent month sets and equivalent `coverageTier`/`eligibleMonths` and `monthlyCoverage`
representations agree. An explicit `planRules.hsa: {}` is unusable: even with a complete
duplicate statement, it produces `HSA_COVERAGE_FACTS_REQUIRED` and `hsa: null` on that
owner's accounts. It is not a contradictory assertion of no coverage. Person-level coverage
is compared with every usable account statement, and a missing 2004–2006 deductible is
diagnosed across the statements rather than taken from the first account. Conflicting supplied
deductibles are diagnosed as conflicts, without also claiming a deductible is missing.

Only an empty person-level `hsaCoverage: {}` affirmatively states no coverage. A nonempty
statement with no usable schedule, such as `{ hdhpAnnualDeductible: 3400 }` or
`{ eligibleMonths: [1] }`, leaves coverage unknown. It cannot establish that the other
spouse is the sole eligible individual. An unusable person-level duplicate also leaves its
owner indeterminate with `HSA_COVERAGE_FACTS_REQUIRED`, even if an account supplies a complete
schedule. Explicit empty schedules (`monthlyCoverage: []`
or a tier with `eligibleMonths: []`) still establish no eligible months.

### A deductible below the statutory minimum is inconsistent input

`hdhpAnnualDeductible` is taken as stated, but it is checked for internal consistency. A figure
below the §223(c)(2)(A)(i) minimum for a tier you also state the person held returns
`indeterminate` with `HSA_HDHP_DEDUCTIBLE_BELOW_STATUTORY_MINIMUM`, in **every** year — not
only the 2004–2006 years where §223(b)(2) read the deductible into the arithmetic.

This is not the engine testing whether your plan is a high deductible health plan; it still
does not do that, and clearing the minimum proves nothing. The test is one-way: falling below
the minimum disproves your own claim that the field holds a qualifying plan's deductible.

What the engine deliberately does **not** do is as important:

| It does not | Because |
|---|---|
| raise the figure to the minimum | Notice 2004-50 Q&A-31 Example (4) does not treat a subminimum plan as if it met the floor |
| publish it as a lower ceiling | the same example makes the consequence an *eligibility* one, not a smaller limitation |
| return `ineligible` | Rev. Rul. 2005-25 makes that turn on whom the plan covers, and no input here carries that fact |

The tier decides reach, and it decides it for the **amount** only. A spouse's subminimum
**family** plan reaches the HSA owner's limitation, because §223(b)(5)(A) draws competing family
plans into the lowest-deductible comparison; it reaches only the months that plan was in force,
since that comparison is answered per month. A spouse's subminimum **self-only** plan never
enters it — Notice 2004-50 Q&A-31 Example (1) leaves the owner contributing the full family
amount in exactly that case.

The **division** is a separate question with a different answer, and any tier reaches it. Q&A-31
divides the limitation only between spouses who are each an eligible individual: "if only one
spouse is an eligible individual, only that spouse may contribute to an HSA". This engine reads
your month list as the assertion of eligibility, so a deductible contradicting that list
impeaches it. That doubt can change the division whether or not the contradicting spouse
owns an HSA. Where the alternative eligibility readings change an owner's allocation,
`familyLimitShare` and the affected maximum are null with a diagnostic. The §223(b)(5)
pool can still report its amount when only the division is uncertain. A doubt that cannot
move the allocation, such as an already agreed zero share for that spouse, leaves the
monetary result intact.

Encoded HSA parameters are verified against the Revenue Procedure that published them —
see [`evidence/hsa-limits/`](evidence/hsa-limits/).

## Health flexible spending arrangements (IRC §125(i))

The §125(i) ceiling on salary reduction contributions is calculated from caller-supplied
plan facts. Plan design is not inferred: this engine cannot read a plan document, so
whether the plan offers a carryover or a grace period, whether employer flex credits could
be elected as cash, and the arrangement's Rev. Rul. 2004-45 purpose are all inputs.

| Rule | Treatment |
|---|---|
| §125(i)(1) salary-reduction limit | The indexed dollar limitation, applied per employee per employer |
| Years before 2013 | §125(i) did not exist, so there was **no statutory ceiling at all** — only whatever the plan document imposed. The result is `indeterminate` with a null limit, not a fabricated one and not `unavailable`: the account existed, the limit did not |
| Notice 2013-71 carryover | The carried amount is the lesser of the prior year's unused amount and **that year's** cap. The rest is forfeited |
| Carryover does not reduce the limit | Notice 2013-71: the carryover "does not count against or otherwise affect" the §125(i) limit, so it sits on top of the receiving year's ceiling |
| Carryover **or** grace period, never both | Notice 2013-71 forbids the combination. Asserting both describes a plan that cannot exist, so the result is `indeterminate` with an `ERROR` |
| Neither offered | The whole unused amount is forfeited under the use-or-lose rule, and the forfeiture is reported rather than dropped |
| Employer flex credits | Outside §125(i), which reaches salary reduction contributions alone — **unless** the employee could have elected them as cash or another taxable benefit, in which case Notice 2012-40 treats them as salary reduction contributions and they consume the limit |
| Election above the limit | An `ERROR`, never silent truncation. Notice 2012-40 holds that a plan permitting a higher election is not a §125 cafeteria plan at all, so truncating would report a smaller consequence than the statute produces |
| Per employee per employer | Notice 2012-40: two unrelated employers carry two full limits; arrangements sharing an `employerId` share one, which is how §125(g)(4) controlled-group aggregation is expressed |
| Spouses | Each spouse carries a full limit, even in the same plan of the same employer. This is the deliberate contrast with §129, which is per **return** |
| §125(a) exclusion, not a deduction | A salary reduction never enters gross income, so it reduces W-2 box 1 and FICA wages and contributes **nothing** to `federalAgiReduction` |

### The carryover cap belongs to the year the money came from

Notice 2013-71 created the carryover at a fixed $500 and Notice 2020-33 raised it to 20
percent of the §125(i) limit "for that plan year". Both phrase it as the maximum unused
amount **from** a plan year carried to the immediately following one, so
`carryoverLimitForPriorYear` is the figure that governs an amount arriving this year, and
`carryoverLimitForThisYear` is what may leave at the end of it. Reading the cap off the
receiving year is the natural mistake and gives a different number in every year the limit
moved.

### Plan year versus tax year

Notice 2012-40 §III holds that "taxable year" in §125(i) means the **plan year** of the
cafeteria plan, and prorates a short plan year by its months. Every annual Revenue
Procedure nonetheless publishes the figure "for taxable years beginning in" the year, and
this package is keyed by tax year throughout, so the two agree exactly for a calendar-year
plan — which is the ordinary case and the default here.

For a non-calendar plan year the governing figure depends on the plan year start date,
which the engine does not hold. Supplying `planYearIsCalendarYear: false` therefore returns
`indeterminate` with an `ERROR` rather than quietly applying the calendar-year figure. Key
the scenario to the tax year in which the plan year begins if you want that year's number.

### COVID-era relief is disclosed, not modelled

§214 of the Consolidated Appropriations Act, 2021 (Notice 2021-15) let a plan carry over
**all** unused amounts from plan years ending in 2020 and 2021, and let a dependent care
program carry over at all, which it otherwise may not. Adopting it was entirely a plan
option. The engine applies the ordinary cap and attaches
`HEALTH_FSA_SECTION_214_RELIEF_NOT_MODELLED` whenever a carryover out of 2020 or 2021 is
computed, so a plan that adopted the relief is visibly under-reported rather than silently
so.

### A bare `FSA` is rejected

`health_fsa`, `healthcare_fsa`, `medical_fsa`, and
`health_flexible_spending_arrangement` all resolve. `FSA` alone does not: it names a
health FSA and a dependent care FSA equally well, and the two carry different limits and
different household aggregation, so it raises `INVALID_ACCOUNT_TYPE` with a message naming
both spellings rather than silently picking one.

Encoded §125 and §129 parameters are verified against the documents that published them —
see [`evidence/fsa-limits/`](evidence/fsa-limits/).

## Dependent care assistance (IRC §129)

§129(a)(2)(A) is a **per-return** amount, which is the single most important
difference from §125(i). Two spouses filing jointly do not get one each.

| Rule | Treatment |
|---|---|
| §129(a)(2)(A) exclusion | Not inflation-adjusted, so it appears in no Revenue Procedure and is cited to the Code. Each year is encoded as its own row, so the 2021 increase and its reversion are both data rather than a rule |
| Married filing separately | The statutory parenthetical amount. Separate returns mean each spouse carries their own halved amount rather than dividing one |
| **2021 only** | ARPA §9632 substituted "$10,500 (half such dollar amount" for taxable years beginning after 2020 and before 2022 — enacted in March 2021, so Rev. Proc. 2020-45 could not carry it |
| **2026 onward** | Pub. L. 119-21 §70404 struck `$5,000 ($2,500` and inserted `$7,500 ($3,750` for taxable years beginning after December 31, 2025. A fixed-dollar substitution: the amount changed, the absence of indexing did not |
| Household sharing | Spouses filing jointly draw on one pool, reported through `sharedLimits` so the constraint is visible. Assistance above it is `includibleInIncome` under §129(a)(2)(B), not silently dropped |
| §129(b)(1) earned income | Applied whenever the caller supplies the figures: the employee's earned income, or for a married employee the lesser of theirs and their spouse's. Absent, the ceiling is the §129(a)(2)(A) amount alone and a `WARNING` says the limitation was not applied |
| Years before 1987 | §129 existed from 1982 but carried **no dollar ceiling** until the Tax Reform Act of 1986 §1163. Those years are `indeterminate` with a null limit; 1981 and earlier, when §129 did not exist at all, are `unavailable` with a zero |
| §129(a)(1) exclusion | Reduces W-2 box 1 and FICA wages and contributes nothing to `federalAgiReduction`, exactly as the §125 and §106(d) exclusions do |

### Why the earned income limitation is here at all

The package's boundary is that it does not *derive* income, not that it ignores
supplied facts. §129(b)(1) is a hard statutory ceiling, so leaving it out
entirely would over-report the exclusion for exactly the taxpayers it was
written for. Both figures are caller-supplied, like every other fact here.

**§129(b)(2) deeming is not modelled.** For a spouse who is a student or
incapable of self-care, §129(b)(2) applies the §21(d)(2) monthly schedule. That
schedule is not encoded, because no primary source for it is committed to this
package's evidence corpus and an unattested figure is never encoded. Asserting
`isStudentOrIncapableOfSelfCare` on the person records that the
`dependentCareEarnedIncome` supplied for them is the deemed amount, and emits a
diagnostic saying the schedule is not applied for you.

**The §129(b)(1) facts live on the person, not the program.** The limitation is
one figure for the return — the employee's own earned income, or for a married
employee the lesser of theirs and their spouse's — so `dependentCareEarnedIncome`
is a `PersonInput` field. While it sat on each account's plan rules, two
dependent care programs on one return could state it differently and the engine
had to report the contradiction as an error; putting it on the person removes the
possibility instead of diagnosing it.

## The §125 / §223 interaction: diagnose, do not enforce

A general-purpose health FSA and an HSA cannot both be right. The engine says
so and **returns the §223 figures the inputs imply, unchanged**.

| Health FSA `purpose` | Effect on the HSA in the same scenario |
|---|---|
| `general_purpose` | `ERROR` `HEALTH_FSA_DISQUALIFIES_HSA_ELIGIBILITY` citing §223(c)(1)(A)(ii) and Rev. Rul. 2004-45. **Every §223(b) figure is unchanged** — the limitation, the prorated amount, the components, the totals |
| `general_purpose` held by the **spouse** | `ERROR` `SPOUSE_HEALTH_FSA_DISQUALIFIES_HSA_ELIGIBILITY`. Rev. Rul. 2004-45 says the result is the same where the arrangement is sponsored by the spouse's employer, because it can reimburse this individual's expenses. Figures again unchanged |
| `limited_purpose` or `post_deductible` | No conflict. An `INFO` records that the arrangement was treated as HSA-compatible |
| **absent** | `ERROR` `HEALTH_FSA_PURPOSE_REQUIRED_FOR_HSA_INTERACTION`, and the §223 limitation is **`indeterminate`** |

The last row is the one that differs, and deliberately. With a stated
`general_purpose` the conflict is *known*, and reporting the caller's own
figures is the whole point: eligible-individual status is caller-supplied
everywhere in this engine, so someone who ended the arrangement mid-year and
supplied the correct eligible months must still get the answer their facts
imply. With the purpose *unstated* nothing about §223 is known — the two
classifications give opposite answers — so a confident number would be the
defect rather than the diagnostic.

Two consequences worth stating:

- **A carryover of general-purpose funds disqualifies the whole receiving plan
  year.** Notice 2013-71 makes the carried amount available for expenses
  incurred during the entire plan year it is carried to, so it is
  general-purpose coverage for that year and not merely until it is spent.
- **A grace period extends the disqualification into the following plan year.**
  Notice 2005-86: coverage during the grace period blocks eligibility until the
  first day of the month after it ends, even at a zero balance. Those months
  fall outside the year being calculated, so it is reported as `INFO` rather
  than folded into the month list.

The account's reported `status` still becomes `indeterminate` when an `ERROR` is
attached — that is the engine's uniform rule, not an enforcement of §223. What
"diagnose, do not enforce" means here is that **no number moves**.

A dependent care FSA never raises this: §129 assistance reimburses dependent
care rather than §213(d) medical expenses, so it is not coverage §223(c)(1)(A)(ii)
reaches.

## Multiple employers

Statutory pools are keyed to match the statute rather than to the taxpayer uniformly:

- **§402(g)(1) elective deferrals** aggregate **per person** across every employer.
- **§415(c) annual additions** apply **per employer**, so unrelated employers carry
  independent limits. Set `annualAdditionsGroupId` on the plan rules to aggregate plans
  of a controlled or affiliated service group under §414(b)/(c)/(m)/(o) and §415(h).
- **§457(b) plan ceilings** apply **per eligible plan**. One `AccountInput` is one plan
  unless accounts share a `section457PlanGroupId` — see
  [One eligible plan, several records](#one-eligible-plan-several-records).
- **Identifier fields** — `employerId`, `annualAdditionsGroupId` and
  `section457PlanGroupId` — must be non-empty strings when supplied; `undefined` and
  `null` both mean absent. A number or an empty string is rejected with
  `INVALID_EMPLOYER_ID` / `INVALID_ANNUAL_ADDITIONS_GROUP_ID` /
  `INVALID_SECTION_457_PLAN_GROUP_ID` rather than coerced, because JavaScript and PHP
  disagree about `0`, `"0"` and `""`, `employerId` selects the wage figure the
  §414(v)(7)(A) test reads, and `section457PlanGroupId` decides which records are one
  eligible plan.
- **§414(v)(7)(A)** Roth catch-up classification tests prior-year FICA wages from the
  **sponsoring employer**, supplied through `priorYearFicaWages(employerId, amount)`.
  The figure is required only where the test can change the answer. §414(v)(7)(A) does
  two things and no more: it makes a catch-up that would have been pre-tax into a
  designated Roth contribution, and — because it allows the catch-up "only if" the
  contribution is a designated Roth one — it withdraws the catch-up from a plan whose
  terms do not offer one. On an account whose employee contributions are designated Roth
  already and whose rules permit a Roth catch-up, neither is possible and the wages are
  not asked for. They **are** asked for on a pre-tax account, on a designated Roth
  account carrying `contributionPreference: "pretax_first"` (which makes the default
  pre-tax, so there is Roth treatment left to force), and on one carrying
  `permitsRothCatchUp: false` (where the catch-up survives below the threshold and
  disappears above it). §402A(e)(1)(A)(i) settles both halves for a pension-linked
  emergency savings account, so one never needs the figure.

  The exemption covers only the catch-up the engine would itself classify. An
  `existingContributions.employeePreTaxCatchUp` the caller reports is a completed
  contribution whose validity §414(v)(7)(A) decides — it stands below the threshold
  and was not a permitted additional elective deferral above it — so an account
  carrying one asks for the wages whatever its Roth character. An existing *Roth*
  catch-up raises no such question and does not. The §402(g)(7) and §457(b)(3)
  special catch-ups are separate provisions that §414(v)(7)(A) does not reach, so
  neither is read here.

  Where those wages *are* supplied and exceed the threshold, an existing pre-tax
  catch-up is not merely unclassified — the supplied facts say it was not a
  contribution §414(v)(1) permitted, since that paragraph applies "only if" the
  additional elective deferrals are designated Roth contributions. The account
  returns `indeterminate` with
  `EXISTING_PRE_TAX_CATCH_UP_ABOVE_ROTH_CATCH_UP_WAGE_THRESHOLD`, and no further
  catch-up is allocated: whether the supplied amount counts against the
  §414(v)(2)(B) limit at all is what is in doubt, so the room above it is not a
  figure to state. The component and its tax effect are retained as supplied
  rather than discarded or recharacterised — the caller stated a statutory
  provenance through the component key, and the `indeterminate` status is what
  marks the figure as unsettled. §457 mutual-exclusivity breaches are handled the
  same way.

  The doubt is pool-wide. The §414(v) limit belongs to the participant, so an
  unresolved $3,000 classification against an $8,000 catch-up limit leaves
  $5,000 guaranteed and up to $8,000 possible for another plan. A sibling whose
  demand fits entirely within the guaranteed room keeps a determinate answer:
  for example, a §457 account limited by $4,000 of compensation can take all
  $4,000. If the uncertainty can change its draw, the account allocates the
  guaranteed amount and returns `indeterminate` with
  `CATCH_UP_ALLOCATION_BLOCKED_BY_UNRECONCILED_EXISTING_PRE_TAX_CATCH_UP`, naming
  the account to fix. The ordinary-deferral completion also reserves the amount
  against applicable base and annual-additions limits. A $10,000 plan annual
  ceiling with $3,000 unresolved therefore permits only $7,000 of new ordinary
  additions across base deferrals, the 403(b) special catch-up, employer amounts,
  and voluntary after-tax contributions. Plan-term-dependent capacity preserves
  that reservation too. It does not reach across pools: §415(a) does not reach an
  eligible deferred compensation plan and §457(b)(2) sets its ceiling from
  §457(e)(15), so a §457 account is unaffected by a qualified plan's unreconciled
  amount, and the reverse.

  §414(v)(6)(C) takes the whole question away where it applies: *"This subsection
  shall not apply to a participant for any year for which a higher limitation
  applies to the participant under section 457(b)(3)."* Subsection means all of
  §414(v), paragraph (7) included, so on a §457(b) account whose participant-wide
  resolution selected the special last-three-years method there is no wage test to
  run and no existing component for it to reject — the amount is reported under
  `SECTION_457_CATCH_UP_RECORDED_UNDER_UNSELECTED_METHOD` and nothing else. It is
  also not charged against a §414(v)(2)(B) limit, so it blocks no sibling.

  It also reaches only accounts the doubt can change. An account with no room
  left for a catch-up — its plan offers none, or its base deferral has already
  consumed the compensation a §414(v)(2)(A) additional elective deferral would
  need — is unaffected, because reconciling the sibling cannot create room there.
  Such an account stays `determinate`. The wages themselves are still asked for
  wherever the account carries an existing pre-tax catch-up, since that question
  is about a contribution already made rather than about room for another.

  `HIGH_WAGE_CATCH_UP_ALLOCATED_AS_ROTH` is reported only where a catch-up was
  actually allocated, because that is what it says. The classification is bounded
  by the plan limit and by compensation but not by the owner's shared §414(v) pool,
  so an account whose plan leaves room can still draw nothing once another plan has
  validly taken the year's whole catch-up — and an account that allocated nothing
  does not announce that its catch-up went in as Roth.

Whether two employers are a single employer for §415 is a legal determination about
ownership, so it is a caller-supplied fact rather than something inferred from the inputs.

## Result semantics

| Field | Meaning |
|---|---|
| `statutoryMaximumAnnualContribution` | Overall monetary legal ceiling when determinable from encoded law and supplied facts. Restrictions the plan document imposes are **not** folded in — they lower `maximumAnnualContributionBasedOnInputs` instead — so a §457(b) plan writing a deferral limit below the §457(e)(15) amount, or a PLESA sponsor setting a §402A(e)(3)(A)(ii) amount below the published figure, lowers what may be contributed without lowering this field |
| `maximumAnnualContributionBasedOnInputs` | Maximum supported by law and supplied plan capabilities/formulas |
| `maximumAdditionalContributionBasedOnInputs` | Remaining supported amount after existing contributions |
| `existingAnnualContribution` | Existing contribution components supplied by the caller |
| `excessContribution` | Supplied amount above the account's determinable statutory ceiling; `null` when that ceiling is indeterminate |
| `planTermDependentCapacity` | Potential space that cannot be allocated without additional plan/employer facts |
| `contributionComponents` | Pretax, Roth, after-tax, employer, IRA, and catch-up components. The statutory source of a catch-up and its tax treatment are independent, so both are recorded: a §457(b)(3) last-three-years catch-up is `special457CatchUp` when pre-tax and `special457RothCatchUp` when made to a designated Roth account — including any PLESA, where §402A(e)(1)(A)(i) makes Roth the only possibility. Both seed the same §457(b)(3) pool when handed back as an existing contribution |
| `federalTaxEffects` | Federal AGI, taxable-income, W-2 box 1, nondeductible, after-tax/Roth, and conversion effects |
| `sharedLimits` | Audit trail showing each statutory pool used by the account. Each entry has three states, not two: `limit` is `null` where the statute's ceiling could not be determined, and `usedBeforeAccount` / `usedByAccount` / `remainingAfterAccount` are `null` where the ceiling **is** known but the draw against it is not. Read the usage fields rather than inferring a draw of zero |
| `diagnostics` | Assumptions, warnings, unavailable rules, and legal references |

`maximumAnnualContributionBasedOnInputs` is a mechanical result, not a contribution recommendation.

## Shared-limit allocation

Accounts are allocated in ascending `priority` and then input order. This makes overlapping limits deterministic.

The engine tracks, among other pools:

- Traditional and Roth IRA contributions per owner.
- Joint-return compensation available for spousal IRAs.
- The owner-level §402(g) elective-deferral limit across applicable 401(k), 403(b), TSP, SARSEP, and SIMPLE sources.
- The owner-level §414(v) age-based catch-up pool.
- A separate §457(b) limit, drawn on by every §457(b) account including a §402A(f)(1)(C)-hosted PLESA.
- §415(c) annual additions per participant and controlled-employer group.
- The owner-level 403(b) 15-years-of-service catch-up pool.
- The 457(b) last-three-years special catch-up.

Use the same `annualAdditionsGroupId` for plans that share one §415(c) controlled-employer limit. Unrelated employers should normally use different group IDs.

## Recognized compensation under §401(a)(17)

When a caller supplies an employer contribution **rate**, the engine first limits plan compensation to the applicable annual recognized-compensation ceiling and then applies the rate. This applies to:

- Employer nonelective formulas.
- Employer matching formulas whose matchable compensation is expressed as a fraction of compensation.
- Common-law employee SEP formulas.
- The plan-rate side of self-employed SEP and qualified-plan formulas.

For a self-employed owner, the maximum percentage contribution is the lesser of:

1. net earnings after the deductible half of self-employment tax multiplied by the reduced self-employed rate; and
2. recognized compensation multiplied by the unreduced plan contribution rate.

The result remains subject to §415(c), plan-document limits, and existing annual additions.

### The OBRA '93 grandfathered governmental ceiling

OBRA '93 §13212(d)(3) preserves the higher pre-OBRA ceiling for an eligible participant in a governmental plan that already indexed its own compensation limitation on July 1, 1993. The IRS publishes that amount annually beside the ordinary one — $535,000 against $360,000 for 2026 — and the engine uses the greater of the two, which is what the statute's "shall not apply to the extent that it would reduce" language directs.

Set `planRules.grandfatheredGovernmentalCompensationLimit` to claim it. The one flag asserts both halves of the rule — that the plan qualifies and that this participant is an "eligible participant" under the pre-1994 participation test — because both are plan-document and service facts outside this package's scope.

For a post-1993 tax year with no published figure, contribution capacity is `indeterminate` with a `GRANDFATHERED_GOVERNMENTAL_COMPENSATION_LIMIT_NOT_PUBLISHED` diagnostic. The statutory maximum and excess contribution are `null`; existing contributions are preserved and no additional contributions are allocated. An affected shared §415(c) pool also has an unknown limit, so companion accounts cannot inherit an ordinary-limit fallback. Before 1994 the relief does not apply and the ordinary limit remains operative. The IRS first published the amount for tax year 1998, so 1994 through 1997 carry `null` rather than an extrapolation.

The compensation ceiling is **not** imposed as an extra dollar cap that prematurely stops an employee’s otherwise valid §402(g) elective deferral. Employee deferrals remain subject to actual compensation, §402(g), catch-up rules, shared pools, and plan terms.

SIMPLE formulas preserve their distinct treatment: the ordinary 3% matching method is based on compensation and deferrals, while the 2% nonelective method and applicable additional nonelective contribution use recognized compensation.

Supplying `expectedEmployerContribution` bypasses formula inference because it represents a known caller-provided employer amount. The amount is still constrained by applicable annual-additions and plan-document ceilings.

## IRA phase-outs and spousal IRAs

The package models:

- The combined traditional/Roth IRA annual contribution limit.
- Age-50 IRA catch-up amounts.
- Roth IRA MAGI phase-outs.
- Traditional IRA active-participant deduction phase-outs.
- The separate phase-out for a noncovered spouse married to a covered participant.
- Married-filing-separately rules, including whether spouses lived together during the year.
- MFJ spousal-IRA compensation sharing.
- Historical one-earner spousal limits.
- The pre-2020 traditional-IRA age-70½ contribution restriction.
- Nondeductible traditional IRA capacity when a deduction is unavailable.
- IRS worksheet-style phase-out rounding and the positive reduced minimum.

Supply the MAGI value applicable to each calculation. The engine does not derive tax-return MAGI from raw income items.

## Catch-up contributions and birth data

Age is generally determined at the end of the tax year. `bornIn(year)` is sufficient for ordinary age-50 and age-60-to-63 catch-up rules; `bornOn(YYYY-MM-DD)` is preferred for legacy age-70½ edge cases.

There is no general pre-1960/post-1960 retirement-account contribution-limit split. The 1960 boundary is primarily associated with Social Security full retirement age, not these contribution limits.

Supported catch-up logic includes:

- Ordinary age-50 catch-up.
- Enhanced age-60-to-63 catch-up beginning in 2025.
- 403(b) 15-years-of-service catch-up, including annual and lifetime residuals.
- Governmental 457(b) age catch-up.
- The 457(b) special last-three-years catch-up, selecting the larger applicable method once per participant rather than combining incompatible methods.
- High-wage Roth catch-up classification using prior-year FICA wages for the sponsoring employer when applicable.

## Choosing between the two §457 catch-ups

A participant may use the age-based §414(v) catch-up or the §457(b)(3)
last-three-years catch-up for a year, never both. 26 CFR §1.457-5(a) states the
individual limitation as the basic annual limitation "plus **either** the age 50
catch-up amount under §1.457-4(c)(2), **or** the special section 457 catch-up
amount under §1.457-4(c)(3), applied by taking into account the combined annual
deferral for the participant for any taxable year under **all eligible plans**",
and §1.457-5(b) aggregates that across the plans of every employer the
participant has served.

So the choice is resolved **once per participant, before any account is
allocated**, from annual ceilings rather than from whatever pool capacity a
given account happens to see:

| | Rule |
|---|---|
| The plan ceilings compared | §1.457-4(c)(2)(ii) applies the special catch-up "if and only if" the plan ceiling counting it "is **larger than**" the plan ceiling counting the age 50 catch-up. Those are the ceilings the statute produces, not the two headline dollar figures. With `D` the §457(e)(15) amount, `C` includible compensation and `U` the prior-year underutilized limitation: the basic ceiling is `B = min(D, C)`; §457(b)(3) makes the special ceiling `S = min(2D, B + U)`, so the special catch-up above the basic ceiling is `min(2D − B, U)` — which equals `min(D, U)` only where compensation does not bind; §414(v)(2)(A)(ii) caps the age-based catch-up at `C − B`. As compensation falls the special amount **grows** and the age-based one **shrinks**, so the two figures can order oppositely to the raw dollar amounts. **Larger than is strict** — an equal §457(b)(3) ceiling leaves §414(v) available, as §414(v)(6)(C) and §457(e)(18) also read |
| Compensation bounds one method, not both | §457(b)(3) provides that the paragraph (2) ceiling "**shall be**" the special amount, replacing the 100-percent-of-includible-compensation bound inside that paragraph rather than reapplying it. §414(v) instead *adds* to the paragraph (2) ceiling and carries its own §414(v)(2)(A)(ii) compensation cap. A salary reduction is of course still bounded by the compensation there is to reduce, so where the special plan ceiling stands above it the difference is reported as `SECTION_457_SPECIAL_CATCH_UP_EXCEEDS_DEFERRABLE_COMPENSATION` (info) and left unfunded — reachable only by a nonelective employer contribution, which this engine allocates no higher than the paragraph (c)(1) ceiling |
| How much, participant-wide | §1.457-5(c): where a participant's plans provide different amounts, the limitation uses "the catch-up amount under whichever plan has the **largest** catch-up amount applicable to the participant" — the largest, not the sum. That applies to each method separately, since every plan bounds each method with its own includible compensation |
| How much, per plan | The participant's entitlement is not every plan's ceiling. §1.457-5(d) Example 2 states both figures for one participant: the individual limitation is $23,000, from Plan Y, while "$22,000 to Plan W and none to any of the other three plans" is separately lawful — W's own ceiling. Each account reports **its own** plan ceiling, and no account absorbs more of the resolved amount than its own plan provides **net of what it already holds** under that provision |
| Which accounts may draw it | §1.457-5(c) again: the special catch-up counts "only to the extent that an annual deferral is made … under an eligible plan as a result of plan provisions permitted under §1.457-4(c)(3)", and §414(v)(6)(A)(ii) reaches only a governmental plan |
| Accounts the year does not offer | Excluded from method resolution and from pool seeding entirely. An account type the year does not offer is not one of the "eligible plans" §1.457-5(b) aggregates, so it cannot select a method, contribute a ceiling, or spend a pool that a valid plan then finds empty. It is reported as `unavailable` with its supplied contributions preserved and diagnosed |
| When the age is unknown | The method itself is unresolved, not merely its size, so no catch-up is allocated under either heading and `BIRTH_YEAR_OR_DATE_REQUIRED_FOR_WORKPLACE_CATCH_UP` is raised where either a new catch-up could reach room **or an existing age/special component still needs classification**. New room is measured after the base deferral is allocated, so an account the basic limitation has already filled asks no age question when it carries no catch-up: an isolated §457(b)-hosted PLESA whose whole §402A(e)(3)(A) room the base deferral takes is fully determinate without a birth date. An existing catch-up is different because age can still decide whether its supplied component key names the method the law selected, even when the account has no room for another dollar. Nor does an age question arise where §414(v)(2)(A)(ii) leaves no compensation for an age-based catch-up at any age, or where a §457(b)(3) ceiling exceeds the largest age-route ceiling the year can produce at any age, which §414(v)(6)(C) settles without the age |

Existing catch-up contributions carry a statutory provenance the caller chose
through the component key, so six invariants are checked on that provenance
before any further catch-up is allocated. None of them reduces to a dollar
total — each is satisfiable by figures sitting under every ceiling in play, so
the ordinary excess test sees nothing. Where one fails, the supplied components
are kept for audit, the affected account is `indeterminate`, and no further
catch-up is allocated on any of that participant's §457 plans: §1.457-5(b)
determines the combined annual deferral on an aggregate basis, so adding the
selected method elsewhere could itself construct the prohibited two-method
combination. Independently determinable base deferrals remain available;
reclassifying an existing component would answer a question only the caller can
answer.

| Existing contributions | Diagnostic |
|---|---|
| Recorded under **both** methods | `SECTION_457_CATCH_UP_METHODS_ARE_MUTUALLY_EXCLUSIVE` (error). §1.457-5(a) permits the basic limitation plus one method, so the pairing breaches it **at any size** — including across two employers' plans, which §1.457-5(b) aggregates |
| Recorded solely under the **unselected** method | `SECTION_457_CATCH_UP_RECORDED_UNDER_UNSELECTED_METHOD` (error). §1.457-4(c)(2)(ii) makes the selection a determination, not an election: the age 50 catch-up "does not apply for any taxable year for which a higher limitation applies" under the special catch-up, and §414(v)(6)(C) says the same from the other side |
| Selected-method total above the participant's amount | `SECTION_457_EXISTING_CATCH_UP_EXCEEDS_PARTICIPANT_LIMIT` (error). §1.457-5(b) determines deferrals "on an aggregate basis" across every employer's plans, so two accounts each within their own ceiling can still exceed the one amount the participant is entitled to |
| Age-based catch-up on a plan that cannot host one | `SECTION_457_AGE_CATCH_UP_NOT_AVAILABLE_ON_PLAN` (error). §414(v)(6)(A)(ii) makes only an eligible **governmental** §457(b) plan an applicable employer plan |
| Special catch-up on a plan providing none | `SECTION_457_SPECIAL_CATCH_UP_NOT_PROVIDED_BY_PLAN` (error). §1.457-5(c) counts it only as a result of plan provisions permitted under §1.457-4(c)(3) |
| Special catch-up above that plan's own amount | `SECTION_457_SPECIAL_CATCH_UP_EXCEEDS_PLAN_AMOUNT` (error), even where the participant is entitled to more elsewhere. Measured on the plan, so two records of one plan each within their own share still trip it together |
| Records of one plan disagreeing about that plan | `SECTION_457_PLAN_GROUP_FACTS_CONFLICT` (error) on every record in the group. The provision, includible compensation, and governmental status must all agree |
| Another of the participant's plans described inconsistently | `SECTION_457_CATCH_UP_BLOCKED_BY_CONFLICTING_PLAN_FACTS` (error). §1.457-5(a) selects the method once across all eligible plans, so the contradiction is not local to the plan that carries it |

### One eligible plan, several records

§1.457-4(c) sets a ceiling for each *plan*; an `AccountInput` is an account. The
two coincide for every §457 account type here but one. §402A(e)(1)(A)(i) creates a
pension-linked emergency savings account as a designated Roth account *within* an
applicable retirement plan, and §402A(f)(1)(C) makes an eligible governmental
§457(b) plan one of its three hosts — so a §457(b)-hosted PLESA and its host are
two records of a single plan, with one plan document, one normal retirement age
and one §457(b)(3) provision.

Give both records the same `planRules.section457PlanGroupId` to say so:

```ts
scenario
  .account("host", "taxpayer", AccountType.GOVERNMENTAL_457B, (account) => {
    account
      .includible457Compensation(400_000)
      .section457PlanGroup("plan-w") // one eligible plan…
      .special457CatchUp({ eligible: true, unusedDeferralsFromPriorYears: 8_000 });
  })
  .account(
    "savings",
    "taxpayer",
    AccountType.GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS,
    (account) => {
      account
        .section457PlanGroup("plan-w") // …stated as two records
        .pensionLinkedEmergencySavingsBalance(0);
    },
  );
```

Within a group:

- the plan's `section457SpecialCatchUp` and `includibleCompensation457` are stated
  **once** and cover every record — §1.457-5(c) recognises the special catch-up as a
  result of *the plan's* provisions, so a provision on the host is the PLESA's too;
- both of the plan's ceilings bind its records **between them**, not one at a time
  — §1.457-4(c)(1)(i)'s annual-deferral ceiling (the lesser of the §457(e)(15)
  amount and 100% of the plan's includible compensation) and §1.457-4(c)(3)(i)'s
  special-catch-up ceiling. A plan whose compensation caps it at $1,000 does not
  host $1,000 per record, and where the participant's largest catch-up comes from
  another plan, this plan's records may still take no more than this plan provides;
- records that describe the plan inconsistently raise
  `SECTION_457_PLAN_GROUP_FACTS_CONFLICT` on each of them and allocate no catch-up
  under either method. Three things must agree, because a group asserts one plan:
  `section457SpecialCatchUp`, `includibleCompensation457`, and whether the plan is
  an eligible **governmental** plan — settled by the account types, and decisive
  under §414(v)(6)(A)(ii) for whether the age 50 method exists at all;
- a contradiction reaches the participant's **other** §457 accounts too. §1.457-5(a)
  selects the method once across all eligible plans, so an unrelated plan whose
  catch-up would differ according to which contradictory record is right is
  reported indeterminate with
  `SECTION_457_CATCH_UP_BLOCKED_BY_CONFLICTING_PLAN_FACTS` rather than settled.

**Absent the key, one `AccountInput` is one eligible plan**, which is the older
contract and remains the default: a host plan's `section457SpecialCatchUp` facts
must then be repeated on the PLESA record for that record to draw the amount.

Account order therefore decides only *where* interchangeable capacity lands,
never which statutory method applies, what each plan's own ceiling is, or what
the participant's aggregate is. §1.457-5(d) Example 2 is committed as a
conformance vector: four plans offering $7,000, $2,000, $8,000 and nothing yield
one participant-wide ceiling of $15,000 + $8,000 = $23,000 for 2006, which is the
figure the regulation itself reaches, while the four accounts report the $22,000,
$17,000, $23,000 and $15,000 their own plans permit.

## Roth conversions and in-plan Roth rollovers

Conversions are separate from contributions and do not consume the annual IRA or elective-deferral limit.

Supported conversion categories are:

- Traditional/SEP/SIMPLE IRA to Roth IRA.
- Qualified plan to Roth IRA.
- In-plan Roth rollover.

For IRA conversions, the engine can allocate aggregate traditional/SEP/SIMPLE IRA basis using Form 8606-style pro-rata treatment. Supply aggregate basis, year-end aggregate IRA value, and other current-year distributions when relevant. Multiple same-year conversion inputs share basis without penny over-allocation.

The package reports gross converted amount, taxable amount, nontaxable basis, AGI increase, and diagnostics. It does not calculate withholding, estimated-tax penalties, five-year holding periods, early-distribution recapture, state tax, or full plan distribution eligibility.

## Calculation status and diagnostics

Possible statuses are:

- `determinate`
- `determinate_with_assumptions`
- `indeterminate`
- `unavailable`
- `ineligible`

### Pre-2002 403(b): the §403(b)(2) exclusion allowance

A 403(b) account for a tax year **1987 through 2001** returns `indeterminate` with
`PRE_2002_403B_EXCLUSION_ALLOWANCE_NOT_APPLIED`, and both its statutory maximum and its
input-supported maximum are `null`.

Before EGTRRA, §403(b)(2) capped the excludable amount at the *exclusion allowance*, and IRS
Publication 571 (2001) computes the maximum amount contributable as the **least** of that
allowance, the §415(c) annual-additions limit, and the §402(g) elective-deferral limit. The
allowance is 20% of includible compensation for the most recent year of service, multiplied by
years of service, reduced by *amounts previously excludable* — a lifetime aggregate over the
participant's service with that employer, which no input supplies. With one of the three
unknown, the least of them cannot be identified, so reporting the lesser of §415(c) and
§402(g) would state a ceiling the omitted term can only lower. The package does not model the
allowance; it declines to answer, exactly as SOURCES.md says it does.

The window closes at 2001 because EGTRRA (Pub. L. 107-16) §632(a)(2)(B) struck §403(b)(2) and
§632(a)(3)(E) struck the §415(c)(4) alternative elections, both applying "to years beginning
after December 31, 2001" (§632(a)(4)). 2002 onward is answerable from §415 and §402(g) alone.
The window opens at 1987 only because 1986 and earlier already return `indeterminate` with
`HISTORICAL_415C_LIMIT_INDETERMINATE`, there being no encoded §415(c) limit at all. Plans
other than 403(b) are untouched: a 2001 401(k) is still `determinate_with_assumptions`.

Do not discard diagnostics. They are part of the calculation contract. A non-error status may still contain warnings about missing plan terms, historical uncertainty, employer aggregation, Roth catch-up classification, or caller assumptions.

## Native TypeScript/PHP parity

The DRY boundary is the statutory data and behavioral specification, not a cross-language runtime dependency:

```text
data/retirement-parameters.json
           │
           ├── generated TypeScript parameter block
           ├── generated PHP parameter block
           └── shared conformance vectors
                         │
                         ├── complete serialized-output parity test
                         └── seeded randomized differential test
```

This gives npm consumers an idiomatic TypeScript package and Packagist consumers an idiomatic PHP package without duplicating annual parameter maintenance.

`npm run test:parity` compares complete serialized output for every conformance vector.
That set is fixed, so `npm run test:fuzz` compares the two engines on randomized scenarios
instead — varying tax year across the supported range, account types, HSA coverage shapes
and monthly patterns, existing contributions, conversions, filing statuses, and
deliberately malformed inputs — and diffs the full output including thrown error codes and
messages. It is deterministic: every run prints its seed, and `--seed=<n>` replays a
failure exactly.

```bash
npm run test:fuzz                            # 5,000 scenarios, random seed
node scripts/fuzz-parity.mjs --seed=1234      # replay
node scripts/fuzz-parity.mjs --cases=50000    # deeper sweep
```

It runs in `npm run verify` and in CI because it is cheap — 10,000 scenarios take under
three seconds, since the PHP side is batched into one process. Nine of the input-validation
divergences fixed in this package were found by it rather than by the vectors.

## Development

```bash
npm ci
npm run validate:data
npm run generate:check
npm run typecheck
npm run test:ts
npm run test:php
npm run test:parity
npm run test:fuzz
npm run verify
```

After changing `data/retirement-parameters.json`:

```bash
npm run generate
npm run verify
```

`npm run generate:check` fails if either native embedded data block differs from canonical JSON. `npm run test:parity` compares the complete TypeScript and PHP result for every shared vector, not merely selected assertions.

See [DESIGN.md](DESIGN.md), [SOURCES.md](SOURCES.md), and [CONTRIBUTING.md](CONTRIBUTING.md) before changing legal parameters or calculation semantics.

## Deliberate exclusions

The package does not calculate:

- State income-tax treatment.
- HRAs of every kind — standard, ICHRA, EBHRA, QSEHRA, suspended, retiree-only — even where they interact with §223 exactly as a health FSA does. Health FSAs under §125(i), including the carryover, *are* modelled.
- Archer MSAs themselves. The §220 limitation is not calculated, so an amount supplied as `persons[].archerMsaContributions` is taken as stated and never tested against it. The HSA §223(b)(4)(A) and §223(b)(5)(B)(i) reductions *are* applied, because both take an amount paid rather than an Archer limitation.
- Cafeteria plan qualification and nondiscrimination testing under §125(b)–(d), the §414(b)/(c)/(m) controlled-group determination that §125(g)(4) applies to the health FSA limit, the Notice 2012-40 proration of a short plan year, and the uniform-coverage and run-out-period mechanics.
- The §214 relief of the Consolidated Appropriations Act, 2021. It is entirely a plan option; a carryover computed out of 2020 or 2021 carries a diagnostic saying so.
- Adoption assistance under §137, commuter benefits under §132(f), and educational assistance under §127.
- The §21 dependent care **credit**, and the §21(c) interaction whereby §129 exclusions reduce that credit's expense base. The §129 exclusion is calculated; the credit is not.
- The §21(d)(2) deemed-earned-income schedule that §129(b)(2) applies to a student or incapacitated spouse. The §129(b)(1) limitation itself *is* applied, from the earned income supplied on `planRules.dependentCareFsa`.
- Whether a dependent care program meets the §129(d) written-plan and nondiscrimination requirements, the §129(c) denial for amounts paid to a related individual, and whether the individuals cared for qualify.
- The §408(d)(9)(C) once-per-lifetime limitation on a qualified HSA funding distribution and the separate §408(d)(9)(D) testing period. The §223(b)(4)(C) reduction itself *is* applied, from the amount supplied as `persons[].qualifiedHsaFundingDistributions`, which is taken as stated.
- The retirement savings contributions credit.
- Required minimum distributions or distribution penalties.
- Plan eligibility, vesting, loans, or distributions generally.
- ADP, ACP, coverage, top-heavy, or other nondiscrimination testing.
- Employer controlled-group ownership from raw entity records.
- Full payroll, self-employment tax, or tax-return MAGI.
- The pre-2002 §403(b)(2) maximum exclusion allowance and the §415(c)(4) alternative elections. Both are diagnosed and the affected years return `indeterminate`; neither is computed.
- Defined-benefit or cash-balance actuarial funding, and the participant-specific §415(b)(2) and §415(b)(5) adjustments to the annual benefit limit. The flat §415(b)(1)(A) figure itself *is* reported.
- Everything about a pension-linked emergency savings account except its §402A(e)(3)(A) contribution ceiling and the pools that ceiling feeds: the §402A(e)(2) eligibility test, which turns on §414(q) highly-compensated-employee status and the plan's own age and service terms; the §402A(e)(4) automatic contribution arrangement; the §402A(e)(5) participant disclosures; the §402A(e)(7) withdrawal right and the §402A(e)(8) treatment on termination; and the §402A(e)(12) anti-abuse procedures. All three §402A(f)(1) hosts are modelled, the governmental §457(b) one as its own account type. §402A(e)(9), which orders excess deferrals distributed under §402(g)(2)(A) out of the emergency account first, is not implemented at all — no excess-deferral ordering is — and its reach is in any case unsettled for a §457(b)-hosted account: it speaks of "any pension-linked emergency savings account of the participant", while a §457(b) deferral is not among the elective deferrals §402(g)(3) enumerates and so can produce no §402(g)(2)(A) excess of its own. No regulation or notice addresses the cross-plan case.
- Investment returns, retirement sufficiency, or withdrawal planning.

## License

MIT. See [LICENSE](LICENSE).
