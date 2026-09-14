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

- **IRC §415(b)(1)(A)** — the limitation on the annual benefit payable by a defined benefit
  plan, adjusted under §415(d) and stated in the same annual cost-of-living notice as the
  §415(c), §402(g) and IRA figures. Notice 2025-67 states it directly: "Effective January 1,
  2026, the limitation on the annual benefit under a defined benefit plan under section
  415(b)(1)(A) of the Code is increased from $280,000 to $290,000." Each encoded year is
  recorded in `evidence/retirement-limits/primary-values.json` as `dbAnnualBenefit_415b1A`
  and compared against `definedBenefitAnnualBenefit415b` in the data file. Only the flat
  figure is encoded; the §415(b)(2) benefit-form and starting-age adjustments and the
  §415(b)(5) short-service reduction are participant-specific and are not modelled.

- **Economic Growth and Tax Relief Reconciliation Act of 2001, Pub. L. 107-16 §632** —
  §632(a)(2)(B) struck IRC §403(b)(2), the maximum exclusion allowance; §632(a)(3)(E) struck
  IRC §415(c)(4), the alternative elections; and §632(a)(4) applies both "to years beginning
  after December 31, 2001". The enrolled act is committed as
  `evidence/retirement-limits/sources/plaw-107publ16.pdf` and fixed by `SHA256SUMS.txt`.
  §632(a)(1) also replaced the 25 percent of compensation in IRC §415(c)(1)(B) with 100
  percent for the same years.

- **IRS Publication 571 (2001), Tax-Sheltered Annuity Plans (403(b) Plans)** — states the
  exclusion allowance as 20 percent of includible compensation for the most recent year of
  service multiplied by years of service, reduced by amounts previously excludable, and
  computes the maximum amount contributable as the **least** of that allowance, the §415(c)
  limit on annual additions, and the §402(g) limit on elective deferrals. "Amounts previously
  excludable" is a lifetime aggregate that no caller-supplied fact in this package expresses,
  which is why tax years 1987 through 2001 return an indeterminate 403(b) result with
  `PRE_2002_403B_EXCLUSION_ALLOWANCE_NOT_APPLIED` rather than the lesser of the two limits it
  does encode. The same publication records the repeal prospectively: "Recent legislation made
  several changes to 403(b) plans that will take effect for years beginning after 2001. Among
  these changes are the repeal of the maximum exclusion allowance and the alternative limits on
  annual additions."
  `https://www.irs.gov/pub/irs-prior/p571--2001.pdf`

- **26 U.S.C. §402(g)(7)** — statutory annual, lifetime, and service-based limits for the special 403(b) 15-year catch-up.
  `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section402&num=0&edition=prelim`

- **26 U.S.C. §402A(e)** — pension-linked emergency savings accounts, added by the SECURE
  2.0 Act of 2022 (Pub. L. 117-328, div. T, title I, §127(e)(1)). §402A(e)(3)(A) caps the
  portion of the account balance attributable to participant contributions at the lesser of
  "$2,500" and "an amount determined by the plan sponsor", and its flush text directs the
  Secretary to adjust the $2,500 "[i]n the case of contributions made in taxable years
  beginning after December 31, 2024" — so 2024, the first effective year, carries the
  unadjusted statutory amount, which no cost-of-living notice states. §127(g) applies the
  section to "plan years beginning after December 31, 2023". The account is "treated for
  purposes of this title as a designated Roth account" under §402A(e)(1)(A)(i), and
  §402A(e)(9) coordinates it with the distribution of excess deferrals under §402(g)(2)(A),
  which is the statutory confirmation that its contributions run against the §402(g) limit.
  The 2025 and 2026 figures come from the annual notices instead: Notice 2024-80 says the
  limitation "remains $2,500" and Notice 2025-67 says it "is increased from $2,500 to
  $2,600". Each encoded year is recorded in `evidence/retirement-limits/primary-values.json`
  as `plesaBalanceCap_402Ae3Ai` and compared against
  `pensionLinkedEmergencySavingsBalanceCap402A` in the data file. The enacted text is
  committed as `evidence/retirement-limits/sources/usc-26-402A.html` and fixed by
  `SHA256SUMS.txt`.
  `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section402A&num=0&edition=prelim`

- **26 U.S.C. §414(v)(6)(A) and §414(v)(7)** — which plans the mandatory-Roth catch-up rule
  reaches. §414(v)(7)(A) opens "Except as provided in subparagraph (C)", and subparagraph (C)
  disapplies it "in the case of an applicable employer plan described in paragraph
  (6)(A)(iv)". Clause (iv) is "an arrangement meeting the requirements of section 408(k) or
  (p)" — a SEP or SARSEP, and a SIMPLE IRA. It is **not** §401(k)(11), so a SIMPLE 401(k) is
  not excepted: it is an employees' trust described in §401(a) and exempt under §501(a),
  which is clause (i). The two SIMPLE families therefore part company here, which is why the
  engine keys the exemption on the account's family rather than on its `isSimple` trait, and
  why the conformance vectors pin both halves. Quoted from the current Code rather than
  paraphrased, because the natural reading of "SIMPLE plans are excepted" is wrong.

  The same section carries **§414(v)(6)(C)**, "Exception for section 457 plans": *"This
  subsection shall not apply to a participant for any year for which a higher limitation
  applies to the participant under section 457(b)(3)."* It disapplies the whole
  subsection rather than paragraph (1) alone, so paragraph (7) goes with it — where the
  participant-wide §457 resolution selects the special last-three-years method, the
  §414(v)(7)(A) wage test has nothing to say about that year, and an existing component
  recorded as an age-based catch-up is reported only as recorded under the unselected
  method.

  §414(v)(6)(C) says "to a participant", not "to that plan". Read alone it would strip
  the age-based catch-up from *every* plan of a participant who used the §457(b)(3)
  catch-up, an unrelated §401(k) included. **26 CFR 1.414(v)-1(a)(3) supplies the scope
  the statute omits:** *"In the case of an applicable employer plan that is a section 457
  eligible governmental plan, the catch-up contributions permitted under this section
  shall not apply to a catch-up eligible participant for any taxable year for which a
  higher limitation applies to such participant under section 457(b)(3)."*
  §1.414(v)-1(e)(3) confirms it from the other side — a plan does not fail universal
  availability *"merely because another applicable employer plan that is a section 457
  eligible governmental plan does not provide for catch-up contributions to the extent
  set forth in section 414(v)(6)(C)"* — a sentence with no work to do unless the other
  plans keep their catch-up. So the exception is confined to the §457 eligible
  governmental plan, which is how the engine applies it.

  The same regulation settles the separation of the two catch-up pools.
  §1.414(v)-1(f)(1): *"all applicable employer plans, other than section 457 eligible
  governmental plans, maintained by the same employer are treated as one plan and all
  section 457 eligible governmental plans maintained by the same employer are treated as
  one plan"*, so that each group is separately *"limited to the applicable dollar
  catch-up limit for the taxable year"*. The engine's split between a §457 pool and a
  qualified pool had been justified from §415(a) and §457(b)(2); this states it directly.

  The enacted text of §414 is committed as
  `evidence/retirement-limits/sources/usc-26-414.html` and fixed by `SHA256SUMS.txt`.
  `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section414&num=0&edition=prelim`

- **26 U.S.C. §402(g)(1)(C), struck by SECURE 2.0 §603(b)(1), and Notice 2023-62** — why the
  §414(v) catch-up pool is keyed to the participant rather than to the plan or the employer,
  and why a catch-up that fails §414(v) falls back onto the ordinary elective-deferral limit.

  §414(v)(2)(A) is a **plan**-level rule — *"A plan shall not permit additional elective
  deferrals … greater than the lesser of"* — and 26 CFR 1.414(v)-1(f)(1) aggregates plans of
  the *same employer* for it, and only "for purposes of paragraph (c)". Neither reaches an
  individual holding plans at two unrelated employers. The participant-level cap came from
  §402(g)(1)(C), which limited what **an eligible participant's gross income** could exclude
  for **the taxable year**, *"without regard to the treatment of the elective deferrals by an
  applicable employer plan under section 414(v)"* — a parenthetical that decouples the
  individual's exclusion from any plan's treatment, which is exactly the two-employer case.

  SECURE 2.0 §603(b)(1) **struck** that subparagraph, and it survives in the current Code only
  in the amendment notes — where a text search finds it and can be mistaken for operative law.
  **Notice 2023-62 preserves its result:** *"The elimination of section 402(g)(1)(C) of the
  Code under section 603(b)(1) of the SECURE 2.0 Act does not change this result for taxable
  years beginning after December 31, 2023"*, the result being that deferrals above the
  §402(g)(1)(B) amount stay out of gross income if they satisfy §414(v).

  Two consequences the engine depends on. The catch-up limit is one per participant per year
  across every employer, so a block that follows the participant pool is correctly scoped.
  And **validity decides which limitation an amount draws on**: a catch-up satisfying §414(v)
  draws on the §414(v) limit and not the §402(g) one, while an amount that fails §414(v) is an
  ordinary elective deferral subject to §402(g)(1)(A) unless corrected. That is why an amount
  whose §414(v)(7)(A) validity is unresolved cannot be charged to either limitation as settled.

  The notice is committed at `evidence/retirement-limits/sources/n-23-62.pdf` and hash-attested.
  It is also the authority for the two-year transition period that makes
  `rothCatchUpWageThreshold` null for catch-up years 2024 and 2025, which the corpus's
  `reconciled` map asserts.

- **26 CFR §1.414(v)-1** — the catch-up regulation, committed as
  `evidence/retirement-limits/sources/cfr-26-1.414v-1.xml`, the eCFR API serialization at
  issue date **2026-09-03**, and fixed by `SHA256SUMS.txt`. Retrieved from
  `https://www.ecfr.gov/api/versioner/v1/full/2026-09-03/title-26.xml?part=1&section=1.414(v)-1`
  rather than the eCFR web page, which refuses automated requests.

## Health savings account sources (IRC §223)

The HSA usage intervals follow the aggregate structure of
[IRC §4973(g)](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section4973&num=0&edition=prelim)
and §223(f)(3), rather than an invented base-first consumption order. For fixed post-reduction
components `B` and `C`, allowable counted contributions are `A = min(T, B + C)`; the feasible
base attribution solves `0 <= baseUse <= B` and `0 <= A - baseUse <= C`. Thus it is
`[max(0, A - C), min(A, B)]`, with the complementary age-55 interval. Unresolved division
ranges preserve the common share in §223(b)(5)(B)(ii); component extrema cannot be combined
from contradictory divisions. This changes audit attribution, not statutory construction:
§223(b)(5)(B)(i) still reduces the family base by aggregate Archer contributions before
division and excludes the separate §223(b)(3) amount. In capped years the statutory monthly
amount bounds an unknown deductible from above; exhausting that bound proves zero reduced
base without supplying or validating the missing deductible. Sources below retain the
annual amounts and the construction/eligibility distinctions. Section 223(b)(4)(C) reduces
the beneficiary's individual limitation, unlike the aggregate Archer reduction in (b)(5)(B)(i).
[Notice 2008-51 Example 5](https://www.irs.gov/irb/2008-25_IRB) permits a 5800 qualified funding
distribution with family coverage January-May and self-only June-December, even though the
annual deductible limit is 4108.33. This amount must not reduce the other spouse's allocated
capacity. The distinct qualification and testing rules in
[IRC §408(d)(9)](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section408&num=0&edition=prelim)
remain outside the calculation.

HSA dollar amounts are published in an annual **Revenue Procedure**, not in the retirement
cost-of-living notice, so they are cited and verified separately.

- **Rev. Proc. 2026-24** — 2027 HSA contribution limits and HDHP minimum deductible and
  out-of-pocket maximum: §3.01 states $4,500 self-only and $9,000 family under §223(b)(2),
  a $1,750 / $3,500 minimum annual deductible and an $8,700 / $17,400 out-of-pocket maximum
  under §223(c)(2)(A). Earlier years are cited per-year in
  `evidence/hsa-limits/primary-values.json`, with the document for every year 2004-2027
  committed under `evidence/hsa-limits/sources/` and fixed by `SHA256SUMS.txt`. The same
  procedure's direct primary care service arrangement fee limits and excepted benefit HRA
  amount are outside what the package models, as they were for earlier years.

- **IRC §223** — the statute itself, for the §223(b)(3)(B) age-55 additional contribution.
  That amount is a fixed statutory table rising from $500 for 2004 to $1,000 for 2009 and
  after. It is **not** inflation-adjusted, which is why the annual Rev. Procs are silent on
  it and it is cited to the Code rather than to a Rev. Proc.

- **IRC §223(b)(5)** — the married-couple rule, cited to the Code because it is a rule rather
  than an adjusted amount. Subparagraph (A) does two distinct things in one sentence, and the
  engine reads them separately: "both spouses shall be treated as having only such family
  coverage (**and if such spouses each have family coverage under different plans, as having
  the family coverage with the lowest annual deductible**)". The first clause can only ever
  raise a self-only month to a family month; the parenthetical is what makes another spouse's
  annual deductible an operand of this couple's limitation. Subparagraph (B) then reduces the
  paragraph (1) limitation "without regard to any additional contribution amount under
  paragraph (3)" by the spouses' aggregate Archer MSA amount, and "after such reduction"
  divides it "equally between them unless they agree on a different division".

  The parenthetical **is still in force** — it was not removed in 2007 and appears in the
  current Code. What changed at 2007 is §223(b)(2) below, which is why a spouse's deductible
  stops being able to move any amount from that year even though the sentence that reads it
  survives. The engine therefore gates the lowest-deductible requirement on the §223(b)(2)
  cap rather than on a year range.

- **IRC §223(c)(2)(A)(i) and Notice 2004-50, Q&A-31** — the minimum annual deductible, and what
  follows from a stated deductible that falls below it. The minimums themselves are ordinary
  adjusted amounts taken from the annual Rev. Procs above and verified by the evidence corpus;
  what needed an authority is the *consequence*, because three different answers are plausible
  and two of them are wrong. Notice 2004-50 Q&A-31 Example (4) settles it:

  > The same facts as Example 1, except that, in addition to family coverage under the HDHP with
  > a $5,000 deductible, W has family coverage with a $500 deductible rather than self-only
  > coverage with a $200 deductible. H and W are treated as having family coverage with the
  > lowest annual deductible under section 223(b)(5)(A). **Neither H nor W is an eligible
  > individual and neither may contribute to an HSA.**

  So a subminimum family plan is neither ignored for failing the minimum nor read as a positive
  limitation of its own deductible; §223(b)(5)(A) reaches it and the consequence is an
  eligibility consequence. Q&A-31's own statement of the rule carries the floor — "the lowest
  HDHP family deductible applicable to the family (minimum $2,000)" — and Example (1) in the
  same series confirms the tier matters: a spouse's *self-only* $200 plan leaves the HSA owner
  contributing the full $5,000, because the parenthetical reaches only competing **family**
  plans.

  **Rev. Rul. 2005-25** is the counterweight and is why the engine reports inconsistent input
  rather than ineligibility: "The special rules for married individuals under section 223(b)(5)
  do not apply because W's non-HDHP family coverage does not cover H." Whether a subminimum plan
  reaches the other spouse turns on whom it covers, and `HsaCoverageInput` carries no such fact.
  Deciding eligibility from a scalar the engine cannot qualify would answer a question the
  caller never answered.

  Q&A-31 also settles the *division* where one spouse's facts are contradictory: "if only one
  spouse is an eligible individual, only that spouse may contribute to an HSA (notwithstanding
  the treatment under §223(b)(5)(A) of both spouses as having only family coverage)". Example (1)
  gives H the whole $5,000. The engine takes the caller's month list as the assertion of
  eligibility, so a deductible contradicting that list leaves the §223(b)(5)(B)(ii) division
  unknowable while the amount stays fixed — the pool reports its number and the share goes null.

  Both documents are committed: `evidence/hsa-limits/sources/n-04-50.pdf` and
  `evidence/hsa-limits/sources/rr-05-25.pdf`, hashed in that corpus's `SHA256SUMS.txt`. Neither
  publishes an annual amount the corpus does not already take from Notice 2004-2; they are held
  for the provenance of these rules.

- **Notice 2004-50, Q&A-32 and Notice 2008-59, Q&A-22** — the two halves of the §223(b)(5)(B)(ii)
  division, and the reason the division is one couple-level fact rather than a share on each
  account.

  Q&A-32 fixes the *breadth* of the agreement: "spouses can divide the annual HSA contribution
  in any way they want, **including allocating nothing to one spouse**." So a share of 0 or 1 is
  a complete division, not a defective one. That is what the account-level model could not
  express — a share of 0 on one spouse's account was indistinguishable from a share that had
  simply not been supplied — and it is why `hsaFamilyLimitDivision` states one taxpayer share on
  the scenario and gives the spouse the remainder.

  Q&A-22 fixes the *limit* of the agreement: asked whether spouses each eligible for the
  §223(b)(3) catch-up must contribute it to their own HSA, it answers "Yes. An individual who is
  eligible to make catch-up contributions may only make such contributions to his or her own
  HSA." The catch-up is therefore not among the things a division can move, which agrees with
  §223(b)(5)(B) dividing the limitation determined "without regard to any additional contribution
  amount under paragraph (3)". A spouse allocated nothing of the family limitation still keeps
  their own $1,000, and the engine keys the §223(b)(3) pool to the owner for that reason.

  `evidence/hsa-limits/sources/n-08-59.pdf` is committed and hashed alongside `n-04-50.pdf`.
  Neither publishes an annual amount; both are held for the provenance of these rules.

- **Notice 2008-52** — the §223(b)(8) last-month rule is a *comparison*, not a blend, and the
  comparison is taken on the couple's combined figures.

  The notice states the rule as a greater-of: a December-eligible individual's maximum
  contribution for the year is the greater of "(1) The sum of the limits determined separately
  for each month under § 223(b)(2), based on eligibility and HDHP coverage on the first day of
  each month, plus catch-up contributions for each month, if applicable ... or (2) The maximum
  annual HSA contribution under § 223(b)(2)(A) or § 223(b)(2)(B) based on the individual's HDHP
  coverage (self-only or family) on the first day of the last month of the individual's taxable
  year, plus catch-up contributions under § 223(b)(3), if applicable." It adds that the rule "may
  increase, but not decrease, the contribution limit" and "applies without regard to whether the
  individual was an eligible individual for the entire year, had HDHP coverage for the entire
  year, or had disqualifying non-HDHP coverage for part of the year."

  Example 3 is what settles the shape of candidate (2), and it rules out the narrower reading
  this engine first took. §223(b)(8)(A)(ii) imputes December's plan only "during each of the
  months such individual is treated as an eligible individual solely by reason of clause (i)",
  which suggests December's tier reaches only the *ineligible* months. In Example 3 that reading
  is inert: B is an eligible individual in all twelve months of 2008, self-only through October
  and family from November, so there is no month for clause (ii) to reach and a per-month
  imputation leaves the schedule untouched at $3,383.34. The notice nonetheless gives B $5,800,
  "the greater of $5,800 or $3,383.34". Candidate (2) is therefore twelve months at December's
  tier outright. Example 8 is the same comparison resolved the other way — family coverage
  through August then self-only, so candidate (2) is $2,900 and the monthly sum of $4,833.33
  wins — which is how the rule can raise a limit but never lower one.

  Example 14 places the comparison at the couple level: "L and M's combined full contribution
  limit for 2008 is $5,800. L and M's combined sum of the monthly contribution limits is $483.33
  ... L and M's combined annual contribution limit under § 223(b)(8) is $5,800, the greater of
  $5,800 or $483.33." The greater-of is taken on the couple's single limitation and the winner is
  then divided, not taken on each spouse's own limitation after dividing. That order is what
  keeps a spouse's December family election from stacking a full-year family candidate on top of
  the other spouse's undivided self-only months.

  The notice is also the source of the §223(b)(8)(B) inclusion figure: Examples 2, 5, 12 and 14
  compute it as the amount contributed less the *monthly* candidate, which is why the engine
  measures the amount attributable to the rule against candidate (1) and reports nothing when
  candidate (1) is the one that won.

  `evidence/hsa-limits/sources/n-08-52.pdf` is committed and hashed. It publishes no annual
  amount the corpus does not already take from Rev. Proc. 2007-36.

- **Tax Relief and Health Care Act of 2006** — §303 removed the §223(b)(2) cap that limited
  the monthly contribution to 1/12 of the *lesser* of the plan's annual deductible and the
  dollar amount, and §305 added the §223(b)(8) last-month rule, both effective for taxable
  years beginning after 2006.

- **Medicare Prescription Drug, Improvement, and Modernization Act of 2003** — added §223,
  effective for taxable years beginning after 2003, which is why HSA coverage starts at 2004.

One caution specific to these documents: **Rev. Proc. 2018-18 was superseded mid-year.** It
set the 2018 family limit at $6,850; Rev. Proc. 2018-27 restored $6,900. The encoded value is
$6,900, and both documents are committed so the sequence is auditable.

## Education savings and educational assistance sources (IRC §530, §127 and §529)

Every figure in `data/education-parameters.json` is statutory, so the authorities are
enacted laws and the Code rather than annual procedures. Each is committed under
`evidence/education-limits/sources/` and fixed by `SHA256SUMS.txt`.

- **Small Business Job Protection Act of 1996, Pub. L. 104-188** — §1806 adds §529, applying
  to taxable years ending after August 20, 1996 (§1806(c)(1)), which sets the table's first
  year. §1202 extends §127 through May 31, 1997, for taxable years beginning after
  December 31, 1994.

- **Taxpayer Relief Act of 1997, Pub. L. 105-34** — §213 adds §530 with a $500 limit, reduced
  for modified adjusted gross income above $95,000 over $15,000 ($150,000 over $10,000 on a
  joint return), applying to taxable years beginning after December 31, 1997 (§213(f)). §221
  extends §127 to courses beginning through May 31, 2000, for taxable years beginning after
  December 31, 1996.

- **Economic Growth and Tax Relief Reconciliation Act of 2001, Pub. L. 107-16** — §401(a)
  substitutes $2,000 for $500 in §530(b)(1)(A)(iii), and §401(b) substitutes $190,000 and
  $30,000 in §530(c)(1), for taxable years beginning after December 31, 2001. §411 strikes the
  §127(d) termination for courses beginning after December 31, 2001. The Act's §901 sunset was
  moved to December 31, 2012 by **Pub. L. 111-312 §101(a)(1)** and struck by
  **Pub. L. 112-240 §101(a)** for taxable years beginning after December 31, 2012.

- **26 U.S.C. §§127, 529 and 530 (2024 edition)** — the current text, and the amendment and
  effective-date notes. The notes record the Pub. L. 106-170 extension of §127 to
  December 31, 2001, and when each §529 cap took effect: Pub. L. 115-97 §11032(b) for
  distributions made after December 31, 2017; Pub. L. 116-94 div. O §302(c) for distributions
  after December 31, 2018; and Pub. L. 117-328 div. T §126(d) for distributions after
  December 31, 2023.

- **Pub. L. 119-21** — §70413(b) raises the §529(e)(3) limit from $10,000 to $20,000 for taxable
  years beginning after December 31, 2025. §70412 makes the §127(c)(1)(B) student-loan payment
  clause permanent and adds §127(d), which indexes both $5,250 amounts for taxable years
  beginning after 2026 from a calendar-2025 base, rounded to the nearest $50; its amendments
  apply to payments made after December 31, 2025.

## ABLE account sources (IRC §529A)

Every document below is committed under `evidence/able-limits/sources/` and fixed by
`SHA256SUMS.txt`.

- **Stephen Beck, Jr., ABLE Act of 2014, Pub. L. 113-295 div. B §102** — adds §529A, applying
  to taxable years beginning after December 31, 2014 (§102(f)(1)). As enacted, §529A(b)(2)(B)
  rejects contributions "exceeding the amount in effect under section 2503(b) for the calendar
  year in which the taxable year begins".

- **Rev. Procs. 2014-61 through 2024-40** — each states the §2503(b) annual exclusion for gifts
  for the following calendar year, which is that year's ABLE limit: $14,000 for 2015–2017,
  $15,000 for 2018–2021, $16,000 for 2022, $17,000 for 2023, $18,000 for 2024 and $19,000 for
  2025.

- **Rev. Proc. 2025-32** — §4.34 states $20,000 as the §529A(b)(2)(B)(i) amount for taxable
  years beginning in 2026. The published sentence reads "$20,000 (instead of instead of the
  amount under provided in section 4.42(1) of this revenue procedure)" [sic]; despite the
  drafting error, it plainly replaces the §4.42(1) figure, which is the $19,000 gift exclusion.

- **Pub. L. 119-21 §70115** — (a)(1) inserts "(determined by substituting '1996' for '1997' in
  paragraph (2)(B) thereof)" after "section 2503(b)" in §529A(b)(2)(B)(i), for taxable years
  beginning after December 31, 2025. (a)(2) strikes "before January 1, 2026" from the
  §529A(b)(2)(B)(ii) employed-beneficiary contribution, for contributions made after
  December 31, 2025.

- **26 U.S.C. §529A and §2503 (2024 edition)** — the current text and its notes, which record
  Pub. L. 115-97 §11024 (the employed-beneficiary contribution, for taxable years beginning
  after December 22, 2017) and Pub. L. 117-328 div. T §124 ("age 46" for "age 26", for taxable
  years beginning after December 31, 2025). Pub. L. 119-21 amends only §529A(b)(2)(B), which
  is covered above, so the edition's notes on the other provisions are not stale.

## Adoption sources (IRC §23 and §137)

Every document below is committed under `evidence/adoption-limits/sources/` and fixed by
`SHA256SUMS.txt`.

- **Small Business Job Protection Act of 1996, Pub. L. 104-188 §1807** — adds §23 and §137 for
  taxable years beginning after December 31, 1996. Each limit is $5,000 ($6,000 for a child with
  special needs), reduced for adjusted gross income above $75,000 over $40,000. §137(f) ends the
  exclusion for amounts paid after December 31, 2001, and §23(d)(2)(B) limits later expenses to
  special-needs children.

- **Economic Growth and Tax Relief Reconciliation Act of 2001, Pub. L. 107-16 §202** — substitutes
  $10,000 for $5,000, drops the separate $6,000 special-needs limit, and substitutes $150,000 for
  $75,000, all for taxable years beginning after December 31, 2001 (§202(g)(1)). §202(d) repeals
  both 2001 terminations. The flat special-needs credit and exclusion under §202(a), and indexing
  under §202(e), apply to taxable years beginning after December 31, 2002 (§202(g)(2)). No revenue
  procedure states 2002: Rev. Proc. 2001-59 has no adoption section.

- **Rev. Procs. 2002-70 through 2025-32** — the indexed limit, the special-needs amount and both
  phase-out figures for every year from 2003 to 2026, stated identically for §23 (§36C in 2010 and
  2011) and §137. Rev. Proc. 2025-32 §4.04(3) also states the $5,120 refundable portion for 2026.

- **Rev. Proc. 2010-35** — modifies Rev. Proc. 2009-50's 2010 adoption sections for the
  Affordable Care Act (Pub. L. 111-148) §10909, which redesignated §23 as §36C, made the credit
  refundable, and raised both maximums from $12,170 to $13,170. Rev. Proc. 2010-40 §2.02
  describes the same change for 2011.

- **Pub. L. 111-312 §101(b)** — rewrites §10909(c) so that the Affordable Care Act amendments do not
  apply to taxable years beginning after December 31, 2011.

- **Pub. L. 119-21 §70402** — adds §23(a)(4), treating up to $5,000 of the credit as refundable
  for taxable years beginning after December 31, 2024. The amount is indexed from a calendar-2024
  base for taxable years beginning after 2025.

- **26 U.S.C. §§23 and 137 (2024 edition)** — the current text and the amendment notes.

## HRA sources (IRC §9831(d), 26 CFR 54.9831-1 and 54.9802-4)

Every document below is committed under `evidence/hra-limits/sources/` and fixed by
`SHA256SUMS.txt`.

- **26 U.S.C. §9831 (2024 edition)** — §9831(d)(2)(B)(iii) limits a qualified small employer HRA
  to "$4,950 ($10,000 in the case of an arrangement that also provides for payments or
  reimbursements for family members of the employee)". §9831(d)(2)(D)(ii) indexes both amounts for
  years beginning after 2016 from a calendar-2015 base, rounded down to $50. The Code's
  effective-date note applies Pub. L. 114-255's amendment to years beginning after December 31, 2016.

- **IRS Notice 2017-67** — footnote 5: "This adjustment increased the $10,000 limit to $10,050 for a
  QSEHRA provided in 2017; the adjustment did not increase the $4,950 limit for 2017." It also states
  $5,050 and $10,250 for 2018.

- **Rev. Procs. 2017-58 through 2025-32** — the QSEHRA limits for each year from 2018 to 2026.
  Rev. Proc. 2017-58's §2 narrative recites the unindexed statutory amounts; its §3.56 states the
  2018 figures.

- **T.D. 9867** (Federal Register, June 20, 2019) — adds 26 CFR 54.9831-1(c)(3)(viii), which limits
  amounts newly made available under an excepted benefit HRA to $1,800. For plan years beginning after
  December 31, 2020 that amount is indexed by the C-CPI-U over calendar year 2019, rounded down to $50.
  The same decision adds 26 CFR 54.9802-4, the individual coverage HRA, which states no dollar limit
  outside its examples. Both apply to plan years beginning on or after January 1, 2020.

- **Rev. Proc. 2020-43** — the indexed excepted benefit HRA amount "will not change for plan years
  beginning after December 31, 2020, and before January 1, 2022, and remains $1,800". The HSA
  procedure for 2021 does not state it.

- **Rev. Procs. 2021-25 through 2025-19** — the excepted benefit HRA amount for plan years beginning in
  2022 through 2026, in each procedure's HRA inflation-adjusted item.

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

- **Omnibus Budget Reconciliation Act of 1993, Pub. L. 103-66, §13212(d)(3)** grandfathers the pre-OBRA compensation limit for an eligible participant in a governmental plan that, as in effect on July 1, 1993, allowed cost-of-living adjustments to its own §401(a)(17) compensation limitation: the reduced limit "shall not apply to the extent that it would reduce the amount of compensation that is allowed to be taken into account under the plan below the amount which was allowed to be taken into account under the plan as in effect on July 1, 1993." The annual figure is published in the same cost-of-living notice as the ordinary §401(a)(17) limit; the series encoded here runs from tax year 1998, the first the IRS published, through 2026, each notice's "increased from" amount matching the prior year's. **Tax years 1994 through 1997 are `null`**: IRS Notice 96-55, which publishes the 1997 limitations, does not state the grandfathered figure at all, so no value is recoverable from primary authority and none is extrapolated.  
  `https://www.govinfo.gov/content/pkg/STATUTE-107/pdf/STATUTE-107-Pg312.pdf`

- **IRS Employee Plans News, Fall 2009, “When Limits Collide, Which One Wins?”** distinguishes §401(a)(17), §415(c), and §402(g). It describes the compensation cap for plan contributions while explaining why the cap should not be applied as an extra cutoff preventing an employee from completing the annual elective-deferral amount.  
  `https://www.irs.gov/pub/irs-tege/fall09.pdf`

- **IRS Publication 535 (2001), self-employed qualified-plan worksheet** demonstrates that self-employed contribution calculations compare the reduced-rate net-earnings amount with the annual compensation ceiling multiplied by the unreduced plan rate.  
  `https://www.irs.gov/pub/irs-prior/p535--2001.pdf`

- **IRS SARSEP Fix-it Guide** describes SEP/SARSEP total contribution limits as the lesser of the annual dollar limit and the applicable percentage of compensation, with compensation considered subject to the annual limit.  
  `https://www.irs.gov/retirement-plans/sarsep-fix-it-guide-total-contributions-employee-elective-deferrals-and-nonelective-employer-contributions-exceeded-the-maximum-legal-limits`

## Plan-status thresholds and the saver's credit (IRC §§414(q), 416(i), 25B)

- **IRS cost-of-living notices, Notice 96-55 through Notice 2025-67** — the notices that carry the contribution limits also state the §414(q)(1)(B) highly-compensated-employee threshold from 1997, the §416(i)(1)(A)(i) key-employee threshold from 2002, and all nine §25B(b) adjusted gross income ceilings from 2008. Each year's figures are recorded in `evidence/retirement-limits/primary-values.json` and compared against the data file, and each notice's "increased from" amounts match the prior year's. Notice 96-55 is the first to state the §414(q)(1)(B) figure — "as amended by the Small Business Job Protection Act of 1996, is $80,000" — so earlier years are `null`. For 2013 through 2015 the corpus held only IR-series news releases, which print just the top §25B ceiling for each filer; Notices 2012-67, 2013-73 and 2014-70 are now committed from Internal Revenue Bulletins 2012-50, 2013-49 and 2014-48 for the full table.  
  `https://www.irs.gov/pub/irs-irbs/irb12-50.pdf`, `https://www.irs.gov/pub/irs-irbs/irb13-49.pdf`, `https://www.irs.gov/pub/irs-irbs/irb14-48.pdf`

- **Economic Growth and Tax Relief Reconciliation Act of 2001, Pub. L. 107-16 §§613 and 618** — §613(a)(1)(B) strikes §416(i)(1)(A)(i) and inserts "an officer of the employer having an annual compensation greater than $130,000", applying to years beginning after December 31, 2001. §618(a) enacts §25B with a fixed applicable-percentage table — $30,000 / $32,500 / $50,000 on a joint return, $22,500 / $24,375 / $37,500 for a head of household, and $15,000 / $16,250 / $25,000 in all other cases — applying to taxable years beginning after December 31, 2001. No notice states the 2002–2006 table, because it was not indexed.

- **Rev. Proc. 2006-53 §3.06** — the first indexed §25B(b) amounts, for taxable years beginning in 2007, after the Pension Protection Act of 2006, Pub. L. 109-280 §833(a), rewrote §25B(b) with an inflation adjustment for calendar years after 2006. The same document is also committed in the HSA corpus.  
  `https://www.irs.gov/pub/irs-drop/rp-06-53.pdf`

- **Pub. L. 119-21 §70116** — rewrites §25B(d)(1), applying to taxable years ending after December 31, 2025. Under (A), contributions to the individual's ABLE account qualify. Under (B), IRA contributions, elective deferrals and voluntary employee contributions qualify only "in the case of any taxable year beginning before January 1, 2027". §70116(a)(2) repeals SECURE 2.0 (Pub. L. 117-328 div. T) §103(e)(1) "as though such paragraph were never enacted", and §70116(b) raises the §25B(a) cap from $2,000 to $2,100 for taxable years beginning after December 31, 2026. The credit and its §25B(b) table are not repealed. Committed as `evidence/retirement-limits/sources/plaw-119publ21.pdf`.  
  `https://www.govinfo.gov/content/pkg/PLAW-119publ21/pdf/PLAW-119publ21.pdf`

- **26 U.S.C. §25B (2024 edition)** — the §25B(b) and §25B(d)(1) text in force before Pub. L. 119-21. It predates that law, so its amendment note still describes the SECURE 2.0 §103(e)(1) change, which §70116(a)(2) later repealed. Do not rely on that note.  
  `https://www.govinfo.gov/content/pkg/USCODE-2024-title26/pdf/USCODE-2024-title26-subtitleA-chap1-subchapA-partIV-subpartA-sec25B.pdf`

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

### Grouped §457 plan resources and unresolved catch-ups

IRC §414(v)(3)(A) relieves qualifying catch-ups from §457(b)(2), while
§414(v)(7)(A) conditions that treatment on Roth contributions above the sponsor
wage threshold. Consequently, unresolved treatment affects the plan's basic
ceiling as well as the participant aggregate; inconsistent sponsor facts must be
considered when attributing existing contributions. IRC §457(e)(5), through
§415(c)(3)(D), also distinguishes employee salary deferrals from nonelective
employer deposits: separate base and special ceilings do not permit salary to be
deferred twice across records of one plan. The plan retains aggregate existing
salary usage for this check.

Primary text: [IRC §414](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section414&num=0&edition=prelim),
[IRC §457](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section457&num=0&edition=prelim),
and [IRC §415](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section415&num=0&edition=prelim).

## Ordinary FICA and SECA parameters (1991–2026)

`data/payroll-tax-parameters.json` is backed by `evidence/payroll-tax/` (684 scalar
comparisons). The corpus contains the actual primary documents, quoted narrative
transcriptions, and SHA-256 digests. Its README describes the annual source map.

- IRS Circular E, [1991](https://www.irs.gov/pub/irs-prior/p15--1991.pdf),
  [1992](https://www.irs.gov/pub/irs-prior/p15--1992.pdf),
  [1993](https://www.irs.gov/pub/irs-prior/p15--1993.pdf), and
  [1994](https://www.irs.gov/pub/irs-prior/p15--1994.pdf): OASDI bases and the distinct
  HI bases $125,000/$130,200/$135,000, followed by repeal of the HI cap in 1994.
- Annual SSA Federal Register determinations supply later OASDI bases. The 1995
  and 2014 bases are explicitly stated as current-year figures in the following
  determination. Each other annual value is read from its determination's prose.
  The December 15, 2017 correction (82 FR 59937) supersedes the initial 2018
  $128,700 base with $128,400; both source documents are retained.
  The 2024–2026 documents already in `retirement-limits` are linked using the
  established `LINKED, not committed here:` convention, never duplicated.
- [26 USC §3101](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section3101&num=0&edition=prelim),
  §3111, §3121, §1401, §1402, §164(f), and §3102(f): employee/employer/SECA rates,
  wage-first coordination, minimum earnings, deduction, and the separate
  Additional Medicare liability and withholding rules. Snapshots are in the corpus.
- [Pub. L. 111-312 §601](https://www.govinfo.gov/content/pkg/PLAW-111publ312/pdf/PLAW-111publ312.pdf)
  and [Pub. L. 112-96 §1001](https://www.govinfo.gov/content/pkg/PLAW-112publ96/pdf/PLAW-112publ96.pdf):
  the 2011–2012 holiday, including 4.2% employee OASDI, 10.4% SECA OASDI, the
  **unreduced** rate for §1402(a)(12), and the **59.6%** OASDI portion of the
  §164(f) deduction. IRS Schedule SE for both years corroborates the calculation.

The 0.9235 net-earnings factor is derived as `1 - (12.4 + 2.9) / 200`; the
$125,000 MFS threshold is derived as half the $250,000 joint threshold. Neither
is presented as a verbatim statutory figure. §1401(b)(2)(B)'s enacted cross-reference
to §3121(b)(2) is a scrivener's error; the Additional Medicare wage threshold is
§3101(b)(2). The data notes retain that distinction. Pre-1991 credits, special
SECA methods, §86, IRMAA, NIIT, and benefit calculations are outside this tranche.
