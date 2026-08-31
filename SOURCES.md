# Primary Authorities and Data Provenance

## Source policy

Retirement parameters are maintained from primary federal sources whenever available. The canonical machine-readable source list is embedded in `data/retirement-parameters.json` and exposed at runtime through `USTaxAdvantagedParams.sourceMetadata()`.

Source metadata documents provenance; it is not fetched at runtime. Calculations are deterministic and network-free.

## Core annual-limit sources

- **IRS Notice 2025-67 / Internal Revenue Bulletin 2025-49** — 2026 retirement-plan and IRA cost-of-living adjustments, including §402(g), IRA, SIMPLE, catch-up, §415(c), §401(a)(17), SEP eligibility, and phase-out figures.  
  `https://www.irs.gov/pub/irs-irbs/irb25-49.pdf`

- **IRS Notice 2024-80 / Internal Revenue Bulletin 2024-47** — 2025 retirement-plan and IRA cost-of-living adjustments.  
  `https://www.irs.gov/pub/irs-irbs/irb24-47.pdf`

- **IRS Cash or Deferred Arrangements manual** — historical elective-deferral and related qualified-plan limitation tables and mechanics.  
  `https://www.irs.gov/pub/irs-tege/codas.pdf`

- **IRS SEP/SARSEP Audit Techniques** — SEP/SARSEP historical and operational limits.  
  `https://www.irs.gov/pub/irs-tege/epche1303.pdf`

- **IRS Statistics of Income Bulletin describing early IRA law** — historical 1981-and-earlier and 1982 IRA limits.  
  `https://www.irs.gov/pub/irs-soi/83rpsumbul.pdf`

- **U.S. Department of Labor 401(k) history** — contextual history of 401(k) plans and their development.  
  `https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/401k-plans`

## Health savings account sources (IRC §223)

HSA dollar amounts are published in an annual **Revenue Procedure**, not in the retirement
cost-of-living notice, so they are cited and verified separately.

- **Rev. Proc. 2025-19** — 2026 HSA contribution limits and HDHP minimum deductible and
  out-of-pocket maximum. Earlier years are cited per-year in
  `evidence/hsa-limits/primary-values.json`, with the document for every year 2004-2026
  committed under `evidence/hsa-limits/sources/` and fixed by `SHA256SUMS.txt`.

- **IRC §223** — the statute itself, for the §223(b)(3)(B) age-55 additional contribution.
  That amount is a fixed statutory table rising from $500 for 2004 to $1,000 for 2009 and
  after. It is **not** inflation-adjusted, which is why the annual Rev. Procs are silent on
  it and it is cited to the Code rather than to a Rev. Proc.

- **Tax Relief and Health Care Act of 2006** — §303 removed the §223(b)(2) cap that limited
  the monthly contribution to 1/12 of the *lesser* of the plan's annual deductible and the
  dollar amount, and §305 added the §223(b)(8) last-month rule, both effective for taxable
  years beginning after 2006.

- **Medicare Prescription Drug, Improvement, and Modernization Act of 2003** — added §223,
  effective for taxable years beginning after 2003, which is why HSA coverage starts at 2004.

One caution specific to these documents: **Rev. Proc. 2018-18 was superseded mid-year.** It
set the 2018 family limit at $6,850; Rev. Proc. 2018-27 restored $6,900. The encoded value is
$6,900, and both documents are committed so the sequence is auditable.

## Section 401(a)(17) employer-formula authorities

- **IRS Notice 2001-56** states that §401(a)(17) limits annual compensation used to determine allocations under a defined-contribution plan and discusses the effective date of the EGTRRA compensation-limit increase.  
  `https://www.irs.gov/pub/irs-drop/n-01-56.pdf`

- **IRS Employee Plans News, Fall 2009, “When Limits Collide, Which One Wins?”** distinguishes §401(a)(17), §415(c), and §402(g). It describes the compensation cap for plan contributions while explaining why the cap should not be applied as an extra cutoff preventing an employee from completing the annual elective-deferral amount.  
  `https://www.irs.gov/pub/irs-tege/fall09.pdf`

- **IRS Publication 535 (2001), self-employed qualified-plan worksheet** demonstrates that self-employed contribution calculations compare the reduced-rate net-earnings amount with the annual compensation ceiling multiplied by the unreduced plan rate.  
  `https://www.irs.gov/pub/irs-prior/p535--2001.pdf`

- **IRS SARSEP Fix-it Guide** describes SEP/SARSEP total contribution limits as the lesser of the annual dollar limit and the applicable percentage of compensation, with compensation considered subject to the annual limit.  
  `https://www.irs.gov/retirement-plans/sarsep-fix-it-guide-total-contributions-employee-elective-deferrals-and-nonelective-employer-contributions-exceeded-the-maximum-legal-limits`

## IRA phase-outs and rounding

Annual IRA contribution and phase-out values are encoded from the applicable IRS annual adjustment notices and IRA publications. The calculation follows the IRS reduced-contribution worksheet pattern: determine the reduction fraction, subtract it from the otherwise available contribution, round the result upward to the specified increment, apply the positive reduced minimum when applicable, and subtract other IRA contributions sharing the annual limit.

## Historical confidence policy

Historical tax law is not uniform across the full 1975–2026 range. Early salary-reduction arrangements, legacy 403(b) exclusion allowances, plan-document-specific limits, and actuarial pension funding cannot always be represented by one universal amount. The engines return diagnostics and an indeterminate result where the data does not support a precise answer.

A historical row must not be added solely from a secondary summary when an IRS bulletin, publication, notice, regulation, statute, or Department of Labor source is reasonably available.

## Annual update checklist

For each new tax year:

1. Obtain the final IRS cost-of-living adjustment notice or revenue procedure.
2. Update all relevant limit, catch-up, compensation, SEP/SIMPLE, 457(b), starter-plan, and IRA phase-out fields.
3. Add the primary source to the canonical source list.
4. Run `npm run generate`.
5. Add conformance vectors for changed rules and boundary values.
6. Run `npm run verify` under supported Node and PHP versions.
7. Review the generated diff in both runtime files; only generated data blocks should change for a data-only annual update.
8. Update the package version as appropriate.

## Legal-change policy

A statutory or regulatory change that affects algorithmic behavior requires more than a data-row update. It should include a primary authority, a design note covering aggregation/effective date/transition relief/plan dependencies, native tests in both languages, shared conformance vectors, full-output parity, and migration notes when serialized contracts change.
