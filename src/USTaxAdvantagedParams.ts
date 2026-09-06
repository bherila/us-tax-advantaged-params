/**
 * us-tax-advantaged-params
 *
 * A dependency-free U.S. tax-advantaged account parameter engine. Retirement
 * accounts are the coverage today: contribution limits, phase-outs, shared
 * statutory limits, and Roth conversions. The annual parameter table is generated from
 * data/retirement-parameters.json; do not edit the generated block manually.
 *
 * This package calculates statutory contribution ceilings and federal income
 * deltas. It deliberately does not calculate investment returns, distributions,
 * RMDs, plan nondiscrimination testing, state income tax, or actuarially
 * determined defined-benefit/cash-balance contributions.
 */

export const PACKAGE_NAME = "us-tax-advantaged-params" as const;
export const ENGINE_VERSION = "0.4.1" as const;

export type Money = number;
export type PersonRole = "taxpayer" | "spouse" | "other";
export type EmployerContributionTaxTreatment = "pretax" | "roth";
export type ContributionPreference = "account_type" | "pretax_first" | "roth_first";
export type SimpleEmployerContributionMethod =
  | "match_3_percent"
  | "nonelective_2_percent"
  | "custom";

export enum FilingStatus {
  SINGLE = "single",
  MARRIED_FILING_JOINTLY = "married_filing_jointly",
  MARRIED_FILING_SEPARATELY = "married_filing_separately",
  HEAD_OF_HOUSEHOLD = "head_of_household",
  QUALIFYING_SURVIVING_SPOUSE = "qualifying_surviving_spouse",
}

export enum AccountType {
  TRADITIONAL_IRA = "traditional_ira",
  ROTH_IRA = "roth_ira",
  ROLLOVER_IRA = "rollover_ira",
  PAYROLL_DEDUCTION_IRA = "payroll_deduction_ira",
  DEEMED_TRADITIONAL_IRA = "deemed_traditional_ira",
  DEEMED_ROTH_IRA = "deemed_roth_ira",
  INHERITED_TRADITIONAL_IRA = "inherited_traditional_ira",
  INHERITED_ROTH_IRA = "inherited_roth_ira",

  SEP_IRA = "sep_ira",
  ROTH_SEP_IRA = "roth_sep_ira",
  SIMPLE_IRA = "simple_ira",
  ROTH_SIMPLE_IRA = "roth_simple_ira",
  SARSEP_IRA = "sarsep_ira",

  TRADITIONAL_401K = "traditional_401k",
  ROTH_401K = "roth_401k",
  SOLO_401K = "solo_401k",
  ROTH_SOLO_401K = "roth_solo_401k",
  SIMPLE_401K = "simple_401k",
  ROTH_SIMPLE_401K = "roth_simple_401k",
  STARTER_401K = "starter_401k",

  /**
   * IRC 402A(e) pension-linked emergency savings account, as included in a
   * qualified trust under IRC 401(a) -- IRC 402A(f)(1)(A) -- or a plan under
   * IRC 403(b) -- IRC 402A(f)(1)(B). Modeled as the designated Roth account
   * IRC 402A(e)(1)(A)(i) says it is treated as, so its contributions run
   * against IRC 402(g) and IRC 415(c). The third host at IRC 402A(f)(1)(C) is
   * GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS, which runs against
   * neither.
   */
  PENSION_LINKED_EMERGENCY_SAVINGS = "pension_linked_emergency_savings",

  TRADITIONAL_403B = "traditional_403b",
  ROTH_403B = "roth_403b",
  SAFE_HARBOR_403B_DEFERRAL_ONLY = "safe_harbor_403b_deferral_only",

  GOVERNMENTAL_457B = "governmental_457b",
  ROTH_GOVERNMENTAL_457B = "roth_governmental_457b",

  /**
   * IRC 402A(e) pension-linked emergency savings account hosted in an eligible
   * deferred compensation plan of a governmental employer -- the third
   * "applicable retirement plan" at IRC 402A(f)(1)(C). It is not the same
   * calculation as the other two hosts wearing a different label: deferrals
   * under such a plan are not IRC 402(g)(3) elective deferrals, so they run
   * against the IRC 457(e)(15) applicable dollar amount through
   * IRC 457(b)(2)(A) rather than IRC 402(g)(1), and IRC 415(a)(1) and (a)(2)
   * do not reach an IRC 457(b) plan at all, so no annual-additions limit
   * applies to it.
   */
  GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS =
    "governmental_457b_pension_linked_emergency_savings",
  NONGOVERNMENTAL_457B = "nongovernmental_457b",
  SECTION_457F = "section_457f",

  TRADITIONAL_TSP = "traditional_tsp",
  ROTH_TSP = "roth_tsp",

  SECTION_401A = "section_401a",
  PROFIT_SHARING_PLAN = "profit_sharing_plan",
  MONEY_PURCHASE_PLAN = "money_purchase_plan",
  KEOGH_PLAN = "keogh_plan",
  ESOP = "esop",

  DEFINED_BENEFIT_PLAN = "defined_benefit_plan",
  CASH_BALANCE_PLAN = "cash_balance_plan",

  HSA = "hsa",

  HEALTH_FSA = "health_fsa",
  DEPENDENT_CARE_FSA = "dependent_care_fsa",
}

export enum ConversionType {
  IRA_TO_ROTH_IRA = "ira_to_roth_ira",
  QUALIFIED_PLAN_TO_ROTH_IRA = "qualified_plan_to_roth_ira",
  IN_PLAN_ROTH_ROLLOVER = "in_plan_roth_rollover",
}

export enum CalculationStatus {
  DETERMINATE = "determinate",
  DETERMINATE_WITH_ASSUMPTIONS = "determinate_with_assumptions",
  INDETERMINATE = "indeterminate",
  UNAVAILABLE = "unavailable",
  INELIGIBLE = "ineligible",
}

export enum DiagnosticSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  path?: string;
  legalReference?: string;
}

export interface CompensationInput {
  /** Compensation eligible to support regular IRA contributions. */
  iraCompensation?: Money;
  /** W-2 wages for general plan-compensation defaults. */
  w2Compensation?: Money;
  /** Net earnings after the deductible half of self-employment tax. */
  selfEmploymentNetEarnings?: Money;
}

export interface MagiInput {
  /** Modified AGI used for direct Roth IRA contribution eligibility. */
  rothIra?: Money;
  /** Modified AGI used for the traditional IRA deduction phase-out. */
  traditionalIraDeduction?: Money;
  /** Pre-conversion MAGI used only for pre-2010 Roth-conversion eligibility. */
  rothConversion?: Money;
}

export interface PersonInput {
  id: string;
  role?: PersonRole;
  birthDate?: string;
  birthYear?: number;
  compensation?: CompensationInput;
  magi?: MagiInput;
  coveredByEmployerRetirementPlan?: boolean;
  /** Used by the MFS IRA rules. Defaults to true for MFS. */
  livedWithSpouseDuringYear?: boolean;
  /** Prior-year IRC 3121(a) wages, keyed by common-law employer ID. */
  priorYearFicaWagesByEmployer?: Record<string, Money>;
  /**
   * IRC 129(b)(1) earned income of this person for the taxable year. The
   * limitation is one figure for the return -- the employee's own earned
   * income, or for a married employee the lesser of theirs and their
   * spouse's -- so it is a fact about the person rather than about any
   * dependent care program they participate in. Two programs cannot disagree
   * about it when it lives here.
   */
  dependentCareEarnedIncome?: Money;
  /**
   * IRC 129(b)(2) applies IRC 21(d)(2) to deem earned income for a spouse who
   * is a student or incapable of caring for himself. The IRC 21(d)(2) schedule
   * is not encoded -- no primary source for it is in this package's evidence
   * corpus -- so asserting this records that any `dependentCareEarnedIncome`
   * supplied for this person is a deemed figure, and produces a diagnostic.
   */
  isStudentOrIncapableOfSelfCare?: boolean;
  /** Accumulated nondeductible basis in all traditional/SEP/SIMPLE IRAs. */
  traditionalSepSimpleIraBasis?: Money;
  /** December 31 value of all traditional/SEP/SIMPLE IRAs. */
  yearEndTraditionalSepSimpleIraValue?: Money;
  /** Other current-year distributions included in the Form 8606 denominator. */
  otherTraditionalSepSimpleIraDistributions?: Money;
  /**
   * IRC 223(c)(2) coverage held by this person, whether or not they own a
   * health savings account. IRC 223(b)(5)(A) turns on whether *either spouse*
   * has family coverage, so a spouse's coverage changes the other spouse's
   * limitation even when that spouse has no HSA. Supplying the key at all
   * declares the fact known; an empty object states that this person held no
   * high deductible health plan coverage in any month. Where the person does
   * own an HSA, `planRules.hsa` carries the same facts and the two must agree.
   */
  hsaCoverage?: HsaCoverageInput;
  /**
   * IRC 223(b)(8)(B) testing-period facts for this person. The last-month rule
   * itself is not stated here: IRC 223(b)(8)(A) says a December-eligible
   * individual "shall be treated" as an eligible individual for the whole year,
   * so this engine reads it off the coverage facts rather than asking. What is
   * left to state is the consequence — whether the testing period was, or will
   * be, satisfied — and that is one fact per person rather than one per
   * account, because IRC 223(b)(8)(B)(i) puts any inclusion in that
   * individual's gross income.
   */
  hsaLastMonthRuleTestingPeriod?: HsaLastMonthRuleTestingPeriodInput;
  /**
   * The aggregate amount paid for the taxable year to Archer MSAs of this
   * person. IRC 223(b)(4)(A) reduces that person's IRC 223(b) limitation by it;
   * IRC 223(b)(5)(B)(i) reduces the single family limitation by both spouses'
   * aggregate before it is divided. It is therefore a fact about the person and
   * not about an account, and a spouse who owns no HSA can still carry one.
   *
   * It is caller-supplied, exactly like eligible-individual status. Both
   * reductions take an amount *paid* rather than an IRC 220 limitation, so
   * nothing about IRC 220 is modelled and the amount is not tested against the
   * Archer MSA contribution limitation.
   */
  archerMsaContributions?: Money;
  /**
   * The aggregate amount contributed to health savings accounts of this person
   * for the taxable year under IRC 408(d)(9) — a qualified HSA funding
   * distribution rolled over from an IRA. IRC 223(b)(4)(C) reduces that
   * person's IRC 223(b) limitation by it.
   *
   * Unlike the IRC 223(b)(4)(A) Archer MSA reduction it is never withdrawn: the
   * IRC 223(b)(4) flush text names subparagraph (A) alone, so (C) applies to a
   * married individual to whom IRC 223(b)(5) applies as much as to anyone else.
   * It is an amount of "such individual" and never of the couple, so it reduces
   * that spouse's own limitation *after* the IRC 223(b)(5)(B)(ii) division
   * rather than the family limitation before it.
   *
   * It is caller-supplied, exactly like eligible-individual status. The IRC
   * 408(d)(9)(C) once-per-lifetime limitation and the separate IRC 408(d)(9)(D)
   * testing period are not modelled, and the amount is not tested against the
   * IRA it was distributed from.
   */
  qualifiedHsaFundingDistributions?: Money;
}

export interface ExistingContributionInput {
  employeePreTaxDeferral?: Money;
  employeeRothDeferral?: Money;
  employeePreTaxCatchUp?: Money;
  employeeRothCatchUp?: Money;
  employeeAfterTax?: Money;
  employerPreTax?: Money;
  employerRoth?: Money;
  deductibleIra?: Money;
  nondeductibleIra?: Money;
  rothIra?: Money;
  special403bCatchUp?: Money;
  /**
   * A pre-tax IRC 457(b)(3) last-three-years catch-up. The statutory source and
   * the tax treatment are independent: the same catch-up made to a designated
   * Roth account is `special457RothCatchUp`, and both seed the same
   * IRC 457(b)(3) pool.
   */
  special457CatchUp?: Money;
  /** A Roth IRC 457(b)(3) last-three-years catch-up. */
  special457RothCatchUp?: Money;
  /** HSA contribution deductible under IRC 223(a). */
  hsaDeductible?: Money;
  /** HSA contribution excluded under IRC 106(d), including cafeteria-plan salary reduction. */
  hsaEmployerOrCafeteria?: Money;
  /** IRC 125 salary reduction contributions elected to a health flexible spending arrangement. */
  healthFsaSalaryReduction?: Money;
  /** Dependent care assistance provided for the year through an IRC 129 program. */
  dependentCareAssistanceProvided?: Money;
}

export interface Special403bCatchUpInput {
  eligible?: boolean;
  yearsOfService: number;
  priorElectiveDeferrals: Money;
  priorSpecialCatchUpUsed: Money;
}

export interface Section457SpecialCatchUpInput {
  eligible: boolean;
  /** Total unused regular 457(b) deferrals from prior eligible years. */
  unusedDeferralsFromPriorYears: Money;
}

/** IRC 223(c)(2) high deductible health plan coverage tiers. */
export type HsaCoverageTier = "self_only" | "family";

export interface HsaMonthlyCoverageInput {
  /** Calendar month, 1 (January) through 12 (December). */
  month: number;
  /** Coverage held on the first day of that month. IRC 223(b)(2). */
  coverage: HsaCoverageTier;
}

/**
 * IRC 223(c)(2) high deductible health plan coverage held by one *person*.
 * These are facts about the individual, not about any account, which is why the
 * same shape is reachable both from an HSA's `planRules.hsa` and from
 * `persons[].hsaCoverage` for a spouse who owns no HSA of their own.
 *
 * Whether a person is an "eligible individual" under IRC 223(c)(1) — high
 * deductible health plan coverage, absence of disqualifying other coverage,
 * Medicare entitlement under IRC 223(b)(7), and the IRC 223(b)(6) dependent
 * denial — is supplied by the caller through the month list, not derived by
 * this engine.
 */
export interface HsaCoverageInput {
  /** Coverage tier for every eligible month when the tier does not change. */
  coverageTier?: HsaCoverageTier;
  /** Months (1-12) on whose first day the person was an eligible individual. Defaults to all twelve. */
  eligibleMonths?: number[];
  /** Per-month coverage when the tier changes during the year. Mutually exclusive with the two fields above. */
  monthlyCoverage?: HsaMonthlyCoverageInput[];
  /**
   * The plan's annual deductible. Required for 2004-2006, when IRC 223(b)(2)
   * capped the monthly limitation by it.
   *
   * One amount covers every month this input represents. The IRC 223(b)(5)(A)
   * comparison between the spouses' plans is resolved month by month, but a
   * single person switching plans mid-year -- family Plan A at 5000 through
   * June, Plan B at 3000 after -- cannot be expressed: `monthlyCoverage` varies
   * the tier, not the deductible. Supply the deductible of the plan in force
   * for the months this input covers.
   */
  hdhpAnnualDeductible?: Money;
}

/**
 * IRC 223 facts read from an HSA account's `planRules.hsa`.
 *
 * This is `HsaCoverageInput` and nothing more. It had carried four further
 * fields, and none of them was about the account:
 *
 * - `familyLimitShare` is about the *couple*. IRC 223(b)(5)(B)(ii) divides the
 *   one family limitation "equally between them unless they agree on a
 *   different division", and "them" is the married individuals of the opening
 *   clause. It now lives on `ScenarioInput.hsaFamilyLimitDivision`.
 * - `testingPeriodSatisfied` and `testingPeriodFailureByDeathOrDisability` are
 *   about the *person*: IRC 223(b)(8)(B)(iii) defines the testing period for
 *   "the individual" and (b)(8)(B)(i) puts the income inclusion on them.
 *   Neither speaks to an account. They now live on
 *   `PersonInput.hsaLastMonthRuleTestingPeriod`.
 * - `useLastMonthRule` states nothing at all, and so moved nowhere. IRC
 *   223(b)(8)(A) treats a December-eligible individual as an eligible
 *   individual for the whole year without asking them, so the greater-of is
 *   computed from the coverage facts.
 *
 * The evidence that these were misplaced was in the engine itself: it carried
 * two conflict detectors, computed identically on adjacent lines, whose only
 * job was to notice that one owner's accounts disagreed about a fact that
 * cannot vary between an owner's accounts. Both are gone.
 *
 * Multiple HSAs do not subdivide their owner's maximum -- Pub. 969 (2005) p. 5:
 * "If you have more than one HSA in 2005, your total contributions to all the
 * HSAs cannot be more than the limits discussed earlier" -- so an account was
 * never the right level for any of this.
 */
export type HsaRulesInput = HsaCoverageInput;

/**
 * IRC 223(b)(8)(B) testing-period facts about one *person*.
 *
 * There is no field here for applying IRC 223(b)(8) itself, because applying it
 * is not the taxpayer's to state. IRC 223(b)(8)(A) says an individual who is an
 * eligible individual during the last month of the taxable year "shall be
 * treated" as an eligible individual for each month of that year, and Notice
 * 2008-52 states the resulting maximum as "the greater of" the month-by-month
 * figure and the whole annual figure for December's coverage tier. Neither is
 * conditioned on an election: there is no election statement, no Form 8889
 * checkbox and no revocation, and Form 8889's instructions simply tell a
 * December-eligible taxpayer whose coverage changed to enter the greater amount
 * on line 3. Their "you may consider yourself an eligible individual for the
 * entire year" is the practical choice to fund the extra capacity, which a
 * taxpayer makes by contributing; a taxpayer may always contribute less than a
 * statutory maximum, and that does not lower the maximum.
 *
 * The consequence is where the taxpayer's own conduct does matter, and it is
 * measured on conduct rather than on an election: IRC 223(b)(8)(B)(i) reaches
 * only contributions "which could not have been made but for" the rule, and
 * Notice 2008-52's examples cap the inclusion at the contribution actually
 * made. So `amountAttributableToLastMonthRule` and these two facts, not a flag,
 * decide the testing-period obligation.
 *
 * IRC 223(b)(8)(B)(iii) defines that period for "the individual", so an owner
 * with two HSAs has one testing period, not two.
 */
export interface HsaLastMonthRuleTestingPeriodInput {
  /** Whether the IRC 223(b)(8)(B)(iii) testing period was, or will be, satisfied. Omitted means unresolved. */
  satisfied?: boolean;
  /** IRC 223(b)(8)(B)(ii): a testing-period failure caused by death or disability is excepted. */
  failureByDeathOrDisability?: boolean;
}

/**
 * How the one IRC 223(b)(5) family limitation is divided between the spouses.
 *
 * IRC 223(b)(5)(B)(ii): the limitation, after the (B)(i) reduction, "shall be
 * divided equally between them unless they agree on a different division". The
 * equal split is the rule and an agreement is the exception, which is why an
 * omitted division means `statutory_equal` rather than an unknown: the
 * Instructions for Form 8889 state the same default -- "divide the amount on
 * line 5 equally between you and your spouse, unless you both agree on a
 * different allocation".
 *
 * The non-numeric statuses exist because failing to establish the exception is
 * not the same input state as establishing its absence. Records that contradict
 * each other are equally consistent with "they agreed equally and one record is
 * wrong" and "they agreed 25/75 and the other is wrong"; defaulting those to
 * 50/50 would overstate one spouse's limitation in the second case. An
 * adjudicator might reach the equal split as an evidentiary finding against a
 * taxpayer who cannot substantiate a claimed unequal division, but a parameter
 * engine must not perform that adjudication silently.
 */
export type HsaFamilyLimitDivisionInput =
  /** No different division was agreed, so IRC 223(b)(5)(B)(ii) divides equally. */
  | { status: "statutory_equal" }
  /**
   * The spouses agreed a different division. `taxpayerShare` is the share of
   * the one family limitation belonging to the person whose `role` is
   * `taxpayer`, from 0 through 1; the spouse takes the remainder. Notice
   * 2004-50 Q&A-32 permits any division, "including allocating nothing to one
   * spouse", so 0 and 1 are both valid.
   */
  | { status: "agreed"; taxpayerShare: number }
  /** Whether a different division was agreed is not known. */
  | { status: "unknown" }
  /** The spouses report different divisions. */
  | { status: "disputed" }
  /** Two records of the same division conflict. */
  | { status: "inconsistent" };

/**
 * Rev. Rul. 2004-45 classification of a health FSA, which decides whether it is
 * disqualifying coverage under IRC 223(c)(1)(A)(ii).
 */
export type HealthFsaPurpose = "general_purpose" | "limited_purpose" | "post_deductible";

/**
 * IRC 125(i) health flexible spending arrangement facts. Only read for
 * `health_fsa` accounts.
 *
 * Every field is a plan-design fact. This engine does not read plan documents,
 * so none of them is inferred: an absent carryover fact produces a diagnostic
 * rather than an assumed answer, exactly as absent HSA coverage does.
 */
export interface HealthFsaRulesInput {
  /**
   * Rev. Rul. 2004-45 classification. Absent means unknown, and the engine
   * diagnoses rather than assuming either value, because the two answers differ
   * on whether the arrangement blocks IRC 223 eligibility.
   */
  purpose?: HealthFsaPurpose;
  /** Whether the plan offers the Notice 2013-71 carryover. Mutually exclusive with `offersGracePeriod`. */
  offersCarryover?: boolean;
  /** Whether the plan offers the Prop. Treas. Reg. 1.125-1(e) grace period. Mutually exclusive with `offersCarryover`. */
  offersGracePeriod?: boolean;
  /** Unused amount from the immediately preceding plan year, after the run-out period. */
  priorYearUnusedAmount?: Money;
  /** Non-elective employer flex credits contributed to the arrangement. */
  employerFlexCredit?: Money;
  /**
   * Whether the employee could have elected the flex credit as cash or another
   * taxable benefit. Notice 2012-40 keeps flex credits outside IRC 125(i)
   * unless they could, in which case they are treated as salary reduction
   * contributions and consume the limit.
   */
  flexCreditElectableAsCash?: boolean;
  /** Lower limit imposed by the plan document, if any. */
  planDocumentLimit?: Money;
  /**
   * Whether the cafeteria plan's plan year is the calendar year. Notice 2012-40
   * holds that "taxable year" in IRC 125(i) means the plan year, while every
   * annual revenue procedure publishes the figure for taxable years beginning
   * in a calendar year and this package is keyed by tax year throughout. The
   * two agree exactly for a calendar-year plan. Stating `false` makes the
   * answer depend on the plan year start date, which this engine does not hold,
   * so it returns an indeterminate result rather than assuming.
   */
  planYearIsCalendarYear?: boolean;
}

/**
 * IRC 415(b) facts reported for a defined-benefit or cash-balance account.
 *
 * The contribution remains `indeterminate` — sizing it needs the plan formula,
 * census, assets, assumptions and the funding rules, none of which this package
 * models. IRC 415(b)(1)(A) is a different thing: a flat statutory ceiling on the
 * annual benefit the plan may pay, adjusted under IRC 415(d) and published in
 * the same annual notice as the defined-contribution figures. It is reported
 * because it is knowable from the year alone.
 */
export interface DefinedBenefitAccountDetail {
  /**
   * IRC 415(b)(1)(A) dollar limitation on the annual benefit for the year, or
   * null where no figure is encoded. The limit is stated for a benefit in the
   * form of a straight life annuity beginning between ages 62 and 65; IRC
   * 415(b)(2) adjusts it for other forms and starting ages, and IRC 415(b)(5)
   * reduces it for fewer than ten years of participation or service. Those
   * adjustments are participant-specific and are not applied here.
   */
  annualBenefitLimit: Money | null;
}

export interface HealthFsaAccountDetail {
  /** Rev. Rul. 2004-45 classification supplied by the caller, or null when unstated. */
  purpose: HealthFsaPurpose | null;
  /** IRC 125(i) dollar limitation for the year, before any lower plan-document limit. Null where none exists. */
  salaryReductionLimit: Money | null;
  /** The ceiling actually applied: the IRC 125(i) limit, or a lower plan-document limit. */
  appliedSalaryReductionLimit: Money | null;
  /** Salary reduction contributions supplied on this account. */
  electedSalaryReduction: Money;
  /**
   * Flex credits treated as salary reduction contributions under Notice
   * 2012-40 because the employee could have elected them as cash or another
   * taxable benefit. Flex credits that could not are outside IRC 125(i) and are
   * zero here.
   */
  employerFlexCreditCountedAgainstLimit: Money;
  /** Amount carried in from the immediately preceding plan year: the lesser of the unused amount and that year's cap. */
  carryoverFromPriorYear: Money;
  /** The preceding year's carryover cap, which is the one that governs. Null where that year has no encoded cap. */
  carryoverLimitForPriorYear: Money | null;
  /** The cap on what may be carried out of *this* year into the next. Null where none exists. */
  carryoverLimitForThisYear: Money | null;
  /** Unused prior-year amount lost under the use-or-lose rule, or null when the facts do not determine it. */
  forfeitedAmount: Money | null;
  /** Whether the arrangement is disqualifying coverage under IRC 223(c)(1)(A)(ii); null when the purpose is unstated. */
  disqualifiesHsaEligibility: boolean | null;
}

/**
 * IRC 129 dependent care assistance facts. Only read for `dependent_care_fsa`
 * accounts.
 *
 * Earned income is caller-supplied. This package does not derive income, but
 * IRC 129(b)(1) is a hard statutory ceiling on the exclusion, so a supplied
 * figure is applied and an absent one is diagnosed rather than ignored.
 */
export interface DependentCareFsaRulesInput {
  /**
   * A lower maximum the employer's plan itself allows. Form 2441's dependent
   * care benefit computation takes the plan's maximum into account when it is
   * below the Code amount. Like a health FSA plan-document limit, it is a term
   * of this plan: it caps this arrangement and is not an employer-group or
   * return-level ceiling.
   */
  planDocumentLimit?: Money;
}

export interface DependentCareFsaAccountDetail {
  /** IRC 129(a)(2)(A) amount for the return, or null for a year with no statutory limitation. */
  statutoryExclusion: Money | null;
  /** IRC 129(b)(1) earned income ceiling, or null when the earned income facts were not supplied. */
  earnedIncomeLimitation: Money | null;
  /** A lower maximum the plan itself allows, or null when none was supplied. */
  planDocumentLimit: Money | null;
  /** The least of the applicable limits, which is the ceiling actually applied to this account. */
  applicableExclusionLimit: Money | null;
  /** Dependent care assistance supplied on this account. */
  electedSalaryReduction: Money;
  /** The part of this account's total excluded from gross income under IRC 129(a)(1). */
  excludableAmount: Money;
  /** The part included in gross income under IRC 129(a)(2)(B) because it exceeds the limitation. */
  includibleInIncome: Money;
  /** True when the IRC 129(a)(2)(A) amount is one household figure shared with another account on the same return. */
  householdExclusionShared: boolean;
}

export type HsaTestingPeriodStatus = "satisfied" | "failed" | "failed_exception_applies" | "unresolved";

export interface HsaTestingPeriodObligation {
  /** Months in the IRC 223(b)(8)(B)(iii) testing period. */
  months: number;
  /** First month of the testing period, YYYY-MM. */
  startMonth: string;
  /** Last month of the testing period, YYYY-MM. */
  endMonth: string;
  status: HsaTestingPeriodStatus;
  /** IRC 223(b)(8)(B)(i)(I) gross-income inclusion if the period is failed. */
  grossIncomeInclusionIfFailed: Money;
  /** IRC 223(b)(8)(B)(i)(II) additional tax, 10 percent of the inclusion. */
  additionalTaxIfFailed: Money;
  /** Taxable year the inclusion and additional tax fall in; never the contribution year. */
  inclusionTaxYear: number;
}

export interface HsaAccountDetail {
  /**
   * Twelve entries, January first, holding the coverage actually supplied for
   * each month after the IRC 223(b)(5)(A) spousal recharacterization; null
   * where the owner was not an eligible individual. The IRC 223(b)(8) deeming
   * is not folded in here — see appliedAnnualLimitByMonth.
   */
  coverageTierByMonth: Array<HsaCoverageTier | null>;
  /** Months actually supplied as eligible, ignoring the IRC 223(b)(8) deeming. */
  eligibleMonthCount: number;
  /**
   * The annual amount whose one-twelfth is the IRC 223(b)(2) monthly limitation
   * that was applied for each month. Under IRC 223(b)(8)(A)(ii) every month
   * carries December's amount.
   */
  appliedAnnualLimitByMonth: Array<Money | null>;
  /**
   * The IRC 223(b)(1) limitation applied, before the IRC 223(b)(3) increase and
   * the IRC 223(b)(5) division.
   *
   * Null, along with the two fields around it, where
   * HSA_HDHP_DEDUCTIBLE_BELOW_STATUTORY_MINIMUM fired: those figures are built
   * from the very deductible that diagnostic rejects, and a contract that says
   * "these are the IRC 223(b) limitations that were applied" cannot honestly
   * carry a limitation derived from a plan the caller's own facts say cannot
   * qualify. Publishing them would reintroduce the ceiling the check exists to
   * suppress, one field away from the diagnostic denying it.
   */
  proratedContributionLimit: Money | null;
  /** The same figure computed month by month, without IRC 223(b)(8). Null on the same condition. */
  contributionLimitWithoutLastMonthRule: Money | null;
  /**
   * IRC 223(b)(3) additional contribution amount, prorated over the same
   * months, before any IRC 223(b)(4)(A) Archer MSA reduction. IRC 223(b)(5)(B)
   * excludes it from the reduction and the division alike, so it is reduced
   * only for an individual to whom IRC 223(b)(5) does not apply, and only by
   * the part of the Archer amount the IRC 223(b)(1) limitation could not absorb.
   */
  additionalContributionAmount: Money;
  /** IRC 223(b)(5)(B)(ii) share of the one family limit, or null when no family limit is shared. */
  familyLimitShare: number | null;
  /**
   * The IRC 223(b)(5) family limitation *this owner* holds: the limitation
   * refigured for the months this owner was treated as having family coverage
   * (Form 8889 line 6, Step 1), excluding any self-only months, which stay
   * with the individual. It is per-owner rather than couple-wide because
   * spouses with unequal family-coverage months refigure different amounts.
   * Null when no family limit is shared. The IRC 223(b)(4)(C) reduction does
   * not appear in it: that reduction is an individual one taken after the
   * division.
   *
   * **Not all of it is divided.** Notice 2004-50 Q&A-31 gives a month in which
   * only one spouse is an eligible individual wholly to that spouse, so only
   * the part of this figure attributable to months *both* spouses were eligible
   * is multiplied by `familyLimitShare`. That part is
   * `dividedFamilyContributionLimit`, and the remainder is taken whole. An
   * owner family-covered all year beside a spouse eligible in December alone
   * holds the whole 8750 here and divides only December's 729.17 of it.
   */
  sharedFamilyContributionLimit: Money | null;
  /**
   * The part of `sharedFamilyContributionLimit` that `familyLimitShare`
   * actually multiplies -- the months both spouses were eligible individuals,
   * which IRC 223(b)(5)(B)(ii) divides. The rest of that figure is this owner's
   * alone under Q&A-31.
   *
   * With no Archer MSA contribution this closes the arithmetic exactly:
   *
   * ```
   * proratedContributionLimit - dividedFamilyContributionLimit * (1 - familyLimitShare)
   * ```
   *
   * is the owner's IRC 223(b)(1) limitation. Where an Archer MSA amount was
   * paid, IRC 223(b)(5)(B)(i) reduces the limitation before the division and
   * `archerMsaLimitReduction` carries that step.
   *
   * Every figure here is rounded to cents while the engine divides the
   * unrounded monthly amounts, so the reconstruction can land a penny off the
   * reported maximum -- a December-only family month publishes as 729.17, and
   * half of that is 364.59 against the 364.58 half of 8750/12 gives. Use the
   * identity to understand the composition, not to re-derive the ceiling.
   *
   * Null where `sharedFamilyContributionLimit` is null, and also where a
   * positive Archer MSA reduction leaves family capacity but its placement
   * between shared and sole-eligible months is unknown. The total family
   * amount can be known while the portion remaining to divide is not.
   */
  dividedFamilyContributionLimit: Money | null;
  /**
   * The aggregate amount paid to Archer MSAs that reduced this owner's IRC
   * 223(b) limitation: their own amount under IRC 223(b)(4)(A), or both
   * spouses' aggregate under IRC 223(b)(5)(B)(i).
   */
  archerMsaContributionsApplied: Money;
  /**
   * True when IRC 223(b)(5) applies to this individual. The IRC 223(b)(4) flush
   * text — "Subparagraph (A) shall not apply with respect to any individual to
   * whom paragraph (5) applies" — then routes the reduction through IRC
   * 223(b)(5)(B)(i), which takes it *before* the IRC 223(b)(5)(B)(ii) division
   * rather than after.
   */
  archerMsaReductionPrecedesFamilyDivision: boolean;
  /**
   * The fall in this owner's IRC 223(b) ceiling caused by that reduction.
   *
   * Null where that fall is a share of the couple's reduction and no share was
   * established. IRC 223(b)(5)(B)(i) takes the spouses' aggregate off the one
   * family limitation *before* subparagraph (B)(ii) divides it, so an owner's
   * own fall is their share of it — an amount this field cannot state when the
   * share is unknown. Charging each spouse the whole aggregate instead reported
   * a couple that lost it twice.
   */
  archerMsaLimitReduction: Money | null;
  /**
   * The aggregate amount contributed to health savings accounts of this owner
   * under IRC 408(d)(9) that reduced their IRC 223(b) limitation under IRC
   * 223(b)(4)(C). It is always this individual's own amount and never a couple
   * aggregate, and the reduction is never taken before the IRC 223(b)(5)(B)(ii)
   * division, so it has no counterpart to
   * `archerMsaReductionPrecedesFamilyDivision`.
   */
  qualifiedHsaFundingDistributionsApplied: Money;
  /**
   * The fall in this owner's IRC 223(b) ceiling caused by that reduction. IRC
   * 223(b)(4) reduces by "the sum of" its subparagraphs but not below zero, so
   * when both reductions apply and together exceed the ceiling the fall is
   * attributed in subparagraph order: (A) is reported in full and this reports
   * only what was left for (C) to reach.
   */
  /**
   * Null on the same footing as `archerMsaLimitReduction`: IRC 223(b)(4)(C)
   * reduces the share IRC 223(b)(5)(B)(ii) left this spouse, so how far their
   * own ceiling fell is bounded by a share no division established.
   */
  qualifiedHsaFundingLimitReduction: Money | null;
  /**
   * True where this ceiling was built from Notice 2008-52's second candidate —
   * December's coverage tier taken for the whole year — because it came out
   * larger than the month-by-month one.
   *
   * It does not say the rule was worth anything to *this* owner. Notice
   * 2008-52 Example 14 compares the married couple's *combined* candidates and
   * divides the winner, so a spouse can be on the winning candidate and still
   * take a smaller share of it than their own eligible months would have given
   * them undivided. This owner's potential testing-period exposure is
   * `amountAttributableToLastMonthRule`, and that figure alone decides the
   * testing-period obligation.
   */
  fullContributionCandidateSelected: boolean;
  /**
   * The part of this December-eligible owner's ceiling potentially subject to
   * personal recapture under IRC 223(b)(8)(B) — the amount that "could not have been made but for"
   * the last-month rule if the HSA is funded to its calculated maximum.
   *
   * Zero for an owner established ineligible in December, even if the
   * household full candidate increases their ceiling.
   * Null where it is a share of the couple's increase under IRC
   * 223(b)(5)(B)(ii) and no share was established. The amount is then between
   * nothing and the whole of that increase, which is not the zero it would
   * otherwise read as.
   */
  amountAttributableToLastMonthRule: Money | null;
  /**
   * Null both where IRC 223(b)(8)(B) creates no obligation and where the amount
   * that would create one could not be computed;
   * `amountAttributableToLastMonthRule` separates the two, being zero in the
   * first case and null in the second.
   */
  testingPeriod: HsaTestingPeriodObligation | null;
}

export interface PlanRulesInput {
  /** Compensation recognized by this plan. */
  planCompensation?: Money;
  /** Compensation recognized by a 457(b) plan. */
  includibleCompensation457?: Money;
  /** Shared IRC 415(c) group; use the same ID for plans of one controlled employer. */
  annualAdditionsGroupId?: string;
  /** Optional lower employee limit imposed by the plan document. */
  planDocumentEmployeeDeferralLimit?: Money;
  /** Optional lower annual-additions limit imposed by the plan document. */
  planDocumentAnnualAdditionsLimit?: Money;
  permitsRothContributions?: boolean;
  permitsRothCatchUp?: boolean;
  permitsAfterTaxEmployeeContributions?: boolean;
  permitsInPlanRothRollover?: boolean;
  contributionPreference?: ContributionPreference;

  /** Known employer contribution; preferred when supplied. */
  expectedEmployerContribution?: Money;
  /** Employer match dollars per employee-deferral dollar, e.g. 0.5. */
  employerMatchRate?: number;
  /** Fraction of compensation eligible for the match, e.g. 0.06. */
  employerMatchCompensationFraction?: number;
  /** Employer nonelective contribution as a fraction of compensation. */
  employerNonelectiveRate?: number;
  employerContributionTaxTreatment?: EmployerContributionTaxTreatment;

  simpleEmployerContributionMethod?: SimpleEmployerContributionMethod;
  simpleCustomEmployerContribution?: Money;
  simpleEnhancedLimitEligible?: boolean;

  /** Treat compensation as self-employment net earnings for the employer formula. */
  isSelfEmployedOwner?: boolean;
  netEarningsFromSelfEmploymentAfterHalfSETax?: Money;

  special403bCatchUp?: Special403bCatchUpInput;
  section457SpecialCatchUp?: Section457SpecialCatchUpInput;
  /** IRC 223 health savings account facts. Only read for `hsa` accounts. */
  hsa?: HsaRulesInput;
  /** IRC 125(i) health flexible spending arrangement facts. Only read for `health_fsa` accounts. */
  healthFsa?: HealthFsaRulesInput;
  /** IRC 129 dependent care assistance facts. Only read for `dependent_care_fsa` accounts. */
  dependentCareFsa?: DependentCareFsaRulesInput;

  /**
   * Portion of an IRC 402A(e) pension-linked emergency savings account balance
   * already attributable to participant contributions, before the contributions
   * being calculated. IRC 402A(e)(3)(A) caps that portion of the *balance*, so
   * the room left for the year cannot be derived from the tax year alone, and a
   * withdrawal under IRC 402A(e)(7) restores room. Required for a
   * `pension_linked_emergency_savings` account; supply 0 for a new one.
   */
  pensionLinkedEmergencySavingsParticipantContributionBalance?: Money;

  /** Grandfathered SARSEP established before 1997. */
  grandfatheredSarsep?: boolean;
  /**
   * Whether OBRA '93 sec. 13212(d)(3) lifts the IRC 401(a)(17) compensation
   * limit for this participant in this plan.
   *
   * One flag asserts both halves of the rule, because both are facts about the
   * plan document and the participant's history rather than anything derivable
   * from the tax year: that the plan is a governmental plan within the meaning
   * of IRC 414(d) which, as in effect on July 1, 1993, allowed cost-of-living
   * adjustments to its own compensation limitation; and that this participant
   * is an "eligible participant", having first become a participant before the
   * first plan year beginning after the earlier of the plan's amendment date or
   * December 31, 1993. Plan-document eligibility is outside this engine's
   * scope, so the caller asserts the conclusion.
   */
  grandfatheredGovernmentalCompensationLimit?: boolean;
  /** Used to surface the statutory 2024+ additional SIMPLE nonelective amount. */
  simpleAdditionalNonelectiveContribution?: Money;
}

export interface AccountInput {
  id: string;
  ownerId: string;
  type: AccountType | string;
  employerId?: string;
  priority?: number;
  planRules?: PlanRulesInput;
  existingContributions?: ExistingContributionInput;
}

export interface RothConversionInput {
  id: string;
  ownerId: string;
  type: ConversionType | string;
  amount: Money;
  /** Basis in the specific qualified-plan amount being converted. */
  afterTaxBasisInConvertedAmount?: Money;
  /** Overrides the person's aggregate IRA basis for a Form 8606 calculation. */
  aggregateIraBasisOverride?: Money;
  /** Overrides the person's December 31 aggregate IRA value. */
  yearEndAggregateIraValueOverride?: Money;
  /** Pre-2013 in-plan rollovers generally required an otherwise distributable amount. */
  otherwiseDistributableAmount?: boolean;
  sourceAccountId?: string;
}

export interface ScenarioInput {
  taxYear: number;
  filingStatus: FilingStatus | string;
  persons: PersonInput[];
  accounts: AccountInput[];
  conversions?: RothConversionInput[];
  /**
   * IRC 129(a)(2)(C) determines marital status under IRC 21(e)(3) and (4), and
   * IRC 21(e)(4) treats a married individual filing separately as **not**
   * married when they maintained a household that was a qualifying
   * individual's principal place of abode for more than half the year,
   * furnished over half its cost, and their spouse was not a member of it
   * during the last six months. Such a taxpayer takes the undivided
   * IRC 129(a)(2)(A) amount and the IRC 129(b)(1)(A) own-earned-income
   * limitation rather than the halved amount and the lesser-of rule.
   *
   * The three underlying facts are not derivable from anything else supplied,
   * so this is the determination itself rather than the facts behind it. Absent
   * on a married-separate return, the determination is reported as not made.
   */
  treatedAsUnmarriedUnderSection21e4?: boolean;
  /**
   * IRC 223(b)(5)(B)(ii) division of the one family limitation between the
   * spouses. Omitted means `{ status: "statutory_equal" }` -- the statute
   * divides equally unless the spouses agree otherwise, so silence is the
   * default rule rather than a missing fact.
   *
   * Read only where IRC 223(b)(5) applies: a married couple at least one of
   * whom has family coverage. Ignored otherwise.
   */
  hsaFamilyLimitDivision?: HsaFamilyLimitDivisionInput;
}

export interface ContributionComponents {
  employeePreTaxDeferral: Money;
  employeeRothDeferral: Money;
  employeePreTaxCatchUp: Money;
  employeeRothCatchUp: Money;
  employeeAfterTax: Money;
  employerPreTax: Money;
  employerRoth: Money;
  deductibleIra: Money;
  nondeductibleIra: Money;
  rothIra: Money;
  special403bCatchUp: Money;
  special457CatchUp: Money;
  special457RothCatchUp: Money;
  /** Known regular contribution whose tax classification cannot be resolved. */
  unclassifiedIra: Money;
  /** HSA contribution deductible under IRC 223(a). */
  hsaDeductible: Money;
  /** HSA contribution excluded under IRC 106(d), including cafeteria-plan salary reduction. */
  hsaEmployerOrCafeteria: Money;
  /** IRC 125 salary reduction contributions elected to a health flexible spending arrangement. */
  healthFsaSalaryReduction: Money;
  /**
   * Dependent care assistance provided under an IRC 129 program. Not only
   * salary reductions: IRC 129(e)(1) covers amounts paid for, or services
   * provided to, an employee under a dependent care assistance program, and
   * Form 2441 aggregates direct employer payments and employer-provided care
   * alongside cafeteria-plan elections. The IRC 129(a)(1) exclusion applies to
   * the total, so this field carries the total.
   */
  dependentCareAssistanceProvided: Money;
  /**
   * Dependent care assistance included in gross income under IRC 129(a)(2)(B)
   * because it exceeds the limitation. It is a derived split of the supplied
   * amount rather than an input of its own.
   */
  dependentCareIncludibleInIncome: Money;
}

export interface FederalTaxEffects {
  federalAgiReduction: Money;
  federalAgiIncrease: Money;
  federalTaxableIncomeReduction: Money;
  formW2Box1WageReduction: Money;
  ficaWageReduction: Money;
  selfEmployedRetirementDeduction: Money;
  nondeductibleContribution: Money;
  afterTaxOrRothContribution: Money;
  taxableRothConversion: Money;
  notes: string[];
}

export interface SharedLimitUse {
  id: string;
  legalLimit: string;
  limit: Money | null;
  /**
   * Null where the pool's ceiling is known but the draw against it is not. The
   * fields are the named usage, so a consumer that reads them must not be handed
   * a zero the engine never computed; the null is the third state, not a
   * sentinel to be reverse-engineered from a missing remainder.
   *
   * `usedByAccount` is the exception and is null far less often, because it is
   * this account's own settled draw rather than the pool's history: an account
   * may take a determinate amount out of a pool whose total usage stays a range.
   */
  usedBeforeAccount: Money | null;
  usedByAccount: Money | null;
  remainingAfterAccount: Money | null;
  /**
   * Present exactly where the scalar beside it is null for want of a settled
   * usage -- not where the ceiling itself is unknown, which leaves nothing to
   * bound. The range is closed and inclusive, and its endpoints are reachable:
   * some completion of the supplied facts produces each.
   *
   * Endpoints from different pools may be summed only at the minimum. Two pools
   * widened by the same unresolved amount reach their maxima under opposite
   * readings, so adding those reports headroom no set of facts provides.
   */
  possibleUsedBeforeAccount?: MoneyInterval;
  possibleRemainingAfterAccount?: MoneyInterval;
}

export interface AccountCalculationResult {
  accountId: string;
  accountType: AccountType;
  ownerId: string;
  employerId?: string;
  status: CalculationStatus;
  /** Overall legal ceiling if a monetary contribution ceiling can be calculated. */
  statutoryMaximumAnnualContribution: Money | null;
  /** Maximum supported by the supplied plan capabilities and formulas. */
  maximumAnnualContributionBasedOnInputs: Money | null;
  maximumAdditionalContributionBasedOnInputs: Money | null;
  existingAnnualContribution: Money;
  /** Amount of supplied contributions above this account's determinable statutory ceiling. */
  excessContribution: Money | null;
  contributionComponents: ContributionComponents;
  /** Potential IRC 415(c) space that requires unknown plan/employer terms. */
  planTermDependentCapacity: Money;
  federalTaxEffects: FederalTaxEffects;
  sharedLimits: SharedLimitUse[];
  /**
   * IRC 223 detail; present only for `hsa` accounts, and **null** on one of them
   * where the candidate it would describe is not established.
   *
   * The object is an audit trail of one chosen schedule and one chosen winner of
   * the Notice 2008-52 comparison. Where the input leaves several completions
   * open -- an owner's two accounts stating different coverage, a spouse's
   * family coverage neither stated nor reconcilable, a birth year that would
   * decide which candidate wins, an unapportionable IRC 223(b)(5)(B)(i)
   * reduction -- there is no such trail to report, and filling one in from
   * whichever account happened to be read first would make reversing two input
   * records change the reported facts. So the whole object goes rather than
   * being published field by field beside a diagnostic saying the answer was
   * never established. An unsettled IRC 223(b)(5)(B)(ii) division is not one of
   * those cases: it leaves both candidates computable and nulls
   * `familyLimitShare` alone.
   */
  hsa?: HsaAccountDetail | null;
  /** IRC 415(b) detail; present only for `defined_benefit_plan` and `cash_balance_plan` accounts. */
  definedBenefit?: DefinedBenefitAccountDetail;
  /** IRC 125(i) detail; present only for `health_fsa` accounts. */
  healthFsa?: HealthFsaAccountDetail;
  /** IRC 129 detail; present only for `dependent_care_fsa` accounts. */
  dependentCareFsa?: DependentCareFsaAccountDetail;
  diagnostics: Diagnostic[];
}

export interface ConversionCalculationResult {
  conversionId: string;
  conversionType: ConversionType;
  ownerId: string;
  status: CalculationStatus;
  grossConvertedAmount: Money;
  taxableAmount: Money | null;
  nontaxableBasisAmount: Money | null;
  consumesAnnualContributionLimit: false;
  federalTaxEffects: FederalTaxEffects;
  diagnostics: Diagnostic[];
}

export interface ScenarioTotals {
  maximumAnnualContributionBasedOnInputs: Money;
  maximumAdditionalContributionBasedOnInputs: Money;
  employeePreTaxContribution: Money;
  employeeRothOrAfterTaxContribution: Money;
  employerPreTaxContribution: Money;
  employerRothContribution: Money;
  deductibleIraContribution: Money;
  nondeductibleIraContribution: Money;
  /** IRC 223 contributions, deducted and excluded together. */
  hsaContribution: Money;
  /** IRC 125 health flexible spending arrangement salary reduction contributions. */
  healthFsaSalaryReduction: Money;
  /** IRC 129(a)(1) dependent care assistance excluded from gross income. */
  dependentCareAssistanceExclusion: Money;
  /** IRC 129(a)(2)(B) dependent care assistance included in gross income. */
  dependentCareIncludibleInIncome: Money;
  federalAgiReduction: Money;
  federalAgiIncrease: Money;
  taxableRothConversions: Money;
}

export interface ScenarioResult {
  package: typeof PACKAGE_NAME;
  engineVersion: typeof ENGINE_VERSION;
  taxYear: number;
  filingStatus: FilingStatus;
  parameters: YearParameters;
  /** IRC 223 parameters for the year, or null when HSAs did not exist or no revenue procedure is encoded. */
  hsaParameters: HsaYearParameters | null;
  /** IRC 125 and IRC 129 flexible spending arrangement parameters, or null for a year with no encoded figures. */
  fsaParameters: FsaYearParameters | null;
  accounts: AccountCalculationResult[];
  conversions: ConversionCalculationResult[];
  totals: ScenarioTotals;
  diagnostics: Diagnostic[];
}

interface PhaseoutRange {
  singleOrHeadOfHousehold?: [Money, Money];
  marriedFilingJointlyOrQualifyingSurvivingSpouse?: [Money, Money];
  marriedFilingSeparatelyLivingTogether?: [Money, Money];
  marriedFilingJointly?: [Money, Money];
}

export interface YearParameters {
  year: number;
  ira: {
    baseContributionLimit: Money;
    age50CatchUp: Money;
    compensationFraction: number;
    universalEligibility: boolean;
    nondeductibleContributionAvailable: boolean;
    spousalIraAvailable: boolean;
    nonworkingSpouseIndividualLimit: Money | null;
    /**
     * Former IRC 220(b)(1)(A) (Tax Reform Act of 1976) capped the one-earner
     * couple's deduction at twice the amount paid to whichever of the two
     * accounts received the lesser amount. That is a joint ceiling keyed to how
     * the couple split their contributions, not a per-account cap: if the
     * worker contributes nothing to their own account the deductible spousal
     * amount is zero, and the maximizing split is equal halves. No single
     * per-account number reproduces it, so the years it governs report an
     * indeterminate spousal limit rather than an invented one.
     */
    spousalDeductionIsTwiceTheLesserOfContributions: boolean;
    oneEarnerHouseholdCombinedLimit: Money | null;
    traditionalContributionAge70HalfRestriction: boolean;
    rothAvailable: boolean;
  };
  electiveDeferral402g: Money | null;
  /** IRC 402(g)(7) 15-year catch-up limits for eligible 403(b) employees. */
  special403b15YearCatchUp: {
    annualLimit: Money;
    lifetimeLimit: Money;
    serviceLimitPerYear: Money;
  };
  generalAge50CatchUp: Money;
  age60To63CatchUp: Money | null;
  rothCatchUpPriorYearFicaWageThreshold: Money | null;
  annualAdditions415c: Money | null;
  annualAdditionsCompensationFraction: number | null;
  annualCompensation401a17: Money | null;
  /**
   * OBRA '93 sec. 13212(d)(3) compensation limit for an eligible participant in
   * a governmental plan that, as in effect on July 1, 1993, allowed
   * cost-of-living adjustments to its own compensation limitation. The IRS
   * publishes it in the same annual notice as the ordinary IRC 401(a)(17)
   * figure and it is substantially higher, because it continues the pre-OBRA
   * series the general limit was cut back from.
   *
   * `null` before 1998. The IRS first published the figure in Notice 97-58, for
   * tax year 1998; the notice for 1997 does not mention it at all, so no value
   * for 1994 through 1997 is recoverable from primary authority and none is
   * invented here.
   */
  annualCompensation401a17GrandfatheredGovernmental: Money | null;
  /**
   * IRC 415(b)(1)(A) dollar limitation on the annual benefit payable by a
   * defined-benefit plan. It is a ceiling on the *benefit*, published in the
   * same annual notice as every other figure here, and needs no actuary; it is
   * not a contribution limit and says nothing about funding. Null for a year
   * whose figure is not transcribed in the evidence corpus.
   */
  definedBenefitAnnualBenefit415b: Money | null;
  /**
   * IRC 402A(e)(3)(A)(i) limitation on a pension-linked emergency savings
   * account. It caps the portion of the account balance attributable to
   * participant contributions, not the contributions of any one year, and it is
   * the *lesser* of this figure and any lower amount the plan sponsor sets under
   * IRC 402A(e)(3)(A)(ii). Null before Pub. L. 117-328 section 127(g) made the
   * account available for plan years beginning after December 31, 2023.
   */
  pensionLinkedEmergencySavingsBalanceCap402A: Money | null;
  sep: {
    available: boolean;
    maximumEmployerContributionRate: number;
    selfEmployedEquivalentRate: number;
    minimumEligibleCompensation: Money | null;
    newSarsepMayBeEstablished: boolean;
    grandfatheredSarsepMayOperate: boolean;
    rothSepAvailable: boolean;
  };
  simple: {
    available: boolean;
    salaryReductionLimit: Money | null;
    generalAge50CatchUp: Money;
    age60To63CatchUp: Money | null;
    certainPlanEnhancedSalaryReductionLimit: Money | null;
    certainPlanAge50CatchUp: Money | null;
    additionalNonelectiveContributionCap: Money | null;
  };
  section457b: {
    available: boolean;
    baseDeferralLimit: Money | null;
    includibleCompensationFraction: number | null;
    specialLastThreeYearsMaximum: Money | null;
    governmentalAge50CatchUp: Money;
    governmentalAge60To63CatchUp: Money | null;
    designatedRothAvailableForGovernmentalPlans: boolean;
  };
  starterDeferralOnly: {
    available: boolean;
    baseDeferralLimit: Money | null;
    age50CatchUp: Money;
  };
  availability: Record<string, boolean>;
  phaseouts: {
    traditionalIraCovered: PhaseoutRange | null;
    traditionalIraSpouseCovered: PhaseoutRange | null;
    rothIra: PhaseoutRange | null;
  };
}

interface ParameterData {
  schemaVersion: number;
  package: string;
  generatedThroughTaxYear: number;
  supportedTaxYears: { minimum: number; maximum: number };
  moneyUnit: "USD";
  rounding: { iraPhaseoutIncrement: number; iraPositiveReducedMinimum: number };
  historicalCoveragePolicy: Record<string, string>;
  sources: Array<Record<string, string>>;
  years: Record<string, YearParameters>;
}

interface HsaTierAmounts {
  selfOnly: Money;
  family: Money;
}

export interface HsaYearParameters {
  year: number;
  /** IRC 223(b)(2)(A) and (B) annual limitations on the deduction. */
  annualContributionLimit: HsaTierAmounts;
  /** IRC 223(b)(3)(B) additional contribution amount for an individual who attains 55 before the close of the year. */
  additionalContributionAmountAge55: Money;
  /** True for 2004-2006, when IRC 223(b)(2) capped each month at the lesser of the plan deductible and the dollar amount. */
  contributionLimitCappedByHdhpAnnualDeductible: boolean;
  /** IRC 223(b)(8), added by the Tax Relief and Health Care Act of 2006 for years after 2006. */
  lastMonthRuleAvailable: boolean;
  /** IRC 223(b)(8)(B)(iii) testing period length, or null where the rule does not exist. */
  testingPeriodMonths: number | null;
  /** IRC 223(c)(2)(A) high deductible health plan definition. */
  hdhp: {
    minimumAnnualDeductible: HsaTierAmounts;
    maximumAnnualOutOfPocket: HsaTierAmounts;
  };
}

interface HsaParameterData {
  schemaVersion: number;
  package: string;
  generatedThroughTaxYear: number;
  supportedTaxYears: { minimum: number; maximum: number };
  moneyUnit: "USD";
  proration: { method: string; monthsInYear: number };
  historicalCoveragePolicy: Record<string, string>;
  sources: Array<Record<string, string>>;
  years: Record<string, HsaYearParameters>;
}

/** IRC 125(i) health flexible spending arrangement amounts for one year. */
export interface HealthFsaYearParameters {
  /** Whether IRC 125(i) supplied a statutory ceiling for the year. */
  state: DollarLimitState;
  /** IRC 125(i)(1) dollar limitation, as indexed under IRC 125(i)(2). Null before IRC 125(i) existed. */
  salaryReductionLimit: Money | null;
  /**
   * The maximum unused amount from *this* year that a plan permitting a
   * carryover may carry into the immediately following year. Notice 2013-71
   * fixed it at $500; Notice 2020-33 raised it to 20 percent of that year's
   * IRC 125(i) limit. Both are phrased as the amount carried *from* a plan
   * year, so it belongs to the source year and never to the receiving one.
   */
  carryoverLimit: Money | null;
}

/** IRC 129(a)(2)(A) dependent care assistance exclusion amounts for one year. */
export interface DependentCareYearParameters {
  /** Whether IRC 129(a)(2)(A) supplied a statutory ceiling for the year. */
  state: DollarLimitState;
  /** IRC 129(a)(2)(A) exclusion for a return other than a married separate one. */
  exclusionLimit: Money | null;
  /** IRC 129(a)(2)(A) parenthetical amount for a separate return by a married individual. */
  marriedFilingSeparatelyExclusionLimit: Money | null;
}

/**
 * Whether a program existed for the tax year, and whether a universal statutory
 * dollar ceiling existed for it. The middle state is the one worth having: a
 * program can exist, and its exclusion apply, with no statutory ceiling at all.
 * A year in that state has a null statutory maximum, but a maximum computed
 * from caller-supplied plan terms or earned income is still a real answer, and
 * the engine reports it rather than refusing.
 *
 * `unavailable` is expressed by absence: a year below `supportedTaxYears.minimum`
 * predates the program.
 */
export type DollarLimitState = "available_without_statutory_dollar_limit" | "statutory_dollar_limit";

export interface FsaYearParameters {
  year: number;
  healthFsa: HealthFsaYearParameters;
  dependentCare: DependentCareYearParameters;
}

interface FsaParameterData {
  schemaVersion: number;
  package: string;
  generatedThroughTaxYear: number;
  supportedTaxYears: { minimum: number; maximum: number };
  moneyUnit: "USD";
  historicalCoveragePolicy: Record<string, string>;
  sources: Array<Record<string, string>>;
  years: Record<string, FsaYearParameters>;
}

/* <generated-parameters> */
const RAW_PARAMETERS: ParameterData = {
  "schemaVersion": 1,
  "package": "us-tax-advantaged-params",
  "generatedThroughTaxYear": 2026,
  "supportedTaxYears": {
    "minimum": 1975,
    "maximum": 2026
  },
  "moneyUnit": "USD",
  "rounding": {
    "iraPhaseoutIncrement": 10,
    "iraPositiveReducedMinimum": 200
  },
  "historicalCoveragePolicy": {
    "description": "The dataset starts with the first generally available IRA contribution year. For pre-1987 employer-plan years lacking a universal modern IRC 402(g) or fully encoded IRC 415 limit, the engines return an indeterminate statutory maximum rather than inventing a number.",
    "pre1987EmployerPlanLimitStatus": "requires_plan_document_and_historical_law_facts"
  },
  "sources": [
    {
      "id": "irs-notice-2025-67",
      "title": "Notice 2025-67, 2026 retirement-plan cost-of-living adjustments",
      "url": "https://www.irs.gov/pub/irs-irbs/irb25-49.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2024-80",
      "title": "Notice 2024-80, 2025 retirement-plan cost-of-living adjustments",
      "url": "https://www.irs.gov/pub/irs-irbs/irb24-47.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-coda-manual-2002",
      "title": "IRS Cash or Deferred Arrangements manual historical limitation table",
      "url": "https://www.irs.gov/pub/irs-tege/codas.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-sep-sarsep-audit",
      "title": "IRS SEP/SARSEP Audit Techniques",
      "url": "https://www.irs.gov/pub/irs-tege/epche1303.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-soi-ira-1983",
      "title": "IRS SOI Bulletin describing 1981-and-earlier and 1982 IRA limits",
      "url": "https://www.irs.gov/pub/irs-soi/83rpsumbul.pdf",
      "authority": "IRS"
    },
    {
      "id": "dol-401k-history",
      "title": "U.S. Department of Labor 401(k) plan history",
      "url": "https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/faqs/401k-plans",
      "authority": "DOL"
    },
    {
      "id": "irs-notice-2001-56",
      "title": "Notice 2001-56, compensation limitation under IRC 401(a)(17)",
      "url": "https://www.irs.gov/pub/irs-drop/n-01-56.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-employee-plans-news-fall-2009",
      "title": "Employee Plans News, Fall 2009: compensation and elective-deferral limits",
      "url": "https://www.irs.gov/pub/irs-tege/fall09.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-pub-535-2001",
      "title": "Publication 535 (2001), deduction worksheet for self-employed retirement-plan contributions",
      "url": "https://www.irs.gov/pub/irs-prior/p535--2001.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-sarsep-fix-it-guide-contribution-limits",
      "title": "SARSEP Fix-It Guide: contribution-limit and compensation rules",
      "url": "https://www.irs.gov/retirement-plans/sarsep-fix-it-guide-total-contributions-employee-elective-deferrals-and-nonelective-employer-contributions-exceeded-the-maximum-legal-limits",
      "authority": "IRS"
    },
    {
      "id": "usc-26-402",
      "title": "26 U.S.C. § 402(g)(7), special rule for certain 403(b) organizations",
      "url": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section402&num=0&edition=prelim",
      "authority": "U.S. House Office of the Law Revision Counsel"
    },
    {
      "id": "irs-pub-571-2001",
      "title": "IRS Publication 571 (2001), Tax-Sheltered Annuity Plans (403(b) Plans), maximum exclusion allowance and maximum amount contributable",
      "url": "https://www.irs.gov/pub/irs-prior/p571--2001.pdf",
      "authority": "IRS"
    },
    {
      "id": "pl-107-16",
      "title": "Economic Growth and Tax Relief Reconciliation Act of 2001, Pub. L. 107-16, 115 Stat. 38 (section 632 repeal of the IRC 403(b)(2) exclusion allowance and the IRC 415(c)(4) elections)",
      "url": "https://www.govinfo.gov/content/pkg/PLAW-107publ16/pdf/PLAW-107publ16.pdf",
      "authority": "U.S. Congress"
    },
    {
      "id": "usc-26-402A",
      "title": "26 U.S.C. § 402A(e), pension-linked emergency savings accounts, including the § 402A(e)(3)(A)(i) limitation and its post-2024 adjustment rule",
      "url": "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section402A&num=0&edition=prelim",
      "authority": "U.S. House Office of the Law Revision Counsel"
    }
  ],
  "years": {
    "1975": {
      "year": 1975,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": false,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": false,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": false,
        "baseDeferralLimit": null,
        "includibleCompensationFraction": null,
        "specialLastThreeYearsMaximum": null,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": false,
        "simpleIra": false,
        "traditional401k": false,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": false,
        "nongovernmental457b": false,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1976": {
      "year": 1976,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": false,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": false,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": false,
        "baseDeferralLimit": null,
        "includibleCompensationFraction": null,
        "specialLastThreeYearsMaximum": null,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": false,
        "simpleIra": false,
        "traditional401k": false,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": false,
        "nongovernmental457b": false,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1977": {
      "year": 1977,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": true,
        "oneEarnerHouseholdCombinedLimit": 1750,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": false,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": false,
        "baseDeferralLimit": null,
        "includibleCompensationFraction": null,
        "specialLastThreeYearsMaximum": null,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": false,
        "simpleIra": false,
        "traditional401k": false,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": false,
        "nongovernmental457b": false,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1978": {
      "year": 1978,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": true,
        "oneEarnerHouseholdCombinedLimit": 1750,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": false,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": false,
        "baseDeferralLimit": null,
        "includibleCompensationFraction": null,
        "specialLastThreeYearsMaximum": null,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": false,
        "simpleIra": false,
        "traditional401k": false,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": false,
        "nongovernmental457b": false,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1979": {
      "year": 1979,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": true,
        "oneEarnerHouseholdCombinedLimit": 1750,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": false,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1980": {
      "year": 1980,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": true,
        "oneEarnerHouseholdCombinedLimit": 1750,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1981": {
      "year": 1981,
      "ira": {
        "baseContributionLimit": 1500,
        "age50CatchUp": 0,
        "compensationFraction": 0.15,
        "universalEligibility": false,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": true,
        "oneEarnerHouseholdCombinedLimit": 1750,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1982": {
      "year": 1982,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1983": {
      "year": 1983,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1984": {
      "year": 1984,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1985": {
      "year": 1985,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1986": {
      "year": 1986,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": false,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": null,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": null,
      "annualAdditionsCompensationFraction": null,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": false,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": false,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1987": {
      "year": 1987,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 7000,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1988": {
      "year": 1988,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 7313,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": null,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1989": {
      "year": 1989,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 7627,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 200000,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1990": {
      "year": 1990,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 7979,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 209200,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1991": {
      "year": 1991,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 8475,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 222220,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1992": {
      "year": 1992,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 8728,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 228860,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1993": {
      "year": 1993,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 8994,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 235840,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1994": {
      "year": 1994,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 9240,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 150000,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1995": {
      "year": 1995,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 9240,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 150000,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1996": {
      "year": 1996,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": 2000,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": 2250,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 9500,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 150000,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
        "newSarsepMayBeEstablished": true,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": false,
        "salaryReductionLimit": null,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": false,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1997": {
      "year": 1997,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": false
      },
      "electiveDeferral402g": 9500,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 160000,
      "annualCompensation401a17GrandfatheredGovernmental": null,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": 400,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 6000,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 7500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": false,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            25000,
            35000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            40000,
            50000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": null
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1998": {
      "year": 1998,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 10000,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 160000,
      "annualCompensation401a17GrandfatheredGovernmental": 265000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": 400,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 6000,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 8000,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            30000,
            40000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            50000,
            60000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "1999": {
      "year": 1999,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 10000,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 160000,
      "annualCompensation401a17GrandfatheredGovernmental": 270000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": 400,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 6000,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 8000,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            31000,
            41000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            51000,
            61000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2000": {
      "year": 2000,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 10500,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 30000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 170000,
      "annualCompensation401a17GrandfatheredGovernmental": 275000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 6000,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 8000,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            32000,
            42000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            52000,
            62000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2001": {
      "year": 2001,
      "ira": {
        "baseContributionLimit": 2000,
        "age50CatchUp": 0,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 10500,
      "generalAge50CatchUp": 0,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 35000,
      "annualAdditionsCompensationFraction": 0.25,
      "annualCompensation401a17": 170000,
      "annualCompensation401a17GrandfatheredGovernmental": 285000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 6500,
        "generalAge50CatchUp": 0,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 8500,
        "includibleCompensationFraction": 0.3333333333333333,
        "specialLastThreeYearsMaximum": 15000,
        "governmentalAge50CatchUp": 0,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            33000,
            43000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            53000,
            63000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2002": {
      "year": 2002,
      "ira": {
        "baseContributionLimit": 3000,
        "age50CatchUp": 500,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 11000,
      "generalAge50CatchUp": 1000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 40000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 200000,
      "annualCompensation401a17GrandfatheredGovernmental": 295000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 7000,
        "generalAge50CatchUp": 500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 11000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 22000,
        "governmentalAge50CatchUp": 1000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            34000,
            44000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            54000,
            64000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2003": {
      "year": 2003,
      "ira": {
        "baseContributionLimit": 3000,
        "age50CatchUp": 500,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 12000,
      "generalAge50CatchUp": 2000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 40000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 200000,
      "annualCompensation401a17GrandfatheredGovernmental": 300000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 8000,
        "generalAge50CatchUp": 1000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 12000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 24000,
        "governmentalAge50CatchUp": 2000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            40000,
            50000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            60000,
            70000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2004": {
      "year": 2004,
      "ira": {
        "baseContributionLimit": 3000,
        "age50CatchUp": 500,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 13000,
      "generalAge50CatchUp": 3000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 41000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 205000,
      "annualCompensation401a17GrandfatheredGovernmental": 305000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 9000,
        "generalAge50CatchUp": 1500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 13000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 26000,
        "governmentalAge50CatchUp": 3000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            45000,
            55000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            65000,
            75000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2005": {
      "year": 2005,
      "ira": {
        "baseContributionLimit": 4000,
        "age50CatchUp": 500,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 14000,
      "generalAge50CatchUp": 4000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 42000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 210000,
      "annualCompensation401a17GrandfatheredGovernmental": 315000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 10000,
        "generalAge50CatchUp": 2000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 14000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 28000,
        "governmentalAge50CatchUp": 4000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": false,
        "traditional403b": true,
        "designatedRoth403b": false,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            50000,
            60000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            70000,
            80000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2006": {
      "year": 2006,
      "ira": {
        "baseContributionLimit": 4000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 15000,
      "generalAge50CatchUp": 5000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 44000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 220000,
      "annualCompensation401a17GrandfatheredGovernmental": 325000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 450,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 10000,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 15000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 30000,
        "governmentalAge50CatchUp": 5000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            50000,
            60000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            75000,
            85000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            95000,
            110000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            150000,
            160000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2007": {
      "year": 2007,
      "ira": {
        "baseContributionLimit": 4000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 15500,
      "generalAge50CatchUp": 5000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 45000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 225000,
      "annualCompensation401a17GrandfatheredGovernmental": 335000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 500,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 10500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 15500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 31000,
        "governmentalAge50CatchUp": 5000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            52000,
            62000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            83000,
            103000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            156000,
            166000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            99000,
            114000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            156000,
            166000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2008": {
      "year": 2008,
      "ira": {
        "baseContributionLimit": 5000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 15500,
      "generalAge50CatchUp": 5000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 46000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 230000,
      "annualCompensation401a17GrandfatheredGovernmental": 345000,
      "definedBenefitAnnualBenefit415b": null,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 500,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 10500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 15500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 31000,
        "governmentalAge50CatchUp": 5000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            53000,
            63000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            85000,
            105000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            159000,
            169000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            101000,
            116000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            159000,
            169000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2009": {
      "year": 2009,
      "ira": {
        "baseContributionLimit": 5000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 16500,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 49000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 245000,
      "annualCompensation401a17GrandfatheredGovernmental": 360000,
      "definedBenefitAnnualBenefit415b": 195000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 11500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 16500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 33000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            55000,
            65000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            89000,
            109000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            166000,
            176000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            105000,
            120000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            166000,
            176000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2010": {
      "year": 2010,
      "ira": {
        "baseContributionLimit": 5000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 16500,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 49000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 245000,
      "annualCompensation401a17GrandfatheredGovernmental": 360000,
      "definedBenefitAnnualBenefit415b": 195000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 11500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 16500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 33000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": false
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            56000,
            66000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            89000,
            109000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            167000,
            177000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            105000,
            120000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            167000,
            177000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2011": {
      "year": 2011,
      "ira": {
        "baseContributionLimit": 5000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 16500,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 49000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 245000,
      "annualCompensation401a17GrandfatheredGovernmental": 360000,
      "definedBenefitAnnualBenefit415b": 195000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 11500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 16500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 33000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": false,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            56000,
            66000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            90000,
            110000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            169000,
            179000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            107000,
            122000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            169000,
            179000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2012": {
      "year": 2012,
      "ira": {
        "baseContributionLimit": 5000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 17000,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 50000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 250000,
      "annualCompensation401a17GrandfatheredGovernmental": 375000,
      "definedBenefitAnnualBenefit415b": 200000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 11500,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 17000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 34000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            58000,
            68000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            92000,
            112000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            173000,
            183000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            110000,
            125000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            173000,
            183000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2013": {
      "year": 2013,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 17500,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 51000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 255000,
      "annualCompensation401a17GrandfatheredGovernmental": 380000,
      "definedBenefitAnnualBenefit415b": 205000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12000,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 17500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 35000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            59000,
            69000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            95000,
            115000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            178000,
            188000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            112000,
            127000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            178000,
            188000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2014": {
      "year": 2014,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 17500,
      "generalAge50CatchUp": 5500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 52000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 260000,
      "annualCompensation401a17GrandfatheredGovernmental": 385000,
      "definedBenefitAnnualBenefit415b": 210000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 550,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12000,
        "generalAge50CatchUp": 2500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 17500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 35000,
        "governmentalAge50CatchUp": 5500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            60000,
            70000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            96000,
            116000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            181000,
            191000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            114000,
            129000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            181000,
            191000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2015": {
      "year": 2015,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 18000,
      "generalAge50CatchUp": 6000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 53000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 265000,
      "annualCompensation401a17GrandfatheredGovernmental": 395000,
      "definedBenefitAnnualBenefit415b": 210000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 18000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 36000,
        "governmentalAge50CatchUp": 6000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            61000,
            71000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            98000,
            118000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            183000,
            193000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            116000,
            131000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            183000,
            193000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2016": {
      "year": 2016,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 18000,
      "generalAge50CatchUp": 6000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 53000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 265000,
      "annualCompensation401a17GrandfatheredGovernmental": 395000,
      "definedBenefitAnnualBenefit415b": 210000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 18000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 36000,
        "governmentalAge50CatchUp": 6000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            61000,
            71000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            98000,
            118000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            184000,
            194000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            117000,
            132000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            184000,
            194000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2017": {
      "year": 2017,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 18000,
      "generalAge50CatchUp": 6000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 54000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 270000,
      "annualCompensation401a17GrandfatheredGovernmental": 400000,
      "definedBenefitAnnualBenefit415b": 215000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 18000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 36000,
        "governmentalAge50CatchUp": 6000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            62000,
            72000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            99000,
            119000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            186000,
            196000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            118000,
            133000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            186000,
            196000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2018": {
      "year": 2018,
      "ira": {
        "baseContributionLimit": 5500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 18500,
      "generalAge50CatchUp": 6000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 55000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 275000,
      "annualCompensation401a17GrandfatheredGovernmental": 405000,
      "definedBenefitAnnualBenefit415b": 220000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 12500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 18500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 37000,
        "governmentalAge50CatchUp": 6000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            63000,
            73000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            101000,
            121000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            189000,
            199000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            120000,
            135000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            189000,
            199000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2019": {
      "year": 2019,
      "ira": {
        "baseContributionLimit": 6000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": true,
        "rothAvailable": true
      },
      "electiveDeferral402g": 19000,
      "generalAge50CatchUp": 6000,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 56000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 280000,
      "annualCompensation401a17GrandfatheredGovernmental": 415000,
      "definedBenefitAnnualBenefit415b": 225000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 13000,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 19000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 38000,
        "governmentalAge50CatchUp": 6000,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            64000,
            74000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            103000,
            123000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            193000,
            203000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            122000,
            137000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            193000,
            203000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2020": {
      "year": 2020,
      "ira": {
        "baseContributionLimit": 6000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 19500,
      "generalAge50CatchUp": 6500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 57000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 285000,
      "annualCompensation401a17GrandfatheredGovernmental": 425000,
      "definedBenefitAnnualBenefit415b": 230000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 600,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 13500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 19500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 39000,
        "governmentalAge50CatchUp": 6500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            65000,
            75000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            104000,
            124000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            196000,
            206000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            124000,
            139000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            196000,
            206000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2021": {
      "year": 2021,
      "ira": {
        "baseContributionLimit": 6000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 19500,
      "generalAge50CatchUp": 6500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 58000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 290000,
      "annualCompensation401a17GrandfatheredGovernmental": 430000,
      "definedBenefitAnnualBenefit415b": 230000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 650,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 13500,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 19500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 39000,
        "governmentalAge50CatchUp": 6500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            66000,
            76000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            105000,
            125000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            198000,
            208000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            125000,
            140000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            198000,
            208000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2022": {
      "year": 2022,
      "ira": {
        "baseContributionLimit": 6000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 20500,
      "generalAge50CatchUp": 6500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 61000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 305000,
      "annualCompensation401a17GrandfatheredGovernmental": 450000,
      "definedBenefitAnnualBenefit415b": 245000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 650,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": false
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 14000,
        "generalAge50CatchUp": 3000,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 20500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 41000,
        "governmentalAge50CatchUp": 6500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": false,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            68000,
            78000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            109000,
            129000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            204000,
            214000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            129000,
            144000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            204000,
            214000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2023": {
      "year": 2023,
      "ira": {
        "baseContributionLimit": 6500,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 22500,
      "generalAge50CatchUp": 7500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 66000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 330000,
      "annualCompensation401a17GrandfatheredGovernmental": 490000,
      "definedBenefitAnnualBenefit415b": 265000,
      "pensionLinkedEmergencySavingsBalanceCap402A": null,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 750,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": true
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 15500,
        "generalAge50CatchUp": 3500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": null,
        "certainPlanAge50CatchUp": null,
        "additionalNonelectiveContributionCap": null
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 22500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 45000,
        "governmentalAge50CatchUp": 7500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": false,
        "baseDeferralLimit": null,
        "age50CatchUp": 0
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": true,
        "starter401kOrSafeHarbor403b": false,
        "pensionLinkedEmergencySavings": false
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            73000,
            83000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            116000,
            136000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            218000,
            228000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            138000,
            153000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            218000,
            228000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2024": {
      "year": 2024,
      "ira": {
        "baseContributionLimit": 7000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 23000,
      "generalAge50CatchUp": 7500,
      "age60To63CatchUp": null,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 69000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 345000,
      "annualCompensation401a17GrandfatheredGovernmental": 505000,
      "definedBenefitAnnualBenefit415b": 275000,
      "pensionLinkedEmergencySavingsBalanceCap402A": 2500,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 750,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": true
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 16000,
        "generalAge50CatchUp": 3500,
        "age60To63CatchUp": null,
        "certainPlanEnhancedSalaryReductionLimit": 17600,
        "certainPlanAge50CatchUp": 3850,
        "additionalNonelectiveContributionCap": 5000
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 23000,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 46000,
        "governmentalAge50CatchUp": 7500,
        "governmentalAge60To63CatchUp": null,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": true,
        "baseDeferralLimit": 6000,
        "age50CatchUp": 1000
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": true,
        "starter401kOrSafeHarbor403b": true,
        "pensionLinkedEmergencySavings": true
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            77000,
            87000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            123000,
            143000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            230000,
            240000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            146000,
            161000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            230000,
            240000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2025": {
      "year": 2025,
      "ira": {
        "baseContributionLimit": 7000,
        "age50CatchUp": 1000,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 23500,
      "generalAge50CatchUp": 7500,
      "age60To63CatchUp": 11250,
      "rothCatchUpPriorYearFicaWageThreshold": null,
      "annualAdditions415c": 70000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 350000,
      "annualCompensation401a17GrandfatheredGovernmental": 520000,
      "definedBenefitAnnualBenefit415b": 280000,
      "pensionLinkedEmergencySavingsBalanceCap402A": 2500,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 750,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": true
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 16500,
        "generalAge50CatchUp": 3500,
        "age60To63CatchUp": 5250,
        "certainPlanEnhancedSalaryReductionLimit": 17600,
        "certainPlanAge50CatchUp": 3850,
        "additionalNonelectiveContributionCap": 5100
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 23500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 47000,
        "governmentalAge50CatchUp": 7500,
        "governmentalAge60To63CatchUp": 11250,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": true,
        "baseDeferralLimit": 6000,
        "age50CatchUp": 1000
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": true,
        "starter401kOrSafeHarbor403b": true,
        "pensionLinkedEmergencySavings": true
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            79000,
            89000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            126000,
            146000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            236000,
            246000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            150000,
            165000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            236000,
            246000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    },
    "2026": {
      "year": 2026,
      "ira": {
        "baseContributionLimit": 7500,
        "age50CatchUp": 1100,
        "compensationFraction": 1,
        "universalEligibility": true,
        "nondeductibleContributionAvailable": true,
        "spousalIraAvailable": true,
        "nonworkingSpouseIndividualLimit": null,
        "spousalDeductionIsTwiceTheLesserOfContributions": false,
        "oneEarnerHouseholdCombinedLimit": null,
        "traditionalContributionAge70HalfRestriction": false,
        "rothAvailable": true
      },
      "electiveDeferral402g": 24500,
      "generalAge50CatchUp": 8000,
      "age60To63CatchUp": 11250,
      "rothCatchUpPriorYearFicaWageThreshold": 150000,
      "annualAdditions415c": 72000,
      "annualAdditionsCompensationFraction": 1,
      "annualCompensation401a17": 360000,
      "annualCompensation401a17GrandfatheredGovernmental": 535000,
      "definedBenefitAnnualBenefit415b": 290000,
      "pensionLinkedEmergencySavingsBalanceCap402A": 2600,
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.25,
        "selfEmployedEquivalentRate": 0.2,
        "minimumEligibleCompensation": 800,
        "newSarsepMayBeEstablished": false,
        "grandfatheredSarsepMayOperate": true,
        "rothSepAvailable": true
      },
      "simple": {
        "available": true,
        "salaryReductionLimit": 17000,
        "generalAge50CatchUp": 4000,
        "age60To63CatchUp": 5250,
        "certainPlanEnhancedSalaryReductionLimit": 18100,
        "certainPlanAge50CatchUp": 3850,
        "additionalNonelectiveContributionCap": 5300
      },
      "section457b": {
        "available": true,
        "baseDeferralLimit": 24500,
        "includibleCompensationFraction": 1,
        "specialLastThreeYearsMaximum": 49000,
        "governmentalAge50CatchUp": 8000,
        "governmentalAge60To63CatchUp": 11250,
        "designatedRothAvailableForGovernmentalPlans": true
      },
      "starterDeferralOnly": {
        "available": true,
        "baseDeferralLimit": 6000,
        "age50CatchUp": 1100
      },
      "availability": {
        "traditionalIra": true,
        "rothIra": true,
        "sepIra": true,
        "simpleIra": true,
        "traditional401k": true,
        "designatedRoth401k": true,
        "traditional403b": true,
        "designatedRoth403b": true,
        "governmental457b": true,
        "nongovernmental457b": true,
        "traditionalTsp": true,
        "rothTsp": true,
        "rothSimpleOrSep": true,
        "starter401kOrSafeHarbor403b": true,
        "pensionLinkedEmergencySavings": true
      },
      "phaseouts": {
        "traditionalIraCovered": {
          "singleOrHeadOfHousehold": [
            81000,
            91000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            129000,
            149000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "traditionalIraSpouseCovered": {
          "marriedFilingJointly": [
            242000,
            252000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        },
        "rothIra": {
          "singleOrHeadOfHousehold": [
            153000,
            168000
          ],
          "marriedFilingJointlyOrQualifyingSurvivingSpouse": [
            242000,
            252000
          ],
          "marriedFilingSeparatelyLivingTogether": [
            0,
            10000
          ]
        }
      },
      "special403b15YearCatchUp": {
        "annualLimit": 3000,
        "lifetimeLimit": 15000,
        "serviceLimitPerYear": 5000
      }
    }
  }
} as ParameterData;
/* </generated-parameters> */

/* <generated-hsa-parameters> */
const RAW_HSA_PARAMETERS: HsaParameterData = {
  "schemaVersion": 1,
  "package": "us-tax-advantaged-params",
  "generatedThroughTaxYear": 2026,
  "supportedTaxYears": {
    "minimum": 2004,
    "maximum": 2026
  },
  "moneyUnit": "USD",
  "proration": {
    "method": "sum_annual_amounts_for_eligible_months_then_divide_by_twelve",
    "monthsInYear": 12
  },
  "historicalCoveragePolicy": {
    "description": "Health savings accounts were created by the Medicare Prescription Drug, Improvement, and Modernization Act of 2003 section 1201, effective for taxable years beginning after December 31, 2003. The table therefore starts at 2004 and is never extrapolated forward: a tax year with no published revenue procedure returns an unavailable status and a diagnostic rather than an inflation-projected amount.",
    "preTaxRelief2006DeductibleCap": "For 2004 through 2006, IRC 223(b)(2) capped each month's limitation at 1/12 of the lesser of the plan's annual deductible and the statutory dollar amount. The Tax Relief and Health Care Act of 2006 section 303 removed that cap for taxable years beginning after 2006. In the capped years the engine requires the plan's annual deductible and returns an indeterminate result without it.",
    "lastMonthRuleEffectiveDate": "The IRC 223(b)(8) last-month rule was added by the Tax Relief and Health Care Act of 2006 section 305, effective for taxable years beginning after December 31, 2006. It is not an election: IRC 223(b)(8)(A) treats a December-eligible individual as an eligible individual for the whole year, so the engine takes Notice 2008-52's greater-of from the coverage facts wherever lastMonthRuleAvailable is true. An earlier year simply has the ordinary month-by-month limitation, with no diagnostic, because nothing the caller stated went unhonoured."
  },
  "sources": [
    {
      "id": "usc-26-223",
      "title": "26 U.S.C. 223, Health savings accounts (2023 edition of the United States Code)",
      "url": "https://www.govinfo.gov/content/pkg/USCODE-2023-title26/pdf/USCODE-2023-title26-subtitleA-chap1-subchapB-partVII-sec223.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "irs-notice-2004-2",
      "title": "Notice 2004-2, Health Savings Accounts (2004 amounts and the IRC 223(b)(3) catch-up schedule)",
      "url": "https://www.irs.gov/pub/irs-drop/n-04-2.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2004-71",
      "title": "Rev. Proc. 2004-71, section 3.22, 2005 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-04-71.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2005-70",
      "title": "Rev. Proc. 2005-70, section 3.22, 2006 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-05-70.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2006-53",
      "title": "Rev. Proc. 2006-53, section 3.24, 2007 high deductible health plan amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-06-53.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2007-36",
      "title": "Rev. Proc. 2007-36, restated 2007 and new 2008 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-07-36.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2008-29",
      "title": "Rev. Proc. 2008-29, 2009 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-08-29.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2009-29",
      "title": "Rev. Proc. 2009-29, 2010 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-09-29.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2010-22",
      "title": "Rev. Proc. 2010-22, 2011 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-10-22.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2011-32",
      "title": "Rev. Proc. 2011-32, 2012 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-11-32.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2012-26",
      "title": "Rev. Proc. 2012-26, 2013 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-12-26.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2013-25",
      "title": "Rev. Proc. 2013-25, 2014 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-13-25.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2014-30",
      "title": "Rev. Proc. 2014-30, 2015 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-14-30.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2015-30",
      "title": "Rev. Proc. 2015-30, 2016 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-15-30.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2016-28",
      "title": "Rev. Proc. 2016-28, 2017 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-16-28.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2017-37",
      "title": "Rev. Proc. 2017-37, 2018 health savings account amounts as first announced",
      "url": "https://www.irs.gov/pub/irs-drop/rp-17-37.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2018-18",
      "title": "Rev. Proc. 2018-18 (Internal Revenue Bulletin 2018-10), which briefly reduced the 2018 family limit to $6,850",
      "url": "https://www.irs.gov/pub/irs-irbs/irb18-10.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2018-27",
      "title": "Rev. Proc. 2018-27, restoring $6,900 as the operative 2018 family limit",
      "url": "https://www.irs.gov/pub/irs-drop/rp-18-27.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2018-30",
      "title": "Rev. Proc. 2018-30, 2019 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-18-30.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2019-25",
      "title": "Rev. Proc. 2019-25 (Internal Revenue Bulletin 2019-22), 2020 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-irbs/irb19-22.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2020-32",
      "title": "Rev. Proc. 2020-32, 2021 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-20-32.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2021-25",
      "title": "Rev. Proc. 2021-25, 2022 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-21-25.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2022-24",
      "title": "Rev. Proc. 2022-24, 2023 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-22-24.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2023-23",
      "title": "Rev. Proc. 2023-23, 2024 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-23-23.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2024-25",
      "title": "Rev. Proc. 2024-25, 2025 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-24-25.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2025-19",
      "title": "Rev. Proc. 2025-19, 2026 health savings account amounts",
      "url": "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf",
      "authority": "IRS"
    }
  ],
  "years": {
    "2004": {
      "year": 2004,
      "annualContributionLimit": {
        "selfOnly": 2600,
        "family": 5150
      },
      "additionalContributionAmountAge55": 500,
      "contributionLimitCappedByHdhpAnnualDeductible": true,
      "lastMonthRuleAvailable": false,
      "testingPeriodMonths": null,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1000,
          "family": 2000
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5000,
          "family": 10000
        }
      }
    },
    "2005": {
      "year": 2005,
      "annualContributionLimit": {
        "selfOnly": 2650,
        "family": 5250
      },
      "additionalContributionAmountAge55": 600,
      "contributionLimitCappedByHdhpAnnualDeductible": true,
      "lastMonthRuleAvailable": false,
      "testingPeriodMonths": null,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1000,
          "family": 2000
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5100,
          "family": 10200
        }
      }
    },
    "2006": {
      "year": 2006,
      "annualContributionLimit": {
        "selfOnly": 2700,
        "family": 5450
      },
      "additionalContributionAmountAge55": 700,
      "contributionLimitCappedByHdhpAnnualDeductible": true,
      "lastMonthRuleAvailable": false,
      "testingPeriodMonths": null,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1050,
          "family": 2100
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5250,
          "family": 10500
        }
      }
    },
    "2007": {
      "year": 2007,
      "annualContributionLimit": {
        "selfOnly": 2850,
        "family": 5650
      },
      "additionalContributionAmountAge55": 800,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1100,
          "family": 2200
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5500,
          "family": 11000
        }
      }
    },
    "2008": {
      "year": 2008,
      "annualContributionLimit": {
        "selfOnly": 2900,
        "family": 5800
      },
      "additionalContributionAmountAge55": 900,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1100,
          "family": 2200
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5600,
          "family": 11200
        }
      }
    },
    "2009": {
      "year": 2009,
      "annualContributionLimit": {
        "selfOnly": 3000,
        "family": 5950
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1150,
          "family": 2300
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5800,
          "family": 11600
        }
      }
    },
    "2010": {
      "year": 2010,
      "annualContributionLimit": {
        "selfOnly": 3050,
        "family": 6150
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1200,
          "family": 2400
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5950,
          "family": 11900
        }
      }
    },
    "2011": {
      "year": 2011,
      "annualContributionLimit": {
        "selfOnly": 3050,
        "family": 6150
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1200,
          "family": 2400
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 5950,
          "family": 11900
        }
      }
    },
    "2012": {
      "year": 2012,
      "annualContributionLimit": {
        "selfOnly": 3100,
        "family": 6250
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1200,
          "family": 2400
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6050,
          "family": 12100
        }
      }
    },
    "2013": {
      "year": 2013,
      "annualContributionLimit": {
        "selfOnly": 3250,
        "family": 6450
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1250,
          "family": 2500
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6250,
          "family": 12500
        }
      }
    },
    "2014": {
      "year": 2014,
      "annualContributionLimit": {
        "selfOnly": 3300,
        "family": 6550
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1250,
          "family": 2500
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6350,
          "family": 12700
        }
      }
    },
    "2015": {
      "year": 2015,
      "annualContributionLimit": {
        "selfOnly": 3350,
        "family": 6650
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1300,
          "family": 2600
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6450,
          "family": 12900
        }
      }
    },
    "2016": {
      "year": 2016,
      "annualContributionLimit": {
        "selfOnly": 3350,
        "family": 6750
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1300,
          "family": 2600
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6550,
          "family": 13100
        }
      }
    },
    "2017": {
      "year": 2017,
      "annualContributionLimit": {
        "selfOnly": 3400,
        "family": 6750
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1300,
          "family": 2600
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6550,
          "family": 13100
        }
      }
    },
    "2018": {
      "year": 2018,
      "annualContributionLimit": {
        "selfOnly": 3450,
        "family": 6900
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1350,
          "family": 2700
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6650,
          "family": 13300
        }
      }
    },
    "2019": {
      "year": 2019,
      "annualContributionLimit": {
        "selfOnly": 3500,
        "family": 7000
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1350,
          "family": 2700
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6750,
          "family": 13500
        }
      }
    },
    "2020": {
      "year": 2020,
      "annualContributionLimit": {
        "selfOnly": 3550,
        "family": 7100
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1400,
          "family": 2800
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 6900,
          "family": 13800
        }
      }
    },
    "2021": {
      "year": 2021,
      "annualContributionLimit": {
        "selfOnly": 3600,
        "family": 7200
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1400,
          "family": 2800
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 7000,
          "family": 14000
        }
      }
    },
    "2022": {
      "year": 2022,
      "annualContributionLimit": {
        "selfOnly": 3650,
        "family": 7300
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1400,
          "family": 2800
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 7050,
          "family": 14100
        }
      }
    },
    "2023": {
      "year": 2023,
      "annualContributionLimit": {
        "selfOnly": 3850,
        "family": 7750
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1500,
          "family": 3000
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 7500,
          "family": 15000
        }
      }
    },
    "2024": {
      "year": 2024,
      "annualContributionLimit": {
        "selfOnly": 4150,
        "family": 8300
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1600,
          "family": 3200
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 8050,
          "family": 16100
        }
      }
    },
    "2025": {
      "year": 2025,
      "annualContributionLimit": {
        "selfOnly": 4300,
        "family": 8550
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1650,
          "family": 3300
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 8300,
          "family": 16600
        }
      }
    },
    "2026": {
      "year": 2026,
      "annualContributionLimit": {
        "selfOnly": 4400,
        "family": 8750
      },
      "additionalContributionAmountAge55": 1000,
      "contributionLimitCappedByHdhpAnnualDeductible": false,
      "lastMonthRuleAvailable": true,
      "testingPeriodMonths": 13,
      "hdhp": {
        "minimumAnnualDeductible": {
          "selfOnly": 1700,
          "family": 3400
        },
        "maximumAnnualOutOfPocket": {
          "selfOnly": 8500,
          "family": 17000
        }
      }
    }
  }
} as HsaParameterData;
/* </generated-hsa-parameters> */

/* <generated-fsa-parameters> */
const RAW_FSA_PARAMETERS: FsaParameterData = {
  "schemaVersion": 1,
  "package": "us-tax-advantaged-params",
  "generatedThroughTaxYear": 2026,
  "supportedTaxYears": {
    "minimum": 1982,
    "maximum": 2026
  },
  "moneyUnit": "USD",
  "historicalCoveragePolicy": {
    "description": "IRC 129(a)(2)(A) fixes the dependent care assistance exclusion, and IRC 125(i) fixes the health flexible spending arrangement salary-reduction limit. The table starts at 1987, the first taxable year for which Pub. L. 99-514 section 1163 supplied a dependent care dollar limitation, and is never extrapolated forward: a tax year with no published figure returns an unavailable or indeterminate status and a diagnostic rather than a projected amount.",
    "healthFsaFirstYear": "IRC 125(i) was added by the Patient Protection and Affordable Care Act, Pub. L. 111-148, section 9005, amended by section 10902 of that Act and by section 1403(b) of the Health Care and Education Reconciliation Act of 2010, Pub. L. 111-152. Notice 2012-40 reads its effective date as applying to plan years beginning after December 31, 2012. Before that there was no statutory salary-reduction ceiling at all, only whatever the plan document imposed, so healthFsa is null for 1987 through 2012 and the engine returns an indeterminate result rather than a fabricated ceiling.",
    "planYearVersusTaxYear": "Notice 2012-40 section III holds that the term \"taxable year\" in IRC 125(i) refers to the plan year of the cafeteria plan, so the statutory limit runs on a plan-year basis. Every annual revenue procedure nonetheless publishes the figure \"for taxable years beginning in\" the year, and this package is keyed by tax year throughout. Rows are therefore keyed by tax year and are exact for a calendar-year plan. For a non-calendar plan year the applicable figure depends on the plan year start date, which is a fact this engine does not hold, so it diagnoses rather than assuming.",
    "healthFsaCarryoverBelongsToSourceYear": "Notice 2013-71 section III created the carryover as a plan option at a fixed $500, and Notice 2020-33 section III.A raised it to 20 percent of the IRC 125(i) limit for the plan year and indexed it with that limit. Both phrase it as the maximum unused amount FROM a plan year carried to the immediately following plan year, so carryoverLimit belongs to the year the funds came from and never to the year they land in. Notice 2013-71 also holds that the carryover does not count against or otherwise affect the IRC 125(i) limit of the receiving year, and that a plan may offer a carryover or a grace period but not both.",
    "section214ReliefNotModelled": "Section 214 of the Consolidated Appropriations Act, 2021, Pub. L. 116-260, implemented by Notice 2021-15, permitted a plan to carry over ALL unused amounts from plan years ending in 2020 and in 2021, and permitted a dependent care carryover that is otherwise forbidden. It is entirely a plan option that the engine cannot read, so it is not modelled; a carryover computed out of a 2020 or 2021 plan year carries a diagnostic saying so rather than silently applying the ordinary cap.",
    "dependentCareNotIndexed": "The IRC 129(a)(2)(A) amounts are statutory and carry no inflation adjustment, which is why they never appear in the annual revenue procedures. They changed twice: Pub. L. 117-2 section 9632 substituted $10,500 (half that for a married separate return) for taxable years beginning after December 31, 2020 and before January 1, 2022, and Pub. L. 119-21 section 70404 substituted $7,500 ($3,750) for taxable years beginning after December 31, 2025. Each year is encoded as its own row so the 2021 increase and its reversion are both data rather than a rule."
  },
  "sources": [
    {
      "id": "usc-26-125",
      "title": "26 U.S.C. 125, Cafeteria plans (2024 edition of the United States Code)",
      "url": "https://www.govinfo.gov/content/pkg/USCODE-2024-title26/pdf/USCODE-2024-title26-subtitleA-chap1-subchapB-partIII-sec125.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "usc-26-129",
      "title": "26 U.S.C. 129, Dependent care assistance programs (2024 edition of the United States Code)",
      "url": "https://www.govinfo.gov/content/pkg/USCODE-2024-title26/pdf/USCODE-2024-title26-subtitleA-chap1-subchapB-partIII-sec129.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "pl-117-2",
      "title": "American Rescue Plan Act of 2021, Pub. L. 117-2, section 9632 (2021-only dependent care exclusion)",
      "url": "https://www.govinfo.gov/content/pkg/PLAW-117publ2/pdf/PLAW-117publ2.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "pl-119-21",
      "title": "Pub. L. 119-21, section 70404 (dependent care exclusion raised for taxable years beginning after 2025)",
      "url": "https://www.govinfo.gov/content/pkg/PLAW-119publ21/pdf/PLAW-119publ21.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "irs-notice-2012-40",
      "title": "Notice 2012-40, the $2,500 IRC 125(i) limit, its plan-year basis, and the per-employer rule",
      "url": "https://www.irs.gov/pub/irs-drop/n-12-40.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2013-71",
      "title": "Notice 2013-71, modification of the use-or-lose rule to permit a $500 health FSA carryover",
      "url": "https://www.irs.gov/pub/irs-drop/n-13-71.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2020-33",
      "title": "Notice 2020-33, carryover indexed at 20 percent of the IRC 125(i) limit",
      "url": "https://www.irs.gov/pub/irs-drop/n-20-33.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2005-42",
      "title": "Notice 2005-42, the grace period of up to two months and 15 days",
      "url": "https://www.irs.gov/pub/irs-drop/n-05-42.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2005-86",
      "title": "Notice 2005-86, health savings account eligibility during a cafeteria plan grace period",
      "url": "https://www.irs.gov/pub/irs-drop/n-05-86.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2021-15",
      "title": "Notice 2021-15, the Consolidated Appropriations Act, 2021 section 214 temporary carryover relief",
      "url": "https://www.irs.gov/pub/irs-drop/n-21-15.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-notice-2021-26",
      "title": "Notice 2021-26, the ARPA section 9632 dependent care increase and its interaction with section 214 carryovers",
      "url": "https://www.irs.gov/pub/irs-drop/n-21-26.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-rul-2004-45",
      "title": "Rev. Rul. 2004-45, general-purpose, limited-purpose, and post-deductible health FSAs under IRC 223(c)(1)(A)(ii)",
      "url": "https://www.irs.gov/pub/irs-drop/rr-04-45.pdf",
      "authority": "IRS"
    },
    {
      "id": "fr-72-43938",
      "title": "72 Fed. Reg. 43938 (Aug. 6, 2007), proposed regulations under IRC 125, including Prop. Treas. Reg. 1.125-1(e) and 1.125-5(b)",
      "url": "https://www.govinfo.gov/content/pkg/FR-2007-08-06/pdf/E7-14827.pdf",
      "authority": "U.S. Government Publishing Office"
    },
    {
      "id": "irs-rev-proc-2012-41",
      "title": "Internal Revenue Bulletin 2012-45, carrying Rev. Proc. 2012-41, whose 2013 adjusted items contain no Cafeteria Plans entry",
      "url": "https://www.irs.gov/pub/irs-irbs/irb12-45.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2013-35",
      "title": "Rev. Proc. 2013-35, section 3.15, 2014 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-13-35.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2014-61",
      "title": "Rev. Proc. 2014-61, section 3.16, 2015 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-14-61.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2015-53",
      "title": "Rev. Proc. 2015-53, section 3.16, 2016 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-15-53.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2016-55",
      "title": "Rev. Proc. 2016-55, section 3.16, 2017 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-16-55.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2017-58",
      "title": "Rev. Proc. 2017-58, section 3.16, 2018 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-17-58.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2018-18",
      "title": "Internal Revenue Bulletin 2018-10, carrying Rev. Proc. 2018-18, which reissued 2018 figures after the Tax Cuts and Jobs Act without touching section 3.16",
      "url": "https://www.irs.gov/pub/irs-irbs/irb18-10.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2018-57",
      "title": "Rev. Proc. 2018-57, section 3.17, 2019 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-18-57.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2019-44",
      "title": "Rev. Proc. 2019-44, section 3.17, 2020 cafeteria plan amount",
      "url": "https://www.irs.gov/pub/irs-drop/rp-19-44.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2020-45",
      "title": "Rev. Proc. 2020-45, section 3.17, 2021 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-20-45.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2021-45",
      "title": "Rev. Proc. 2021-45, section 3.16, 2022 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-21-45.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2022-38",
      "title": "Rev. Proc. 2022-38, section 3.16, 2023 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-22-38.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2023-34",
      "title": "Rev. Proc. 2023-34, section 3.16, 2024 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-23-34.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2024-40",
      "title": "Rev. Proc. 2024-40, section 3.16, 2025 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-24-40.pdf",
      "authority": "IRS"
    },
    {
      "id": "irs-rev-proc-2025-32",
      "title": "Rev. Proc. 2025-32, section 3.15, 2026 cafeteria plan amount and maximum carryover",
      "url": "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
      "authority": "IRS"
    },
    {
      "id": "pl-97-34",
      "title": "Economic Recovery Tax Act of 1981, Pub. L. 97-34, section 124 (adds IRC 129; section 124(f) effective for taxable years beginning after December 31, 1981)",
      "url": "https://www.govinfo.gov/content/pkg/STATUTE-95/pdf/STATUTE-95-Pg172.pdf",
      "authority": "U.S. Government Publishing Office",
      "retrieval": "linked, not committed: the Statutes at Large volume is ~30 MB. The same file is committed in evidence/retirement-limits/sources/statute-95-pg172.pdf and is hash-verified there, so the bytes are attested in this repository without a second copy."
    },
    {
      "id": "pl-99-514",
      "title": "Tax Reform Act of 1986, Pub. L. 99-514, section 1163(a) (adds the IRC 129(a)(2)(A) dollar limitation for taxable years beginning after December 31, 1986)",
      "url": "https://www.govinfo.gov/content/pkg/STATUTE-100/pdf/STATUTE-100-Pg2085.pdf",
      "authority": "U.S. Government Publishing Office",
      "retrieval": "linked, not committed: the Statutes at Large volume is ~138 MB, which is disproportionate to one effective-date sentence. The same effective date is carried by the amendment notes in the committed usc-26-129.pdf, which is what the corpus verifies against."
    }
  ],
  "years": {
    "1982": {
      "year": 1982,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "available_without_statutory_dollar_limit",
        "exclusionLimit": null,
        "marriedFilingSeparatelyExclusionLimit": null
      }
    },
    "1983": {
      "year": 1983,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "available_without_statutory_dollar_limit",
        "exclusionLimit": null,
        "marriedFilingSeparatelyExclusionLimit": null
      }
    },
    "1984": {
      "year": 1984,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "available_without_statutory_dollar_limit",
        "exclusionLimit": null,
        "marriedFilingSeparatelyExclusionLimit": null
      }
    },
    "1985": {
      "year": 1985,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "available_without_statutory_dollar_limit",
        "exclusionLimit": null,
        "marriedFilingSeparatelyExclusionLimit": null
      }
    },
    "1986": {
      "year": 1986,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "available_without_statutory_dollar_limit",
        "exclusionLimit": null,
        "marriedFilingSeparatelyExclusionLimit": null
      }
    },
    "1987": {
      "year": 1987,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1988": {
      "year": 1988,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1989": {
      "year": 1989,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1990": {
      "year": 1990,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1991": {
      "year": 1991,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1992": {
      "year": 1992,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1993": {
      "year": 1993,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1994": {
      "year": 1994,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1995": {
      "year": 1995,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1996": {
      "year": 1996,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1997": {
      "year": 1997,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1998": {
      "year": 1998,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "1999": {
      "year": 1999,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2000": {
      "year": 2000,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2001": {
      "year": 2001,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2002": {
      "year": 2002,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2003": {
      "year": 2003,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2004": {
      "year": 2004,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2005": {
      "year": 2005,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2006": {
      "year": 2006,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2007": {
      "year": 2007,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2008": {
      "year": 2008,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2009": {
      "year": 2009,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2010": {
      "year": 2010,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2011": {
      "year": 2011,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2012": {
      "year": 2012,
      "healthFsa": {
        "state": "available_without_statutory_dollar_limit",
        "salaryReductionLimit": null,
        "carryoverLimit": null
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2013": {
      "year": 2013,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2500,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2014": {
      "year": 2014,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2500,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2015": {
      "year": 2015,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2550,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2016": {
      "year": 2016,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2550,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2017": {
      "year": 2017,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2600,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2018": {
      "year": 2018,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2650,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2019": {
      "year": 2019,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2700,
        "carryoverLimit": 500
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2020": {
      "year": 2020,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2750,
        "carryoverLimit": 550
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2021": {
      "year": 2021,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2750,
        "carryoverLimit": 550
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 10500,
        "marriedFilingSeparatelyExclusionLimit": 5250
      }
    },
    "2022": {
      "year": 2022,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 2850,
        "carryoverLimit": 570
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2023": {
      "year": 2023,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 3050,
        "carryoverLimit": 610
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2024": {
      "year": 2024,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 3200,
        "carryoverLimit": 640
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2025": {
      "year": 2025,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 3300,
        "carryoverLimit": 660
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 5000,
        "marriedFilingSeparatelyExclusionLimit": 2500
      }
    },
    "2026": {
      "year": 2026,
      "healthFsa": {
        "state": "statutory_dollar_limit",
        "salaryReductionLimit": 3400,
        "carryoverLimit": 680
      },
      "dependentCare": {
        "state": "statutory_dollar_limit",
        "exclusionLimit": 7500,
        "marriedFilingSeparatelyExclusionLimit": 3750
      }
    }
  },
  "dollarLimitStates": {
    "unavailable": "The program did not exist for the tax year. A year below supportedTaxYears.minimum is unavailable by absence: IRC 129 was added by Pub. L. 97-34 section 124 for taxable years beginning after December 31, 1981.",
    "available_without_statutory_dollar_limit": "The program existed and its exclusion applied, but no universal statutory dollar ceiling did. The statutory maximum is null; a maximum computed from caller-supplied plan terms or earned income is still a real answer and is reported as such.",
    "statutory_dollar_limit": "A published statutory dollar ceiling applies and is encoded."
  }
} as FsaParameterData;
/* </generated-fsa-parameters> */

export class ParameterError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = "ParameterError";
    this.code = code;
  }
}

export class UnsupportedTaxYearError extends ParameterError {
  public constructor(year: number, minimum: number, maximum: number) {
    super(
      "UNSUPPORTED_TAX_YEAR",
      `Tax year ${year} is not supported. Supported years are ${minimum}-${maximum}; future years are never extrapolated.`,
    );
    this.name = "UnsupportedTaxYearError";
  }
}

interface AccountTraits {
  family:
    | "regular_traditional_ira"
    | "regular_roth_ira"
    | "inherited_ira"
    | "sep"
    | "simple"
    | "qualified_elective"
    | "section457"
    | "annual_additions_only"
    | "defined_benefit"
    | "section457f"
    | "hsa"
    | "health_fsa"
    | "dependent_care_fsa";
  availabilityKey?: string;
  designatedRoth: boolean;
  shares402g: boolean;
  uses415c: boolean;
  permitsAgeCatchUpByStatute: boolean;
  governmental457: boolean;
  is403b: boolean;
  isStarter: boolean;
  isPlesa: boolean;
  isSimple: boolean;
  isSarsep: boolean;
  employerOnly: boolean;
}

const ACCOUNT_TRAITS: Record<AccountType, AccountTraits> = {
  [AccountType.TRADITIONAL_IRA]: regularTraditionalIraTraits(),
  [AccountType.ROLLOVER_IRA]: regularTraditionalIraTraits(),
  [AccountType.PAYROLL_DEDUCTION_IRA]: regularTraditionalIraTraits(),
  [AccountType.DEEMED_TRADITIONAL_IRA]: regularTraditionalIraTraits(),
  [AccountType.ROTH_IRA]: regularRothIraTraits(),
  [AccountType.DEEMED_ROTH_IRA]: regularRothIraTraits(),
  [AccountType.INHERITED_TRADITIONAL_IRA]: inheritedIraTraits(false),
  [AccountType.INHERITED_ROTH_IRA]: inheritedIraTraits(true),

  [AccountType.SEP_IRA]: sepTraits(false),
  [AccountType.ROTH_SEP_IRA]: sepTraits(true),
  [AccountType.SIMPLE_IRA]: simpleTraits(false),
  [AccountType.ROTH_SIMPLE_IRA]: simpleTraits(true),
  [AccountType.SARSEP_IRA]: sarsepTraits(),

  [AccountType.TRADITIONAL_401K]: qualifiedElectiveTraits("traditional401k", false),
  [AccountType.ROTH_401K]: qualifiedElectiveTraits("designatedRoth401k", true),
  [AccountType.SOLO_401K]: qualifiedElectiveTraits("traditional401k", false),
  [AccountType.ROTH_SOLO_401K]: qualifiedElectiveTraits("designatedRoth401k", true),
  [AccountType.SIMPLE_401K]: simple401kTraits(false),
  [AccountType.ROTH_SIMPLE_401K]: simple401kTraits(true),
  [AccountType.STARTER_401K]: starterTraits(),
  [AccountType.PENSION_LINKED_EMERGENCY_SAVINGS]: pensionLinkedEmergencySavingsTraits(),

  [AccountType.TRADITIONAL_403B]: qualified403bTraits(false),
  [AccountType.ROTH_403B]: qualified403bTraits(true),
  [AccountType.SAFE_HARBOR_403B_DEFERRAL_ONLY]: starter403bTraits(),

  [AccountType.GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS]:
    governmental457bPensionLinkedEmergencySavingsTraits(),
  [AccountType.GOVERNMENTAL_457B]: section457Traits(false, true),
  [AccountType.ROTH_GOVERNMENTAL_457B]: section457Traits(true, true),
  [AccountType.NONGOVERNMENTAL_457B]: section457Traits(false, false),
  [AccountType.SECTION_457F]: section457fTraits(),

  [AccountType.TRADITIONAL_TSP]: qualifiedElectiveTraits("traditionalTsp", false),
  [AccountType.ROTH_TSP]: qualifiedElectiveTraits("rothTsp", true),

  [AccountType.SECTION_401A]: annualAdditionsOnlyTraits(),
  [AccountType.PROFIT_SHARING_PLAN]: annualAdditionsOnlyTraits(),
  [AccountType.MONEY_PURCHASE_PLAN]: annualAdditionsOnlyTraits(),
  [AccountType.KEOGH_PLAN]: annualAdditionsOnlyTraits(),
  [AccountType.ESOP]: annualAdditionsOnlyTraits(),

  [AccountType.DEFINED_BENEFIT_PLAN]: definedBenefitTraits(),
  [AccountType.CASH_BALANCE_PLAN]: definedBenefitTraits(),

  [AccountType.HSA]: hsaTraits(),

  [AccountType.HEALTH_FSA]: healthFsaTraits(),
  [AccountType.DEPENDENT_CARE_FSA]: dependentCareFsaTraits(),
};

function baseTraits(
  family: AccountTraits["family"],
  overrides: Partial<AccountTraits> = {},
): AccountTraits {
  return {
    family,
    designatedRoth: false,
    shares402g: false,
    uses415c: false,
    permitsAgeCatchUpByStatute: false,
    governmental457: false,
    is403b: false,
    isStarter: false,
    isPlesa: false,
    isSimple: false,
    isSarsep: false,
    employerOnly: false,
    ...overrides,
  };
}

function regularTraditionalIraTraits(): AccountTraits {
  return baseTraits("regular_traditional_ira", { availabilityKey: "traditionalIra" });
}

function regularRothIraTraits(): AccountTraits {
  return baseTraits("regular_roth_ira", {
    availabilityKey: "rothIra",
    designatedRoth: true,
  });
}

function inheritedIraTraits(roth: boolean): AccountTraits {
  return baseTraits("inherited_ira", {
    availabilityKey: roth ? "rothIra" : "traditionalIra",
    designatedRoth: roth,
  });
}

function sepTraits(roth: boolean): AccountTraits {
  return baseTraits("sep", {
    availabilityKey: roth ? "rothSimpleOrSep" : "sepIra",
    designatedRoth: roth,
    uses415c: true,
    employerOnly: true,
  });
}

function simpleTraits(roth: boolean): AccountTraits {
  return baseTraits("simple", {
    availabilityKey: roth ? "rothSimpleOrSep" : "simpleIra",
    designatedRoth: roth,
    shares402g: true,
    permitsAgeCatchUpByStatute: true,
    isSimple: true,
  });
}

function sarsepTraits(): AccountTraits {
  return baseTraits("qualified_elective", {
    availabilityKey: "sepIra",
    shares402g: true,
    uses415c: true,
    permitsAgeCatchUpByStatute: true,
    isSarsep: true,
  });
}

function qualifiedElectiveTraits(availabilityKey: string, roth: boolean): AccountTraits {
  return baseTraits("qualified_elective", {
    availabilityKey,
    designatedRoth: roth,
    shares402g: true,
    uses415c: true,
    permitsAgeCatchUpByStatute: true,
  });
}

function qualified403bTraits(roth: boolean): AccountTraits {
  return {
    ...qualifiedElectiveTraits(roth ? "designatedRoth403b" : "traditional403b", roth),
    is403b: true,
  };
}

function simple401kTraits(roth: boolean): AccountTraits {
  return {
    ...simpleTraits(roth),
    family: "qualified_elective",
    availabilityKey: roth ? "designatedRoth401k" : "traditional401k",
    uses415c: true,
  };
}

function starterTraits(): AccountTraits {
  return baseTraits("qualified_elective", {
    availabilityKey: "starter401kOrSafeHarbor403b",
    shares402g: true,
    uses415c: true,
    permitsAgeCatchUpByStatute: true,
    isStarter: true,
  });
}

function starter403bTraits(): AccountTraits {
  return { ...starterTraits(), is403b: true };
}

/**
 * IRC 402A(e)(1)(A)(i) treats a pension-linked emergency savings account as a
 * designated Roth account for purposes of this title, so its contributions are
 * elective deferrals sharing the IRC 402(g) limit — IRC 402A(e)(9) confirms it
 * by ordering excess deferrals distributed under IRC 402(g)(2)(A) out of the
 * emergency account first — and annual additions under IRC 415(c). No age-based
 * catch-up attaches: IRC 414(v) lets a participant exceed an applicable limit on
 * elective deferrals, while IRC 402A(e)(3)(A) forbids any contribution that would
 * push the account balance past its cap.
 */
function pensionLinkedEmergencySavingsTraits(): AccountTraits {
  return baseTraits("qualified_elective", {
    availabilityKey: "pensionLinkedEmergencySavings",
    designatedRoth: true,
    shares402g: true,
    uses415c: true,
    isPlesa: true,
    // IRC 402A(e)(3)(A) bars a contribution only "to the extent such
    // contribution would cause the portion of the account balance attributable
    // to participant contributions to exceed" the cap: a gate on a balance,
    // indifferent to how the contribution is characterised. IRC 414(v) relieves
    // a *deferral* limit at the plan, and 26 CFR 1.414(v)-1(b)(1)(i) lists the
    // limits it relieves — IRC 401(a)(30), 402(h), 403(b), 408, 415(c) and
    // 457(b)(2) — every one a plan- or employee-level limit and none of them
    // account-level. The two compose, and both still bind: a contribution past
    // an applicable host limit may be treated as a catch-up under
    // 26 CFR 1.414(v)-1(a)(1), which requires that the plan so treat it, while
    // the balance cap continues to bar anything above the account-local room.
    //
    // As everywhere else in this engine, capacity is derived from age and this
    // trait rather than from a plan-document catch-up election, so this states
    // that the statute permits it, under the package-wide assumption that the
    // represented plan permits and characterises what is modelled. A PLESA
    // contribution does not become a catch-up merely because the host's base
    // pool is exhausted.
    permitsAgeCatchUpByStatute: true,
  });
}

/**
 * IRC 402A(f)(1)(C) makes an eligible deferred compensation plan (as defined in
 * IRC 457(b)) of an eligible employer described in IRC 457(e)(1)(A) the third
 * applicable retirement plan that may include a pension-linked emergency
 * savings account, and IRC 402A(f)(2)(B) reads "elective deferral" for this
 * purpose to include a deferral of compensation under such a plan.
 *
 * Two limits that reach the other two hosts do not reach this one, which is why
 * it is a separate account type rather than another permitted plan type on the
 * existing one:
 *
 * - IRC 402(g)(3) enumerates elective deferrals exhaustively -- IRC 401(k)
 *   arrangements, IRC 402(h)(1)(B), IRC 403(b) salary-reduction annuities and
 *   IRC 408(p)(2)(A)(i) -- and no IRC 457(b) deferral appears among them, so
 *   these contributions are outside IRC 402(g)(1) and run instead against the
 *   IRC 457(e)(15) applicable dollar amount that IRC 457(b)(2)(A) imposes.
 *   IRC 402A(e)(9), which orders excess deferrals distributed under
 *   IRC 402(g)(2)(A) out of the emergency account first, is therefore not the
 *   authority it is for the other hosts and is deliberately not restated here.
 * - IRC 415(a)(1) reaches a trust that is part of a pension, profit-sharing or
 *   stock bonus plan and IRC 415(a)(2) extends it to IRC 403(a) annuity plans,
 *   IRC 403(b) annuity contracts and IRC 408(k) simplified employee pensions.
 *   An IRC 457(b) plan appears in neither, so there is no annual-additions
 *   group for this account to join.
 *
 * Both catch-ups this host offers compose with the balance cap, for the reason
 * the other hosts' catch-up does. IRC 414(v)(6)(A)(ii) makes an IRC 457(b) plan
 * of an IRC 457(e)(1)(A) employer an applicable employer plan, and
 * 26 CFR 1.414(v)-1(b)(1)(i) lists IRC 457(b)(2) among the limits the catch-up
 * relieves; the IRC 457(b)(3) last-three-years catch-up likewise raises "the
 * ceiling set forth in paragraph (2)". Every one of those is a limit on
 * deferrals under the plan. IRC 402A(e)(3)(A) is not: it bars a contribution
 * that would carry the participant-contribution portion of the *account
 * balance* past the cap, whatever the contribution is called. So the two bind
 * together rather than one displacing the other, and the room is drawn by base
 * deferrals and by whichever catch-up applies alike.
 *
 * Which catch-up that is remains the existing IRC 457(e)(18) question, and
 * IRC 414(v)(6)(C) states it from the other side: this plan is not an
 * applicable employer plan for a year in which a higher limitation applies
 * under IRC 457(b)(3). The two are alternatives, never a sum.
 */
function governmental457bPensionLinkedEmergencySavingsTraits(): AccountTraits {
  return baseTraits("section457", {
    availabilityKey: "pensionLinkedEmergencySavings",
    designatedRoth: true,
    governmental457: true,
    isPlesa: true,
    permitsAgeCatchUpByStatute: true,
  });
}

function section457Traits(roth: boolean, governmental: boolean): AccountTraits {
  return baseTraits("section457", {
    availabilityKey: governmental ? "governmental457b" : "nongovernmental457b",
    designatedRoth: roth,
    permitsAgeCatchUpByStatute: governmental,
    governmental457: governmental,
  });
}

function section457fTraits(): AccountTraits {
  return baseTraits("section457f");
}

function annualAdditionsOnlyTraits(): AccountTraits {
  return baseTraits("annual_additions_only", {
    uses415c: true,
    employerOnly: true,
  });
}

function hsaTraits(): AccountTraits {
  return baseTraits("hsa");
}

function healthFsaTraits(): AccountTraits {
  return baseTraits("health_fsa");
}

function dependentCareFsaTraits(): AccountTraits {
  return baseTraits("dependent_care_fsa");
}

function definedBenefitTraits(): AccountTraits {
  return baseTraits("defined_benefit", { employerOnly: true });
}

const FILING_STATUS_ALIASES: Record<string, FilingStatus> = {
  S: FilingStatus.SINGLE,
  SINGLE: FilingStatus.SINGLE,
  UNMARRIED: FilingStatus.SINGLE,
  M: FilingStatus.MARRIED_FILING_JOINTLY,
  MFJ: FilingStatus.MARRIED_FILING_JOINTLY,
  MARRIED: FilingStatus.MARRIED_FILING_JOINTLY,
  MARRIED_FILING_JOINTLY: FilingStatus.MARRIED_FILING_JOINTLY,
  JOINT: FilingStatus.MARRIED_FILING_JOINTLY,
  MFS: FilingStatus.MARRIED_FILING_SEPARATELY,
  MARRIED_FILING_SEPARATELY: FilingStatus.MARRIED_FILING_SEPARATELY,
  SEPARATE: FilingStatus.MARRIED_FILING_SEPARATELY,
  HOH: FilingStatus.HEAD_OF_HOUSEHOLD,
  HEAD_OF_HOUSEHOLD: FilingStatus.HEAD_OF_HOUSEHOLD,
  QSS: FilingStatus.QUALIFYING_SURVIVING_SPOUSE,
  QW: FilingStatus.QUALIFYING_SURVIVING_SPOUSE,
  QUALIFYING_WIDOW: FilingStatus.QUALIFYING_SURVIVING_SPOUSE,
  QUALIFYING_WIDOWER: FilingStatus.QUALIFYING_SURVIVING_SPOUSE,
  QUALIFYING_SURVIVING_SPOUSE: FilingStatus.QUALIFYING_SURVIVING_SPOUSE,
};

const ACCOUNT_TYPE_ALIASES: Record<string, AccountType> = {
  IRA: AccountType.TRADITIONAL_IRA,
  TRADITIONAL_IRA: AccountType.TRADITIONAL_IRA,
  ROTH_IRA: AccountType.ROTH_IRA,
  ROLLOVER_IRA: AccountType.ROLLOVER_IRA,
  PAYROLL_DEDUCTION_IRA: AccountType.PAYROLL_DEDUCTION_IRA,
  DEEMED_IRA: AccountType.DEEMED_TRADITIONAL_IRA,
  DEEMED_TRADITIONAL_IRA: AccountType.DEEMED_TRADITIONAL_IRA,
  DEEMED_ROTH_IRA: AccountType.DEEMED_ROTH_IRA,
  INHERITED_IRA: AccountType.INHERITED_TRADITIONAL_IRA,
  INHERITED_TRADITIONAL_IRA: AccountType.INHERITED_TRADITIONAL_IRA,
  INHERITED_ROTH_IRA: AccountType.INHERITED_ROTH_IRA,
  SEP: AccountType.SEP_IRA,
  SEP_IRA: AccountType.SEP_IRA,
  ROTH_SEP: AccountType.ROTH_SEP_IRA,
  ROTH_SEP_IRA: AccountType.ROTH_SEP_IRA,
  SIMPLE: AccountType.SIMPLE_IRA,
  SIMPLE_IRA: AccountType.SIMPLE_IRA,
  ROTH_SIMPLE: AccountType.ROTH_SIMPLE_IRA,
  ROTH_SIMPLE_IRA: AccountType.ROTH_SIMPLE_IRA,
  SARSEP: AccountType.SARSEP_IRA,
  SARSEP_IRA: AccountType.SARSEP_IRA,
  "401K": AccountType.TRADITIONAL_401K,
  TRADITIONAL_401K: AccountType.TRADITIONAL_401K,
  ROTH_401K: AccountType.ROTH_401K,
  SOLO_401K: AccountType.SOLO_401K,
  INDIVIDUAL_401K: AccountType.SOLO_401K,
  ROTH_SOLO_401K: AccountType.ROTH_SOLO_401K,
  SIMPLE_401K: AccountType.SIMPLE_401K,
  ROTH_SIMPLE_401K: AccountType.ROTH_SIMPLE_401K,
  STARTER_401K: AccountType.STARTER_401K,
  PLESA: AccountType.PENSION_LINKED_EMERGENCY_SAVINGS,
  GOVERNMENTAL_457B_PLESA: AccountType.GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS,
  PLESA_457B: AccountType.GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS,
  "457B_PLESA": AccountType.GOVERNMENTAL_457B_PENSION_LINKED_EMERGENCY_SAVINGS,
  PENSION_LINKED_EMERGENCY_SAVINGS: AccountType.PENSION_LINKED_EMERGENCY_SAVINGS,
  PENSION_LINKED_EMERGENCY_SAVINGS_ACCOUNT: AccountType.PENSION_LINKED_EMERGENCY_SAVINGS,
  "403B": AccountType.TRADITIONAL_403B,
  TRADITIONAL_403B: AccountType.TRADITIONAL_403B,
  ROTH_403B: AccountType.ROTH_403B,
  SAFE_HARBOR_403B_DEFERRAL_ONLY: AccountType.SAFE_HARBOR_403B_DEFERRAL_ONLY,
  "457": AccountType.GOVERNMENTAL_457B,
  "457B": AccountType.GOVERNMENTAL_457B,
  GOVERNMENTAL_457B: AccountType.GOVERNMENTAL_457B,
  ROTH_GOVERNMENTAL_457B: AccountType.ROTH_GOVERNMENTAL_457B,
  NONGOVERNMENTAL_457B: AccountType.NONGOVERNMENTAL_457B,
  "457F": AccountType.SECTION_457F,
  SECTION_457F: AccountType.SECTION_457F,
  TSP: AccountType.TRADITIONAL_TSP,
  TRADITIONAL_TSP: AccountType.TRADITIONAL_TSP,
  ROTH_TSP: AccountType.ROTH_TSP,
  "401A": AccountType.SECTION_401A,
  SECTION_401A: AccountType.SECTION_401A,
  PROFIT_SHARING: AccountType.PROFIT_SHARING_PLAN,
  PROFIT_SHARING_PLAN: AccountType.PROFIT_SHARING_PLAN,
  MONEY_PURCHASE: AccountType.MONEY_PURCHASE_PLAN,
  MONEY_PURCHASE_PLAN: AccountType.MONEY_PURCHASE_PLAN,
  KEOGH: AccountType.KEOGH_PLAN,
  KEOGH_PLAN: AccountType.KEOGH_PLAN,
  ESOP: AccountType.ESOP,
  DB: AccountType.DEFINED_BENEFIT_PLAN,
  PENSION: AccountType.DEFINED_BENEFIT_PLAN,
  DEFINED_BENEFIT: AccountType.DEFINED_BENEFIT_PLAN,
  DEFINED_BENEFIT_PLAN: AccountType.DEFINED_BENEFIT_PLAN,
  CASH_BALANCE: AccountType.CASH_BALANCE_PLAN,
  CASH_BALANCE_PLAN: AccountType.CASH_BALANCE_PLAN,
  HSA: AccountType.HSA,
  HEALTH_SAVINGS_ACCOUNT: AccountType.HSA,
  SECTION_223: AccountType.HSA,
  // A bare "FSA" is deliberately absent. It names a health FSA and a dependent
  // care FSA equally well, and the two are different accounts under different
  // Code sections with different limits and different household aggregation, so
  // aliasing it would silently pick one. It falls through to
  // INVALID_ACCOUNT_TYPE, which names both spellings in the message.
  HEALTH_FSA: AccountType.HEALTH_FSA,
  HEALTHCARE_FSA: AccountType.HEALTH_FSA,
  HEALTH_CARE_FSA: AccountType.HEALTH_FSA,
  MEDICAL_FSA: AccountType.HEALTH_FSA,
  HEALTH_FLEXIBLE_SPENDING_ARRANGEMENT: AccountType.HEALTH_FSA,
  SECTION_125_HEALTH_FSA: AccountType.HEALTH_FSA,
  DEPENDENT_CARE_FSA: AccountType.DEPENDENT_CARE_FSA,
  DEPENDENT_CARE_ACCOUNT: AccountType.DEPENDENT_CARE_FSA,
  DEPENDENT_CARE_ASSISTANCE: AccountType.DEPENDENT_CARE_FSA,
  DEPENDENT_CARE_ASSISTANCE_PROGRAM: AccountType.DEPENDENT_CARE_FSA,
  DCAP: AccountType.DEPENDENT_CARE_FSA,
  DCFSA: AccountType.DEPENDENT_CARE_FSA,
  SECTION_129: AccountType.DEPENDENT_CARE_FSA,
};

const CONVERSION_TYPE_ALIASES: Record<string, ConversionType> = {
  IRA_TO_ROTH: ConversionType.IRA_TO_ROTH_IRA,
  IRA_TO_ROTH_IRA: ConversionType.IRA_TO_ROTH_IRA,
  ROTH_CONVERSION: ConversionType.IRA_TO_ROTH_IRA,
  QUALIFIED_PLAN_TO_ROTH_IRA: ConversionType.QUALIFIED_PLAN_TO_ROTH_IRA,
  PLAN_TO_ROTH_IRA: ConversionType.QUALIFIED_PLAN_TO_ROTH_IRA,
  IN_PLAN_ROTH_ROLLOVER: ConversionType.IN_PLAN_ROTH_ROLLOVER,
  IN_PLAN_ROTH_CONVERSION: ConversionType.IN_PLAN_ROTH_ROLLOVER,
};

/**
 * A language-neutral description of a value's shape, so both engines word the
 * same rejection identically. Arrays and objects collapse into one token
 * because a JSON `{}` and a JSON `[]` are indistinguishable once decoded in
 * PHP, and a message that depended on telling them apart could not be matched.
 */
function describeInputValue(value: unknown, present = true): string {
  if (!present || value === undefined) return "no value";
  if (value === null) return "null";
  if (typeof value === "boolean") return "a boolean";
  if (typeof value === "number") return "a number";
  if (typeof value === "string") return "a string";
  return "a structured value";
}

/**
 * The value as a JSON list, or null when it is not one. An object whose keys
 * are exactly "0".."n-1" counts, matching PHP's `array_is_list` — after
 * `json_decode`, PHP cannot distinguish a JSON array from an object with those
 * keys, so neither engine may.
 */
function toInputList(value: unknown): unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value === null || typeof value !== "object") return null;
  const keys = Object.keys(value);
  for (let index = 0; index < keys.length; index += 1) {
    if (keys[index] !== String(index)) return null;
  }
  return keys.map((key) => (value as Record<string, unknown>)[key]);
}

/** A non-empty string after trimming, or null. Used for every caller-supplied identifier. */
function trimmedIdentifier(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Optional identifier fields must be non-empty strings, for the same reason flag
 * fields must be actual booleans: JavaScript and PHP disagree about `"0"`, about
 * `0`, and about `""`, so a coerced identifier makes the answer depend on the
 * runtime rather than on the input.
 *
 * `employerId` is the one that costs money. It selects the prior-year FICA wage
 * figure for the IRC 414(v)(7)(A) test, so a value one runtime reads as present
 * and the other as absent is the difference between a classified catch-up and an
 * indeterminate account. A numeric `0` did exactly that. Absent stays absent --
 * `undefined` and `null` both mean the caller supplied nothing -- but anything
 * else present must be a usable identifier rather than something to be coerced
 * into one.
 */
function optionalIdentifier(value: unknown, path: string, code: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || value === "") {
    throw new ParameterError(code, `${path} must be a non-empty string when supplied.`);
  }
  return value;
}

/**
 * Flag fields must be actual booleans. JavaScript and PHP disagree about the
 * truthiness of `"0"` and of an empty array, so coercing one would make the
 * answer depend on the runtime rather than on the input.
 */
function booleanFlag(value: unknown, path: string): void {
  if (value === undefined) return;
  if (typeof value !== "boolean") {
    throw new ParameterError("INVALID_BOOLEAN", `${path} must be a boolean.`);
  }
}

/** Structured input fields must be objects; a scalar in their place is silently ignored otherwise. */
function requireInputObject(value: unknown, path: string): void {
  if (value === undefined) return;
  if (value === null || typeof value !== "object") {
    throw new ParameterError("INVALID_INPUT_OBJECT", `${path} must be an object.`);
  }
}

function normalizeToken(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[()]/g, "")
    .replace(/[\-./\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseFilingStatus(
  value: FilingStatus | string | unknown,
  diagnostics?: Diagnostic[],
  present = true,
): FilingStatus {
  if (Object.values(FilingStatus).includes(value as FilingStatus)) {
    return value as FilingStatus;
  }
  if (typeof value !== "string") {
    throw new ParameterError(
      "INVALID_FILING_STATUS",
      `Filing status must be a string, but received ${describeInputValue(value, present)}.`,
    );
  }
  const token = normalizeToken(value);
  const parsed = FILING_STATUS_ALIASES[token];
  if (!parsed) {
    throw new ParameterError("INVALID_FILING_STATUS", `Unsupported filing status: ${value}`);
  }
  if (token === "M") {
    diagnostics?.push(
      diagnostic(
        "AMBIGUOUS_M_ALIAS_ASSUMED_MFJ",
        DiagnosticSeverity.WARNING,
        'Filing-status alias "M" was interpreted as married filing jointly. Use MFJ or MFS to be explicit.',
        "filingStatus",
      ),
    );
  }
  return parsed;
}

function parseAccountType(value: AccountType | string | unknown, present = true): AccountType {
  if (Object.values(AccountType).includes(value as AccountType)) {
    return value as AccountType;
  }
  if (typeof value !== "string") {
    throw new ParameterError(
      "INVALID_ACCOUNT_TYPE",
      `Account type must be a string, but received ${describeInputValue(value, present)}.`,
    );
  }
  const token = normalizeToken(value);
  const parsed = ACCOUNT_TYPE_ALIASES[token];
  if (!parsed) {
    // "FSA" alone is ambiguous rather than unknown: it names a health FSA under
    // IRC 125(i) and a dependent care FSA under IRC 129 equally well, and those
    // carry different limits and different household aggregation.
    if (token === "FSA" || token === "FLEXIBLE_SPENDING_ARRANGEMENT" || token === "FLEXIBLE_SPENDING_ACCOUNT") {
      throw new ParameterError(
        "INVALID_ACCOUNT_TYPE",
        `Ambiguous account type: ${value}. Use "health_fsa" for an IRC 125(i) health flexible spending arrangement or "dependent_care_fsa" for an IRC 129 dependent care assistance program.`,
      );
    }
    throw new ParameterError("INVALID_ACCOUNT_TYPE", `Unsupported retirement account type: ${value}`);
  }
  return parsed;
}

function parseConversionType(value: ConversionType | string | unknown, present = true): ConversionType {
  if (Object.values(ConversionType).includes(value as ConversionType)) {
    return value as ConversionType;
  }
  if (typeof value !== "string") {
    throw new ParameterError(
      "INVALID_CONVERSION_TYPE",
      `Roth conversion type must be a string, but received ${describeInputValue(value, present)}.`,
    );
  }
  const parsed = CONVERSION_TYPE_ALIASES[normalizeToken(value)];
  if (!parsed) {
    throw new ParameterError("INVALID_CONVERSION_TYPE", `Unsupported Roth conversion type: ${value}`);
  }
  return parsed;
}

function diagnostic(
  code: string,
  severity: DiagnosticSeverity,
  message: string,
  path?: string,
  legalReference?: string,
): Diagnostic {
  return { code, severity, message, ...(path ? { path } : {}), ...(legalReference ? { legalReference } : {}) };
}

function money(value: unknown, path: string, defaultValue = 0): Money {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new ParameterError("INVALID_MONEY", `${path} must be a finite, nonnegative number.`);
  }
  return roundMoney(value);
}

function rate(value: unknown, path: string, defaultValue = 0): number {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new ParameterError("INVALID_RATE", `${path} must be a number from 0 through 1.`);
  }
  return value;
}

function roundMoney(value: number): Money {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function floorMoney(value: number): Money {
  return Math.floor((value + Number.EPSILON) * 100) / 100;
}

function minMoney(...values: Array<Money | null | undefined>): Money {
  const finite = values.filter((value): value is number => value !== null && value !== undefined);
  return finite.length === 0 ? 0 : Math.min(...finite);
}

function nonnegative(value: number): Money {
  return roundMoney(Math.max(0, value));
}

function zeroComponents(): ContributionComponents {
  return {
    employeePreTaxDeferral: 0,
    employeeRothDeferral: 0,
    employeePreTaxCatchUp: 0,
    employeeRothCatchUp: 0,
    employeeAfterTax: 0,
    employerPreTax: 0,
    employerRoth: 0,
    deductibleIra: 0,
    nondeductibleIra: 0,
    rothIra: 0,
    special403bCatchUp: 0,
    special457CatchUp: 0,
    special457RothCatchUp: 0,
    unclassifiedIra: 0,
    hsaDeductible: 0,
    hsaEmployerOrCafeteria: 0,
    healthFsaSalaryReduction: 0,
    dependentCareAssistanceProvided: 0,
    dependentCareIncludibleInIncome: 0,
  };
}

function cloneComponents(source?: ExistingContributionInput): ContributionComponents {
  const result = zeroComponents();
  if (!source) return result;
  result.employeePreTaxDeferral = money(source.employeePreTaxDeferral, "existing.employeePreTaxDeferral");
  result.employeeRothDeferral = money(source.employeeRothDeferral, "existing.employeeRothDeferral");
  result.employeePreTaxCatchUp = money(source.employeePreTaxCatchUp, "existing.employeePreTaxCatchUp");
  result.employeeRothCatchUp = money(source.employeeRothCatchUp, "existing.employeeRothCatchUp");
  result.employeeAfterTax = money(source.employeeAfterTax, "existing.employeeAfterTax");
  result.employerPreTax = money(source.employerPreTax, "existing.employerPreTax");
  result.employerRoth = money(source.employerRoth, "existing.employerRoth");
  result.deductibleIra = money(source.deductibleIra, "existing.deductibleIra");
  result.nondeductibleIra = money(source.nondeductibleIra, "existing.nondeductibleIra");
  result.rothIra = money(source.rothIra, "existing.rothIra");
  result.special403bCatchUp = money(source.special403bCatchUp, "existing.special403bCatchUp");
  result.special457CatchUp = money(source.special457CatchUp, "existing.special457CatchUp");
  result.special457RothCatchUp = money(source.special457RothCatchUp, "existing.special457RothCatchUp");
  result.hsaDeductible = money(source.hsaDeductible, "existing.hsaDeductible");
  result.hsaEmployerOrCafeteria = money(source.hsaEmployerOrCafeteria, "existing.hsaEmployerOrCafeteria");
  result.healthFsaSalaryReduction = money(source.healthFsaSalaryReduction, "existing.healthFsaSalaryReduction");
  // dependentCareIncludibleInIncome is deliberately not read from the input: it
  // is the IRC 129(a)(2)(B) split of the supplied amount, computed here, in the
  // same way unclassifiedIra is derived rather than supplied.
  result.dependentCareAssistanceProvided = money(
    source.dependentCareAssistanceProvided,
    "existing.dependentCareAssistanceProvided",
  );
  return result;
}

function addComponents(target: ContributionComponents, source: ContributionComponents): ContributionComponents {
  for (const key of Object.keys(target) as Array<keyof ContributionComponents>) {
    target[key] = roundMoney(target[key] + source[key]);
  }
  return target;
}

function sumComponents(components: ContributionComponents): Money {
  return roundMoney(Object.values(components).reduce((sum, value) => sum + value, 0));
}

function baseElectiveDeferrals(components: ContributionComponents): Money {
  return roundMoney(components.employeePreTaxDeferral + components.employeeRothDeferral);
}

function ageCatchUpDeferrals(components: ContributionComponents): Money {
  return roundMoney(components.employeePreTaxCatchUp + components.employeeRothCatchUp);
}

function annualAdditionsAmount(components: ContributionComponents): Money {
  return roundMoney(
    components.employeePreTaxDeferral +
      components.employeeRothDeferral +
      components.employeeAfterTax +
      components.employerPreTax +
      components.employerRoth +
      components.special403bCatchUp,
  );
}

function zeroTaxEffects(): FederalTaxEffects {
  return {
    federalAgiReduction: 0,
    federalAgiIncrease: 0,
    federalTaxableIncomeReduction: 0,
    formW2Box1WageReduction: 0,
    ficaWageReduction: 0,
    selfEmployedRetirementDeduction: 0,
    nondeductibleContribution: 0,
    afterTaxOrRothContribution: 0,
    taxableRothConversion: 0,
    notes: [],
  };
}

/**
 * The components record what the scenario supplied, which is a fact even when
 * the account cannot be sized. The tax treatment of those amounts is not always
 * a fact, and two cases are settled enough to report rather than assume:
 *
 * An `unavailable` account is one whose type did not exist for the tax year, so
 * a contribution to it cannot carry that type's exclusion or deduction. IRC 223
 * was added for taxable years beginning after 2003, so a 2003 cafeteria-plan
 * HSA contribution is not an IRC 106(d) exclusion no matter what it is called.
 *
 * An election above the IRC 125(i) limit costs the plan its IRC 125 status
 * entirely under Notice 2012-40 section III, not merely as to the excess, so
 * the IRC 125(a) exclusion fails for the whole health FSA salary reduction.
 *
 * `indeterminate` on its own is deliberately not in this list. An unknown
 * IRC 415(c) limit does not undo a pre-tax deferral's effect on AGI, and a
 * pre-2013 health FSA excluded salary reductions under IRC 125(a) perfectly
 * well while having no IRC 125(i) ceiling to report.
 */
function accountTaxEffects(
  outcome: AllocationOutcome,
  traits: AccountTraits,
  planRules: PlanRulesInput,
  diagnostics: Diagnostic[],
): FederalTaxEffects {
  if (outcome.status === CalculationStatus.UNAVAILABLE) {
    const suppressed = zeroTaxEffects();
    suppressed.notes.push(
      "This account type did not exist for the tax year, so no exclusion or deduction of its kind is reported for the amounts supplied. The amounts themselves remain in contributionComponents.",
    );
    return suppressed;
  }
  const section125QualificationFailed = diagnostics.some(
    (entry) => entry.code === "HEALTH_FSA_ELECTION_EXCEEDS_SECTION_125I_LIMIT",
  );
  if (!section125QualificationFailed) {
    return contributionTaxEffects(outcome.annualComponents, traits, planRules);
  }
  const withoutHealthFsa: ContributionComponents = {
    ...outcome.annualComponents,
    healthFsaSalaryReduction: 0,
  };
  const effects = contributionTaxEffects(withoutHealthFsa, traits, planRules);
  effects.notes.push(
    "IRC 125(i) makes a health flexible spending arrangement a qualified benefit only if the plan provides that an employee may not elect salary reduction contributions above the limit. Notice 2012-40 section III holds that a plan failing to comply is not an IRC 125 cafeteria plan at all, so the IRC 125(a) exclusion fails for the entire salary reduction rather than for the excess alone. No wage exclusion is reported for it. The election remains in contributionComponents, and this engine does not extend the consequence to other arrangements that may be under the same cafeteria plan.",
  );
  return effects;
}

function contributionTaxEffects(
  components: ContributionComponents,
  traits: AccountTraits,
  planRules: PlanRulesInput,
): FederalTaxEffects {
  const result = zeroTaxEffects();
  const pretaxEmployee = roundMoney(
    components.employeePreTaxDeferral + components.employeePreTaxCatchUp + components.special403bCatchUp + components.special457CatchUp,
  );
  const deductibleIra = components.deductibleIra;
  const selfEmployedPlanDeduction = planRules.isSelfEmployedOwner
    ? roundMoney(pretaxEmployee + components.employerPreTax)
    : 0;
  const selfEmployedEmployer = planRules.isSelfEmployedOwner ? components.employerPreTax : 0;

  const hsaDeduction = components.hsaDeductible;
  const hsaExclusion = components.hsaEmployerOrCafeteria;
  // IRC 125(a) keeps a salary reduction contribution out of gross income
  // entirely, so it is an exclusion and never an above-the-line deduction. It
  // therefore follows the IRC 106(d) path exactly: out of Form W-2 box 1 and out
  // of social security and medicare wages, and absent from federalAgiReduction,
  // because the money was never included rather than reduced.
  const cafeteriaExclusion = roundMoney(
    components.healthFsaSalaryReduction + components.dependentCareAssistanceProvided,
  );

  result.formW2Box1WageReduction = roundMoney(
    (planRules.isSelfEmployedOwner ? 0 : pretaxEmployee) + hsaExclusion + cafeteriaExclusion,
  );
  result.selfEmployedRetirementDeduction = selfEmployedPlanDeduction;
  result.federalAgiReduction = roundMoney(
    pretaxEmployee + selfEmployedEmployer + deductibleIra + hsaDeduction,
  );
  result.federalTaxableIncomeReduction = result.federalAgiReduction;
  result.ficaWageReduction = roundMoney(hsaExclusion + cafeteriaExclusion);
  result.nondeductibleContribution = roundMoney(components.nondeductibleIra + components.unclassifiedIra);
  result.afterTaxOrRothContribution = roundMoney(
    components.employeeRothDeferral +
      components.employeeRothCatchUp +
      components.employeeAfterTax +
      components.employerRoth +
      components.rothIra +
      components.special457RothCatchUp,
  );

  if (pretaxEmployee > 0 && !planRules.isSelfEmployedOwner) {
    result.notes.push("Pre-tax salary deferrals generally reduce Form W-2 box 1 wages but not Social Security or Medicare wages.");
  }
  if (traits.family === "regular_traditional_ira" && deductibleIra > 0) {
    result.notes.push("A deductible traditional IRA contribution is an above-the-line federal adjustment to income.");
  }
  if (components.employerRoth > 0) {
    result.federalAgiIncrease = roundMoney(result.federalAgiIncrease + components.employerRoth);
    result.notes.push("A designated Roth employer contribution is generally included in current federal taxable income.");
  }
  if (result.afterTaxOrRothContribution > 0) {
    result.notes.push("Roth and voluntary after-tax contributions do not reduce current federal AGI.");
  }
  if (hsaDeduction > 0) {
    result.notes.push("An HSA contribution made by the account beneficiary is an above-the-line federal deduction under IRC 223(a).");
  }
  if (hsaExclusion > 0) {
    result.notes.push(
      "Employer and cafeteria-plan HSA contributions are excluded from gross income under IRC 106(d) and are outside Form W-2 box 1 and Social Security and Medicare wages (Notice 2004-2 A-19). They were never included rather than reduced, and they reduce the IRC 223(a) deduction under IRC 223(b)(4)(B).",
    );
  }
  if (components.healthFsaSalaryReduction > 0) {
    result.notes.push(
      "Health flexible spending arrangement salary reduction contributions are excluded from gross income under IRC 125(a) and are outside Form W-2 box 1 and Social Security and Medicare wages (IRC 3121(a)(5)(G)). They are an exclusion rather than a deduction - the money never entered gross income - so they do not appear in federalAgiReduction.",
    );
  }
  if (components.dependentCareAssistanceProvided > 0) {
    result.notes.push(
      "Dependent care assistance within the IRC 129(a)(2) limitation is excluded from gross income under IRC 129(a)(1) and is outside Form W-2 box 1 and Social Security and Medicare wages (IRC 3121(a)(18)); it is reported in Form W-2 box 10. It is an exclusion rather than a deduction, so it does not appear in federalAgiReduction.",
    );
  }
  if (components.dependentCareIncludibleInIncome > 0) {
    result.notes.push(
      "Dependent care assistance above the IRC 129(a)(2) limitation is included in gross income under IRC 129(a)(2)(B) in the taxable year the services were provided, so only the excludable part reduces Form W-2 box 1 and Social Security and Medicare wages.",
    );
  }
  return result;
}

function mergeTaxEffects(target: FederalTaxEffects, source: FederalTaxEffects): FederalTaxEffects {
  const numericKeys: Array<Exclude<keyof FederalTaxEffects, "notes">> = [
    "federalAgiReduction",
    "federalAgiIncrease",
    "federalTaxableIncomeReduction",
    "formW2Box1WageReduction",
    "ficaWageReduction",
    "selfEmployedRetirementDeduction",
    "nondeductibleContribution",
    "afterTaxOrRothContribution",
    "taxableRothConversion",
  ];
  for (const key of numericKeys) target[key] = roundMoney(target[key] + source[key]);
  target.notes.push(...source.notes);
  return target;
}

interface NormalizedPerson extends PersonInput {
  role: PersonRole;
  compensation: CompensationInput;
  magi: MagiInput;
  priorYearFicaWagesByEmployer: Record<string, Money>;
}

interface NormalizedAccount extends Omit<AccountInput, "type" | "planRules" | "existingContributions"> {
  type: AccountType;
  planRules: PlanRulesInput;
  existingContributions: ContributionComponents;
  inputIndex: number;
}

/**
 * A known quantity whose exact value is not settled, given as the closed range
 * of values the supplied facts leave open. A settled quantity is the degenerate
 * interval whose endpoints are equal, so one type covers both states and no
 * caller has to ask which one it is holding.
 */
export interface MoneyInterval {
  minimum: Money;
  maximum: Money;
}

/** The degenerate interval: a quantity that is not in doubt. */
function settled(amount: Money): MoneyInterval {
  return { minimum: amount, maximum: amount };
}

function intervalIsSettled(interval: MoneyInterval): boolean {
  return interval.minimum === interval.maximum;
}

interface LimitPool {
  id: string;
  legalLimit: string;
  limit: Money | null;
  /**
   * How much of the ceiling is already spent, as a range rather than a figure.
   *
   * Both endpoints move together for an ordinary charge, because an amount
   * whose attribution is not in doubt is spent under every reading of the
   * facts. The endpoints separate only where a known amount's *assignment* is
   * unresolved -- the IRC 223(b)(5) division between the paragraph (1)
   * limitation and the paragraph (3) additional amount, or an existing
   * contribution IRC 414(v)(7)(A) may or may not have condemned as a catch-up.
   * In that state `minimum` is what the pool has certainly spent and `maximum`
   * what it may have spent, and the difference is exactly the amount in doubt.
   *
   * This replaces a `used` figure beside a `usageIndeterminate` flag. The flag
   * was the fully open case of this interval and nothing else, and having only
   * a flag forced every partially-known usage into one of the two bounds --
   * which is what published a pool as wholly untouched when at most 250 of room
   * remained, and accused a 56-year-old of exceeding a pool they were within.
   * A bound is not a usage. The interval says so in the type.
   */
  usage: MoneyInterval;
  /**
   * Which unresolved facts widened `usage`, by a key naming each one.
   *
   * Two pools widened by the *same* contribution are correlated: the reading
   * that charges it to one is the reading that does not charge it to the other,
   * so their maxima do not both occur in any single completion of the facts.
   * Adding such maxima together would report headroom no set of facts provides.
   * Minima may always be summed; maxima may be summed only across pools sharing
   * no key.
   */
  uncertaintyGroupIds?: string[];
}

interface IraOwnerPool extends LimitPool {
  blocked: boolean;
  compensationPoolId: string;
}

interface AnnualAdditionsPool extends LimitPool {
  compensation: Money;
}

interface CalculationContext {
  taxYear: number;
  filingStatus: FilingStatus;
  /** The IRC 21(e)(4) determination, or null when it was not supplied. */
  treatedAsUnmarriedUnderSection21e4: boolean | null;
  /** IRC 223(b)(5)(B)(ii) division, defaulted to the statutory equal split. */
  hsaFamilyLimitDivision: HsaFamilyLimitDivisionInput;
  parameters: YearParameters;
  hsaParameters: HsaYearParameters | null;
  fsaParameters: FsaYearParameters | null;
  persons: Map<string, NormalizedPerson>;
  accountsById: Map<string, NormalizedAccount>;
  scenarioDiagnostics: Diagnostic[];
  iraOwnerPools: Map<string, IraOwnerPool>;
  iraCompensationPools: Map<string, LimitPool>;
  iraRothEligibilityPools: Map<string, LimitPool>;
  iraDeductionPools: Map<string, LimitPool>;
  elective402gPools: Map<string, LimitPool>;
  catchUpPools: Map<string, LimitPool>;
  special403bCatchUpPools: Map<string, LimitPool>;
  annualAdditionsPools: Map<string, AnnualAdditionsPool>;
  section457BasePools: Map<string, LimitPool>;
  section457CatchUpPools: Map<string, LimitPool>;
  section457SpecialCatchUpPools: Map<string, LimitPool>;
  section457CatchUpResolutions: Map<string, Section457CatchUpResolution>;
  hsaBasePools: Map<string, LimitPool>;
  hsaCatchUpPools: Map<string, LimitPool>;
  hsaFamilyPools: Map<string, LimitPool>;
  hsaPlans: Map<string, HsaOwnerPlan>;
  healthFsaPools: Map<string, LimitPool>;
  healthFsaPlans: Map<string, HealthFsaAccountPlan>;
  dependentCarePools: Map<string, LimitPool>;
  dependentCarePlans: Map<string, DependentCareAccountPlan>;
  /**
   * The IRC 129(b)(1) ceiling resolved for each IRC 129(a)(2)(A) pool. The
   * limitation caps the amount excluded for the taxable year, which is the
   * return's aggregate rather than a per-account figure, so it belongs to the
   * pool the accounts share.
   */
  dependentCareEarnedIncomeCeilings: Map<string, Money>;
  /**
   * Owners whose IRA limit is indeterminate because former IRC 220(b)(1)(A)
   * governs the year: the couple's deduction is twice the lesser of the two
   * contributions, which no per-account figure reproduces.
   */
  section220TwiceTheLesserOwners: Set<string>;
}

interface AllocationOutcome {
  status: CalculationStatus;
  statutoryMaximum: Money | null;
  annualComponents: ContributionComponents;
  additionalComponents: ContributionComponents;
  planTermDependentCapacity: Money;
  sharedLimits: SharedLimitUse[];
  diagnostics: Diagnostic[];
  hsaDetail?: HsaAccountDetail | null;
  definedBenefitDetail?: DefinedBenefitAccountDetail;
  healthFsaDetail?: HealthFsaAccountDetail;
  dependentCareDetail?: DependentCareFsaAccountDetail;
}

function getParametersForYear(year: number): YearParameters {
  if (!Number.isInteger(year)) {
    throw new ParameterError("INVALID_TAX_YEAR", "taxYear must be an integer.");
  }
  const { minimum, maximum } = RAW_PARAMETERS.supportedTaxYears;
  if (year < minimum || year > maximum || !RAW_PARAMETERS.years[String(year)]) {
    throw new UnsupportedTaxYearError(year, minimum, maximum);
  }
  return deepClone(RAW_PARAMETERS.years[String(year)]);
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function normalizePersons(personsInput: PersonInput[]): Map<string, NormalizedPerson> {
  const persons = toInputList(personsInput) as PersonInput[] | null;
  if (persons === null || persons.length === 0) {
    throw new ParameterError("PERSON_REQUIRED", "At least one person is required.");
  }
  const result = new Map<string, NormalizedPerson>();
  for (const [index, input] of persons.entries()) {
    if (input === null || typeof input !== "object") {
      throw new ParameterError("INVALID_PERSON", `persons[${index}] must be an object/associative array.`);
    }
    const id = trimmedIdentifier(input.id);
    if (id === null) {
      throw new ParameterError("PERSON_ID_REQUIRED", `persons[${index}].id is required.`);
    }
    if (result.has(id)) {
      throw new ParameterError("DUPLICATE_PERSON_ID", `Duplicate person ID: ${id}`);
    }
    if (input.birthYear !== undefined && (!Number.isInteger(input.birthYear) || input.birthYear < 1800 || input.birthYear > 3000)) {
      throw new ParameterError("INVALID_BIRTH_YEAR", `persons[${index}].birthYear is invalid.`);
    }
    if (input.birthDate !== undefined) validateIsoDate(input.birthDate, `persons[${index}].birthDate`);
    requireInputObject(input.compensation, `persons[${index}].compensation`);
    requireInputObject(input.magi, `persons[${index}].magi`);
    requireInputObject(
      input.priorYearFicaWagesByEmployer,
      `persons[${index}].priorYearFicaWagesByEmployer`,
    );
    const compensation = input.compensation ?? {};
    money(compensation.iraCompensation, `persons[${index}].compensation.iraCompensation`);
    money(compensation.w2Compensation, `persons[${index}].compensation.w2Compensation`);
    money(compensation.selfEmploymentNetEarnings, `persons[${index}].compensation.selfEmploymentNetEarnings`);
    const magi = input.magi ?? {};
    money(magi.rothIra, `persons[${index}].magi.rothIra`);
    money(magi.traditionalIraDeduction, `persons[${index}].magi.traditionalIraDeduction`);
    money(magi.rothConversion, `persons[${index}].magi.rothConversion`);
    const wages: Record<string, Money> = {};
    for (const [employerId, amount] of Object.entries(input.priorYearFicaWagesByEmployer ?? {})) {
      wages[employerId] = money(amount, `persons[${index}].priorYearFicaWagesByEmployer.${employerId}`);
    }
    requireInputObject(input.hsaCoverage, `persons[${index}].hsaCoverage`);
    if (input.hsaCoverage !== undefined) {
      validateHsaCoverage(input.hsaCoverage, `persons[${index}].hsaCoverage`);
      rejectRelocatedHsaFields(input.hsaCoverage, `persons[${index}].hsaCoverage`);
    }
    requireInputObject(
      input.hsaLastMonthRuleTestingPeriod,
      `persons[${index}].hsaLastMonthRuleTestingPeriod`,
    );
    if (input.hsaLastMonthRuleTestingPeriod !== undefined) {
      validateHsaLastMonthRuleTestingPeriod(
        input.hsaLastMonthRuleTestingPeriod,
        `persons[${index}].hsaLastMonthRuleTestingPeriod`,
      );
    }
    booleanFlag(input.coveredByEmployerRetirementPlan, `persons[${index}].coveredByEmployerRetirementPlan`);
    booleanFlag(input.livedWithSpouseDuringYear, `persons[${index}].livedWithSpouseDuringYear`);
    booleanFlag(input.isStudentOrIncapableOfSelfCare, `persons[${index}].isStudentOrIncapableOfSelfCare`);
    money(input.dependentCareEarnedIncome, `persons[${index}].dependentCareEarnedIncome`);
    const role = input.role ?? (index === 0 ? "taxpayer" : index === 1 ? "spouse" : "other");
    if (role !== "taxpayer" && role !== "spouse" && role !== "other") {
      throw new ParameterError(
        "INVALID_PERSON_ROLE",
        `persons[${index}].role must be taxpayer, spouse, or other.`,
      );
    }
    result.set(id, {
      ...input,
      id,
      role,
      compensation,
      magi,
      priorYearFicaWagesByEmployer: wages,
      traditionalSepSimpleIraBasis: input.traditionalSepSimpleIraBasis === undefined
        ? undefined
        : money(input.traditionalSepSimpleIraBasis, `persons[${index}].traditionalSepSimpleIraBasis`),
      yearEndTraditionalSepSimpleIraValue: input.yearEndTraditionalSepSimpleIraValue === undefined
        ? undefined
        : money(input.yearEndTraditionalSepSimpleIraValue, `persons[${index}].yearEndTraditionalSepSimpleIraValue`),
      otherTraditionalSepSimpleIraDistributions: input.otherTraditionalSepSimpleIraDistributions === undefined
        ? undefined
        : money(
            input.otherTraditionalSepSimpleIraDistributions,
            `persons[${index}].otherTraditionalSepSimpleIraDistributions`,
          ),
      archerMsaContributions: input.archerMsaContributions === undefined
        ? undefined
        : money(input.archerMsaContributions, `persons[${index}].archerMsaContributions`),
      qualifiedHsaFundingDistributions: input.qualifiedHsaFundingDistributions === undefined
        ? undefined
        : money(input.qualifiedHsaFundingDistributions, `persons[${index}].qualifiedHsaFundingDistributions`),
    });
  }
  for (const role of ["taxpayer", "spouse"] as const) {
    const matching = [...result.values()].filter((person) => person.role === role);
    if (matching.length > 1) {
      throw new ParameterError(
        "DUPLICATE_PERSON_ROLE",
        `Only one person may have the ${role} role; found ${matching.map((person) => person.id).join(", ")}.`,
      );
    }
  }
  return result;
}

function normalizeAccounts(
  accountsInput: AccountInput[] | undefined,
  persons: Map<string, NormalizedPerson>,
): NormalizedAccount[] {
  const accounts = (accountsInput === undefined || accountsInput === null
    ? []
    : toInputList(accountsInput)) as AccountInput[] | null;
  if (accounts === null) {
    throw new ParameterError("INVALID_ACCOUNTS", "accounts must be an array.");
  }
  const ids = new Set<string>();
  return accounts.map((input, index) => {
    if (input === null || typeof input !== "object") {
      throw new ParameterError("INVALID_ACCOUNT", `accounts[${index}] must be an object/associative array.`);
    }
    const id = trimmedIdentifier(input.id);
    if (id === null) {
      throw new ParameterError("ACCOUNT_ID_REQUIRED", `accounts[${index}].id is required.`);
    }
    if (ids.has(id)) {
      throw new ParameterError("DUPLICATE_ACCOUNT_ID", `Duplicate account ID: ${id}`);
    }
    ids.add(id);
    const ownerId = trimmedIdentifier(input.ownerId);
    if (ownerId === null) {
      throw new ParameterError("ACCOUNT_OWNER_REQUIRED", `accounts[${index}].ownerId is required.`);
    }
    if (!persons.has(ownerId)) {
      throw new ParameterError(
        "UNKNOWN_ACCOUNT_OWNER",
        `Account ${id} references unknown owner ${ownerId}.`,
      );
    }
    requireInputObject(input.planRules, `accounts[${index}].planRules`);
    requireInputObject(input.existingContributions, `accounts[${index}].existingContributions`);
    const planRules = input.planRules ?? {};
    validatePlanRules(planRules, `accounts[${index}].planRules`);
    const employerId = optionalIdentifier(
      input.employerId,
      `accounts[${index}].employerId`,
      "INVALID_EMPLOYER_ID",
    );
    return {
      ...input,
      id,
      ownerId,
      employerId,
      type: parseAccountType(input.type, input.type !== undefined),
      priority: input.priority ?? 100,
      planRules,
      existingContributions: cloneComponents(input.existingContributions),
      inputIndex: index,
    };
  });
}

function validatePlanRules(rules: PlanRulesInput, path: string): void {
  optionalIdentifier(
    rules.annualAdditionsGroupId,
    `${path}.annualAdditionsGroupId`,
    "INVALID_ANNUAL_ADDITIONS_GROUP_ID",
  );
  money(rules.planCompensation, `${path}.planCompensation`);
  money(rules.includibleCompensation457, `${path}.includibleCompensation457`);
  money(rules.planDocumentEmployeeDeferralLimit, `${path}.planDocumentEmployeeDeferralLimit`);
  money(rules.planDocumentAnnualAdditionsLimit, `${path}.planDocumentAnnualAdditionsLimit`);
  money(rules.expectedEmployerContribution, `${path}.expectedEmployerContribution`);
  money(rules.simpleCustomEmployerContribution, `${path}.simpleCustomEmployerContribution`);
  money(rules.netEarningsFromSelfEmploymentAfterHalfSETax, `${path}.netEarningsFromSelfEmploymentAfterHalfSETax`);
  money(rules.simpleAdditionalNonelectiveContribution, `${path}.simpleAdditionalNonelectiveContribution`);
  money(
    rules.pensionLinkedEmergencySavingsParticipantContributionBalance,
    `${path}.pensionLinkedEmergencySavingsParticipantContributionBalance`,
  );
  rate(rules.employerMatchRate, `${path}.employerMatchRate`);
  rate(rules.employerMatchCompensationFraction, `${path}.employerMatchCompensationFraction`);
  rate(rules.employerNonelectiveRate, `${path}.employerNonelectiveRate`);
  booleanFlag(rules.permitsRothContributions, `${path}.permitsRothContributions`);
  booleanFlag(rules.permitsRothCatchUp, `${path}.permitsRothCatchUp`);
  booleanFlag(rules.permitsAfterTaxEmployeeContributions, `${path}.permitsAfterTaxEmployeeContributions`);
  booleanFlag(rules.permitsInPlanRothRollover, `${path}.permitsInPlanRothRollover`);
  booleanFlag(rules.simpleEnhancedLimitEligible, `${path}.simpleEnhancedLimitEligible`);
  booleanFlag(rules.isSelfEmployedOwner, `${path}.isSelfEmployedOwner`);
  booleanFlag(rules.grandfatheredSarsep, `${path}.grandfatheredSarsep`);
  booleanFlag(
    rules.grandfatheredGovernmentalCompensationLimit,
    `${path}.grandfatheredGovernmentalCompensationLimit`,
  );
  requireInputObject(rules.special403bCatchUp, `${path}.special403bCatchUp`);
  requireInputObject(rules.section457SpecialCatchUp, `${path}.section457SpecialCatchUp`);
  requireInputObject(rules.hsa, `${path}.hsa`);
  requireInputObject(rules.healthFsa, `${path}.healthFsa`);
  requireInputObject(rules.dependentCareFsa, `${path}.dependentCareFsa`);
  if (
    rules.simpleEmployerContributionMethod !== undefined &&
    !SIMPLE_EMPLOYER_CONTRIBUTION_METHODS.includes(rules.simpleEmployerContributionMethod)
  ) {
    throw new ParameterError(
      "INVALID_SIMPLE_EMPLOYER_CONTRIBUTION_METHOD",
      `${path}.simpleEmployerContributionMethod is invalid.`,
    );
  }
  if (rules.special403bCatchUp) {
    const special = rules.special403bCatchUp;
    booleanFlag(special.eligible, `${path}.special403bCatchUp.eligible`);
    if (!Number.isFinite(special.yearsOfService) || special.yearsOfService < 0) {
      throw new ParameterError("INVALID_YEARS_OF_SERVICE", `${path}.special403bCatchUp.yearsOfService is invalid.`);
    }
    money(special.priorElectiveDeferrals, `${path}.special403bCatchUp.priorElectiveDeferrals`);
    money(special.priorSpecialCatchUpUsed, `${path}.special403bCatchUp.priorSpecialCatchUpUsed`);
  }
  if (rules.section457SpecialCatchUp) {
    booleanFlag(rules.section457SpecialCatchUp.eligible, `${path}.section457SpecialCatchUp.eligible`);
    money(
      rules.section457SpecialCatchUp.unusedDeferralsFromPriorYears,
      `${path}.section457SpecialCatchUp.unusedDeferralsFromPriorYears`,
    );
  }
  if (
    rules.contributionPreference !== undefined &&
    !CONTRIBUTION_PREFERENCES.includes(rules.contributionPreference)
  ) {
    throw new ParameterError("INVALID_CONTRIBUTION_PREFERENCE", `${path}.contributionPreference is invalid.`);
  }
  if (
    rules.employerContributionTaxTreatment !== undefined &&
    !EMPLOYER_CONTRIBUTION_TAX_TREATMENTS.includes(rules.employerContributionTaxTreatment)
  ) {
    throw new ParameterError(
      "INVALID_EMPLOYER_CONTRIBUTION_TAX_TREATMENT",
      `${path}.employerContributionTaxTreatment is invalid.`,
    );
  }
  if (rules.hsa) validateHsaRules(rules.hsa, `${path}.hsa`);
  if (rules.healthFsa) validateHealthFsaRules(rules.healthFsa, `${path}.healthFsa`);
  if (rules.dependentCareFsa) {
    validateDependentCareFsaRules(rules.dependentCareFsa, `${path}.dependentCareFsa`);
  }
}

const SIMPLE_EMPLOYER_CONTRIBUTION_METHODS: SimpleEmployerContributionMethod[] = [
  "match_3_percent",
  "nonelective_2_percent",
  "custom",
];
const CONTRIBUTION_PREFERENCES: ContributionPreference[] = ["account_type", "pretax_first", "roth_first"];
const EMPLOYER_CONTRIBUTION_TAX_TREATMENTS: EmployerContributionTaxTreatment[] = ["pretax", "roth"];

const HSA_COVERAGE_TIERS: HsaCoverageTier[] = ["self_only", "family"];

function parseHsaCoverageTier(value: unknown, path: string): HsaCoverageTier {
  if (typeof value !== "string" || !HSA_COVERAGE_TIERS.includes(value as HsaCoverageTier)) {
    throw new ParameterError(
      "INVALID_HSA_COVERAGE_TIER",
      `${path} must be "self_only" or "family".`,
    );
  }
  return value as HsaCoverageTier;
}

function validateHsaMonth(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 12) {
    throw new ParameterError("INVALID_HSA_MONTH", `${path} must be an integer from 1 through 12.`);
  }
  return value;
}

function validateHsaCoverage(rules: HsaCoverageInput, path: string): void {
  const hasMonthly = rules.monthlyCoverage !== undefined;
  const hasTierForm = rules.coverageTier !== undefined || rules.eligibleMonths !== undefined;
  if (hasMonthly && hasTierForm) {
    throw new ParameterError(
      "INVALID_HSA_COVERAGE_INPUT",
      `${path} must supply either monthlyCoverage or coverageTier/eligibleMonths, not both.`,
    );
  }
  if (rules.coverageTier !== undefined) parseHsaCoverageTier(rules.coverageTier, `${path}.coverageTier`);
  if (rules.eligibleMonths !== undefined) {
    const eligibleMonths = toInputList(rules.eligibleMonths);
    if (eligibleMonths === null) {
      throw new ParameterError("INVALID_HSA_ELIGIBLE_MONTHS", `${path}.eligibleMonths must be an array.`);
    }
    const seen = new Set<number>();
    eligibleMonths.forEach((month, index) => {
      const value = validateHsaMonth(month, `${path}.eligibleMonths[${index}]`);
      if (seen.has(value)) {
        throw new ParameterError(
          "DUPLICATE_HSA_MONTH",
          `${path}.eligibleMonths lists month ${value} more than once.`,
        );
      }
      seen.add(value);
    });
  }
  if (rules.monthlyCoverage !== undefined) {
    const monthlyCoverage = toInputList(rules.monthlyCoverage) as HsaMonthlyCoverageInput[] | null;
    if (monthlyCoverage === null) {
      throw new ParameterError("INVALID_HSA_MONTHLY_COVERAGE", `${path}.monthlyCoverage must be an array.`);
    }
    const seen = new Set<number>();
    monthlyCoverage.forEach((entry, index) => {
      if (entry === null || typeof entry !== "object") {
        throw new ParameterError(
          "INVALID_HSA_MONTHLY_COVERAGE",
          `${path}.monthlyCoverage[${index}] must be an object.`,
        );
      }
      const month = validateHsaMonth(entry.month, `${path}.monthlyCoverage[${index}].month`);
      if (seen.has(month)) {
        throw new ParameterError(
          "DUPLICATE_HSA_MONTH",
          `${path}.monthlyCoverage lists month ${month} more than once.`,
        );
      }
      seen.add(month);
      parseHsaCoverageTier(entry.coverage, `${path}.monthlyCoverage[${index}].coverage`);
    });
  }
  money(rules.hdhpAnnualDeductible, `${path}.hdhpAnnualDeductible`);
}

/**
 * Fields that used to live on an account's `planRules.hsa` and now live on the
 * person or the scenario. They are rejected rather than normalised: silently
 * reading a moved field would let one owner's two accounts go on disagreeing
 * about a fact that cannot vary between them, which is the state this move
 * exists to make unrepresentable.
 */
const RELOCATED_HSA_ACCOUNT_FIELDS: ReadonlyArray<[string, string, string]> = [
  [
    "familyLimitShare",
    "HSA_ACCOUNT_LEVEL_FAMILY_LIMIT_SHARE_REMOVED",
    'IRC 223(b)(5)(B)(ii) divides the one family limitation between the spouses, not between accounts. Supply `hsaFamilyLimitDivision` on the scenario as { status: "agreed", taxpayerShare } instead.',
  ],
  [
    "useLastMonthRule",
    "HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED",
    "IRC 223(b)(8) is not an election, so this field moved nowhere. IRC 223(b)(8)(A) treats an individual who is an eligible individual in December as one for the whole year, and Notice 2008-52 states the maximum as the greater of the month-by-month figure and December's tier taken for the year; the engine computes that from the coverage facts. Remove the field, and supply `persons[].hsaLastMonthRuleTestingPeriod` for the testing-period facts that follow from it.",
  ],
  [
    "testingPeriodSatisfied",
    "HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED",
    "IRC 223(b)(8)(B)(iii) applies to an individual, not to an account. Supply `persons[].hsaLastMonthRuleTestingPeriod.satisfied` instead.",
  ],
  [
    "testingPeriodFailureByDeathOrDisability",
    "HSA_ACCOUNT_LEVEL_LAST_MONTH_RULE_REMOVED",
    "IRC 223(b)(8)(B)(ii) applies to an individual, not to an account. Supply `persons[].hsaLastMonthRuleTestingPeriod.failureByDeathOrDisability` instead.",
  ],
];

/**
 * Rejected on `persons[].hsaCoverage` as well as on `planRules.hsa`.
 *
 * The nearest-looking home for a field the caller is told to move off the
 * account is the person-level HSA object beside it, and reading these there
 * would be worse than reading them on the account: an ignored
 * `familyLimitShare: 1` falls back to the statutory equal split, so the caller
 * acting on HSA_ACCOUNT_LEVEL_FAMILY_LIMIT_SHARE_REMOVED gets half the
 * limitation they asked for, silently and with no diagnostic. Failing loudly on
 * both paths is the whole point of rejecting rather than normalising.
 */
function rejectRelocatedHsaFields(rules: unknown, path: string): void {
  for (const [field, code, guidance] of RELOCATED_HSA_ACCOUNT_FIELDS) {
    if ((rules as Record<string, unknown>)[field] !== undefined) {
      throw new ParameterError(code, `${path}.${field} is not read here. ${guidance}`);
    }
  }
}

function validateHsaRules(rules: HsaRulesInput, path: string): void {
  validateHsaCoverage(rules, path);
  rejectRelocatedHsaFields(rules, path);
}

function validateHsaLastMonthRuleTestingPeriod(
  rules: HsaLastMonthRuleTestingPeriodInput,
  path: string,
): void {
  booleanFlag(rules.satisfied, `${path}.satisfied`);
  booleanFlag(rules.failureByDeathOrDisability, `${path}.failureByDeathOrDisability`);
}

const HSA_FAMILY_LIMIT_DIVISION_STATUSES = [
  "statutory_equal",
  "agreed",
  "unknown",
  "disputed",
  "inconsistent",
] as const;

function validateHsaFamilyLimitDivision(division: unknown, path: string): void {
  if (division === undefined || division === null) return;
  if (typeof division !== "object") {
    throw new ParameterError("INVALID_INPUT_OBJECT", `${path} must be an object.`);
  }
  const status = (division as { status?: unknown }).status;
  if (typeof status !== "string" || !HSA_FAMILY_LIMIT_DIVISION_STATUSES.includes(status as never)) {
    throw new ParameterError(
      "INVALID_HSA_FAMILY_LIMIT_DIVISION_STATUS",
      `${path}.status must be one of ${HSA_FAMILY_LIMIT_DIVISION_STATUSES.join(", ")}.`,
    );
  }
  const share = (division as { taxpayerShare?: unknown }).taxpayerShare;
  if (status === "agreed") {
    // `null` is rejected alongside `undefined`: `rate` treats both as "absent"
    // and returns its default, which would silently read a stated-but-empty
    // share as a taxpayer share of 0.
    if (share === undefined || share === null) {
      throw new ParameterError(
        "HSA_FAMILY_LIMIT_DIVISION_SHARE_REQUIRED",
        `${path}.taxpayerShare is required when status is "agreed".`,
      );
    }
    rate(share, `${path}.taxpayerShare`);
  } else if (share !== undefined) {
    // A share beside any other status would state an agreement and deny it in
    // the same object; which half to believe is not something to guess at.
    throw new ParameterError(
      "HSA_FAMILY_LIMIT_DIVISION_SHARE_NOT_PERMITTED",
      `${path}.taxpayerShare is permitted only when status is "agreed".`,
    );
  }
}

const HEALTH_FSA_PURPOSES: HealthFsaPurpose[] = [
  "general_purpose",
  "limited_purpose",
  "post_deductible",
];

function validateHealthFsaRules(rules: HealthFsaRulesInput, path: string): void {
  if (
    rules.purpose !== undefined &&
    !HEALTH_FSA_PURPOSES.includes(rules.purpose as HealthFsaPurpose)
  ) {
    throw new ParameterError(
      "INVALID_HEALTH_FSA_PURPOSE",
      `${path}.purpose must be "general_purpose", "limited_purpose", or "post_deductible".`,
    );
  }
  booleanFlag(rules.offersCarryover, `${path}.offersCarryover`);
  booleanFlag(rules.offersGracePeriod, `${path}.offersGracePeriod`);
  booleanFlag(rules.flexCreditElectableAsCash, `${path}.flexCreditElectableAsCash`);
  booleanFlag(rules.planYearIsCalendarYear, `${path}.planYearIsCalendarYear`);
  money(rules.priorYearUnusedAmount, `${path}.priorYearUnusedAmount`);
  money(rules.employerFlexCredit, `${path}.employerFlexCredit`);
  money(rules.planDocumentLimit, `${path}.planDocumentLimit`);
}

function validateDependentCareFsaRules(rules: DependentCareFsaRulesInput, path: string): void {
  money(rules.planDocumentLimit, `${path}.planDocumentLimit`);
}

function validateIsoDate(value: string, path: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ParameterError("INVALID_DATE", `${path} must use YYYY-MM-DD.`);
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new ParameterError("INVALID_DATE", `${path} is not a valid calendar date.`);
  }
}

function ageAtEndOfTaxYear(person: NormalizedPerson, taxYear: number): number | null {
  if (person.birthDate) return taxYear - Number(person.birthDate.slice(0, 4));
  if (person.birthYear !== undefined) return taxYear - person.birthYear;
  return null;
}

function reachesAge70HalfByYearEnd(person: NormalizedPerson, taxYear: number): boolean | null {
  if (person.birthDate) {
    const [year, month, day] = person.birthDate.split("-").map(Number);
    const seventieth = new Date(Date.UTC(year + 70, month - 1, day));
    const seventyHalf = new Date(seventieth.getTime());
    seventyHalf.setUTCMonth(seventyHalf.getUTCMonth() + 6);
    return seventyHalf <= new Date(Date.UTC(taxYear, 11, 31));
  }
  if (person.birthYear !== undefined) {
    const age = taxYear - person.birthYear;
    if (age >= 71) return true;
    if (age <= 69) return false;
    return null;
  }
  return null;
}

function iraCompensation(person: NormalizedPerson): Money {
  const explicit = person.compensation.iraCompensation;
  if (explicit !== undefined) return money(explicit, `${person.id}.compensation.iraCompensation`);
  return roundMoney(
    money(person.compensation.w2Compensation, `${person.id}.compensation.w2Compensation`) +
      money(person.compensation.selfEmploymentNetEarnings, `${person.id}.compensation.selfEmploymentNetEarnings`),
  );
}

function planCompensation(account: NormalizedAccount, person: NormalizedPerson): Money {
  if (account.planRules.planCompensation !== undefined) {
    return money(account.planRules.planCompensation, `${account.id}.planRules.planCompensation`);
  }
  if (account.planRules.isSelfEmployedOwner) {
    return money(
      account.planRules.netEarningsFromSelfEmploymentAfterHalfSETax ?? person.compensation.selfEmploymentNetEarnings,
      `${account.id}.selfEmploymentCompensation`,
    );
  }
  return money(
    person.compensation.w2Compensation ?? person.compensation.iraCompensation,
    `${account.id}.planCompensationDefault`,
  );
}

/**
 * The IRC 401(a)(17) compensation limit this account's participant is actually
 * subject to.
 *
 * OBRA '93 sec. 13212(d)(3) provides that the limit "shall not apply to the
 * extent that it would reduce the amount of compensation that is allowed to be
 * taken into account under the plan below the amount which was allowed to be
 * taken into account under the plan as in effect on July 1, 1993". That is a
 * floor rather than a separate ceiling, so it is taken as the greater of the
 * two figures -- which is the published grandfathered amount in every year the
 * IRS has published one, but says so from the statute rather than from the
 * accident that the series has never crossed.
 *
 * Unpublished post-1993 relief is unknown; allocation is withheld before
 * this provisional compensation value can become an account ceiling.
 */
function grandfatheredGovernmentalLimitDiagnostics(
  context: CalculationContext,
  account: NormalizedAccount,
): Diagnostic[] {
  if (account.planRules.grandfatheredGovernmentalCompensationLimit !== true) return [];
  if (context.taxYear < 1994) return [];
  if (context.parameters.annualCompensation401a17GrandfatheredGovernmental !== null) return [];
  return [
    diagnostic(
      "GRANDFATHERED_GOVERNMENTAL_COMPENSATION_LIMIT_NOT_PUBLISHED",
      DiagnosticSeverity.ERROR,
      `OBRA '93 section 13212(d)(3) preserves a higher IRC 401(a)(17) compensation limit for an eligible participant in certain governmental plans, but the IRS published no figure for ${context.taxYear} — the first it published was for tax year 1998, in Notice 97-58. The applicable compensation ceiling is unknown, so contribution capacity is indeterminate rather than calculated using the ordinary limit.`,
      `accounts.${account.id}.planRules.grandfatheredGovernmentalCompensationLimit`,
      "OBRA '93 sec. 13212(d)(3)",
    ),
  ];
}

function compensationLimit401a17(
  context: CalculationContext,
  account: NormalizedAccount,
): Money | null {
  const ordinary = context.parameters.annualCompensation401a17;
  if (account.planRules.grandfatheredGovernmentalCompensationLimit !== true) return ordinary;
  const grandfathered = context.parameters.annualCompensation401a17GrandfatheredGovernmental;
  if (grandfathered === null) return ordinary;
  return ordinary === null ? grandfathered : Math.max(ordinary, grandfathered);
}

function recognizedCompensationForEmployerAllocation(
  context: CalculationContext,
  account: NormalizedAccount,
  person: NormalizedPerson,
): Money {
  const compensation = planCompensation(account, person);
  const statutoryLimit = compensationLimit401a17(context, account);
  return statutoryLimit === null ? compensation : minMoney(compensation, statutoryLimit);
}

function groupIdForAccount(account: NormalizedAccount): string {
  const employerGroup = account.planRules.annualAdditionsGroupId ?? account.employerId ?? `account:${account.id}`;
  return `${account.ownerId}:${employerGroup}`;
}

function availabilityForAccount(parameters: YearParameters, traits: AccountTraits): boolean {
  if (traits.availabilityKey && parameters.availability[traits.availabilityKey] !== true) return false;
  if (traits.family === "section457" && traits.governmental457 && traits.designatedRoth) {
    return parameters.section457b.designatedRothAvailableForGovernmentalPlans === true;
  }
  return true;
}

function workplaceCatchUpLimit(
  parameters: YearParameters,
  person: NormalizedPerson,
  traits: AccountTraits,
): Money {
  const age = ageAtEndOfTaxYear(person, parameters.year);
  if (!traits.permitsAgeCatchUpByStatute || age === null || age < 50) return 0;
  if (traits.isStarter) return parameters.starterDeferralOnly.age50CatchUp;
  if (traits.isSimple) {
    if (age >= 60 && age <= 63 && parameters.simple.age60To63CatchUp !== null) {
      return parameters.simple.age60To63CatchUp;
    }
    if (parameters.simple.certainPlanAge50CatchUp !== null && parameters.year >= 2024) {
      return parameters.simple.generalAge50CatchUp;
    }
    return parameters.simple.generalAge50CatchUp;
  }
  if (age >= 60 && age <= 63 && parameters.age60To63CatchUp !== null) {
    return parameters.age60To63CatchUp;
  }
  if (traits.family === "section457") return parameters.section457b.governmentalAge50CatchUp;
  return parameters.generalAge50CatchUp;
}

/**
 * The largest IRC 414(v) catch-up this account could take in this year at any
 * age. Used only where the participant's age is unknown, to decide whether it
 * could matter: the owner's catch-up pool cannot answer that question, because
 * its own limit is sized from the same unknown age and so reads empty exactly
 * when the question is open.
 */
function maximumAgeCatchUpLimitForYear(parameters: YearParameters, traits: AccountTraits): Money {
  if (!traits.permitsAgeCatchUpByStatute) return 0;
  const atFifty =
    traits.family === "section457"
      ? parameters.section457b.governmentalAge50CatchUp
      : parameters.generalAge50CatchUp;
  // IRC 414(v)(2)(E) gives ages 60 through 63 a larger figure where the year
  // encodes one, and workplaceCatchUpLimit prefers it over every family's own
  // age-50 amount, so it is part of the maximum.
  return Math.max(atFifty, parameters.age60To63CatchUp ?? 0);
}

function ownerGeneralCatchUpLimit(parameters: YearParameters, person: NormalizedPerson): Money {
  const age = ageAtEndOfTaxYear(person, parameters.year);
  if (age === null || age < 50) return 0;
  if (age >= 60 && age <= 63 && parameters.age60To63CatchUp !== null) return parameters.age60To63CatchUp;
  return parameters.generalAge50CatchUp;
}

function rangeForFilingStatus(
  range: PhaseoutRange | null,
  status: FilingStatus,
  livedWithSpouseDuringYear: boolean,
  spouseCoveredRange: boolean,
): [Money, Money] | null {
  if (!range) return null;
  if (status === FilingStatus.MARRIED_FILING_JOINTLY) {
    return spouseCoveredRange
      ? range.marriedFilingJointly ?? range.marriedFilingJointlyOrQualifyingSurvivingSpouse ?? null
      : range.marriedFilingJointlyOrQualifyingSurvivingSpouse ?? range.marriedFilingJointly ?? null;
  }
  if (status === FilingStatus.QUALIFYING_SURVIVING_SPOUSE) {
    return range.marriedFilingJointlyOrQualifyingSurvivingSpouse ?? null;
  }
  if (status === FilingStatus.MARRIED_FILING_SEPARATELY && livedWithSpouseDuringYear) {
    return range.marriedFilingSeparatelyLivingTogether ?? null;
  }
  return range.singleOrHeadOfHousehold ?? null;
}

function phaseoutReducedLimit(
  unreducedLimit: Money,
  magi: Money,
  range: [Money, Money] | null,
): Money {
  if (!range) return unreducedLimit;
  const [lower, upper] = range;
  if (magi <= lower) return unreducedLimit;
  if (magi >= upper) return 0;
  const raw = unreducedLimit * ((upper - magi) / (upper - lower));
  const increment = RAW_PARAMETERS.rounding.iraPhaseoutIncrement;
  const roundedUp = Math.ceil(raw / increment) * increment;
  return roundMoney(Math.max(RAW_PARAMETERS.rounding.iraPositiveReducedMinimum, roundedUp));
}

function personalIraStatutoryLimit(person: NormalizedPerson, parameters: YearParameters): Money | null {
  const age = ageAtEndOfTaxYear(person, parameters.year);
  if (age === null) return null;
  return roundMoney(parameters.ira.baseContributionLimit + (age >= 50 ? parameters.ira.age50CatchUp : 0));
}

function livedWithSpouse(person: NormalizedPerson, filingStatus: FilingStatus): boolean {
  if (person.livedWithSpouseDuringYear !== undefined) return person.livedWithSpouseDuringYear;
  return filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY;
}

function spouseForPerson(
  persons: Map<string, NormalizedPerson>,
  person: NormalizedPerson,
): NormalizedPerson | undefined {
  if (person.role === "taxpayer") {
    return [...persons.values()].find((candidate) => candidate.role === "spouse");
  }
  if (person.role === "spouse") {
    return [...persons.values()].find((candidate) => candidate.role === "taxpayer");
  }
  return undefined;
}

function traditionalIraDeductionLimit(
  context: CalculationContext,
  person: NormalizedPerson,
  personalLimit: Money | null,
): Money | null {
  if (personalLimit === null) return null;
  const { parameters, filingStatus } = context;
  const selfCoverage = person.coveredByEmployerRetirementPlan;

  if (!parameters.ira.universalEligibility) {
    if (selfCoverage === undefined) return null;
    return selfCoverage ? 0 : personalLimit;
  }
  if (parameters.year < 1987) return personalLimit;

  const spouse = spouseForPerson(context.persons, person);
  const livingTogether = livedWithSpouse(person, filingStatus);
  const spouseCoverageRelevant =
    (filingStatus === FilingStatus.MARRIED_FILING_JOINTLY ||
      (filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY && livingTogether)) &&
    spouse !== undefined;

  if (selfCoverage === undefined) return null;
  let applicableRange: PhaseoutRange | null = null;
  let useSpouseCoveredRange = false;
  if (selfCoverage) {
    applicableRange = parameters.phaseouts.traditionalIraCovered;
  } else if (spouseCoverageRelevant) {
    if (spouse!.coveredByEmployerRetirementPlan === undefined) return null;
    if (spouse!.coveredByEmployerRetirementPlan) {
      applicableRange = parameters.phaseouts.traditionalIraSpouseCovered;
      useSpouseCoveredRange = true;
    }
  }
  if (!applicableRange) return personalLimit;
  if (person.magi.traditionalIraDeduction === undefined) return null;
  return phaseoutReducedLimit(
    personalLimit,
    money(person.magi.traditionalIraDeduction, `${person.id}.magi.traditionalIraDeduction`),
    rangeForFilingStatus(applicableRange, filingStatus, livingTogether, useSpouseCoveredRange),
  );
}

function createCalculationContext(
  taxYear: number,
  filingStatus: FilingStatus,
  treatedAsUnmarriedUnderSection21e4: boolean | null,
  hsaFamilyLimitDivision: HsaFamilyLimitDivisionInput,
  parameters: YearParameters,
  hsaParameters: HsaYearParameters | null,
  fsaParameters: FsaYearParameters | null,
  persons: Map<string, NormalizedPerson>,
  accounts: NormalizedAccount[],
  scenarioDiagnostics: Diagnostic[],
): CalculationContext {
  const context: CalculationContext = {
    taxYear,
    filingStatus,
    treatedAsUnmarriedUnderSection21e4,
    hsaFamilyLimitDivision,
    parameters,
    hsaParameters,
    fsaParameters,
    persons,
    accountsById: new Map(accounts.map((account) => [account.id, account])),
    scenarioDiagnostics,
    iraOwnerPools: new Map(),
    iraCompensationPools: new Map(),
    iraRothEligibilityPools: new Map(),
    iraDeductionPools: new Map(),
    elective402gPools: new Map(),
    catchUpPools: new Map(),
    special403bCatchUpPools: new Map(),
    annualAdditionsPools: new Map(),
    section457BasePools: new Map(),
    section457CatchUpPools: new Map(),
    section457SpecialCatchUpPools: new Map(),
    section457CatchUpResolutions: new Map(),
    hsaBasePools: new Map(),
    hsaCatchUpPools: new Map(),
    hsaFamilyPools: new Map(),
    hsaPlans: new Map(),
    healthFsaPools: new Map(),
    healthFsaPlans: new Map(),
    dependentCarePools: new Map(),
    dependentCarePlans: new Map(),
    dependentCareEarnedIncomeCeilings: new Map(),
    section220TwiceTheLesserOwners: new Set(),
  };

  initializeIraPools(context, accounts);
  initializeElectiveDeferralPools(context, accounts);
  initializeAnnualAdditionsPools(context, accounts);
  initializeSection457Pools(context, accounts);
  // After both catch-up families have their pools, because the IRC 414(v)(6)(C)
  // exception this reads is settled by resolveSection457CatchUpModes inside
  // initializeSection457Pools.
  seedUnresolvedCatchUpAttribution(context, accounts);
  // Health FSA facts are read by the IRC 223 interaction, so the arrangements
  // must be resolved before the health savings accounts that consult them.
  initializeHealthFsaPools(context, accounts);
  initializeDependentCarePools(context, accounts);
  initializeHsaPools(context, accounts);
  return context;
}

function initializeIraPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  const { parameters, persons, filingStatus } = context;
  const taxpayerAndSpouse = [...persons.values()].filter(
    (person) => person.role === "taxpayer" || person.role === "spouse",
  );
  const shareSpousalCompensation =
    filingStatus === FilingStatus.MARRIED_FILING_JOINTLY && taxpayerAndSpouse.length >= 2;

  if (shareSpousalCompensation) {
    const combinedCompensation = roundMoney(
      taxpayerAndSpouse.reduce((sum, person) => sum + iraCompensation(person), 0),
    );
    const earningCount = taxpayerAndSpouse.filter((person) => iraCompensation(person) > 0).length;
    let householdLimit = roundMoney(combinedCompensation * parameters.ira.compensationFraction);
    if (earningCount === 1 && parameters.ira.oneEarnerHouseholdCombinedLimit !== null) {
      householdLimit = Math.min(householdLimit, parameters.ira.oneEarnerHouseholdCombinedLimit);
    }
    const sumPersonalStatutory = taxpayerAndSpouse.reduce((sum, person) => {
      const limit = personalIraStatutoryLimit(person, parameters);
      return sum + (limit ?? 0);
    }, 0);
    if (taxpayerAndSpouse.every((person) => personalIraStatutoryLimit(person, parameters) !== null)) {
      householdLimit = Math.min(householdLimit, sumPersonalStatutory);
    }
    context.iraCompensationPools.set("ira-household", {
      id: "ira-household",
      legalLimit: "IRC 219(c) joint-return compensation limit",
      limit: roundMoney(householdLimit),
      usage: settled(0),
    });
  }

  for (const person of persons.values()) {
    const statutory = personalIraStatutoryLimit(person, parameters);
    const ownCompensation = iraCompensation(person);
    const isHouseholdMember =
      shareSpousalCompensation && (person.role === "taxpayer" || person.role === "spouse");
    const compensationPoolId = isHouseholdMember ? "ira-household" : `ira-compensation:${person.id}`;

    if (!isHouseholdMember) {
      context.iraCompensationPools.set(compensationPoolId, {
        id: compensationPoolId,
        legalLimit: "IRC 219(b) compensation limit",
        limit: statutory === null
          ? null
          : minMoney(statutory, ownCompensation * parameters.ira.compensationFraction),
        usage: settled(0),
      });
    }

    let personalLimit = statutory;
    if (personalLimit !== null && isHouseholdMember && parameters.year < 1997 && ownCompensation === 0) {
      personalLimit = parameters.ira.spousalIraAvailable
        ? parameters.ira.nonworkingSpouseIndividualLimit
        : 0;
      if (parameters.ira.spousalIraAvailable && parameters.ira.spousalDeductionIsTwiceTheLesserOfContributions) {
        context.section220TwiceTheLesserOwners.add(person.id);
      }
    }
    if (personalLimit !== null && isHouseholdMember && parameters.year < 1997 && ownCompensation > 0) {
      personalLimit = minMoney(personalLimit, ownCompensation * parameters.ira.compensationFraction);
    }
    context.iraOwnerPools.set(person.id, {
      id: `ira-owner:${person.id}`,
      legalLimit: "IRC 219(b) aggregate traditional and Roth IRA contribution limit",
      limit: personalLimit,
      usage: settled(0),
      blocked: false,
      compensationPoolId,
    });

    let rothEligibilityLimit: Money | null = 0;
    if (parameters.ira.rothAvailable) {
      if (personalLimit === null || person.magi.rothIra === undefined) {
        rothEligibilityLimit = null;
      } else {
        rothEligibilityLimit = phaseoutReducedLimit(
          personalLimit,
          money(person.magi.rothIra, `${person.id}.magi.rothIra`),
          rangeForFilingStatus(
            parameters.phaseouts.rothIra,
            filingStatus,
            livedWithSpouse(person, filingStatus),
            false,
          ),
        );
      }
    }
    context.iraRothEligibilityPools.set(person.id, {
      id: `roth-ira-eligibility:${person.id}`,
      legalLimit: "IRC 408A(c)(3) direct Roth IRA MAGI limit",
      limit: rothEligibilityLimit,
      usage: settled(0),
    });

    context.iraDeductionPools.set(person.id, {
      id: `traditional-ira-deduction:${person.id}`,
      legalLimit: "IRC 219(g) traditional IRA deduction limit",
      limit: traditionalIraDeductionLimit(context, person, personalLimit),
      usage: settled(0),
    });
  }

  for (const account of accounts) {
    const traits = ACCOUNT_TRAITS[account.type];
    if (traits.family !== "regular_traditional_ira" && traits.family !== "regular_roth_ira") continue;
    const existing = regularIraContributionAmount(account.existingContributions);
    const ownerPool = context.iraOwnerPools.get(account.ownerId);
    if (!ownerPool) continue;
    chargePool(ownerPool, existing);
    const compensationPool = context.iraCompensationPools.get(ownerPool.compensationPoolId);
    if (compensationPool) chargePool(compensationPool, existing);
    const rothPool = context.iraRothEligibilityPools.get(account.ownerId);
    if (rothPool) chargePool(rothPool, account.existingContributions.rothIra);
    const deductionPool = context.iraDeductionPools.get(account.ownerId);
    if (deductionPool) chargePool(deductionPool, account.existingContributions.deductibleIra);
  }
}

function initializeElectiveDeferralPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  for (const person of context.persons.values()) {
    context.elective402gPools.set(person.id, {
      id: `402g:${person.id}`,
      legalLimit: "IRC 402(g) aggregate elective-deferral limit",
      limit: context.parameters.electiveDeferral402g,
      usage: settled(0),
    });
    context.catchUpPools.set(person.id, {
      id: `414v:${person.id}`,
      legalLimit: "IRC 414(v) aggregate age-based catch-up limit",
      limit: ownerGeneralCatchUpLimit(context.parameters, person),
      usage: settled(0),
    });
    context.special403bCatchUpPools.set(person.id, {
      id: `402g7:${person.id}`,
      legalLimit: "IRC 402(g)(7) aggregate 403(b) 15-year catch-up limit",
      limit: context.parameters.special403b15YearCatchUp.annualLimit,
      usage: settled(0),
    });
  }

  for (const account of accounts) {
    const traits = ACCOUNT_TRAITS[account.type];
    if (!traits.shares402g) continue;
    const basePool = context.elective402gPools.get(account.ownerId);
    const catchUpPool = context.catchUpPools.get(account.ownerId);
    if (basePool) chargePool(basePool, baseElectiveDeferrals(account.existingContributions));
    if (catchUpPool) chargePool(catchUpPool, ageCatchUpDeferrals(account.existingContributions));
    if (traits.is403b) {
      const special403bPool = context.special403bCatchUpPools.get(account.ownerId);
      if (special403bPool) {
        chargePool(special403bPool, account.existingContributions.special403bCatchUp);
      }
    }
  }
}

function initializeAnnualAdditionsPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  const groupAccounts = new Map<string, NormalizedAccount[]>();
  for (const account of accounts) {
    if (!ACCOUNT_TRAITS[account.type].uses415c) continue;
    const groupId = groupIdForAccount(account);
    const list = groupAccounts.get(groupId) ?? [];
    list.push(account);
    groupAccounts.set(groupId, list);
  }

  for (const [groupId, members] of groupAccounts) {
    let recognizedCompensation = 0;
    let compensationIndeterminate = false;
    let existing = 0;
    for (const account of members) {
      const person = context.persons.get(account.ownerId)!;
      // Each member is capped by its own plan's limit before the group takes the
      // greatest, because OBRA '93 sec. 13212(d)(3) lifts the limit for a
      // participant in a particular plan and the accounts aggregated here need
      // not all be that plan. Where they share one limit this is the previous
      // order exactly, min being monotone: max_i min(c_i, L) = min(max_i c_i, L).
      compensationIndeterminate ||= grandfatheredGovernmentalLimitDiagnostics(context, account).length > 0;
      const limit = compensationLimit401a17(context, account);
      const compensation = planCompensation(account, person);
      recognizedCompensation = Math.max(
        recognizedCompensation,
        limit === null ? compensation : Math.min(compensation, limit),
      );
      existing = roundMoney(existing + annualAdditionsAmount(account.existingContributions));
    }
    let limit: Money | null = null;
    if (
      !compensationIndeterminate &&
      context.parameters.annualAdditions415c !== null &&
      context.parameters.annualAdditionsCompensationFraction !== null
    ) {
      limit = minMoney(
        context.parameters.annualAdditions415c,
        recognizedCompensation * context.parameters.annualAdditionsCompensationFraction,
      );
    }
    context.annualAdditionsPools.set(groupId, {
      id: `415c:${groupId}`,
      legalLimit: "IRC 415(c) annual-additions limit",
      limit,
      usage: settled(existing),
      compensation: roundMoney(recognizedCompensation),
    });
  }
}

/**
 * Which of the two mutually exclusive IRC 457 catch-up methods applies to a
 * participant for the year, and how much it is worth.
 *
 * 26 CFR 1.457-5(a) states the individual limitation as the basic annual
 * limitation "plus either the age 50 catch-up amount under 1.457-4(c)(2), or
 * the special section 457 catch-up amount under 1.457-4(c)(3), applied by
 * taking into account the combined annual deferral for the participant for any
 * taxable year under all eligible plans" — so the choice is made once for the
 * participant, across every plan, and not once per account. 1.457-5(b) puts
 * that aggregation across the plans of every employer the participant has
 * served, governmental and tax-exempt alike.
 *
 * `headroom` is a single amount rather than a sum because 1.457-5(c) says that
 * where the applicable catch-up differs between a participant's plans, the
 * limitation is applied "using the catch-up amount under whichever plan has the
 * largest catch-up amount applicable to the participant". `eligibleAccountIds`
 * carries the other half of that paragraph: the special catch-up counts "only
 * to the extent that an annual deferral is made for a participant under an
 * eligible plan as a result of plan provisions permitted under 1.457-4(c)(3)",
 * and the age-based method likewise reaches only a governmental plan. Account
 * priority may therefore decide *where* interchangeable capacity lands; it may
 * never decide *which method applies* or move a method's headroom to a plan
 * that does not provide it.
 */
type Section457CatchUpMode = "none" | "age" | "special" | "indeterminate";

interface Section457CatchUpResolution {
  mode: Section457CatchUpMode;
  headroom: Money;
  /** The IRC 414(v) alternative, kept so the selection can be explained. */
  ageAmount: Money;
  /** The largest IRC 457(b)(3) amount any of the participant's plans provides. */
  specialAmount: Money;
  /** Aggregate IRC 414(v) catch-up already recorded across the IRC 457 accounts. */
  existingAgeCatchUp: Money;
  /** Aggregate IRC 457(b)(3) catch-up already recorded across the same accounts. */
  existingSpecialCatchUp: Money;
  /** Whether any existing catch-up component needs participant-wide reconciliation. */
  existingCatchUpClassificationUnreconciled: boolean;
  eligibleAccountIds: ReadonlySet<string>;
}

/**
 * The IRC 457(b)(2) plan ceiling for one account and the capacity each catch-up
 * method adds above it.
 *
 * IRC 457(b)(2) and 26 CFR 1.457-4(c)(1)(i) set the ordinary plan ceiling at the
 * lesser of the IRC 457(e)(15) dollar amount and 100 percent of includible
 * compensation. IRC 457(b)(3) then provides that for the last three years before
 * normal retirement age "the ceiling set forth in paragraph (2) shall be" the
 * lesser of twice the dollar amount and the sum of "the plan ceiling established
 * for purposes of paragraph (2) for the taxable year" and the unused portion of
 * prior years' ceilings; 26 CFR 1.457-4(c)(3)(ii)(A) states the first addend the
 * same way. That term is the compensation-bounded figure, not the dollar amount,
 * so with `D` the dollar amount, `C` includible compensation and `U` the
 * prior-year underutilized limitation:
 *
 *     basic plan ceiling      B = min(D, C)
 *     special plan ceiling    S = min(2D, B + U)
 *     special above the basic S - B = min(2D - B, U)
 *
 * `min(D, U)` is that only where `B` equals `D`. Where compensation binds, `2D -
 * B` exceeds `D`, and reducing the special amount to `min(D, U)` understated the
 * ceiling by exactly the amount compensation fell short.
 *
 * The two methods also differ in whether compensation bounds them a second time.
 * IRC 457(b)(3) *replaces* the paragraph (2) ceiling, so the 100-percent bound
 * inside that paragraph is displaced rather than reapplied. IRC 414(v) instead
 * adds to the paragraph (2) ceiling, and IRC 414(v)(2)(A)(ii) caps the addition
 * at the excess of the participant's compensation over the elective deferrals
 * made without regard to it. Comparing the raw catch-up dollar figures therefore
 * answers a different question from the one 26 CFR 1.457-4(c)(2)(ii) asks, which
 * is between the resulting plan ceilings.
 */
interface Section457PlanCeilings {
  /** IRC 457(e)(5) includible compensation as supplied, before the fraction. */
  includibleCompensation: Money;
  /** 26 CFR 1.457-4(c)(1)(i): the lesser of the dollar amount and the fraction. */
  basicPlanCeiling: Money;
  /** IRC 457(b)(3) capacity above `basicPlanCeiling`. */
  specialAdditional: Money;
  /** IRC 414(v) capacity above `basicPlanCeiling`, bounded by 414(v)(2)(A)(ii). */
  ageAdditional: Money;
  /** `ageAdditional` at the largest IRC 414(v) figure the year could produce. */
  largestPossibleAgeAdditional: Money;
}

/**
 * IRC 457(e)(5) includible compensation for one account, from the most specific
 * supplied fact. Shared by the resolver and the allocator so a plan ceiling is
 * built from the same compensation in both.
 */
function section457IncludibleCompensation(
  account: NormalizedAccount,
  person: NormalizedPerson,
): Money {
  return money(
    account.planRules.includibleCompensation457 ??
      account.planRules.planCompensation ??
      planCompensation(account, person),
    `${account.id}.includibleCompensation457`,
  );
}

function section457PlanCeilings(
  parameters: YearParameters,
  person: NormalizedPerson,
  account: NormalizedAccount,
  statutoryBase: Money,
  compensationFraction: number,
): Section457PlanCeilings {
  const traits = ACCOUNT_TRAITS[account.type];
  const includibleCompensation = section457IncludibleCompensation(account, person);
  const deferrableCompensation = includibleCompensation * compensationFraction;
  const basicPlanCeiling = minMoney(statutoryBase, deferrableCompensation);
  const special = account.planRules.section457SpecialCatchUp;
  const specialAdditional = !special?.eligible
    ? 0
    : minMoney(
        nonnegative(2 * statutoryBase - basicPlanCeiling),
        money(special.unusedDeferralsFromPriorYears, `${account.id}.unused457Deferrals`),
      );
  const ageCompensationRoom = nonnegative(deferrableCompensation - basicPlanCeiling);
  // IRC 414(v)(6)(A)(ii) reaches only an eligible governmental plan.
  const permitsAge = traits.governmental457 && traits.permitsAgeCatchUpByStatute;
  return {
    includibleCompensation,
    basicPlanCeiling,
    specialAdditional,
    ageAdditional: permitsAge
      ? minMoney(workplaceCatchUpLimit(parameters, person, traits), ageCompensationRoom)
      : 0,
    largestPossibleAgeAdditional: permitsAge
      ? minMoney(maximumAgeCatchUpLimitForYear(parameters, traits), ageCompensationRoom)
      : 0,
  };
}

/**
 * Resolves the participant-wide catch-up method for every person holding an
 * IRC 457 account, from the plan ceilings each of their plans actually produces
 * rather than from whatever pool capacity happens to survive to a given account.
 *
 * The comparison is the one 26 CFR 1.457-4(c)(2)(ii) states: the special
 * catch-up applies "if and only if" the plan ceiling counting paragraph (c)(1)
 * and the special catch-up "is larger than" the plan ceiling counting paragraph
 * (c)(1) and the age 50 catch-up. Both sides share the paragraph (c)(1) term, so
 * the test reduces to the two *additional* amounts -- but only once each is
 * computed as the statute computes it, which is what `section457PlanCeilings`
 * does: the IRC 457(b)(3) amount grows as includible compensation falls, and the
 * IRC 414(v) amount shrinks to nothing as it does. Comparing the two raw dollar
 * figures instead answers the question the regulation does not ask, and gets the
 * opposite result whenever compensation binds.
 *
 * "Larger than" is strict, which is also how IRC 414(v)(6)(C) and IRC 457(e)(18)
 * read: an equal IRC 457(b)(3) amount does not displace the age-based method.
 *
 * Each `AccountInput` is one eligible plan for these purposes. A pension-linked
 * emergency savings account is an account inside a host IRC 457(b) plan rather
 * than a plan of its own, so a host plan's IRC 457(b)(3) provision has to be
 * stated on the emergency savings record too for that record to draw the amount.
 * README documents the contract; #53 tracks the plan-group key that would let one
 * statement cover both records.
 */
function resolveSection457CatchUpModes(
  context: CalculationContext,
  accounts: NormalizedAccount[],
): void {
  const statutoryBase = context.parameters.section457b.baseDeferralLimit;
  const compensationFraction = context.parameters.section457b.includibleCompensationFraction;

  for (const person of context.persons.values()) {
    // 26 CFR 1.457-5(b) aggregates across the eligible plans the participant is
    // actually in. An account type the year does not offer is not one of them:
    // allocateAccount rejects it outright, so letting it declare a method, a
    // ceiling or an existing contribution here would let an account that cannot
    // legally exist for the year settle the answer for one that can.
    const owned = accounts.filter(
      (account) =>
        account.ownerId === person.id &&
        ACCOUNT_TRAITS[account.type].family === "section457" &&
        availabilityForAccount(context.parameters, ACCOUNT_TRAITS[account.type]),
    );
    if (owned.length === 0) continue;
    if (statutoryBase === null || compensationFraction === null) {
      context.section457CatchUpResolutions.set(person.id, {
        mode: "none",
        headroom: 0,
        ageAmount: 0,
        specialAmount: 0,
        existingAgeCatchUp: 0,
        existingSpecialCatchUp: 0,
        existingCatchUpClassificationUnreconciled: false,
        eligibleAccountIds: new Set(),
      });
      continue;
    }

    const ceilings = new Map(
      owned.map((account) => [
        account.id,
        section457PlanCeilings(context.parameters, person, account, statutoryBase, compensationFraction),
      ]),
    );

    // IRC 414(v)(6)(A)(ii) reaches only an eligible governmental plan, so a
    // participant with no such account has no age-based method to choose.
    const governmentalAccounts = owned.filter(
      (account) =>
        ACCOUNT_TRAITS[account.type].governmental457 &&
        ACCOUNT_TRAITS[account.type].permitsAgeCatchUpByStatute,
    );
    // 26 CFR 1.457-5(c) applies the limitation "using the catch-up amount under
    // whichever plan has the largest catch-up amount applicable to the
    // participant" -- the largest, not the sum, and separately for each method,
    // because each plan bounds each method with its own includible compensation.
    // Its Example 2 works the special side through four plans offering $7,000,
    // $2,000, $8,000 and nothing, which yield one $8,000 catch-up that has to be
    // deferred under the plan offering it.
    const ageAmount = governmentalAccounts.reduce(
      (largest, account) => Math.max(largest, ceilings.get(account.id)!.ageAdditional),
      0,
    );
    const largestPossibleAgeCatchUp = governmentalAccounts.reduce(
      (largest, account) => Math.max(largest, ceilings.get(account.id)!.largestPossibleAgeAdditional),
      0,
    );
    const specialAccounts = owned.filter((account) => ceilings.get(account.id)!.specialAdditional > 0);
    const specialAmount = specialAccounts.reduce(
      (largest, account) => Math.max(largest, ceilings.get(account.id)!.specialAdditional),
      0,
    );
    const ageUnknown = ageAtEndOfTaxYear(person, context.taxYear) === null;

    let mode: Section457CatchUpMode;
    if (specialAmount > largestPossibleAgeCatchUp) {
      // IRC 414(v)(6)(C) removes the age-based method for a year in which a
      // higher IRC 457(b)(3) limitation applies. Where the IRC 457(b)(3) amount
      // beats the largest plan ceiling the year could produce at *any* age, that
      // is settled without knowing this participant's age -- and where
      // IRC 414(v)(2)(A)(ii) leaves no compensation for an age-based catch-up,
      // the largest such ceiling is the basic one, so the age is moot.
      mode = "special";
    } else if (ageUnknown && largestPossibleAgeCatchUp > 0) {
      // Not merely the amount but the *method* turns on the age, and the two
      // draw different pools and can carry different tax treatment. Reporting a
      // floor would put a figure in a field named for a maximum and file it
      // under a statutory category the supplied facts do not establish.
      mode = "indeterminate";
    } else if (specialAmount > ageAmount) {
      mode = "special";
    } else if (ageAmount > 0) {
      mode = "age";
    } else {
      mode = "none";
    }

    const headroom = mode === "special" ? specialAmount : mode === "age" ? ageAmount : 0;
    // For a resolved method the set is the statutory one: which plans provide
    // it. For an unresolved one it names every account either method could
    // reach, so the missing-age diagnostic can be considered for each; whether
    // an account has room left for a catch-up to occupy is settled in the
    // allocator, after the base deferral has been made, where the figures are
    // exact.
    const eligible =
      mode === "special"
        ? specialAccounts
        : mode === "age"
          ? governmentalAccounts
          : mode === "indeterminate"
            ? [...governmentalAccounts, ...specialAccounts]
            : [];
    // 26 CFR 1.457-5(a) states the individual limitation as the basic annual
    // limitation plus *either* the age 50 catch-up or the special IRC 457(b)(3)
    // catch-up, and 1.457-5(b) applies it "on an aggregate basis" across the
    // eligible plans of every employer the participant served. Contributions
    // already recorded under both methods therefore breach the limitation as a
    // pair, however small each one is, and contributions recorded under the one
    // the statute did not select breach it however small the total is, so the
    // aggregates are carried here for the allocator to diagnose.
    const existingAgeCatchUp = roundMoney(
      owned.reduce((total, account) => total + ageCatchUpDeferrals(account.existingContributions), 0),
    );
    const existingSpecialCatchUp = roundMoney(
      owned.reduce(
        (total, account) =>
          total +
          account.existingContributions.special457CatchUp +
          account.existingContributions.special457RothCatchUp,
        0,
      ),
    );
    const selectedExistingCatchUp =
      mode === "age" ? existingAgeCatchUp : mode === "special" ? existingSpecialCatchUp : 0;
    const unselectedExistingCatchUp = roundMoney(
      existingAgeCatchUp + existingSpecialCatchUp - selectedExistingCatchUp,
    );
    const existingCatchUpClassificationUnreconciled =
      (mode === "indeterminate" && existingAgeCatchUp + existingSpecialCatchUp > 0) ||
      (existingAgeCatchUp > 0 && existingSpecialCatchUp > 0) ||
      (mode !== "indeterminate" && unselectedExistingCatchUp > 0) ||
      (mode !== "indeterminate" && selectedExistingCatchUp > headroom) ||
      owned.some((account) => {
        const traits = ACCOUNT_TRAITS[account.type];
        const accountExistingAgeCatchUp = ageCatchUpDeferrals(account.existingContributions);
        const accountExistingSpecialCatchUp = roundMoney(
          account.existingContributions.special457CatchUp +
            account.existingContributions.special457RothCatchUp,
        );

        return (
          (accountExistingAgeCatchUp > 0 &&
            !(traits.governmental457 && traits.permitsAgeCatchUpByStatute)) ||
          (accountExistingSpecialCatchUp > 0 &&
            (!account.planRules.section457SpecialCatchUp?.eligible ||
              accountExistingSpecialCatchUp > ceilings.get(account.id)!.specialAdditional))
        );
      });
    context.section457CatchUpResolutions.set(person.id, {
      mode,
      headroom,
      ageAmount,
      specialAmount,
      existingAgeCatchUp,
      existingSpecialCatchUp,
      existingCatchUpClassificationUnreconciled,
      eligibleAccountIds: new Set(eligible.map((account) => account.id)),
    });
  }
}

/**
 * Widen the pools an IRC 414(v)(7)(A)-condemned existing catch-up may have
 * consumed, from the figure the seeding assumed to the range the facts leave.
 *
 * The seeding charged the amount to the catch-up pool, which is where it belongs
 * if it was a valid IRC 414(v)(1) additional elective deferral. IRC 414(v)(7)(A)
 * says it was not: above the wage threshold paragraph (1) applies "only if" the
 * additional elective deferrals are designated Roth contributions, and this one
 * is pre-tax. So the seeding's assumption is exactly the thing in doubt.
 *
 * The alternative is not "nothing". IRC 414(v)(3)(A)(i) disregards a catch-up
 * for the IRC 402(g) limit, but only a contribution "made under paragraph (1)";
 * once paragraph (7)(A) prevents that treatment the amount is an ordinary
 * elective deferral and IRC 401(a)(30) and IRC 402(g) reach it again. Notice
 * 2023-62 confirms the relief survives SECURE 2.0 section 603(b)(1)'s striking
 * of IRC 402(g)(1)(C) -- "the elimination of section 402(g)(1)(C) ... does not
 * change this result for taxable years beginning after December 31, 2023" -- so
 * validity is what decides which limitation the amount draws on, and an amount
 * of unresolved validity cannot be charged to either as settled.
 *
 * Hence a range in each, not a withdrawal from one. The catch-up pool has
 * certainly spent the amount only if the contribution was valid, so its minimum
 * gives it up; the base pool has spent it only if the contribution was not, so
 * its maximum takes it on. Both carry the same uncertainty key, because the
 * reading that charges one is the reading that spares the other and their maxima
 * never both hold.
 *
 * Correcting or recharacterizing the amount is a third completion, and it is
 * inside these bounds rather than beside them: a corrected amount consumes
 * neither limitation, which is each pool's minimum.
 */
function seedUnresolvedCatchUpAttribution(
  context: CalculationContext,
  accounts: NormalizedAccount[],
): void {
  for (const account of accounts) {
    const traits = ACCOUNT_TRAITS[account.type];
    const invalid = highWageInvalidExistingPreTaxCatchUp(context, account, traits);
    if (invalid === null) continue;
    const section457 = catchUpPoolFamily(traits) === "section457";
    attributeToEitherPool(
      section457
        ? context.section457CatchUpPools.get(account.ownerId)
        : context.catchUpPools.get(account.ownerId),
      section457
        ? context.section457BasePools.get(account.ownerId)
        : context.elective402gPools.get(account.ownerId),
      invalid.existing,
      `existing-pre-tax-catch-up:${account.id}`,
    );
  }
}

function initializeSection457Pools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  resolveSection457CatchUpModes(context, accounts);
  for (const person of context.persons.values()) {
    context.section457BasePools.set(person.id, {
      id: `457b:${person.id}`,
      legalLimit: "IRC 457(b) aggregate annual deferral limit (separate from IRC 402(g))",
      limit: context.parameters.section457b.baseDeferralLimit,
      usage: settled(0),
    });
    context.section457CatchUpPools.set(person.id, {
      id: `457b-catch-up:${person.id}`,
      legalLimit: "IRC 414(v) governmental 457(b) age-based catch-up limit",
      // The largest amount any one of the participant's governmental plans can
      // host, for the same reason the IRC 457(b)(3) pool below is: 26 CFR
      // 1.457-5(c) applies the limitation "using the catch-up amount under
      // whichever plan has the largest catch-up amount applicable to the
      // participant". Each plan bounds the IRC 414(v) amount with its own
      // includible compensation under IRC 414(v)(2)(A)(ii), so a pool holding the
      // unbounded annual figure instead let two plans whose compensation each
      // bound them separately add up past the individual limitation.
      limit: context.section457CatchUpResolutions.get(person.id)?.ageAmount ?? 0,
      usage: settled(0),
    });
    context.section457SpecialCatchUpPools.set(person.id, {
      id: `457b-special-catch-up:${person.id}`,
      legalLimit: "IRC 457(b)(3) special last-three-years catch-up",
      // The largest amount any one of the participant's plans provides, not the
      // sum of what they all provide: 26 CFR 1.457-5(c) applies the limitation
      // "using the catch-up amount under whichever plan has the largest catch-up
      // amount applicable to the participant". A pool limited to the statutory
      // base instead let two plans' separate amounts add.
      limit: context.section457CatchUpResolutions.get(person.id)?.specialAmount ?? 0,
      usage: settled(0),
    });
  }

  for (const account of accounts) {
    if (ACCOUNT_TRAITS[account.type].family !== "section457") continue;
    // An account type the year does not offer seeds nothing. allocateAccount
    // rejects it and reports EXISTING_CONTRIBUTION_BEFORE_ACCOUNT_AVAILABLE for
    // whatever it holds; charging that amount against a pool as well would let it
    // take capacity away from an account that does exist for the year.
    if (!availabilityForAccount(context.parameters, ACCOUNT_TRAITS[account.type])) continue;
    const base = roundMoney(
      baseElectiveDeferrals(account.existingContributions) +
        account.existingContributions.employeeAfterTax +
        account.existingContributions.employerPreTax +
        account.existingContributions.employerRoth,
    );
    const catchUp = ageCatchUpDeferrals(account.existingContributions);
    const basePool = context.section457BasePools.get(account.ownerId);
    const catchUpPool = context.section457CatchUpPools.get(account.ownerId);
    if (basePool) chargePool(basePool, base);
    if (catchUpPool) chargePool(catchUpPool, catchUp);
    const specialPool = context.section457SpecialCatchUpPools.get(account.ownerId);
    if (specialPool) {
      // Both flavours seed the one IRC 457(b)(3) pool: the tax treatment of a
      // catch-up does not change which statutory limitation it was made under.
      chargePool(
        specialPool,
        roundMoney(
          account.existingContributions.special457CatchUp +
            account.existingContributions.special457RothCatchUp,
        ),
      );
    }
  }
}


interface HealthFsaAccountPlan {
  status: CalculationStatus;
  diagnostics: Diagnostic[];
  /** The IRC 125(i) ceiling itself, net of counted flex credits. */
  statutoryMaximum: Money | null;
  /**
   * The same figure after any lower plan-document limit. A plan document binds
   * elections under that plan only; it is not an employer-group ceiling, so it
   * caps this account rather than the IRC 125(g)(4) pool.
   */
  appliedMaximum: Money | null;
  detail: HealthFsaAccountDetail;
  poolKey: string | null;
}

/**
 * IRC 125(i) applies employee-by-employee and employer-by-employer. Notice
 * 2012-40 aggregates employers treated as one under IRC 414(b), (c) or (m)
 * through IRC 125(g)(4), and lets an employee of two unrelated employers elect
 * the full amount under each. `employerId` is what expresses that grouping, so
 * two arrangements sharing one carry one limit and two without an employer
 * carry their own.
 */
function healthFsaPoolKey(account: NormalizedAccount): string {
  return `${account.ownerId}::${account.employerId ?? `account:${account.id}`}`;
}

function initializeHealthFsaPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  const fsaAccounts = accounts.filter(
    (account) => ACCOUNT_TRAITS[account.type].family === "health_fsa",
  );
  if (fsaAccounts.length === 0) return;

  // A year in the available-without-statutory-dollar-limit state supplies no
  // ceiling, which is not the same as supplying a ceiling of nothing. Treating
  // the row as absent keeps the downstream "no statutory figure" handling and
  // lets a caller-supplied plan document still produce a real maximum.
  const healthFsaYear = context.fsaParameters?.healthFsa ?? null;
  const yearParameters =
    healthFsaYear !== null && healthFsaYear.state === "statutory_dollar_limit" ? healthFsaYear : null;
  const priorYearRow = fsaParametersForYear(context.taxYear - 1)?.healthFsa ?? null;
  const priorYearParameters =
    priorYearRow !== null && priorYearRow.state === "statutory_dollar_limit" ? priorYearRow : null;

  for (const account of fsaAccounts) {
    const rules: HealthFsaRulesInput = account.planRules.healthFsa ?? {};
    const path = `accounts.${account.id}`;
    const diagnostics: Diagnostic[] = [];
    let status = CalculationStatus.DETERMINATE;
    let indeterminate = false;

    const purpose = rules.purpose ?? null;
    const elected = account.existingContributions.healthFsaSalaryReduction;
    const priorYearUnused = money(
      rules.priorYearUnusedAmount,
      `${path}.planRules.healthFsa.priorYearUnusedAmount`,
    );
    const flexCredit = money(
      rules.employerFlexCredit,
      `${path}.planRules.healthFsa.employerFlexCredit`,
    );

    // Notice 2012-40: flex credits are outside IRC 125(i) because the section
    // reaches salary reduction contributions alone, unless the employee could
    // have taken them as cash or another taxable benefit, in which case they are
    // treated as salary reduction contributions.
    let flexCreditCounted = 0;
    if (flexCredit > 0) {
      if (rules.flexCreditElectableAsCash === true) {
        flexCreditCounted = flexCredit;
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_FLEX_CREDIT_COUNTS_AGAINST_LIMIT",
            DiagnosticSeverity.INFO,
            `Employer flex credits of $${flexCredit.toLocaleString()} could be elected as cash or another taxable benefit, so Notice 2012-40 treats them as salary reduction contributions for IRC 125(i) and they consume the limit.`,
            `${path}.planRules.healthFsa.employerFlexCredit`,
            "IRC 125(i); Notice 2012-40",
          ),
        );
      } else if (rules.flexCreditElectableAsCash === false) {
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_FLEX_CREDIT_OUTSIDE_LIMIT",
            DiagnosticSeverity.INFO,
            `IRC 125(i) limits salary reduction contributions alone, so the $${flexCredit.toLocaleString()} of non-elective employer flex credits does not consume the limit (Notice 2012-40; Prop. Treas. Reg. 1.125-5(b)).`,
            `${path}.planRules.healthFsa.employerFlexCredit`,
            "IRC 125(i); Notice 2012-40",
          ),
        );
      } else {
        status = CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_FLEX_CREDIT_CASH_ELECTION_FACT_REQUIRED",
            DiagnosticSeverity.WARNING,
            `Employer flex credits of $${flexCredit.toLocaleString()} were supplied without stating whether the employee could elect them as cash or another taxable benefit. Notice 2012-40 keeps non-elective flex credits outside IRC 125(i) and treats electable ones as salary reduction contributions, so they are assumed non-elective here. Supply planRules.healthFsa.flexCreditElectableAsCash to settle it.`,
            `${path}.planRules.healthFsa.flexCreditElectableAsCash`,
            "IRC 125(i); Notice 2012-40",
          ),
        );
      }
    }

    // Notice 2012-40 reads "taxable year" in IRC 125(i) as the plan year of the
    // cafeteria plan, while every annual revenue procedure publishes the figure
    // for taxable years beginning in a calendar year. The two agree exactly for
    // a calendar-year plan; for any other plan year the governing figure depends
    // on the plan year start date, which is not an input here.
    if (rules.planYearIsCalendarYear === false) {
      indeterminate = true;
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_NON_CALENDAR_PLAN_YEAR_INDETERMINATE",
          DiagnosticSeverity.ERROR,
          "Notice 2012-40 section III holds that \"taxable year\" in IRC 125(i) means the plan year of the cafeteria plan, so a non-calendar plan year is governed by the figure for the calendar year in which that plan year begins, and a short plan year is prorated by its months. This package is keyed by tax year and does not hold the plan year start date, so the applicable limit cannot be determined. Key the scenario to the tax year in which the plan year begins, or supply the arrangement as a calendar-year plan.",
          `${path}.planRules.healthFsa.planYearIsCalendarYear`,
          "IRC 125(i); Notice 2012-40",
        ),
      );
    }

    const salaryReductionLimit = yearParameters?.salaryReductionLimit ?? null;
    const carryoverLimitForThisYear = yearParameters?.carryoverLimit ?? null;
    const planDocumentLimitEarly =
      rules.planDocumentLimit === undefined
        ? null
        : money(rules.planDocumentLimit, `${path}.planRules.healthFsa.planDocumentLimit`);
    if (yearParameters === null) {
      // No statutory ceiling is not the same as no answer. The arrangement
      // existed and IRC 125(a) excluded its salary reductions; the ceiling was
      // whatever the plan document imposed. If the caller supplied that, the
      // maximum is knowable and withholding it would discard a fact they gave.
      indeterminate = planDocumentLimitEarly === null;
      diagnostics.push(
        diagnostic(
          indeterminate
            ? "HEALTH_FSA_NO_STATUTORY_LIMIT_BEFORE_2013"
            : "HEALTH_FSA_LIMIT_RESTS_ENTIRELY_ON_PLAN_DOCUMENT",
          indeterminate ? DiagnosticSeverity.ERROR : DiagnosticSeverity.WARNING,
          indeterminate
            ? `IRC 125(i) was added by the Patient Protection and Affordable Care Act, Pub. L. 111-148 section 9005, and Notice 2012-40 reads its effective date as reaching plan years beginning after December 31, 2012, so no statutory salary reduction ceiling existed for tax year ${context.taxYear}. Health flexible spending arrangements did exist; what did not exist is a statutory limit, so the ceiling was whatever the plan document imposed. None was supplied, so none is reported.`
            : `No statutory salary reduction ceiling existed for tax year ${context.taxYear}: IRC 125(i) reaches plan years beginning after December 31, 2012. The arrangement existed and IRC 125(a) excluded its salary reductions, and the plan document supplied here is the only ceiling there was, so the reported maximum rests entirely on that supplied plan term and on nothing statutory.`,
          "taxYear",
          "IRC 125(i); Notice 2012-40",
        ),
      );
    }

    const planDocumentLimit = planDocumentLimitEarly;
    let appliedLimit = salaryReductionLimit ?? planDocumentLimit;
    if (appliedLimit !== null && planDocumentLimit !== null && planDocumentLimit < appliedLimit) {
      appliedLimit = planDocumentLimit;
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_PLAN_DOCUMENT_LIMIT_APPLIED",
          DiagnosticSeverity.INFO,
          `The plan document limits salary reduction contributions to $${planDocumentLimit.toLocaleString()}, below the IRC 125(i) ceiling of $${(salaryReductionLimit ?? 0).toLocaleString()}. Notice 2013-71 confirms a plan may specify a lower amount.`,
          `${path}.planRules.healthFsa.planDocumentLimit`,
          "IRC 125(i)",
        ),
      );
    }

    // Notice 2013-71: a plan may offer a carryover or a Prop. Treas. Reg.
    // 1.125-1(e) grace period for the same health FSA, or neither, but never
    // both. Asserting both describes a plan that cannot exist, so the result is
    // refused rather than computed from one of the two facts.
    let carryoverFromPriorYear = 0;
    let carryoverLimitForPriorYear: Money | null = priorYearParameters?.carryoverLimit ?? null;
    let forfeitedAmount: Money | null = null;
    if (rules.offersCarryover === true && rules.offersGracePeriod === true) {
      indeterminate = true;
      carryoverLimitForPriorYear = null;
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_CARRYOVER_AND_GRACE_PERIOD_ARE_MUTUALLY_EXCLUSIVE",
          DiagnosticSeverity.ERROR,
          "Notice 2013-71 section IV holds that a section 125 cafeteria plan incorporating a carryover may not also provide a grace period in the plan year to which unused amounts are carried. Both were asserted, which describes a plan that cannot exist, so no carryover figure is produced.",
          `${path}.planRules.healthFsa`,
          "Notice 2013-71",
        ),
      );
    } else if (rules.offersCarryover === true) {
      if (carryoverLimitForPriorYear === null) {
        indeterminate = true;
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_PRIOR_YEAR_CARRYOVER_LIMIT_NOT_ESTABLISHED",
            DiagnosticSeverity.ERROR,
            `The carryover cap belongs to the plan year the unused amount is carried FROM, and no cap is encoded for ${context.taxYear - 1}. Notice 2013-71 created the carryover for plan years beginning in 2013, so nothing could be carried into ${context.taxYear}.`,
            `${path}.planRules.healthFsa.offersCarryover`,
            "Notice 2013-71",
          ),
        );
      } else {
        carryoverFromPriorYear = minMoney(priorYearUnused, carryoverLimitForPriorYear);
        forfeitedAmount = nonnegative(priorYearUnused - carryoverFromPriorYear);
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_CARRYOVER_DOES_NOT_REDUCE_THE_LIMIT",
            DiagnosticSeverity.INFO,
            `Of $${priorYearUnused.toLocaleString()} unused at the end of the ${context.taxYear - 1} plan year, $${carryoverFromPriorYear.toLocaleString()} carries over, being the lesser of that amount and the $${carryoverLimitForPriorYear.toLocaleString()} cap for that year; $${(forfeitedAmount ?? 0).toLocaleString()} is forfeited. Notice 2013-71 holds that the carryover "does not count against or otherwise affect" the IRC 125(i) salary reduction limit, so it sits on top of this year's ceiling rather than reducing it.`,
            `${path}.planRules.healthFsa.priorYearUnusedAmount`,
            "Notice 2013-71; Notice 2020-33",
          ),
        );
        if (context.taxYear - 1 === 2020 || context.taxYear - 1 === 2021) {
          diagnostics.push(
            diagnostic(
              "HEALTH_FSA_SECTION_214_RELIEF_NOT_MODELLED",
              DiagnosticSeverity.WARNING,
              `Section 214 of the Consolidated Appropriations Act, 2021, Pub. L. 116-260, implemented by Notice 2021-15, permitted a plan to carry over ALL unused amounts from a plan year ending in ${context.taxYear - 1}, without the ordinary cap. Adopting it was entirely a plan option that this engine cannot read, so the ordinary $${carryoverLimitForPriorYear.toLocaleString()} cap has been applied. If the plan adopted section 214 relief, the carried amount is the full unused amount and this figure is too low.`,
              `${path}.planRules.healthFsa.priorYearUnusedAmount`,
              "Pub. L. 116-260 s.214; Notice 2021-15",
            ),
          );
        }
      }
    } else if (rules.offersGracePeriod === true) {
      carryoverLimitForPriorYear = null;
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_GRACE_PERIOD_PRECLUDES_CARRYOVER",
          DiagnosticSeverity.INFO,
          "The plan offers a Prop. Treas. Reg. 1.125-1(e) grace period of up to two months and 15 days, so under Notice 2013-71 it may not also carry unused amounts over and nothing is carried in. How much of the prior year's unused amount survives depends on expenses incurred during the grace period, which is not a tax parameter, so no forfeiture figure is produced.",
          `${path}.planRules.healthFsa.offersGracePeriod`,
          "Notice 2005-42; Notice 2013-71",
        ),
      );
    } else if (rules.offersCarryover === false) {
      carryoverLimitForPriorYear = null;
      forfeitedAmount = priorYearUnused;
      if (priorYearUnused > 0) {
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_UNUSED_AMOUNTS_FORFEITED",
            DiagnosticSeverity.INFO,
            `The plan offers neither a carryover nor a grace period, so the use-or-lose rule forfeits the whole $${priorYearUnused.toLocaleString()} unused at the end of the ${context.taxYear - 1} plan year.`,
            `${path}.planRules.healthFsa.priorYearUnusedAmount`,
            "Prop. Treas. Reg. 1.125-5(c); Notice 2013-71",
          ),
        );
      }
    } else if (priorYearUnused > 0) {
      carryoverLimitForPriorYear = null;
      status = CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_CARRYOVER_FACT_REQUIRED",
          DiagnosticSeverity.WARNING,
          `A prior-year unused amount of $${priorYearUnused.toLocaleString()} was supplied without stating whether the plan offers the Notice 2013-71 carryover or a grace period. Both are plan options this engine cannot read and they are mutually exclusive, so nothing is carried in and no forfeiture figure is produced. Supply planRules.healthFsa.offersCarryover or offersGracePeriod.`,
          `${path}.planRules.healthFsa.offersCarryover`,
          "Notice 2013-71",
        ),
      );
    }

    const statutoryMaximum =
      indeterminate || salaryReductionLimit === null
        ? null
        : nonnegative(roundMoney(salaryReductionLimit - flexCreditCounted));
    const appliedMaximum =
      indeterminate || appliedLimit === null ? null : nonnegative(roundMoney(appliedLimit - flexCreditCounted));

    // IRC 125(i) is a plan-qualification condition rather than a cap the plan
    // may exceed and then correct: Notice 2012-40 holds that a cafeteria plan
    // failing to comply is not a section 125 cafeteria plan at all, and the
    // value of the taxable benefits the employee could have elected is
    // includible regardless of what was elected. Truncating the election to the
    // limit would report the wrong consequence.
    const electedWithCredits = roundMoney(elected + flexCreditCounted);
    // Exceeding the statutory ceiling and exceeding a lower plan-document
    // ceiling are different failures. Notice 2012-40 section III attaches its
    // loss-of-IRC-125-status consequence to the IRC 125(i) limit, so only the
    // statutory breach carries it; a plan-document breach is reported without
    // asserting that the whole exclusion fails.
    if (
      appliedMaximum !== null &&
      salaryReductionLimit !== null &&
      electedWithCredits > salaryReductionLimit + 0.009
    ) {
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_ELECTION_EXCEEDS_SECTION_125I_LIMIT",
          DiagnosticSeverity.ERROR,
          `Salary reduction contributions of $${roundMoney(elected + flexCreditCounted).toLocaleString()} exceed the $${appliedLimit!.toLocaleString()} limit that applies. Notice 2012-40 holds that a cafeteria plan permitting an election above IRC 125(i) is not a section 125 cafeteria plan, so the value of the taxable benefits the employee could have elected becomes includible in gross income regardless of the benefit elected. The excess is not truncated here because truncation would report a smaller consequence than the statute produces.`,
          `${path}.existingContributions.healthFsaSalaryReduction`,
          "IRC 125(i); IRC 125(d)(1)(B); Notice 2012-40",
        ),
      );
    } else if (appliedMaximum !== null && appliedLimit !== null && electedWithCredits > appliedLimit + 0.009) {
      diagnostics.push(
        diagnostic(
          "HEALTH_FSA_ELECTION_EXCEEDS_PLAN_DOCUMENT_LIMIT",
          DiagnosticSeverity.ERROR,
          `Salary reduction contributions of $${electedWithCredits.toLocaleString()} exceed the $${appliedLimit.toLocaleString()} the plan document allows, ${salaryReductionLimit === null ? `and no IRC 125(i) ceiling existed for ${context.taxYear} to exceed` : `though they remain within the $${salaryReductionLimit.toLocaleString()} IRC 125(i) ceiling`}. Notice 2013-71 confirms a plan may specify a lower amount, and an election above the plan's own term is a plan-operation question this engine does not resolve. The Notice 2012-40 section III loss of IRC 125 status is not asserted here, because that holding addresses the IRC 125(i) limit rather than a lower plan term.`,
          `${path}.existingContributions.healthFsaSalaryReduction`,
          "IRC 125(d)(1)(B); Notice 2013-71",
        ),
      );
    }

    diagnostics.push(
      diagnostic(
        "HEALTH_FSA_FACTS_SUPPLIED_BY_CALLER",
        DiagnosticSeverity.INFO,
        "This calculation applies IRC 125(i) to the plan facts supplied. Plan design is not inferred: whether the plan offers a carryover or a grace period, whether flex credits could be elected as cash, the arrangement's Rev. Rul. 2004-45 purpose, and any lower plan-document limit are all caller-supplied. It does not test cafeteria plan qualification under IRC 125(b) through (d), nondiscrimination, the IRC 414(b), (c) and (m) controlled-group aggregation that IRC 125(g)(4) applies to the limit, the Notice 2012-40 proration of a short plan year, or the uniform-coverage and run-out-period mechanics.",
        path,
        "IRC 125(i)",
      ),
    );

    const detail: HealthFsaAccountDetail = {
      purpose,
      salaryReductionLimit,
      appliedSalaryReductionLimit: indeterminate ? null : appliedLimit,
      electedSalaryReduction: elected,
      employerFlexCreditCountedAgainstLimit: flexCreditCounted,
      carryoverFromPriorYear,
      carryoverLimitForPriorYear,
      carryoverLimitForThisYear,
      forfeitedAmount,
      disqualifiesHsaEligibility: purpose === null ? null : purpose === "general_purpose",
    };

    if (indeterminate) {
      context.healthFsaPlans.set(account.id, {
        status: CalculationStatus.INDETERMINATE,
        diagnostics,
        statutoryMaximum: null,
        appliedMaximum: null,
        detail,
        poolKey: null,
      });
      continue;
    }

    const poolKey = healthFsaPoolKey(account);
    let pool = context.healthFsaPools.get(poolKey);
    if (!pool) {
      pool = {
        id: `irc-125i:${poolKey}`,
        legalLimit: "IRC 125(i) health FSA salary reduction limit, per employee per employer",
        // The pool is the statutory ceiling the employers treated as one under
        // IRC 125(g)(4) share. A lower limit in one plan document is a term of
        // that plan and binds elections under it; it gives that plan no power
        // over elections under a different plan of the same group, so it caps
        // the account rather than the pool.
        limit: statutoryMaximum === null ? null : salaryReductionLimit,
        usage: settled(0),
      };
      context.healthFsaPools.set(poolKey, pool);
    }
    chargePool(pool, flexCreditCounted + elected);

    context.healthFsaPlans.set(account.id, {
      status: accountStatusFromDiagnostics(status, diagnostics),
      diagnostics,
      statutoryMaximum,
      appliedMaximum,
      detail,
      poolKey,
    });
  }
}

function allocateHealthFsa(context: CalculationContext, account: NormalizedAccount): AllocationOutcome {
  const plan = context.healthFsaPlans.get(account.id)!;
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const sharedLimits: SharedLimitUse[] = [];
  const diagnostics = [...plan.diagnostics];
  const pool = plan.poolKey === null ? undefined : context.healthFsaPools.get(plan.poolKey);

  if (plan.status === CalculationStatus.INDETERMINATE || !pool) {
    if (pool) reportPoolWithoutConsuming(pool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: plan.statutoryMaximum,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
      healthFsaDetail: plan.detail,
    };
  }

  // The pool offers the employer group's statutory room; this account may only
  // reach its own plan document's ceiling within it.
  const localHeadroom =
    plan.appliedMaximum === null
      ? (poolRemaining(pool) ?? 0)
      : nonnegative(roundMoney(plan.appliedMaximum - account.existingContributions.healthFsaSalaryReduction));
  let taken: Money;
  if (pool.limit === null && plan.appliedMaximum !== null) {
    // A year with no IRC 125(i) ceiling has no employer-group figure to share,
    // so there is nothing to draw down: the account is bounded by its own plan
    // document alone. Putting that document into the shared pool instead would
    // let one plan's term bind another plan of the same group, which is the
    // thing IRC 125(g)(4) does not do, and would make the result depend on
    // which account reached the pool first.
    reportPoolWithoutConsuming(pool, sharedLimits);
    taken = localHeadroom;
  } else {
    taken = takeFromPool(pool, localHeadroom, sharedLimits);
  }
  additional.healthFsaSalaryReduction = taken;
  annual.healthFsaSalaryReduction = roundMoney(annual.healthFsaSalaryReduction + taken);

  return {
    status: accountStatusFromDiagnostics(plan.status, diagnostics),
    statutoryMaximum: plan.statutoryMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
    healthFsaDetail: plan.detail,
  };
}


interface DependentCareAccountPlan {
  status: CalculationStatus;
  diagnostics: Diagnostic[];
  statutoryMaximum: Money | null;
  detail: DependentCareFsaAccountDetail;
  poolKey: string | null;
  /** IRC 129(b)(1) ceiling on this employee, or null when the earned income facts were not supplied. */
  earnedIncomeLimitation: Money | null;
  /** A lower maximum this plan allows, which caps this account alone. */
  planDocumentLimit: Money | null;
}

/**
 * IRC 129 was added by the Economic Recovery Tax Act of 1981, Pub. L. 97-34,
 * and the effective-date note to the section makes it applicable to taxable
 * years beginning after December 31, 1981. Before that the section did not
 * exist; from 1982 through 1986 it existed with no dollar limitation, which the
 * Tax Reform Act of 1986 Pub. L. 99-514 s.1163 added for taxable years
 * beginning after December 31, 1986. The three states report differently.
 */
/**
 * Derived from the table rather than restated: a year below the supported
 * minimum has no row because the program did not exist for it. Pub. L. 97-34
 * section 124 added IRC 129 for taxable years beginning after December 31,
 * 1981, which is what sets the minimum.
 */
const DEPENDENT_CARE_FIRST_TAX_YEAR = RAW_FSA_PARAMETERS.supportedTaxYears.minimum;

/**
 * IRC 129(a)(2)(A) is a per-return amount, not a per-person one, and only a
 * joint return puts two people on one return. Spouses filing jointly therefore
 * share one pool; everybody else, including each spouse of a married-separate
 * pair filing their own return at the halved amount, carries their own.
 */
function dependentCarePoolKey(context: CalculationContext, ownerId: string): string {
  if (context.filingStatus === FilingStatus.MARRIED_FILING_JOINTLY) {
    const role = context.persons.get(ownerId)?.role;
    if (role === "taxpayer" || role === "spouse") return "return";
  }
  return `return:${ownerId}`;
}

function initializeDependentCarePools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  // The IRC 129(a)(2)(A) amount is one figure for the return, so which account
  // draws on it first decides which employee's assistance is includible. That
  // must follow the same deterministic order the allocation uses.
  const dcAccounts = accounts
    .filter((account) => ACCOUNT_TRAITS[account.type].family === "dependent_care_fsa")
    .sort((left, right) => (left.priority! - right.priority!) || (left.inputIndex - right.inputIndex));
  if (dcAccounts.length === 0) return;

  const dependentCareYear = context.fsaParameters?.dependentCare ?? null;
  const yearParameters =
    dependentCareYear !== null && dependentCareYear.state === "statutory_dollar_limit" ? dependentCareYear : null;
  // IRC 129(a)(2)(C) determines marital status under IRC 21(e)(3) and (4), so
  // the halved amount and the lesser-of earned income rule do not follow from
  // the filing status alone. IRC 21(e)(4) treats a married-separate taxpayer as
  // not married when they maintained a qualifying individual's principal place
  // of abode for more than half the year, furnished over half its cost, and
  // their spouse was not a member of the household for the last six months.
  const separateReturn = context.filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY;
  const treatedAsUnmarried = separateReturn && context.treatedAsUnmarriedUnderSection21e4 === true;
  const married =
    context.filingStatus === FilingStatus.MARRIED_FILING_JOINTLY || (separateReturn && !treatedAsUnmarried);
  const statutoryExclusion =
    yearParameters === null
      ? null
      : separateReturn && !treatedAsUnmarried
        ? yearParameters.marriedFilingSeparatelyExclusionLimit
        : yearParameters.exclusionLimit;
  const section21e4Undetermined = separateReturn && context.treatedAsUnmarriedUnderSection21e4 === null;

  for (const account of dcAccounts) {
    const rules: DependentCareFsaRulesInput = account.planRules.dependentCareFsa ?? {};
    const path = `accounts.${account.id}`;
    const diagnostics: Diagnostic[] = [];
    let status = CalculationStatus.DETERMINATE;
    let indeterminate = false;
    let unavailable = false;
    let earnedIncomeFactsMissing = false;

    const elected = account.existingContributions.dependentCareAssistanceProvided;

    let noStatutoryCeiling = false;
    if (yearParameters === null) {
      // A year present in the table but carrying no statutory ceiling is not an
      // unavailable year: IRC 129 existed and excluded the assistance, there was
      // simply no dollar cap. Whether an answer is possible then depends on
      // whether the caller supplied a ceiling of their own, which is not known
      // until the plan and earned income facts below have been read.
      unavailable = dependentCareYear === null;
      noStatutoryCeiling = !unavailable;
      indeterminate = unavailable;
      if (unavailable) {
        diagnostics.push(
          diagnostic(
            "DEPENDENT_CARE_NOT_AVAILABLE_FOR_TAX_YEAR",
            DiagnosticSeverity.ERROR,
            `IRC 129 was added by the Economic Recovery Tax Act of 1981, Pub. L. 97-34, applicable to taxable years beginning after December 31, 1981, so no dependent care assistance exclusion existed for tax year ${context.taxYear}.`,
            "taxYear",
            "IRC 129; Pub. L. 97-34 s.124(f)",
          ),
        );
      }
    }

    // IRC 129(b)(1): the exclusion cannot exceed the employee's earned income,
    // or, for a married employee, the lesser of the employee's and the spouse's.
    // Both figures are caller-supplied; this package does not derive income.
    // They are facts about the people on the return, so two dependent care
    // programs cannot state them differently.
    const owner = context.persons.get(account.ownerId);
    const ownerSpouse = owner === undefined ? undefined : spouseForPerson(context.persons, owner);
    const employeeEarnedIncome = owner?.dependentCareEarnedIncome ?? null;
    const spouseEarnedIncome = ownerSpouse?.dependentCareEarnedIncome ?? null;
    let earnedIncomeLimitation: Money | null = null;
    if (employeeEarnedIncome !== null && (!married || spouseEarnedIncome !== null)) {
      earnedIncomeLimitation = married
        ? minMoney(employeeEarnedIncome, spouseEarnedIncome)
        : employeeEarnedIncome;
    } else if (!indeterminate) {
      // IRC 129(b)(1) is a mandatory ceiling, not an optional refinement.
      // Reporting the IRC 129(a)(2)(A) amount as the maximum the inputs support
      // would assume earned income of at least that amount, which the statute
      // never permits. The statutory figure is still reported separately, so
      // failing closed here withholds an assumption rather than information.
      earnedIncomeFactsMissing = true;
      diagnostics.push(
        diagnostic(
          "DEPENDENT_CARE_EARNED_INCOME_FACTS_REQUIRED",
          DiagnosticSeverity.ERROR,
          married
            ? "IRC 129(b)(1)(B) caps the exclusion at the lesser of the employee's and the spouse's earned income for the taxable year. Both are caller-supplied facts and at least one was not supplied, so the limitation has not been applied and the reported ceiling is the IRC 129(a)(2)(A) amount alone, which may overstate it."
            : "IRC 129(b)(1)(A) caps the exclusion at the employee's earned income for the taxable year. That is a caller-supplied fact and was not supplied, so the limitation has not been applied and the reported ceiling is the IRC 129(a)(2)(A) amount alone, which may overstate it.",
          `persons.${account.ownerId}.dependentCareEarnedIncome`,
          "IRC 129(b)(1)",
        ),
      );
    }
    if (section21e4Undetermined && !indeterminate) {
      status = CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
      diagnostics.push(
        diagnostic(
          "DEPENDENT_CARE_SECTION_21E4_DETERMINATION_NOT_MADE",
          DiagnosticSeverity.WARNING,
          "IRC 129(a)(2)(C) determines marital status under IRC 21(e)(3) and (4), and IRC 21(e)(4) treats a married individual filing separately as not married when they maintained a household that was a qualifying individual's principal place of abode for more than half the taxable year, furnished over half the cost of maintaining it, and their spouse was not a member of it during the last six months of the year. Those facts are not derivable from anything supplied here and treatedAsUnmarriedUnderSection21e4 was not stated, so the return has been treated as married: the halved IRC 129(a)(2)(A) amount and the IRC 129(b)(1)(B) lesser-of-earned-income rule are applied. A taxpayer who meets IRC 21(e)(4) takes the undivided amount and their own earned income instead.",
          "treatedAsUnmarriedUnderSection21e4",
          "IRC 129(a)(2)(C); IRC 21(e)(4)",
        ),
      );
    }
    if ((owner?.isStudentOrIncapableOfSelfCare === true || ownerSpouse?.isStudentOrIncapableOfSelfCare === true) && !indeterminate) {
      status = CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
      diagnostics.push(
        diagnostic(
          "DEPENDENT_CARE_DEEMED_SPOUSE_EARNED_INCOME_NOT_MODELLED",
          DiagnosticSeverity.WARNING,
          "IRC 129(b)(2) applies IRC 21(d)(2) to deem earned income for a spouse who is a student or incapable of caring for himself. The IRC 21(d)(2) monthly schedule is not encoded here, because no primary source for it is committed to this package's evidence corpus and an unattested figure is never encoded. Any dependentCareEarnedIncome supplied for the person is used exactly as stated, so supply the deemed amount if the deeming applies.",
          `persons.${account.ownerId}.isStudentOrIncapableOfSelfCare`,
          "IRC 129(b)(2); IRC 21(d)(2)",
        ),
      );
    }

    const planDocumentLimit =
      rules.planDocumentLimit === undefined
        ? null
        : money(rules.planDocumentLimit, `${path}.planRules.dependentCareFsa.planDocumentLimit`);
    const suppliedCeilings = [
      ...(earnedIncomeLimitation === null ? [] : [earnedIncomeLimitation]),
      ...(planDocumentLimit === null ? [] : [planDocumentLimit]),
    ];
    if (noStatutoryCeiling && suppliedCeilings.length === 0) {
      // Nothing statutory and nothing supplied leaves no ceiling to report.
      indeterminate = true;
    }
    if (noStatutoryCeiling) {
      diagnostics.push(
        diagnostic(
          indeterminate
            ? "DEPENDENT_CARE_NO_EXCLUSION_LIMIT_BEFORE_1987"
            : "DEPENDENT_CARE_LIMIT_RESTS_ENTIRELY_ON_SUPPLIED_FACTS",
          indeterminate ? DiagnosticSeverity.ERROR : DiagnosticSeverity.WARNING,
          indeterminate
            ? `The IRC 129(a)(2)(A) limitation of exclusion was added by the Tax Reform Act of 1986, Pub. L. 99-514 section 1163(a), applicable to taxable years beginning after December 31, 1986. For tax year ${context.taxYear} IRC 129 existed and excluded employer-provided dependent care assistance, but carried no dollar ceiling on the exclusion. None was supplied either, so none is reported.`
            : `No IRC 129(a)(2)(A) dollar ceiling existed for tax year ${context.taxYear}: Pub. L. 99-514 section 1163(a) added it for taxable years beginning after December 31, 1986. IRC 129 did exist and excluded the assistance, and the IRC 129(b)(1) earned income limitation and any plan maximum supplied here are the only ceilings there were, so the reported maximum rests entirely on those supplied facts and on nothing statutory.`,
          "taxYear",
          "IRC 129(a)(2)(A); Pub. L. 99-514 s.1163",
        ),
      );
    }
    const applicableLimit =
      indeterminate || earnedIncomeFactsMissing
        ? null
        : statutoryExclusion === null
          ? minMoney(...suppliedCeilings)
          : minMoney(
            statutoryExclusion,
            ...(earnedIncomeLimitation === null ? [] : [earnedIncomeLimitation]),
            ...(planDocumentLimit === null ? [] : [planDocumentLimit]),
          );

    diagnostics.push(
      diagnostic(
        "DEPENDENT_CARE_FACTS_SUPPLIED_BY_CALLER",
        DiagnosticSeverity.INFO,
        "This calculation applies IRC 129(a)(2) and, where the earned income facts are supplied, IRC 129(b)(1). It does not test whether the program meets the IRC 129(d) written-plan requirements, the IRC 129(d)(2) through (8) nondiscrimination rules, the IRC 129(c) denial for amounts paid to a related individual, or whether the individuals cared for qualify. It does not model the IRC 21 dependent care credit or the IRC 21(c) reduction of that credit's expense base. A dependent care program may not offer a carryover at all except under section 214 of the Consolidated Appropriations Act, 2021, which is a plan option this engine cannot read, so no dependent care carryover is modelled.",
        path,
        "IRC 129",
      ),
    );

    const detail: DependentCareFsaAccountDetail = {
      statutoryExclusion: indeterminate ? null : statutoryExclusion,
      earnedIncomeLimitation,
      planDocumentLimit,
      applicableExclusionLimit: applicableLimit,
      electedSalaryReduction: elected,
      excludableAmount: 0,
      includibleInIncome: 0,
      householdExclusionShared: false,
    };

    if (indeterminate) {
      context.dependentCarePlans.set(account.id, {
        status: unavailable ? CalculationStatus.UNAVAILABLE : CalculationStatus.INDETERMINATE,
        diagnostics,
        statutoryMaximum: unavailable ? 0 : null,
        detail,
        poolKey: null,
        earnedIncomeLimitation,
        planDocumentLimit,
      });
      continue;
    }

    const poolKey = dependentCarePoolKey(context, account.ownerId);
    if (!context.dependentCarePools.has(poolKey)) {
      context.dependentCarePools.set(poolKey, {
        id: `irc-129:${poolKey}`,
        legalLimit: "IRC 129(a)(2)(A) dependent care assistance exclusion, per return",
        limit: statutoryExclusion,
        usage: settled(0),
      });
    }

    context.dependentCarePlans.set(account.id, {
      status: accountStatusFromDiagnostics(status, diagnostics),
      diagnostics,
      // The IRC 129(a)(2)(A) figure itself. What the supplied facts allow
      // within it is the applicable limit, reported separately, exactly as the
      // health FSA path separates the IRC 125(i) ceiling from a plan document.
      statutoryMaximum: indeterminate ? null : statutoryExclusion,
      detail,
      poolKey,
      earnedIncomeLimitation,
      planDocumentLimit,
    });
  }

  // A pool serving more than one account is a household figure two employees
  // draw on, which IRC 129(a)(2)(A) makes visible rather than doubling.
  const accountsByPool = new Map<string, number>();
  for (const plan of context.dependentCarePlans.values()) {
    if (plan.poolKey === null) continue;
    accountsByPool.set(plan.poolKey, (accountsByPool.get(plan.poolKey) ?? 0) + 1);
  }
  for (const plan of context.dependentCarePlans.values()) {
    if (plan.poolKey !== null && (accountsByPool.get(plan.poolKey) ?? 0) > 1) {
      plan.detail.householdExclusionShared = true;
    }
  }

  // IRC 129(b)(1) caps "the amount excluded from the income of an employee
  // under subsection (a) for any taxable year", which is that year's aggregate
  // rather than a per-plan figure, and Form 2441 Part III computes a single
  // excluded-benefits amount for the return. The ceiling therefore belongs to
  // the pool the accounts share. Applied per account it would let a return
  // exclude the limitation once for every dependent care FSA it holds.
  //
  // Every plan in a pool derives the ceiling from the same two people, so they
  // cannot disagree about it. That was not true while the figures lived on each
  // account's plan rules, and the contradiction then had to be reported as an
  // error; moving them onto the person removed the possibility instead.
  for (const plan of context.dependentCarePlans.values()) {
    if (plan.poolKey === null || plan.earnedIncomeLimitation === null) continue;
    context.dependentCareEarnedIncomeCeilings.set(plan.poolKey, plan.earnedIncomeLimitation);
  }

  // Assistance actually supplied draws on the household amount before any
  // remaining capacity is offered, so what IRC 129(a)(2)(B) includes in income
  // is measured against the amounts supplied rather than against capacity the
  // scenario merely reports as available.
  for (const account of dcAccounts) {
    const plan = context.dependentCarePlans.get(account.id);
    if (!plan || plan.poolKey === null) continue;
    const pool = context.dependentCarePools.get(plan.poolKey);
    if (!pool) continue;
    const elected = account.existingContributions.dependentCareAssistanceProvided;
    if (elected <= 0) continue;
    const householdRemaining = poolRemaining(pool) ?? 0;
    const earnedIncomeCeiling = context.dependentCareEarnedIncomeCeilings.get(plan.poolKey) ?? null;
    // Measured against what the pool has already excluded, not against this
    // account alone: the IRC 129(b)(1) ceiling is the return's for the year.
    const ceiling = minMoney(
      householdRemaining,
      ...(earnedIncomeCeiling === null ? [] : [nonnegative(roundMoney(earnedIncomeCeiling - pool.usage.maximum))]),
      ...(plan.planDocumentLimit === null ? [] : [plan.planDocumentLimit]),
    );
    const excludable = minMoney(elected, ceiling);
    const includible = roundMoney(elected - excludable);
    chargePool(pool, excludable);
    plan.detail.excludableAmount = excludable;
    plan.detail.includibleInIncome = includible;
    if (includible > 0) {
      plan.diagnostics.unshift(
        diagnostic(
          "DEPENDENT_CARE_AMOUNT_INCLUDIBLE_IN_INCOME",
          DiagnosticSeverity.WARNING,
          `$${includible.toLocaleString()} of the $${elected.toLocaleString()} of dependent care assistance supplied exceeds the limitation that applies to this employee, so IRC 129(a)(2)(B) includes it in gross income for the taxable year in which the dependent care services were provided. The IRC 129(a)(2)(A) amount is a per-return figure rather than a per-person one, so two employees on one return draw on a single amount rather than one each.`,
          `accounts.${account.id}.existingContributions.dependentCareAssistanceProvided`,
          "IRC 129(a)(2)(B)",
        ),
      );
      plan.status = accountStatusFromDiagnostics(plan.status, plan.diagnostics);
    }
  }
}

function allocateDependentCareFsa(
  context: CalculationContext,
  account: NormalizedAccount,
): AllocationOutcome {
  const plan = context.dependentCarePlans.get(account.id)!;
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const sharedLimits: SharedLimitUse[] = [];
  const diagnostics = [...plan.diagnostics];
  const pool = plan.poolKey === null ? undefined : context.dependentCarePools.get(plan.poolKey);
  const detail: DependentCareFsaAccountDetail = { ...plan.detail };

  if (plan.status === CalculationStatus.UNAVAILABLE || plan.status === CalculationStatus.INDETERMINATE || !pool) {
    if (pool) reportPoolWithoutConsuming(pool, sharedLimits);
    // The components clone what the scenario supplied, so an elected salary
    // reduction would otherwise be reported as excluded by a plan that has
    // just said it cannot determine the exclusion. No amount is substantiated
    // here, and the detail already carries zero for both halves.
    annual.dependentCareAssistanceProvided = 0;
    annual.dependentCareIncludibleInIncome = detail.includibleInIncome;
    return {
      status: plan.status === CalculationStatus.UNAVAILABLE
        ? CalculationStatus.UNAVAILABLE
        : CalculationStatus.INDETERMINATE,
      statutoryMaximum: plan.statutoryMaximum,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
      dependentCareDetail: detail,
    };
  }

  // The supplied assistance already drew on the household IRC 129(a)(2)(A)
  // amount, so what is left is the further exclusion this employee could
  // reach. The IRC 129(b)(1) ceiling is measured against everything the pool
  // has excluded rather than against this account alone, because it caps the
  // return's exclusion for the taxable year.
  const alreadyExcluded = detail.excludableAmount;
  const earnedIncomeCeiling =
    plan.poolKey === null ? null : (context.dependentCareEarnedIncomeCeilings.get(plan.poolKey) ?? null);
  const ownCeilings = [
    ...(earnedIncomeCeiling === null ? [] : [nonnegative(roundMoney(earnedIncomeCeiling - pool.usage.maximum))]),
    ...(plan.planDocumentLimit === null ? [] : [nonnegative(roundMoney(plan.planDocumentLimit - alreadyExcluded))]),
  ];
  let additionalExcludable: Money;
  if (pool.limit === null && ownCeilings.length > 0) {
    // A year with no IRC 129(a)(2)(A) ceiling has no household figure to draw
    // down. The supplied earned income and plan maximum are the only ceilings
    // there were, and they bound this account directly.
    reportPoolWithoutConsuming(pool, sharedLimits);
    additionalExcludable = minMoney(...ownCeilings);
  } else {
    additionalExcludable = takeFromPool(pool, minMoney(poolRemaining(pool) ?? 0, ...ownCeilings), sharedLimits);
  }

  annual.dependentCareAssistanceProvided = roundMoney(alreadyExcluded + additionalExcludable);
  annual.dependentCareIncludibleInIncome = detail.includibleInIncome;
  additional.dependentCareAssistanceProvided = additionalExcludable;
  detail.excludableAmount = annual.dependentCareAssistanceProvided;

  return {
    status: accountStatusFromDiagnostics(plan.status, diagnostics),
    statutoryMaximum: plan.statutoryMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
    dependentCareDetail: detail,
  };
}

/**
 * What the health flexible spending arrangements in a scenario mean for IRC 223
 * eligibility, collected per person.
 *
 * Rev. Rul. 2004-45 turns the answer entirely on what the arrangement may
 * reimburse: a general-purpose health FSA that pays section 213(d) medical
 * expenses before the IRC 223(c)(2)(A)(i) minimum annual deductible is
 * satisfied is coverage that is not a high deductible health plan and that
 * provides a benefit the HDHP covers, so IRC 223(c)(1)(A)(ii) is failed; a
 * limited-purpose arrangement reimbursing only vision, dental and preventive
 * care, or a post-deductible one reimbursing only after the deductible is met,
 * is not.
 */
interface HealthFsaSection223Facts {
  generalPurpose: boolean;
  purposeUnstated: boolean;
  hsaCompatible: boolean;
  generalPurposeCarryover: boolean;
  generalPurposeGracePeriod: boolean;
}

function emptyHealthFsaSection223Facts(): HealthFsaSection223Facts {
  return {
    generalPurpose: false,
    purposeUnstated: false,
    hsaCompatible: false,
    generalPurposeCarryover: false,
    generalPurposeGracePeriod: false,
  };
}

function healthFsaSection223FactsByOwner(
  context: CalculationContext,
  accounts: NormalizedAccount[],
): Map<string, HealthFsaSection223Facts> {
  const byOwner = new Map<string, HealthFsaSection223Facts>();
  for (const account of accounts) {
    if (ACCOUNT_TRAITS[account.type].family !== "health_fsa") continue;
    const detail = context.healthFsaPlans.get(account.id)?.detail;
    if (!detail) continue;
    let facts = byOwner.get(account.ownerId);
    if (!facts) {
      facts = emptyHealthFsaSection223Facts();
      byOwner.set(account.ownerId, facts);
    }
    if (detail.purpose === null) {
      facts.purposeUnstated = true;
    } else if (detail.purpose === "general_purpose") {
      facts.generalPurpose = true;
      if (detail.carryoverFromPriorYear > 0) facts.generalPurposeCarryover = true;
      if (account.planRules.healthFsa?.offersGracePeriod === true) {
        facts.generalPurposeGracePeriod = true;
      }
    } else {
      facts.hsaCompatible = true;
    }
  }
  return byOwner;
}

const HSA_MONTHS_IN_YEAR = 12;
const HSA_ALL_MONTHS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface HsaOwnerPlan {
  status: CalculationStatus;
  diagnostics: Diagnostic[];
  statutoryMaximum: Money | null;
  detail: HsaAccountDetail | null;
  familyPoolKey: string | null;
  /**
   * Whether this owner's draw on the IRC 223(b)(5) pool is exactly computable.
   *
   * Existing contributions consume the paragraph (1) limitation first and reach
   * the paragraph (3) additional amount only once it is exhausted. So where any
   * paragraph (3) amount exists, how much of a contribution lands on the pool
   * depends on the size of this owner's paragraph (1) share -- which is what the
   * unresolved IRC 223(b)(5)(B)(ii) division leaves unknown. Knowing the
   * paragraph (3) amount does not rescue it: 500 paid in against a 1000
   * additional amount draws wholly on the pool under either candidate share,
   * while 9750 draws 8750 or 4375 depending on which share is real.
   *
   * The draw is therefore exact only when there is no paragraph (3) amount to
   * absorb anything -- anyone under 55 -- and no IRC 223(b)(4) reduction, those
   * coming off the paragraph (1) share first and so turning on the same unknown.
   * Then every dollar paid in came out of the couple's limitation whatever the
   * division, and the pool can say so.
   */
  familyPoolUsageDeterminable: boolean;
}

interface HsaOwnerFacts {
  ownerId: string;
  resolvedDeductible: HsaDeductibleResolution;
  hasUnusableAccountStatement: boolean;
  hasUnusablePersonStatement: boolean;
  conflict: boolean;
  /** The owner's own `persons[].hsaCoverage` contradicts their account's `planRules.hsa`. */
  personConflict: boolean;
  /**
   * Every distinct coverage statement supplied for this person — each of their
   * HSAs' `planRules.hsa`, plus `persons[].hsaCoverage` — in input order, each
   * carrying its source. Uncertainty is projected off these onto each input it
   * actually reaches, rather than off the bare fact that they disagree.
   */
  coverageVariants: ReadonlyArray<HsaCoverageVariant>;
  /**
   * This person's *accounts*, without the person-level statement, which cannot
   * carry either field. Letting `persons[].hsaCoverage` vote here would read its
   * structural absence as a disagreement with an account that supplies one.
   */
  /**
   * IRC 223(b)(8)(B) testing-period facts for this person. One testing period
   * per person, so there is nothing here for the person's accounts to disagree
   * about -- which is why the two conflict detectors that used to sit beside
   * this field are gone. Whether the rule applies at all is not here either: it
   * is read off the coverage months rather than stated.
   */
  testingPeriodFacts: HsaLastMonthRuleTestingPeriodInput;
  resolvedMonths: Array<HsaCoverageTier | null> | null;
}

/** IRC 223(c)(2) coverage facts for one person, from whichever input carried them. */
interface HsaPersonCoverage {
  /** False when nothing in the input states this person's coverage either way. */
  supplied: boolean;
  months: Array<HsaCoverageTier | null> | null;
  deductible: HsaDeductibleResolution;
}

/** The tier as it reads in a diagnostic sentence. */
function hsaTierLabel(tier: HsaCoverageTier): string {
  return tier === "family" ? "family" : "self-only";
}

/**
 * One person's stated annual deductible that falls below the IRC
 * 223(c)(2)(A)(i) minimum for a tier that person is stated to hold, with the
 * minimum it failed. The tier is carried because it decides reach: IRC
 * 223(b)(5)(A) draws only a *family* plan into the couple's lowest-deductible
 * comparison, so a subminimum self-only plan is that person's problem alone.
 */
interface HsaSubminimumDeductible {
  stated: Money;
  tier: HsaCoverageTier;
  minimum: Money;
}

function hsaParametersForYear(year: number): HsaYearParameters | null {
  const row = RAW_HSA_PARAMETERS.years[String(year)];
  return row ? deepClone(row) : null;
}

function fsaParametersForYear(year: number): FsaYearParameters | null {
  const row = RAW_FSA_PARAMETERS.years[String(year)];
  return row ? deepClone(row) : null;
}

/** Only the empty person statement affirmatively supplies no coverage. */
function resolvePersonHsaMonths(coverage: HsaCoverageInput): Array<HsaCoverageTier | null> | null {
  const months = resolveHsaMonths(coverage);
  if (months !== null) return months;
  const empty = Object.keys(coverage).length === 0;
  return empty ? HSA_ALL_MONTHS.map(() => null) : null;
}

interface HsaDeductibleResolution {
  value: Money | null;
  missing: boolean;
  conflicting: boolean;
}

function resolveHsaDeductible(variants: ReadonlyArray<HsaCoverageVariant>): HsaDeductibleResolution {
  const relevant = variants.filter((variant) => variant.months?.some((tier) => tier !== null));
  const missing = relevant.some((variant) => variant.coverage.hdhpAnnualDeductible == null);
  const values = new Set(relevant.flatMap((variant) =>
    variant.coverage.hdhpAnnualDeductible == null ? [] : [variant.coverage.hdhpAnnualDeductible]));
  const conflicting = values.size > 1;
  return { value: !missing && !conflicting ? [...values][0] ?? null : null, missing, conflicting };
}

/**
 * Canonical monthly facts, independent of input representation. Only the
 * person route interprets absent coverage fields as an explicit no-coverage fact.
 */
function hsaCoverageSignature(coverage: HsaCoverageInput, source: "account" | "person" = "account"): string {
  return JSON.stringify([
    source === "person" ? resolvePersonHsaMonths(coverage) : resolveHsaMonths(coverage),
    coverage.hdhpAnnualDeductible ?? null,
  ]);
}

/**
 * One coverage statement about a person, carrying where it came from. The
 * source matters because an object with no coverage fields means two different
 * things: `persons[].hsaCoverage: {}` is the documented way to record that the
 * person held no high deductible health plan coverage, while an account's
 * `planRules.hsa: {}` is a required fact that was not supplied, already
 * diagnosed HSA_COVERAGE_FACTS_REQUIRED. Reading the second as an assertion of
 * no coverage would answer a question the caller never answered.
 */
interface HsaCoverageVariant {
  source: "account" | "person";
  coverage: HsaCoverageInput;
  /** Twelve resolved slots, or null where this statement says nothing usable. */
  months: Array<HsaCoverageTier | null> | null;
}

/**
 * What a person's coverage was in a month, read across every statement made
 * about them. Two projections are needed because two different questions are
 * asked of the same statements, and conflating them loses one of the answers:
 *
 *  - `ResolvedCoverageSlot` decides the *amount* -- eligibility, the family
 *    portion, and the undivided self-only portion that is added to the IRC
 *    223(b)(5) household ceiling. Statements disagreeing between `self_only`
 *    and no coverage give different self portions, so that is `unknown` here.
 *  - `FamilyPresence` decides IRC 223(b)(5)(A) *applicability* -- whether the
 *    other spouse's self-only months are recharacterized. That same
 *    self_only-versus-none disagreement is `not_family` on either reading, so
 *    the other spouse's applicability stays knowable.
 */
type ResolvedCoverageSlot = "none" | "self_only" | "family" | "unknown";
type FamilyPresence = "family" | "not_family" | "unknown";

function resolvedCoverageSlotsFor(
  variants: ReadonlyArray<HsaCoverageVariant>,
): ResolvedCoverageSlot[] {
  const vectors = variants.filter((variant) => variant.months !== null).map((variant) => variant.months!);
  // No usable statement is unknown, stated explicitly. An `every` over an empty
  // list would otherwise answer the question vacuously.
  if (vectors.length === 0) return HSA_ALL_MONTHS.map(() => "unknown");
  return HSA_ALL_MONTHS.map((month) => {
    const slots = new Set(vectors.map((vector) => vector[month - 1] ?? "none"));
    if (slots.size > 1) return "unknown";
    return [...slots][0] as ResolvedCoverageSlot;
  });
}

function familyPresenceFor(slots: ReadonlyArray<ResolvedCoverageSlot>, variants: ReadonlyArray<HsaCoverageVariant>): FamilyPresence[] {
  const vectors = variants.filter((variant) => variant.months !== null).map((variant) => variant.months!);
  if (vectors.length === 0) return HSA_ALL_MONTHS.map(() => "unknown");
  return HSA_ALL_MONTHS.map((month, index) => {
    if (slots[index] !== "unknown") return slots[index] === "family" ? "family" : "not_family";
    let family = false;
    let notFamily = false;
    for (const vector of vectors) {
      if (vector[month - 1] === "family") family = true;
      else notFamily = true;
    }
    if (family && notFamily) return "unknown";
    return family ? "family" : "not_family";
  });
}

/**
 * Whether the supplied statements agree that a person was an eligible
 * individual in a month, which is a narrower question than either projection
 * above and the one Notice 2004-50 Q&A-31 turns on.
 *
 * `ResolvedCoverageSlot` answers what tier was held and `FamilyPresence`
 * answers IRC 223(b)(5)(A)'s family question; neither separates a disagreement
 * about the *tier* from a disagreement about whether there was any coverage at
 * all. Two accounts saying self-only and family agree that the person was
 * eligible and differ only on the amount; one saying family and another saying
 * no covered month do not, and only the second bears on whether the limitation
 * is divided under IRC 223(b)(5)(B)(ii) or given whole to the other spouse.
 */
type EligibilityPresence = "eligible" | "ineligible" | "unknown";

function eligibilityPresenceFor(variants: ReadonlyArray<HsaCoverageVariant>): EligibilityPresence[] {
  const vectors = variants.filter((variant) => variant.months !== null).map((variant) => variant.months!);
  if (vectors.length === 0) return HSA_ALL_MONTHS.map(() => "unknown");
  return HSA_ALL_MONTHS.map((month) => {
    let eligible = false;
    let ineligible = false;
    for (const vector of vectors) {
      if (vector[month - 1] === null) ineligible = true;
      else eligible = true;
    }
    if (eligible && ineligible) return "unknown";
    return eligible ? "eligible" : "ineligible";
  });
}

/** True when every supplied statement gives the same value for one field. */
function unanimousField<T>(values: ReadonlyArray<T>): boolean {
  return new Set(values.map((value) => JSON.stringify(value ?? null))).size <= 1;
}

/** Twelve coverage slots, or null when no coverage facts were supplied at all. */
function resolveHsaMonths(rules: HsaCoverageInput): Array<HsaCoverageTier | null> | null {
  const months: Array<HsaCoverageTier | null> = HSA_ALL_MONTHS.map(() => null);
  if (rules.monthlyCoverage !== undefined) {
    const entries = (toInputList(rules.monthlyCoverage) ?? []) as HsaMonthlyCoverageInput[];
    for (const entry of entries) months[entry.month - 1] = entry.coverage;
    return months;
  }
  if (rules.coverageTier === undefined) return null;
  const eligible = rules.eligibleMonths === undefined
    ? HSA_ALL_MONTHS
    : ((toInputList(rules.eligibleMonths) ?? []) as number[]);
  for (const month of eligible) months[month - 1] = rules.coverageTier;
  return months;
}

/**
 * The two spouses of a married couple, when both are present. IRC 223(b)(5)
 * applies to "individuals who are married to each other", which covers a
 * separate return as well as a joint one.
 */
function hsaMarriedCouple(context: CalculationContext): [string, string] | null {
  if (
    context.filingStatus !== FilingStatus.MARRIED_FILING_JOINTLY &&
    context.filingStatus !== FilingStatus.MARRIED_FILING_SEPARATELY
  ) {
    return null;
  }
  let taxpayerId: string | null = null;
  let spouseId: string | null = null;
  for (const person of context.persons.values()) {
    if (person.role === "taxpayer" && taxpayerId === null) taxpayerId = person.id;
    if (person.role === "spouse" && spouseId === null) spouseId = person.id;
  }
  return taxpayerId !== null && spouseId !== null ? [taxpayerId, spouseId] : null;
}

/**
 * IRC 223(b)(5)(B) takes the Archer MSA reduction out of the IRC 223(b)(1)
 * limitation and then divides what is left, so the reduction comes off the
 * divisible family-coverage-month portion first. Any excess comes off the same
 * individual's undivided self-only-month portion, because (b)(5)(B)(i) reduces
 * the paragraph (1) limitation itself and not one component of it. Neither
 * portion goes below zero.
 *
 * @returns the reduced family portion and the reduced self-only portion.
 */
function archerReducedPortions(familyPortion: number, selfPortion: number, amount: Money): [number, number] {
  return [
    Math.max(0, familyPortion - amount),
    Math.max(0, selfPortion - Math.max(0, amount - familyPortion)),
  ];
}

/**
 * IRC 223(b)(4) reduces "the limitation which would (but for this paragraph)
 * apply under this subsection" — the whole of subsection (b) — "but not below
 * zero". The paragraph (1) limitation absorbs the reduction first, and only
 * what paragraph (1) cannot absorb reaches the paragraph (3) additional
 * contribution amount, because the subsection is reduced once as a whole.
 *
 * @returns the reduced paragraph (1) limitation and the reduced paragraph (3) amount.
 */
function subsectionBReducedBy(baseLimit: number, catchUp: number, amount: Money): [Money, Money] {
  return [nonnegative(baseLimit - amount), nonnegative(catchUp - Math.max(0, amount - baseLimit))];
}

function initializeHsaPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  const hsaAccounts = accounts.filter((account) => ACCOUNT_TRAITS[account.type].family === "hsa");
  if (hsaAccounts.length === 0) return;

  const ownerIds: string[] = [];
  const accountsByOwner = new Map<string, NormalizedAccount[]>();
  for (const account of hsaAccounts) {
    let list = accountsByOwner.get(account.ownerId);
    if (!list) {
      list = [];
      accountsByOwner.set(account.ownerId, list);
      ownerIds.push(account.ownerId);
    }
    list.push(account);
  }

  const parameters = context.hsaParameters;
  if (parameters === null) {
    const { minimum, maximum } = RAW_HSA_PARAMETERS.supportedTaxYears;
    const before = context.taxYear < minimum;
    const entry = diagnostic(
      before ? "HSA_NOT_AVAILABLE_FOR_TAX_YEAR" : "HSA_PARAMETERS_NOT_PUBLISHED_FOR_TAX_YEAR",
      DiagnosticSeverity.ERROR,
      before
        ? `Health savings accounts were created for taxable years beginning after December 31, 2003, so no IRC 223 limitation exists for tax year ${context.taxYear}.`
        : `No IRC 223 revenue procedure is encoded for tax year ${context.taxYear}. Encoded HSA years are ${minimum}-${maximum}; a future year is never extrapolated.`,
      "taxYear",
      "IRC 223",
    );
    for (const ownerId of ownerIds) {
      context.hsaPlans.set(ownerId, {
        status: CalculationStatus.UNAVAILABLE,
        diagnostics: [entry],
        statutoryMaximum: 0,
        detail: null,
        familyPoolKey: null,
        // No IRC 223 year is encoded, so there is no family pool for the
        // seeding to reach and nothing to determine a draw against.
        familyPoolUsageDeterminable: false,
      });
    }
    return;
  }

  const facts = new Map<string, HsaOwnerFacts>();
  for (const ownerId of ownerIds) {
    const accountVariants: HsaRulesInput[] = [];
    const seenSignatures = new Set<string>();
    let hasUnusableAccountStatement = false;
    for (const account of accountsByOwner.get(ownerId)!) {
      const supplied = account.planRules.hsa;
      if (supplied === undefined) continue;
      if (resolveHsaMonths(supplied) === null) hasUnusableAccountStatement = true;
      const encoded = hsaCoverageSignature(supplied);
      if (!seenSignatures.has(encoded)) {
        seenSignatures.add(encoded);
        accountVariants.push(supplied);
      }
    }
    const usableAccounts = accountVariants.filter((coverage) => resolveHsaMonths(coverage) !== null);
    const conflict = new Set(usableAccounts.map((coverage) => hsaCoverageSignature(coverage))).size > 1;
    const declared = context.persons.get(ownerId)?.hsaCoverage;
    const personConflict = declared !== undefined && resolvePersonHsaMonths(declared) !== null && usableAccounts.some(
      (coverage) => hsaCoverageSignature(coverage) !== hsaCoverageSignature(declared, "person"),
    );
    /**
     * Every coverage statement made about this person, the person-level one
     * included. `persons[].hsaCoverage` is a statement of the same fact as
     * `planRules.hsa`, so it belongs in the same set rather than in a parallel
     * branch: the person-versus-account contradiction is then the ordinary
     * disagreement, read by the same projection.
     */
    const coverageVariants: HsaCoverageVariant[] = accountVariants.map((coverage) => ({
      source: "account",
      coverage,
      months: resolveHsaMonths(coverage),
    }));
    if (declared !== undefined && !seenSignatures.has(hsaCoverageSignature(declared, "person"))) {
      coverageVariants.push({
        source: "person",
        coverage: declared,
        // The one place an empty object is an answer: `persons[].hsaCoverage: {}`
        // records that this person held no high deductible health plan coverage.
        months: resolvePersonHsaMonths(declared),
      });
    }
    // Candidate schedules and deductible comparisons read only consensus facts.
    // Unusable account statements are diagnosed separately, never as no coverage.
    const slots = resolvedCoverageSlotsFor(coverageVariants);
    const resolvedMonths = slots.some((slot) => slot === "unknown")
      ? null : slots.map((slot) => slot === "none" ? null : slot as HsaCoverageTier);
    const resolvedDeductible = resolveHsaDeductible(coverageVariants);
    facts.set(ownerId, {
      ownerId,
      resolvedDeductible,
      hasUnusableAccountStatement: hasUnusableAccountStatement || usableAccounts.length === 0,
      hasUnusablePersonStatement: declared !== undefined && resolvePersonHsaMonths(declared) === null,
      conflict,
      personConflict,
      coverageVariants,
      testingPeriodFacts: context.persons.get(ownerId)?.hsaLastMonthRuleTestingPeriod ?? {},
      resolvedMonths,
    });
  }

  const couple = hsaMarriedCouple(context);
  const section223FsaFacts = healthFsaSection223FactsByOwner(context, accounts);
  const spouseIdOf = (ownerId: string): string | null => {
    if (couple === null) return null;
    if (couple[0] === ownerId) return couple[1];
    if (couple[1] === ownerId) return couple[0];
    return null;
  };
  const coupleMembersWithAccounts = couple
    ? couple.filter((personId) => accountsByOwner.has(personId))
    : [];

  /**
   * IRC 223(b)(5)(A) turns on whether *either spouse* has family coverage, not
   * on whether either spouse owns a health savings account. Coverage is
   * therefore read from the person: from `planRules.hsa` where that spouse has
   * an HSA, and from `persons[].hsaCoverage` where they do not.
   */
  const coupleCoverage = new Map<string, HsaPersonCoverage>();
  for (const personId of couple ?? []) {
    const owned = facts.get(personId);
    if (owned && owned.coverageVariants.length > 0) {
      coupleCoverage.set(personId, {
        supplied: true,
        months: owned.resolvedMonths,
        deductible: owned.resolvedDeductible,
      });
      continue;
    }
    const declared = context.persons.get(personId)?.hsaCoverage;
    coupleCoverage.set(
      personId,
      declared === undefined
        ? { supplied: false, months: null, deductible: { value: null, missing: false, conflicting: false } }
        : {
            supplied: true,
            months: resolvePersonHsaMonths(declared),
            deductible: resolveHsaDeductible([{ source: "person", coverage: declared, months: resolvePersonHsaMonths(declared) }]),
          },
    );
  }

  /**
   * Whether the spouses paid anything to an Archer MSA. IRC 223(b)(5)(B)(i)
   * reduces the couple's one limitation by "the aggregate amount paid to Archer
   * MSAs of such spouses", which is the one reduction that has to find room
   * somewhere in the household's capacity, so it is what decides whether a
   * spouse with no health savings account still belongs in the *pool*. Read
   * here because the two person sets below are built before
   * `coupleArcherAggregate` is.
   */
  const coupleArcherPositive = (couple ?? []).some(
    (id) => (context.persons.get(id)?.archerMsaContributions ?? 0) > 0,
  );
  /**
   * Every person whose coverage IRC 223(b)(5) reads, including a spouse who
   * owns no health savings account and states their coverage on
   * `persons[].hsaCoverage` instead.
   *
   * Owning an account is not a condition of anything the subsection does.
   * Notice 2004-50 Q&A-31 conditions a share on being an *eligible individual*,
   * and IRC 223(c)(1) does not mention accounts; Notice 2004-50 Q&A-33 says a
   * spouse who wants to contribute needs an HSA of their own, which is a fact
   * about where money may be put and not about whose coverage builds the
   * limitation. So an accountless spouse's schedule is computed like any
   * other's, and it reaches the comparison and the division through the same
   * route the account-owning spouse's does.
   */
  const candidatePersonIds = [...ownerIds];
  for (const personId of couple ?? []) {
    const coverage = coupleCoverage.get(personId);
    if (facts.has(personId) || coverage?.months == null) continue;
    const person = context.persons.get(personId)!;
    facts.set(personId, {
      ownerId: personId, resolvedMonths: [...coverage.months],
      resolvedDeductible: coverage.deductible, coverageVariants: [{ source: "person",
        coverage: person.hsaCoverage!, months: [...coverage.months] }],
      hasUnusableAccountStatement: false, hasUnusablePersonStatement: false,
      conflict: false, personConflict: false,
      testingPeriodFacts: person.hsaLastMonthRuleTestingPeriod ?? {},
    });
    candidatePersonIds.push(personId);
  }
  /**
   * The spouses the IRC 223(b)(8) greater-of is taken across.
   *
   * Notice 2008-52 Example 14 compares "L and M's combined full contribution
   * limit" against "L and M's combined sum of the monthly contribution limits"
   * and divides the winner, and neither figure is qualified by who holds an
   * account. Leaving an accountless spouse out of that comparison decided the
   * *other* spouse's limitation from a fact the statute never consults: the
   * same December family coverage gave the owner half a shared January month
   * when the spouse happened to own an HSA and the whole of it when they did
   * not.
   */
  const coupleComparisonPersons = (couple ?? []).filter((id) => facts.has(id));
  /**
   * The narrower set the published IRC 223(b)(5) pool is built from: the
   * capacity the represented accounts can actually draw on.
   *
   * An accountless spouse's own capacity is not available to any account in
   * this scenario, so adding it to the pool would report a ceiling no account
   * could reach. The exception is the one reduction that crosses the boundary:
   * where the spouses paid into an Archer MSA, IRC 223(b)(5)(B)(i) takes the
   * aggregate out of the couple's single limitation once, and leaving the
   * accountless spouse's capacity out of the amount it is taken from charges
   * the represented accounts with a reduction part of which the statute placed
   * elsewhere.
   *
   * This is only about the *amount*. Which candidate that amount is built from
   * is decided across `coupleComparisonPersons` above, because the greater-of
   * is a question about the couple rather than about the accounts.
   */
  const couplePoolPersons = coupleComparisonPersons.filter(
    (id) => accountsByOwner.has(id) || coupleArcherPositive,
  );

  /**
   * The coverage each spouse actually *stated*, month by month, snapshotted
   * before the IRC 223(b)(5)(A) recharacterization below rewrites self-only
   * months. The statute draws two different lines off these months and they
   * must not be confused: a spouse is *treated as* having family coverage for
   * the purpose of computing the limitation, but only a spouse who *has* a
   * family plan brings a deductible that competes for the lowest.
   *
   * The copy is deliberate rather than incidental. A `coupleCoverage` entry for
   * a spouse who owns an HSA holds the very array `facts` holds, so the
   * recharacterization writes through it in TypeScript, while PHP's arrays copy
   * on assignment and would not see the write. Reading stated coverage off a
   * mutated array would therefore mean two different answers in the two
   * engines, which is the divergence class this whole area exists to prevent.
   * Snapshotting makes the rule the same in both rather than leaving it to
   * language semantics and statement order.
   */
  /**
   * The IRC 223(b)(5)(A) reading of every person the subsection could reach,
   * month by month. A spouse who owns no health savings account states their
   * coverage on `persons[].hsaCoverage` instead, so both routes are collected
   * here; a person who stated nothing at all is absent, which is the case
   * `HSA_SPOUSE_COVERAGE_FACTS_REQUIRED` already reports.
   */
  const coverageVariantsByPerson = new Map<string, ReadonlyArray<HsaCoverageVariant>>();
  const coverageSlotsByPerson = new Map<string, ResolvedCoverageSlot[]>();
  const familyStatusByPerson = new Map<string, FamilyPresence[]>();
  const eligibilityStatusByPerson = new Map<string, EligibilityPresence[]>();
  for (const personId of new Set<string>([...ownerIds, ...(couple ?? [])])) {
    const owned = facts.get(personId);
    const declaredCoverage = context.persons.get(personId)?.hsaCoverage;
    const variants: ReadonlyArray<HsaCoverageVariant> =
      owned !== undefined && owned.coverageVariants.length > 0
        ? owned.coverageVariants
        : declaredCoverage !== undefined
          ? [
              {
                source: "person",
                coverage: declaredCoverage,
                months: resolvePersonHsaMonths(declaredCoverage),
              },
            ]
          : [];
    coverageVariantsByPerson.set(personId, variants);
    // A person every one of whose statements is unusable has stated nothing, so
    // no projection is recorded and the absent-facts diagnostic reports it.
    if (variants.some((variant) => variant.months !== null)) {
      const slots = resolvedCoverageSlotsFor(variants);
      coverageSlotsByPerson.set(personId, slots);
      familyStatusByPerson.set(personId, familyPresenceFor(slots, variants));
      eligibilityStatusByPerson.set(personId, eligibilityPresenceFor(variants));
    }
  }

  /**
   * IRC 223(c)(2)(A)(i) sets a minimum annual deductible for each coverage
   * tier. This engine does not decide whether any plan is a high deductible
   * health plan; that is the eligibility test the scope boundary excludes and
   * HSA_ELIGIBILITY_FACTS_SUPPLIED_BY_CALLER disclaims. What it can do without
   * crossing that line is detect that the caller's own assertions cannot all be
   * true at once. A figure supplied as `hdhpAnnualDeductible`, for months the
   * same caller states were covered at a given tier, must meet that tier's
   * statutory minimum or it is not the thing the field is declared to hold.
   * The test is one-way: clearing the minimum proves nothing about the plan,
   * while falling below it disproves the caller's own claim about the field.
   *
   * The consequence is not a lower ceiling. Notice 2004-50 Q&A-31 Example (4)
   * works a family plan with a $500 deductible against the 2004 family minimum
   * of $2,000 and concludes that *neither* spouse is an eligible individual:
   * the subminimum plan is neither ignored for failing the minimum nor read as
   * a $500 limitation. So the figure must not be clamped up to the minimum and
   * must not be published as a ceiling.
   *
   * Nor may the answer be `ineligible`. Rev. Rul. 2005-25 holds that a spouse's
   * non-HDHP family coverage which excludes the HSA owner does not invoke IRC
   * 223(b)(5) against that owner at all, and `HsaCoverageInput` carries no fact
   * about whom a plan covers, so Example (4) and that ruling are
   * indistinguishable from this input. Inconsistent input, indeterminate
   * output, which is the boundary a limits-only contract can defend.
   *
   * Stated months are read rather than the IRC 223(b)(5)(A) recharacterized
   * ones: the question is what plan the caller described, and a spouse merely
   * *treated as* having family coverage never asserted a family plan.
   */
  const subminimumDeductibleByPerson = new Map<string, HsaSubminimumDeductible>();
  for (const [personId, variants] of coverageVariantsByPerson) {
    for (const variant of variants) {
      const stated = variant.coverage.hdhpAnnualDeductible;
      if (stated === undefined || stated === null || variant.months === null) continue;
      for (const tier of HSA_COVERAGE_TIERS) {
        if (!variant.months.some((slot) => slot === tier)) continue;
        const minimum = parameters.hdhp.minimumAnnualDeductible[tier === "family" ? "family" : "selfOnly"];
        // Compared at the cent precision every published figure carries, not
        // with the tolerance used for accumulated float error elsewhere. A
        // stated 999.991 against a 1000 minimum is not a rounding artefact of
        // this engine's arithmetic -- it is what the caller supplied, and
        // subtracting 0.009 from the legal boundary would let it through to
        // produce a determinate 999.99 ceiling visibly below the minimum.
        if (roundMoney(stated) >= minimum) continue;
        // Deterministic in both engines and independent of input order. The
        // binding requirement is the highest minimum the stated figure falls
        // below; family precedes self-only where two minimums tie; and where
        // two statements fail the same minimum the lowest stated figure wins,
        // because without that last clause reordering one owner's two
        // contradictory accounts changed which deductible the message named.
        const recorded = subminimumDeductibleByPerson.get(personId);
        if (
          recorded === undefined ||
          minimum > recorded.minimum ||
          (minimum === recorded.minimum && tier === "family" && recorded.tier !== "family") ||
          (minimum === recorded.minimum && tier === recorded.tier && stated < recorded.stated)
        ) {
          subminimumDeductibleByPerson.set(personId, { stated, tier, minimum });
        }
      }
    }
  }


  /**
   * Stated coverage, projected onto the one question its two readers ask:
   * does this spouse have family coverage in this month. A month the person's
   * statements answer unanimously survives even when another month is
   * contradictory, which is what keeps a December limitation computable while
   * January is disputed. Reading a tier off whichever statement came first
   * would instead decide the applicability of IRC 223(b)(5)(A) from input
   * order.
   *
   * The projection is lossless only because nothing reads a non-family tier
   * from this map; a reader that needed `self_only` back would need the tier
   * carried through the status instead.
   */
  const statedCoverageByPerson = new Map<string, ReadonlyArray<HsaCoverageTier | null> | null>();
  for (const personId of couple ?? []) {
    const status = familyStatusByPerson.get(personId);
    statedCoverageByPerson.set(
      personId,
      status === undefined ? null : status.map((slot) => (slot === "family" ? "family" : null)),
    );
  }

  const familyMonth = HSA_ALL_MONTHS.map((month) =>
    (couple ?? []).some((personId) => statedCoverageByPerson.get(personId)?.[month - 1] === "family"),
  );
  const familySharingApplies = familyMonth.some(Boolean);
  /**
   * Whether IRC 223(b)(8) deems this person an eligible individual for the whole
   * year, which it does for anyone eligible in December of a year the rule
   * reaches.
   *
   * Nothing is elected here. IRC 223(b)(8)(A) says such an individual "shall be
   * treated" as an eligible individual for each month, and Notice 2008-52 turns
   * that into a greater-of, which by construction cannot lower a limitation --
   * so there is nothing for a taxpayer to accept or decline. The choice a
   * taxpayer really has is whether to fund the extra capacity, and that is a
   * contribution rather than a fact about the ceiling.
   *
   * The deeming is not private to the deemed person's own limitation. IRC
   * 223(b)(8)(A) opens "For purposes of computing the limitation under paragraph
   * (1) for any taxable year" without confining itself to that individual's
   * paragraph (1) figure, and IRC 223(b)(5) builds the couple's one limitation
   * out of both spouses' paragraph (1) limitations. So a spouse the rule deems
   * eligible is an eligible individual for Q&A-31's purposes too, and the months
   * of the *other* spouse's family coverage that they share are decided on the
   * deemed status rather than the raw month list. Reading the raw list gave two
   * spouses whom the rule reaches on a December-only family plan a sole
   * eligible month each and eleven undivided ones, when each is deemed eligible
   * throughout and every month is shared.
   */
  const lastMonthRuleDeemsEligible = (personId: string): boolean => {
    if (!parameters.lastMonthRuleAvailable) return false;
    const slots = coverageSlotsByPerson.get(personId);
    // Nobody stated this person's coverage, so nothing states the December
    // eligibility the rule turns on. Nothing is lost by declining to deem: with
    // no stated months the ordinary candidate already runs the whole year,
    // which is the schedule the deeming would have built.
    return slots !== undefined && slots[HSA_MONTHS_IN_YEAR - 1] !== "none";
  };
  /**
   * Eligibility as the facts state it, with no IRC 223(b)(8) deeming. This is
   * what the ordinary candidate reads: Notice 2008-52 builds that candidate
   * from "eligibility and HDHP coverage on the first day of each month", which
   * the last-month rule does not touch.
   */
  const actuallyEligibleInMonth = (personId: string, monthIndex: number): boolean => {
    const slots = coverageSlotsByPerson.get(personId);
    if (slots === undefined) return true;
    return slots[monthIndex] !== "none";
  };
  const eligibleInMonth = (personId: string, monthIndex: number): boolean =>
    actuallyEligibleInMonth(personId, monthIndex) || lastMonthRuleDeemsEligible(personId);
  if (familySharingApplies) {
    // IRC 223(b)(5)(A): if either spouse has family coverage, both are treated
    // as having only that family coverage. It does not make an otherwise
    // ineligible month eligible, so only supplied months are rewritten.
    for (const personId of coupleComparisonPersons) {
      const owner = facts.get(personId)!;
      if (!owner.resolvedMonths) continue;
      for (const month of HSA_ALL_MONTHS) {
        if (familyMonth[month - 1] && owner.resolvedMonths[month - 1] === "self_only") {
          owner.resolvedMonths[month - 1] = "family";
        }
      }
    }
  }
  /**
   * Coverage is resolved across every owner statement before candidate construction.
   * The monthly recharacterization diagnostic requires unanimous original self-only coverage.
   */
  const recharacterizationEstablished = (personId: string): boolean => {
    const slots = coverageSlotsByPerson.get(personId);
    return (
      slots !== undefined &&
      HSA_ALL_MONTHS.some((_month, index) => slots[index] === "self_only" && familyMonth[index])
    );
  };

  /**
   * The coverage schedule of the IRC 223(b)(8) full-contribution candidate.
   *
   * Notice 2008-52 does not blend the two rules, it compares them. A
   * December-eligible individual's annual limit is "the greater of" (1) "the
   * sum of the limits determined separately for each month under section
   * 223(b)(2), based on eligibility and HDHP coverage on the first day of each
   * month, plus catch-up contributions for each month", or (2) "the maximum
   * annual HSA contribution under section 223(b)(2)(A) or section 223(b)(2)(B)
   * based on the individual's HDHP coverage (self-only or family) on the first
   * day of the last month of the individual's taxable year, plus catch-up
   * contributions under section 223(b)(3)". The rule "may increase, but not
   * decrease, the contribution limit" and "applies without regard to whether
   * the individual was an eligible individual for the entire year, had HDHP
   * coverage for the entire year, or had disqualifying non-HDHP coverage for
   * part of the year".
   *
   * Example 3 is what rules out reading clause (ii) of IRC 223(b)(8)(A) as a
   * per-month filter. B is an eligible individual in every month of 2008,
   * self-only through October and family from November, so no month of B's is
   * eligible "solely by reason of clause (i)" and imputing December's plan only
   * to such months changes nothing at all. The notice still gives B $5,800,
   * "the greater of $5,800 or $3,383.34". Candidate (2) is therefore December's
   * tier for the whole year, not December's tier poured into the gaps.
   *
   * The schedule is built for the couple rather than privately inside one
   * owner's arithmetic, because IRC 223(b)(5)(A) reads the spouses' coverage
   * together: a spouse deemed to hold family coverage for twelve months makes
   * the other spouse's eligible self-only months family months too. Building it
   * privately would let a full-year family candidate stack on top of the other
   * spouse's eleven undivided self-only months and put more than one family
   * limitation into the two accounts, where Notice 2008-52 Example 14 has the
   * couple compare, and then divide, a single combined figure.
   */
  const deemedMonthsByPerson = new Map<string, Array<HsaCoverageTier | null>>();
  {
    const decemberIndex = HSA_MONTHS_IN_YEAR - 1;
    const record = (personId: string, monthTiers: Array<HsaCoverageTier | null>): void => {
      deemedMonthsByPerson.set(personId, monthTiers);
    };
    for (const personId of new Set<string>([...ownerIds, ...(couple ?? [])])) {
      const ownMonths = facts.get(personId)?.resolvedMonths ?? null;
      if (ownMonths !== null) {
        // December's tier is read after the recharacterization above, because
        // the plan the individual is "treated as having been enrolled" in is
        // the one IRC 223(b)(5)(A) already resolved for that month.
        const decemberTier = ownMonths[decemberIndex];
        record(
          personId,
          lastMonthRuleDeemsEligible(personId) && decemberTier !== null
            ? HSA_ALL_MONTHS.map(() => decemberTier)
            : [...ownMonths],
        );
        continue;
      }
      // A spouse who owns no HSA still states coverage that IRC 223(b)(5)(A)
      // reads, and the same deeming reaches it. Only their family months are
      // ever read back, which is all this projection carries.
      const stated = statedCoverageByPerson.get(personId) ?? null;
      if (stated === null) continue;
      record(
        personId,
        lastMonthRuleDeemsEligible(personId) && stated[decemberIndex] === "family"
          ? HSA_ALL_MONTHS.map(() => "family" as HsaCoverageTier)
          : stated.map((tier) => tier),
      );
    }
    /**
     * Which months IRC 223(b)(5)(A) reads as family months *in candidate (2)*,
     * read off the candidate (2) schedules themselves and nothing else.
     *
     * Candidate (2) is a different year from the one the individual lived, not
     * an overlay on it. Notice 2008-52 Example 8 settles the point: G holds
     * family coverage from January through August and self-only coverage from
     * September, and "G's full contribution limit under section 223(b)(8) for
     * 2008 is $2,900" -- the plain self-only maximum, with G's eight actual
     * family months contributing nothing to it. The notice then takes "the
     * greater of $2,900 or $4,833.33", so the earlier family months reach the
     * answer through candidate (1) alone.
     *
     * Carrying the stated family months into this mask instead built a hybrid
     * year that is neither candidate: a taxpayer with family coverage January
     * to June, no coverage July to November and self-only coverage in December
     * had candidate (2) computed as six family months plus six self-only ones,
     * beating a candidate (1) that correctly skips the ineligible months and
     * manufacturing an IRC 223(b)(8)(B) testing period out of the difference.
     *
     * A spouse whom the rule does not reach keeps their own schedule here, so
     * their real family months are in this mask already -- they are in their
     * candidate (2) because their candidate (2) is their actual year. Only a
     * spouse whose year the deeming *replaced* drops out, which is the whole
     * correction.
     */
    const deemedFamilyMonth = HSA_ALL_MONTHS.map((_month, index) =>
      (couple ?? []).some(
        (personId) => deemedMonthsByPerson.get(personId)?.[index] === "family",
      ),
    );
    // IRC 223(b)(5)(A) once more, over the deemed schedules. One pass suffices:
    // promotion only turns self-only months into family months in months that
    // already hold family coverage, so recomputing the mask afterwards would
    // return the same months and no further round can open.
    //
    // Over every spouse the comparison reads, not only those holding accounts:
    // an accountless spouse's candidate (2) is an operand of the couple's
    // combined total, so leaving their self-only months unrecharacterized would
    // compare a figure IRC 223(b)(5)(A) has not finished with.
    for (const personId of coupleComparisonPersons) {
      const monthTiers = deemedMonthsByPerson.get(personId);
      if (monthTiers === undefined) continue;
      for (const month of HSA_ALL_MONTHS) {
        if (deemedFamilyMonth[month - 1] && monthTiers[month - 1] === "self_only") {
          monthTiers[month - 1] = "family";
        }
      }
    }
  }

  /**
   * The spouses whose subminimum *family* plan actually reaches this person's
   * limitation, month by month rather than for the year.
   *
   * IRC 223(b)(5)(A) resolves the lowest-deductible comparison per month --
   * `familyDeductibleByMonth` below does exactly that -- so a contradiction in
   * a month this person was not eligible cannot touch the months they were. A
   * spouse's January-only family plan does not make a December-only limitation
   * unknowable, and treating `familySharingApplies` as the test would refuse an
   * answer the engine already has.
   *
   * Stated family months are read on the spouse's side, because only a spouse
   * who *has* a family plan brings a deductible that competes; the owner's side
   * reads eligibility alone, because a self-only month of theirs is
   * recharacterized to family in any month the spouse holds family coverage.
   */
  const subminimumFamilySpousesFor = (personId: string): Array<[string, HsaSubminimumDeductible]> => {
    const reaching: Array<[string, HsaSubminimumDeductible]> = [];
    if (!familySharingApplies) return reaching;
    const ownMonths = facts.get(personId)?.resolvedMonths ?? null;
    if (ownMonths === null) return reaching;
    for (const otherId of couple ?? []) {
      if (otherId === personId) continue;
      const entry = subminimumDeductibleByPerson.get(otherId);
      if (entry === undefined || entry.tier !== "family") continue;
      const otherFamilyMonths = statedCoverageByPerson.get(otherId) ?? null;
      if (otherFamilyMonths === null) continue;
      if (
        HSA_ALL_MONTHS.some(
          (month) => otherFamilyMonths[month - 1] === "family" && ownMonths[month - 1] !== null,
        )
      ) {
        reaching.push([otherId, entry]);
      }
    }
    return reaching;
  };

  /**
   * Whether the figure this check rejected could have reached this owner's
   * limitation arithmetic. Read in both passes: the first raises the
   * diagnostic, the second withholds the limitation detail built from the
   * rejected deductible, because saying in a diagnostic that a figure is not
   * published as a ceiling while `appliedAnnualLimitByMonth` still carries
   * twelve copies of it publishes it anyway.
   */
  const subminimumDeductibleReaches = (personId: string): boolean =>
    subminimumDeductibleByPerson.has(personId) || subminimumFamilySpousesFor(personId).length > 0;

  /**
   * Which of this person's months the rejected deductible actually fed.
   *
   * `appliedAnnualLimitByMonth` is month-granular by contract, and the reach
   * calculation above is already month-aware, so nulling all twelve threw away
   * known entries: a spouse's January-only subminimum plan leaves February
   * through December resting on nothing but the owner's own lawful deductible.
   * The two annual scalars beside it stay null whenever *any* month is
   * affected, because they are sums over all of them.
   *
   * The owner's own contradiction feeds every month they were eligible -- one
   * deductible covers the whole input -- while a spouse's feeds only the months
   * their family plan was in force.
   */
  const subminimumAffectedMonths = (personId: string): boolean[] => {
    const ownMonths = facts.get(personId)?.resolvedMonths ?? null;
    if (ownMonths === null) return HSA_ALL_MONTHS.map(() => false);
    const ownContradiction = subminimumDeductibleByPerson.has(personId);
    const reachingSpouses = subminimumFamilySpousesFor(personId);
    return HSA_ALL_MONTHS.map((month) => {
      if (ownMonths[month - 1] === null) return false;
      if (ownContradiction) return true;
      return reachingSpouses.some(
        ([otherId]) => statedCoverageByPerson.get(otherId)?.[month - 1] === "family",
      );
    });
  };

  /**
   * IRC 223(b)(5)(A) also treats spouses with family coverage under different
   * plans as covered by the plan with the lowest annual deductible. That only
   * changes an amount for 2004-2006, when IRC 223(b)(2) capped the monthly
   * limitation by the deductible.
   *
   * It is resolved per month, because the limitation itself is: IRC 223(b)(2)
   * builds the year out of twelve monthly amounts, each determined from the
   * coverage in force for that month. A spouse who takes family coverage in
   * December brings that plan's deductible to December and to no earlier month,
   * where they had no family plan for it to be the lowest of.
   */
  type FamilyMonthDeductible =
    | { state: "not_applicable" }
    | { state: "known"; value: Money }
    | { state: "indeterminate"; missingPersonIds: string[]; conflictingPersonIds: string[] };

  const familyDeductibleByMonth: FamilyMonthDeductible[] = HSA_ALL_MONTHS.map((month) => {
    // IRC 223(b)(5)(A) reaches the lowest annual deductible only "if such
    // spouses each have family coverage under different plans". A spouse whose
    // own coverage is self-only for this month has no family plan, so their
    // deductible is not a candidate and must not lower the couple's family
    // limitation -- which is the deductible of a family plan, not of whatever
    // plan happens to be cheapest in the household.
    const candidates = (couple ?? []).filter(
      (personId) => statedCoverageByPerson.get(personId)?.[month - 1] === "family",
    );
    if (candidates.length === 0) return { state: "not_applicable" };
    const missingPersonIds = candidates.filter(
      (personId) => coupleCoverage.get(personId)?.deductible.missing === true,
    );
    // A candidate's plan could be the lowest, so an unstated one leaves the
    // least of them unknown rather than simply absent from the comparison.
    const conflictingPersonIds = candidates.filter(
      (personId) => coupleCoverage.get(personId)?.deductible.conflicting === true,
    );
    if (missingPersonIds.length > 0 || conflictingPersonIds.length > 0) {
      return { state: "indeterminate", missingPersonIds, conflictingPersonIds };
    }
    return {
      state: "known",
      value: Math.min(
        ...candidates.map((personId) => coupleCoverage.get(personId)!.deductible.value!),
      ),
    };
  });

  /**
   * One of the two limitations Notice 2008-52 compares: candidate (1), the sum
   * of the monthly limits on the facts as stated, or candidate (2), the whole
   * annual amount for December's coverage tier. Every figure a downstream rule
   * reads is carried for both, because the greater-of is decided on the totals
   * and the winner must then be used consistently -- taking the larger of each
   * component separately would assemble a limitation neither candidate is.
   */
  interface HsaCandidatePortions {
    familyPortion: number;
    familySharedPortion: number;
    familySolePortion: number;
    selfPortion: number;
    prorated: Money;
    familyMonthlyAmounts: Array<Money | null>;
    annualLimitByMonth: Array<Money | null>;
    catchUp: Money;
  }

  interface HsaOwnerAmounts {
    ordinaryCandidate: HsaCandidatePortions;
    fullContributionCandidate: HsaCandidatePortions;
    proratedApplied: Money;
    proratedWithoutLastMonthRule: Money;
    /** Unrounded twelfth-summed portion of the limit from family-coverage months. Only this portion is divided between spouses under IRC 223(b)(5)(B)(ii). */
    familyPortionApplied: number;
    /**
     * The part of `familyPortionApplied` from months in which the other spouse
     * was also an eligible individual, and so the only part a division reaches.
     * Notice 2004-50 Q&A-31 gives a month in which only one spouse is eligible
     * wholly to that spouse, and Q&A-32 works the same split the other way --
     * dividing the months of shared family coverage while leaving the earlier
     * self-only months undivided. The remainder, `familySolePortionApplied`, is
     * this owner's whole.
     */
    familySharedPortionApplied: number;
    familySolePortionApplied: number;
    /**
     * The same decomposition of the counterfactual. IRC 223(b)(8)(B)(i)
     * includes in income only "the aggregate amount of the contributions ...
     * which could not have been made but for subparagraph (A)", which is the
     * difference between the two limits -- so the ordinary one has to be
     * computed the same way as the applied one. Leaving it undecomposed made
     * `reducedDivided` fall back on its default and treat every ordinary family
     * month as shared, which reported 2187.50 as attributable to a rule that was
     * never applied and carried that figure into the testing-period inclusion
     * and its 10 percent additional tax.
     */
    familySharedPortionWithoutLastMonthRule: number;
    familySolePortionWithoutLastMonthRule: number;
    /**
     * The applied family-coverage monthly amount for each month, or null where
     * the owner had no family coverage that month. The couple-wide ceiling is
     * built from these rather than from anyone's annual total, because once
     * eligibility is segmented by month the spouses' family months need not be
     * the same set or nested one inside the other.
     */
    familyMonthlyAmounts: Array<Money | null>;
    /** Unrounded twelfth-summed portion from self-only months, which stays with the individual (Form 8889 line 6, Step 4). */
    selfPortionApplied: number;
    familyPortionWithoutLastMonthRule: number;
    selfPortionWithoutLastMonthRule: number;
    catchUpApplied: Money;
    /** IRC 223(b)(3) turns on age, so an absent birth year leaves its amount untestable rather than nil. */
    ageKnown: boolean;
    catchUpWithoutLastMonthRule: Money;
    appliedAnnualLimitByMonth: Array<Money | null>;
    eligibleMonthCount: number;
    /** Whether IRC 223(b)(8) reaches this owner at all, which is what earns the whole IRC 223(b)(3) amount in candidate (2). */
    fullContributionRuleAvailable: boolean;
    /** Whether the greater-of below chose candidate (2) for this owner. Set there, not here. */
    fullContributionCandidateSelected: boolean;
    /** Whether that selection, and the schedule behind it, rest on facts the input established. */
    candidateSelectionUnestablished: boolean;
    diagnostics: Diagnostic[];
    indeterminate: boolean;
    familyPoolAmountIndeterminate: boolean;
  }

  const amountsByOwner = new Map<string, HsaOwnerAmounts>();

  for (const ownerId of candidatePersonIds) {
    const owner = facts.get(ownerId)!;
    const person = context.persons.get(ownerId)!;
    const diagnostics: Diagnostic[] = [];
    let indeterminate = false;
    /**
     * IRC 223(b)(5) asks two questions, and an input that leaves one unanswered
     * usually leaves the other answered:
     *
     *   (A) gives the spouses one family limitation. Whether *that amount* is
     *       knowable is `familyPoolAmountIndeterminate`, and it is a per-owner
     *       question because it is built from each spouse's coverage facts.
     *   (B)(ii) divides that one limitation between them, equally unless they
     *       agree otherwise. Whether *the division* is knowable is
     *       `householdDivisionIndeterminate`, below, and it is not a per-owner
     *       question at all: the division is one statement about the couple, so
     *       there is no owner to attribute it to. This is what moving the
     *       division off the account bought -- the flag that used to sit beside
     *       `familyPoolAmountIndeterminate` here could only ever be set by two
     *       of one owner's accounts contradicting each other about a fact that
     *       was never theirs to state.
     *
     * The amount question is narrower than whether this owner's overall result
     * is determinable. A missing birth year makes only the IRC 223(b)(3) age-55
     * amount unknown and leaves the IRC 223(b)(5) family limit perfectly
     * knowable, so it deliberately does not set it. Neither does the bare fact
     * that this person's coverage statements disagree: see
     * `familyOperandConflict` below, which asks which operand they disagree
     * about.
     */
    let familyPoolAmountIndeterminate = false;
    /**
     * The detail describes one resolved monthly schedule and its selected candidate.
     * When those operands remain unknown, the detail is withheld as a unit.
     * An unsettled division alone leaves the candidate schedules available.
     */
    let candidateSelectionUnestablished = false;

    /**
     * Does this owner's disagreement actually reach the couple's IRC 223(b)(5)
     * ceiling? That ceiling is the divided family limitation *plus* the
     * spouses' undivided self-only portions, so the question is which inputs
     * can change `familyPortionApplied` or `selfPortionApplied`. `HsaRulesInput`
     * is a closed surface of four fields, so the answer is enumerable rather
     * than guessable -- an earlier attempt listed only the operands of the
     * divided family amount and let a self-only month and a self-only deductible
     * through, each of which then fixed the ceiling from whichever account
     * happened to be listed first:
     *
     *   coverageTier, eligibleMonths, monthlyCoverage  reach it: tier and
     *       months of both portions.
     *   hdhpAnnualDeductible  reaches it in 2004-2006 only, when IRC 223(b)(2)
     *       capped each covered month by it -- family months through the IRC
     *       223(b)(5)(A) lowest-deductible comparison, and self-only months
     *       through the undivided self portion, which is why no family month is
     *       required for it to matter.
     *
     * A fifth field must be classified here rather than defaulting to inert.
     *
     * IRC 223(b)(8) is no longer among them, and its absence is not an
     * oversight: it does reach the ceiling, but it is now read off the coverage
     * months listed above rather than stated separately, so an owner's accounts
     * have nothing left to disagree about beyond those months. Same for the
     * testing-period facts, which never reached either portion in the first
     * place.
     */
    const ownerSlots = coverageSlotsByPerson.get(ownerId);
    const deductibleUnanimous = unanimousField(
      (coverageVariantsByPerson.get(ownerId) ?? []).map((variant) => variant.coverage.hdhpAnnualDeductible),
    );
    const amountInputsIndeterminate =
      ownerSlots === undefined ||
      ownerSlots.some((slot) => slot === "unknown") ||
      (parameters.contributionLimitCappedByHdhpAnnualDeductible &&
        !deductibleUnanimous &&
        ownerSlots.some((slot) => slot !== "none"));
    if (amountInputsIndeterminate) {
      indeterminate = true;
      familyPoolAmountIndeterminate = true;
      // The months themselves, or the deductible that priced them in a capped
      // year, are not established -- so neither is the schedule either candidate
      // is built from.
      candidateSelectionUnestablished = true;
    }

    if (owner.conflict) {
      indeterminate = true;
      diagnostics.push(
        diagnostic(
          "HSA_CONFLICTING_COVERAGE_FACTS_FOR_OWNER",
          DiagnosticSeverity.ERROR,
          "Two health savings accounts owned by the same person supplied different IRC 223 coverage facts. Coverage is a fact about the person, so it must be identical on every one of that person's HSAs.",
          `persons.${ownerId}`,
          "IRC 223(b)",
        ),
      );
    }
    if (owner.personConflict) {
      indeterminate = true;
      diagnostics.push(
        diagnostic(
          "HSA_PERSON_AND_ACCOUNT_COVERAGE_FACTS_CONFLICT",
          DiagnosticSeverity.ERROR,
          "This person's persons[].hsaCoverage and their health savings account's planRules.hsa state different IRC 223(c)(2) coverage. Coverage is one fact about the person, so the two must be identical; persons[].hsaCoverage exists for a spouse who owns no HSA.",
          `persons.${ownerId}`,
          "IRC 223(b)",
        ),
      );
    }
    if (owner.hasUnusableAccountStatement || owner.hasUnusablePersonStatement) {
      indeterminate = true;
      familyPoolAmountIndeterminate = true;
      candidateSelectionUnestablished = true;
      diagnostics.push(
        diagnostic(
          "HSA_COVERAGE_FACTS_REQUIRED",
          DiagnosticSeverity.ERROR,
          "Each supplied coverage statement needs a coverage tier or a monthlyCoverage list; only an empty persons[].hsaCoverage explicitly states no coverage. Whether a person is an eligible individual under IRC 223(c)(1), including Medicare entitlement under IRC 223(b)(7), is a caller-supplied fact.",
          `persons.${ownerId}`,
          "IRC 223(b)(1)",
        ),
      );
    }

    const months = owner.resolvedMonths ?? HSA_ALL_MONTHS.map(() => null);

    /**
     * IRC 223(b)(5)(A) makes the other spouse's coverage matter for two
     * independent reasons, and the sentence does two separate things:
     *
     *   *Recharacterization.* Spouses are treated as having family coverage for
     *   any month in which either has it, which can only ever *raise* a
     *   self-only month. So this reason bites exactly when the owner has a
     *   self-only month. Without the spouse's coverage the answer is genuinely
     *   unknown — self-only for the whole year is $4,400 for 2026, but a
     *   spouse's family coverage makes it a divided family limit instead — and
     *   answering with either number would be a guess.
     *
     *   *Lowest deductible.* Spouses who each have family coverage under
     *   different plans are treated as covered by the plan with the lowest
     *   annual deductible. That changes an amount only for 2004-2006, when IRC
     *   223(b)(2) capped each month by the deductible, and it bites on the
     *   owner's *family* months — where recharacterization has nothing left to
     *   do. An unstated spouse may hold a family plan whose deductible is lower
     *   than this owner's, in which case the couple's limitation is lower than
     *   the figure this owner's own plan produces.
     *
     * The second reason is why an owner with family coverage every month is not
     * safe in a capped year merely because no recharacterization is possible.
     * Treating an absent spouse as holding no competing family plan would answer
     * the subparagraph (A) comparison from a fact the caller never supplied, and
     * would fail open in the direction that costs a taxpayer the IRC 4973 excise.
     * `persons[].hsaCoverage: {}` already exists as the cheap way to state that
     * the spouse held no high deductible health plan coverage, so absence and
     * "no coverage" stay distinguishable rather than being conflated here.
     */
    const marriedFiler =
      context.filingStatus === FilingStatus.MARRIED_FILING_JOINTLY ||
      context.filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY;
    const otherSpouseId = couple?.find((personId) => personId !== ownerId);
    const ownerIsSpouseOfCouple = couple !== null && couple.includes(ownerId);
    /**
     * Supplied has to mean *usable*. An account whose `planRules.hsa` carries no
     * tier and no `monthlyCoverage` has not stated this person's coverage, even
     * though the property is present, so the other spouse is no better placed
     * than if nothing had been said. Reading the empty object as an assertion of
     * no family coverage would answer the IRC 223(b)(5)(A) question from a fact
     * the caller never supplied. `persons[].hsaCoverage: {}` is the exception
     * and is deliberately different: it is the documented way to state that the
     * person held no high deductible health plan coverage.
     */
    const spouseCoverageSupplied =
      otherSpouseId !== undefined && familyStatusByPerson.has(otherSpouseId);
    const missingCoupleForFamilyDivision = couple === null &&
      months.some((tier) => tier === "family");
    const recharacterizationCouldRaiseTier = months.some((tier) => tier === "self_only");
    const lowestDeductibleCouldLowerAmount =
      parameters.contributionLimitCappedByHdhpAnnualDeductible &&
      months.some((tier) => tier === "family");
    if (
      marriedFiler &&
      (ownerIsSpouseOfCouple || person.role === "taxpayer" || person.role === "spouse") &&
      !spouseCoverageSupplied &&
      (recharacterizationCouldRaiseTier || lowestDeductibleCouldLowerAmount || missingCoupleForFamilyDivision)
    ) {
      indeterminate = true;
      familyPoolAmountIndeterminate = true;
      // Whether IRC 223(b)(5)(A) rewrites this owner's self-only months is what
      // decides both candidates' tiers, so an unstated spouse leaves the
      // schedule open rather than merely the share of it.
      candidateSelectionUnestablished = true;
      // Name the reason that actually applies. Both can, and a caller told only
      // about self-only months would go looking for one in a record whose months
      // are all family months.
      const reason = missingCoupleForFamilyDivision
        ? "Both taxpayer and spouse person records are required to establish the family limitation and its division. Even an agreed whole share does not establish the absent spouse's Archer MSA amount, which IRC 223(b)(5)(B)(i) includes in the reduction before division. The absent record also does not establish ineligibility."
        : recharacterizationCouldRaiseTier
        ? lowestDeductibleCouldLowerAmount
          ? `This owner has at least one self-only month, which that treatment can raise to a family month, and at least one family month, whose limitation for tax year ${context.taxYear} is capped by the lowest of the spouses' family-plan annual deductibles under IRC 223(b)(2). The other spouse's coverage changes the answer both ways and is not supplied.`
          : "This owner has at least one self-only month, so the other spouse's coverage changes the answer and is not supplied."
        : `IRC 223(b)(5)(A) also treats spouses who each have family coverage under different plans as having the family coverage with the lowest annual deductible, and for tax year ${context.taxYear} IRC 223(b)(2) capped each month's limitation by that deductible. This owner has at least one family month, so an unstated spouse holding a family plan with a lower deductible would lower this limitation, and their coverage is not supplied.`;
      diagnostics.push(
        diagnostic(
          "HSA_SPOUSE_COVERAGE_FACTS_REQUIRED",
          DiagnosticSeverity.ERROR,
          `IRC 223(b)(5)(A) treats both spouses as having family coverage for any month in which either of them has it, whether or not that spouse owns a health savings account. ${reason} State it on that spouse's persons[].hsaCoverage — an empty object records that the spouse held no high deductible health plan coverage.`,
          `persons.${ownerId}`,
          "IRC 223(b)(5)(A)",
        ),
      );
    }

    const spouseDeclaration = otherSpouseId === undefined ? undefined : context.persons.get(otherSpouseId)?.hsaCoverage;
    if (!spouseCoverageSupplied && spouseDeclaration !== undefined &&
        resolvePersonHsaMonths(spouseDeclaration) === null &&
        !recharacterizationCouldRaiseTier && !lowestDeductibleCouldLowerAmount &&
        months.some((tier) => tier === "family")) {
      diagnostics.push(diagnostic(
        "HSA_SPOUSE_COVERAGE_FACTS_REQUIRED", DiagnosticSeverity.ERROR,
        "The spouse's nonempty persons[].hsaCoverage does not establish an eligible-month schedule. Supply a coverage tier or monthlyCoverage; only an empty object affirmatively states no coverage. Eligibility is required to determine the IRC 223(b)(5)(B)(ii) division.",
        `persons.${ownerId}`, "IRC 223(b)(5)(B)(ii)",
      ));
      /**
       * Where the spouses also paid into an Archer MSA, the unusable statement
       * takes the couple's *amount* with it and not only its division.
       *
       * A spouse with no usable schedule holds no place in `couplePoolPersons`,
       * so the household figure is computed as though they had no capacity at
       * all -- and IRC 223(b)(5)(B)(i) subtracts the spouses' aggregate from
       * that figure before subparagraph (B)(ii) divides it. The completions the
       * statement leaves open are not variations on one answer: a February the
       * spouse spent under self-only coverage adds a twelfth of the self-only
       * limitation to the amount the aggregate comes out of, a February under
       * family coverage adds a twelfth of the family one, and no February at
       * all adds nothing. Reporting the last of those as the couple's ceiling
       * asserts the very fact the diagnostic beside it has just called
       * unstated.
       *
       * With no Archer MSA amount there is nothing to place, and an accountless
       * spouse's own capacity reaches no account in this scenario, so the pool
       * keeps reporting the represented accounts' ceiling exactly as it does
       * for a spouse who stated nothing at all.
       */
      if (coupleArcherPositive) familyPoolAmountIndeterminate = true;
    }

    /**
     * The same question one step further out. A spouse who supplied coverage
     * facts that contradict each other on the family question has not answered
     * it either, so an owner with a self-only month is no better placed than if
     * that spouse had said nothing. This is a sibling of the condition above
     * rather than a reuse of it: the remedy differs, because the caller must
     * reconcile two statements they already made instead of adding a missing
     * one. It is also not the IRC 223(b)(5) sharing error, which reports a
     * family limitation known to exist but not divisible; here whether the
     * subsection applies at all is what is unknown, and the sharing path is
     * never reached.
     */
    const otherSpouseFamilyStatus =
      otherSpouseId === undefined ? undefined : familyStatusByPerson.get(otherSpouseId);
    /**
     * The months have to be the same months. IRC 223(b)(5)(A) recharacterizes a
     * self-only month only where a spouse has family coverage in *that* month,
     * so a spouse whose statements contradict each other in January leaves a
     * December self-only limitation exactly as computable as it ever was.
     */
    /**
     * Both schedules are read, because IRC 223(b)(8)(A) makes the deemed one a
     * schedule of months like any other: an individual treated as an eligible
     * individual in January with December's self-only coverage has a self-only
     * January for IRC 223(b)(5)(A) to recharacterize, whatever their actual
     * January was. Reading only the stated months reported a confident ceiling
     * for a taxpayer eligible in December alone while the spouse's own accounts
     * contradicted each other about January -- the one month of the deemed year
     * that decided whether the answer was 4400 or 4762.50.
     *
     * It refuses in one case it need not: where the month-by-month candidate
     * wins by more than the recharacterization could ever add, the contradiction
     * cannot change the reported figure. Establishing that would mean computing
     * candidate (2) under both readings and re-running the couple's combined
     * comparison under each, for an input whose other spouse is already refused
     * for the same contradiction. A refusal that names the contradiction is the
     * better trade.
     */
    const deemedMonthsForOwner = deemedMonthsByPerson.get(ownerId) ?? months;
    const spouseCoverageAmbiguousOnFamily =
      otherSpouseFamilyStatus !== undefined &&
      HSA_ALL_MONTHS.some(
        (_month, index) =>
          otherSpouseFamilyStatus[index] === "unknown" &&
          (months[index] === "self_only" || deemedMonthsForOwner[index] === "self_only"),
      );
    if (
      marriedFiler &&
      (ownerIsSpouseOfCouple || person.role === "taxpayer" || person.role === "spouse") &&
      spouseCoverageAmbiguousOnFamily
    ) {
      indeterminate = true;
      familyPoolAmountIndeterminate = true;
      candidateSelectionUnestablished = true;
      diagnostics.push(
        diagnostic(
          "HSA_SPOUSE_COVERAGE_FACTS_CONFLICT",
          DiagnosticSeverity.ERROR,
          "IRC 223(b)(5)(A) treats both spouses as having family coverage for any month in which either of them has it. The other spouse's supplied coverage facts disagree about whether they have family coverage, so whether this subsection applies to this owner's self-only months cannot be determined. Reconcile that spouse's coverage facts; coverage is one fact about a person, so every statement of it must agree.",
          `persons.${ownerId}`,
          "IRC 223(b)(5)(A)",
        ),
      );
    }
    const eligibleMonthCount = months.filter((tier) => tier !== null).length;
    const age = ageAtEndOfTaxYear(person, context.taxYear);
    if (age === null) {
      indeterminate = true;
      diagnostics.push(
        diagnostic(
          "BIRTH_YEAR_OR_DATE_REQUIRED_FOR_HSA_LIMIT",
          DiagnosticSeverity.ERROR,
          "Birth year or birth date is required to determine whether the IRC 223(b)(3) additional contribution amount for an individual who attains age 55 applies.",
          `persons.${ownerId}`,
          "IRC 223(b)(3)(A)",
        ),
      );
    }

    const ownDeductible = owner.resolvedDeductible.value;
    let deductibleMissing = parameters.contributionLimitCappedByHdhpAnnualDeductible && owner.resolvedDeductible.missing;
    const missingDeductibleSpouses = new Set<string>();
    const deductibleFor = (tier: HsaCoverageTier, monthIndex: number): Money | null => {
      if (tier === "family" && familySharingApplies) {
        const resolved = familyDeductibleByMonth[monthIndex];
        if (resolved.state === "known") return resolved.value;
        if (resolved.state === "indeterminate") {
          if (resolved.missingPersonIds.length > 0) deductibleMissing = true;
          for (const personId of resolved.missingPersonIds) {
            if (personId !== ownerId) missingDeductibleSpouses.add(personId);
          }
          return null;
        }
      }
      return ownDeductible ?? null;
    };
    const annualLimitFor = (tier: HsaCoverageTier, monthIndex: number): Money => {
      const statutory = parameters.annualContributionLimit[tier === "family" ? "family" : "selfOnly"];
      if (!parameters.contributionLimitCappedByHdhpAnnualDeductible) return statutory;
      const deductible = deductibleFor(tier, monthIndex);
      if (deductible === null) {
        indeterminate = true;
        familyPoolAmountIndeterminate = true;
        return statutory;
      }
      return minMoney(deductible, statutory);
    };

    const monthlyAnnualLimits = months.map((tier, index) =>
      tier === null ? null : annualLimitFor(tier, index),
    );
    if (deductibleMissing) {
      indeterminate = true;
      familyPoolAmountIndeterminate = true;
      // One diagnostic per owner, not one per affected month: the missing fact
      // is a property of the person and their plan, not of each month it
      // reaches. Where the gap is a spouse's, name them, because the input to
      // supply lives on that spouse and not on this account.
      const spouseNote =
        missingDeductibleSpouses.size > 0
          ? ` ${[...missingDeductibleSpouses]
              .map(
                (personId) =>
                  `Spouse ${personId} stated family coverage but supplied no persons.${personId}.hsaCoverage.hdhpAnnualDeductible, which IRC 223(b)(5)(A) needs to identify the lowest family-plan deductible.`,
              )
              .join(" ")}`
          : "";
      diagnostics.push(
        diagnostic(
          "HSA_HDHP_ANNUAL_DEDUCTIBLE_REQUIRED",
          DiagnosticSeverity.ERROR,
          `For tax year ${context.taxYear} IRC 223(b)(2) limited each month to one twelfth of the lesser of the plan's annual deductible and the statutory amount, so planRules.hsa.hdhpAnnualDeductible is required. The Tax Relief and Health Care Act of 2006 section 303 removed that cap for years after 2006.${spouseNote}`,
          `persons.${ownerId}`,
          "IRC 223(b)(2)",
        ),
      );
    }

    /**
     * The IRC 223(c)(2)(A)(i) consistency check, reported on this account.
     *
     * The owner's own contradiction always reaches them. A spouse's reaches
     * them only through a *family* plan, because that is the only kind IRC
     * 223(b)(5)(A) draws into the comparison: Notice 2004-50 Q&A-31 Example (1)
     * leaves the HSA owner eligible at the full family amount where the
     * competing plan is self-only, and Example (4) makes neither spouse
     * eligible once that competing plan is family coverage.
     *
     * This fires in every year, not only the 2004-2006 years where IRC
     * 223(b)(2) read the deductible into the arithmetic. The fail-open is not
     * confined to those years: reporting the full statutory amount for a
     * taxpayer whose stated plan cannot be a high deductible health plan is the
     * same wrong answer, arrived at by ignoring the field instead of by
     * dividing by it.
     */
    const ownSubminimumDeductible = subminimumDeductibleByPerson.get(ownerId);
    const spouseSubminimumDeductibles = subminimumFamilySpousesFor(ownerId);
    if (ownSubminimumDeductible !== undefined || spouseSubminimumDeductibles.length > 0) {
      indeterminate = true;
      // Only a *family*-tier contradiction reaches the couple's shared
      // limitation. A self-only one is the stating person's own problem and
      // must not null the other spouse's IRC 223(b)(5) limit: Notice 2004-50
      // Q&A-31 Example (1) leaves the family-covered spouse contributing the
      // full amount beside a self-only plan far below the minimum, and whether
      // that spouse happens to own an HSA of their own cannot change the
      // coverage rule.
      if (
        ownSubminimumDeductible?.tier === "family" ||
        spouseSubminimumDeductibles.length > 0
      ) {
        familyPoolAmountIndeterminate = true;
      }
      const clauses: string[] = [];
      if (ownSubminimumDeductible !== undefined) {
        clauses.push(
          `This person stated ${hsaTierLabel(ownSubminimumDeductible.tier)} coverage with an annual deductible of $${ownSubminimumDeductible.stated.toLocaleString()}, below the $${ownSubminimumDeductible.minimum.toLocaleString()} IRC 223(c)(2)(A)(i) minimum for that tier in ${context.taxYear}.`,
        );
      }
      for (const [personId, entry] of spouseSubminimumDeductibles) {
        clauses.push(
          `Spouse ${personId} stated family coverage with an annual deductible of $${entry.stated.toLocaleString()}, below the $${entry.minimum.toLocaleString()} IRC 223(c)(2)(A)(i) family minimum for ${context.taxYear}, and IRC 223(b)(5)(A) draws that plan into the couple's lowest-deductible comparison.`,
        );
      }
      diagnostics.push(
        diagnostic(
          "HSA_HDHP_DEDUCTIBLE_BELOW_STATUTORY_MINIMUM",
          DiagnosticSeverity.ERROR,
          `${clauses.join(" ")} A plan whose annual deductible is below the statutory minimum is not a high deductible health plan, so the supplied facts cannot all be true. This engine does not test high deductible health plan status and does not decide eligibility here: the figure is neither raised to the minimum nor published as a ceiling, because Notice 2004-50 Q&A-31 Example (4) makes a subminimum family plan an eligibility consequence rather than a lower limitation, while Rev. Rul. 2005-25 leaves that consequence turning on whom the plan covers, which this input does not carry. Correct the deductible or the coverage tier.`,
          `persons.${ownerId}`,
          "IRC 223(c)(2)(A)(i); Notice 2004-50 Q&A-31 Example (4)",
        ),
      );
    }

    /**
     * The other spouse's eligibility, month by month, because that is what
     * decides which rule governs each month of this owner's family portion.
     * A spouse who stated nothing has no slots and is eligible throughout --
     * absence of a statement is not a statement of absence.
     *
     * Read on the candidate being computed rather than once for the owner. The
     * ordinary candidate is the sum of the monthly limits "based on eligibility
     * and HDHP coverage on the first day of each month" (Notice 2008-52), which
     * the last-month rule does not reach; only the full-contribution candidate
     * reads the deemed months.
     */
    const spouseForMonthlySplit = couple?.find((personId) => personId !== ownerId);
    const otherSpouseEligibleInMonth = (index: number, deemed: boolean): boolean =>
      spouseForMonthlySplit === undefined
        ? false
        : deemed
          ? eligibleInMonth(spouseForMonthlySplit, index)
          : actuallyEligibleInMonth(spouseForMonthlySplit, index);
    const tierPortionFrom = (
      limits: Array<Money | null>,
      tiers: Array<HsaCoverageTier | null>,
      tier: HsaCoverageTier,
      deemed: boolean,
      shared?: boolean,
    ): number =>
      limits.reduce<number>(
        (sum, value, index) =>
          tiers[index] === tier &&
          (shared === undefined || otherSpouseEligibleInMonth(index, deemed) === shared)
            ? sum + (value ?? 0)
            : sum,
        0,
      ) / HSA_MONTHS_IN_YEAR;
    const familyMonthlyAmountsFrom = (
      limits: Array<Money | null>,
      tiers: Array<HsaCoverageTier | null>,
    ): Array<Money | null> => tiers.map((tier, index) => (tier === "family" ? limits[index] : null));
    const catchUpEligible = age !== null && age >= 55;

    /**
     * One candidate's whole decomposition. Both are built by this one helper so
     * that the comparison IRC 223(b)(8) calls for is between two figures that
     * differ only in the schedule they were computed from.
     */
    const portionsFor = (
      tiers: Array<HsaCoverageTier | null>,
      deemed: boolean,
      wholeYearCatchUp: boolean,
    ): HsaCandidatePortions => {
      const limits = tiers.map((tier, index) => (tier === null ? null : annualLimitFor(tier, index)));
      const eligibleMonths = tiers.filter((tier) => tier !== null).length;
      return {
        familyPortion: tierPortionFrom(limits, tiers, "family", deemed),
        familySharedPortion: tierPortionFrom(limits, tiers, "family", deemed, true),
        familySolePortion: tierPortionFrom(limits, tiers, "family", deemed, false),
        selfPortion: tierPortionFrom(limits, tiers, "self_only", deemed),
        prorated: roundMoney(
          limits.reduce<number>((sum, value) => sum + (value ?? 0), 0) / HSA_MONTHS_IN_YEAR,
        ),
        familyMonthlyAmounts: familyMonthlyAmountsFrom(limits, tiers),
        annualLimitByMonth: limits,
        // Notice 2008-52 computes the catch-up amount the same way as the
        // limitation it accompanies: monthly in candidate (1) -- "The catch-up
        // contribution is also computed on a monthly basis" -- and whole in
        // candidate (2), where Example 5 gives a December-only eligible
        // individual the entire $900.
        catchUp: !catchUpEligible
          ? 0
          : wholeYearCatchUp
            ? roundMoney(parameters.additionalContributionAmountAge55)
            : roundMoney(
                (parameters.additionalContributionAmountAge55 * eligibleMonths) / HSA_MONTHS_IN_YEAR,
              ),
      };
    };

    const ordinaryCandidate = portionsFor(months, false, false);

    /**
     * Whether IRC 223(b)(8) reaches this owner in their own right: the rule
     * exists for the year, and December is a month of actual eligibility. That
     * is the whole test -- IRC 223(b)(8)(A) asks for nothing else.
     *
     * Neither leg carries a diagnostic, because neither is a statement of the
     * caller's that went unhonoured. A pre-2007 year and a December-ineligible
     * individual are simply cases the greater-of does not reach, and for them
     * the ordinary month-by-month limitation is not a fallback but the whole of
     * the answer.
     */
    const fullContributionRuleAvailable =
      parameters.lastMonthRuleAvailable && months[HSA_MONTHS_IN_YEAR - 1] !== null;

    /**
     * Candidate (2). The schedule comes from `deemedMonthsByPerson`, so this
     * owner's own December eligibility is not the only thing that can build
     * one: a spouse whom the rule reaches is treated as holding family coverage
     * all year, and IRC 223(b)(5)(A) then makes this owner's eligible self-only
     * months family months in the same candidate. Only an owner the rule
     * reaches in their own right earns the whole IRC 223(b)(3) amount, which is
     * why `fullContributionRuleAvailable` and not the schedule decides that.
     */
    const fullContributionCandidate = portionsFor(
      deemedMonthsByPerson.get(ownerId) ?? months,
      true,
      fullContributionRuleAvailable,
    );

    /**
     * IRC 223(b)(3) turns on age, and the two candidates carry it differently:
     * Notice 2008-52 computes it "on a monthly basis" in candidate (1) and gives
     * Example 5's December-only individual the entire $900 in candidate (2). So
     * an unknown birth year can decide the comparison as well as the amount --
     * six family months plus a self-only December is 4741.67 against 4400 under
     * 55, and 5325 against 5400 at 55 or over, which is a different winner.
     *
     * The test is not "the age is unknown". Where the rule changes no month of
     * the schedule *and* the two catch-up treatments coincide, the candidates
     * are identical figure for figure and no age reading can separate them --
     * which is the ordinary full-year case, and is why an absent birth year
     * there still publishes the schedule and the 0 that the engine declines to
     * grant as an IRC 223(b)(3) amount rather than rules out. Otherwise the
     * winner is one of two readings, and the detail would report whichever the
     * under-55 placeholder happened to pick.
     */
    if (age === null && parameters.additionalContributionAmountAge55 > 0) {
      const deemedSchedule = deemedMonthsByPerson.get(ownerId) ?? months;
      const ruleChangesNoMonth = HSA_ALL_MONTHS.every(
        (_month, index) => deemedSchedule[index] === months[index],
      );
      const catchUpTreatmentsCoincide =
        !fullContributionRuleAvailable || eligibleMonthCount === HSA_MONTHS_IN_YEAR;
      if (!(ruleChangesNoMonth && catchUpTreatmentsCoincide)) candidateSelectionUnestablished = true;
    }

    // A health FSA whose Rev. Rul. 2004-45 purpose is not stated leaves the IRC
    // 223 answer unknown rather than merely unusual: general-purpose coverage
    // is disqualifying and limited-purpose or post-deductible coverage is not,
    // and the engine cannot read a plan document to tell which this is. A
    // confident ceiling computed from a fact nobody supplied would be the bug,
    // so this is the one part of the interaction that refuses to compute.
    {
      const spouseId = spouseIdOf(ownerId);
      const own = section223FsaFacts.get(ownerId) ?? emptyHealthFsaSection223Facts();
      const spouse = spouseId === null
        ? emptyHealthFsaSection223Facts()
        : section223FsaFacts.get(spouseId) ?? emptyHealthFsaSection223Facts();
      if (own.purposeUnstated || spouse.purposeUnstated) {
        // Belt and braces: the ERROR severity below already forces the result
        // indeterminate through the ordinary rule, and the flag keeps the
        // refusal if that severity is ever softened. They are redundant on
        // purpose, so no mutation distinguishes them individually.
        indeterminate = true;
        familyPoolAmountIndeterminate = true;
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_PURPOSE_REQUIRED_FOR_HSA_INTERACTION",
            DiagnosticSeverity.ERROR,
            `A health flexible spending arrangement ${own.purposeUnstated ? "held by this individual" : "held by this individual's spouse"} states no Rev. Rul. 2004-45 purpose. A general-purpose arrangement is coverage that fails IRC 223(c)(1)(A)(ii) and a limited-purpose or post-deductible one is not, so the IRC 223 answer turns on a plan-design fact this engine cannot read and no limitation is reported. Supply planRules.healthFsa.purpose.`,
            `persons.${ownerId}`,
            "IRC 223(c)(1)(A)(ii); Rev. Rul. 2004-45",
          ),
        );
      }
    }

    // The applied figures start as candidate (1) and are moved to candidate (2)
    // only where the greater-of below chooses it, which cannot be decided here:
    // Notice 2008-52 Example 14 compares the couple's *combined* limitations,
    // so the comparison needs every owner's figures first.
    amountsByOwner.set(ownerId, {
      ordinaryCandidate,
      fullContributionCandidate,
      proratedApplied: ordinaryCandidate.prorated,
      proratedWithoutLastMonthRule: ordinaryCandidate.prorated,
      familyPortionApplied: ordinaryCandidate.familyPortion,
      familySharedPortionApplied: ordinaryCandidate.familySharedPortion,
      familySolePortionApplied: ordinaryCandidate.familySolePortion,
      familySharedPortionWithoutLastMonthRule: ordinaryCandidate.familySharedPortion,
      familySolePortionWithoutLastMonthRule: ordinaryCandidate.familySolePortion,
      familyMonthlyAmounts: ordinaryCandidate.familyMonthlyAmounts,
      selfPortionApplied: ordinaryCandidate.selfPortion,
      familyPortionWithoutLastMonthRule: ordinaryCandidate.familyPortion,
      selfPortionWithoutLastMonthRule: ordinaryCandidate.selfPortion,
      catchUpApplied: ordinaryCandidate.catchUp,
      ageKnown: age !== null,
      catchUpWithoutLastMonthRule: ordinaryCandidate.catchUp,
      appliedAnnualLimitByMonth: ordinaryCandidate.annualLimitByMonth,
      eligibleMonthCount,
      fullContributionRuleAvailable,
      fullContributionCandidateSelected: false,
      candidateSelectionUnestablished,
      diagnostics,
      indeterminate,
      familyPoolAmountIndeterminate,
    });
  }

  /**
   * IRC 223(b)(4)(A) reduces an individual's own limitation by "the aggregate
   * amount paid for such taxable year to Archer MSAs of such individual", and
   * IRC 223(b)(5)(B)(i) reduces the one family limitation by "the aggregate
   * amount paid to Archer MSAs of such spouses". Both are amounts paid, so the
   * caller supplies them on the person and no part of IRC 220 is modelled.
   */
  const archerForPerson = (personId: string): Money =>
    context.persons.get(personId)?.archerMsaContributions ?? 0;
  /**
   * IRC 223(b)(4)(C) reduces the limitation by "the aggregate amount
   * contributed to health savings accounts of such individual for such taxable
   * year under section 408(d)(9)". It is read per individual in every case, so
   * unlike the Archer amount it has no couple-wide aggregate.
   */
  const qualifiedHsaFundingFor = (personId: string): Money =>
    context.persons.get(personId)?.qualifiedHsaFundingDistributions ?? 0;
  const coupleArcherAggregate = roundMoney(
    (couple ?? []).reduce<number>((sum, personId) => sum + archerForPerson(personId), 0),
  );
  /**
   * Notice 2008-52's greater-of, taken once for the couple and once for anyone
   * outside it.
   *
   * "L and M's combined full contribution limit for 2008 is $5,800. L and M's
   * combined sum of the monthly contribution limits is $483.33 ... L and M's
   * combined annual contribution limit under section 223(b)(8) is $5,800, the
   * greater of $5,800 or $483.33." Example 14 compares the couple's combined
   * figures and divides the winner, and that order is not cosmetic. Comparing
   * per owner and then dividing lets each spouse take whichever candidate suits
   * them: a spouse eligible all year with self-only coverage keeps their
   * ordinary eleven-twelfths while the other spouse's December family election
   * carries the couple's whole family limitation, and the two accounts together
   * exceed the single limitation IRC 223(b)(5) allows.
   *
   * What is compared is the paragraph (1) limitation plus the paragraph (3)
   * amount, before IRC 223(b)(4)(C): IRC 223(b)(8) computes "the limitation
   * under paragraph (1)", and paragraph (4) reduces what that produced.
   */
  const combinedCandidateTotal = (
    pick: (amounts: HsaOwnerAmounts) => HsaCandidatePortions,
  ): Money => {
    const union = HSA_ALL_MONTHS.reduce<number>((sum, _month, index) => {
      const monthAmounts = coupleComparisonPersons
        .map((personId) => {
          const owned = amountsByOwner.get(personId);
          return owned === undefined ? null : (pick(owned).familyMonthlyAmounts[index] ?? null);
        })
        .filter((value): value is Money => value !== null);
      return monthAmounts.length === 0 ? sum : sum + Math.max(...monthAmounts);
    }, 0) / HSA_MONTHS_IN_YEAR;
    let self = 0;
    let catchUp = 0;
    for (const personId of coupleComparisonPersons) {
      const owned = amountsByOwner.get(personId);
      if (owned === undefined) continue;
      const candidate = pick(owned);
      self += candidate.selfPortion;
      catchUp += candidate.catchUp;
    }
    return roundMoney(nonnegative(union + self - coupleArcherAggregate) + catchUp);
  };
  const ownCandidateTotal = (ownerId: string, candidate: HsaCandidatePortions): Money => {
    const [base, catchUp] = subsectionBReducedBy(
      candidate.prorated,
      candidate.catchUp,
      archerForPerson(ownerId),
    );
    return roundMoney(base + catchUp);
  };
  /**
   * Where the comparison below is taken on the couple's *combined* figures, one
   * spouse's open candidate leaves the other's winner open too: the total that
   * decided it was built from both. The flag is therefore shared across the
   * spouses who hold accounts before that comparison runs.
   *
   * It is shared only where that branch is the one that runs. Spouses who share
   * no family month are compared each on their own figures -- Q&A-31 gives a
   * month only one of them is eligible in wholly to that one -- so a
   * contradiction in one of their records leaves the other's winner decided by
   * facts of their own that are not in doubt.
   */
  if (familySharingApplies && coupleComparisonPersons.some(
    (personId) => amountsByOwner.get(personId)?.candidateSelectionUnestablished === true,
  )) {
    for (const personId of coupleComparisonPersons) {
      const owned = amountsByOwner.get(personId);
      if (owned !== undefined) owned.candidateSelectionUnestablished = true;
    }
  }
  {
    const ordinary = (amounts: HsaOwnerAmounts): HsaCandidatePortions => amounts.ordinaryCandidate;
    const full = (amounts: HsaOwnerAmounts): HsaCandidatePortions => amounts.fullContributionCandidate;
    const chooseFull = new Set<string>();
    if (familySharingApplies && coupleComparisonPersons.length > 0) {
      if (combinedCandidateTotal(full) > combinedCandidateTotal(ordinary)) {
        for (const personId of coupleComparisonPersons) chooseFull.add(personId);
      }
    }
    for (const ownerId of candidatePersonIds) {
      if (familySharingApplies && coupleComparisonPersons.includes(ownerId)) continue;
      const amounts = amountsByOwner.get(ownerId);
      if (amounts === undefined) continue;
      if (ownCandidateTotal(ownerId, full(amounts)) > ownCandidateTotal(ownerId, ordinary(amounts))) {
        chooseFull.add(ownerId);
      }
    }
    for (const ownerId of chooseFull) {
      const amounts = amountsByOwner.get(ownerId);
      if (amounts === undefined) continue;
      const chosen = amounts.fullContributionCandidate;
      amounts.fullContributionCandidateSelected = true;
      amounts.proratedApplied = chosen.prorated;
      amounts.familyPortionApplied = chosen.familyPortion;
      amounts.familySharedPortionApplied = chosen.familySharedPortion;
      amounts.familySolePortionApplied = chosen.familySolePortion;
      amounts.familyMonthlyAmounts = chosen.familyMonthlyAmounts;
      amounts.selfPortionApplied = chosen.selfPortion;
      amounts.catchUpApplied = chosen.catchUp;
      amounts.appliedAnnualLimitByMonth = chosen.annualLimitByMonth;
    }
  }

  /**
   * The couple-wide ceiling on family-month capacity: no division of the one
   * family limit can put more than the largest refigured family limitation
   * into the two HSAs combined. Each spouse divides their *own* refigured
   * amount (Form 8889 line 6, Steps 1-4), which is what
   * `sharedFamilyContributionLimit` reports per owner; this maximum is the
   * aggregate guard, and self-only months are added to it undivided.
   */
  /**
   * The couple's family-month capacity, taken as the union of their family
   * months rather than the largest single spouse's year.
   *
   * A maximum was right only while the spouses' family months were the same set
   * or one contained the other, which is what the annual model guaranteed. Once
   * Q&A-31 is applied month by month it no longer holds: two spouses each
   * covered and eligible for a disjoint half of the year are each the sole
   * eligible individual for their own six months, so each takes 4375 and the
   * couple takes 8750 -- while the maximum of their two annual portions is 4375
   * and let the first account by priority exhaust the pool.
   *
   * So each month contributes its family amount once, to whichever spouse or
   * spouses held family coverage in it. Where both did, IRC 223(b)(5)(A) has
   * already reduced the two plans to the one with the lowest annual deductible,
   * so the month's amount is the same figure either way. Where the months
   * coincide entirely this is the old maximum exactly.
   */
  const householdFamilyMonthlyUnion = HSA_ALL_MONTHS.reduce<number>((sum, _month, index) => {
    const monthAmounts = couplePoolPersons
      .map((personId) => amountsByOwner.get(personId)?.familyMonthlyAmounts[index] ?? null)
      .filter((value): value is Money => value !== null);
    return monthAmounts.length === 0 ? sum : sum + Math.max(...monthAmounts);
  }, 0) / HSA_MONTHS_IN_YEAR;
  // IRC 223(b)(5)(B)(i) reduces the couple's one limitation by their aggregate
  // Archer MSA contributions before it is divided, exactly as it does each
  // spouse's own portion.
  const rawSharedFamilyLimit = familySharingApplies
    ? nonnegative(householdFamilyMonthlyUnion - coupleArcherAggregate)
    : null;
  const sharedFamilyLimit = rawSharedFamilyLimit === null ? null : roundMoney(rawSharedFamilyLimit);
  const householdParagraph1AfterArcher = familySharingApplies
    ? nonnegative(householdFamilyMonthlyUnion + couplePoolPersons.reduce(
        (sum, id) => sum + (amountsByOwner.get(id)?.selfPortionApplied ?? 0), 0,
      ) - coupleArcherAggregate)
    : null;
  /**
   * True where any spouse who holds an HSA has an undeterminable limitation of
   * their own, which makes the IRC 223(b)(5) aggregate built from those
   * limitations undeterminable too.
   */
  const householdPoolAmountIndeterminate = couplePoolPersons.some(
    (personId) => amountsByOwner.get(personId)?.familyPoolAmountIndeterminate === true,
  );
  /**
   * The other question, asked separately. IRC 223(b)(5)(B)(ii) divides one
   * limitation between the spouses, so a couple whose stated division is itself
   * unsettled leaves *the division* undeterminable while the amount being
   * divided stays exactly as computable as it was: subparagraph (A) fixes that
   * amount from coverage facts, which an unsettled division does not touch.
   *
   * `unknown`, `disputed` and `inconsistent` are the three ways the caller can
   * say it is unsettled; `statutory_equal` and `agreed` both settle it.
   */
  const divisionUnsettled =
    context.hsaFamilyLimitDivision.status === "unknown" ||
    context.hsaFamilyLimitDivision.status === "disputed" ||
    context.hsaFamilyLimitDivision.status === "inconsistent";
  /**
   * Between spouses who are *eligible individuals*, which is neither the whole
   * couple nor the account owners.
   *
   * The qualification is administrative, not statutory, and the distinction
   * matters for anyone checking this against the Code. IRC 223(b)(5) opens "In
   * the case of individuals who are married to each other, if either spouse has
   * family coverage" -- one condition, about coverage, and nothing in those
   * words about both spouses being eligible individuals. Subparagraph (A) then
   * deems both spouses to have only that family coverage, and (B)(ii) divides
   * the reduced limitation equally "unless they agree on a different division".
   * Read on the statute alone the division would run between the two spouses
   * whatever their eligibility.
   *
   * The IRS reads it otherwise, and that reading is what this follows. Notice
   * 2004-50 Q&A-31: "if only one spouse is an eligible individual, only that
   * spouse may contribute to an HSA (notwithstanding the treatment under
   * section 223(b)(5)(A) of both spouses as having only family coverage)", with
   * Example (1) giving H the whole 5000 because W's plan is not a high
   * deductible health plan. Notice 2008-59 Q&A-16 says the same from the other
   * side: no part of the family contribution may be allocated to a spouse who
   * is not otherwise an eligible individual. The "notwithstanding" is the
   * load-bearing word -- subparagraph (A)'s deeming does not make an ineligible
   * spouse eligible for this purpose.
   *
   * Computed before the stated division is consulted, and the ordering is the
   * whole point. Where only one spouse is an eligible individual there is
   * nothing for (B)(ii) to divide, so neither the equal default nor an
   * agreement displacing it has any work to do. Deciding eligibility inside the
   * statutory-equal branch instead made an agreed 0.5 halve the sole eligible
   * spouse's limitation, and made an unsettled division null a share that no
   * division could have moved.
   *
   * Only a spouse the caller has positively placed outside eligibility is
   * excluded: `hsaCoverage: {}` records that this person held no high deductible
   * health plan coverage in any month, so every resolved slot is "none" and
   * there is no month in which they could be an eligible individual. A spouse
   * who stated nothing at all has no slots and is not excluded -- absence of a
   * statement is not a statement of absence, and subparagraph (A) deems them
   * covered -- and neither is a spouse eligible in even one month, who holds a
   * share of their own.
   *
   * A spouse whose stated eligibility is *contradicted* rather than denied is a
   * third case and is not decided here: that is the impeached-assertion path
   * below, which leaves the division indeterminate rather than resolving it
   * either way.
   */
  const familyMonthIndexes = HSA_ALL_MONTHS.map((_, index) => index).filter(
    (index) => familyMonth[index],
  );
  /**
   * Whether this person is an eligible individual in one particular month. A
   * spouse who stated nothing has no slots and is not excluded in any month --
   * absence of a statement is not a statement of absence, and subparagraph (A)
   * deems them covered.
   */
  /**
   * Eligibility is resolved month by month. Shared family months are divided,
   * sole-eligible months remain whole, and self-only portions remain undivided.
   * An Archer reduction whose placement among those portions is unestablished
   * keeps the allocation indeterminate while the household base is reduced once.
   */
  /**
   * The one case the monthly split cannot decide, held apart from the split
   * itself. IRC 223(b)(5)(B)(i) reduces the paragraph (1) limitation by the
   * spouses' aggregate Archer MSA contributions and (ii) divides what survives.
   * Where some family months are shared and others are the sole eligible
   * spouse's, which of them the reduction consumed decides this owner's share
   * -- and neither the statute, which never segments by month, nor Q&A-31 and
   * Q&A-32, which never mention Archer MSAs, says which. So the division is
   * reported unestablished rather than computed from an invented apportionment.
   * With no Archer MSA contribution there is nothing to apportion, which is
   * every scenario but this one.
   */
  let archerAcrossMixedFamilyMonths = false;
  /**
   * The same reduction, unapportionable for a different reason: it would come
   * out of *both* spouses' undivided months. Held apart from
   * `archerAcrossMixedFamilyMonths` because the two are withheld under
   * different conditions -- a mixed owner's problem is which of their own
   * months a *share* reaches, which cannot arise unless some month is shared,
   * while this one arises exactly when none is.
   */
  let archerAcrossUndividedSpouses = false;
  const eligibleSpouses = familySharingApplies
    ? (couple ?? coupleMembersWithAccounts).filter((personId) =>
        HSA_ALL_MONTHS.some((_, index) => eligibleInMonth(personId, index)),
      )
    : [];
  const soleEligibleSpouse = familySharingApplies && eligibleSpouses.length < 2;
  /**
   * An unsettled division is an unknown only while there is a division to be
   * unsettled about. Where one spouse is the sole eligible individual the whole
   * limitation is theirs under Q&A-31 whatever the couple did or did not agree,
   * so `unknown`, `disputed` and `inconsistent` all describe a question the
   * statute never reaches. This is the same principle as `nothingLeftToDivide`
   * below, one condition earlier: doubt that cannot move an answer is not a
   * reason to withhold one.
   */
  const householdDivisionIndeterminate = divisionUnsettled && !soleEligibleSpouse;
  /**
   * Eligibility, including that of a spouse without an HSA, determines the
   * monthly division. Account ownership does not establish or remove a legal share.
   */
  const familyPoolKey = couple ? `${couple[0]}|${couple[1]}` : null;

  /**
   * The IRC 223(b)(5)(B)(ii) division, taken from the one place it can be
   * stated. Omitted means `statutory_equal`: the statute divides equally
   * "unless they agree on a different division", so silence is the default rule
   * rather than a missing fact, and the Instructions for Form 8889 say the same
   * -- "divide the amount on line 5 equally between you and your spouse, unless
   * you both agree on a different allocation".
   *
   * The three non-numeric statuses are why this is a status rather than a
   * nullable number. Failing to establish the agreement is not the same input
   * state as establishing its absence: contradictory records are equally
   * consistent with "they agreed equally and one is wrong" and "they agreed
   * 25/75 and the other is wrong", and defaulting those to an equal split would
   * overstate one spouse's limitation in the second case.
   */
  const division: HsaFamilyLimitDivisionInput =
    context.hsaFamilyLimitDivision;
  const shareByOwner = new Map<string, number>();
  const sharingDiagnostics: Diagnostic[] = [];
  /**
   * Which branch of the division applied. The two INFO branches announce a
   * division the engine settled on the caller's behalf, so they must not be
   * emitted where the division turns out to be unknown -- an account cannot be
   * told both that the limit was divided equally by default and that the
   * division is indeterminate with a null share. Whether it is unknown is not
   * decided until `divisionEligibilityDoubtPersons` below, which reads the
   * shares, so the branch is recorded here and reported afterwards.
   */
  let defaultedDivision: "equally" | "equally_sole_account" | "sole_eligible_spouse" | null = null;
  /**
   * Whether the caller stated a division that the statute never reached. Held
   * separately from `defaultedDivision` because it is a fact about the *input*,
   * not about which branch computed the shares: the sole-eligible branch runs
   * identically whether or not a division was supplied, and only a caller who
   * supplied one needs to be told it did nothing.
   */
  let statedDivisionInoperative = false;
  if (familySharingApplies) {
    /**
     * One number, not one per account: a share is a share of the couple's
     * single limitation, so the other spouse takes the remainder. That deletes
     * three diagnostics the account-level model needed -- a share supplied by
     * only one spouse, shares totalling more than one, and shares totalling
     * less -- because none of those states can be expressed any more.
     *
     * Where only one spouse owns an HSA the statutory division still gives them
     * half; the other half is their spouse's and goes unused for want of an
     * account. Only an agreement moves it, which is the point of
     * `HSA_SOLE_SPOUSE_ACCOUNT_TAKES_ONLY_ITS_EQUAL_SHARE`.
     */
    const taxpayerId = (couple ?? coupleMembersWithAccounts).find(
      (personId) => context.persons.get(personId)?.role === "taxpayer",
    );
    if (soleEligibleSpouse) {
      /**
       * There is nothing here for IRC 223(b)(5)(B)(ii) to divide. Notice
       * 2004-50 Q&A-31 gives the whole limitation to the sole eligible spouse
       * -- Example (1) has H contribute the entire 5000 while W, whose plan is
       * not a high deductible health plan, contributes nothing -- and Notice
       * 2008-59 Q&A-16 forbids allocating any part of it to the other. The
       * statute's own opening words condition the special rule only on "if
       * either spouse has family coverage"; the both-eligible qualification is
       * the IRS reading of it, and it is that reading this implements.
       *
       * Whatever the caller said about the division is therefore beside the
       * point rather than wrong, and is neither honoured nor treated as a
       * contradiction: an agreed 0.5 does not halve this limitation, and an
       * `unknown`, `disputed` or `inconsistent` status does not make a share
       * unstatable that the statute fixes at the whole. A caller who supplied
       * one is told so by HSA_FAMILY_LIMIT_DIVISION_INOPERATIVE below rather
       * than left to infer it from an unchanged number.
       */
      for (const personId of couple ?? coupleMembersWithAccounts) {
        shareByOwner.set(personId, eligibleSpouses.includes(personId) ? 1 : 0);
      }
      defaultedDivision = "sole_eligible_spouse";
      statedDivisionInoperative = division.status !== "statutory_equal";
    } else if (division.status === "agreed") {
      // Notice 2004-50 Q&A-32 lets the spouses divide "in any way they want,
      // including allocating nothing to one spouse", so an agreed share binds
      // whether or not the other spouse owns an HSA. A sole owner who agreed to
      // less than the whole limitation keeps that agreement; the remainder is
      // the other spouse's to use or not, and is not forfeited to this account.
      // Every spouse, not only those with accounts. An agreed taxpayerShare of
      // 1 gives the other spouse a share of exactly 0, and that zero is what
      // makes a contradiction in their eligibility immaterial -- both readings
      // then give the taxpayer the whole limitation. Leaving them out of the map
      // left `undefined`, which the doubt test read as a non-zero share and
      // withheld an answer the record fully supports. Results are still emitted
      // only for account owners.
      for (const personId of couple ?? coupleMembersWithAccounts) {
        shareByOwner.set(
          personId,
          personId === taxpayerId ? division.taxpayerShare : 1 - division.taxpayerShare,
        );
      }
    } else if (division.status === "statutory_equal") {
      /**
       * Divided between *the spouses*, not between the spouses who happen to
       * own an HSA. IRC 223(b)(5)(B)(ii) divides the limitation "equally between
       * them", and "them" is "individuals who are married to each other" from
       * the opening clause of paragraph (5) -- a phrase about a marriage, not
       * about a pair of accounts. Owning an HSA is not a condition of being an
       * eligible individual under IRC 223(c)(1), so a spouse with family
       * coverage and no account still holds their half; they simply have
       * nowhere to put it.
       *
       * So the divisor is the size of the couple, not the number of accounts.
       * A sole owner takes 4375 of an 8750 limitation under the statutory
       * division, and reaches the whole 8750 only through an agreement, which
       * Notice 2004-50 Q&A-32 expressly lets the spouses make -- "including
       * allocating nothing to one spouse". Reading ownership as that agreement
       * would make the agreement mechanism unnecessary in the one case it is
       * most often needed, and would contradict a caller who has just said in
       * so many words that no different division was agreed.
       *
       * Both spouses are eligible individuals here -- the sole-eligible case
       * was decided above, before the division was consulted -- so the divisor
       * is `eligibleSpouses.length` with no guard needed against zero.
       */
      const spouses = eligibleSpouses.length;
      for (const personId of couple ?? coupleMembersWithAccounts) {
        // An ineligible spouse who nonetheless owns an HSA takes no share of the
        // couple's limitation; Q&A-31 lets only the eligible spouse contribute.
        shareByOwner.set(personId, eligibleSpouses.includes(personId) ? 1 / spouses : 0);
      }
      defaultedDivision =
        spouses > coupleMembersWithAccounts.length ? "equally_sole_account" : "equally";
    }
  }

  /**
   * A second reason the division can be unknown, and it is not the couple's own
   * statement of it. IRC 223(b)(5)(B)(ii) divides the limitation between the
   * spouses, but Notice 2004-50 Q&A-31 is explicit that the division
   * presupposes two eligible individuals: "if only one spouse is an eligible
   * individual, only that spouse may contribute to an HSA (notwithstanding the
   * treatment under section 223(b)(5)(A) of both spouses as having only family
   * coverage)". Example (1) of that Q&A works it -- H contributes the whole
   * 5000 while W, whose plan is not a high deductible health plan, contributes
   * nothing.
   *
   * Ordinarily the caller's month list *is* the eligibility assertion and the
   * division follows from it, which is why this engine can divide without
   * testing IRC 223(c)(1). A subminimum deductible is precisely the case where
   * that assertion is contradicted by another fact from the same caller, so the
   * engine cannot tell whether the couple's limitation belongs wholly to the
   * coherent spouse or is shared with them. Reporting half would assert the
   * eligibility this check has just called into question.
   *
   * Except where the doubt cannot change the answer, which is why this reads
   * the shares. A doubted spouse whose share is already 0 gets nothing on
   * either reading: nothing because the couple agreed to allocate them nothing,
   * and nothing because Q&A-31 would give the whole limitation to the other
   * spouse. The other spouse holds the remaining 1 either way, for the same two
   * reasons. Both branches agree on both shares, so there is nothing left for
   * the doubt to make unknowable and nulling the pair would withhold a division
   * the engine can state. Only an exactly-zero share qualifies: at 0.01 the two
   * readings differ.
   *
   * The *amount* is untouched, and deliberately so: a self-only plan never
   * competes for the lowest family deductible, so the pool keeps reporting its
   * number while the division above it goes unstated. Any tier counts here,
   * unlike the amount test, because eligibility is what is in doubt and a
   * self-only contradiction impeaches it just as well.
   *
   * Every spouse is asked, not only those who own a health savings account.
   * This once scanned the account owners on the ground that a spouse without an
   * account receives no share, so their contradiction could make no division
   * unknowable. That ground is gone: the divisor is the size of the couple, and
   * an eligible spouse with no account holds their half and halves the owner's
   * limitation by holding it. Their eligibility is therefore an operand of the
   * owner's share, and a contradiction in it is exactly as disabling as one in
   * the owner's own.
   *
   * The narrower scan let a whole reading of the facts go unreported. A spouse
   * with no account, a stated self-only high deductible health plan and a
   * deductible below the IRC 223(c)(2)(A)(i) minimum was counted as eligible
   * because a coverage slot said so, while the fact contradicting that slot was
   * never consulted -- so the owner was told a determinate half of the
   * limitation when Q&A-31 gives them the whole of it on the other reading. Two
   * materially different completions, one reported as settled.
   */
  /**
   * Whether a doubted spouse's eligibility can move any owner's answer.
   *
   * The same immateriality test the exactly-zero share already applies, asked
   * of the monthly split instead of the share. A spouse's eligibility is an
   * operand only of the months it makes *shared*; where an owner's family
   * months are all months in which that spouse holds no coverage at all, both
   * readings of the spouse's contradicted plan give the owner the same whole
   * months, and withholding the answer would refuse a figure the record fully
   * supports. An owner's own contradiction always matters.
   */
  const eligibilityDoubtIsMaterial = (doubtedId: string): boolean =>
    coupleMembersWithAccounts.some((ownerId) =>
      ownerId === doubtedId
        ? true
        : (amountsByOwner.get(ownerId)?.familySharedPortionApplied ?? 0) > 0,
    );
  /**
   * A spouse about whom nothing was said is not the same as a spouse said to
   * hold nothing.
   *
   * `persons[].hsaCoverage` of `{}` states affirmatively that this person held
   * no high deductible health plan coverage in any month, and the engine acts on
   * it. Omitting the field states nothing, and the two completions differ by the
   * whole division: the taxpayer takes half under IRC 223(b)(5)(B)(ii) if the
   * spouse is an eligible individual, and all of it under Notice 2004-50 Q&A-31
   * if they are not, with Notice 2008-59 Q&A-16 forbidding any allocation to
   * them. Reading silence as eligibility picked one of those and reported it as
   * settled.
   *
   * Subparagraph (A)'s deeming does not fill the gap. It treats both spouses as
   * having family coverage, and Q&A-31 is express that this treatment does not
   * itself make an ineligible spouse eligible -- "notwithstanding the treatment
   * under section 223(b)(5)(A)" is the whole point of the sentence.
   */
  const divisionEligibilityUnknownPersons = familySharingApplies
    ? (couple ?? []).filter(
        (personId) =>
          coverageSlotsByPerson.get(personId) === undefined &&
          shareByOwner.get(personId) !== 0 &&
          eligibilityDoubtIsMaterial(personId),
      )
    : [];
  const divisionEligibilityDoubtPersons = familySharingApplies
    ? (couple ?? coupleMembersWithAccounts).filter(
        (personId) =>
          subminimumDeductibleByPerson.has(personId) &&
          shareByOwner.get(personId) !== 0 &&
          eligibilityDoubtIsMaterial(personId),
      )
    : [];
  /**
   * A spouse whose own statements disagree about whether they were an eligible
   * individual at all, which is a third way the division can fail and was not
   * one of the two above: something was said, so `coverageSlotsByPerson` holds
   * a projection, and no deductible was impeached.
   *
   * `eligibleInMonth` reads an unresolved slot as eligible, which is the right
   * reading for computing a limitation the conflict has already made
   * indeterminate but the wrong one for choosing a division branch. It put both
   * spouses in `eligibleSpouses` and announced
   * HSA_FAMILY_LIMIT_DIVIDED_EQUALLY_BY_DEFAULT over an input one of whose
   * coherent completions gives the whole limitation to the other spouse under
   * Q&A-31 instead. The maximum was already withheld; the INFO asserted the
   * branch anyway.
   *
   * Only an eligibility disagreement counts. Two accounts differing on the tier
   * agree that the person was eligible, and so do two differing only on a
   * deductible a post-2006 year never reads -- neither moves the division, and
   * treating either as an eligibility doubt would refuse a couple an answer
   * their facts fix.
   */
  const divisionEligibilityConflictPersons = familySharingApplies
    ? (couple ?? coupleMembersWithAccounts).filter((personId) => {
        const eligibility = eligibilityStatusByPerson.get(personId);
        return (
          eligibility !== undefined &&
          eligibility.some((slot) => slot === "unknown") &&
          shareByOwner.get(personId) !== 0 &&
          eligibilityDoubtIsMaterial(personId)
        );
      })
    : [];
  /**
   * A division is only ever a fact about *something*. IRC 223(b)(5)(B)(ii)
   * divides "the limitation under paragraph (1) ... after such reduction", and
   * where that reduced limitation is zero every division of it is the same
   * division: nought to each spouse, however they agreed or failed to agree.
   * An unsettled share cannot move a result that no share can change, so it is
   * not reported and it nulls nothing.
   *
   * This is the same principle as the exactly-zero-share case above, one level
   * up: there the doubt could not move *these two* shares, here it cannot move
   * *any* share. Both exist because an unknown that cannot change an answer is
   * not an unknown worth withholding an answer for -- and the engine has
   * previously withheld one, returning a null maximum for two spouses whose
   * whole 8750 limitation had already been consumed by Archer MSA
   * contributions under subparagraph (B)(i) and whose every possible division
   * therefore yielded zero.
   *
   * `null` is not zero and does not qualify: an undeterminable amount is
   * exactly the case where the engine cannot say the division is harmless.
   */
  const nothingLeftToDivide = !householdPoolAmountIndeterminate &&
    householdParagraph1AfterArcher !== null && householdParagraph1AfterArcher <= 0;
  /**
   * The same immateriality, asked of the portion a *share* actually multiplies.
   *
   * IRC 223(b)(5)(B)(ii) divides the family limitation; the spouses'
   * self-only-month limitations sit beside it undivided, which is why
   * `nothingLeftToDivide` above has to read the whole paragraph (1) residue for
   * the one question that turns on it -- an Archer MSA aggregate large enough
   * to run past the family months and into both spouses' self-only ones has to
   * be placed somewhere, and that placement is unsettled while any of it
   * remains to place.
   *
   * Every other doubt about the division moves nothing but the family portion,
   * so the whole-residue test over-refuses on it. Two spouses whose shared
   * family months the aggregate exactly exhausts, each with a self-only month
   * of their own left over, have a positive household residue and a family
   * residue of nought: the unknown share divides nothing, and both maxima are
   * their own undivided self-only months whatever the spouses agreed. The
   * engine withheld both of them.
   *
   * Each owner's own family portion is bounded by the union this is taken from,
   * so a union the aggregate has exhausted leaves every owner nothing for a
   * share to reach -- which is what makes the household test sufficient for the
   * owners' figures.
   */
  const noDivisibleFamilyResidue = !householdPoolAmountIndeterminate &&
    sharedFamilyLimit !== null && sharedFamilyLimit <= 0;
  /**
   * Whether the division was ever established, asked without reference to
   * whether it mattered. `nothingLeftToDivide` says the unknown cannot move the
   * *amount*; it does not turn an unestablished share into an established one.
   * Conflating the two published `familyLimitShare: 1` for both spouses of a
   * couple whose division was `unknown` and whose limitation the Archer MSA
   * reduction had already exhausted -- two shares of a single limitation
   * totalling 2, contradicting the input that said the division was unknown and
   * the field's own semantics at once. The maximum may stay determinate on the
   * strength of every share yielding the same zero; the share may not, because
   * no share was ever established.
   */
  if (familySharingApplies && coupleArcherAggregate > 0) {
    const mixed = (shared: number, total: number): boolean => shared > 0 && shared < total;
    /**
     * Whether the one aggregate reduction would come out of *this* spouse's
     * undivided capacity.
     *
     * IRC 223(b)(5)(B)(i) reduces the couple's single limitation once, and the
     * division that follows is what makes a single subtraction come out right:
     * each spouse subtracts the aggregate from the shared portion and takes a
     * share of the remainder, so the shares put the reduction back together
     * exactly once. Nothing does that for a portion no share touches. A
     * sole-eligible spouse's family months, and any residue that runs past the
     * family portion into self-only months, are each subtracted whole from that
     * spouse alone -- so where two spouses both have such a portion, the same
     * aggregate is charged twice and the couple loses capacity that no rule
     * took from them.
     *
     * Which spouse's undivided months the reduction actually consumed decides
     * both their shares, and the statute never segments by month while Q&A-31
     * and Q&A-32 never mention Archer MSAs. So this is reported unestablished
     * rather than apportioned by invention, exactly as the mixed case is.
     */
    const absorbsUndivided = (family: number, shared: number, self: number): boolean =>
      family - shared > 0 || (coupleArcherAggregate > family && self > 0);
    // Both candidates, because the counterfactual feeds the IRC 223(b)(8)(B)
    // attributable amount and rests on the same apportionment. A last-month
    // candidate can be homogeneous while the ordinary one is mixed, and
    // checking only the applied decomposition would leave the testing-period
    // figure resting on the very apportionment this refuses to invent.
    const decompositions: Array<(owned: HsaOwnerAmounts) => [number, number, number]> = [
      (owned) => [
        owned.familyPortionApplied,
        owned.familySharedPortionApplied,
        owned.selfPortionApplied,
      ],
      (owned) => [
        owned.familyPortionWithoutLastMonthRule,
        owned.familySharedPortionWithoutLastMonthRule,
        owned.selfPortionWithoutLastMonthRule,
      ],
    ];
    for (const decompose of decompositions) {
      let absorbers = 0;
      for (const personId of couplePoolPersons) {
        const owned = amountsByOwner.get(personId);
        if (owned === undefined) continue;
        const [family, shared, self] = decompose(owned);
        if (mixed(shared, family)) archerAcrossMixedFamilyMonths = true;
        if (absorbsUndivided(family, shared, self)) absorbers += 1;
      }
      if (absorbers >= 2) archerAcrossUndividedSpouses = true;
    }
  }
  const householdDivisionUnestablished =
    householdDivisionIndeterminate ||
    divisionEligibilityDoubtPersons.length > 0 ||
    divisionEligibilityUnknownPersons.length > 0 ||
    divisionEligibilityConflictPersons.length > 0 ||
    archerAcrossMixedFamilyMonths ||
    archerAcrossUndividedSpouses;
  /**
   * Whether any month is actually shared. An unestablished division can only
   * withhold an *amount* where some amount is subject to it: two spouses
   * eligible in disjoint halves of the year each take their own months whole
   * under Q&A-31, so no share of any month is in question and both answers
   * stand. `familyLimitShare` is still null -- no share was established -- but
   * the maximum beside it is a figure, which is the same separation the
   * zero-limitation case already draws.
   */
  const someFamilyMonthIsShared = coupleMembersWithAccounts.some((personId) => {
    const owned = amountsByOwner.get(personId);
    if (owned === undefined) return false;
    return owned.familySharedPortionApplied > 0 || owned.familySharedPortionWithoutLastMonthRule > 0;
  });
  /**
   * Whether any owner-specific figure turns on that unestablished division.
   *
   * `someFamilyMonthIsShared` asks whether a *share* is in question, which is
   * the right test for every unestablished division but one. Where the one
   * aggregate Archer MSA reduction would be subtracted from both spouses'
   * undivided months, the question is not whose share a month falls in but
   * whose months the reduction came out of -- and that question exists only
   * because no month is shared. Requiring a shared month would have withheld
   * nothing and left each spouse charged the whole aggregate, so the couple's
   * two accounts together fell a full aggregate short of the one limitation
   * the IRC 223(b)(5) pool beside them still reported.
   */
  const divisionShareInQuestion =
    archerAcrossUndividedSpouses || (someFamilyMonthIsShared && householdDivisionUnestablished);
  /**
   * Whether that unestablished division withholds the *amount*. Only here does
   * immateriality count, and it is the narrower question of the two.
   *
   * Each cause is measured against the residue it could actually move, because
   * the two causes reach different money. A doubtful share reaches only the
   * divided family portion; an Archer MSA aggregate whose placement is open
   * reaches the spouses' undivided self-only months as well, which is exactly
   * why it needed the wider residue and why the wider residue cannot stand in
   * for both.
   */
  const householdDivisionUnknown =
    (archerAcrossUndividedSpouses && !nothingLeftToDivide) ||
    (someFamilyMonthIsShared && householdDivisionUnestablished && !noDivisibleFamilyResidue);
  /**
   * Whether a settled division is worth announcing. Same test: where nothing is
   * left to divide, saying how it was divided is noise about nought, and where
   * the division did not settle the INFO would contradict the ERROR beside it.
   */
  const eligibilityBranchEstablished = divisionEligibilityUnknownPersons.length === 0 &&
    divisionEligibilityConflictPersons.length === 0 && divisionEligibilityDoubtPersons.length === 0;
  const divisionIsReportable = !householdDivisionUnknown && !nothingLeftToDivide && eligibilityBranchEstablished;

  if (familySharingApplies && householdPoolAmountIndeterminate) {
    // IRC 223(b)(5)(A) gives the spouses one family limitation and (B)(ii)
    // divides it between them, so each share is a function of facts belonging to
    // both. A spouse whose own coverage is coherent still cannot be told their
    // share of a limitation the couple's facts do not fix. Nulling the pool
    // alone was not enough: the pool went null while the accounts drawing on it
    // stayed determinate and kept reporting a maximum they could never allocate.
    sharingDiagnostics.push(
      diagnostic(
        "HSA_SHARED_FAMILY_LIMIT_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        "IRC 223(b)(5) gives the spouses one family limitation to divide, so it is no more determinable than the coverage facts of either of them. Another spouse's health savings account coverage facts are missing or conflicting, so this account's share of that limitation cannot be stated either.",
        "accounts",
        "IRC 223(b)(5)",
      ),
    );
  }
  /**
   * The division, reported separately from the amount and in different words.
   * `HSA_SHARED_FAMILY_LIMIT_INDETERMINATE` says the limitation itself cannot
   * be stated, which is false here: the couple's ceiling is a number and the
   * IRC 223(b)(5) pool reports it. What is unknown is how much of that number
   * belongs to each account, so every account drawing on the pool still has a
   * null maximum -- a share of a known amount is unknown when the share is --
   * and this is an ERROR for that reason rather than a note.
   */
  if (familySharingApplies && householdDivisionUnknown) {
    // Two causes, reported in different words because they call for different
    // corrections: an unsettled division is fixed by settling it, an impeached
    // eligibility assertion by correcting the deductible or the tier.
    const unsettledCause: Record<string, string> = {
      unknown: "hsaFamilyLimitDivision reports that whether the spouses agreed a different division is not known",
      disputed: "hsaFamilyLimitDivision reports that the spouses state different divisions",
      inconsistent: "hsaFamilyLimitDivision reports that two records of the spouses' division conflict",
    };
    const unstatedCause = `${divisionEligibilityUnknownPersons
      .map((personId) => `Person ${personId}`)
      .join(" and ")} supplied no persons[].hsaCoverage at all, so whether they are an eligible individual is unstated rather than known. The two readings give this account different answers: IRC 223(b)(5)(B)(ii) divides the limitation equally if that spouse is an eligible individual, and Notice 2004-50 Q&A-31 gives the whole of it to the other spouse if they are not -- "if only one spouse is an eligible individual, only that spouse may contribute to an HSA (notwithstanding the treatment under section 223(b)(5)(A) of both spouses as having only family coverage)" -- with Notice 2008-59 Q&A-16 forbidding any allocation to a spouse who is not otherwise eligible. Supply that spouse's coverage months, or persons[].hsaCoverage of {} to state that they held none.`;
    const conflictingEligibilityCause = `${divisionEligibilityConflictPersons
      .map((personId) => `Person ${personId}`)
      .join(" and ")} supplied coverage records that disagree about whether they were an eligible individual at all, one stating coverage in a month another states none for. The two readings give this account different answers: IRC 223(b)(5)(B)(ii) divides the limitation equally if that spouse is an eligible individual, and Notice 2004-50 Q&A-31 gives the whole of it to the other spouse if they are not -- "if only one spouse is an eligible individual, only that spouse may contribute to an HSA (notwithstanding the treatment under section 223(b)(5)(A) of both spouses as having only family coverage)". A disagreement about the coverage *tier* would not do this, because both statements would still assert an eligible individual; this one denies there was one. Reconcile those records.`;
    const monthlyCause =
      'A spouse is an eligible individual in some of the family-coverage months and not in others, and the spouses also made Archer MSA contributions. Those two facts together have no determinable answer here. Notice 2004-50 Q&A-31 gives a month in which only one spouse is an eligible individual wholly to that spouse, while a month in which both are is divided under IRC 223(b)(5)(B)(ii), so the months are of two kinds; IRC 223(b)(5)(B)(i) then reduces the limitation by "the aggregate amount paid to Archer MSAs of such spouses for the taxable year" before that division, and which kind of month the reduction consumed decides this share. The statute never segments by month and Q&A-31 and Q&A-32 never mention Archer MSAs, so nothing settles the apportionment and the engine will not invent one. The limitation itself is unaffected. Remove the Archer MSA contributions from the scenario, or state family coverage months over which both spouses\' eligibility is constant.';
    const undividedCause =
      'Each spouse has family-coverage months in which the other is not an eligible individual, and the spouses also made Archer MSA contributions. Those two facts together have no determinable answer here. Notice 2004-50 Q&A-31 gives a month in which only one spouse is an eligible individual wholly to that spouse, so neither spouse\'s months are reached by the IRC 223(b)(5)(B)(ii) division; IRC 223(b)(5)(B)(i) then reduces the couple\'s single limitation by "the aggregate amount paid to Archer MSAs of such spouses for the taxable year" once, and nothing says out of which spouse\'s undivided months that one reduction came. Charging it to each of them subtracts it twice and loses the couple capacity no rule took away, so the limitation is reported and its allocation is not. The statute never segments by month and Q&A-31 and Q&A-32 never mention Archer MSAs, so the engine will not invent the apportionment. Remove the Archer MSA contributions from the scenario, or state family coverage months over which both spouses are eligible individuals.';
    const shareCause = `${
      unsettledCause[context.hsaFamilyLimitDivision.status] ?? "hsaFamilyLimitDivision is not settled"
    }, so no account's share of the limitation can be stated. Settle it as { status: "statutory_equal" } or { status: "agreed", taxpayerShare }.`;
    const eligibilityCause = `${divisionEligibilityDoubtPersons
      .map((personId) => `Person ${personId}`)
      .join(" and ")} stated an annual deductible below the IRC 223(c)(2)(A)(i) minimum for coverage they are also stated to hold, and Notice 2004-50 Q&A-31 divides the limitation only between spouses who are each an eligible individual: "if only one spouse is an eligible individual, only that spouse may contribute to an HSA". The month list supplied for that person asserts eligibility their own deductible contradicts, so the engine cannot tell whether this limitation belongs wholly to the other spouse, as in Example (1) of that Q&A, or is divided. Correct the deductible or the coverage tier.`;
    sharingDiagnostics.push(
      diagnostic(
        "HSA_FAMILY_LIMIT_DIVISION_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        `IRC 223(b)(5)(B)(ii) divides the single family limitation between the spouses as they agree. ${
          divisionEligibilityUnknownPersons.length > 0
            ? unstatedCause
            : divisionEligibilityConflictPersons.length > 0
            ? conflictingEligibilityCause
            : archerAcrossMixedFamilyMonths
            ? monthlyCause
            : archerAcrossUndividedSpouses
            ? undividedCause
            : householdDivisionIndeterminate
              ? shareCause
              : eligibilityCause
        }${
          // Only where the limitation really is still reported. Where the
          // couple's coverage facts left the amount itself undeterminable, the
          // IRC 223(b)(5) pool limit is null too, and this sentence would
          // contradict both HSA_SHARED_FAMILY_LIMIT_INDETERMINATE beside it and
          // the serialized pool.
          householdPoolAmountIndeterminate
            ? " The limitation being divided is separately undeterminable, so the IRC 223(b)(5) shared limit is not reported either; see HSA_SHARED_FAMILY_LIMIT_INDETERMINATE."
            : " The limitation itself is unaffected and the IRC 223(b)(5) shared limit still reports it: subparagraph (A) fixes that amount from coverage facts, which this does not touch."
        }`,
        "accounts",
        "IRC 223(b)(5)(B)(ii)",
      ),
    );
  }
  if (familySharingApplies) {
    // Only where the division actually held. `defaultedDivision` records that
    // the engine settled it without being told; `householdDivisionUnknown` says
    // it did not settle after all, and announcing a default alongside a null
    // share would contradict the same result twice over.
    if (defaultedDivision === "sole_eligible_spouse" && divisionIsReportable) {
      sharingDiagnostics.push(
        diagnostic(
          "HSA_SOLE_ELIGIBLE_SPOUSE_TAKES_WHOLE_FAMILY_LIMIT",
          DiagnosticSeverity.INFO,
          'The other spouse is stated to have held no high deductible health plan coverage in any month, so they are not an eligible individual and take no share of the family limit. Notice 2004-50 Q&A-31: "if only one spouse is an eligible individual, only that spouse may contribute to an HSA (notwithstanding the treatment under section 223(b)(5)(A) of both spouses as having only family coverage)", and Example (1) of that Q&A gives the whole limitation to the eligible spouse. This is not an equal division and is not an agreement; it is the consequence of the coverage facts supplied.',
          "accounts",
          "IRC 223(b)(5)(B)(ii); Notice 2004-50 Q&A-31",
        ),
      );
    }
    if (statedDivisionInoperative && divisionIsReportable) {
      sharingDiagnostics.push(
        diagnostic(
          "HSA_FAMILY_LIMIT_DIVISION_INOPERATIVE",
          DiagnosticSeverity.INFO,
          'A division of the family limit was supplied, but it has no effect on this result. Only one spouse is an eligible individual: the other is stated to have held no high deductible health plan coverage in any month. Notice 2004-50 Q&A-31 gives the whole limitation to the eligible spouse in that case -- "if only one spouse is an eligible individual, only that spouse may contribute to an HSA (notwithstanding the treatment under section 223(b)(5)(A) of both spouses as having only family coverage)" -- and Notice 2008-59 Q&A-16 forbids allocating any part of it to a spouse who is not otherwise eligible. There is therefore nothing for IRC 223(b)(5)(B)(ii) to divide. The supplied division is not being overridden or rejected; had both spouses been eligible individuals it would have governed.',
          "accounts",
          "IRC 223(b)(5); Notice 2004-50 Q&A-31",
        ),
      );
    }
    if (defaultedDivision === "equally_sole_account" && divisionIsReportable) {
      sharingDiagnostics.push(
        diagnostic(
          "HSA_SOLE_SPOUSE_ACCOUNT_TAKES_ONLY_ITS_EQUAL_SHARE",
          DiagnosticSeverity.INFO,
          'Only one spouse has a health savings account, and no different division was agreed, so IRC 223(b)(5)(B)(ii) divides only the portion for family months in which both spouses are eligible equally between them. This account keeps its sole-eligible family months whole; the other spouse\'s half of the shared-month portion remains theirs even without an account. Owning the only HSA is not itself an agreement to a different division. If the spouses did agree to allocate the whole limit here, state it as hsaFamilyLimitDivision { status: "agreed", taxpayerShare } -- Notice 2004-50 Q&A-32 permits any division, "including allocating nothing to one spouse".',
          "accounts",
          "IRC 223(b)(5)(B)(ii)",
        ),
      );
    } else if (defaultedDivision === "equally" && divisionIsReportable) {
      sharingDiagnostics.push(
        diagnostic(
          "HSA_FAMILY_LIMIT_DIVIDED_EQUALLY_BY_DEFAULT",
          DiagnosticSeverity.INFO,
          'IRC 223(b)(5)(B)(ii) divides the portion for family months in which both spouses are eligible equally between them unless they agree on a different division. Sole-eligible family months stay with that individual. Supply hsaFamilyLimitDivision as { status: "agreed", taxpayerShare } on the scenario to record a different agreement.',
          "accounts",
          "IRC 223(b)(5)(B)(ii)",
        ),
      );
    }
    if (couple && familyPoolKey) {
      context.hsaFamilyPools.set(familyPoolKey, {
        id: `hsa223b5:${familyPoolKey}`,
        legalLimit:
          "IRC 223(b)(5) single family contribution limit divided between the spouses, plus their undivided self-only-month limitations",
        // The one family limitation is built out of the spouses' own refigured
        // limitations, so it is only as determinable as they are. Where a
        // spouse's limitation could not be determined their portion falls back
        // to a statutory amount the statute may not allow on its own -- for
        // 2004-2006 IRC 223(b)(2) reaches the dollar amount only after
        // comparing it with the plan's annual deductible -- and reporting the
        // sum anyway would state a household ceiling on facts that do not
        // support one. The per-owner IRC 223(b)(1) and 223(b)(3) pools already
        // report null in that case; this pool now agrees with them.
        //
        // Only the amount governs. A disagreement about the IRC
        // 223(b)(5)(B)(ii) shares leaves this ceiling standing: it is the
        // couple's, not any one account's, and the statute fixes it before the
        // division is reached. Nulling it for a share conflict withheld a
        // number the record did support.
        limit: householdPoolAmountIndeterminate
          ? null
          : householdParagraph1AfterArcher === null ? null : roundMoney(householdParagraph1AfterArcher),
        usage: settled(0),
      });
    }
  }

  for (const ownerId of ownerIds) {
    const amounts = amountsByOwner.get(ownerId)!;
    const isSharingMember = familySharingApplies && coupleMembersWithAccounts.includes(ownerId);
    const share = isSharingMember ? (shareByOwner.get(ownerId) ?? 1) : null;
    const diagnostics = [...amounts.diagnostics];
    if (isSharingMember) {
      diagnostics.push(...sharingDiagnostics);
      if (recharacterizationEstablished(ownerId)) {
        diagnostics.push(
          diagnostic(
            "HSA_SPOUSE_TREATED_AS_HAVING_FAMILY_COVERAGE",
            DiagnosticSeverity.INFO,
            "IRC 223(b)(5)(A) treats both spouses as having family coverage for any month in which either of them has it, so self-only months were recharacterized as family months.",
            `persons.${ownerId}`,
            "IRC 223(b)(5)(A)",
          ),
        );
      }
    }

    const indeterminate =
      amounts.indeterminate || diagnostics.some((entry) => entry.severity === DiagnosticSeverity.ERROR);

    /**
     * Form 8889 line 6: the spouse's agreed (or default equal) share applies to
     * the family-coverage months' limitation only; self-only months are added
     * back undivided. The same division is applied to the counterfactual
     * without the IRC 223(b)(8) last-month rule so the amount attributable to
     * that rule is measured against the limit that would actually have applied.
     */
    /**
     * Only the months in which both spouses were eligible individuals are
     * divided. Notice 2004-50 Q&A-31 gives a month in which only one spouse is
     * an eligible individual wholly to that spouse, and Q&A-32 works the same
     * split from the other side, dividing the months of shared family coverage
     * while leaving the earlier self-only months undivided. Applying the share
     * to the whole family portion halved months the other spouse had no claim
     * on: a taxpayer covered all year beside a spouse eligible only from July
     * was given half of twelve months rather than all of six plus half of six.
     *
     * `soleFamilyPortion` defaults to the difference so a caller of this helper
     * that has only the total still divides nothing it should not.
     */
    const divided = (
      familyPortion: number,
      selfPortion: number,
      undivided: Money,
      sharedFamilyPortion: number = familyPortion,
    ): Money =>
      share === null
        ? undivided
        : roundMoney(
            share * sharedFamilyPortion + (familyPortion - sharedFamilyPortion) + selfPortion,
          );

    /**
     * IRC 223(b)(4)(A) reduces "the limitation which would (but for this
     * paragraph) apply under this subsection" — the whole of subsection (b),
     * including the IRC 223(b)(3) increase — "but not below zero". Its flush
     * text withdraws it from any individual to whom IRC 223(b)(5) applies; for
     * that individual IRC 223(b)(5)(B)(i) instead reduces the paragraph (1)
     * limitation "without regard to any additional contribution amount under
     * paragraph (3)", and (ii) divides only what survives the reduction. So
     * the ordering differs with the paragraph, not just the amount.
     */
    const archerAmount = isSharingMember ? coupleArcherAggregate : archerForPerson(ownerId);
    const reducedDivided = (
      familyPortion: number,
      selfPortion: number,
      undivided: Money,
      sharedFamilyPortion: number = familyPortion,
    ): Money => {
      if (share === null) return nonnegative(undivided - archerAmount);
      const [family, self] = archerReducedPortions(familyPortion, selfPortion, archerAmount);
      // Wholly shared or wholly sole-eligible months need no apportionment of
      // the IRC 223(b)(5)(B)(i) reduction, because there is only one kind of
      // month for it to have come out of.
      if (sharedFamilyPortion >= familyPortion) return roundMoney(share * family + self);
      if (sharedFamilyPortion <= 0) return roundMoney(family + self);
      // Mixed. `sharedFamilyPortion` is measured before the IRC 223(b)(5)(B)(i)
      // reduction, so subtracting it from `family` states the sole-eligible
      // remainder only where the reduction left the shared months whole. Which
      // months a positive aggregate consumed is what
      // `archerAcrossMixedFamilyMonths` refuses to invent -- but that refusal is
      // forgiven where `noDivisibleFamilyResidue` holds, and the forgiveness
      // reaches here. It is exact at both ends rather than a guess about the
      // middle: `sharedFamilyLimit` is the family union less the aggregate, so
      // nought left for the couple to divide bounds this owner's own `family`
      // at nought as well, every month having been consumed however they are
      // placed. Clamping is therefore inert where nothing was paid and yields
      // nought where the aggregate took everything.
      //
      // Subtracting the unreduced portion drove the base negative instead, and
      // `subsectionBReducedBy` then charged the difference against the IRC
      // 223(b)(3) additional contribution amount -- which IRC 223(b)(5)(B)(i)
      // reduces the paragraph (1) limitation "without regard to" entirely.
      const survivingShared = Math.min(sharedFamilyPortion, family);
      return roundMoney(
        share * survivingShared + (family - survivingShared) + self,
      );
    };
    const baseLimitAfterArcher = indeterminate
      ? null
      : reducedDivided(
          amounts.familyPortionApplied,
          amounts.selfPortionApplied,
          amounts.proratedApplied,
          amounts.familySharedPortionApplied,
        );
    const baseLimitWithoutLastMonthRuleAfterArcher = indeterminate
      ? null
      : reducedDivided(
          amounts.familyPortionWithoutLastMonthRule,
          amounts.selfPortionWithoutLastMonthRule,
          amounts.proratedWithoutLastMonthRule,
          amounts.familySharedPortionWithoutLastMonthRule,
        );

    /**
     * Only IRC 223(b)(4)(A) can reach the IRC 223(b)(3) additional contribution
     * amount, and only with the part the paragraph (1) limitation could not
     * absorb, since the subsection (b) limitation is reduced once as a whole.
     */
    const catchUpArcherResidual = share === null ? Math.max(0, archerAmount - amounts.proratedApplied) : 0;
    const catchUpAfterArcher = nonnegative(amounts.catchUpApplied - catchUpArcherResidual);
    const catchUpWithoutLastMonthRuleAfterArcher = nonnegative(
      amounts.catchUpWithoutLastMonthRule
        - (share === null ? Math.max(0, archerAmount - amounts.proratedWithoutLastMonthRule) : 0),
    );
    /**
     * Whether this owner's own fall is a share of the couple's reduction that
     * no division fixes. IRC 223(b)(5)(B)(i) subtracts the aggregate from the
     * one family limitation and subparagraph (B)(ii) then divides what is left,
     * so an owner whose share is `x` of a limitation `F` reduced by `A` falls
     * by `x * min(A, F)` -- unknown for every `x` the facts leave open, and not
     * the whole aggregate, which is what charging both spouses reported.
     *
     * `divisionShareInQuestion` rather than `householdDivisionUnknown`: the
     * latter forgives an unestablished division whose every completion yields
     * the same maximum, which is true of a limitation the reduction exhausted
     * to nothing. That immateriality rescues the maximum and not this figure --
     * both spouses' ceilings end at zero however the limitation was divided,
     * but how far each of them fell to get there is still their share.
     */
    const ownerShareInQuestion = isSharingMember && divisionShareInQuestion;
    const ownerArcherReductionUnestablished = ownerShareInQuestion && archerAmount > 0;
    /**
     * A fall is the difference between two ceilings, so it is known only where
     * both of them are -- and the ceilings here are deliberately null whenever
     * the supplied facts do not establish one. An account whose own HDHP
     * assertions cannot all be true has no IRC 223(b) limitation to fall from,
     * so a $100 Archer MSA contribution against it took an unknown amount off an
     * unknown amount. Reporting nought said the paragraph applied and cost this
     * owner nothing, one field from the diagnostic refusing them a ceiling.
     *
     * Nil stays exact for the one case that needs no ceiling: where nothing was
     * paid, no reduction was taken, and the operand rather than the limitation
     * settles it. That is why the amount is tested before the limits.
     */
    const archerMsaLimitReduction: Money | null = ownerArcherReductionUnestablished
      ? null
      : archerAmount === 0
      ? 0
      : indeterminate || baseLimitAfterArcher === null
      ? null
      : nonnegative(
          divided(
            amounts.familyPortionApplied,
            amounts.selfPortionApplied,
            amounts.proratedApplied,
            amounts.familySharedPortionApplied,
          )
            + amounts.catchUpApplied
            - baseLimitAfterArcher
            - catchUpAfterArcher,
        );

    /**
     * IRC 223(b)(4)(C) then reduces what is left by "the aggregate amount
     * contributed to health savings accounts of such individual for such
     * taxable year under section 408(d)(9)". The IRC 223(b)(4) flush text
     * withdraws subparagraph (A) — and only (A) — from an individual to whom
     * IRC 223(b)(5) applies, and IRC 223(b)(5)(B)(i) reduces the family
     * limitation by the Archer amount alone, so nothing routes (C) through
     * paragraph (5). It therefore reduces this individual's own subsection (b)
     * limitation in every case: for a married individual, the share the IRC
     * 223(b)(5)(B)(ii) division left them, and the IRC 223(b)(3) amount with
     * whatever the paragraph (1) limitation could not absorb — which the
     * Archer reduction never reaches for that individual.
     */
    const fundingAmount = qualifiedHsaFundingFor(ownerId);
    const [baseLimit, catchUpApplied] = baseLimitAfterArcher === null
      ? [null, catchUpAfterArcher]
      : subsectionBReducedBy(baseLimitAfterArcher, catchUpAfterArcher, fundingAmount);
    const [baseLimitWithoutLastMonthRule, catchUpWithoutLastMonthRule] =
      baseLimitWithoutLastMonthRuleAfterArcher === null
        ? [null, catchUpWithoutLastMonthRuleAfterArcher]
        : subsectionBReducedBy(
            baseLimitWithoutLastMonthRuleAfterArcher,
            catchUpWithoutLastMonthRuleAfterArcher,
            fundingAmount,
          );
    /**
     * IRC 223(b)(4)(C) reduces this spouse's *own* limitation, which is the
     * share IRC 223(b)(5)(B)(ii) left them, so the fall it causes is bounded by
     * that share: an owner holding `x` of a limitation `F` falls by
     * `min(fundingAmount, x * F)`, and an unestablished `x` leaves that figure
     * somewhere in a range rather than at the zero the indeterminate branch
     * below would otherwise report.
     */
    const qualifiedHsaFundingLimitReduction: Money | null =
      ownerShareInQuestion && fundingAmount > 0
        ? null
        : fundingAmount === 0
        ? 0
        : indeterminate || baseLimitAfterArcher === null || baseLimit === null
        ? null
        : nonnegative(baseLimitAfterArcher + catchUpAfterArcher - baseLimit - catchUpApplied);

    context.hsaBasePools.set(ownerId, {
      id: `hsa223b1:${ownerId}`,
      legalLimit: "IRC 223(b)(1) annual HSA contribution limit",
      limit: baseLimit,
      usage: settled(0),
    });
    // Paragraph (5) cannot consume paragraph (3). A known schedule and age
    // retain that separate amount when only the Archer base allocation is open.
    const catchUpAmountEstablished = !indeterminate || (isSharingMember &&
      archerAcrossUndividedSpouses && !amounts.indeterminate && amounts.ageKnown &&
      !amounts.candidateSelectionUnestablished && !householdPoolAmountIndeterminate &&
      eligibilityBranchEstablished && fundingAmount === 0);
    context.hsaCatchUpPools.set(ownerId, {
      id: `hsa223b3:${ownerId}`,
      legalLimit: "IRC 223(b)(3) age 55 additional contribution amount",
      limit: catchUpAmountEstablished ? catchUpApplied : null,
      usage: settled(0),
    });

    if (!indeterminate && catchUpApplied > 0 && couple !== null) {
      diagnostics.push(
        diagnostic(
          "HSA_AGE_55_ADDITIONAL_CONTRIBUTION_IS_PER_SPOUSE",
          DiagnosticSeverity.INFO,
          "The IRC 223(b)(3) additional contribution amount belongs to the individual, is excluded from the IRC 223(b)(5) family division, and must be contributed to that spouse's own HSA: Notice 2008-59 Q&A-22 answers that question \"Yes\", and holds that an individual eligible to make catch-up contributions \"may only make such contributions to his or her own HSA\". Two spouses aged 55 or older therefore have two of them, and an agreed division allocating nothing to one spouse still leaves that spouse their own.",
          `persons.${ownerId}`,
          "IRC 223(b)(3); IRC 223(b)(5)(B); Notice 2008-59 Q&A-22",
        ),
      );
    }

    let status = indeterminate ? CalculationStatus.INDETERMINATE : CalculationStatus.DETERMINATE;
    let testingPeriod: HsaTestingPeriodObligation | null = null;
    /**
     * Whether IRC 223(b)(8) reached this owner at all, asked of their undivided
     * months so that it can be answered without the division. Where the two
     * candidates give the same undivided figures the division scales both alike
     * and the rule was worth nothing under every share, so the amount below is
     * a settled zero rather than an unknown one -- which keeps the common case,
     * an owner eligible all year, numeric.
     */
    const lastMonthRuleAddedNothingUndivided =
      amounts.proratedApplied === amounts.proratedWithoutLastMonthRule &&
      amounts.catchUpApplied === amounts.catchUpWithoutLastMonthRule;
    /**
     * Otherwise it is `x * (applied - withoutLastMonthRule)` for a share `x` the
     * facts never fixed, which ranges from nothing up to the whole of the
     * couple's increase. Reporting the zero the indeterminate branch produces
     * would say IRC 223(b)(8)(B)(i) has nothing to recapture from this owner --
     * and the `testingPeriod` beside it, which is null both where no obligation
     * exists and where none could be computed, is read through this field.
     */
    /**
     * Two ways of knowing the amount is nil, both of them about the comparison
     * rather than about any ceiling. Where the month-by-month candidate won,
     * the applied schedule *is* the one IRC 223(b)(8)(A) was not needed for, so
     * nothing "could not have been made but for subparagraph (A)" for anybody;
     * where a share is unknown but the two candidates give this owner the same
     * undivided figures, every share scales both alike. Neither needs a
     * limitation, so both survive an account whose limitation is unestablished.
     */
    const attributableKnownZero =
      eligibilityStatusByPerson.get(ownerId)?.[11] === "ineligible" ||
      !amounts.fullContributionCandidateSelected ||
      (ownerShareInQuestion && lastMonthRuleAddedNothingUndivided);
    const attributable: Money | null = attributableKnownZero
      ? 0
      : ownerShareInQuestion || indeterminate || baseLimit === null || baseLimitWithoutLastMonthRule === null
        ? null
        : nonnegative(
            roundMoney(baseLimit + catchUpApplied - baseLimitWithoutLastMonthRule - catchUpWithoutLastMonthRule),
          );

    /**
     * The obligation exists only where the rule actually produced something to
     * recapture. IRC 223(b)(8)(B)(i) includes "the aggregate amount of the
     * contributions ... which could not have been made but for subparagraph
     * (A)", so an attributable amount of nil leaves nothing for a failed
     * testing period to include, nothing for the 10 percent tax to reach, and
     * nothing to report a period about.
     *
     * That is why the test is the attributable amount and not the selected
     * candidate. Once the greater-of applies of its own force, a married owner
     * can be on the winning candidate and still take no more than their own
     * months already gave them -- Notice 2008-52 Example 14 compares the
     * couple's combined figures, and the IRC 223(b)(5)(B)(ii) division of the
     * winner is what reaches each spouse. Putting such an owner on notice about
     * a period whose outcome cannot change a figure would report an exposure
     * that IRC 223(b)(8)(B)(i) does not create.
     */
    // A null attributable amount is not a positive one: nothing can be put on
    // notice about an exposure whose size the division never fixed, and the
    // field beside this reports that rather than a zero.
    if (amounts.fullContributionRuleAvailable && amounts.fullContributionCandidateSelected && attributable !== null && attributable > 0 && !indeterminate) {
      const testingPeriodFacts = facts.get(ownerId)!.testingPeriodFacts;
      const months = parameters.testingPeriodMonths ?? 13;
      let testingStatus: HsaTestingPeriodStatus;
      if (testingPeriodFacts.satisfied === true) {
        testingStatus = "satisfied";
      } else if (testingPeriodFacts.satisfied === false) {
        testingStatus = testingPeriodFacts.failureByDeathOrDisability === true
          ? "failed_exception_applies"
          : "failed";
      } else {
        testingStatus = "unresolved";
      }
      const exposed = testingStatus === "failed" || testingStatus === "unresolved" ? attributable : 0;
      testingPeriod = {
        months,
        startMonth: `${context.taxYear}-12`,
        endMonth: `${context.taxYear + 1}-12`,
        status: testingStatus,
        grossIncomeInclusionIfFailed: exposed,
        additionalTaxIfFailed: roundMoney(exposed * 0.1),
        inclusionTaxYear: context.taxYear + 1,
      };
      if (testingStatus === "unresolved") {
        status = CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
        diagnostics.push(
          diagnostic(
            "HSA_LAST_MONTH_RULE_TESTING_PERIOD_UNRESOLVED",
            DiagnosticSeverity.WARNING,
            `IRC 223(b)(8)(A) treats this individual as an eligible individual for the whole year, so $${attributable.toLocaleString()} of the calculated ceiling exists only because of it. Whether the ${months}-month testing period ending ${context.taxYear + 1}-12 is satisfied was not supplied, so compliance is not assumed. Failing it includes that amount in gross income for ${context.taxYear + 1} and adds a 10 percent tax under IRC 223(b)(8)(B)(i).`,
            `persons.${ownerId}`,
            "IRC 223(b)(8)(B)",
          ),
        );
      } else if (testingStatus === "failed") {
        diagnostics.push(
          diagnostic(
            "HSA_LAST_MONTH_RULE_TESTING_PERIOD_FAILED",
            DiagnosticSeverity.WARNING,
            `The IRC 223(b)(8)(B)(iii) testing period is not satisfied. Under IRC 223(b)(8)(B)(i), $${exposed.toLocaleString()} is included in gross income for tax year ${context.taxYear + 1} and an additional tax of 10 percent applies. The inclusion falls in the year of the failure, not the contribution year, so it is not reflected in this year's federal tax effects.`,
            `persons.${ownerId}`,
            "IRC 223(b)(8)(B)(i)",
          ),
        );
      } else if (testingStatus === "failed_exception_applies") {
        diagnostics.push(
          diagnostic(
            "HSA_TESTING_PERIOD_FAILURE_EXCEPTED",
            DiagnosticSeverity.INFO,
            "The testing period was failed, but IRC 223(b)(8)(B)(ii) excepts a failure caused by the individual's death or disability, so there is no income inclusion and no additional tax.",
            `persons.${ownerId}`,
            "IRC 223(b)(8)(B)(ii)",
          ),
        );
      }
    }

    if (!indeterminate && archerAmount > 0) {
      diagnostics.push(
        // The reduction is null only where a share decides it, and only IRC
        // 223(b)(5) produces a share, so branching on it first leaves the
        // unmarried wording where it can never meet one.
        share === null && archerMsaLimitReduction !== null
          ? diagnostic(
              "HSA_ARCHER_MSA_CONTRIBUTIONS_REDUCE_LIMIT",
              DiagnosticSeverity.INFO,
              `IRC 223(b)(4)(A) reduces the IRC 223(b) limitation, but not below zero, by the $${archerAmount.toLocaleString()} aggregate amount paid for the taxable year to Archer MSAs of this individual, which took $${archerMsaLimitReduction!.toLocaleString()} off the ceiling. The amount paid is taken as supplied; IRC 220 is not modelled and the amount is not tested against the Archer MSA contribution limitation.`,
              `persons.${ownerId}`,
              "IRC 223(b)(4)(A)",
            )
          : diagnostic(
              "HSA_ARCHER_MSA_CONTRIBUTIONS_REDUCE_LIMIT",
              DiagnosticSeverity.INFO,
              `IRC 223(b)(4) does not apply to an individual to whom IRC 223(b)(5) applies, so the $${archerAmount.toLocaleString()} aggregate amount paid to Archer MSAs of both spouses reduces the single IRC 223(b)(1) family limitation under IRC 223(b)(5)(B)(i) before IRC 223(b)(5)(B)(ii) divides it${
                archerMsaLimitReduction === null
                  ? ", and the IRC 223(b)(5) shared limit reports the couple's limitation after it. How much of that reduction fell on this spouse's own ceiling is their share of it under subparagraph (B)(ii), and no division was established, so accounts[].hsa.archerMsaLimitReduction is null rather than the aggregate: the reduction is taken from the couple's one limitation once, and charging it to each spouse would subtract it twice"
                  : `, which took $${archerMsaLimitReduction.toLocaleString()} off this spouse's ceiling`
              }. IRC 223(b)(5)(B) is applied without regard to the IRC 223(b)(3) additional contribution amount, so the reduction never reaches it. The amount paid is taken as supplied; IRC 220 is not modelled.`,
              `persons.${ownerId}`,
              "IRC 223(b)(5)(B)(i)",
            ),
      );
    }

    if (!indeterminate && fundingAmount > 0) {
      diagnostics.push(
        diagnostic(
          "HSA_QUALIFIED_HSA_FUNDING_DISTRIBUTION_REDUCES_LIMIT",
          DiagnosticSeverity.INFO,
          qualifiedHsaFundingLimitReduction === null
            ? `The IRC 223(b)(4) flush text withdraws subparagraph (A) alone from an individual to whom IRC 223(b)(5) applies, so IRC 223(b)(4)(C) still applies to this spouse. The $${fundingAmount.toLocaleString()} contributed under IRC 408(d)(9) is an amount of this individual and not of the couple, and it reduces the limitation the IRC 223(b)(5)(B)(ii) division left them rather than the family limitation before it. That share was never established, so how far this spouse's own ceiling fell is bounded by it and accounts[].hsa.qualifiedHsaFundingLimitReduction is null rather than nil. The amount is taken as supplied; the IRC 408(d)(9)(C) once-per-lifetime limitation and the separate IRC 408(d)(9)(D) testing period are not modelled.`
            : share === null
            ? `IRC 223(b)(4)(C) reduces the IRC 223(b) limitation, but not below zero, by the $${fundingAmount.toLocaleString()} aggregate amount contributed to health savings accounts of this individual for the taxable year under IRC 408(d)(9), which took $${qualifiedHsaFundingLimitReduction.toLocaleString()} off the ceiling. The amount is taken as supplied; the IRC 408(d)(9)(C) once-per-lifetime limitation and the separate IRC 408(d)(9)(D) testing period are not modelled.`
            : `The IRC 223(b)(4) flush text withdraws subparagraph (A) alone from an individual to whom IRC 223(b)(5) applies, so IRC 223(b)(4)(C) still applies to this spouse. The $${fundingAmount.toLocaleString()} contributed under IRC 408(d)(9) is an amount of this individual and not of the couple, and IRC 223(b)(5)(B)(i) reduces the family limitation by the Archer MSA amount alone, so it reduces this spouse's own limitation after the IRC 223(b)(5)(B)(ii) division rather than the family limitation before it. That took $${qualifiedHsaFundingLimitReduction.toLocaleString()} off the ceiling, reaching the IRC 223(b)(3) additional contribution amount with whatever the IRC 223(b)(1) limitation could not absorb. The amount is taken as supplied; the IRC 408(d)(9)(C) once-per-lifetime limitation and the separate IRC 408(d)(9)(D) testing period are not modelled.`,
          `persons.${ownerId}`,
          "IRC 223(b)(4)(C)",
        ),
      );
    }

    // The IRC 125 / IRC 223 conflict is diagnosed and never enforced, so the
    // plan status is fixed before these diagnostics are attached. Eligible-
    // individual status is a caller-supplied fact everywhere else in this
    // engine and no rule here overrides one; a caller who has already accounted
    // for the conflict, by ending the arrangement mid-year and supplying the
    // correct eligible months, must still get the answer their facts imply.
    // Every IRC 223(b) figure therefore survives intact and only the account's
    // reported status reflects the ERROR, through the ordinary rule that an
    // error makes a result indeterminate.
    const planStatus = accountStatusFromDiagnostics(status, diagnostics);
    {
      const spouseId = spouseIdOf(ownerId);
      const own = section223FsaFacts.get(ownerId) ?? emptyHealthFsaSection223Facts();
      const spouse = spouseId === null
        ? emptyHealthFsaSection223Facts()
        : section223FsaFacts.get(spouseId) ?? emptyHealthFsaSection223Facts();
      if (own.generalPurpose) {
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_DISQUALIFIES_HSA_ELIGIBILITY",
            DiagnosticSeverity.ERROR,
            `This individual holds a general-purpose health flexible spending arrangement. Rev. Rul. 2004-45 holds that an individual covered by a health FSA paying or reimbursing section 213(d) medical expenses before the IRC 223(c)(2)(A)(i) minimum annual deductible is satisfied is not an eligible individual, because IRC 223(c)(1)(A)(ii) requires that an eligible individual not be covered by a health plan that is not a high deductible health plan and that provides coverage for a benefit the HDHP covers.${own.generalPurposeCarryover ? " Amounts carried over from the preceding plan year are general-purpose funds in the year they land, so the disqualification reaches that whole plan year." : ""} The IRC 223(b) figures reported here are unchanged: eligible-individual status is supplied by the caller and is never overridden, so this reports the conflict rather than enforcing it.`,
            `persons.${ownerId}`,
            "IRC 223(c)(1)(A)(ii); Rev. Rul. 2004-45",
          ),
        );
      }
      if (spouse.generalPurpose) {
        diagnostics.push(
          diagnostic(
            "SPOUSE_HEALTH_FSA_DISQUALIFIES_HSA_ELIGIBILITY",
            DiagnosticSeverity.ERROR,
            "This individual's spouse holds a general-purpose health flexible spending arrangement. Rev. Rul. 2004-45 states that the result is the same where the individual is covered by a health FSA sponsored by the employer of the individual's spouse, because such an arrangement can reimburse this individual's own section 213(d) medical expenses, so it is disqualifying coverage under IRC 223(c)(1)(A)(ii) for both of them. As with an individual's own arrangement, the IRC 223(b) figures are unchanged and the conflict is reported rather than enforced.",
            `persons.${ownerId}`,
            "IRC 223(c)(1)(A)(ii); Rev. Rul. 2004-45",
          ),
        );
      }
      if (own.generalPurposeGracePeriod || spouse.generalPurposeGracePeriod) {
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_GRACE_PERIOD_EXTENDS_HSA_DISQUALIFICATION",
            DiagnosticSeverity.INFO,
            "The disqualifying arrangement offers a Prop. Treas. Reg. 1.125-1(e) grace period. Notice 2005-86 holds that an individual covered by a general-purpose health FSA during a grace period is generally not eligible to contribute to a health savings account until the first day of the month following the end of that grace period, even where the arrangement has no unused benefits left. The grace-period months of the following plan year are therefore affected as well, which this year's eligible-month input cannot express.",
            `persons.${ownerId}`,
            "Notice 2005-86",
          ),
        );
      }
      if (
        !own.generalPurpose &&
        !spouse.generalPurpose &&
        !own.purposeUnstated &&
        !spouse.purposeUnstated &&
        (own.hsaCompatible || spouse.hsaCompatible)
      ) {
        diagnostics.push(
          diagnostic(
            "HEALTH_FSA_TREATED_AS_HSA_COMPATIBLE",
            DiagnosticSeverity.INFO,
            "Every health flexible spending arrangement in this scenario is limited-purpose or post-deductible. Rev. Rul. 2004-45 holds that an arrangement reimbursing only vision and dental benefits, which are permitted coverage, and preventive care, or reimbursing only expenses incurred after the IRC 223(c)(2)(A)(i) minimum annual deductible is satisfied, leaves the individual an eligible individual, so IRC 223(c)(1)(A)(ii) is not failed.",
            `persons.${ownerId}`,
            "IRC 223(c)(1)(A)(ii); Rev. Rul. 2004-45",
          ),
        );
      }
    }

    diagnostics.push(
      diagnostic(
        "HSA_ELIGIBILITY_FACTS_SUPPLIED_BY_CALLER",
        DiagnosticSeverity.INFO,
        "This calculation applies IRC 223(b) to the months and coverage supplied. It does not test eligible-individual status under IRC 223(c)(1), whether the plan is a high deductible health plan under IRC 223(c)(2), the IRC 223(b)(6) denial for a person claimed as another taxpayer's dependent, or Medicare entitlement under IRC 223(b)(7). The IRC 223(b)(4)(A) and 223(b)(5)(B)(i) reductions are applied from the Archer MSA contributions supplied on persons[].archerMsaContributions, which are taken as stated and not tested against IRC 220. The IRC 223(b)(4)(C) reduction is applied from the qualified HSA funding distribution supplied on persons[].qualifiedHsaFundingDistributions, which is likewise taken as stated: the IRC 408(d)(9)(C) once-per-lifetime limitation and the separate IRC 408(d)(9)(D) testing period are not tested. Where the scenario also holds a health flexible spending arrangement, the IRC 223(c)(1)(A)(ii) consequence of its Rev. Rul. 2004-45 purpose is reported and never enforced: the figures here are the ones the supplied months and coverage produce.",
        `persons.${ownerId}`,
        "IRC 223",
      ),
    );

    /**
     * Published only where the candidate it describes is the one the facts
     * establish. Every field below is an audit trail of a chosen schedule and a
     * chosen winner, so where the choice was one completion among several the
     * whole object is withheld until the resolved facts establish it -- and `AccountCalculationResult.hsa` is
     * already optional for the accounts that never had one.
     *
     * The unapportionable Archer case joins the per-owner causes here because it
     * is a couple-level fact: where two spouses' undivided months could each
     * have absorbed the single IRC 223(b)(5)(B)(i) reduction, which of them did
     * decides these figures rather than a share of them. The mixed-months case
     * beside it does not, for the reason `sharedFamilyContributionLimit` gives
     * below: there only one owner's months are in play, so the amount is settled
     * and only its placement -- the share -- is not.
     *
     * An unsettled IRC 223(b)(5)(B)(ii) division is deliberately not a cause,
     * and the four fields it does reach are null individually instead. Both
     * candidate schedules stay computable when only the share is unknown, so
     * every figure here that describes the owner's *undivided* months or the
     * couple's limitation is established and stays -- which is what the
     * monthly-limit, prorated-limit and `sharedFamilyContributionLimit`
     * assertions across this suite exist to hold. Withholding the object for an
     * unknown share would take those with it and report a January the facts fix
     * as unknowable because a share is.
     */
    const hsaDetailUnestablished =
      amounts.candidateSelectionUnestablished || (isSharingMember && archerAcrossUndividedSpouses);

    // A mixed applied schedule does not establish which kind of month the
    // Archer reduction consumed. A zero family residue still fixes the divided
    // portion at zero; counterfactual-only ambiguity does not affect this field.
    const dividedFamilyPortionIndeterminate = archerAmount > 0
      && amounts.familySharedPortionApplied > 0
      && amounts.familySharedPortionApplied < amounts.familyPortionApplied
      && archerAmount < amounts.familyPortionApplied;

    const detail: HsaAccountDetail = {
      coverageTierByMonth: facts.get(ownerId)!.resolvedMonths ?? HSA_ALL_MONTHS.map(() => null),
      eligibleMonthCount: amounts.eligibleMonthCount,
      // Withheld where the rejected deductible fed them. Coverage months and
      // the IRC 223(b)(3) amount beside them stay, because neither is computed
      // from the deductible; only the three limitation figures are.
      appliedAnnualLimitByMonth: subminimumDeductibleReaches(ownerId)
        ? subminimumAffectedMonths(ownerId).map((affected, index) =>
            affected ? null : amounts.appliedAnnualLimitByMonth[index],
          )
        : amounts.appliedAnnualLimitByMonth,
      proratedContributionLimit: subminimumDeductibleReaches(ownerId) ? null : amounts.proratedApplied,
      contributionLimitWithoutLastMonthRule: subminimumDeductibleReaches(ownerId)
        ? null
        : amounts.proratedWithoutLastMonthRule,
      additionalContributionAmount: amounts.catchUpApplied,
      // Null where the division is undeterminable rather than the placeholder
      // taken from whichever of the owner's accounts was listed first. Reversing
      // two contradictory accounts changed this from 0.5 to 0.25 while the
      // diagnostic said no share could be stated -- an input-order-dependent
      // number a caller could multiply by the limitation the pool now preserves.
      // The placeholder stays internal, where the division arithmetic needs a
      // value it never gets to publish.
      // `householdDivisionUnestablished`, not `householdDivisionUnknown`: this
      // field reports the division itself, so it is null whenever the division
      // was never established -- including where every possible division yields
      // the same amount and the maximum beside it therefore stays determinate.
      familyLimitShare: householdDivisionUnestablished ? null : share,
      // Null where the family limitation could not be determined, for the same
      // reason the IRC 223(b)(5) pool is: this field *is* that limitation, seen
      // per owner, and reporting the uncompared statutory amount here would
      // leave the ceiling the pool refuses to state still published one field
      // away. The field is already declared nullable for the unrelated case of
      // no family limit being shared at all.
      //
      // It follows the amount and not the division, because it is the amount:
      // its contract is the limitation this owner divides, taken *before* the
      // IRC 223(b)(5)(B)(ii) share is applied. A share disagreement therefore
      // leaves it reportable, and `familyLimitShare` beside it is the field
      // that goes unusable. Reading the division flag here would null the one
      // figure a caller reconciling contradictory shares actually needs.
      //
      // `archerAcrossUndividedSpouses` is the one exception, and it is an
      // exception about the amount rather than the division. Where the couple's
      // single Archer MSA reduction would come out of both spouses' undivided
      // months, which spouse it came out of decides *this* figure and not just
      // the share of it -- so the pre-division amount is itself unknown, and
      // `archerReducedPortions` would report this owner charged the whole
      // aggregate while the other owner was charged it too. The mixed-months
      // case is not an exception: there only one owner's months are in play, so
      // the aggregate does come out of that owner's limitation whole and only
      // its placement among their months, which is the share, is unsettled.
      sharedFamilyContributionLimit: isSharingMember
        && !householdPoolAmountIndeterminate
        && !archerAcrossUndividedSpouses
        ? roundMoney(archerReducedPortions(amounts.familyPortionApplied, amounts.selfPortionApplied, archerAmount)[0])
        : null,
      // The same clamp `reducedDivided` applies, and for the same reason: the
      // shared portion is measured before the IRC 223(b)(5)(B)(i) reduction, so
      // naming it as the divided part of a figure measured after the reduction
      // would report more being divided than survives to be divided.
      dividedFamilyContributionLimit: isSharingMember
        && !dividedFamilyPortionIndeterminate
        && !householdPoolAmountIndeterminate
        && !archerAcrossUndividedSpouses
        ? roundMoney(Math.min(
            amounts.familySharedPortionApplied,
            archerReducedPortions(amounts.familyPortionApplied, amounts.selfPortionApplied, archerAmount)[0],
          ))
        : null,
      archerMsaContributionsApplied: archerAmount,
      archerMsaReductionPrecedesFamilyDivision: share !== null,
      archerMsaLimitReduction,
      qualifiedHsaFundingDistributionsApplied: fundingAmount,
      qualifiedHsaFundingLimitReduction,
      fullContributionCandidateSelected: amounts.fullContributionCandidateSelected,
      amountAttributableToLastMonthRule: attributable,
      testingPeriod,
    };

    context.hsaPlans.set(ownerId, {
      status: planStatus,
      diagnostics,
      statutoryMaximum: baseLimit === null ? null : roundMoney(baseLimit + catchUpApplied),
      detail: hsaDetailUnestablished ? null : detail,
      familyPoolKey: isSharingMember ? familyPoolKey : null,
      familyPoolUsageDeterminable:
        amounts.ageKnown && amounts.catchUpApplied === 0 && archerAmount === 0 && fundingAmount === 0,
    });
  }

  // Existing contributions consume the base limit first and then the IRC
  // 223(b)(3) increase, which is the only ordering that never reports capacity
  // the statute does not allow.
  //
  for (const account of hsaAccounts) {
    const existing = roundMoney(
      account.existingContributions.hsaDeductible + account.existingContributions.hsaEmployerOrCafeteria,
    );
    if (existing <= 0) continue;
    const basePool = context.hsaBasePools.get(account.ownerId);
    const catchUpPool = context.hsaCatchUpPools.get(account.ownerId);
    if (!basePool || !catchUpPool) continue;
    const poolKey = context.hsaPlans.get(account.ownerId)?.familyPoolKey;
    const familyPool = poolKey ? context.hsaFamilyPools.get(poolKey) : undefined;
    /**
     * An owner whose own IRC 223(b)(1) limitation is undeterminable still has a
     * couple-wide IRC 223(b)(5) ceiling where only the (B)(ii) division is
     * unknown, and the pool reports it. What it may not do is publish a draw
     * against that ceiling it cannot compute.
     *
     * The contribution splits between the paragraph (1) limitation the pool
     * measures and the paragraph (3) additional amount, which IRC 223(b)(5)(B)
     * keeps out of the division. `familyPoolUsageDeterminable` says whether that
     * split is arithmetic here: it needs the age that fixes the paragraph (3)
     * amount, and needs no IRC 223(b)(4) reduction in play, since those come off
     * the paragraph (1) share first and so turn on the very limitation that is
     * undeterminable.
     *
     * Both bounds were tried and both misreported. Charging everything paid in
     * accused a 56-year-old who contributed 9750 for 2026 -- 8750 under the 1/0
     * division IRC 223(b)(5)(B)(ii) permits, plus their own 1000 -- of exceeding
     * an 8750 pool. Charging everything less the largest possible paragraph (3)
     * amount then reported a pool as wholly untouched when a 9500 qualified HSA
     * funding distribution had left at most 250 of room. A bound is not a usage,
     * and publishing one as though it were is what produced both.
     */
    if (basePool.limit === null) {
      if (familyPool) {
        if (context.hsaPlans.get(account.ownerId)?.familyPoolUsageDeterminable === true) {
          // Nothing can absorb a spill, so the whole contribution came out of
          // the couple's limitation whichever way the division falls.
          chargePool(familyPool, existing);
        } else {
          // The contribution is known and the pool's ceiling is known; what is
          // unknown is how much of it this pool bore. Before, that was a flag
          // saying "not a figure"; it is the same statement as an interval
          // spanning everything still open, and now it says how much is at
          // stake rather than only that something is.
          familyPool.usage = {
            minimum: familyPool.usage.minimum,
            maximum: roundMoney(
              familyPool.limit === null
                ? familyPool.usage.minimum + existing
                : Math.max(familyPool.limit, familyPool.usage.minimum),
            ),
          };
        }
      }
      continue;
    }
    const toBase = minMoney(existing, nonnegative(basePool.limit - basePool.usage.maximum));
    chargePool(basePool, toBase);
    chargePool(catchUpPool, existing - toBase);
    if (familyPool) chargePool(familyPool, toBase);
  }
}

function allocateHsa(context: CalculationContext, account: NormalizedAccount): AllocationOutcome {
  const plan = context.hsaPlans.get(account.ownerId)!;
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const sharedLimits: SharedLimitUse[] = [];
  const diagnostics = [...plan.diagnostics];
  const basePool = context.hsaBasePools.get(account.ownerId);
  const catchUpPool = context.hsaCatchUpPools.get(account.ownerId);
  const familyPool = plan.familyPoolKey ? context.hsaFamilyPools.get(plan.familyPoolKey) : undefined;

  if (plan.status === CalculationStatus.UNAVAILABLE || !basePool || !catchUpPool) {
    return {
      status: CalculationStatus.UNAVAILABLE,
      statutoryMaximum: 0,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
      hsaDetail: plan.detail,
    };
  }

  if (plan.status === CalculationStatus.INDETERMINATE) {
    reportPoolWithoutConsuming(basePool, sharedLimits);
    if (familyPool) reportPoolWithoutConsuming(familyPool, sharedLimits);
    reportPoolWithoutConsuming(catchUpPool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: plan.statutoryMaximum,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
      hsaDetail: plan.detail,
    };
  }

  const basePools = familyPool ? [basePool, familyPool] : [basePool];
  const baseAmount = takeAcrossPools(
    basePools,
    minMoney(...basePools.map((pool) => poolRemaining(pool))),
    sharedLimits,
  );
  const catchUpAmount = takeFromPool(catchUpPool, poolRemaining(catchUpPool) ?? 0, sharedLimits);
  const total = roundMoney(baseAmount + catchUpAmount);

  // IRC 106(d) employer and cafeteria-plan contributions are excluded from
  // income rather than deducted, and IRC 223(b)(4)(B) makes them reduce the
  // IRC 223(a) deduction, so they are filled first out of the same ceiling.
  const employerTarget = money(
    account.planRules.expectedEmployerContribution,
    `accounts.${account.id}.planRules.expectedEmployerContribution`,
  );
  const employerRemaining = nonnegative(employerTarget - annual.hsaEmployerOrCafeteria);
  const toEmployer = minMoney(total, employerRemaining);
  const toDeductible = roundMoney(total - toEmployer);

  additional.hsaEmployerOrCafeteria = toEmployer;
  additional.hsaDeductible = toDeductible;
  annual.hsaEmployerOrCafeteria = roundMoney(annual.hsaEmployerOrCafeteria + toEmployer);
  annual.hsaDeductible = roundMoney(annual.hsaDeductible + toDeductible);

  return {
    status: accountStatusFromDiagnostics(plan.status, diagnostics),
    statutoryMaximum: plan.statutoryMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
    hsaDetail: plan.detail,
  };
}

function regularIraContributionAmount(components: ContributionComponents): Money {
  return roundMoney(
    components.deductibleIra + components.nondeductibleIra + components.rothIra + components.unclassifiedIra,
  );
}

/**
 * Spend a settled amount. Both endpoints move, because an amount whose
 * attribution is not in doubt is spent under every reading of the facts: it
 * narrows nothing and widens nothing.
 */
function chargePool(pool: LimitPool, amount: Money): void {
  pool.usage = {
    minimum: roundMoney(pool.usage.minimum + amount),
    maximum: roundMoney(pool.usage.maximum + amount),
  };
}

/**
 * Record that a known amount's home is unresolved between two pools.
 *
 * `chargedTo` is where the amount currently sits and `alternative` is where it
 * belongs under the other reading. The amount is not moved and not withdrawn:
 * its lower bound leaves the pool that holds it and its upper bound arrives at
 * the pool that may have to. Afterwards `chargedTo` may have spent it and
 * `alternative` may have spent it, and exactly one of those is true in any
 * completion of the facts -- which is what `groupId` records, so that the two
 * maxima are never later added together as though both could hold at once.
 */
function attributeToEitherPool(
  chargedTo: LimitPool | undefined,
  alternative: LimitPool | undefined,
  amount: Money,
  groupId: string,
): void {
  if (amount <= 0) return;
  if (chargedTo) {
    chargedTo.usage = {
      minimum: nonnegative(roundMoney(chargedTo.usage.minimum - amount)),
      maximum: chargedTo.usage.maximum,
    };
    chargedTo.uncertaintyGroupIds = [...(chargedTo.uncertaintyGroupIds ?? []), groupId];
  }
  if (alternative) {
    alternative.usage = {
      minimum: alternative.usage.minimum,
      maximum: roundMoney(alternative.usage.maximum + amount),
    };
    alternative.uncertaintyGroupIds = [...(alternative.uncertaintyGroupIds ?? []), groupId];
  }
}

/** Whether the pool's usage is settled, which is to say its interval is a point. */
function poolUsageSettled(pool: LimitPool): boolean {
  return intervalIsSettled(pool.usage);
}

/**
 * What is left, as a range. The endpoints invert: the *most* the pool may have
 * spent leaves the *least* room, so `remaining.minimum` pairs with
 * `usage.maximum`. `remaining.minimum` is therefore the room that exists under
 * every reading of the facts -- the only room an allocation may rely on.
 */
function poolRemainingInterval(pool: LimitPool): MoneyInterval | null {
  if (pool.limit === null) return null;
  return {
    minimum: nonnegative(roundMoney(pool.limit - pool.usage.maximum)),
    maximum: nonnegative(roundMoney(pool.limit - pool.usage.minimum)),
  };
}

/**
 * The remainder as a figure, which exists only where the usage is settled. An
 * unsettled pool has a range and no single remainder, and reporting either
 * endpoint as one asserts headroom the record does not establish -- too much of
 * it or too little, depending on which way the missing fact resolves.
 */
function poolRemaining(pool: LimitPool): Money | null {
  if (pool.limit === null || !poolUsageSettled(pool)) return null;
  return nonnegative(pool.limit - pool.usage.maximum);
}

/**
 * Take what the pool certainly has room for.
 *
 * An unsettled pool is not an empty one. Where the usage is a range, the room
 * that exists under *every* reading of the facts is the remainder measured from
 * the largest possible usage, and an allocation of that much is correct however
 * the doubt resolves -- so it is allocated, and the account keeps a determinate
 * answer it is entitled to. Refusing it because some *other* capacity is
 * uncertain withholds a number the record supports; taking more than it because
 * the ceiling might allow more asserts one the record does not.
 *
 * The pool's own usage stays a range afterwards, widened by nothing: a settled
 * draw moves both endpoints. Only its history is unresolved, and this account's
 * contribution to that history is not.
 */
function takeFromPool(pool: LimitPool, requested: Money, sharedLimits: SharedLimitUse[]): Money {
  const usageBefore = pool.usage;
  const settledBefore = poolUsageSettled(pool);
  if (pool.limit === null) {
    sharedLimits.push({
      id: pool.id,
      legalLimit: pool.legalLimit,
      // A null limit leaves nothing to bound: there is no ceiling to measure a
      // range against, so no interval is offered beside the nulls either.
      limit: null,
      usedBeforeAccount: settledBefore ? usageBefore.minimum : null,
      usedByAccount: settledBefore ? 0 : null,
      remainingAfterAccount: null,
      ...(settledBefore ? {} : { possibleUsedBeforeAccount: usageBefore }),
    });
    return 0;
  }
  const guaranteed = poolRemainingInterval(pool)!.minimum;
  const taken = minMoney(requested, guaranteed);
  chargePool(pool, taken);
  sharedLimits.push(
    sharedLimitUse(pool, usageBefore, taken),
  );
  return taken;
}

/**
 * One report of a pool as this account left it. Scalars where the usage is
 * settled, ranges where it is not, and never both -- a consumer reading
 * `remainingAfterAccount` must not be handed an endpoint dressed as a figure.
 */
function sharedLimitUse(pool: LimitPool, usageBefore: MoneyInterval, taken: Money | null): SharedLimitUse {
  const settledUsage = poolUsageSettled(pool);
  const remaining = poolRemainingInterval(pool);
  return {
    id: pool.id,
    legalLimit: pool.legalLimit,
    limit: pool.limit,
    usedBeforeAccount: intervalIsSettled(usageBefore) ? usageBefore.minimum : null,
    usedByAccount: taken,
    remainingAfterAccount: settledUsage && remaining !== null ? remaining.minimum : null,
    ...(intervalIsSettled(usageBefore) ? {} : { possibleUsedBeforeAccount: usageBefore }),
    ...(settledUsage || remaining === null ? {} : { possibleRemainingAfterAccount: remaining }),
  };
}

function reportPoolWithoutConsuming(pool: LimitPool, sharedLimits: SharedLimitUse[]): void {
  // No draw was computed here, which is not the same as a computed draw of
  // zero. Where the usage is unsettled all three usage fields go together and
  // say nothing: a numeric zero in one of them would read as a draw the engine
  // declined to make. `takeFromPool` reports a real zero, because there the
  // guaranteed room was measured and found to be nil.
  sharedLimits.push(sharedLimitUse(pool, pool.usage, poolUsageSettled(pool) ? 0 : null));
}

function accountStatusFromDiagnostics(
  defaultStatus: CalculationStatus,
  diagnostics: Diagnostic[],
): CalculationStatus {
  if (diagnostics.some((entry) => entry.severity === DiagnosticSeverity.ERROR)) {
    return CalculationStatus.INDETERMINATE;
  }
  if (
    defaultStatus === CalculationStatus.DETERMINATE &&
    diagnostics.some((entry) => entry.code.includes("ASSUM") || entry.code.includes("PLAN_TERM"))
  ) {
    return CalculationStatus.DETERMINATE_WITH_ASSUMPTIONS;
  }
  return defaultStatus;
}

function takeAcrossPools(
  pools: LimitPool[],
  requested: Money,
  sharedLimits: SharedLimitUse[],
): Money {
  // A null ceiling still stops everything: there is no room to be sure of when
  // the limit itself could not be determined. An unsettled *usage* does not,
  // because its guaranteed remainder is a number.
  if (pools.some((pool) => pool.limit === null)) {
    for (const pool of pools) reportPoolWithoutConsuming(pool, sharedLimits);
    return 0;
  }
  const taken = minMoney(
    requested,
    ...pools.map((pool) => poolRemainingInterval(pool)!.minimum),
  );
  for (const pool of pools) {
    const usageBefore = pool.usage;
    chargePool(pool, taken);
    sharedLimits.push(sharedLimitUse(pool, usageBefore, taken));
  }
  return taken;
}

function consumeExactFromPool(pool: LimitPool, amount: Money, sharedLimits: SharedLimitUse[]): void {
  const usageBefore = pool.usage;
  chargePool(pool, amount);
  sharedLimits.push(sharedLimitUse(pool, usageBefore, amount));
}

function emptyOutcome(
  account: NormalizedAccount,
  status: CalculationStatus,
  statutoryMaximum: Money | null,
  diagnostics: Diagnostic[] = [],
): AllocationOutcome {
  return {
    status,
    statutoryMaximum,
    annualComponents: cloneComponentsFromComponents(account.existingContributions),
    additionalComponents: zeroComponents(),
    planTermDependentCapacity: 0,
    sharedLimits: [],
    diagnostics,
  };
}

function cloneComponentsFromComponents(source: ContributionComponents): ContributionComponents {
  return { ...source };
}

function allocateAccount(context: CalculationContext, account: NormalizedAccount): AllocationOutcome {
  const traits = ACCOUNT_TRAITS[account.type];
  if (!availabilityForAccount(context.parameters, traits)) {
    const diagnostics = [
      diagnostic(
        "ACCOUNT_TYPE_NOT_AVAILABLE_FOR_YEAR",
        DiagnosticSeverity.ERROR,
        `${account.type} was not available in tax year ${context.taxYear}.`,
        `accounts.${account.id}`,
      ),
    ];
    if (sumComponents(account.existingContributions) > 0) {
      diagnostics.push(
        diagnostic(
          "EXISTING_CONTRIBUTION_BEFORE_ACCOUNT_AVAILABLE",
          DiagnosticSeverity.ERROR,
          "Existing contributions were supplied for an account type that was not yet available.",
          `accounts.${account.id}.existingContributions`,
        ),
      );
    }
    return emptyOutcome(account, CalculationStatus.UNAVAILABLE, 0, diagnostics);
  }

  // OBRA relief with an unencoded amount cannot become an ordinary-limit
  // ceiling. This applies to SIMPLE employer formulas as well as §415(c) plans.
  if (["qualified_elective", "annual_additions_only", "sep", "simple"].includes(traits.family)) {
    const diagnostics = grandfatheredGovernmentalLimitDiagnostics(context, account);
    if (diagnostics.length > 0) {
      const outcome = emptyOutcome(account, CalculationStatus.INDETERMINATE, null, diagnostics);
      const group = context.annualAdditionsPools.get(groupIdForAccount(account));
      if (group) reportPoolWithoutConsuming(group, outcome.sharedLimits);
      return outcome;
    }
  }

  switch (traits.family) {
    case "regular_traditional_ira":
      return allocateTraditionalIra(context, account, traits);
    case "regular_roth_ira":
      return allocateRothIra(context, account, traits);
    case "inherited_ira":
      return emptyOutcome(account, CalculationStatus.INELIGIBLE, 0, [
        diagnostic(
          "INHERITED_IRA_CANNOT_ACCEPT_REGULAR_CONTRIBUTIONS",
          DiagnosticSeverity.INFO,
          "An inherited IRA cannot accept the beneficiary's regular annual IRA contribution.",
          `accounts.${account.id}`,
          "IRC 408(d)(3)(C)",
        ),
      ]);
    case "sep":
      return allocateSep(context, account, traits);
    case "simple":
      return allocateSimple(context, account, traits);
    case "qualified_elective":
      return allocateQualifiedElective(context, account, traits);
    case "section457":
      return allocateSection457(context, account, traits);
    case "annual_additions_only":
      return allocateAnnualAdditionsOnly(context, account, traits);
    case "defined_benefit":
      return allocateDefinedBenefit(context, account);
    case "section457f":
      return allocateSection457f(account);
    case "hsa":
      return allocateHsa(context, account);
    case "health_fsa":
      return allocateHealthFsa(context, account);
    case "dependent_care_fsa":
      return allocateDependentCareFsa(context, account);
  }
}

function allocateTraditionalIra(
  context: CalculationContext,
  account: NormalizedAccount,
  _traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const person = context.persons.get(account.ownerId)!;
  const ownerPool = context.iraOwnerPools.get(account.ownerId)!;
  const compensationPool = context.iraCompensationPools.get(ownerPool.compensationPoolId)!;
  const deductionPool = context.iraDeductionPools.get(account.ownerId)!;

  if (ownerPool.blocked) {
    diagnostics.push(
      diagnostic(
        "IRA_POOL_BLOCKED_BY_PRIOR_INDETERMINATE_ACCOUNT",
        DiagnosticSeverity.ERROR,
        "A higher-priority IRA account has an indeterminate contribution limit, so remaining shared IRA capacity cannot be allocated reliably.",
        `accounts.${account.id}`,
      ),
    );
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: ownerPool.limit,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  if (context.parameters.ira.traditionalContributionAge70HalfRestriction) {
    const restricted = reachesAge70HalfByYearEnd(person, context.taxYear);
    if (restricted === true) {
      return emptyOutcome(account, CalculationStatus.INELIGIBLE, 0, [
        diagnostic(
          "PRE_2020_TRADITIONAL_IRA_AGE_70_HALF_RESTRICTION",
          DiagnosticSeverity.INFO,
          "Traditional IRA contributions were not permitted after age 70½ for this tax year.",
          `accounts.${account.id}`,
        ),
      ]);
    }
    if (restricted === null) {
      ownerPool.blocked = true;
      diagnostics.push(
        diagnostic(
          "BIRTH_DATE_REQUIRED_FOR_AGE_70_HALF_RULE",
          DiagnosticSeverity.ERROR,
          "An exact birth date is required to resolve the former age-70½ traditional IRA contribution restriction.",
          `persons.${person.id}.birthDate`,
        ),
      );
      return {
        status: CalculationStatus.INDETERMINATE,
        statutoryMaximum: ownerPool.limit,
        annualComponents: annual,
        additionalComponents: additional,
        planTermDependentCapacity: 0,
        sharedLimits,
        diagnostics,
      };
    }
  }

  if (!context.parameters.ira.universalEligibility) {
    if (person.coveredByEmployerRetirementPlan === undefined) {
      ownerPool.blocked = true;
      diagnostics.push(
        diagnostic(
          "EMPLOYER_PLAN_COVERAGE_REQUIRED_FOR_HISTORICAL_IRA_ELIGIBILITY",
          DiagnosticSeverity.ERROR,
          "Employer-plan coverage is required to resolve IRA eligibility before universal IRA eligibility began in 1982.",
          `persons.${person.id}.coveredByEmployerRetirementPlan`,
        ),
      );
      return {
        status: CalculationStatus.INDETERMINATE,
        statutoryMaximum: ownerPool.limit,
        annualComponents: annual,
        additionalComponents: additional,
        planTermDependentCapacity: 0,
        sharedLimits,
        diagnostics,
      };
    }
    if (person.coveredByEmployerRetirementPlan) {
      return emptyOutcome(account, CalculationStatus.INELIGIBLE, 0, [
        diagnostic(
          "PRE_1982_ACTIVE_PARTICIPANT_IRA_INELIGIBLE",
          DiagnosticSeverity.INFO,
          "Before 1982, an active participant in an employer retirement plan generally could not make the modeled deductible IRA contribution.",
          `accounts.${account.id}`,
        ),
      ]);
    }
  }

  if (ownerPool.limit === null || compensationPool.limit === null) {
    ownerPool.blocked = true;
    diagnostics.push(
      context.section220TwiceTheLesserOwners.has(person.id)
        ? diagnostic(
            "SPOUSAL_IRA_LIMIT_INDETERMINATE_UNDER_SECTION_220",
            DiagnosticSeverity.ERROR,
            `Former IRC 220(b)(1)(A) caps a one-earner couple's ${context.taxYear} deduction at twice the amount paid to whichever of the two individual retirement accounts received the lesser amount, subject to the 15 percent and $1,750 ceilings in subparagraphs (B) and (C). That is a joint ceiling keyed to how the couple split their contributions rather than a limit on this account: a worker who contributes nothing to their own account makes the spousal amount deductible only to zero, and the maximizing split is equal halves of $875. No per-account figure reproduces the rule, so no maximum is reported for this account rather than an invented one.`,
            `persons.${person.id}`,
            "Former IRC 220(b)(1)(A); Tax Reform Act of 1976, Pub. L. 94-455 s.1501",
          )
        : diagnostic(
            "BIRTH_YEAR_OR_DATE_REQUIRED_FOR_IRA_LIMIT",
            DiagnosticSeverity.ERROR,
            "Birth year or birth date is required to determine the IRA catch-up limit.",
            `persons.${person.id}`,
          ),
    );
    reportPoolWithoutConsuming(ownerPool, sharedLimits);
    reportPoolWithoutConsuming(compensationPool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const amount = takeAcrossPools(
    [ownerPool, compensationPool],
    minMoney(poolRemaining(ownerPool), poolRemaining(compensationPool)),
    sharedLimits,
  );

  if (deductionPool.limit === null) {
    additional.unclassifiedIra = amount;
    annual.unclassifiedIra = roundMoney(annual.unclassifiedIra + amount);
    diagnostics.push(
      diagnostic(
        "TRADITIONAL_IRA_DEDUCTIBILITY_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        "The total traditional IRA contribution limit is known, but employer-plan coverage and/or traditional-IRA MAGI is required to classify it as deductible or nondeductible.",
        `accounts.${account.id}`,
      ),
    );
    reportPoolWithoutConsuming(deductionPool, sharedLimits);
  } else {
    const deductibleAdditional = minMoney(amount, poolRemaining(deductionPool));
    if (deductibleAdditional > 0) consumeExactFromPool(deductionPool, deductibleAdditional, sharedLimits);
    else reportPoolWithoutConsuming(deductionPool, sharedLimits);
    additional.deductibleIra = deductibleAdditional;
    additional.nondeductibleIra = roundMoney(amount - deductibleAdditional);
    annual.deductibleIra = roundMoney(annual.deductibleIra + deductibleAdditional);
    annual.nondeductibleIra = roundMoney(annual.nondeductibleIra + amount - deductibleAdditional);
    if (additional.nondeductibleIra > 0 && !context.parameters.ira.nondeductibleContributionAvailable) {
      diagnostics.push(
        diagnostic(
          "NONDEDUCTIBLE_IRA_NOT_AVAILABLE_FOR_YEAR",
          DiagnosticSeverity.ERROR,
          "A nondeductible traditional IRA contribution was not available in this historical tax year.",
          `accounts.${account.id}`,
        ),
      );
    }
  }

  return {
    status: accountStatusFromDiagnostics(CalculationStatus.DETERMINATE, diagnostics),
    statutoryMaximum: ownerPool.limit,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
  };
}

function allocateRothIra(
  context: CalculationContext,
  account: NormalizedAccount,
  _traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const person = context.persons.get(account.ownerId)!;
  const ownerPool = context.iraOwnerPools.get(account.ownerId)!;
  const compensationPool = context.iraCompensationPools.get(ownerPool.compensationPoolId)!;
  const rothPool = context.iraRothEligibilityPools.get(account.ownerId)!;

  if (ownerPool.blocked) {
    diagnostics.push(
      diagnostic(
        "IRA_POOL_BLOCKED_BY_PRIOR_INDETERMINATE_ACCOUNT",
        DiagnosticSeverity.ERROR,
        "A higher-priority IRA account has an indeterminate contribution limit.",
        `accounts.${account.id}`,
      ),
    );
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: rothPool.limit,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }
  if (ownerPool.limit === null || compensationPool.limit === null || rothPool.limit === null) {
    ownerPool.blocked = true;
    if (person.magi.rothIra === undefined) {
      diagnostics.push(
        diagnostic(
          "ROTH_IRA_MAGI_REQUIRED",
          DiagnosticSeverity.ERROR,
          "Roth-IRA MAGI is required to determine the direct Roth IRA contribution limit.",
          `persons.${person.id}.magi.rothIra`,
        ),
      );
    }
    if (ownerPool.limit === null) {
      diagnostics.push(
        diagnostic(
          "BIRTH_YEAR_OR_DATE_REQUIRED_FOR_IRA_LIMIT",
          DiagnosticSeverity.ERROR,
          "Birth year or birth date is required to determine the IRA catch-up limit.",
          `persons.${person.id}`,
        ),
      );
    }
    for (const pool of [ownerPool, compensationPool, rothPool]) reportPoolWithoutConsuming(pool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: rothPool.limit,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const amount = takeAcrossPools(
    [ownerPool, compensationPool, rothPool],
    minMoney(poolRemaining(ownerPool), poolRemaining(compensationPool), poolRemaining(rothPool)),
    sharedLimits,
  );
  additional.rothIra = amount;
  annual.rothIra = roundMoney(annual.rothIra + amount);

  return {
    status: CalculationStatus.DETERMINATE,
    statutoryMaximum: rothPool.limit,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
  };
}

function accountPlanCatchUpLimit(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): Money {
  const person = context.persons.get(account.ownerId)!;
  const age = ageAtEndOfTaxYear(person, context.taxYear);
  if (age === null || age < 50 || !traits.permitsAgeCatchUpByStatute) return 0;
  if (traits.isStarter) return context.parameters.starterDeferralOnly.age50CatchUp;
  if (traits.isSimple) {
    if (age >= 60 && age <= 63 && context.parameters.simple.age60To63CatchUp !== null) {
      return context.parameters.simple.age60To63CatchUp;
    }
    if (
      account.planRules.simpleEnhancedLimitEligible &&
      context.parameters.simple.certainPlanAge50CatchUp !== null
    ) {
      return context.parameters.simple.certainPlanAge50CatchUp;
    }
    return context.parameters.simple.generalAge50CatchUp;
  }
  return workplaceCatchUpLimit(context.parameters, person, traits);
}

/**
 * The IRC 402A(e)(3)(A) ceilings for a pension-linked emergency savings account,
 * or null for a year with no encoded limitation.
 *
 * The statute caps the portion of the *account balance* attributable to
 * participant contributions at the lesser of the published figure — clause (i) —
 * and any lower amount the plan sponsor sets — clause (ii), supplied as
 * `planDocumentEmployeeDeferralLimit`. Clause (ii) is a plan term rather than
 * encoded law, so it binds what may be contributed but not the statutory
 * maximum this package reports; the two rooms are kept apart for that reason.
 *
 * The supplied balance is the portion attributable to participant contributions
 * *immediately before the proposed allocation*: it includes amounts contributed
 * earlier in the same year that are still in the account and is net of
 * withdrawals under the plan's accounting. IRC 402A(e)(7) requires the plan to
 * permit withdrawal at least monthly, and the Department of Labor's PLESA
 * guidance states a plan may not impose a separate annual PLESA contribution
 * limit, so a year's gross contributions may exceed the cap once the balance has
 * been drawn down. A reading of the field as an opening or prior-year balance
 * could not express that without a withdrawal input the package does not have.
 */
interface PensionLinkedEmergencySavingsCaps {
  /** The clause (i) published figure, before any lower sponsor amount. */
  statutoryCap: Money;
  /** The lesser of clause (i) and the clause (ii) sponsor amount. */
  effectiveCap: Money;
  /** Participant-contribution balance immediately before this allocation. */
  balance: Money;
  /** What may still be contributed: the effective cap less that balance. */
  plesaRoom: Money;
  /** Room under clause (i) alone, for the reported statutory maximum. */
  statutoryPlesaRoom: Money;
}

function pensionLinkedEmergencySavingsCaps(
  context: CalculationContext,
  account: NormalizedAccount,
): PensionLinkedEmergencySavingsCaps | null {
  const statutoryCap = context.parameters.pensionLinkedEmergencySavingsBalanceCap402A;
  if (statutoryCap === null) return null;
  // `== null` rather than `=== undefined`: an explicitly supplied null means the
  // sponsor set no clause (ii) amount, exactly as omitting the field does. Read
  // as a number it would pass through money() as zero and bar every contribution
  // to the account, which is not what a caller serialising an absent value from
  // a nullable column is saying — and PHP's `?? null` already read it that way,
  // so the two engines answered the same input differently.
  const sponsorCap = account.planRules.planDocumentEmployeeDeferralLimit;
  const effectiveCap =
    sponsorCap == null
      ? statutoryCap
      : minMoney(
          statutoryCap,
          money(sponsorCap, `${account.id}.planDocumentEmployeeDeferralLimit`),
        );
  const balance = money(
    account.planRules.pensionLinkedEmergencySavingsParticipantContributionBalance,
    `${account.id}.pensionLinkedEmergencySavingsParticipantContributionBalance`,
  );
  return {
    statutoryCap,
    effectiveCap,
    balance,
    plesaRoom: nonnegative(effectiveCap - balance),
    statutoryPlesaRoom: nonnegative(statutoryCap - balance),
  };
}

/**
 * IRC 402A(e)(3)(A) as an account-local pool rather than as a deferral limit.
 *
 * Every participant-contribution component draws the same pool — a base
 * elective deferral and an IRC 414(v) catch-up alike — because the statute gates
 * the resulting *balance* and not the character of the contribution that would
 * produce it. Expressing the room as a base deferral limit instead would let a
 * catch-up allocated afterwards carry the balance past the cap.
 *
 * `used` is seeded from the supplied balance and never from
 * `existingContributions`. The balance is stated as of immediately before this
 * allocation and so already reflects contributions made earlier in the year that
 * are still in the account, while existing contributions separately seed the
 * host plan's annual pools; charging both would subtract the same dollars twice.
 */
function pensionLinkedEmergencySavingsPool(
  account: NormalizedAccount,
  caps: PensionLinkedEmergencySavingsCaps,
): LimitPool {
  return {
    id: `plesa402Ae3:${account.id}`,
    legalLimit: "IRC 402A(e)(3)(A) participant-contribution balance cap",
    limit: caps.effectiveCap,
    usage: settled(caps.balance),
  };
}

function baseDeferralLimitForAccount(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): Money | null {
  if (traits.isPlesa) {
    // The IRC 402A(e)(3)(A) room is enforced as an account-local pool that both
    // the base and the catch-up allocation draw, not as a deferral limit, so
    // what governs here is the host plan's own dollar deferral limit. A year
    // that encodes no cap has no such account at all, and returning null there
    // keeps the account indeterminate rather than letting it defer under the
    // host limit alone.
    //
    // Which host limit that is turns on the host. An IRC 457(b) deferral is not
    // among the elective deferrals IRC 402(g)(3) enumerates, so an
    // IRC 402A(f)(1)(C) account runs against the IRC 457(e)(15) applicable
    // dollar amount that IRC 457(b)(2)(A) imposes rather than IRC 402(g)(1).
    // The two figures happen to be equal for every year a pension-linked
    // emergency savings account has been available, so this branch is not
    // observable as a dollar difference -- only as which pool the contribution
    // is drawn from.
    if (context.parameters.pensionLinkedEmergencySavingsBalanceCap402A === null) return null;
    return traits.family === "section457"
      ? context.parameters.section457b.baseDeferralLimit
      : context.parameters.electiveDeferral402g;
  }
  if (traits.isStarter) return context.parameters.starterDeferralOnly.baseDeferralLimit;
  if (traits.isSimple) {
    if (
      account.planRules.simpleEnhancedLimitEligible &&
      context.parameters.simple.certainPlanEnhancedSalaryReductionLimit !== null
    ) {
      return context.parameters.simple.certainPlanEnhancedSalaryReductionLimit;
    }
    return context.parameters.simple.salaryReductionLimit;
  }
  return context.parameters.electiveDeferral402g;
}

function special403bCatchUpLimit(parameters: YearParameters, account: NormalizedAccount): Money {
  const input = account.planRules.special403bCatchUp;
  if (!input?.eligible) return 0;
  const limits = parameters.special403b15YearCatchUp;
  const lifetimeRemaining = nonnegative(
    limits.lifetimeLimit - money(input.priorSpecialCatchUpUsed, `${account.id}.priorSpecialCatchUpUsed`),
  );
  const serviceRemaining = nonnegative(
    limits.serviceLimitPerYear * input.yearsOfService -
      money(input.priorElectiveDeferrals, `${account.id}.priorElectiveDeferrals`),
  );
  return floorMoney(minMoney(limits.annualLimit, lifetimeRemaining, serviceRemaining));
}

type CatchUpTaxTreatment = "pretax" | "roth" | "unavailable" | "unknown";

/**
 * How a catch-up on this account is taxed, and whether one may be allocated at
 * all, with the two IRC 414(v)(7)(A) questions asked in the order that keeps each
 * from swallowing the other.
 *
 * An amount already recorded on *this* account is settled first: it is not a
 * catch-up the engine is classifying but a completed contribution the supplied
 * wages condemn, so nothing later in the function can change the answer.
 *
 * A *sibling* account's unreconciled amount is asked last, and only where it
 * could change something. It is a claim about capacity rather than about tax
 * character, so it cannot displace this account's own classification: an account
 * that still needs its own employer's wages must be told so in the same pass,
 * rather than discovering it on a second round trip after the sibling is fixed.
 * And it is irrelevant to an account that could not take a catch-up anyway --
 * one whose plan offers no Roth catch-up above the threshold, or which the year
 * gives no catch-up amount at all -- where reporting it would turn a knowable
 * determinate answer into an unknown for a reason that does not reach it.
 */
function catchUpTaxTreatment(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  diagnostics: Diagnostic[],
  availableCatchUp: Money | null = null,
): CatchUpClassification {
  const blocked: CatchUpClassification = {
    treatment: "unknown",
    reportsHighWageRothAllocation: false,
  };
  if (appendHighWageExistingPreTaxCatchUpDiagnostic(context, account, traits, diagnostics)) {
    return blocked;
  }
  // Classified with its success diagnostic withheld, because both the capacity
  // gate and the sibling block below can still take the allocation away. An
  // account must not report both that its catch-up was allocated as Roth and
  // that no catch-up was allocated.
  //
  // This runs whatever room is left. Classification is not only a choice between
  // Roth and pre-tax for an amount about to be allocated: where the account
  // carries an existing pre-tax IRC 414(v) catch-up, it is also what adjudicates
  // that completed contribution, and the prior-year wages stay load-bearing for
  // it after the room for a new one is gone.
  const classification = classifyCatchUpTaxTreatment(context, account, traits, diagnostics);
  // "unavailable" means the plan offers no Roth catch-up above the threshold, so
  // this account has no capacity for the pool doubt to reach. Everything else --
  // including a treatment still unknown for want of this account's own wages --
  // keeps the block, so a caller is told about both in one pass rather than
  // finding the second after fixing the first.
  if (classification.treatment === "unavailable") return classification;

  // What remains below is about allocating new catch-up, so neither is asked of
  // an account with no room to allocate into. `availableCatchUp` is the amount
  // that would be taken if the classification allowed it, already bounded by the
  // plan limit, the existing components and remaining compensation; `null` means
  // the caller established there was some before calling, which is what the two
  // IRC 457 sites do.
  //
  // The nominal plan catch-up limit is not that test. An account whose base
  // deferral consumed its compensation still has a positive plan limit, and
  // reporting the sibling-pool doubt against it made the account indeterminate
  // without changing a number -- reconciling the sibling cannot create
  // compensation here. This is the principle the age diagnostic above already
  // follows, and the one that makes both IRC 457 sites ask for a treatment only
  // where catch-up room survives.
  if (availableCatchUp !== null && availableCatchUp <= 0) return classification;

  // Appends where the doubt can still change this account's answer, and does not
  // take the allocation away when it does. The guaranteed room is drawn either
  // way -- `takeFromPool` will not exceed it -- so returning `blocked` here would
  // withhold capacity that exists under every reading of the facts on the ground
  // that some further capacity does not. The ERROR is what makes the account
  // indeterminate; the amount it can be sure of is still allocated.
  appendSiblingCatchUpPoolBlockDiagnostic(context, account, traits, availableCatchUp, diagnostics);
  return classification;
}

/**
 * The IRC 414(v)(7)(A) classification, and whether taking it would be worth
 * announcing. The two are separate because the announcement is only correct once
 * nothing further can withdraw the allocation, and the sibling-pool block still
 * can.
 */
interface CatchUpClassification {
  treatment: CatchUpTaxTreatment;
  /** The high-wage path forced Roth treatment and the plan offers it. */
  reportsHighWageRothAllocation: boolean;
}

function appendHighWageRothCatchUpAllocatedDiagnostic(
  context: CalculationContext,
  account: NormalizedAccount,
  diagnostics: Diagnostic[],
): void {
  const threshold = context.parameters.rothCatchUpPriorYearFicaWageThreshold!;
  diagnostics.push(
    diagnostic(
      "HIGH_WAGE_CATCH_UP_ALLOCATED_AS_ROTH",
      DiagnosticSeverity.INFO,
      `Prior-year FICA wages exceeded $${threshold.toLocaleString()}, so the age-based catch-up is allocated as Roth.`,
      `accounts.${account.id}`,
      "IRC 414(v)(7)",
    ),
  );
}

function classifyCatchUpTaxTreatment(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  diagnostics: Diagnostic[],
): CatchUpClassification {
  const person = context.persons.get(account.ownerId)!;
  const settled = (treatment: CatchUpTaxTreatment): CatchUpClassification => ({
    treatment,
    reportsHighWageRothAllocation: false,
  });
  const defaultTreatment = accountUsesRothEmployeeContributions(account, traits) ? "roth" : "pretax";
  const threshold = context.parameters.rothCatchUpPriorYearFicaWageThreshold;
  if (
    threshold === null ||
    traits.family === "simple" ||
    traits.isSarsep ||
    // IRC 414(v)(7)(A) requires a high-wage participant's catch-up to be a
    // designated Roth contribution, and that is the only thing it does. It can
    // therefore have exactly two effects: force Roth treatment where the
    // default would have been pre-tax, and -- because it makes the catch-up
    // available "only if" the contribution is a designated Roth contribution --
    // withdraw the catch-up from a plan that does not offer one. Where the
    // catch-up would be a designated Roth contribution anyway and the plan
    // offers it, neither effect is possible: the outcome is the same on both
    // sides of the threshold, so the prior-year wage figure the test would need
    // is not required and its absence is not a reason to decline the answer.
    //
    // Both halves are load-bearing. A supplied contributionPreference of
    // pretax_first makes the default pre-tax on a designated Roth account type,
    // so the test still has Roth treatment to force. A supplied
    // permitsRothCatchUp of false leaves the two sides genuinely different --
    // the catch-up below the threshold, none above it -- so the wages are
    // genuinely needed and the account stays indeterminate without them.
    //
    // A pension-linked emergency savings account satisfies both halves by
    // statute rather than by supplied fact: IRC 402A(e)(1)(A)(i) treats it "for
    // purposes of this title as a designated Roth account", which is what
    // accountUsesRothEmployeeContributions and accountPermitsRothCatchUp each
    // read off it, so this clause reaches it without naming it.
    //
    // A third condition guards the same claim from the other direction. The two
    // effects above are both about the catch-up this engine would allocate, so
    // reasoning only about them holds only where the catch-up is the engine's to
    // classify. An existing pre-tax IRC 414(v) catch-up is not: it is a
    // completed contribution the caller reports, and IRC 414(v)(7)(A) speaks to
    // whether it was a valid one, which is a question the threshold answers
    // differently on each side. Below it the component stands; above it the
    // additional elective deferrals had to be designated Roth contributions for
    // IRC 414(v)(1) to apply at all. So the wages remain load-bearing whenever
    // one is supplied, and the account keeps saying so rather than reporting a
    // determinate result whose pre-tax component carries an exclusion from gross
    // income the statute may not allow.
    //
    // The IRC 402(g)(7) and IRC 457(b)(3) special catch-ups are deliberately not
    // read here. Each is its own provision rather than an IRC 414(v)(1)
    // additional elective deferral, and IRC 414(v)(7)(A) reaches only the
    // latter.
    (defaultTreatment === "roth" &&
      accountPermitsRothCatchUp(account, traits) &&
      account.existingContributions.employeePreTaxCatchUp === 0) ||
    accountPlanCatchUpLimit(context, account, traits) === 0
  ) {
    return settled(defaultTreatment);
  }
  if (account.planRules.isSelfEmployedOwner) return settled(defaultTreatment);
  if (account.employerId === undefined) {
    diagnostics.push(
      diagnostic(
        "EMPLOYER_ID_REQUIRED_FOR_ROTH_CATCH_UP_WAGE_TEST",
        DiagnosticSeverity.ERROR,
        "An employerId is required to apply the prior-year FICA-wage test for catch-up contributions.",
        `accounts.${account.id}.employerId`,
      ),
    );
    return settled("unknown");
  }
  const wages = person.priorYearFicaWagesByEmployer[account.employerId];
  if (wages === undefined) {
    diagnostics.push(
      diagnostic(
        "PRIOR_YEAR_FICA_WAGES_REQUIRED_FOR_ROTH_CATCH_UP_CLASSIFICATION",
        DiagnosticSeverity.ERROR,
        `Prior-year FICA wages from employer ${account.employerId} are required to classify catch-up contributions.`,
        `persons.${person.id}.priorYearFicaWagesByEmployer.${account.employerId}`,
      ),
    );
    return settled("unknown");
  }
  if (wages <= threshold) return settled(defaultTreatment);

  if (!accountPermitsRothCatchUp(account, traits)) {
    diagnostics.push(
      diagnostic(
        "HIGH_WAGE_CATCH_UP_REQUIRES_ROTH_BUT_PLAN_DOES_NOT_OFFER_IT",
        DiagnosticSeverity.WARNING,
        `Prior-year FICA wages exceeded $${threshold.toLocaleString()}; no catch-up amount was allocated because the supplied plan rules do not permit Roth catch-up contributions.`,
        `accounts.${account.id}.planRules.permitsRothCatchUp`,
        "IRC 414(v)(7)",
      ),
    );
    return settled("unavailable");
  }
  return { treatment: "roth", reportsHighWageRothAllocation: true };
}

/**
 * Reports an existing pre-tax IRC 414(v) catch-up that the participant's own
 * prior-year wages say was not permitted, and says whether it found one.
 *
 * Where those wages from the employer sponsoring the plan exceed the
 * IRC 414(v)(7)(A) threshold, IRC 414(v)(1) applies "only if" the additional
 * elective deferrals are designated Roth contributions. A pre-tax amount already
 * recorded on the account is therefore not an additional elective deferral the
 * paragraph permits -- and unlike the classification question the wage figure
 * usually answers, nothing here is missing. The supplied facts say directly that
 * the contribution was not one IRC 414(v) allows.
 *
 * Retaining it and reporting a determinate result put an exclusion from gross
 * income into federalTaxEffects that the statute does not allow, which is a wrong
 * number rather than an absent warning. The component is still carried for audit,
 * and no further catch-up is allocated until the caller reconciles the
 * classification: whether the amount counts against the IRC 414(v)(2)(B) limit at
 * all is exactly what is in doubt, so the room left above it is not something to
 * state. That is the treatment 26 CFR 1.457-5 already receives here for its own
 * mutually exclusive methods.
 *
 * The amount is not reclassified as Roth. The caller stated a statutory
 * provenance through the component key, and inventing a different one would
 * answer a question about a completed contribution that only the caller and the
 * plan can answer.
 *
 * Only employeePreTaxCatchUp is read. The IRC 402(g)(7) and IRC 457(b)(3) special
 * catch-ups are each their own provision rather than an IRC 414(v)(1) additional
 * elective deferral, so IRC 414(v)(7)(A) does not reach them.
 *
 * The guards mirror catchUpTaxTreatment's, because the provision reaches the same
 * accounts either way: a year with no encoded threshold, a SIMPLE or SARSEP plan,
 * a self-employed owner with no IRC 3121 wages from a sponsoring employer, and a
 * plan offering no catch-up at all are all outside it.
 *
 * It is called from two places and pushes at most once. catchUpTaxTreatment
 * reaches it on every account whose catch-up it classifies, which is where the
 * blocking behaviour comes from; allocateSection457 reaches it directly because
 * it consults catchUpTaxTreatment only when catch-up room survives, and an
 * existing amount that fills the pool leaves none. The same shape is why #56 made
 * the IRC 457 classification checks independent of remaining room.
 */
/**
 * Which IRC 414(v) catch-up pool an account draws, for the purpose of deciding how
 * far an unreconciled contribution reaches.
 *
 * A qualified plan and an IRC 403(b) share one participant-wide IRC 414(v) pool
 * here; an eligible deferred compensation plan has its own, because IRC 457(b)(3)
 * and the IRC 457(e)(15) ceiling stand apart from IRC 402(g)(1). An amount whose
 * classification is unresolved therefore casts doubt over the pool it was drawn
 * from and no further: whether a pre-tax catch-up in a IRC 401(k) was permitted
 * says nothing about the capacity of a governmental IRC 457(b).
 */
function catchUpPoolFamily(traits: AccountTraits): "section457" | "qualified" {
  return traits.family === "section457" ? "section457" : "qualified";
}

/**
 * The facts an existing pre-tax IRC 414(v) catch-up needs for IRC 414(v)(7)(A) to
 * condemn it, or null where the provision does not reach this account.
 *
 * Where the participant's prior-year wages from the employer sponsoring the plan
 * exceed the IRC 414(v)(7)(A) threshold, IRC 414(v)(1) applies "only if" the
 * additional elective deferrals are designated Roth contributions. A pre-tax
 * amount already recorded is therefore not an additional elective deferral the
 * paragraph permits -- and unlike the classification question the wage figure
 * usually answers, nothing here is missing. The supplied facts say directly that
 * the contribution was not one IRC 414(v) allows.
 *
 * The guards mirror catchUpTaxTreatment's, because the provision reaches the same
 * accounts either way: a year with no encoded threshold, a SIMPLE or SARSEP plan,
 * a self-employed owner with no IRC 3121 wages from a sponsoring employer, and a
 * plan offering no catch-up at all are all outside it.
 *
 * The employer identifier is tested against absence rather than falsiness. An
 * identifier of "0" is one the input contract accepts, and reading it as missing
 * would make this engine disagree with its twin on an accepted input.
 */
function highWageInvalidExistingPreTaxCatchUp(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): { existing: Money; wages: Money; threshold: Money; employerId: string } | null {
  const existing = account.existingContributions.employeePreTaxCatchUp;
  if (existing <= 0) return null;
  const threshold = context.parameters.rothCatchUpPriorYearFicaWageThreshold;
  // IRC 414(v)(7)(C) disapplies subparagraph (A) for an applicable employer plan
  // described in IRC 414(v)(6)(A)(iv), which is "an arrangement meeting the
  // requirements of section 408(k) or (p)" -- a SEP or SARSEP, and a SIMPLE IRA.
  // It is not IRC 401(k)(11): a SIMPLE 401(k) is an employees' trust described in
  // IRC 401(a) and so falls under IRC 414(v)(6)(A)(i), which subparagraph (C)
  // does not reach. That is why the test is the account's family rather than its
  // isSimple trait, which simple401kTraits keeps while deliberately setting the
  // family to qualified_elective.
  if (threshold === null || traits.family === "simple" || traits.isSarsep) return null;
  // IRC 414(v)(6)(C): "This subsection shall not apply to a participant for any
  // year for which a higher limitation applies to the participant under section
  // 457(b)(3)." It disapplies the whole of IRC 414(v), paragraph (7) included, so
  // where the participant-wide resolution selected the special method there is no
  // IRC 414(v)(7)(A) question to ask about this account's existing component --
  // the amount was not an IRC 414(v)(1) additional elective deferral in the first
  // place.
  //
  // The statute says "to a participant", not "to that plan", and read alone it
  // would strip the age-based catch-up from every plan of a participant who used
  // the IRC 457(b)(3) catch-up -- including an unrelated IRC 401(k). It does not.
  // 26 CFR 1.414(v)-1(a)(3) supplies the scope: "**In the case of an applicable
  // employer plan that is a section 457 eligible governmental plan**, the catch-up
  // contributions permitted under this section shall not apply to a catch-up
  // eligible participant for any taxable year for which a higher limitation
  // applies to such participant under section 457(b)(3)." 1.414(v)-1(e)(3)
  // confirms it from the other side: a plan does not fail universal availability
  // "merely because another applicable employer plan that is a section 457
  // eligible governmental plan does not provide for catch-up contributions to the
  // extent set forth in section 414(v)(6)(C)" -- which only has work to do if the
  // other plans keep theirs. Hence the family test here rather than a
  // participant-wide one. It is already reported under
  // SECTION_457_CATCH_UP_RECORDED_UNDER_UNSELECTED_METHOD, which is the right
  // diagnostic; adding the wage one asserted a statutory test that does not reach
  // the year. Returning null here also keeps the account out of the sibling-pool
  // block, because an amount IRC 414(v) never reached cannot have been charged
  // against an IRC 414(v)(2)(B) limit.
  if (
    traits.family === "section457" &&
    context.section457CatchUpResolutions.get(account.ownerId)?.mode === "special"
  ) {
    return null;
  }
  if (account.planRules.isSelfEmployedOwner) return null;
  if (accountPlanCatchUpLimit(context, account, traits) === 0) return null;
  const employerId = account.employerId;
  if (employerId === undefined) return null;
  const person = context.persons.get(account.ownerId)!;
  const wages = person.priorYearFicaWagesByEmployer[employerId];
  if (wages === undefined || wages <= threshold) return null;
  return { existing, wages, threshold, employerId };
}

/**
 * Reports an existing pre-tax IRC 414(v) catch-up that the participant's own
 * prior-year wages say was not permitted, and says whether catch-up allocation is
 * blocked for this account.
 *
 * Retaining such an amount and reporting a determinate result put an exclusion
 * from gross income into federalTaxEffects that the statute does not allow, which
 * is a wrong number rather than an absent warning. The component is still carried
 * for audit, and no further catch-up is allocated until the caller reconciles the
 * classification: whether the amount counts against the IRC 414(v)(2)(B) limit at
 * all is exactly what is in doubt, so the room left above it is not something to
 * state. That is the treatment 26 CFR 1.457-5 already receives here for its own
 * mutually exclusive methods.
 *
 * The amount is not reclassified as Roth. The caller stated a statutory
 * provenance through the component key, and inventing a different one would
 * answer a question about a completed contribution that only the caller and the
 * plan can answer.
 *
 * The doubt is pool-wide rather than account-wide, and that is the point of the
 * second branch. The IRC 414(v) limit is the participant's, not the plan's, and an
 * unreconciled amount has already been charged against it as though it were a
 * valid catch-up. A sibling account drawing the same pool would otherwise be
 * offered the residue -- a $3,000 amount in doubt leaving an apparent $5,000 for
 * the next account -- which states a remaining capacity that is only correct if
 * the contribution in doubt was valid. The block does not cross into the other
 * pool: see catchUpPoolFamily.
 *
 * Only employeePreTaxCatchUp is read. The IRC 402(g)(7) and IRC 457(b)(3) special
 * catch-ups are each their own provision rather than an IRC 414(v)(1) additional
 * elective deferral, so IRC 414(v)(7)(A) does not reach them.
 *
 * It is called from several places and pushes at most once per account.
 * catchUpTaxTreatment reaches it on every account whose catch-up it classifies,
 * which is where the blocking return is consumed; the IRC 457 and pension-linked
 * emergency savings allocators reach it directly, because each can return before
 * consulting catchUpTaxTreatment -- the former when no catch-up room survives, the
 * latter when the IRC 402A(e)(3)(A) balance is not supplied. The same shape is why
 * #56 made the IRC 457 classification checks independent of remaining room.
 */
function appendHighWageExistingPreTaxCatchUpDiagnostic(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  diagnostics: Diagnostic[],
): boolean {
  const own = highWageInvalidExistingPreTaxCatchUp(context, account, traits);
  if (own === null) return false;
  const code = "EXISTING_PRE_TAX_CATCH_UP_ABOVE_ROTH_CATCH_UP_WAGE_THRESHOLD";
  if (!diagnostics.some((entry) => entry.code === code)) {
    diagnostics.push(
      diagnostic(
        code,
        DiagnosticSeverity.ERROR,
        `Existing contributions record $${own.existing.toLocaleString()} of pre-tax age-based catch-up, but prior-year FICA wages from employer ${own.employerId} of $${own.wages.toLocaleString()} exceed the $${own.threshold.toLocaleString()} IRC 414(v)(7)(A) threshold. IRC 414(v)(1) applies "only if" the additional elective deferrals are designated Roth contributions, so a pre-tax amount is not one this participant was permitted to make. The amount is reported as supplied and is not reclassified; no further catch-up is allocated until the classification is reconciled.`,
        `accounts.${account.id}.existingContributions.employeePreTaxCatchUp`,
        "IRC 414(v)(7)(A)",
      ),
    );
  }
  return true;
}

/**
 * Reports that another of the participant's plans holds an unreconciled pre-tax
 * catch-up whose resolution would change how much this account may still take.
 *
 * The IRC 414(v)(2)(B) limit is the participant's rather than the plan's, and an
 * unreconciled amount has already been charged against it as though it were a
 * valid catch-up. The residue a sibling account appears to have is therefore only
 * real if the contribution in doubt was valid -- a $3,000 amount in doubt leaving
 * an apparent $5,000, where the true figure is $5,000 or $8,000 according to an
 * answer nobody has yet given.
 *
 * But that is a reason to withhold the *disputed* part of the capacity, not all
 * of it, and the interval says which part is which. Where this account's demand
 * fits inside the room the pool has under every reading -- 4,000 against a
 * residue of 5,000 or 8,000 -- the answer is the same whichever way the doubt
 * resolves, and reporting it as indeterminate withholds a figure the record
 * fully supports. The test is therefore whether the doubt can move *this*
 * account's draw:
 *
 *     guaranteed = min(demand, remaining.minimum)
 *     possible   = min(demand, remaining.maximum)
 *
 * and only `possible > guaranteed` is a doubt worth reporting. A settled pool
 * never passes it, which is what separates a limit a valid contribution has
 * definitively exhausted -- remaining [0, 0], nothing more to be had by anyone,
 * so no wage fact can change the answer -- from one whose apparent exhaustion
 * rests on the amount in question, remaining [0, 8000], where it still can.
 *
 * A null demand means the caller established there was some without saying how
 * much, which the two IRC 457 sites do; an unbounded demand takes the whole
 * residue, so the test reduces to whether the pool is unsettled at all.
 *
 * The doubt reaches the pool the amount was drawn from and no further; see
 * catchUpPoolFamily.
 */
function appendSiblingCatchUpPoolBlockDiagnostic(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  availableCatchUp: Money | null,
  diagnostics: Diagnostic[],
): boolean {
  const family = catchUpPoolFamily(traits);
  const pool =
    family === "section457"
      ? context.section457CatchUpPools.get(account.ownerId)
      : context.catchUpPools.get(account.ownerId);
  if (pool === undefined || poolUsageSettled(pool)) return false;
  const remaining = poolRemainingInterval(pool);
  if (remaining === null) return false;
  const guaranteedDraw =
    availableCatchUp === null ? remaining.minimum : minMoney(availableCatchUp, remaining.minimum);
  const possibleDraw =
    availableCatchUp === null ? remaining.maximum : minMoney(availableCatchUp, remaining.maximum);
  if (possibleDraw <= guaranteedDraw) return false;
  const blockedBy = [...context.accountsById.values()].find(
    (other) =>
      other.id !== account.id &&
      other.ownerId === account.ownerId &&
      catchUpPoolFamily(ACCOUNT_TRAITS[other.type]) === family &&
      highWageInvalidExistingPreTaxCatchUp(context, other, ACCOUNT_TRAITS[other.type]) !== null,
  );
  if (blockedBy === undefined) return false;

  const code = "CATCH_UP_ALLOCATION_BLOCKED_BY_UNRECONCILED_EXISTING_PRE_TAX_CATCH_UP";
  if (!diagnostics.some((entry) => entry.code === code)) {
    diagnostics.push(
      diagnostic(
        code,
        DiagnosticSeverity.ERROR,
        `$${roundMoney(possibleDraw - guaranteedDraw).toLocaleString()} of further catch-up capacity is unresolved because account ${blockedBy.id} records a pre-tax age-based catch-up that IRC 414(v)(7)(A) did not permit for this participant. The $${guaranteedDraw.toLocaleString()} this account can take under either reading has been allocated; the remainder turns on whether that contribution was valid. The amount a participant may exclude as a catch-up is theirs for the taxable year rather than each plan's: IRC 402(g)(1)(C) capped what an eligible participant's gross income could exclude "without regard to the treatment of the elective deferrals by an applicable employer plan under section 414(v)", and Notice 2023-62 preserves that result after SECURE 2.0 section 603(b)(1) struck the subparagraph. So the doubt follows the participant and crosses employers, and the amount in question has already been charged against that one limit as though it were valid. Reconcile the catch-up components on account ${blockedBy.id} to establish the rest.`,
        `accounts.${account.id}`,
        "IRC 414(v)(7)(A); IRC 402(g)(1)(C) as preserved by Notice 2023-62",
      ),
    );
  }
  return true;
}

/**
 * Whether the plan, as its supplied rules state it, permits a catch-up
 * contribution to be a designated Roth contribution.
 *
 * IRC 414(v)(7)(A) makes a high-wage participant's catch-up available "only if"
 * it is a designated Roth contribution, so a plan that does not offer one takes
 * the catch-up away from that participant rather than making it pre-tax. The
 * fields are read most-specific first: a rule about the catch-up itself, then
 * the account's general Roth permission, then the account type's own character.
 *
 * IRC 402A(e)(1)(A)(i) leaves no such election open on a pension-linked
 * emergency savings account: it treats the account "for purposes of this title
 * as a designated Roth account", so a supplied permission flag states a plan
 * term the statute has already settled and is disregarded here for the same
 * reason accountUsesRothEmployeeContributions disregards a supplied preference.
 * pensionLinkedEmergencySavingsRothTreatmentDiagnostic reports the disregard.
 */
function accountPermitsRothCatchUp(account: NormalizedAccount, traits: AccountTraits): boolean {
  if (traits.isPlesa) return true;
  return (
    account.planRules.permitsRothCatchUp ??
    account.planRules.permitsRothContributions ??
    traits.designatedRoth
  );
}

function accountUsesRothEmployeeContributions(
  account: NormalizedAccount,
  traits: AccountTraits,
): boolean {
  // IRC 402A(e)(1)(A)(i) treats a pension-linked emergency savings account "for
  // purposes of this title as a designated Roth account", so every participant
  // contribution to one is a designated Roth contribution. That is a
  // characteristic of the account, not an allocation choice, so it precedes the
  // caller's preference: a supplied preference or Roth-permission flag states a
  // plan election the statute does not leave open, and honouring it would
  // produce a pre-tax contribution to an account that cannot hold one. The
  // preference keeps its ordinary meaning on every other account type.
  if (traits.isPlesa) return true;
  if (account.planRules.contributionPreference === "roth_first") {
    return account.planRules.permitsRothContributions ?? traits.designatedRoth;
  }
  if (account.planRules.contributionPreference === "pretax_first") return false;
  return traits.designatedRoth;
}

/**
 * The diagnostic that records a caller-supplied tax-treatment election which
 * IRC 402A(e)(1)(A)(i) does not leave open on a pension-linked emergency
 * savings account. The election is disregarded rather than honoured, because
 * honouring it would allocate a pre-tax contribution to an account the statute
 * treats as a designated Roth account; saying so keeps the disregard visible to
 * a caller who supplied the field believing it would take effect.
 */
function pensionLinkedEmergencySavingsRothTreatmentDiagnostic(
  account: NormalizedAccount,
): Diagnostic | null {
  const rules = account.planRules;
  const stated =
    rules.contributionPreference === "pretax_first"
      ? "planRules.contributionPreference is pretax_first"
      : rules.permitsRothContributions === false
        ? "planRules.permitsRothContributions is false"
        : rules.permitsRothCatchUp === false
          ? "planRules.permitsRothCatchUp is false"
          : null;
  if (stated === null) return null;
  return diagnostic(
    "PENSION_LINKED_EMERGENCY_SAVINGS_CONTRIBUTIONS_ARE_ALWAYS_ROTH",
    DiagnosticSeverity.INFO,
    `${stated}, but IRC 402A(e)(1)(A)(i) treats a pension-linked emergency savings account as a designated Roth account for purposes of the whole title, so every participant contribution to it is a designated Roth contribution. The supplied election was disregarded; no amount was allocated as a pre-tax contribution.`,
    `accounts.${account.id}.planRules`,
    "IRC 402A(e)(1)(A)(i)",
  );
}

/**
 * The one diagnostic that says an age-based workplace catch-up cannot be sized
 * because the participant's age is unknown. Shared, because more than one
 * allocation path has to be able to raise it.
 */
function workplaceCatchUpAgeDiagnostic(personId: string): Diagnostic {
  return diagnostic(
    "BIRTH_YEAR_OR_DATE_REQUIRED_FOR_WORKPLACE_CATCH_UP",
    DiagnosticSeverity.ERROR,
    "Birth year or birth date is required to determine the maximum age-based workplace catch-up contribution.",
    `persons.${personId}`,
  );
}

function section457UnreconciledCatchUpDiagnostic(accountId: string): Diagnostic {
  return diagnostic(
    "SECTION_457_CATCH_UP_ALLOCATION_BLOCKED_BY_UNRECONCILED_EXISTING_CONTRIBUTIONS",
    DiagnosticSeverity.ERROR,
    "No further IRC 457 catch-up is allocated while this participant's existing catch-up contributions cannot be reconciled to one permitted method and its participant-wide limit. Review the catch-up components on every IRC 457 account before relying on this account's remaining capacity.",
    `accounts.${accountId}.existingContributions`,
    "26 CFR 1.457-5(a); 26 CFR 1.457-5(b)",
  );
}

function section457MutuallyExclusiveCatchUpDiagnostic(
  accountId: string,
  existingAgeCatchUp: Money,
  existingSpecialCatchUp: Money,
): Diagnostic {
  return diagnostic(
    "SECTION_457_CATCH_UP_METHODS_ARE_MUTUALLY_EXCLUSIVE",
    DiagnosticSeverity.ERROR,
    `Existing contributions record $${existingAgeCatchUp.toLocaleString()} of IRC 414(v) age-based catch-up and $${existingSpecialCatchUp.toLocaleString()} of IRC 457(b)(3) special catch-up for this participant. 26 CFR 1.457-5(a) states the individual limitation as the basic annual limitation plus either the age 50 catch-up or the special 457 catch-up, taking into account the combined annual deferral under all eligible plans, and 1.457-5(b) applies it on an aggregate basis across every employer; IRC 457(e)(18) likewise gives the greater of the two methods and never their sum. Record each existing contribution under the single method actually used.`,
    `accounts.${accountId}.existingContributions`,
    "26 CFR 1.457-5(a); IRC 457(e)(18)",
  );
}

/**
 * Validates the statutory provenance already attached to an account's IRC 457
 * catch-up components. This runs before any PLESA balance-dependent return so
 * malformed existing contributions remain visible even when the account's
 * current-year contribution room cannot be calculated.
 */
function appendSection457ExistingCatchUpDiagnostics(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  resolution: Section457CatchUpResolution,
  ceilings: Section457PlanCeilings,
  diagnostics: Diagnostic[],
): boolean {
  const diagnosticCountBefore = diagnostics.length;
  const accountExistingAgeCatchUp = ageCatchUpDeferrals(account.existingContributions);
  const accountExistingSpecialCatchUp = roundMoney(
    account.existingContributions.special457CatchUp +
      account.existingContributions.special457RothCatchUp,
  );
  const selectedExistingCatchUp =
    resolution.mode === "age"
      ? resolution.existingAgeCatchUp
      : resolution.mode === "special"
        ? resolution.existingSpecialCatchUp
        : 0;
  const unselectedExistingCatchUp = roundMoney(
    resolution.existingAgeCatchUp + resolution.existingSpecialCatchUp - selectedExistingCatchUp,
  );
  const accountSelectedExistingCatchUp =
    resolution.mode === "age"
      ? accountExistingAgeCatchUp
      : resolution.mode === "special"
        ? accountExistingSpecialCatchUp
        : 0;
  const accountUnselectedExistingCatchUp = roundMoney(
    accountExistingAgeCatchUp + accountExistingSpecialCatchUp - accountSelectedExistingCatchUp,
  );
  const selectedMethodName =
    resolution.mode === "age" ? "IRC 414(v) age-based" : "IRC 457(b)(3) special";

  if (
    resolution.existingAgeCatchUp > 0 &&
    resolution.existingSpecialCatchUp > 0 &&
    (accountExistingAgeCatchUp > 0 || accountExistingSpecialCatchUp > 0)
  ) {
    diagnostics.push(
      section457MutuallyExclusiveCatchUpDiagnostic(
        account.id,
        resolution.existingAgeCatchUp,
        resolution.existingSpecialCatchUp,
      ),
    );
  } else if (
    resolution.mode !== "indeterminate" &&
    unselectedExistingCatchUp > 0 &&
    accountUnselectedExistingCatchUp > 0
  ) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_CATCH_UP_RECORDED_UNDER_UNSELECTED_METHOD",
        DiagnosticSeverity.ERROR,
        resolution.mode === "none"
          ? `Existing contributions record $${unselectedExistingCatchUp.toLocaleString()} of IRC 457 catch-up, but no catch-up method applies to this participant for ${context.taxYear}: no plan supplied provides the IRC 457(b)(3) catch-up, and no eligible governmental plan offers an IRC 414(v) amount the participant's age and compensation reach. Record the contribution under the limitation it was actually made under, or supply the facts that make a method apply.`
          : `Existing contributions record $${unselectedExistingCatchUp.toLocaleString()} of catch-up under the method that does not apply. 26 CFR 1.457-4(c)(2)(ii) selects the ${selectedMethodName} catch-up for this participant, and makes that a determination rather than an election: the age 50 catch-up "does not apply for any taxable year for which a higher limitation applies" under the special 457 catch-up, and IRC 414(v)(6)(C) states the same rule from the other side. Record the contribution under the method actually used, or supply the plan facts that make the other one apply.`,
        `accounts.${account.id}.existingContributions`,
        "26 CFR 1.457-4(c)(2)(ii); IRC 414(v)(6)(C)",
      ),
    );
  }
  if (
    resolution.mode !== "indeterminate" &&
    selectedExistingCatchUp > resolution.headroom &&
    accountSelectedExistingCatchUp > 0
  ) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_EXISTING_CATCH_UP_EXCEEDS_PARTICIPANT_LIMIT",
        DiagnosticSeverity.ERROR,
        `Existing contributions record $${selectedExistingCatchUp.toLocaleString()} of ${selectedMethodName} catch-up across this participant's IRC 457 plans, against the $${resolution.headroom.toLocaleString()} that 26 CFR 1.457-5(a) allows above the basic annual limitation. 1.457-5(b) determines the amounts "on an aggregate basis" across the eligible plans of every employer, so the excess is the participant's even where no single plan exceeds its own ceiling.`,
        `accounts.${account.id}.existingContributions`,
        "26 CFR 1.457-5(a); 26 CFR 1.457-5(b)",
      ),
    );
  }
  if (accountExistingAgeCatchUp > 0 && !(traits.governmental457 && traits.permitsAgeCatchUpByStatute)) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_AGE_CATCH_UP_NOT_AVAILABLE_ON_PLAN",
        DiagnosticSeverity.ERROR,
        `Existing contributions record $${accountExistingAgeCatchUp.toLocaleString()} of IRC 414(v) age-based catch-up on this account, but IRC 414(v)(6)(A)(ii) makes only an eligible governmental IRC 457(b) plan an applicable employer plan, so this plan cannot host one. Record the contribution under the limitation it was actually made under.`,
        `accounts.${account.id}.existingContributions`,
        "IRC 414(v)(6)(A)(ii)",
      ),
    );
  }
  if (accountExistingSpecialCatchUp > 0 && !account.planRules.section457SpecialCatchUp?.eligible) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_SPECIAL_CATCH_UP_NOT_PROVIDED_BY_PLAN",
        DiagnosticSeverity.ERROR,
        `Existing contributions record $${accountExistingSpecialCatchUp.toLocaleString()} of IRC 457(b)(3) special catch-up on this account, but no such plan provision was supplied for it. 26 CFR 1.457-5(c) counts the special catch-up only to the extent an annual deferral is made "as a result of plan provisions permitted under Sec. 1.457-4(c)(3)". Supply planRules.section457SpecialCatchUp for this plan, or record the contribution under the limitation it was actually made under.`,
        `accounts.${account.id}.existingContributions`,
        "26 CFR 1.457-5(c)",
      ),
    );
  } else if (accountExistingSpecialCatchUp > ceilings.specialAdditional) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_SPECIAL_CATCH_UP_EXCEEDS_PLAN_AMOUNT",
        DiagnosticSeverity.ERROR,
        `Existing contributions record $${accountExistingSpecialCatchUp.toLocaleString()} of IRC 457(b)(3) special catch-up on this account, above the $${ceilings.specialAdditional.toLocaleString()} its own plan ceiling provides above the basic annual limitation. 26 CFR 1.457-4(c)(3)(i) caps that ceiling at the lesser of twice the IRC 457(e)(15) amount and the (c)(3)(ii) underutilized limitation, and 1.457-5(c) recognises the amount only under the plan whose provisions produce it.`,
        `accounts.${account.id}.existingContributions`,
        "26 CFR 1.457-4(c)(3)(i); 26 CFR 1.457-5(c)",
      ),
    );
  }

  return diagnostics.length > diagnosticCountBefore;
}

/**
 * Largest catch-up amount a PLESA with an unknown participant-contribution
 * balance could still accept after the base deferral that has first priority.
 * A zero upper bound proves the unresolved cross-plan classification cannot
 * suppress an allocation on this account.
 */
function section457PlesaCatchUpCapacityUpperBoundBeforeBalance(
  context: CalculationContext,
  account: NormalizedAccount,
  resolution: Section457CatchUpResolution,
  ceilings: Section457PlanCeilings,
  basePool: LimitPool,
  catchUpPool: LimitPool,
): Money {
  if (!resolution.eligibleAccountIds.has(account.id)) return 0;
  const statutoryPlesaCap = context.parameters.pensionLinkedEmergencySavingsBalanceCap402A;
  if (statutoryPlesaCap === null) return 0;
  const sponsorCap = account.planRules.planDocumentEmployeeDeferralLimit;
  const effectivePlesaCap =
    sponsorCap == null
      ? statutoryPlesaCap
      : minMoney(
          statutoryPlesaCap,
          money(sponsorCap, `${account.id}.planDocumentEmployeeDeferralLimit`),
        );
  const existing = account.existingContributions;
  const regularBeforeEmployee = roundMoney(
    baseElectiveDeferrals(existing) +
      existing.employeeAfterTax +
      existing.employerPreTax +
      existing.employerRoth,
  );
  const baseCapacity = minMoney(
    poolRemaining(basePool),
    nonnegative(ceilings.basicPlanCeiling - regularBeforeEmployee),
    effectivePlesaCap,
  );
  const plesaRoomAfterBase = nonnegative(effectivePlesaCap - baseCapacity);
  const compensationBeforeBase = nonnegative(
    ceilings.includibleCompensation -
      baseElectiveDeferrals(existing) -
      ageCatchUpDeferrals(existing) -
      existing.special457CatchUp -
      existing.special457RothCatchUp -
      existing.employerPreTax -
      existing.employerRoth,
  );
  const compensationAfterBase = nonnegative(compensationBeforeBase - baseCapacity);
  const accountExistingCatchUp =
    resolution.mode === "age"
      ? ageCatchUpDeferrals(existing)
      : resolution.mode === "special"
        ? roundMoney(existing.special457CatchUp + existing.special457RothCatchUp)
        : 0;
  const accountCatchUpCeiling =
    resolution.mode === "age"
      ? ceilings.ageAdditional
      : resolution.mode === "special"
        ? ceilings.specialAdditional
        : 0;

  return minMoney(
    poolRemaining(catchUpPool),
    compensationAfterBase,
    nonnegative(accountCatchUpCeiling - accountExistingCatchUp),
    plesaRoomAfterBase,
  );
}

function allocateBaseAndCatchUp(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  annual: ContributionComponents,
  additional: ContributionComponents,
  diagnostics: Diagnostic[],
  sharedLimits: SharedLimitUse[],
  include415c: boolean,
): { baseAdded: Money; catchUpAdded: Money; compensationRemaining: Money } | null {
  const person = context.persons.get(account.ownerId)!;
  const age = ageAtEndOfTaxYear(person, context.taxYear);
  const anyCatchUpAvailable =
    context.parameters.generalAge50CatchUp > 0 ||
    context.parameters.simple.generalAge50CatchUp > 0 ||
    context.parameters.starterDeferralOnly.age50CatchUp > 0;
  // Only an account that can take an age-based catch-up needs an age.
  const catchUpNeedsAge = age === null && anyCatchUpAvailable && traits.permitsAgeCatchUpByStatute;
  const ageDiagnostic = () => workplaceCatchUpAgeDiagnostic(person.id);
  // A pension-linked emergency savings account is the one family where the age
  // is not always load-bearing: IRC 402A(e)(3)(A) caps the account whatever the
  // participant's age, so where the host's own base capacity already covers the
  // remaining room, no catch-up could change the answer and no birth date is
  // required. The question is therefore asked after the base allocation, once
  // the room it leaves is known.
  if (catchUpNeedsAge && !traits.isPlesa) diagnostics.push(ageDiagnostic());
  const basePool = context.elective402gPools.get(account.ownerId)!;
  const catchUpPool = context.catchUpPools.get(account.ownerId)!;
  const special403bPool = context.special403bCatchUpPools.get(account.ownerId)!;
  const basePlanLimit = baseDeferralLimitForAccount(context, account, traits);
  const planComp = planCompensation(account, person);
  const annualGroup = include415c ? context.annualAdditionsPools.get(groupIdForAccount(account)) : undefined;

  if (basePlanLimit === null || basePool.limit === null || (include415c && annualGroup?.limit === null)) {
    diagnostics.push(
      diagnostic(
        "HISTORICAL_EMPLOYER_PLAN_LIMIT_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        `A universal modern elective-deferral/annual-additions maximum is not encoded for ${context.taxYear}; the historical plan document and applicable law are required.`,
        `accounts.${account.id}`,
      ),
    );
    reportPoolWithoutConsuming(basePool, sharedLimits);
    if (annualGroup) reportPoolWithoutConsuming(annualGroup, sharedLimits);
    return null;
  }

  const existingBaseForAccount = baseElectiveDeferrals(account.existingContributions);
  // IRC 402A(e)(3)(A)(ii) lets the plan sponsor set a lower amount than clause
  // (i), and it is supplied through this same field. But clause (ii) caps the
  // account *balance*, exactly as clause (i) does, and the account-local pool
  // below already enforces it against the balance the caller supplied. Reading
  // it a second time here — as an annual limit on what may be deferred — charges
  // this year's contributions against the sponsor's amount twice, and strands
  // room the statute leaves the participant. A plan may not impose a separate
  // annual limit on a pension-linked emergency savings account in any event.
  const planDocumentEmployeeLimit = traits.isPlesa
    ? undefined
    : account.planRules.planDocumentEmployeeDeferralLimit;
  const employeePlanLimit = minMoney(
    basePlanLimit,
    planDocumentEmployeeLimit ?? basePlanLimit,
    planComp,
  );
  const accountAnnualRemainingBefore = account.planRules.planDocumentAnnualAdditionsLimit === undefined
    ? employeePlanLimit
    : nonnegative(
        money(account.planRules.planDocumentAnnualAdditionsLimit, `${account.id}.planDocumentAnnualAdditionsLimit`) -
          annualAdditionsAmount(account.existingContributions),
      );
  const desiredBase = minMoney(
    nonnegative(employeePlanLimit - existingBaseForAccount),
    accountAnnualRemainingBefore,
  );
  // IRC 402A(e)(3)(A) gates the account balance rather than a deferral limit, so
  // the room is a pool this account's base and catch-up allocations both draw.
  // IRC 414(v)(3)(A)(i) puts catch-up contributions outside IRC 415(c), so only
  // the base draw carries the annual-additions group.
  const plesaCaps = traits.isPlesa ? pensionLinkedEmergencySavingsCaps(context, account) : null;
  const plesaPool = plesaCaps === null ? null : pensionLinkedEmergencySavingsPool(account, plesaCaps);
  const pools: LimitPool[] = [basePool];
  if (annualGroup) pools.push(annualGroup);
  if (plesaPool) pools.push(plesaPool);
  const baseAdded = takeAcrossPools(pools, desiredBase, sharedLimits);
  const useRoth = accountUsesRothEmployeeContributions(account, traits);
  if (useRoth) {
    additional.employeeRothDeferral = baseAdded;
    annual.employeeRothDeferral = roundMoney(annual.employeeRothDeferral + baseAdded);
  } else {
    additional.employeePreTaxDeferral = baseAdded;
    annual.employeePreTaxDeferral = roundMoney(annual.employeePreTaxDeferral + baseAdded);
  }

  let compensationRemaining = nonnegative(
    planComp -
      baseElectiveDeferrals(annual) -
      ageCatchUpDeferrals(annual) -
      annual.special403bCatchUp,
  );

  if (traits.is403b) {
    const specialLimit = special403bCatchUpLimit(context.parameters, account);
    const existingSpecial = account.existingContributions.special403bCatchUp;
    const planDocumentRemaining = account.planRules.planDocumentAnnualAdditionsLimit === undefined
      ? Number.MAX_SAFE_INTEGER
      : nonnegative(
          money(account.planRules.planDocumentAnnualAdditionsLimit, `${account.id}.planDocumentAnnualAdditionsLimit`) -
            annualAdditionsAmount(annual),
        );
    const desiredSpecial = minMoney(
      nonnegative(specialLimit - existingSpecial),
      poolRemaining(special403bPool),
      compensationRemaining,
      planDocumentRemaining,
    );
    if (desiredSpecial > 0 && annualGroup) {
      const specialAdded = takeAcrossPools([annualGroup, special403bPool], desiredSpecial, sharedLimits);
      additional.special403bCatchUp = specialAdded;
      annual.special403bCatchUp = roundMoney(annual.special403bCatchUp + specialAdded);
      compensationRemaining = nonnegative(compensationRemaining - specialAdded);
    }
  }

  // A birth date the base allocation made irrelevant is not demanded: it matters
  // only where the account still has room that a catch-up could fill, which
  // takes both unfilled IRC 402A(e)(3)(A) room and compensation left to defer.
  // The owner's IRC 414(v) pool is deliberately not consulted — it is itself
  // sized from the age being asked for, so it reads as empty exactly when the
  // question is open, and testing it would answer the question with its own
  // premise. `anyCatchUpAvailable`, folded into `catchUpNeedsAge`, is the part
  // of that test the year alone can settle.
  if (
    catchUpNeedsAge &&
    traits.isPlesa &&
    (poolRemaining(plesaPool!) ?? 0) > 0 &&
    compensationRemaining > 0
  ) {
    diagnostics.push(ageDiagnostic());
  }

  const planCatchUpLimit = accountPlanCatchUpLimit(context, account, traits);
  const existingCatchUpForAccount = ageCatchUpDeferrals(account.existingContributions);
  const desiredCatchUp = minMoney(
    nonnegative(planCatchUpLimit - existingCatchUpForAccount),
    compensationRemaining,
  );
  let catchUpAdded = 0;
  const catchUpPools: LimitPool[] = plesaPool ? [catchUpPool, plesaPool] : [catchUpPool];
  // `desiredCatchUp` is passed so the classification is not asked -- and the
  // sibling-pool doubt not reported -- against room this account does not have.
  // The two IRC 457 sites reach their own treatment only where room survives,
  // which is the same gate stated a different way.
  const classification = catchUpTaxTreatment(context, account, traits, diagnostics, desiredCatchUp);
  const treatment = classification.treatment;
  if (treatment === "unknown") {
    reportPoolWithoutConsuming(catchUpPool, sharedLimits);
  } else if (treatment !== "unavailable" && desiredCatchUp > 0) {
    catchUpAdded = takeAcrossPools(catchUpPools, desiredCatchUp, sharedLimits);
    // Announced only now. `desiredCatchUp` is bounded by the plan limit, the
    // existing components and remaining compensation, but not by the owner's
    // shared IRC 414(v) pool, so it stays positive on an account that another
    // plan has already exhausted the pool for. Saying the catch-up "is allocated
    // as Roth" before takeAcrossPools returns is how an account came to report
    // that alongside an employeeRothCatchUp of zero.
    if (catchUpAdded > 0 && classification.reportsHighWageRothAllocation) {
      appendHighWageRothCatchUpAllocatedDiagnostic(context, account, diagnostics);
    }
    if (treatment === "roth") {
      additional.employeeRothCatchUp = catchUpAdded;
      annual.employeeRothCatchUp = roundMoney(annual.employeeRothCatchUp + catchUpAdded);
    } else {
      additional.employeePreTaxCatchUp = catchUpAdded;
      annual.employeePreTaxCatchUp = roundMoney(annual.employeePreTaxCatchUp + catchUpAdded);
    }
    compensationRemaining = nonnegative(compensationRemaining - catchUpAdded);
  }

  return { baseAdded, catchUpAdded, compensationRemaining };
}

function employerContributionMaximum(
  context: CalculationContext,
  account: NormalizedAccount,
  employeeBaseDeferral: Money,
): { amount: Money; known: boolean; description: string } {
  const person = context.persons.get(account.ownerId)!;
  const recognizedCompensation = recognizedCompensationForEmployerAllocation(
    context,
    account,
    person,
  );
  const rules = account.planRules;
  if (rules.expectedEmployerContribution !== undefined) {
    return {
      amount: money(rules.expectedEmployerContribution, `${account.id}.expectedEmployerContribution`),
      known: true,
      description: "caller-supplied employer contribution",
    };
  }

  let amount = 0;
  let hasFormula = false;
  if (rules.employerNonelectiveRate !== undefined) {
    amount +=
      recognizedCompensation *
      rate(rules.employerNonelectiveRate, `${account.id}.employerNonelectiveRate`);
    hasFormula = true;
  }
  if (rules.employerMatchRate !== undefined && rules.employerMatchCompensationFraction !== undefined) {
    const matchableDeferral = minMoney(
      employeeBaseDeferral,
      recognizedCompensation *
        rate(
          rules.employerMatchCompensationFraction,
          `${account.id}.employerMatchCompensationFraction`,
        ),
    );
    amount += matchableDeferral * rate(rules.employerMatchRate, `${account.id}.employerMatchRate`);
    hasFormula = true;
  }
  if (rules.isSelfEmployedOwner && !hasFormula) {
    const netEarnings = money(
      rules.netEarningsFromSelfEmploymentAfterHalfSETax ?? person.compensation.selfEmploymentNetEarnings,
      `${account.id}.netEarningsFromSelfEmploymentAfterHalfSETax`,
    );
    amount = minMoney(
      netEarnings * context.parameters.sep.selfEmployedEquivalentRate,
      recognizedCompensation * context.parameters.sep.maximumEmployerContributionRate,
    );
    hasFormula = true;
  }
  return {
    amount: floorMoney(amount),
    known: hasFormula,
    description: hasFormula ? "supplied employer formula" : "unknown plan/employer formula",
  };
}

function employerContributionUsesRoth(account: NormalizedAccount, traits: AccountTraits): boolean {
  return (
    account.planRules.employerContributionTaxTreatment === "roth" ||
    (traits.family === "sep" && traits.designatedRoth)
  );
}

function validateEmployerRothAvailability(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  diagnostics: Diagnostic[],
): boolean {
  if (!employerContributionUsesRoth(account, traits) || context.taxYear >= 2023) return true;
  diagnostics.push(
    diagnostic(
      "ROTH_EMPLOYER_CONTRIBUTIONS_NOT_AVAILABLE_FOR_YEAR",
      DiagnosticSeverity.ERROR,
      "Employer matching and nonelective contributions designated as Roth are modeled as available beginning in 2023.",
      `accounts.${account.id}.planRules.employerContributionTaxTreatment`,
    ),
  );
  return false;
}

function addEmployerContribution(
  account: NormalizedAccount,
  traits: AccountTraits,
  annual: ContributionComponents,
  additional: ContributionComponents,
  amount: Money,
): void {
  const roth = employerContributionUsesRoth(account, traits);
  if (roth) {
    additional.employerRoth = roundMoney(additional.employerRoth + amount);
    annual.employerRoth = roundMoney(annual.employerRoth + amount);
  } else {
    additional.employerPreTax = roundMoney(additional.employerPreTax + amount);
    annual.employerPreTax = roundMoney(annual.employerPreTax + amount);
  }
}

function simpleEmployerContribution(
  context: CalculationContext,
  account: NormalizedAccount,
  annualEmployeeDeferrals: Money,
  applyCompensationLimitToMatch: boolean,
): { amount: Money; known: boolean; statutoryPotential: Money; diagnostics: Diagnostic[] } {
  const diagnostics: Diagnostic[] = [];
  const person = context.persons.get(account.ownerId)!;
  const compensation = planCompensation(account, person);
  const statutoryLimit = compensationLimit401a17(context, account);
  const cappedCompensation = statutoryLimit === null
    ? compensation
    : Math.min(compensation, statutoryLimit);
  // SIMPLE IRA matching compensation is exempt from §401(a)(17); a SIMPLE 401(k)
  // is a qualified §401(k)(11) plan whose compensation remains subject to it.
  const matchCompensation = applyCompensationLimitToMatch ? cappedCompensation : compensation;
  const matchMaximum = minMoney(annualEmployeeDeferrals, matchCompensation * 0.03);
  const nonelectiveMaximum = cappedCompensation * 0.02;
  const additionalCap = context.parameters.simple.additionalNonelectiveContributionCap ?? 0;
  const additionalStatutoryMaximum = minMoney(additionalCap, cappedCompensation * 0.10);
  const requestedAdditional = money(
    account.planRules.simpleAdditionalNonelectiveContribution,
    `${account.id}.simpleAdditionalNonelectiveContribution`,
  );
  const additional = minMoney(requestedAdditional, additionalStatutoryMaximum);
  if (requestedAdditional > additionalStatutoryMaximum) {
    diagnostics.push(
      diagnostic(
        "SIMPLE_ADDITIONAL_NONELECTIVE_CONTRIBUTION_CAPPED",
        DiagnosticSeverity.WARNING,
        `The additional SIMPLE nonelective contribution was capped at $${additionalStatutoryMaximum.toLocaleString()}, the lesser of the indexed dollar cap and 10% of recognized compensation.`,
        `accounts.${account.id}.planRules.simpleAdditionalNonelectiveContribution`,
      ),
    );
  }

  const method = account.planRules.simpleEmployerContributionMethod;
  let amount = 0;
  let known = true;
  switch (method) {
    case "match_3_percent":
      amount = matchMaximum;
      break;
    case "nonelective_2_percent":
      amount = nonelectiveMaximum;
      break;
    case "custom":
      amount = money(
        account.planRules.simpleCustomEmployerContribution,
        `${account.id}.simpleCustomEmployerContribution`,
      );
      break;
    default:
      known = false;
      diagnostics.push(
        diagnostic(
          "SIMPLE_EMPLOYER_METHOD_IS_PLAN_TERM_DEPENDENT",
          DiagnosticSeverity.WARNING,
          "Select the SIMPLE 3% matching, 2% nonelective, or custom employer method to calculate the usable employer contribution.",
          `accounts.${account.id}.planRules.simpleEmployerContributionMethod`,
        ),
      );
  }
  return {
    amount: floorMoney(amount + additional),
    known,
    statutoryPotential: floorMoney(Math.max(matchMaximum, nonelectiveMaximum) + additionalStatutoryMaximum),
    diagnostics,
  };
}

function allocateQualifiedElective(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const person = context.persons.get(account.ownerId)!;
  const annualGroup = context.annualAdditionsPools.get(groupIdForAccount(account));

  if (traits.isSarsep && context.taxYear >= 1997 && !account.planRules.grandfatheredSarsep) {
    return emptyOutcome(account, CalculationStatus.INELIGIBLE, 0, [
      diagnostic(
        "NEW_SARSEP_NOT_PERMITTED_AFTER_1996",
        DiagnosticSeverity.ERROR,
        "A SARSEP generally must have been established before 1997. Set grandfatheredSarsep for an eligible continuing plan.",
        `accounts.${account.id}.planRules.grandfatheredSarsep`,
      ),
    ]);
  }
  diagnostics.push(...grandfatheredGovernmentalLimitDiagnostics(context, account));
  if (!annualGroup || annualGroup.limit === null) {
    diagnostics.push(
      diagnostic(
        "HISTORICAL_415C_LIMIT_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        `The IRC 415(c) annual-additions limit is not encoded as a universal monetary maximum for ${context.taxYear}.`,
        `accounts.${account.id}`,
      ),
    );
    if (annualGroup) reportPoolWithoutConsuming(annualGroup, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  // IRC 403(b)(2) capped the amount excludable from a tax-sheltered annuity at
  // the exclusion allowance, a third ceiling standing beside IRC 415(c) and
  // IRC 402(g) rather than behind them: IRS Publication 571 (2001) chapter 5
  // computes the maximum amount contributable as the *least* of the three. The
  // allowance was 20 percent of includible compensation for the most recent
  // year of service, multiplied by years of service, reduced by amounts
  // previously excludable. That last term is a lifetime aggregate across the
  // participant's service with the employer, and nothing in ScenarioInput
  // supplies it, so the exclusion allowance cannot be computed and the least of
  // the three cannot be identified. Returning the lesser of IRC 415(c) and
  // IRC 402(g) would state a ceiling that the omitted third term can only
  // lower.
  //
  // EGTRRA (Pub. L. 107-16) section 632(a)(2)(B) struck IRC 403(b)(2) and
  // section 632(a)(3)(E) struck IRC 415(c)(4), whose elections could change
  // which limit bound; section 632(a)(4) applies both "to years beginning after
  // December 31, 2001". 2001 is therefore the last year the allowance governs.
  // The test reads as "<= 2001" because that is the statutory boundary; years
  // before 1987 never reach it, having already returned above with no encoded
  // IRC 415(c) limit at all.
  if (traits.is403b && context.taxYear <= 2001) {
    diagnostics.push(
      diagnostic(
        "PRE_2002_403B_EXCLUSION_ALLOWANCE_NOT_APPLIED",
        DiagnosticSeverity.ERROR,
        `For ${context.taxYear}, IRC 403(b)(2) limited the amount excludable from gross income to the exclusion allowance — 20 percent of includible compensation for the most recent year of service, multiplied by years of service, reduced by amounts previously excludable — and the excludable maximum was the least of that allowance, the IRC 415(c) annual-additions limit, and the IRC 402(g) elective-deferral limit. Amounts previously excludable are a lifetime figure this package does not hold, and the IRC 415(c)(4) alternative elections could change which limit binds, so no universal maximum can be stated. EGTRRA (Pub. L. 107-16) section 632 repealed both for years beginning after December 31, 2001.`,
        `accounts.${account.id}`,
        "IRC 403(b)(2), 415(c)(4) (as in effect before Pub. L. 107-16 section 632)",
      ),
    );
    reportPoolWithoutConsuming(annualGroup, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  // IRC 402A(e)(3)(A) caps the portion of the *account balance* attributable to
  // participant contributions, not the contributions of any one year, and
  // IRC 402A(e)(7) lets the participant withdraw at least monthly, which puts
  // room back. What may still be contributed therefore depends on a balance no
  // other supplied fact expresses, and assuming an empty account would state a
  // ceiling the statute may not allow.
  if (traits.isPlesa) {
    const rothTreatmentDiagnostic = pensionLinkedEmergencySavingsRothTreatmentDiagnostic(account);
    if (rothTreatmentDiagnostic !== null) diagnostics.push(rothTreatmentDiagnostic);
    const balance = account.planRules.pensionLinkedEmergencySavingsParticipantContributionBalance;
    // An explicitly supplied null states no more about the balance than omitting
    // the field does. Reading it as zero would answer a required question the
    // caller did not answer, and would answer it with the one value that yields
    // the largest ceiling the statute allows.
    if (balance == null) {
      // Reached before the return below for the same reason the IRC 457 host
      // reaches it: this path never consults catchUpTaxTreatment, so an existing
      // pre-tax catch-up that IRC 414(v)(7)(A) did not permit would otherwise go
      // unreported while its component and its pre-tax effect stayed in the
      // result. The missing balance and the invalid classification are two
      // separate things the caller has to fix, and naming only one of them sends
      // them back for the other.
      appendHighWageExistingPreTaxCatchUpDiagnostic(context, account, traits, diagnostics);
      diagnostics.push(
        diagnostic(
          "PENSION_LINKED_EMERGENCY_SAVINGS_PRIOR_BALANCE_REQUIRED",
          DiagnosticSeverity.ERROR,
          "IRC 402A(e)(3)(A) caps the portion of a pension-linked emergency savings account balance attributable to participant contributions rather than the contributions of a single year, so the balance already attributable to them is required. Supply planRules.pensionLinkedEmergencySavingsParticipantContributionBalance, using 0 for a newly established account.",
          `accounts.${account.id}.planRules.pensionLinkedEmergencySavingsParticipantContributionBalance`,
          "IRC 402A(e)(3)(A)",
        ),
      );
      reportPoolWithoutConsuming(annualGroup, sharedLimits);
      return {
        status: CalculationStatus.INDETERMINATE,
        statutoryMaximum: null,
        annualComponents: annual,
        additionalComponents: additional,
        planTermDependentCapacity: 0,
        sharedLimits,
        diagnostics,
      };
    }
    const caps = pensionLinkedEmergencySavingsCaps(context, account);
    if (caps !== null) {
      diagnostics.push(
        diagnostic(
          "PENSION_LINKED_EMERGENCY_SAVINGS_BALANCE_CAP_APPLIED",
          DiagnosticSeverity.INFO,
          `$${caps.statutoryCap.toLocaleString()} is the IRC 402A(e)(3)(A)(i) ceiling on the portion of the account balance attributable to participant contributions; $${caps.balance.toLocaleString()} was supplied as attributable to them immediately before this allocation, leaving $${caps.plesaRoom.toLocaleString()}. That room is drawn by base deferrals and by any IRC 414(v) catch-up alike, because IRC 402A(e)(3)(A) gates the resulting balance rather than the character of the contribution. Contributions are Roth by IRC 402A(e)(1)(A)(i); base deferrals count against IRC 402(g) and IRC 415(c), while a catch-up is outside IRC 415(c) under IRC 414(v)(3)(A)(i). Eligibility under IRC 402A(e)(2), automatic enrollment under IRC 402A(e)(4), the withdrawal right under IRC 402A(e)(7), and the IRC 402A(e)(6)(A) rule directing matching contributions to the participant's other account are not modeled.`,
          `accounts.${account.id}`,
          "IRC 402A(e)(3)(A)(i)",
        ),
      );
    }
  }

  const deferral = allocateBaseAndCatchUp(
    context,
    account,
    traits,
    annual,
    additional,
    diagnostics,
    sharedLimits,
    true,
  );
  if (!deferral) {
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const planDocumentAnnualLimit = account.planRules.planDocumentAnnualAdditionsLimit;
  const accountAnnualLimit = minMoney(
    annualGroup.limit,
    planDocumentAnnualLimit ?? annualGroup.limit,
  );
  const employeeBase = baseElectiveDeferrals(annual);
  // Starter 401(k) and deferral-only safe-harbor 403(b) plans take no employer
  // contribution by plan type; a pension-linked emergency savings account takes
  // none because IRC 402A(e)(6)(A) directs any match earned on its contributions
  // to the participant's other account under the plan, and IRC 402A(e)(8)(B)
  // forbids transfers into it from another account.
  const deferralOnly = traits.isStarter || traits.isPlesa;
  let employerKnown = deferralOnly;
  let employerDesired = 0;
  let statutoryEmployerPotential = 0;

  if (deferralOnly) {
    // No employer contribution is allocated to this account.
  } else if (traits.isSimple) {
    const simpleEmployer = simpleEmployerContribution(context, account, employeeBase + ageCatchUpDeferrals(annual), true);
    diagnostics.push(...simpleEmployer.diagnostics);
    employerKnown = simpleEmployer.known;
    employerDesired = nonnegative(
      simpleEmployer.amount - account.existingContributions.employerPreTax - account.existingContributions.employerRoth,
    );
    statutoryEmployerPotential = simpleEmployer.statutoryPotential;
  } else {
    const employer = employerContributionMaximum(context, account, employeeBase);
    employerKnown = employer.known;
    employerDesired = nonnegative(
      employer.amount - account.existingContributions.employerPreTax - account.existingContributions.employerRoth,
    );
  }

  const accountRemainingBeforeEmployer = nonnegative(accountAnnualLimit - annualAdditionsAmount(annual));
  const employerTaxTreatmentAvailable =
    employerDesired === 0 || validateEmployerRothAvailability(context, account, traits, diagnostics);
  const employerAdded = employerKnown && employerTaxTreatmentAvailable
    ? takeAcrossPools([annualGroup], minMoney(employerDesired, accountRemainingBeforeEmployer), sharedLimits)
    : 0;
  if (employerKnown && (employerDesired === 0 || !employerTaxTreatmentAvailable)) {
    reportPoolWithoutConsuming(annualGroup, sharedLimits);
  }
  if (employerAdded > 0) addEmployerContribution(account, traits, annual, additional, employerAdded);

  if (!deferralOnly && account.planRules.permitsAfterTaxEmployeeContributions) {
    const afterTaxCapacity = minMoney(
      poolRemaining(annualGroup),
      nonnegative(accountAnnualLimit - annualAdditionsAmount(annual)),
      deferral.compensationRemaining,
    );
    if (afterTaxCapacity > 0) {
      const afterTaxAdded = takeAcrossPools([annualGroup], afterTaxCapacity, sharedLimits);
      additional.employeeAfterTax = afterTaxAdded;
      annual.employeeAfterTax = roundMoney(annual.employeeAfterTax + afterTaxAdded);
    }
  }

  let planTermDependentCapacity = 0;
  if (!deferralOnly && !employerKnown && !account.planRules.permitsAfterTaxEmployeeContributions) {
    planTermDependentCapacity = minMoney(
      poolRemaining(annualGroup),
      nonnegative(accountAnnualLimit - annualAdditionsAmount(annual)),
    );
    if (planTermDependentCapacity > 0) {
      diagnostics.push(
        diagnostic(
          "PLAN_TERM_DEPENDENT_415C_CAPACITY",
          DiagnosticSeverity.WARNING,
          `$${planTermDependentCapacity.toLocaleString()} of potential annual-additions capacity requires an employer contribution formula or permission for voluntary after-tax contributions.`,
          `accounts.${account.id}.planRules`,
        ),
      );
    }
  }

  const planCatchUp = accountPlanCatchUpLimit(context, account, traits);
  // The reported statutory maximum folds in encoded law and supplied facts but
  // not the plan's own restrictions, so it is built from the statutory host base
  // limit rather than from `employeePlanLimit`.
  const statutoryHostBaseLimit = baseDeferralLimitForAccount(context, account, traits) ?? 0;
  const statutoryHostAnnualCapacity = roundMoney(statutoryHostBaseLimit + planCatchUp);
  let statutoryMaximum: Money;
  if (traits.isPlesa) {
    // A pension-linked emergency savings account is bounded twice over: by what
    // the host plan may take in a year, and by IRC 402A(e)(3)(A), which stops
    // contributions once the participant-contribution *balance* reaches the cap.
    // Reporting the host figure alone would state a ceiling this account can
    // never reach; reporting the room alone would understate it where the
    // balance already holds contributions made this year, since those are
    // themselves part of the annual total. The maximum is therefore the lesser
    // of the host's annual capacity and what the participant has already put in
    // plus the room that remains. Clause (ii) — the plan sponsor's lower amount —
    // is a plan term, so it lowers what may be contributed without lowering the
    // statutory figure reported here.
    const caps = pensionLinkedEmergencySavingsCaps(context, account);
    const existingParticipantContributions = roundMoney(
      baseElectiveDeferrals(account.existingContributions) +
        ageCatchUpDeferrals(account.existingContributions),
    );
    statutoryMaximum =
      caps === null
        ? statutoryHostAnnualCapacity
        : minMoney(
            statutoryHostAnnualCapacity,
            roundMoney(existingParticipantContributions + caps.statutoryPlesaRoom),
          );
  } else if (deferralOnly) {
    statutoryMaximum = statutoryHostAnnualCapacity;
  } else {
    statutoryMaximum = roundMoney(
      accountAnnualLimit +
        planCatchUp +
        (traits.isSimple ? Math.max(0, statutoryEmployerPotential - accountAnnualLimit) : 0),
    );
  }
  return {
    status: accountStatusFromDiagnostics(CalculationStatus.DETERMINATE, diagnostics),
    statutoryMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity,
    sharedLimits,
    diagnostics,
  };
}

function allocateSimple(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();

  const deferral = allocateBaseAndCatchUp(
    context,
    account,
    traits,
    annual,
    additional,
    diagnostics,
    sharedLimits,
    false,
  );
  if (!deferral) {
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const simpleEmployer = simpleEmployerContribution(
    context,
    account,
    baseElectiveDeferrals(annual) + ageCatchUpDeferrals(annual),
    false,
  );
  diagnostics.push(...simpleEmployer.diagnostics);
  let employerAdded = 0;
  if (simpleEmployer.known) {
    employerAdded = nonnegative(
      simpleEmployer.amount - account.existingContributions.employerPreTax - account.existingContributions.employerRoth,
    );
    if (
      employerAdded > 0 &&
      validateEmployerRothAvailability(context, account, traits, diagnostics)
    ) {
      addEmployerContribution(account, traits, annual, additional, employerAdded);
    } else if (diagnostics.some((entry) => entry.code === "ROTH_EMPLOYER_CONTRIBUTIONS_NOT_AVAILABLE_FOR_YEAR")) {
      employerAdded = 0;
    }
  }
  const planTermDependentCapacity = simpleEmployer.known ? 0 : simpleEmployer.statutoryPotential;
  const baseLimit = baseDeferralLimitForAccount(context, account, traits) ?? 0;
  const catchUpLimit = accountPlanCatchUpLimit(context, account, traits);
  const statutoryMaximum = roundMoney(baseLimit + catchUpLimit + simpleEmployer.statutoryPotential);

  return {
    status: accountStatusFromDiagnostics(CalculationStatus.DETERMINATE, diagnostics),
    statutoryMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity,
    sharedLimits,
    diagnostics,
  };
}

function allocateSep(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const person = context.persons.get(account.ownerId)!;
  const group = context.annualAdditionsPools.get(groupIdForAccount(account));
  diagnostics.push(...grandfatheredGovernmentalLimitDiagnostics(context, account));
  if (!group || group.limit === null) {
    diagnostics.push(
      diagnostic(
        "HISTORICAL_SEP_MAXIMUM_REQUIRES_PLAN_FACTS",
        DiagnosticSeverity.ERROR,
        `The SEP maximum cannot be reduced to a universal monetary amount for ${context.taxYear} from the encoded facts.`,
        `accounts.${account.id}`,
      ),
    );
    if (group) reportPoolWithoutConsuming(group, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const compensation = planCompensation(account, person);
  if (
    context.parameters.sep.minimumEligibleCompensation !== null &&
    compensation < context.parameters.sep.minimumEligibleCompensation
  ) {
    diagnostics.push(
      diagnostic(
        "SEP_COMPENSATION_BELOW_MAXIMUM_EXCLUDABLE_THRESHOLD",
        DiagnosticSeverity.WARNING,
        "Compensation is below the statutory amount a SEP document may use to exclude an employee; actual eligibility depends on the plan document.",
        `accounts.${account.id}.planRules.planCompensation`,
      ),
    );
  }
  const recognizedCompensation = recognizedCompensationForEmployerAllocation(
    context,
    account,
    person,
  );
  const planDocumentLimit = account.planRules.planDocumentAnnualAdditionsLimit ?? group.limit;
  const rateBasedMaximum = account.planRules.isSelfEmployedOwner
    ? minMoney(
        compensation * context.parameters.sep.selfEmployedEquivalentRate,
        recognizedCompensation * context.parameters.sep.maximumEmployerContributionRate,
      )
    : recognizedCompensation * context.parameters.sep.maximumEmployerContributionRate;
  const formulaMaximum = floorMoney(
    minMoney(group.limit, planDocumentLimit, rateBasedMaximum),
  );
  const existingEmployer = roundMoney(
    account.existingContributions.employerPreTax + account.existingContributions.employerRoth,
  );
  const desired = nonnegative(formulaMaximum - existingEmployer);
  const employerAdded = desired > 0 && validateEmployerRothAvailability(context, account, traits, diagnostics)
    ? takeAcrossPools([group], desired, sharedLimits)
    : 0;
  if (employerAdded > 0) addEmployerContribution(account, traits, annual, additional, employerAdded);

  return {
    status: CalculationStatus.DETERMINATE,
    statutoryMaximum: formulaMaximum,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
  };
}

function allocateAnnualAdditionsOnly(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const group = context.annualAdditionsPools.get(groupIdForAccount(account));
  diagnostics.push(...grandfatheredGovernmentalLimitDiagnostics(context, account));
  if (!group || group.limit === null) {
    diagnostics.push(
      diagnostic(
        "HISTORICAL_415C_LIMIT_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        `The employer-plan contribution maximum for ${context.taxYear} requires historical plan and compensation facts not represented by a universal encoded limit.`,
        `accounts.${account.id}`,
      ),
    );
    if (group) reportPoolWithoutConsuming(group, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const accountAnnualLimit = minMoney(
    group.limit,
    account.planRules.planDocumentAnnualAdditionsLimit ?? group.limit,
  );
  const employer = employerContributionMaximum(context, account, 0);
  if (employer.known) {
    const existingEmployer = roundMoney(annual.employerPreTax + annual.employerRoth);
    const desired = minMoney(
      nonnegative(employer.amount - existingEmployer),
      nonnegative(accountAnnualLimit - annualAdditionsAmount(annual)),
    );
    const added = desired > 0 && validateEmployerRothAvailability(context, account, traits, diagnostics)
      ? takeAcrossPools([group], desired, sharedLimits)
      : 0;
    if (added > 0) addEmployerContribution(account, traits, annual, additional, added);
  }

  if (account.planRules.permitsAfterTaxEmployeeContributions) {
    const desiredAfterTax = minMoney(
      poolRemaining(group),
      nonnegative(accountAnnualLimit - annualAdditionsAmount(annual)),
    );
    if (desiredAfterTax > 0) {
      const added = takeAcrossPools([group], desiredAfterTax, sharedLimits);
      additional.employeeAfterTax = added;
      annual.employeeAfterTax = roundMoney(annual.employeeAfterTax + added);
    }
  }

  let planTermDependentCapacity = 0;
  if (!employer.known && !account.planRules.permitsAfterTaxEmployeeContributions) {
    planTermDependentCapacity = minMoney(
      poolRemaining(group),
      nonnegative(accountAnnualLimit - annualAdditionsAmount(annual)),
    );
    diagnostics.push(
      diagnostic(
        "EMPLOYER_CONTRIBUTION_REQUIRES_PLAN_FORMULA",
        DiagnosticSeverity.WARNING,
        "The Code-level annual-additions ceiling is known, but the usable contribution requires the plan's employer contribution formula or voluntary after-tax contribution terms.",
        `accounts.${account.id}.planRules`,
      ),
    );
  }

  return {
    status: accountStatusFromDiagnostics(CalculationStatus.DETERMINATE, diagnostics),
    statutoryMaximum: accountAnnualLimit,
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity,
    sharedLimits,
    diagnostics,
  };
}

function allocateSection457(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): AllocationOutcome {
  const diagnostics: Diagnostic[] = [];
  const sharedLimits: SharedLimitUse[] = [];
  const annual = cloneComponentsFromComponents(account.existingContributions);
  const additional = zeroComponents();
  const person = context.persons.get(account.ownerId)!;
  const basePool = context.section457BasePools.get(account.ownerId)!;
  const ageCatchUpPool = context.section457CatchUpPools.get(account.ownerId)!;
  const specialPool = context.section457SpecialCatchUpPools.get(account.ownerId)!;
  const statutoryBase = context.parameters.section457b.baseDeferralLimit;
  const compensationFraction = context.parameters.section457b.includibleCompensationFraction;

  if (statutoryBase === null || compensationFraction === null || basePool.limit === null) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_LIMIT_INDETERMINATE",
        DiagnosticSeverity.ERROR,
        `The 457(b) monetary deferral limit is not available for tax year ${context.taxYear}.`,
        `accounts.${account.id}`,
      ),
    );
    reportPoolWithoutConsuming(basePool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  const resolution = context.section457CatchUpResolutions.get(account.ownerId)!;
  const ceilings = section457PlanCeilings(
    context.parameters,
    person,
    account,
    statutoryBase,
    compensationFraction,
  );
  const accountExistingAgeCatchUp = ageCatchUpDeferrals(account.existingContributions);
  const accountExistingSpecialCatchUp = roundMoney(
    account.existingContributions.special457CatchUp +
      account.existingContributions.special457RothCatchUp,
  );
  const catchUpPool = resolution.mode === "special" ? specialPool : ageCatchUpPool;

  // IRC 402A(e)(3)(A) caps the portion of the *account balance* attributable to
  // participant contributions, not the contributions of any one year, and
  // IRC 402A(e)(7) lets the participant withdraw at least monthly, which puts
  // room back. What may still be contributed therefore depends on a balance no
  // other supplied fact expresses, and assuming an empty account would state a
  // ceiling the statute may not allow.
  if (traits.isPlesa) {
    const rothTreatmentDiagnostic = pensionLinkedEmergencySavingsRothTreatmentDiagnostic(account);
    if (rothTreatmentDiagnostic !== null) diagnostics.push(rothTreatmentDiagnostic);
  }
  // An explicitly supplied null states no more about the balance than omitting
  // the field does. Reading it as zero would answer a required question the
  // caller did not answer, and would answer it with the one value that yields
  // the largest ceiling the statute allows.
  if (traits.isPlesa && account.planRules.pensionLinkedEmergencySavingsParticipantContributionBalance == null) {
    diagnostics.push(
      diagnostic(
        "PENSION_LINKED_EMERGENCY_SAVINGS_PRIOR_BALANCE_REQUIRED",
        DiagnosticSeverity.ERROR,
        "IRC 402A(e)(3)(A) caps the portion of a pension-linked emergency savings account balance attributable to participant contributions rather than the contributions of a single year, so the balance already attributable to them is required. Supply planRules.pensionLinkedEmergencySavingsParticipantContributionBalance, using 0 for a newly established account.",
        `accounts.${account.id}.planRules.pensionLinkedEmergencySavingsParticipantContributionBalance`,
        "IRC 402A(e)(3)(A)",
      ),
    );
    appendHighWageExistingPreTaxCatchUpDiagnostic(context, account, traits, diagnostics);
    const existingCatchUpClassificationInvalid = appendSection457ExistingCatchUpDiagnostics(
      context,
      account,
      traits,
      resolution,
      ceilings,
      diagnostics,
    );
    if (resolution.mode === "indeterminate" && resolution.existingCatchUpClassificationUnreconciled) {
      diagnostics.push(workplaceCatchUpAgeDiagnostic(person.id));
    } else if (
      resolution.existingCatchUpClassificationUnreconciled &&
      !existingCatchUpClassificationInvalid &&
      section457PlesaCatchUpCapacityUpperBoundBeforeBalance(
        context,
        account,
        resolution,
        ceilings,
        basePool,
        catchUpPool,
      ) > 0
    ) {
      diagnostics.push(section457UnreconciledCatchUpDiagnostic(account.id));
    }
    reportPoolWithoutConsuming(basePool, sharedLimits);
    return {
      status: CalculationStatus.INDETERMINATE,
      statutoryMaximum: null,
      annualComponents: annual,
      additionalComponents: additional,
      planTermDependentCapacity: 0,
      sharedLimits,
      diagnostics,
    };
  }

  // IRC 457(b)(2) sets the ceiling as the lesser of the applicable dollar amount
  // and 100 percent of includible compensation. Both are encoded law applied to
  // supplied facts, so both belong in the statutory figure this package reports.
  // A plan-document deferral limit is neither: it is a restriction the plan
  // chose, so it lowers what may actually be deferred without lowering the
  // reported statutory maximum. The qualified-plan path has always drawn that
  // line — README documents it — and drawing it here too is what lets a
  // pension-linked emergency savings account report the same kind of figure on
  // either host. section457PlanCeilings builds it, and the two catch-up amounts
  // above it, from the same facts the resolver used, so an account's own ceiling
  // and the participant's method are never derived from different figures.
  const includibleCompensation = ceilings.includibleCompensation;
  const statutoryHostBaseLimit = ceilings.basicPlanCeiling;
  // On a pension-linked emergency savings account the same input field carries
  // the sponsor's IRC 402A(e)(3)(A)(ii) amount, which caps the account *balance*
  // and is enforced as the account-local pool below. Reading it a second time as
  // an annual deferral limit would charge this year's contributions against it
  // once through the pool's balance and again through the limit, which is what
  // the qualified-plan host does not do either.
  const appliedHostBaseLimit = traits.isPlesa
    ? statutoryHostBaseLimit
    : minMoney(
        statutoryHostBaseLimit,
        account.planRules.planDocumentEmployeeDeferralLimit ?? statutoryHostBaseLimit,
      );
  // IRC 402A(e)(3)(A) gates the account balance rather than a deferral limit, so
  // the room is an account-local pool that this account's base deferral and its
  // catch-up both draw. On this host that is the whole of the account's
  // interaction with IRC 415(c): there is none, because IRC 415(a) does not
  // reach an IRC 457(b) plan.
  const plesaCaps = traits.isPlesa ? pensionLinkedEmergencySavingsCaps(context, account) : null;
  const plesaPool = plesaCaps === null ? null : pensionLinkedEmergencySavingsPool(account, plesaCaps);
  const existingParticipantContributions = roundMoney(
    baseElectiveDeferrals(account.existingContributions) +
      ageCatchUpDeferrals(account.existingContributions) +
      account.existingContributions.special457CatchUp +
      account.existingContributions.special457RothCatchUp,
  );
  if (plesaCaps !== null) {
    diagnostics.push(
      diagnostic(
        "PENSION_LINKED_EMERGENCY_SAVINGS_BALANCE_CAP_APPLIED",
        DiagnosticSeverity.INFO,
        `$${plesaCaps.statutoryCap.toLocaleString()} is the IRC 402A(e)(3)(A)(i) ceiling on the portion of the account balance attributable to participant contributions; $${plesaCaps.balance.toLocaleString()} was supplied as attributable to them immediately before this allocation, leaving $${plesaCaps.plesaRoom.toLocaleString()}. That room is drawn by base deferrals and by a catch-up alike, because IRC 402A(e)(3)(A) gates the resulting balance rather than the character of the contribution. Contributions are Roth by IRC 402A(e)(1)(A)(i) and count against IRC 457(e)(15) rather than IRC 402(g)(1), because IRC 402(g)(3) does not enumerate an IRC 457(b) deferral; IRC 415(c) does not reach an IRC 457(b) plan at all. Eligibility under IRC 402A(e)(2), automatic enrollment under IRC 402A(e)(4), the withdrawal right under IRC 402A(e)(7), and the IRC 402A(e)(6)(A) rule directing matching contributions to the participant's other account are not modeled.`,
        `accounts.${account.id}`,
        "IRC 402A(e)(3)(A)(i)",
      ),
    );
  }

  const existingRegularAccountAmount = roundMoney(
    baseElectiveDeferrals(annual) + annual.employeeAfterTax + annual.employerPreTax + annual.employerRoth,
  );

  const expectedEmployer = money(
    account.planRules.expectedEmployerContribution,
    `${account.id}.expectedEmployerContribution`,
  );
  const existingEmployer = roundMoney(annual.employerPreTax + annual.employerRoth);
  const employerDesired = minMoney(
    nonnegative(expectedEmployer - existingEmployer),
    nonnegative(appliedHostBaseLimit - existingRegularAccountAmount),
  );
  // IRC 402A(e)(6)(A) directs any match earned on emergency-savings
  // contributions to the participant's *other* account under the plan, and
  // IRC 402A(e)(8)(B) bars transfers in, so no employer contribution is ever
  // allocated here.
  if (
    !traits.isPlesa &&
    employerDesired > 0 &&
    validateEmployerRothAvailability(context, account, traits, diagnostics)
  ) {
    const employerAdded = takeAcrossPools([basePool], employerDesired, sharedLimits);
    addEmployerContribution(account, traits, annual, additional, employerAdded);
  }

  const regularBeforeEmployee = roundMoney(
    baseElectiveDeferrals(annual) + annual.employeeAfterTax + annual.employerPreTax + annual.employerRoth,
  );
  const regularDesired = nonnegative(appliedHostBaseLimit - regularBeforeEmployee);
  const regularAdded = takeAcrossPools(
    plesaPool ? [basePool, plesaPool] : [basePool],
    regularDesired,
    sharedLimits,
  );
  if (accountUsesRothEmployeeContributions(account, traits)) {
    additional.employeeRothDeferral = regularAdded;
    annual.employeeRothDeferral = roundMoney(annual.employeeRothDeferral + regularAdded);
  } else {
    additional.employeePreTaxDeferral = regularAdded;
    annual.employeePreTaxDeferral = roundMoney(annual.employeePreTaxDeferral + regularAdded);
  }

  let compensationRemaining = nonnegative(
    includibleCompensation -
      baseElectiveDeferrals(annual) -
      ageCatchUpDeferrals(annual) -
      annual.special457CatchUp -
      annual.special457RothCatchUp -
      annual.employerPreTax -
      annual.employerRoth,
  );
  // IRC 457(e)(18) and 26 CFR 1.457-4(c)(2)(ii) give the participant the greater
  // of the two catch-up methods for the year, never their sum, and 1.457-5(a)
  // applies that choice across every eligible plan at once. It is therefore
  // resolved for the participant before any account allocates -- see
  // resolveSection457CatchUpModes -- so that account priority decides only where
  // interchangeable capacity lands. Deciding it here, from whatever pool
  // capacity survived to this account, let two accounts pick different methods
  // and use both in one year.
  // 26 CFR 1.457-5(c): the special catch-up counts only to the extent the
  // deferral is actually made under a plan providing it, and the age-based
  // method reaches only a governmental plan. An account outside the selected
  // method's set draws nothing, whatever its priority.
  const mayDrawCatchUp = resolution.eligibleAccountIds.has(account.id);

  // Every existing catch-up contribution carries a statutory provenance the
  // caller chose through the component key, so the invariants 26 CFR 1.457-4 and
  // 1.457-5 place on that provenance are checked before any further catch-up is
  // allocated. None of them reduces to a dollar total: each is satisfiable by
  // figures that sit under every ceiling in play, so the generic excess test sees
  // nothing. Where one fails the components are kept for audit, the account is
  // reported indeterminate and no further catch-up is allocated — reclassifying a
  // supplied component would answer a question only the caller can answer.
  // Reached directly rather than through catchUpTaxTreatment: allocateSection457
  // consults that only where catch-up room survives, and an existing amount
  // filling the IRC 414(v) pool leaves none.
  appendHighWageExistingPreTaxCatchUpDiagnostic(context, account, traits, diagnostics);
  const existingCatchUpClassificationInvalid = appendSection457ExistingCatchUpDiagnostics(
    context,
    account,
    traits,
    resolution,
    ceilings,
    diagnostics,
  );
  // The pool's own `used` already carries the participant's aggregate existing
  // catch-up under this method, so it is not subtracted a second time here. The
  // account's own IRC 457(b)(3) allowance is a separate bound: 26 CFR 1.457-5(c)
  // recognises the special catch-up "only to the extent that an annual deferral
  // is made for a participant under an eligible plan as a result of plan
  // provisions permitted under Sec. 1.457-4(c)(3)", so the largest amount the
  // participant is entitled to is not absorbable by a plan whose own provisions
  // are smaller, and what that plan already holds under the provision has spent
  // its share of it. 1.457-5(d) Example 2 is explicit on the first half: the
  // $8,000 figure comes from Plan Y and has to be deferred under Plan Y, even
  // though Plan W also offers the catch-up, at $7,000. Without the second half a
  // Plan W already holding its whole $7,000 could still take the participant's
  // last $1,000 and finish the year $1,000 above its own plan ceiling.
  const accountSpecialRemaining =
    resolution.mode === "special"
      ? nonnegative(ceilings.specialAdditional - accountExistingSpecialCatchUp)
      : Infinity;
  // What decides whether the classification is worth asking for: the most this
  // account could take if every open question resolved in its favour.
  //
  // This deliberately reads the pool's *maximum* remaining rather than its
  // settled remainder, and the difference is the whole point. An unreconciled
  // catch-up on another of the participant's IRC 457 plans no longer fills the
  // pool -- it widens it -- so consulting the pool here no longer mistakes
  // "someone may have spent this" for "this is spent", which is what previously
  // forced the test to ignore the pool altogether and ask for a wage
  // classification the answer could not depend on.
  //
  // So the two exhaustions separate. A valid contribution that consumed the
  // limit leaves remaining [0, 0]: no reconciliation can restore anything, no
  // wage fact can change this account's zero, and asking for one would make an
  // account indeterminate for want of a fact that cannot matter. An
  // unreconciled one leaves remaining [0, 8000]: the maximum is positive, the
  // classification is still load-bearing, and the sibling block below is
  // reachable.
  const poolCatchUpPossible = poolRemainingInterval(catchUpPool)?.maximum ?? Infinity;
  const ownCatchUpRoomWithoutPool = mayDrawCatchUp
    ? minMoney(
        compensationRemaining,
        accountSpecialRemaining,
        plesaPool ? poolRemaining(plesaPool) : Infinity,
        poolCatchUpPossible,
      )
    : 0;
  // The capacity actually reported, which is the room guaranteed under every
  // reading rather than the room that might exist. `takeFromPool` will not
  // exceed it either.
  const monetaryCatchUpCapacityWithoutClassificationBlock = mayDrawCatchUp
    ? minMoney(poolRemainingInterval(catchUpPool)?.minimum ?? null, ownCatchUpRoomWithoutPool)
    : 0;
  const ageCatchUpTreatmentBeforeClassificationBlock =
    resolution.mode === "age" &&
    !existingCatchUpClassificationInvalid &&
    ownCatchUpRoomWithoutPool > 0
      ? catchUpTaxTreatment(context, account, traits, diagnostics).treatment
      : null;
  const catchUpCapacityWithoutClassificationBlock =
    ageCatchUpTreatmentBeforeClassificationBlock === "unknown" ||
    ageCatchUpTreatmentBeforeClassificationBlock === "unavailable"
      ? 0
      : monetaryCatchUpCapacityWithoutClassificationBlock;
  if (ageCatchUpTreatmentBeforeClassificationBlock === "unknown") {
    reportPoolWithoutConsuming(catchUpPool, sharedLimits);
  }
  if (
    resolution.mode !== "indeterminate" &&
    resolution.existingCatchUpClassificationUnreconciled &&
    !existingCatchUpClassificationInvalid &&
    catchUpCapacityWithoutClassificationBlock > 0
  ) {
    diagnostics.push(section457UnreconciledCatchUpDiagnostic(account.id));
  }
  const catchUpPotential =
    mayDrawCatchUp &&
    !existingCatchUpClassificationInvalid &&
    !resolution.existingCatchUpClassificationUnreconciled
      ? catchUpCapacityWithoutClassificationBlock
      : 0;


  // A missing age changes the reported answer only where a catch-up could
  // actually land. Testing that after the base deferral has been allocated --
  // rather than from the account's opening room -- is what separates a question
  // the supplied facts leave open from one they already settle: on an isolated
  // pension-linked emergency savings account the base deferral fills the whole
  // IRC 402A(e)(3)(A) room, so no catch-up of any size fits and the participant's
  // age cannot move a single figure. The age pool is deliberately not consulted:
  // it is zero precisely when the age is unknown, so reading it would answer the
  // question with its own premise.
  const roomACatchUpCouldOccupy = minMoney(
    compensationRemaining,
    plesaPool ? poolRemaining(plesaPool) : Infinity,
  );
  // Kept before allocation spends it, so the report below can say how much of the
  // account's own IRC 457(b)(3) ceiling compensation -- rather than the
  // participant's pool or another account's priority -- is what leaves unfunded.
  const compensationBeforeCatchUp = compensationRemaining;

  if (resolution.mode === "indeterminate") {
    if (
      mayDrawCatchUp &&
      (roomACatchUpCouldOccupy > 0 || accountExistingAgeCatchUp + accountExistingSpecialCatchUp > 0)
    ) {
      diagnostics.push(workplaceCatchUpAgeDiagnostic(person.id));
    }
  } else if (resolution.mode === "special" && catchUpPotential > 0) {
    // IRC 457(b)(3) raises "the ceiling set forth in paragraph (2)" -- a
    // plan-level ceiling on deferrals, not an account-level one -- so it
    // composes with the IRC 402A(e)(3)(A) balance cap in exactly the way
    // IRC 414(v) does, and draws the same account-local room.
    const specialAdded = takeAcrossPools(
      plesaPool ? [specialPool, plesaPool] : [specialPool],
      catchUpPotential,
      sharedLimits,
    );
    // IRC 457(b)(3) supplies the capacity; what decides the tax treatment is the
    // account it lands in. On a pension-linked emergency savings account that is
    // never a choice: IRC 402A(e)(1)(A)(i) treats the account as a designated
    // Roth account for purposes of the title, so every participant contribution
    // to it is Roth whatever limitation it was made under.
    if (accountUsesRothEmployeeContributions(account, traits)) {
      additional.special457RothCatchUp = specialAdded;
      annual.special457RothCatchUp = roundMoney(annual.special457RothCatchUp + specialAdded);
    } else {
      additional.special457CatchUp = specialAdded;
      annual.special457CatchUp = roundMoney(annual.special457CatchUp + specialAdded);
    }
    compensationRemaining = nonnegative(compensationRemaining - specialAdded);
    if (resolution.ageAmount > 0) {
      diagnostics.push(
        diagnostic(
          "SECTION_457_SPECIAL_CATCH_UP_SELECTED_OVER_AGE_CATCH_UP",
          DiagnosticSeverity.INFO,
          "The special last-three-years 457(b) catch-up produced the larger limit; it cannot be combined with the age-based catch-up.",
          `accounts.${account.id}`,
        ),
      );
    }
  } else if (resolution.mode === "age" && catchUpPotential > 0) {
    const classification = catchUpTaxTreatment(context, account, traits, diagnostics);
    const treatment = classification.treatment;
    if (treatment === "unknown") {
      reportPoolWithoutConsuming(ageCatchUpPool, sharedLimits);
    } else if (treatment !== "unavailable") {
      const ageAdded = takeAcrossPools(
        plesaPool ? [ageCatchUpPool, plesaPool] : [ageCatchUpPool],
        catchUpPotential,
        sharedLimits,
      );
      if (ageAdded > 0 && classification.reportsHighWageRothAllocation) {
        appendHighWageRothCatchUpAllocatedDiagnostic(context, account, diagnostics);
      }
      if (treatment === "roth") {
        additional.employeeRothCatchUp = ageAdded;
        annual.employeeRothCatchUp = roundMoney(annual.employeeRothCatchUp + ageAdded);
      } else {
        additional.employeePreTaxCatchUp = ageAdded;
        annual.employeePreTaxCatchUp = roundMoney(annual.employeePreTaxCatchUp + ageAdded);
      }
      compensationRemaining = nonnegative(compensationRemaining - ageAdded);
    }
  }
  // The catch-up this account may reach for the year, as a ceiling rather than
  // as whatever survived allocation. Built from residual capacity it shrank as
  // other accounts spent the pool, so an account holding existing IRC 457(b)(3)
  // contributions reported a maximum smaller than what it already held and
  // tripped the excess diagnostic by exactly that amount.
  //
  // It is bounded by the *plan's* own ceiling as well as the participant's.
  // 26 CFR 1.457-5(d) Example 2 states both figures for the same participant and
  // keeps them apart: the individual limitation is $23,000, which "is the
  // catch-up amount applicable to Participant E under Plan Y", while Plan W --
  // whose own underutilized limitation is $7,000 -- separately permits "$22,000
  // to Plan W and none to any of the other three plans". Reporting the
  // participant-wide amount on every plan turned each of the four into the
  // largest of them.
  const accountCatchUpCeiling =
    resolution.mode === "special"
      ? ceilings.specialAdditional
      : resolution.mode === "age"
        ? ceilings.ageAdditional
        : 0;
  const applicableCatchUpHeadroom = mayDrawCatchUp
    ? minMoney(resolution.headroom, accountCatchUpCeiling)
    : 0;
  // IRC 457(b)(3) replaces the paragraph (2) ceiling rather than adding to it, so
  // the 100-percent-of-compensation bound inside that paragraph does not apply to
  // the ceiling this account reports. A salary reduction is still bounded by the
  // compensation there is to reduce, so where the two diverge the difference is
  // capacity the plan lawfully has and the supplied facts cannot fill: reaching
  // it would take a nonelective employer contribution, which this engine
  // allocates only up to the paragraph (c)(1) ceiling. Saying so is what keeps
  // the statutory maximum and the based-on-inputs maximum legible as different
  // figures rather than looking like an inconsistency.
  const specialCeilingBeyondCompensation = nonnegative(
    nonnegative(applicableCatchUpHeadroom - accountExistingSpecialCatchUp) -
      compensationBeforeCatchUp,
  );
  if (resolution.mode === "special" && mayDrawCatchUp && specialCeilingBeyondCompensation > 0) {
    diagnostics.push(
      diagnostic(
        "SECTION_457_SPECIAL_CATCH_UP_EXCEEDS_DEFERRABLE_COMPENSATION",
        DiagnosticSeverity.INFO,
        `$${specialCeilingBeyondCompensation.toLocaleString()} of the IRC 457(b)(3) plan ceiling this account reports cannot be reached from the supplied facts. IRC 457(b)(3) provides that the paragraph (2) ceiling "shall be" the lesser of twice the IRC 457(e)(15) amount and the sum of the current paragraph (2) ceiling and prior years' unused limitation, replacing the 100-percent-of-includible-compensation bound rather than reapplying it, so the ceiling stands above what compensation alone can fund. A deferral of compensation cannot exceed the compensation, so the difference is reachable only by a nonelective employer contribution, which this engine allocates no higher than the paragraph (c)(1) ceiling. The statutory maximum reports the plan ceiling; the maximum based on inputs reports what the supplied facts fund.`,
        `accounts.${account.id}`,
        "IRC 457(b)(3); 26 CFR 1.457-4(c)(3)(i)",
      ),
    );
  }

  if (!traits.governmental457) {
    diagnostics.push(
      diagnostic(
        "NONGOVERNMENTAL_457B_ASSETS_REMAIN_EMPLOYER_PROPERTY",
        DiagnosticSeverity.INFO,
        "A nongovernmental tax-exempt 457(b) plan is generally unfunded; assets remain subject to the employer's general creditors.",
        `accounts.${account.id}`,
      ),
    );
  }

  return {
    status: accountStatusFromDiagnostics(CalculationStatus.DETERMINATE, diagnostics),
    // The host's own statutory annual capacity, and — for a pension-linked
    // emergency savings account — the IRC 402A(e)(3)(A)(i) room on top of what
    // the participant has already contributed. Only clause (i) is statutory: a
    // sponsor's lower clause (ii) amount is a plan term, so it lowers what may
    // actually be contributed without lowering the figure the statute reports,
    // exactly as on the IRC 401(a) and IRC 403(b) hosts.
    statutoryMaximum: roundMoney(
      plesaCaps === null
        ? statutoryHostBaseLimit + applicableCatchUpHeadroom
        : minMoney(
            statutoryHostBaseLimit + applicableCatchUpHeadroom,
            existingParticipantContributions + plesaCaps.statutoryPlesaRoom,
          ),
    ),
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
  };
}

function allocateDefinedBenefit(context: CalculationContext, account: NormalizedAccount): AllocationOutcome {
  const annualBenefitLimit = context.parameters.definedBenefitAnnualBenefit415b ?? null;
  const diagnostics = [
    diagnostic(
      "DEFINED_BENEFIT_CONTRIBUTION_REQUIRES_ACTUARIAL_VALUATION",
      DiagnosticSeverity.ERROR,
      "A defined-benefit or cash-balance contribution is determined by the plan formula, funding method, assets, assumptions, participant census, and minimum/maximum funding rules; it is not a single statutory contribution limit.",
      `accounts.${account.id}`,
      "IRC 404, 412, 415(b); ERISA funding rules",
    ),
  ];
  if (annualBenefitLimit !== null) {
    diagnostics.push(
      diagnostic(
        "DEFINED_BENEFIT_ANNUAL_BENEFIT_LIMIT_REPORTED",
        DiagnosticSeverity.INFO,
        `The IRC 415(b)(1)(A) limitation on the annual benefit for ${context.taxYear} is $${annualBenefitLimit.toLocaleString()}. It caps the benefit the plan may pay, stated as a straight life annuity beginning between ages 62 and 65, and is neither a contribution ceiling nor a funding figure. IRC 415(b)(2) adjusts it for another benefit form or starting age and IRC 415(b)(5) reduces it for fewer than ten years; neither adjustment is applied here.`,
        `accounts.${account.id}`,
        "IRC 415(b)(1)(A), 415(d)",
      ),
    );
  }
  return {
    ...emptyOutcome(account, CalculationStatus.INDETERMINATE, null, diagnostics),
    definedBenefitDetail: { annualBenefitLimit },
  };
}

function allocateSection457f(account: NormalizedAccount): AllocationOutcome {
  return emptyOutcome(account, CalculationStatus.INDETERMINATE, null, [
    diagnostic(
      "SECTION_457F_HAS_NO_457B_ANNUAL_DEFERRAL_LIMIT",
      DiagnosticSeverity.ERROR,
      "A 457(f) arrangement is an ineligible deferred-compensation arrangement. Tax timing depends on substantial risk of forfeiture and plan terms rather than the 457(b) annual limit.",
      `accounts.${account.id}`,
      "IRC 457(f)",
    ),
  ]);
}

interface NormalizedConversion extends Omit<RothConversionInput, "type"> {
  type: ConversionType;
  inputIndex: number;
}

function normalizeConversions(
  conversionsInput: RothConversionInput[] | undefined,
  persons: Map<string, NormalizedPerson>,
  accountsById: Map<string, NormalizedAccount>,
): NormalizedConversion[] {
  const conversions = (conversionsInput === undefined || conversionsInput === null
    ? []
    : toInputList(conversionsInput)) as RothConversionInput[] | null;
  if (conversions === null) {
    throw new ParameterError("INVALID_CONVERSIONS", "conversions must be an array.");
  }
  const ids = new Set<string>();
  return conversions.map((input, index) => {
    if (input === null || typeof input !== "object") {
      throw new ParameterError("INVALID_CONVERSION", `conversions[${index}] must be an object/associative array.`);
    }
    const id = trimmedIdentifier(input.id);
    if (id === null) {
      throw new ParameterError("CONVERSION_ID_REQUIRED", `conversions[${index}].id is required.`);
    }
    if (ids.has(id)) {
      throw new ParameterError("DUPLICATE_CONVERSION_ID", `Duplicate conversion ID: ${id}`);
    }
    ids.add(id);
    const ownerId = trimmedIdentifier(input.ownerId);
    if (ownerId === null) {
      throw new ParameterError("CONVERSION_OWNER_REQUIRED", `conversions[${index}].ownerId is required.`);
    }
    if (!persons.has(ownerId)) {
      throw new ParameterError(
        "UNKNOWN_CONVERSION_OWNER",
        `Conversion ${id} references unknown owner ${ownerId}.`,
      );
    }
    if (input.sourceAccountId && !accountsById.has(input.sourceAccountId)) {
      throw new ParameterError(
        "UNKNOWN_CONVERSION_SOURCE_ACCOUNT",
        `Conversion ${id} references unknown source account ${input.sourceAccountId}.`,
      );
    }
    booleanFlag(input.otherwiseDistributableAmount, `conversions[${index}].otherwiseDistributableAmount`);
    return {
      ...input,
      id,
      ownerId,
      type: parseConversionType(input.type, input.type !== undefined),
      amount: money(input.amount, `conversions[${index}].amount`),
      afterTaxBasisInConvertedAmount: input.afterTaxBasisInConvertedAmount === undefined
        ? undefined
        : money(input.afterTaxBasisInConvertedAmount, `conversions[${index}].afterTaxBasisInConvertedAmount`),
      aggregateIraBasisOverride: input.aggregateIraBasisOverride === undefined
        ? undefined
        : money(input.aggregateIraBasisOverride, `conversions[${index}].aggregateIraBasisOverride`),
      yearEndAggregateIraValueOverride: input.yearEndAggregateIraValueOverride === undefined
        ? undefined
        : money(input.yearEndAggregateIraValueOverride, `conversions[${index}].yearEndAggregateIraValueOverride`),
      inputIndex: index,
    };
  });
}

function conversionTaxEffects(taxableAmount: Money): FederalTaxEffects {
  const result = zeroTaxEffects();
  result.federalAgiIncrease = taxableAmount;
  result.taxableRothConversion = taxableAmount;
  result.notes.push(
    "A taxable Roth conversion generally increases federal gross income but does not consume an annual contribution limit.",
  );
  return result;
}

function unavailableConversion(
  conversion: NormalizedConversion,
  code: string,
  message: string,
): ConversionCalculationResult {
  return {
    conversionId: conversion.id,
    conversionType: conversion.type,
    ownerId: conversion.ownerId,
    status: CalculationStatus.UNAVAILABLE,
    grossConvertedAmount: conversion.amount,
    taxableAmount: null,
    nontaxableBasisAmount: null,
    consumesAnnualContributionLimit: false,
    federalTaxEffects: zeroTaxEffects(),
    diagnostics: [diagnostic(code, DiagnosticSeverity.ERROR, message, `conversions.${conversion.id}`)],
  };
}

function indeterminateConversion(
  conversion: NormalizedConversion,
  diagnostics: Diagnostic[],
): ConversionCalculationResult {
  return {
    conversionId: conversion.id,
    conversionType: conversion.type,
    ownerId: conversion.ownerId,
    status: CalculationStatus.INDETERMINATE,
    grossConvertedAmount: conversion.amount,
    taxableAmount: null,
    nontaxableBasisAmount: null,
    consumesAnnualContributionLimit: false,
    federalTaxEffects: zeroTaxEffects(),
    diagnostics,
  };
}

function calculateConversions(
  context: CalculationContext,
  conversions: NormalizedConversion[],
  accountResults: AccountCalculationResult[],
): ConversionCalculationResult[] {
  const results = new Map<string, ConversionCalculationResult>();
  const iraConversionsByOwner = new Map<string, NormalizedConversion[]>();

  for (const conversion of conversions) {
    if (conversion.type === ConversionType.IRA_TO_ROTH_IRA) {
      const group = iraConversionsByOwner.get(conversion.ownerId) ?? [];
      group.push(conversion);
      iraConversionsByOwner.set(conversion.ownerId, group);
      continue;
    }
    results.set(conversion.id, calculateNonIraConversion(context, conversion));
  }

  for (const [ownerId, ownerConversions] of iraConversionsByOwner) {
    const ownerResults = calculateIraConversionGroup(context, ownerId, ownerConversions, accountResults);
    for (const result of ownerResults) results.set(result.conversionId, result);
  }

  return conversions.map((conversion) => results.get(conversion.id)!);
}

function calculateNonIraConversion(
  context: CalculationContext,
  conversion: NormalizedConversion,
): ConversionCalculationResult {
  if (conversion.type === ConversionType.QUALIFIED_PLAN_TO_ROTH_IRA) {
    if (context.taxYear < 2008) {
      return unavailableConversion(
        conversion,
        "DIRECT_QUALIFIED_PLAN_TO_ROTH_IRA_NOT_AVAILABLE",
        "A direct qualified-plan rollover to a Roth IRA is modeled as available beginning in 2008.",
      );
    }
    const basis = minMoney(
      conversion.amount,
      money(conversion.afterTaxBasisInConvertedAmount, `${conversion.id}.afterTaxBasisInConvertedAmount`),
    );
    const taxable = roundMoney(conversion.amount - basis);
    return {
      conversionId: conversion.id,
      conversionType: conversion.type,
      ownerId: conversion.ownerId,
      status: CalculationStatus.DETERMINATE,
      grossConvertedAmount: conversion.amount,
      taxableAmount: taxable,
      nontaxableBasisAmount: basis,
      consumesAnnualContributionLimit: false,
      federalTaxEffects: conversionTaxEffects(taxable),
      diagnostics: [],
    };
  }

  if (context.taxYear < 2010) {
    return unavailableConversion(
      conversion,
      "IN_PLAN_ROTH_ROLLOVER_NOT_AVAILABLE",
      "In-plan Roth rollovers are modeled as available beginning in 2010.",
    );
  }
  if (!conversion.sourceAccountId) {
    return indeterminateConversion(conversion, [
      diagnostic(
        "SOURCE_ACCOUNT_REQUIRED_FOR_IN_PLAN_ROTH_ROLLOVER",
        DiagnosticSeverity.ERROR,
        "sourceAccountId is required to verify that the plan permits an in-plan Roth rollover.",
        `conversions.${conversion.id}.sourceAccountId`,
      ),
    ]);
  }
  const source = context.accountsById.get(conversion.sourceAccountId)!;
  if (!source.planRules.permitsInPlanRothRollover) {
    return indeterminateConversion(conversion, [
      diagnostic(
        "PLAN_DOES_NOT_PERMIT_IN_PLAN_ROTH_ROLLOVER",
        DiagnosticSeverity.ERROR,
        "The supplied source plan rules do not permit an in-plan Roth rollover.",
        `accounts.${source.id}.planRules.permitsInPlanRothRollover`,
      ),
    ]);
  }
  if (context.taxYear < 2013 && conversion.otherwiseDistributableAmount !== true) {
    return unavailableConversion(
      conversion,
      "PRE_2013_IN_PLAN_ROLLOVER_REQUIRES_DISTRIBUTABLE_AMOUNT",
      "For 2010-2012, the modeled in-plan Roth rollover amount must otherwise have been distributable.",
    );
  }
  const basis = minMoney(
    conversion.amount,
    money(conversion.afterTaxBasisInConvertedAmount, `${conversion.id}.afterTaxBasisInConvertedAmount`),
  );
  const taxable = roundMoney(conversion.amount - basis);
  return {
    conversionId: conversion.id,
    conversionType: conversion.type,
    ownerId: conversion.ownerId,
    status: CalculationStatus.DETERMINATE,
    grossConvertedAmount: conversion.amount,
    taxableAmount: taxable,
    nontaxableBasisAmount: basis,
    consumesAnnualContributionLimit: false,
    federalTaxEffects: conversionTaxEffects(taxable),
    diagnostics: [],
  };
}

function calculateIraConversionGroup(
  context: CalculationContext,
  ownerId: string,
  conversions: NormalizedConversion[],
  accountResults: AccountCalculationResult[],
): ConversionCalculationResult[] {
  if (context.taxYear < 1998) {
    return conversions.map((conversion) =>
      unavailableConversion(
        conversion,
        "ROTH_IRA_CONVERSION_NOT_AVAILABLE",
        "Roth IRA conversions are modeled as available beginning in 1998.",
      ),
    );
  }

  const person = context.persons.get(ownerId)!;
  if (context.taxYear < 2010) {
    if (
      context.filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY &&
      livedWithSpouse(person, context.filingStatus)
    ) {
      return conversions.map((conversion) =>
        unavailableConversion(
          conversion,
          "PRE_2010_MFS_ROTH_CONVERSION_NOT_ELIGIBLE",
          "Before 2010, a married-filing-separately taxpayer who lived with a spouse during the year is modeled as ineligible for a Roth IRA conversion.",
        ),
      );
    }
    if (person.magi.rothConversion === undefined) {
      return conversions.map((conversion) =>
        indeterminateConversion(conversion, [
          diagnostic(
            "PRE_2010_CONVERSION_MAGI_REQUIRED",
            DiagnosticSeverity.ERROR,
            "Pre-conversion MAGI is required to apply the pre-2010 $100,000 Roth-conversion eligibility limit.",
            `persons.${ownerId}.magi.rothConversion`,
          ),
        ]),
      );
    }
    if (person.magi.rothConversion > 100_000) {
      return conversions.map((conversion) =>
        unavailableConversion(
          conversion,
          "PRE_2010_ROTH_CONVERSION_MAGI_LIMIT_EXCEEDED",
          "The modeled pre-2010 $100,000 MAGI limit for Roth IRA conversions was exceeded.",
        ),
      );
    }
  }

  const ownerAccounts = accountResults.filter((result) => result.ownerId === ownerId);
  const currentNondeductible = ownerAccounts.reduce(
    (sum, result) => sum + result.contributionComponents.nondeductibleIra,
    0,
  );
  const unclassified = ownerAccounts.reduce(
    (sum, result) => sum + result.contributionComponents.unclassifiedIra,
    0,
  );
  if (unclassified > 0) {
    return conversions.map((conversion) =>
      indeterminateConversion(conversion, [
        diagnostic(
          "IRA_CONVERSION_BASIS_INDETERMINATE_FROM_UNCLASSIFIED_CONTRIBUTION",
          DiagnosticSeverity.ERROR,
          "A current-year traditional IRA contribution has unresolved deductibility, so aggregate IRA basis and the conversion's taxable amount are indeterminate.",
          `conversions.${conversion.id}`,
        ),
      ]),
    );
  }

  const firstBasisOverride = conversions.find((conversion) => conversion.aggregateIraBasisOverride !== undefined)
    ?.aggregateIraBasisOverride;
  const firstValueOverride = conversions.find((conversion) => conversion.yearEndAggregateIraValueOverride !== undefined)
    ?.yearEndAggregateIraValueOverride;
  const priorBasis = firstBasisOverride ?? person.traditionalSepSimpleIraBasis;
  const yearEndValue = firstValueOverride ?? person.yearEndTraditionalSepSimpleIraValue;
  if (priorBasis === undefined || yearEndValue === undefined) {
    return conversions.map((conversion) =>
      indeterminateConversion(conversion, [
        diagnostic(
          "AGGREGATE_IRA_BASIS_AND_YEAR_END_VALUE_REQUIRED",
          DiagnosticSeverity.ERROR,
          "Aggregate traditional/SEP/SIMPLE IRA basis and December 31 value are required for the Form 8606 pro-rata calculation; explicitly provide zero when applicable.",
          `persons.${ownerId}`,
          "Form 8606",
        ),
      ]),
    );
  }
  const inconsistentOverride = conversions.some(
    (conversion) =>
      (conversion.aggregateIraBasisOverride !== undefined && conversion.aggregateIraBasisOverride !== firstBasisOverride) ||
      (conversion.yearEndAggregateIraValueOverride !== undefined &&
        conversion.yearEndAggregateIraValueOverride !== firstValueOverride),
  );
  if (inconsistentOverride) {
    return conversions.map((conversion) =>
      indeterminateConversion(conversion, [
        diagnostic(
          "INCONSISTENT_AGGREGATE_IRA_OVERRIDES",
          DiagnosticSeverity.ERROR,
          "All IRA conversions for one owner must use the same aggregate basis and year-end IRA value overrides.",
          `conversions.${conversion.id}`,
        ),
      ]),
    );
  }

  const totalConversion = roundMoney(conversions.reduce((sum, conversion) => sum + conversion.amount, 0));
  const otherDistributions = money(
    person.otherTraditionalSepSimpleIraDistributions,
    `${ownerId}.otherTraditionalSepSimpleIraDistributions`,
  );
  const denominator = roundMoney(yearEndValue + totalConversion + otherDistributions);
  const availableBasis = minMoney(denominator, roundMoney(priorBasis + currentNondeductible));
  const nontaxableRatio = denominator > 0 ? availableBasis / denominator : 0;
  const aggregateNontaxable = minMoney(
    totalConversion,
    roundMoney(totalConversion * nontaxableRatio),
  );
  const totalConversionCents = Math.round(totalConversion * 100);
  const targetNontaxableCents = Math.round(aggregateNontaxable * 100);
  const allocations = conversions.map((conversion, index) => {
    const amountCents = Math.round(conversion.amount * 100);
    const rawCents = totalConversionCents > 0
      ? (amountCents * targetNontaxableCents) / totalConversionCents
      : 0;
    const floorCents = Math.min(amountCents, Math.floor(rawCents));
    return { index, amountCents, cents: floorCents, remainder: rawCents - floorCents };
  });
  let residualCents = targetNontaxableCents - allocations.reduce((sum, allocation) => sum + allocation.cents, 0);
  for (const allocation of [...allocations].sort(
    (left, right) => (right.remainder - left.remainder) || (left.index - right.index),
  )) {
    if (residualCents <= 0) break;
    if (allocation.cents < allocation.amountCents) {
      allocation.cents += 1;
      residualCents -= 1;
    }
  }

  return conversions.map((conversion, index) => {
    const nontaxable = roundMoney(allocations[index]!.cents / 100);
    const taxable = roundMoney(conversion.amount - nontaxable);
    const diagnostics: Diagnostic[] = [];
    if (context.taxYear === 2010) {
      diagnostics.push(
        diagnostic(
          "2010_SPECIAL_INCOME_INCLUSION_ELECTION_NOT_MODELED",
          DiagnosticSeverity.INFO,
          "The optional special timing rule for income from certain 2010 Roth conversions is outside this contribution-limit engine; the result reports total taxable conversion income.",
          `conversions.${conversion.id}`,
        ),
      );
    }
    return {
      conversionId: conversion.id,
      conversionType: conversion.type,
      ownerId: conversion.ownerId,
      status: CalculationStatus.DETERMINATE,
      grossConvertedAmount: conversion.amount,
      taxableAmount: taxable,
      nontaxableBasisAmount: nontaxable,
      consumesAnnualContributionLimit: false as const,
      federalTaxEffects: conversionTaxEffects(taxable),
      diagnostics,
    };
  });
}

export function calculateScenario(input: ScenarioInput): ScenarioResult {
  const scenarioDiagnostics: Diagnostic[] = [];
  const taxYear = input.taxYear;
  const parameters = getParametersForYear(taxYear);
  const hsaParameters = hsaParametersForYear(taxYear);
  const fsaParameters = fsaParametersForYear(taxYear);
  const filingStatus = parseFilingStatus(
    input.filingStatus,
    scenarioDiagnostics,
    input.filingStatus !== undefined,
  );
  booleanFlag(input.treatedAsUnmarriedUnderSection21e4, "treatedAsUnmarriedUnderSection21e4");
  const treatedAsUnmarriedUnderSection21e4 =
    input.treatedAsUnmarriedUnderSection21e4 === undefined
      ? null
      : input.treatedAsUnmarriedUnderSection21e4 === true;
  validateHsaFamilyLimitDivision(input.hsaFamilyLimitDivision, "hsaFamilyLimitDivision");
  const hsaFamilyLimitDivision: HsaFamilyLimitDivisionInput =
    input.hsaFamilyLimitDivision ?? { status: "statutory_equal" };
  const persons = normalizePersons(input.persons);
  const accounts = normalizeAccounts(input.accounts, persons);
  const allocationOrder = [...accounts].sort(
    (left, right) => (left.priority! - right.priority!) || (left.inputIndex - right.inputIndex),
  );
  const context = createCalculationContext(
    taxYear,
    filingStatus,
    treatedAsUnmarriedUnderSection21e4,
    hsaFamilyLimitDivision,
    parameters,
    hsaParameters,
    fsaParameters,
    persons,
    accounts,
    scenarioDiagnostics,
  );

  const accountResultById = new Map<string, AccountCalculationResult>();
  for (const account of allocationOrder) {
    const outcome = allocateAccount(context, account);
    const traits = ACCOUNT_TRAITS[account.type];
    const existingAnnualContribution = sumComponents(account.existingContributions);
    const annualMaximum = sumComponents(outcome.annualComponents);
    const additionalMaximum = sumComponents(outcome.additionalComponents);
    const excessContribution = outcome.statutoryMaximum === null
      ? null
      : nonnegative(existingAnnualContribution - outcome.statutoryMaximum);
    const diagnostics = [...outcome.diagnostics];

    if (
      outcome.statutoryMaximum !== null &&
      annualMaximum > outcome.statutoryMaximum + 0.009
    ) {
      diagnostics.push(
        diagnostic(
          "SUPPLIED_EXISTING_CONTRIBUTIONS_EXCEED_ACCOUNT_MAXIMUM",
          DiagnosticSeverity.ERROR,
          `The annual amount $${annualMaximum.toLocaleString()} exceeds the calculated account ceiling of $${outcome.statutoryMaximum.toLocaleString()}. Shared-limit records should also be reviewed for excess contributions across accounts.`,
          `accounts.${account.id}.existingContributions`,
        ),
      );
    }

    for (const shared of outcome.sharedLimits) {
      // A pool whose draw is undeterminable reports no remainder, and an excess
      // is a statement about the draw. Asserting one from a `used` the engine
      // never computed is how a compliant taxpayer came to be accused.
      if (
        shared.limit !== null
        && shared.usedBeforeAccount !== null
        && shared.remainingAfterAccount !== null
        && shared.usedBeforeAccount > shared.limit + 0.009
      ) {
        diagnostics.push(
          diagnostic(
            "SUPPLIED_EXISTING_CONTRIBUTIONS_EXCEED_SHARED_LIMIT",
            DiagnosticSeverity.ERROR,
            `Existing contributions already exceed the ${shared.legalLimit}.`,
            `accounts.${account.id}.existingContributions`,
          ),
        );
      }
    }

    const finalStatus = diagnostics.some((entry) => entry.severity === DiagnosticSeverity.ERROR)
      ? (outcome.status === CalculationStatus.UNAVAILABLE || outcome.status === CalculationStatus.INELIGIBLE
          ? outcome.status
          : CalculationStatus.INDETERMINATE)
      : outcome.status;
    const result: AccountCalculationResult = {
      accountId: account.id,
      accountType: account.type,
      ownerId: account.ownerId,
      ...(account.employerId ? { employerId: account.employerId } : {}),
      status: finalStatus,
      statutoryMaximumAnnualContribution: outcome.statutoryMaximum,
      maximumAnnualContributionBasedOnInputs: outcome.status === CalculationStatus.INDETERMINATE && annualMaximum === 0
        ? null
        : annualMaximum,
      maximumAdditionalContributionBasedOnInputs: outcome.status === CalculationStatus.INDETERMINATE && additionalMaximum === 0
        ? null
        : additionalMaximum,
      existingAnnualContribution,
      excessContribution,
      contributionComponents: outcome.annualComponents,
      planTermDependentCapacity: outcome.planTermDependentCapacity,
      federalTaxEffects: accountTaxEffects(outcome, traits, account.planRules, diagnostics),
      sharedLimits: outcome.sharedLimits,
      ...(outcome.hsaDetail !== undefined ? { hsa: outcome.hsaDetail } : {}),
      ...(outcome.definedBenefitDetail ? { definedBenefit: outcome.definedBenefitDetail } : {}),
      ...(outcome.healthFsaDetail ? { healthFsa: outcome.healthFsaDetail } : {}),
      ...(outcome.dependentCareDetail ? { dependentCareFsa: outcome.dependentCareDetail } : {}),
      diagnostics,
    };
    accountResultById.set(account.id, result);
  }

  const accountResults = accounts.map((account) => accountResultById.get(account.id)!);
  const normalizedConversions = normalizeConversions(input.conversions, persons, context.accountsById);
  const conversionResults = calculateConversions(context, normalizedConversions, accountResults);
  const allDiagnostics = [
    ...scenarioDiagnostics,
    ...accountResults.flatMap((result) => result.diagnostics),
    ...conversionResults.flatMap((result) => result.diagnostics),
  ];

  return {
    package: PACKAGE_NAME,
    engineVersion: ENGINE_VERSION,
    taxYear,
    filingStatus,
    parameters,
    hsaParameters,
    fsaParameters,
    accounts: accountResults,
    conversions: conversionResults,
    totals: calculateScenarioTotals(accountResults, conversionResults),
    diagnostics: allDiagnostics,
  };
}

function calculateScenarioTotals(
  accounts: AccountCalculationResult[],
  conversions: ConversionCalculationResult[],
): ScenarioTotals {
  const totals: ScenarioTotals = {
    maximumAnnualContributionBasedOnInputs: 0,
    maximumAdditionalContributionBasedOnInputs: 0,
    employeePreTaxContribution: 0,
    employeeRothOrAfterTaxContribution: 0,
    employerPreTaxContribution: 0,
    employerRothContribution: 0,
    deductibleIraContribution: 0,
    nondeductibleIraContribution: 0,
    hsaContribution: 0,
    healthFsaSalaryReduction: 0,
    dependentCareAssistanceExclusion: 0,
    dependentCareIncludibleInIncome: 0,
    federalAgiReduction: 0,
    federalAgiIncrease: 0,
    taxableRothConversions: 0,
  };

  for (const account of accounts) {
    const components = account.contributionComponents;
    totals.maximumAnnualContributionBasedOnInputs = roundMoney(
      totals.maximumAnnualContributionBasedOnInputs +
        (account.maximumAnnualContributionBasedOnInputs ?? 0),
    );
    totals.maximumAdditionalContributionBasedOnInputs = roundMoney(
      totals.maximumAdditionalContributionBasedOnInputs +
        (account.maximumAdditionalContributionBasedOnInputs ?? 0),
    );
    totals.employeePreTaxContribution = roundMoney(
      totals.employeePreTaxContribution +
        components.employeePreTaxDeferral +
        components.employeePreTaxCatchUp +
        components.special403bCatchUp +
        components.special457CatchUp,
    );
    totals.employeeRothOrAfterTaxContribution = roundMoney(
      totals.employeeRothOrAfterTaxContribution +
        components.employeeRothDeferral +
        components.employeeRothCatchUp +
        components.special457RothCatchUp +
        components.employeeAfterTax +
        components.rothIra +
        components.nondeductibleIra +
        components.unclassifiedIra,
    );
    totals.employerPreTaxContribution = roundMoney(
      totals.employerPreTaxContribution + components.employerPreTax,
    );
    totals.employerRothContribution = roundMoney(
      totals.employerRothContribution + components.employerRoth,
    );
    totals.deductibleIraContribution = roundMoney(
      totals.deductibleIraContribution + components.deductibleIra,
    );
    totals.nondeductibleIraContribution = roundMoney(
      totals.nondeductibleIraContribution + components.nondeductibleIra + components.unclassifiedIra,
    );
    totals.hsaContribution = roundMoney(
      totals.hsaContribution + components.hsaDeductible + components.hsaEmployerOrCafeteria,
    );
    totals.healthFsaSalaryReduction = roundMoney(
      totals.healthFsaSalaryReduction + components.healthFsaSalaryReduction,
    );
    totals.dependentCareAssistanceExclusion = roundMoney(
      totals.dependentCareAssistanceExclusion + components.dependentCareAssistanceProvided,
    );
    totals.dependentCareIncludibleInIncome = roundMoney(
      totals.dependentCareIncludibleInIncome + components.dependentCareIncludibleInIncome,
    );
    totals.federalAgiReduction = roundMoney(
      totals.federalAgiReduction + account.federalTaxEffects.federalAgiReduction,
    );
    totals.federalAgiIncrease = roundMoney(
      totals.federalAgiIncrease + account.federalTaxEffects.federalAgiIncrease,
    );
  }

  for (const conversion of conversions) {
    totals.federalAgiIncrease = roundMoney(
      totals.federalAgiIncrease + conversion.federalTaxEffects.federalAgiIncrease,
    );
    totals.taxableRothConversions = roundMoney(
      totals.taxableRothConversions + (conversion.taxableAmount ?? 0),
    );
  }
  return totals;
}

export class PersonBuilder {
  private readonly value: PersonInput;

  public constructor(id: string) {
    this.value = { id, compensation: {}, magi: {}, priorYearFicaWagesByEmployer: {} };
  }

  public asTaxpayer(): this {
    this.value.role = "taxpayer";
    return this;
  }

  public asSpouse(): this {
    this.value.role = "spouse";
    return this;
  }

  public role(role: PersonRole): this {
    this.value.role = role;
    return this;
  }

  public bornOn(birthDate: string): this {
    this.value.birthDate = birthDate;
    delete this.value.birthYear;
    return this;
  }

  public bornIn(birthYear: number): this {
    this.value.birthYear = birthYear;
    delete this.value.birthDate;
    return this;
  }

  public iraCompensation(amount: Money): this {
    (this.value.compensation ??= {}).iraCompensation = amount;
    return this;
  }

  public w2Compensation(amount: Money): this {
    (this.value.compensation ??= {}).w2Compensation = amount;
    return this;
  }

  public selfEmploymentNetEarnings(amount: Money): this {
    (this.value.compensation ??= {}).selfEmploymentNetEarnings = amount;
    return this;
  }

  public rothIraMagi(amount: Money): this {
    (this.value.magi ??= {}).rothIra = amount;
    return this;
  }

  public traditionalIraDeductionMagi(amount: Money): this {
    (this.value.magi ??= {}).traditionalIraDeduction = amount;
    return this;
  }

  public rothConversionMagi(amount: Money): this {
    (this.value.magi ??= {}).rothConversion = amount;
    return this;
  }

  /** IRC 129(b)(1) earned income of this person for the taxable year. */
  public dependentCareEarnedIncome(amount: Money): this {
    this.value.dependentCareEarnedIncome = amount;
    return this;
  }

  /** IRC 129(b)(2): this person is a student or incapable of self-care, so IRC 21(d)(2) deems earned income. */
  public studentOrIncapableOfSelfCare(applies = true): this {
    this.value.isStudentOrIncapableOfSelfCare = applies;
    return this;
  }

  public coveredByEmployerPlan(covered = true): this {
    this.value.coveredByEmployerRetirementPlan = covered;
    return this;
  }

  public livedWithSpouseDuringYear(livedTogether = true): this {
    this.value.livedWithSpouseDuringYear = livedTogether;
    return this;
  }

  public priorYearFicaWages(employerId: string, amount: Money): this {
    (this.value.priorYearFicaWagesByEmployer ??= {})[employerId] = amount;
    return this;
  }

  public aggregateTraditionalSepSimpleIraBasis(amount: Money): this {
    this.value.traditionalSepSimpleIraBasis = amount;
    return this;
  }

  public yearEndTraditionalSepSimpleIraValue(amount: Money): this {
    this.value.yearEndTraditionalSepSimpleIraValue = amount;
    return this;
  }

  public otherTraditionalSepSimpleIraDistributions(amount: Money): this {
    this.value.otherTraditionalSepSimpleIraDistributions = amount;
    return this;
  }

  /**
   * IRC 223(c)(2) coverage this person held, with an optional list of eligible
   * months (1-12). Needed on a spouse who owns no health savings account,
   * because IRC 223(b)(5)(A) reads the couple's coverage, not their accounts.
   */
  public hsaCoverage(tier: HsaCoverageTier, eligibleMonths?: number[]): this {
    const coverage = (this.value.hsaCoverage ??= {});
    coverage.coverageTier = tier;
    if (eligibleMonths !== undefined) coverage.eligibleMonths = [...eligibleMonths];
    return this;
  }

  /** IRC 223(b)(2) per-month coverage for this person, for a year in which the tier changes. */
  public hsaMonthlyCoverage(coverage: HsaMonthlyCoverageInput[]): this {
    (this.value.hsaCoverage ??= {}).monthlyCoverage = coverage.map((entry) => ({ ...entry }));
    return this;
  }

  /** Records that this person held no high deductible health plan coverage in any month. */
  public noHsaCoverage(): this {
    this.value.hsaCoverage = {};
    return this;
  }

  /** The person's plan annual deductible, which IRC 223(b)(5)(A) reads for 2004-2006. */
  public hsaHdhpAnnualDeductible(amount: Money): this {
    (this.value.hsaCoverage ??= {}).hdhpAnnualDeductible = amount;
    return this;
  }

  /**
   * The aggregate amount paid for the taxable year to Archer MSAs of this
   * person, which IRC 223(b)(4)(A) — or IRC 223(b)(5)(B)(i) for a married
   * couple — subtracts from the HSA limitation.
   */
  public archerMsaContributions(amount: Money): this {
    this.value.archerMsaContributions = amount;
    return this;
  }

  /**
   * The aggregate amount contributed to this person's health savings accounts
   * for the taxable year under IRC 408(d)(9), which IRC 223(b)(4)(C) subtracts
   * from that person's own HSA limitation — married or not, and after any IRC
   * 223(b)(5)(B)(ii) division.
   */
  public qualifiedHsaFundingDistributions(amount: Money): this {
    this.value.qualifiedHsaFundingDistributions = amount;
    return this;
  }

  /**
   * IRC 223(b)(8)(B)(iii): whether this person's testing period was, or will
   * be, satisfied. There is nothing to elect beside it — IRC 223(b)(8)(A)
   * reaches a December-eligible individual by its own force — so this states
   * the consequence and never the rule. Omitting it leaves the period
   * unresolved, which is reported rather than assumed away.
   */
  public hsaTestingPeriodSatisfied(satisfied = true): this {
    (this.value.hsaLastMonthRuleTestingPeriod ??= {}).satisfied = satisfied;
    return this;
  }

  /** IRC 223(b)(8)(B)(ii): the testing period was failed because of death or disability. */
  public hsaTestingPeriodFailureByDeathOrDisability(failed = true): this {
    (this.value.hsaLastMonthRuleTestingPeriod ??= {}).failureByDeathOrDisability = failed;
    return this;
  }

  public build(): PersonInput {
    return deepClone(this.value);
  }
}

export class AccountBuilder {
  private readonly value: AccountInput;

  public constructor(id: string, ownerId: string, type: AccountType | string) {
    this.value = {
      id,
      ownerId,
      type,
      planRules: {},
      existingContributions: {},
    };
  }

  public owner(ownerId: string): this {
    this.value.ownerId = ownerId;
    return this;
  }

  public accountType(type: AccountType | string): this {
    this.value.type = type;
    return this;
  }

  public employer(employerId: string): this {
    this.value.employerId = employerId;
    return this;
  }

  public priority(priority: number): this {
    this.value.priority = priority;
    return this;
  }

  public planCompensation(amount: Money): this {
    (this.value.planRules ??= {}).planCompensation = amount;
    return this;
  }

  public includible457Compensation(amount: Money): this {
    (this.value.planRules ??= {}).includibleCompensation457 = amount;
    return this;
  }

  public annualAdditionsGroup(groupId: string): this {
    (this.value.planRules ??= {}).annualAdditionsGroupId = groupId;
    return this;
  }

  public planDocumentEmployeeLimit(amount: Money): this {
    (this.value.planRules ??= {}).planDocumentEmployeeDeferralLimit = amount;
    return this;
  }

  public planDocumentAnnualAdditionsLimit(amount: Money): this {
    (this.value.planRules ??= {}).planDocumentAnnualAdditionsLimit = amount;
    return this;
  }

  /**
   * Portion of an IRC 402A(e) pension-linked emergency savings account balance
   * already attributable to participant contributions. Required for a
   * `pension_linked_emergency_savings` account; pass 0 for a new one.
   */
  public pensionLinkedEmergencySavingsBalance(amount: Money): this {
    (this.value.planRules ??= {}).pensionLinkedEmergencySavingsParticipantContributionBalance = amount;
    return this;
  }

  public permitsRothContributions(permits = true): this {
    (this.value.planRules ??= {}).permitsRothContributions = permits;
    return this;
  }

  public permitsRothCatchUp(permits = true): this {
    (this.value.planRules ??= {}).permitsRothCatchUp = permits;
    return this;
  }

  public permitsAfterTaxContributions(permits = true): this {
    (this.value.planRules ??= {}).permitsAfterTaxEmployeeContributions = permits;
    return this;
  }

  public permitsInPlanRothRollover(permits = true): this {
    (this.value.planRules ??= {}).permitsInPlanRothRollover = permits;
    return this;
  }

  public contributionPreference(preference: ContributionPreference): this {
    (this.value.planRules ??= {}).contributionPreference = preference;
    return this;
  }

  public expectedEmployerContribution(amount: Money, taxTreatment?: EmployerContributionTaxTreatment): this {
    (this.value.planRules ??= {}).expectedEmployerContribution = amount;
    if (taxTreatment) this.value.planRules!.employerContributionTaxTreatment = taxTreatment;
    return this;
  }

  public employerMatch(matchRate: number, compensationFraction: number): this {
    (this.value.planRules ??= {}).employerMatchRate = matchRate;
    this.value.planRules!.employerMatchCompensationFraction = compensationFraction;
    return this;
  }

  public employerNonelective(rateValue: number): this {
    (this.value.planRules ??= {}).employerNonelectiveRate = rateValue;
    return this;
  }

  public employerContributionTaxTreatment(treatment: EmployerContributionTaxTreatment): this {
    (this.value.planRules ??= {}).employerContributionTaxTreatment = treatment;
    return this;
  }

  public simpleEmployerMethod(method: SimpleEmployerContributionMethod, customAmount?: Money): this {
    (this.value.planRules ??= {}).simpleEmployerContributionMethod = method;
    if (customAmount !== undefined) this.value.planRules!.simpleCustomEmployerContribution = customAmount;
    return this;
  }

  public simpleEnhancedLimitEligible(eligible = true): this {
    (this.value.planRules ??= {}).simpleEnhancedLimitEligible = eligible;
    return this;
  }

  public simpleAdditionalNonelectiveContribution(amount: Money): this {
    (this.value.planRules ??= {}).simpleAdditionalNonelectiveContribution = amount;
    return this;
  }

  public selfEmployedOwner(netEarningsAfterHalfSETax: Money): this {
    (this.value.planRules ??= {}).isSelfEmployedOwner = true;
    this.value.planRules!.netEarningsFromSelfEmploymentAfterHalfSETax = netEarningsAfterHalfSETax;
    return this;
  }

  public special403bCatchUp(input: Special403bCatchUpInput): this {
    (this.value.planRules ??= {}).special403bCatchUp = { ...input };
    return this;
  }

  public special457CatchUp(input: Section457SpecialCatchUpInput): this {
    (this.value.planRules ??= {}).section457SpecialCatchUp = { ...input };
    return this;
  }

  /** IRC 223 coverage tier, with an optional list of eligible months (1-12). */
  public hsaCoverage(tier: HsaCoverageTier, eligibleMonths?: number[]): this {
    const hsa = ((this.value.planRules ??= {}).hsa ??= {});
    hsa.coverageTier = tier;
    if (eligibleMonths !== undefined) hsa.eligibleMonths = [...eligibleMonths];
    return this;
  }

  /** IRC 223(b)(2) per-month coverage, for a year in which the tier changes. */
  public hsaMonthlyCoverage(coverage: HsaMonthlyCoverageInput[]): this {
    const hsa = ((this.value.planRules ??= {}).hsa ??= {});
    hsa.monthlyCoverage = coverage.map((entry) => ({ ...entry }));
    return this;
  }

  /** Required for 2004-2006, when IRC 223(b)(2) capped the monthly limitation by the deductible. */
  public hsaHdhpAnnualDeductible(amount: Money): this {
    ((this.value.planRules ??= {}).hsa ??= {}).hdhpAnnualDeductible = amount;
    return this;
  }

  /** Rev. Rul. 2004-45 classification of a health FSA. */
  public healthFsaPurpose(purpose: HealthFsaPurpose): this {
    ((this.value.planRules ??= {}).healthFsa ??= {}).purpose = purpose;
    return this;
  }

  /** Notice 2013-71 carryover. Mutually exclusive with `healthFsaGracePeriod`. */
  public healthFsaCarryover(offers: boolean, priorYearUnusedAmount?: Money): this {
    const healthFsa = ((this.value.planRules ??= {}).healthFsa ??= {});
    healthFsa.offersCarryover = offers;
    if (priorYearUnusedAmount !== undefined) healthFsa.priorYearUnusedAmount = priorYearUnusedAmount;
    return this;
  }

  /** Prop. Treas. Reg. 1.125-1(e) grace period. Mutually exclusive with `healthFsaCarryover`. */
  public healthFsaGracePeriod(offers = true, priorYearUnusedAmount?: Money): this {
    const healthFsa = ((this.value.planRules ??= {}).healthFsa ??= {});
    healthFsa.offersGracePeriod = offers;
    if (priorYearUnusedAmount !== undefined) healthFsa.priorYearUnusedAmount = priorYearUnusedAmount;
    return this;
  }

  /** Non-elective employer flex credits, and whether they could be elected as cash. */
  public healthFsaEmployerFlexCredit(amount: Money, electableAsCash?: boolean): this {
    const healthFsa = ((this.value.planRules ??= {}).healthFsa ??= {});
    healthFsa.employerFlexCredit = amount;
    if (electableAsCash !== undefined) healthFsa.flexCreditElectableAsCash = electableAsCash;
    return this;
  }

  /** A limit the plan document imposes below the IRC 125(i) ceiling. */
  public healthFsaPlanDocumentLimit(amount: Money): this {
    ((this.value.planRules ??= {}).healthFsa ??= {}).planDocumentLimit = amount;
    return this;
  }

  /** Whether the cafeteria plan year is the calendar year; `false` makes the IRC 125(i) figure indeterminate. */
  public healthFsaCalendarPlanYear(isCalendarYear = true): this {
    ((this.value.planRules ??= {}).healthFsa ??= {}).planYearIsCalendarYear = isCalendarYear;
    return this;
  }

  /** A lower dependent care maximum the employer's plan itself allows. */
  public dependentCarePlanDocumentLimit(limit: Money): this {
    ((this.value.planRules ??= {}).dependentCareFsa ??= {}).planDocumentLimit = limit;
    return this;
  }

  public grandfatheredGovernmentalCompensationLimit(applies = true): this {
    (this.value.planRules ??= {}).grandfatheredGovernmentalCompensationLimit = applies;
    return this;
  }

  public grandfatheredSarsep(grandfathered = true): this {
    (this.value.planRules ??= {}).grandfatheredSarsep = grandfathered;
    return this;
  }

  public existing(contributions: ExistingContributionInput): this {
    this.value.existingContributions = { ...contributions };
    return this;
  }

  public build(): AccountInput {
    return deepClone(this.value);
  }
}

export class RothConversionBuilder {
  private readonly value: RothConversionInput;

  public constructor(
    id: string,
    ownerId: string,
    type: ConversionType | string,
    amount: Money,
  ) {
    this.value = { id, ownerId, type, amount };
  }

  public afterTaxBasis(amount: Money): this {
    this.value.afterTaxBasisInConvertedAmount = amount;
    return this;
  }

  public aggregateIraBasis(amount: Money): this {
    this.value.aggregateIraBasisOverride = amount;
    return this;
  }

  public yearEndAggregateIraValue(amount: Money): this {
    this.value.yearEndAggregateIraValueOverride = amount;
    return this;
  }

  public otherwiseDistributable(eligible = true): this {
    this.value.otherwiseDistributableAmount = eligible;
    return this;
  }

  public sourceAccount(accountId: string): this {
    this.value.sourceAccountId = accountId;
    return this;
  }

  public build(): RothConversionInput {
    return deepClone(this.value);
  }
}

export class Scenario {
  public constructor(private readonly input: ScenarioInput) {}

  public calculate(): ScenarioResult {
    return calculateScenario(deepClone(this.input));
  }

  public toInput(): ScenarioInput {
    return deepClone(this.input);
  }
}

export class ScenarioBuilder {
  private readonly value: ScenarioInput;

  public static forTaxYear(taxYear: number): ScenarioBuilder {
    return new ScenarioBuilder(taxYear);
  }

  public constructor(taxYear: number) {
    this.value = {
      taxYear,
      filingStatus: FilingStatus.SINGLE,
      persons: [],
      accounts: [],
      conversions: [],
    };
  }

  public filingStatus(status: FilingStatus | string): this {
    this.value.filingStatus = status;
    return this;
  }

  public addPerson(person: PersonInput | PersonBuilder): this {
    this.value.persons.push(person instanceof PersonBuilder ? person.build() : deepClone(person));
    return this;
  }

  public taxpayer(id: string, configure?: (builder: PersonBuilder) => void): this {
    const builder = new PersonBuilder(id).asTaxpayer();
    configure?.(builder);
    return this.addPerson(builder);
  }

  public spouse(id: string, configure?: (builder: PersonBuilder) => void): this {
    const builder = new PersonBuilder(id).asSpouse();
    configure?.(builder);
    return this.addPerson(builder);
  }

  public addAccount(account: AccountInput | AccountBuilder): this {
    this.value.accounts.push(
      account instanceof AccountBuilder ? account.build() : deepClone(account),
    );
    return this;
  }

  public account(
    id: string,
    ownerId: string,
    type: AccountType | string,
    configure?: (builder: AccountBuilder) => void,
  ): this {
    const builder = new AccountBuilder(id, ownerId, type);
    configure?.(builder);
    return this.addAccount(builder);
  }

  public addConversion(conversion: RothConversionInput | RothConversionBuilder): this {
    (this.value.conversions ??= []).push(
      conversion instanceof RothConversionBuilder ? conversion.build() : deepClone(conversion),
    );
    return this;
  }

  public conversion(
    id: string,
    ownerId: string,
    type: ConversionType | string,
    amount: Money,
    configure?: (builder: RothConversionBuilder) => void,
  ): this {
    const builder = new RothConversionBuilder(id, ownerId, type, amount);
    configure?.(builder);
    return this.addConversion(builder);
  }

  /**
   * IRC 223(b)(5)(B)(ii) agreed division of the one family limitation.
   * `taxpayerShare` is the taxpayer's share from 0 through 1; the spouse takes
   * the remainder. Notice 2004-50 Q&A-32 permits any division, "including
   * allocating nothing to one spouse".
   */
  public hsaFamilyLimitDivision(taxpayerShare: number): this {
    this.value.hsaFamilyLimitDivision = { status: "agreed", taxpayerShare };
    return this;
  }

  /**
   * Record that the IRC 223(b)(5)(B)(ii) division is not settled, so no share
   * of the family limitation can be stated. `unknown` where the agreement fact
   * was never obtained, `disputed` where the spouses report different
   * divisions, `inconsistent` where two records of one division conflict.
   */
  public hsaFamilyLimitDivisionUnsettled(
    status: "unknown" | "disputed" | "inconsistent" = "unknown",
  ): this {
    this.value.hsaFamilyLimitDivision = { status };
    return this;
  }

  public build(): Scenario {
    return new Scenario(deepClone(this.value));
  }

  public calculate(): ScenarioResult {
    return this.build().calculate();
  }

  public toInput(): ScenarioInput {
    return deepClone(this.value);
  }
}

export class USTaxAdvantagedParams {
  public static forTaxYear(taxYear: number): ScenarioBuilder {
    return ScenarioBuilder.forTaxYear(taxYear);
  }

  public static calculate(input: ScenarioInput): ScenarioResult {
    return calculateScenario(input);
  }

  public static parametersForYear(taxYear: number): YearParameters {
    return getParametersForYear(taxYear);
  }

  public static supportedTaxYears(): { minimum: number; maximum: number } {
    return { ...RAW_PARAMETERS.supportedTaxYears };
  }

  public static generatedThroughTaxYear(): number {
    return RAW_PARAMETERS.generatedThroughTaxYear;
  }

  public static normalizeFilingStatus(status: FilingStatus | string): FilingStatus {
    return parseFilingStatus(status);
  }

  public static normalizeAccountType(type: AccountType | string): AccountType {
    return parseAccountType(type);
  }

  public static sourceMetadata(): Array<Record<string, string>> {
    return deepClone(RAW_PARAMETERS.sources);
  }

  /** IRC 223 parameters, or null for a year with no encoded revenue procedure. */
  public static hsaParametersForYear(taxYear: number): HsaYearParameters | null {
    if (!Number.isInteger(taxYear)) {
      throw new ParameterError("INVALID_TAX_YEAR", "taxYear must be an integer.");
    }
    return hsaParametersForYear(taxYear);
  }

  public static supportedHsaTaxYears(): { minimum: number; maximum: number } {
    return { ...RAW_HSA_PARAMETERS.supportedTaxYears };
  }

  public static hsaSourceMetadata(): Array<Record<string, string>> {
    return deepClone(RAW_HSA_PARAMETERS.sources);
  }

  /** IRC 125 and IRC 129 parameters, or null for a year with no encoded figures. */
  public static fsaParametersForYear(taxYear: number): FsaYearParameters | null {
    if (!Number.isInteger(taxYear)) {
      throw new ParameterError("INVALID_TAX_YEAR", "taxYear must be an integer.");
    }
    return fsaParametersForYear(taxYear);
  }

  public static supportedFsaTaxYears(): { minimum: number; maximum: number } {
    return { ...RAW_FSA_PARAMETERS.supportedTaxYears };
  }

  public static fsaSourceMetadata(): Array<Record<string, string>> {
    return deepClone(RAW_FSA_PARAMETERS.sources);
  }
}

export default USTaxAdvantagedParams;
