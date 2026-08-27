# usa-retirement-account-parameters

[![CI](https://github.com/bherila/usa-retirement-account-parameters/actions/workflows/ci.yml/badge.svg)](https://github.com/bherila/usa-retirement-account-parameters/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

`usa-retirement-account-parameters` is a dependency-free calculation engine for historical and current U.S. retirement-account contribution parameters. It calculates account-level and household-level contribution capacity, IRA phase-outs, shared statutory limits, federal income effects, and Roth-conversion taxability.

The repository contains two native implementations with the same behavior:

- **TypeScript** for npm, exported as `USARetirementAccountParameters`.
- **PHP 8.5+** for Packagist, in the `USARetirementAccountParameters` namespace.

Annual legal parameters are maintained once in `data/retirement-parameters.json` and generated into each single-file runtime. Shared conformance vectors and a full-output parity check keep the TypeScript and PHP engines synchronized.

> **Tax-software scope, not tax advice.** This package calculates statutory parameters from caller-supplied facts. It does not determine whether a plan document permits a contribution, perform ERISA nondiscrimination testing, calculate self-employment tax, replace Form 8606, provide an actuarial valuation, or prepare a tax return. Review material results against the governing plan document and current primary authority.

## Supported tax years

The encoded range is **1975 through 2026**. The package does not extrapolate a future year. Calling a year outside the range throws `UnsupportedTaxYearError` in TypeScript or `UnsupportedTaxYearException` in PHP.

The 1975 starting point corresponds to the first generally available IRA contribution year. Some early employer-plan years cannot be reduced to a universal modern dollar ceiling from tax year alone. In those cases the engine returns an explicit `indeterminate` status and diagnostic rather than inventing a value.

```ts
USARetirementAccountParameters.supportedTaxYears();
// { minimum: 1975, maximum: 2026 }
```

## Installation

### npm

```bash
npm install usa-retirement-account-parameters
```

The npm package provides ESM, CommonJS, and TypeScript declarations and supports Node.js 20 or later.

### Composer / Packagist

```bash
composer require bherila/usa-retirement-account-parameters
```

The PHP package requires PHP 8.5 or later and loads the native single-file implementation through Composer.

## TypeScript builder example

```ts
import USARetirementAccountParameters, {
  AccountType,
  ConversionType,
  FilingStatus,
} from "usa-retirement-account-parameters";

const result = USARetirementAccountParameters.forTaxYear(2026)
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
const scenario = USARetirementAccountParameters.forTaxYear(2026)
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

use USARetirementAccountParameters\AccountType;
use USARetirementAccountParameters\FilingStatus;
use USARetirementAccountParameters\PersonBuilder;
use USARetirementAccountParameters\RetirementAccountBuilder;
use USARetirementAccountParameters\USARetirementAccountParameters as RetirementParameters;

$result = RetirementParameters::forTaxYear(2026)
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
        static function (RetirementAccountBuilder $account): void {
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
const result = USARetirementAccountParameters.calculate({
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

## Account coverage

| Family | Account types |
|---|---|
| Individual retirement arrangements | Traditional IRA, Roth IRA, rollover IRA, payroll-deduction IRA, deemed traditional/Roth IRA, inherited traditional/Roth IRA |
| Small-employer arrangements | SEP IRA, Roth SEP IRA, SIMPLE IRA, Roth SIMPLE IRA, grandfathered SARSEP |
| Qualified elective plans | Traditional/Roth 401(k), Solo/Roth Solo 401(k), SIMPLE/Roth SIMPLE 401(k), starter 401(k) |
| Tax-sheltered annuities | Traditional/Roth 403(b), safe-harbor deferral-only 403(b) |
| Deferred compensation | Governmental/Roth governmental 457(b), nongovernmental eligible 457(b), 457(f) |
| Federal plan | Traditional and Roth TSP |
| Employer-only defined-contribution plans | 401(a), profit-sharing, money-purchase, Keogh, ESOP |
| Pension arrangements | Defined-benefit and cash-balance plans |

Defined-benefit and cash-balance contributions are deliberately returned as `indeterminate`; their funding requires the plan formula, census, assets, actuarial assumptions, and funding rules.

## Result semantics

| Field | Meaning |
|---|---|
| `statutoryMaximumAnnualContribution` | Overall monetary legal ceiling when determinable from encoded law and supplied facts |
| `maximumAnnualContributionBasedOnInputs` | Maximum supported by law and supplied plan capabilities/formulas |
| `maximumAdditionalContributionBasedOnInputs` | Remaining supported amount after existing contributions |
| `existingAnnualContribution` | Existing contribution components supplied by the caller |
| `planTermDependentCapacity` | Potential space that cannot be allocated without additional plan/employer facts |
| `contributionComponents` | Pretax, Roth, after-tax, employer, IRA, and catch-up components |
| `federalTaxEffects` | Federal AGI, taxable-income, W-2 box 1, nondeductible, after-tax/Roth, and conversion effects |
| `sharedLimits` | Audit trail showing each statutory pool used by the account |
| `diagnostics` | Assumptions, warnings, unavailable rules, and legal references |

`maximumAnnualContributionBasedOnInputs` is a mechanical result, not a contribution recommendation.

## Shared-limit allocation

Accounts are allocated in ascending `priority` and then input order. This makes overlapping limits deterministic.

The engine tracks, among other pools:

- Traditional and Roth IRA contributions per owner.
- Joint-return compensation available for spousal IRAs.
- The owner-level §402(g) elective-deferral limit across applicable 401(k), 403(b), TSP, SARSEP, and SIMPLE sources.
- The owner-level §414(v) age-based catch-up pool.
- A separate §457(b) limit.
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
- The 457(b) special last-three-years catch-up, selecting the larger applicable method rather than combining incompatible methods.
- High-wage Roth catch-up classification using prior-year FICA wages for the sponsoring employer when applicable.

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
                         └── complete serialized-output parity test
```

This gives npm consumers an idiomatic TypeScript package and Packagist consumers an idiomatic PHP package without duplicating annual parameter maintenance.

## Development

```bash
npm ci
npm run validate:data
npm run generate:check
npm run typecheck
npm run test:ts
npm run test:php
npm run test:parity
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
- The retirement savings contributions credit.
- Required minimum distributions or distribution penalties.
- Plan eligibility, vesting, loans, or distributions generally.
- ADP, ACP, coverage, top-heavy, or other nondiscrimination testing.
- Employer controlled-group ownership from raw entity records.
- Full payroll, self-employment tax, or tax-return MAGI.
- Defined-benefit or cash-balance actuarial funding.
- Investment returns, retirement sufficiency, or withdrawal planning.

## License

MIT. See [LICENSE](LICENSE).
