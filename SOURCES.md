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

- **26 U.S.C. §402(g)(7)** — statutory annual, lifetime, and service-based limits for the special 403(b) 15-year catch-up.
  `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section402&num=0&edition=prelim`

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

## Flexible spending arrangement sources (IRC §125 and IRC §129)

Two statutes with two different publication habits. The §125(i) health FSA
salary-reduction limit is indexed and published in the **general annual
inflation-adjustment Revenue Procedure** — the one carrying the standard
deduction, the rate schedules, §132(f) and dozens of other parameters, not an
FSA-specific document. The §129 dependent care exclusion is a fixed statutory
amount that appears in **no** Revenue Procedure at all. Every document is
committed under `evidence/fsa-limits/sources/` and fixed by `SHA256SUMS.txt`;
each year is cited individually in `evidence/fsa-limits/primary-values.json`.

- **IRC §125(i)**, added by the Patient Protection and Affordable Care Act,
  Pub. L. 111-148 §9005, as amended by §10902 of that Act and by §1403(b) of the
  Health Care and Education Reconciliation Act of 2010, Pub. L. 111-152. The
  statutory amount is $2,500, indexed under §125(i)(2) for taxable years
  beginning after December 31, 2013 and rounded down to the next lowest multiple
  of $50.

- **Notice 2012-40** — the first-year $2,500 limit. It also holds that the term
  "taxable year" in §125(i) refers to the **plan year** of the cafeteria plan,
  that the limit applies employee-by-employee, that employers aggregated under
  §414(b), (c) or (m) count as one employer under §125(g)(4) while unrelated
  employers each carry their own limit, and that non-elective employer flex
  credits fall outside the limit unless the employee could elect them as cash or
  another taxable benefit. **There is no Revenue Procedure figure for 2013**:
  Rev. Proc. 2012-41 lists the 2013 adjusted items and has no Cafeteria Plans
  entry, which is consistent with §125(i)(2) indexing only from 2014.

- **Notice 2013-71** — created the carryover as a plan option, capped at $500 of
  unused amounts from a plan year, and held that a plan may offer a carryover or
  a §1.125-1(e) grace period but not both. The carryover does not count against
  the receiving year's §125(i) limit.

- **Notice 2020-33** — raised the carryover to 20 percent of the §125(i) limit
  for that plan year and indexed it with that limit, stating $550 for a plan
  year starting in 2020. Rev. Proc. 2013-35 through Rev. Proc. 2019-44 state the
  §125(i) limit and **no** carryover figure; Rev. Proc. 2020-45 is the first
  annual procedure in this sequence to state one itself.

- **Rev. Proc. 2025-32 §3.15** — the 2026 figures, $3,400 and a $680 carryover.
  Earlier years are cited per-year, and the section number moves between
  procedures (§3.15, §3.16, §3.17), so it is recorded per year rather than
  assumed.

- **IRC §129(a)(2)(A)** — the $5,000 exclusion, $2,500 on a separate return by a
  married individual, added by the Tax Reform Act of 1986, Pub. L. 99-514
  §1163(a), applicable to taxable years beginning after December 31, 1986
  (§1163(c)). It is **not** inflation-adjusted, which is why the annual Rev.
  Procs are silent on it and it is cited to the Code. The parameter table
  therefore starts at 1987.

- **American Rescue Plan Act of 2021, Pub. L. 117-2 §9632** — added
  §129(a)(2)(D), applying $10,500 (half that amount on a married separate
  return) to taxable years beginning after December 31, 2020 and before January
  1, 2022. It was enacted in March 2021, so Rev. Proc. 2020-45 could not and does
  not carry it; the 2021 §125(i) and §129 figures come from different documents.

- **Pub. L. 119-21 §70404** — struck `$5,000 ($2,500` from §129(a)(2)(A) and
  inserted `$7,500 ($3,750`, applicable to taxable years beginning after
  December 31, 2025. A fixed-dollar substitution that adds no indexing
  mechanism. `usc-26-129.pdf` is the 2024 edition of the Code and still prints
  the old figures, so 2026 must be read out of the enrolled act.

- **Rev. Rul. 2004-45** — a general-purpose health FSA is disqualifying coverage
  under §223(c)(1)(A)(ii), including one sponsored by the *spouse's* employer,
  while a limited-purpose (vision, dental, preventive) or post-deductible FSA is
  not. **Notice 2005-86** extends the disqualification through a grace period.

Two cautions specific to these documents. **`rp-18-18.pdf` does not exist on
irs.gov**; Rev. Proc. 2018-18 is committed in its official bulletin form,
`irb18-10.pdf`. And that procedure **did not touch the health FSA limit**: its
§3 and §5 enumerate the sections of Rev. Proc. 2017-58 it modifies and
supersedes, and the list runs `3.14, 3.15, 3.18` — §3.16, Cafeteria Plans, is
absent — so the operative 2018 authority is Rev. Proc. 2017-58 §3.16 at $2,650.

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
8. Leave the package version alone unless this is a release; versioning is a
   separate act (see AGENTS.md). There is no CHANGELOG — user-facing behaviour
   goes in `README.md` and provenance goes here.

## Legal-change policy

A statutory or regulatory change that affects algorithmic behavior requires more than a data-row update. It should include a primary authority, a design note covering aggregation/effective date/transition relief/plan dependencies, native tests in both languages, shared conformance vectors, full-output parity, and migration notes when serialized contracts change.
