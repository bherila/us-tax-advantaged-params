# Design and Calculation Semantics

## 1. Objective and boundary

The library answers a bounded question:

> Given a tax year, filing status, people, compensation/MAGI facts, retirement accounts, plan capabilities, existing contributions, and Roth conversions, what annual contribution capacity can be determined, how is it allocated among shared statutory limits, and what immediate federal income effects follow?

The engine favors explicit uncertainty over false precision. When a universal monetary result cannot be determined from encoded law and caller facts, it returns `indeterminate` or plan-term-dependent capacity with diagnostics.

It does not prepare a tax return, administer a plan, determine controlled-group ownership, perform nondiscrimination testing, calculate state tax, or produce an actuarial pension valuation.

## 2. Native dual-runtime architecture

The project has two native single-file engines:

- `src/USTaxAdvantagedParams.ts`
- `php/src/USTaxAdvantagedParams.php`

Annual law data lives in `data/retirement-parameters.json`. `scripts/generate.mjs` replaces marked generated blocks in both engines.

The algorithms remain native rather than generating PHP from TypeScript or requiring one runtime to invoke the other. Semantic parity is enforced through:

1. Native unit tests in each language.
2. Shared language-neutral conformance vectors.
3. `scripts/check-parity.mjs`, which compares complete serialized results.

The DRY boundary is shared law data and behavioral fixtures, not a cross-language runtime dependency.

## 3. Scenario model

A scenario contains one tax year, one filing status, people, retirement accounts, and optional Roth conversions.

Each account has an owner. Employer-sponsored accounts may also have an employer ID and an `annualAdditionsGroupId`. Priority determines allocation order where accounts compete for a shared pool.

A person may provide:

- birth year or exact birth date;
- IRA compensation, W-2 compensation, and self-employment net earnings;
- Roth IRA, traditional IRA deduction, and historical conversion MAGI;
- employer-plan coverage;
- prior-year FICA wages by employer;
- aggregate traditional/SEP/SIMPLE IRA basis and year-end value.

The engine does not derive these concepts from raw tax-return or payroll records. The caller supplies the applicable values.

## 4. Calculation pipeline

1. Validate and normalize aliases, money values, rates, IDs, people, accounts, and conversions.
2. Load the exact annual parameter row.
3. Derive account traits and availability.
4. Initialize owner, household, employer-group, and special-catch-up pools.
5. Seed pools with existing contributions.
6. Sort accounts by priority and input order.
7. Allocate components against all applicable pools.
8. Calculate Roth conversions separately from contributions.
9. Derive account and scenario federal tax effects.
10. Aggregate diagnostics and totals.

Monetary outputs are rounded to cents, and allocation is deterministic.

## 5. Shared statutory pools

| Pool | Aggregation boundary | Principal use |
|---|---|---|
| IRA contribution | Owner | Traditional and Roth IRAs share one annual limit |
| Spousal IRA compensation | MFJ household | Combined compensation available to support both spouses' IRA contributions |
| §402(g) elective deferral | Owner | Applicable 401(k), 403(b), TSP, SARSEP, and SIMPLE sources |
| §414(v) age catch-up | Owner | Applicable age-based catch-up contributions |
| §457(b) | Owner, separate from §402(g) | Governmental and tax-exempt-organization eligible plans |
| §415(c) annual additions | Owner and controlled-employer group | Employee and employer defined-contribution additions, generally excluding catch-up |
| 403(b) 15-year catch-up | Owner | Shared across eligible 403(b) accounts |
| 457(b) special catch-up | Owner | Last-three-years special catch-up |

Plans of the same controlled employer should use the same `annualAdditionsGroupId`. Unrelated employers should normally use different IDs.

## 6. Section 401(a)(17) recognized compensation

`planCompensation` is the compensation recognized by supplied plan facts. For employer allocation formulas, the engine then applies:

```text
recognized compensation = min(plan compensation, annual §401(a)(17) limit)
```

when a statutory compensation limit is encoded for the year.

The capped amount is used before multiplying by:

- `employerNonelectiveRate`;
- the compensation fraction in an inferred matching formula;
- the common-law employee SEP contribution rate;
- the unreduced plan-rate side of a self-employed formula.

A caller-provided `expectedEmployerContribution` is treated as a known amount rather than recomputed. It remains constrained by applicable annual-additions and plan-document limits.

### 6.1 Self-employed percentage formula

For a self-employed participant, simply applying the reduced rate to `min(net earnings, §401(a)(17) compensation)` is not always correct. The engine applies both worksheet ceilings:

```text
lesser of:
  net earnings after the deductible half of SE tax × reduced rate
  recognized compensation × unreduced plan rate
```

The result is then constrained by §415(c), existing additions, and any lower plan-document limit.

### 6.2 Elective-deferral distinction

The §401(a)(17) limit is not an extra dollar ceiling that halts an otherwise valid employee elective deferral when year-to-date pay crosses the threshold. Employee deferrals remain constrained by actual compensation, §402(g), catch-up limits, shared pools, and plan terms.

### 6.3 SIMPLE distinction

The SIMPLE 3% matching formula and 2% nonelective formula have distinct compensation treatment. The implementation uses compensation and deferrals for the ordinary match, and recognized compensation for the nonelective and applicable additional-nonelective calculations.

## 7. IRA phase-outs

The annual row carries separate ranges for:

- a covered participant's traditional IRA deduction;
- a noncovered spouse married to a covered participant;
- direct Roth IRA contributions.

The engine applies filing status and whether an MFS taxpayer lived with the spouse. It uses IRS worksheet-style reduction, upward rounding to the encoded increment, and the encoded positive reduced minimum. Contribution capacity, deductible amount, and Roth eligibility remain separate outputs.

## 8. Catch-up ordering and birth data

Age is generally determined at year-end. Birth year is sufficient for ordinary age-50 and enhanced age-60-to-63 catch-up; exact birth date is preferred for the historical age-70½ restriction.

The engine distinguishes:

- ordinary age-50 catch-up;
- enhanced age-60-to-63 catch-up beginning in 2025;
- 403(b) 15-years-of-service catch-up;
- governmental 457(b) age catch-up;
- the 457(b) last-three-years special catch-up, compared with rather than stacked on incompatible age catch-up;
- high-wage Roth catch-up classification by prior-year FICA wages for the sponsoring employer when applicable.

There is no general retirement-account contribution-limit split at birth year 1960.

## 9. Roth conversions

Conversions are independent transactions and do not consume annual contribution limits.

IRA basis is allocated across aggregate traditional/SEP/SIMPLE IRA balances under a Form 8606-style pro-rata model. Multiple conversions share aggregate basis with deterministic cent rounding and no penny over-allocation.

Qualified-plan conversions accept basis in the converted amount. Historical in-plan rollover availability is diagnosed separately from taxability.

The engine does not model withholding, estimated taxes, state conformity, five-year periods, recapture rules, or full distribution eligibility.

## 10. Determinacy and diagnostics

Statuses are:

- `determinate`
- `determinate_with_assumptions`
- `indeterminate`
- `unavailable`
- `ineligible`

`planTermDependentCapacity` preserves unused statutory space when employer contribution or after-tax capability is unknown. `excessContribution` reports the supplied amount above an account's determinable statutory ceiling; it is `null` when that ceiling is indeterminate. Diagnostics explain assumptions, missing facts, unavailable provisions, and legal references.

## 11. Federal tax effects

The engine classifies immediate federal effects rather than preparing a return:

- pretax salary-deferral W-2 box 1 reduction;
- current federal AGI/taxable-income reduction;
- self-employed retirement deduction;
- deductible and nondeductible IRA amounts;
- Roth and voluntary after-tax contributions;
- taxable Roth-conversion income.

Ordinary pretax salary deferrals are not assumed to reduce Social Security or Medicare wages. State tax is excluded.

## 12. Historical data policy

The dataset begins in 1975 and is contiguous through its declared maximum year. The validator requires canonical formatting, one row per declared year, required fields, valid ranges, coherent SEP rates, unique primary-source records, and valid conformance vectors.

A new year must be added from primary authority. The package never silently reuses a prior year or inflation-adjusts an unannounced future value.

Legacy plan rules that cannot be represented by a universal amount produce an indeterminate result instead of a modernized approximation.

## 13. Release invariants

A release must satisfy:

1. Canonical data validation.
2. Generated-block drift checking.
3. Strict TypeScript typechecking.
4. TypeScript unit and conformance tests.
5. PHP syntax, unit, and conformance tests on PHP 8.2 through 8.5.
6. Complete TypeScript/PHP output parity.
7. ESM and CommonJS import smoke tests.
8. Manifest and package-content validation.
9. A clean npm dry-run package listing.

`npm run verify` executes local validation and writes `VALIDATION.md`, `RELEASE_STATUS.md`, and `validation-status.json`.
