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
| 457(b)(2) plan ceiling | Owner and §457 plan group | The §1.457-4(c)(1)(i) ceiling of one eligible plan — the lesser of the §457(e)(15) amount and 100% of that plan's includible compensation |
| 457(b)(3) plan ceiling | Owner and §457 plan group | The §1.457-4(c)(3)(i) ceiling of one eligible plan, bounding what its records absorb between them |
| 457(e)(5) includible compensation | Owner and §457 plan group | The salary a plan's records have between them to reduce — the only bound on a §457(b)(3) catch-up, which replaces the paragraph (2) 100% term rather than reapplying it. Spent by participant deferrals only |

Plans of the same controlled employer should use the same `annualAdditionsGroupId`. Unrelated employers should normally use different IDs.

The owner-level and group-level §457 pools are pairs, and the distinction is between the
statute's two levels. §1.457-5(b) aggregates the annual deferral across every eligible
plan and §1.457-5(c) gives the participant the largest special catch-up any one plan
provides — those are the owner pools. §1.457-4(c)(1)(i) and §1.457-4(c)(3)(i) set each
*plan's* own ceilings — those are the group pools.

Records sharing a `section457PlanGroupId` are one eligible plan — the case that matters is
a §402A(f)(1)(C) pension-linked emergency savings account and its host — so the plan's
§457(b)(3) provision and its §457(e)(5) includible compensation are stated once, and both
of its ceilings bind those records together rather than each. Absent the key each account
is its own eligible plan.

A group asserts one plan, so four things must agree across its records: the §457(b)(3)
provision, includible compensation, whether it is an eligible governmental plan (which the
account types settle, and which §414(v)(6)(A)(ii) makes decisive for the age 50 method),
and the sponsoring `employerId` (which §414(v)(7)(A) reads the wage figure from). Records
that disagree are diagnosed rather than reconciled.

Because §1.457-5(a) selects the method once for the participant across all plans, a
contradiction in one plan can also leave the participant's *other* §457 accounts without a
settled catch-up — but only where it actually decides something. The resolution reads four
things off a plan's facts: the §414(v) capacity the plan offers, the largest such capacity
the year could give it, its §457(b)(3) capacity, and whether its existing catch-ups sit
outside what it provides. Every reading the contradiction leaves open is evaluated, and
where all of them produce the same four the contradiction stays on its own records: those
are still indeterminate, and every other plan is answered normally. Two records disagreeing
about includible compensation at $100,000 and $200,000 contradict each other, but in a year
whose §457(e)(15) amount is $24,500 both readings give the same ceiling and the same
catch-up, so nothing else turns on which is right. Governmental status is the exception and
always propagates: it is settled by each record's own account *type*, so the reading in
which the plan is governmental is not one a ceiling can be computed under for a record
whose type says otherwise.

Method selection and existing-contribution attribution are separate dependencies.
Sponsor disagreements can leave the method unchanged while changing whether an
existing pre-tax age catch-up qualifies under §414(v)(7)(A). Attribution evaluates
the supplied sponsor alternatives, widens both the participant and plan base
pools for possible ordinary treatment, and preserves the correlated catch-up
uncertainty. Plan allocations use the guaranteed endpoint of those intervals;
where the interval can change an account's allocation, its result is indeterminate.
Sponsors that all give the same wage treatment do not create this uncertainty.

The plan retains an immutable total of existing salary deferrals. That total is
checked against plan compensation, independently of its base and special ceilings,
so splitting an already excessive salary deferral among records cannot hide it.
The check runs on both the normal allocation path and the PLESA early-return path.

The §457(e)(5) pool is spent by the participant's own deferrals and not by nonelective
employer contributions. Those are annual deferrals under §1.457-4(a) and are charged to the
plan's §457(b)(2) ceiling, but they reduce no salary: §457(e)(5) takes includible
compensation from §415(c)(3), whose subparagraph (D) adds back only amounts deferred "at
the election of the employee", and §414(v)(2)(A)(ii) caps a catch-up at compensation over
"any other elective deferrals".

Two things are deliberately **not** group invariants. `planDocumentEmployeeDeferralLimit`
carries the sponsor's §402A(e)(3)(A)(ii) amount on a PLESA record and a plan-document
deferral limit elsewhere, so its meaning is per-record; and a lower value can only reduce
an allocation, never enlarge one. The Roth and contribution-preference flags likewise
differ legitimately, since one plan may hold both a pre-tax and a designated Roth account.

The internal `Section457Plan` state (a native associative structure in PHP) owns
its member records, resolved fact views, cached ceilings, catch-up capacities,
and all four resource balances. It is constructed once before participant-wide
method selection. Account lookup points to that plan; it does not own another
copy of its balances. Contradictory inputs retain per-member fact and ceiling
views for the existing diagnostics, within the same plan state.

The fourth balance is the full basic-plus-special plan ceiling. Ordinary and
special contributions both consume it, so ordinary overages reduce the remaining
special capacity. Its usage does not depend on which of those two component
labels ultimately applies. During the special period, an ordinary deposit above
the basic portion does not itself invalidate the record or block special room:
the excess diagnostic compares ordinary plus special deposits with the combined
ceiling. True combined excess and invalid catch-up provenance still block further
catch-up. This must hold even when every member already contains deposits.
Ordinary employee draws also consult the salary
balance before allocation, including salary already deferred as a special catch-up.

When contradictory plan facts leave existing special contributions partly or
wholly outside a permitted special allowance, the maximum possibly ordinary
portion is attributed once per plan to both participant and plan base pools.
Matching uncertainty IDs preserve its correlation with the special pools; the
full plan ceiling and salary usage remain unchanged by that classification.
Internal plan keys use UTF-8 byte lengths consistently in both runtimes.

Participant method selection reads the plans' capacities. Allocation reads the
same cached ceilings and continues in global ascending priority, then input
order; it never allocates a whole group together. One contribution-classification
function charges plan resources for both supplied contributions and new
allocations. Ordinary employee deferrals spend base and salary, employer deposits
spend base only, special catch-ups spend special and salary, and age catch-ups
spend salary. Invalid employee after-tax amounts retain their existing base-only
accounting and diagnostics. The structural invariant suite exercises record
splitting, owner isolation, interleaved allocation order, existing versus new
deposits, and replaying completed allocations as existing contributions in both
runtimes. These characterize established behavior rather than changing it.

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

`npm run verify` executes the full local gate. `npm run validate:release` regenerates
`VALIDATION.md`, `RELEASE_STATUS.md`, and `validation-status.json`.

## Coherent HSA coverage completions

HSA recovery evaluates complete spouse schedules through the existing native
initializer, including Archer reductions, both Notice 2008-52 candidates and
existing-contribution seeding. It then allocates only the established owner's
accounts in normal priority order. The source spouse remains indeterminate and
receives no hypothetical additional allocation.

Recovery requires identical account contribution amounts, shared-limit records,
last-month candidate selection and testing-period state across all completions.
Already-nullable audit fields are intersected: a differing figure becomes null.
Cached outcomes retain the invariant owner capacities and aggregate counted
contributions after each allocation. The refused spouse's numerical usage model
must also agree across completions when that spouse has existing contributions.
Installing those numerical facts and refreshing the ordinary interval model
keeps later accounts' shared-pool audits current, including marginal draws with
no scalar value. Source status and diagnostics remain unresolved; candidate
pool identities are never invented or transplanted.

A complete supplied coverage statement and its deductible are one correlated
variant. An incomplete statement retains its explicit eligible months. An entirely
unknown schedule with fixed annual deductible operands, or after their 2006
repeal, is enumerated by counts of no coverage, self-only and
family coverage within each January–November class having the same established
spouse tier. These are all permutation orbits, not sampled cases: a class of n
months has (n + 1)(n + 2) / 2 representatives. December forms its own class because
it determines the full-year candidate and testing period. All other current HSA
operands are annual scalars; FSA interaction facts are annual diagnostics rather
than monthly eligibility overrides. Any future month-dependent operand must join
the equivalence-class key. A missing capped-year deductible is continuous and
therefore remains indeterminate instead of being approximated by a finite sample.
