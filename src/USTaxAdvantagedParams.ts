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
export const ENGINE_VERSION = "0.1.0" as const;

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

  TRADITIONAL_403B = "traditional_403b",
  ROTH_403B = "roth_403b",
  SAFE_HARBOR_403B_DEFERRAL_ONLY = "safe_harbor_403b_deferral_only",

  GOVERNMENTAL_457B = "governmental_457b",
  ROTH_GOVERNMENTAL_457B = "roth_governmental_457b",
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
  /** Accumulated nondeductible basis in all traditional/SEP/SIMPLE IRAs. */
  traditionalSepSimpleIraBasis?: Money;
  /** December 31 value of all traditional/SEP/SIMPLE IRAs. */
  yearEndTraditionalSepSimpleIraValue?: Money;
  /** Other current-year distributions included in the Form 8606 denominator. */
  otherTraditionalSepSimpleIraDistributions?: Money;
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
  special457CatchUp?: Money;
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

  /** Grandfathered SARSEP established before 1997. */
  grandfatheredSarsep?: boolean;
  /** Used to surface the statutory 2024+ additional SIMPLE nonelective amount. */
  simpleAdditionalNonelectiveContribution?: Money;
}

export interface RetirementAccountInput {
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

export interface RetirementScenarioInput {
  taxYear: number;
  filingStatus: FilingStatus | string;
  persons: PersonInput[];
  accounts: RetirementAccountInput[];
  conversions?: RothConversionInput[];
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
  /** Known regular contribution whose tax classification cannot be resolved. */
  unclassifiedIra: Money;
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
  usedBeforeAccount: Money;
  usedByAccount: Money;
  remainingAfterAccount: Money | null;
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
  contributionComponents: ContributionComponents;
  /** Potential IRC 415(c) space that requires unknown plan/employer terms. */
  planTermDependentCapacity: Money;
  federalTaxEffects: FederalTaxEffects;
  sharedLimits: SharedLimitUse[];
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
  federalAgiReduction: Money;
  federalAgiIncrease: Money;
  taxableRothConversions: Money;
}

export interface RetirementScenarioResult {
  package: typeof PACKAGE_NAME;
  engineVersion: typeof ENGINE_VERSION;
  taxYear: number;
  filingStatus: FilingStatus;
  parameters: YearParameters;
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
    oneEarnerHouseholdCombinedLimit: Money | null;
    traditionalContributionAge70HalfRestriction: boolean;
    rothAvailable: boolean;
  };
  electiveDeferral402g: Money | null;
  generalAge50CatchUp: Money;
  age60To63CatchUp: Money | null;
  rothCatchUpPriorYearFicaWageThreshold: Money | null;
  annualAdditions415c: Money | null;
  annualAdditionsCompensationFraction: number | null;
  annualCompensation401a17: Money | null;
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
      },
      "phaseouts": {
        "traditionalIraCovered": null,
        "traditionalIraSpouseCovered": null,
        "rothIra": null
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
        "nonworkingSpouseIndividualLimit": 250,
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
        "starter401kOrSafeHarbor403b": false
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
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
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
        "starter401kOrSafeHarbor403b": false
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
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
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
        "starter401kOrSafeHarbor403b": false
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
      "sep": {
        "available": true,
        "maximumEmployerContributionRate": 0.15,
        "selfEmployedEquivalentRate": 0.13043478260869565,
        "minimumEligibleCompensation": null,
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": false
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
        "starter401kOrSafeHarbor403b": true
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
        "starter401kOrSafeHarbor403b": true
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
        "starter401kOrSafeHarbor403b": true
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
      }
    }
  }
} as ParameterData;
/* </generated-parameters> */

export class RetirementParameterError extends Error {
  public readonly code: string;

  public constructor(code: string, message: string) {
    super(message);
    this.name = "RetirementParameterError";
    this.code = code;
  }
}

export class UnsupportedTaxYearError extends RetirementParameterError {
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
    | "section457f";
  availabilityKey?: string;
  designatedRoth: boolean;
  shares402g: boolean;
  uses415c: boolean;
  permitsAgeCatchUpByStatute: boolean;
  governmental457: boolean;
  is403b: boolean;
  isStarter: boolean;
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

  [AccountType.TRADITIONAL_403B]: qualified403bTraits(false),
  [AccountType.ROTH_403B]: qualified403bTraits(true),
  [AccountType.SAFE_HARBOR_403B_DEFERRAL_ONLY]: starter403bTraits(),

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

function normalizeToken(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/[()]/g, "")
    .replace(/[\-./\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseFilingStatus(value: FilingStatus | string, diagnostics?: Diagnostic[]): FilingStatus {
  if (Object.values(FilingStatus).includes(value as FilingStatus)) {
    return value as FilingStatus;
  }
  const token = normalizeToken(String(value));
  const parsed = FILING_STATUS_ALIASES[token];
  if (!parsed) {
    throw new RetirementParameterError("INVALID_FILING_STATUS", `Unsupported filing status: ${value}`);
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

function parseAccountType(value: AccountType | string): AccountType {
  if (Object.values(AccountType).includes(value as AccountType)) {
    return value as AccountType;
  }
  const parsed = ACCOUNT_TYPE_ALIASES[normalizeToken(String(value))];
  if (!parsed) {
    throw new RetirementParameterError("INVALID_ACCOUNT_TYPE", `Unsupported retirement account type: ${value}`);
  }
  return parsed;
}

function parseConversionType(value: ConversionType | string): ConversionType {
  if (Object.values(ConversionType).includes(value as ConversionType)) {
    return value as ConversionType;
  }
  const parsed = CONVERSION_TYPE_ALIASES[normalizeToken(String(value))];
  if (!parsed) {
    throw new RetirementParameterError("INVALID_CONVERSION_TYPE", `Unsupported Roth conversion type: ${value}`);
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
    throw new RetirementParameterError("INVALID_MONEY", `${path} must be a finite, nonnegative number.`);
  }
  return roundMoney(value);
}

function rate(value: unknown, path: string, defaultValue = 0): number {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) {
    throw new RetirementParameterError("INVALID_RATE", `${path} must be a number from 0 through 1.`);
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
    unclassifiedIra: 0,
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

  result.formW2Box1WageReduction = planRules.isSelfEmployedOwner ? 0 : pretaxEmployee;
  result.selfEmployedRetirementDeduction = selfEmployedPlanDeduction;
  result.federalAgiReduction = roundMoney(pretaxEmployee + selfEmployedEmployer + deductibleIra);
  result.federalTaxableIncomeReduction = result.federalAgiReduction;
  result.ficaWageReduction = 0;
  result.nondeductibleContribution = roundMoney(components.nondeductibleIra + components.unclassifiedIra);
  result.afterTaxOrRothContribution = roundMoney(
    components.employeeRothDeferral +
      components.employeeRothCatchUp +
      components.employeeAfterTax +
      components.employerRoth +
      components.rothIra,
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

interface NormalizedAccount extends Omit<RetirementAccountInput, "type" | "planRules" | "existingContributions"> {
  type: AccountType;
  planRules: PlanRulesInput;
  existingContributions: ContributionComponents;
  inputIndex: number;
}

interface LimitPool {
  id: string;
  legalLimit: string;
  limit: Money | null;
  used: Money;
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
  parameters: YearParameters;
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
}

interface AllocationOutcome {
  status: CalculationStatus;
  statutoryMaximum: Money | null;
  annualComponents: ContributionComponents;
  additionalComponents: ContributionComponents;
  planTermDependentCapacity: Money;
  sharedLimits: SharedLimitUse[];
  diagnostics: Diagnostic[];
}

function getParametersForYear(year: number): YearParameters {
  if (!Number.isInteger(year)) {
    throw new RetirementParameterError("INVALID_TAX_YEAR", "taxYear must be an integer.");
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

function normalizePersons(persons: PersonInput[]): Map<string, NormalizedPerson> {
  if (!Array.isArray(persons) || persons.length === 0) {
    throw new RetirementParameterError("PERSON_REQUIRED", "At least one person is required.");
  }
  const result = new Map<string, NormalizedPerson>();
  for (const [index, input] of persons.entries()) {
    if (!input.id?.trim()) {
      throw new RetirementParameterError("PERSON_ID_REQUIRED", `persons[${index}].id is required.`);
    }
    if (result.has(input.id)) {
      throw new RetirementParameterError("DUPLICATE_PERSON_ID", `Duplicate person ID: ${input.id}`);
    }
    if (input.birthYear !== undefined && (!Number.isInteger(input.birthYear) || input.birthYear < 1800 || input.birthYear > 3000)) {
      throw new RetirementParameterError("INVALID_BIRTH_YEAR", `persons[${index}].birthYear is invalid.`);
    }
    if (input.birthDate !== undefined) validateIsoDate(input.birthDate, `persons[${index}].birthDate`);
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
    const role = input.role ?? (index === 0 ? "taxpayer" : index === 1 ? "spouse" : "other");
    if (role !== "taxpayer" && role !== "spouse" && role !== "other") {
      throw new RetirementParameterError(
        "INVALID_PERSON_ROLE",
        `persons[${index}].role must be taxpayer, spouse, or other.`,
      );
    }
    result.set(input.id, {
      ...input,
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
    });
  }
  for (const role of ["taxpayer", "spouse"] as const) {
    const matching = [...result.values()].filter((person) => person.role === role);
    if (matching.length > 1) {
      throw new RetirementParameterError(
        "DUPLICATE_PERSON_ROLE",
        `Only one person may have the ${role} role; found ${matching.map((person) => person.id).join(", ")}.`,
      );
    }
  }
  return result;
}

function normalizeAccounts(
  accounts: RetirementAccountInput[],
  persons: Map<string, NormalizedPerson>,
): NormalizedAccount[] {
  const ids = new Set<string>();
  return accounts.map((input, index) => {
    if (!input.id?.trim()) {
      throw new RetirementParameterError("ACCOUNT_ID_REQUIRED", `accounts[${index}].id is required.`);
    }
    if (ids.has(input.id)) {
      throw new RetirementParameterError("DUPLICATE_ACCOUNT_ID", `Duplicate account ID: ${input.id}`);
    }
    ids.add(input.id);
    if (!persons.has(input.ownerId)) {
      throw new RetirementParameterError(
        "UNKNOWN_ACCOUNT_OWNER",
        `Account ${input.id} references unknown owner ${input.ownerId}.`,
      );
    }
    const planRules = input.planRules ?? {};
    validatePlanRules(planRules, `accounts[${index}].planRules`);
    return {
      ...input,
      type: parseAccountType(input.type),
      priority: input.priority ?? 100,
      planRules,
      existingContributions: cloneComponents(input.existingContributions),
      inputIndex: index,
    };
  });
}

function validatePlanRules(rules: PlanRulesInput, path: string): void {
  money(rules.planCompensation, `${path}.planCompensation`);
  money(rules.includibleCompensation457, `${path}.includibleCompensation457`);
  money(rules.planDocumentEmployeeDeferralLimit, `${path}.planDocumentEmployeeDeferralLimit`);
  money(rules.planDocumentAnnualAdditionsLimit, `${path}.planDocumentAnnualAdditionsLimit`);
  money(rules.expectedEmployerContribution, `${path}.expectedEmployerContribution`);
  money(rules.simpleCustomEmployerContribution, `${path}.simpleCustomEmployerContribution`);
  money(rules.netEarningsFromSelfEmploymentAfterHalfSETax, `${path}.netEarningsFromSelfEmploymentAfterHalfSETax`);
  money(rules.simpleAdditionalNonelectiveContribution, `${path}.simpleAdditionalNonelectiveContribution`);
  rate(rules.employerMatchRate, `${path}.employerMatchRate`);
  rate(rules.employerMatchCompensationFraction, `${path}.employerMatchCompensationFraction`);
  rate(rules.employerNonelectiveRate, `${path}.employerNonelectiveRate`);
  if (rules.special403bCatchUp) {
    const special = rules.special403bCatchUp;
    if (!Number.isFinite(special.yearsOfService) || special.yearsOfService < 0) {
      throw new RetirementParameterError("INVALID_YEARS_OF_SERVICE", `${path}.special403bCatchUp.yearsOfService is invalid.`);
    }
    money(special.priorElectiveDeferrals, `${path}.special403bCatchUp.priorElectiveDeferrals`);
    money(special.priorSpecialCatchUpUsed, `${path}.special403bCatchUp.priorSpecialCatchUpUsed`);
  }
  if (rules.section457SpecialCatchUp) {
    money(
      rules.section457SpecialCatchUp.unusedDeferralsFromPriorYears,
      `${path}.section457SpecialCatchUp.unusedDeferralsFromPriorYears`,
    );
  }
}

function validateIsoDate(value: string, path: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new RetirementParameterError("INVALID_DATE", `${path} must use YYYY-MM-DD.`);
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RetirementParameterError("INVALID_DATE", `${path} is not a valid calendar date.`);
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

function recognizedCompensationForEmployerAllocation(
  context: CalculationContext,
  account: NormalizedAccount,
  person: NormalizedPerson,
): Money {
  const compensation = planCompensation(account, person);
  const statutoryLimit = context.parameters.annualCompensation401a17;
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
  parameters: YearParameters,
  persons: Map<string, NormalizedPerson>,
  accounts: NormalizedAccount[],
  scenarioDiagnostics: Diagnostic[],
): CalculationContext {
  const context: CalculationContext = {
    taxYear,
    filingStatus,
    parameters,
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
  };

  initializeIraPools(context, accounts);
  initializeElectiveDeferralPools(context, accounts);
  initializeAnnualAdditionsPools(context, accounts);
  initializeSection457Pools(context, accounts);
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
      used: 0,
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
        used: 0,
      });
    }

    let personalLimit = statutory;
    if (personalLimit !== null && isHouseholdMember && parameters.year < 1997 && ownCompensation === 0) {
      personalLimit = parameters.ira.spousalIraAvailable
        ? parameters.ira.nonworkingSpouseIndividualLimit
        : 0;
    }
    if (personalLimit !== null && isHouseholdMember && parameters.year < 1997 && ownCompensation > 0) {
      personalLimit = minMoney(personalLimit, ownCompensation * parameters.ira.compensationFraction);
    }
    context.iraOwnerPools.set(person.id, {
      id: `ira-owner:${person.id}`,
      legalLimit: "IRC 219(b) aggregate traditional and Roth IRA contribution limit",
      limit: personalLimit,
      used: 0,
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
      used: 0,
    });

    context.iraDeductionPools.set(person.id, {
      id: `traditional-ira-deduction:${person.id}`,
      legalLimit: "IRC 219(g) traditional IRA deduction limit",
      limit: traditionalIraDeductionLimit(context, person, personalLimit),
      used: 0,
    });
  }

  for (const account of accounts) {
    const traits = ACCOUNT_TRAITS[account.type];
    if (traits.family !== "regular_traditional_ira" && traits.family !== "regular_roth_ira") continue;
    const existing = regularIraContributionAmount(account.existingContributions);
    const ownerPool = context.iraOwnerPools.get(account.ownerId);
    if (!ownerPool) continue;
    ownerPool.used = roundMoney(ownerPool.used + existing);
    const compensationPool = context.iraCompensationPools.get(ownerPool.compensationPoolId);
    if (compensationPool) compensationPool.used = roundMoney(compensationPool.used + existing);
    const rothPool = context.iraRothEligibilityPools.get(account.ownerId);
    if (rothPool) rothPool.used = roundMoney(rothPool.used + account.existingContributions.rothIra);
    const deductionPool = context.iraDeductionPools.get(account.ownerId);
    if (deductionPool) deductionPool.used = roundMoney(deductionPool.used + account.existingContributions.deductibleIra);
  }
}

function initializeElectiveDeferralPools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  for (const person of context.persons.values()) {
    context.elective402gPools.set(person.id, {
      id: `402g:${person.id}`,
      legalLimit: "IRC 402(g) aggregate elective-deferral limit",
      limit: context.parameters.electiveDeferral402g,
      used: 0,
    });
    context.catchUpPools.set(person.id, {
      id: `414v:${person.id}`,
      legalLimit: "IRC 414(v) aggregate age-based catch-up limit",
      limit: ownerGeneralCatchUpLimit(context.parameters, person),
      used: 0,
    });
    context.special403bCatchUpPools.set(person.id, {
      id: `402g7:${person.id}`,
      legalLimit: "IRC 402(g)(7) aggregate 403(b) 15-year catch-up limit",
      limit: 3_000,
      used: 0,
    });
  }

  for (const account of accounts) {
    const traits = ACCOUNT_TRAITS[account.type];
    if (!traits.shares402g) continue;
    const basePool = context.elective402gPools.get(account.ownerId);
    const catchUpPool = context.catchUpPools.get(account.ownerId);
    if (basePool) basePool.used = roundMoney(basePool.used + baseElectiveDeferrals(account.existingContributions));
    if (catchUpPool) catchUpPool.used = roundMoney(catchUpPool.used + ageCatchUpDeferrals(account.existingContributions));
    if (traits.is403b) {
      const special403bPool = context.special403bCatchUpPools.get(account.ownerId);
      if (special403bPool) {
        special403bPool.used = roundMoney(
          special403bPool.used + account.existingContributions.special403bCatchUp,
        );
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
    let existing = 0;
    for (const account of members) {
      const person = context.persons.get(account.ownerId)!;
      recognizedCompensation = Math.max(recognizedCompensation, planCompensation(account, person));
      existing = roundMoney(existing + annualAdditionsAmount(account.existingContributions));
    }
    if (context.parameters.annualCompensation401a17 !== null) {
      recognizedCompensation = Math.min(recognizedCompensation, context.parameters.annualCompensation401a17);
    }
    let limit: Money | null = null;
    if (
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
      used: existing,
      compensation: roundMoney(recognizedCompensation),
    });
  }
}

function initializeSection457Pools(context: CalculationContext, accounts: NormalizedAccount[]): void {
  for (const person of context.persons.values()) {
    context.section457BasePools.set(person.id, {
      id: `457b:${person.id}`,
      legalLimit: "IRC 457(b) aggregate annual deferral limit (separate from IRC 402(g))",
      limit: context.parameters.section457b.baseDeferralLimit,
      used: 0,
    });
    context.section457CatchUpPools.set(person.id, {
      id: `457b-catch-up:${person.id}`,
      legalLimit: "IRC 414(v) governmental 457(b) age-based catch-up limit",
      limit: workplaceCatchUpLimit(
        context.parameters,
        person,
        ACCOUNT_TRAITS[AccountType.GOVERNMENTAL_457B],
      ),
      used: 0,
    });
    context.section457SpecialCatchUpPools.set(person.id, {
      id: `457b-special-catch-up:${person.id}`,
      legalLimit: "IRC 457(b)(3) special last-three-years catch-up",
      limit: context.parameters.section457b.baseDeferralLimit,
      used: 0,
    });
  }

  for (const account of accounts) {
    if (ACCOUNT_TRAITS[account.type].family !== "section457") continue;
    const base = roundMoney(
      baseElectiveDeferrals(account.existingContributions) +
        account.existingContributions.employeeAfterTax +
        account.existingContributions.employerPreTax +
        account.existingContributions.employerRoth,
    );
    const catchUp = ageCatchUpDeferrals(account.existingContributions);
    const basePool = context.section457BasePools.get(account.ownerId);
    const catchUpPool = context.section457CatchUpPools.get(account.ownerId);
    if (basePool) basePool.used = roundMoney(basePool.used + base);
    if (catchUpPool) catchUpPool.used = roundMoney(catchUpPool.used + catchUp);
    const specialPool = context.section457SpecialCatchUpPools.get(account.ownerId);
    if (specialPool) {
      specialPool.used = roundMoney(specialPool.used + account.existingContributions.special457CatchUp);
    }
  }
}

function regularIraContributionAmount(components: ContributionComponents): Money {
  return roundMoney(
    components.deductibleIra + components.nondeductibleIra + components.rothIra + components.unclassifiedIra,
  );
}

function poolRemaining(pool: LimitPool): Money | null {
  return pool.limit === null ? null : nonnegative(pool.limit - pool.used);
}

function takeFromPool(pool: LimitPool, requested: Money, sharedLimits: SharedLimitUse[]): Money {
  const usedBefore = pool.used;
  if (pool.limit === null) {
    sharedLimits.push({
      id: pool.id,
      legalLimit: pool.legalLimit,
      limit: null,
      usedBeforeAccount: usedBefore,
      usedByAccount: 0,
      remainingAfterAccount: null,
    });
    return 0;
  }
  const taken = minMoney(requested, nonnegative(pool.limit - pool.used));
  pool.used = roundMoney(pool.used + taken);
  sharedLimits.push({
    id: pool.id,
    legalLimit: pool.legalLimit,
    limit: pool.limit,
    usedBeforeAccount: usedBefore,
    usedByAccount: taken,
    remainingAfterAccount: nonnegative(pool.limit - pool.used),
  });
  return taken;
}

function reportPoolWithoutConsuming(pool: LimitPool, sharedLimits: SharedLimitUse[]): void {
  sharedLimits.push({
    id: pool.id,
    legalLimit: pool.legalLimit,
    limit: pool.limit,
    usedBeforeAccount: pool.used,
    usedByAccount: 0,
    remainingAfterAccount: poolRemaining(pool),
  });
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
  if (pools.some((pool) => pool.limit === null)) {
    for (const pool of pools) reportPoolWithoutConsuming(pool, sharedLimits);
    return 0;
  }
  const taken = minMoney(requested, ...pools.map((pool) => poolRemaining(pool)));
  for (const pool of pools) {
    const usedBefore = pool.used;
    pool.used = roundMoney(pool.used + taken);
    sharedLimits.push({
      id: pool.id,
      legalLimit: pool.legalLimit,
      limit: pool.limit,
      usedBeforeAccount: usedBefore,
      usedByAccount: taken,
      remainingAfterAccount: poolRemaining(pool),
    });
  }
  return taken;
}

function consumeExactFromPool(pool: LimitPool, amount: Money, sharedLimits: SharedLimitUse[]): void {
  const usedBefore = pool.used;
  pool.used = roundMoney(pool.used + amount);
  sharedLimits.push({
    id: pool.id,
    legalLimit: pool.legalLimit,
    limit: pool.limit,
    usedBeforeAccount: usedBefore,
    usedByAccount: amount,
    remainingAfterAccount: poolRemaining(pool),
  });
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
      return allocateDefinedBenefit(account);
    case "section457f":
      return allocateSection457f(account);
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
      diagnostic(
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

function baseDeferralLimitForAccount(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
): Money | null {
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

function special403bCatchUpLimit(account: NormalizedAccount): Money {
  const input = account.planRules.special403bCatchUp;
  if (!input?.eligible) return 0;
  const lifetimeRemaining = nonnegative(15_000 - money(input.priorSpecialCatchUpUsed, `${account.id}.priorSpecialCatchUpUsed`));
  const serviceRemaining = nonnegative(
    5_000 * input.yearsOfService - money(input.priorElectiveDeferrals, `${account.id}.priorElectiveDeferrals`),
  );
  return floorMoney(minMoney(3_000, lifetimeRemaining, serviceRemaining));
}

type CatchUpTaxTreatment = "pretax" | "roth" | "unavailable" | "unknown";

function catchUpTaxTreatment(
  context: CalculationContext,
  account: NormalizedAccount,
  traits: AccountTraits,
  diagnostics: Diagnostic[],
): CatchUpTaxTreatment {
  const person = context.persons.get(account.ownerId)!;
  const defaultTreatment = accountUsesRothEmployeeContributions(account, traits) ? "roth" : "pretax";
  const threshold = context.parameters.rothCatchUpPriorYearFicaWageThreshold;
  if (
    threshold === null ||
    traits.family === "simple" ||
    traits.isSarsep ||
    accountPlanCatchUpLimit(context, account, traits) === 0
  ) {
    return defaultTreatment;
  }
  if (account.planRules.isSelfEmployedOwner) return defaultTreatment;
  if (!account.employerId) {
    diagnostics.push(
      diagnostic(
        "EMPLOYER_ID_REQUIRED_FOR_ROTH_CATCH_UP_WAGE_TEST",
        DiagnosticSeverity.ERROR,
        "An employerId is required to apply the prior-year FICA-wage test for catch-up contributions.",
        `accounts.${account.id}.employerId`,
      ),
    );
    return "unknown";
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
    return "unknown";
  }
  if (wages <= threshold) return defaultTreatment;

  const permitsRoth =
    account.planRules.permitsRothCatchUp ??
    account.planRules.permitsRothContributions ??
    traits.designatedRoth;
  if (!permitsRoth) {
    diagnostics.push(
      diagnostic(
        "HIGH_WAGE_CATCH_UP_REQUIRES_ROTH_BUT_PLAN_DOES_NOT_OFFER_IT",
        DiagnosticSeverity.WARNING,
        `Prior-year FICA wages exceeded $${threshold.toLocaleString()}; no catch-up amount was allocated because the supplied plan rules do not permit Roth catch-up contributions.`,
        `accounts.${account.id}.planRules.permitsRothCatchUp`,
        "IRC 414(v)(7)",
      ),
    );
    return "unavailable";
  }
  diagnostics.push(
    diagnostic(
      "HIGH_WAGE_CATCH_UP_ALLOCATED_AS_ROTH",
      DiagnosticSeverity.INFO,
      `Prior-year FICA wages exceeded $${threshold.toLocaleString()}, so the age-based catch-up is allocated as Roth.`,
      `accounts.${account.id}`,
      "IRC 414(v)(7)",
    ),
  );
  return "roth";
}

function accountUsesRothEmployeeContributions(
  account: NormalizedAccount,
  traits: AccountTraits,
): boolean {
  if (account.planRules.contributionPreference === "roth_first") {
    return account.planRules.permitsRothContributions ?? traits.designatedRoth;
  }
  if (account.planRules.contributionPreference === "pretax_first") return false;
  return traits.designatedRoth;
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
  if (age === null && anyCatchUpAvailable) {
    diagnostics.push(
      diagnostic(
        "BIRTH_YEAR_OR_DATE_REQUIRED_FOR_WORKPLACE_CATCH_UP",
        DiagnosticSeverity.ERROR,
        "Birth year or birth date is required to determine the maximum age-based workplace catch-up contribution.",
        `persons.${person.id}`,
      ),
    );
  }
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
  const planDocumentEmployeeLimit = account.planRules.planDocumentEmployeeDeferralLimit;
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
  const pools: LimitPool[] = [basePool];
  if (annualGroup) pools.push(annualGroup);
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
    const specialLimit = special403bCatchUpLimit(account);
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

  const planCatchUpLimit = accountPlanCatchUpLimit(context, account, traits);
  const existingCatchUpForAccount = ageCatchUpDeferrals(account.existingContributions);
  const desiredCatchUp = minMoney(
    nonnegative(planCatchUpLimit - existingCatchUpForAccount),
    compensationRemaining,
  );
  let catchUpAdded = 0;
  const treatment = catchUpTaxTreatment(context, account, traits, diagnostics);
  if (treatment === "unknown") {
    reportPoolWithoutConsuming(catchUpPool, sharedLimits);
  } else if (treatment !== "unavailable" && desiredCatchUp > 0) {
    catchUpAdded = takeAcrossPools([catchUpPool], desiredCatchUp, sharedLimits);
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
  const cappedCompensation = context.parameters.annualCompensation401a17 === null
    ? compensation
    : Math.min(compensation, context.parameters.annualCompensation401a17);
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
  let employerKnown = traits.isStarter;
  let employerDesired = 0;
  let statutoryEmployerPotential = 0;

  if (traits.isStarter) {
    // Starter 401(k) and deferral-only safe-harbor 403(b) plans do not accept employer contributions.
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

  if (!traits.isStarter && account.planRules.permitsAfterTaxEmployeeContributions) {
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
  if (!traits.isStarter && !employerKnown && !account.planRules.permitsAfterTaxEmployeeContributions) {
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
  const statutoryMaximum = traits.isStarter
    ? roundMoney((baseDeferralLimitForAccount(context, account, traits) ?? 0) + planCatchUp)
    : roundMoney(
        accountAnnualLimit +
          planCatchUp +
          (traits.isSimple ? Math.max(0, statutoryEmployerPotential - accountAnnualLimit) : 0),
      );
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

  const includibleCompensation = money(
    account.planRules.includibleCompensation457 ?? account.planRules.planCompensation ?? planCompensation(account, person),
    `${account.id}.includibleCompensation457`,
  );
  const accountBaseLimit = minMoney(
    statutoryBase,
    includibleCompensation * compensationFraction,
    account.planRules.planDocumentEmployeeDeferralLimit ?? statutoryBase,
  );
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
    nonnegative(accountBaseLimit - existingRegularAccountAmount),
  );
  if (
    employerDesired > 0 &&
    validateEmployerRothAvailability(context, account, traits, diagnostics)
  ) {
    const employerAdded = takeAcrossPools([basePool], employerDesired, sharedLimits);
    addEmployerContribution(account, traits, annual, additional, employerAdded);
  }

  const regularBeforeEmployee = roundMoney(
    baseElectiveDeferrals(annual) + annual.employeeAfterTax + annual.employerPreTax + annual.employerRoth,
  );
  const regularDesired = nonnegative(accountBaseLimit - regularBeforeEmployee);
  const regularAdded = takeAcrossPools([basePool], regularDesired, sharedLimits);
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
      annual.employerPreTax -
      annual.employerRoth,
  );
  const ageLimit = traits.governmental457 ? accountPlanCatchUpLimit(context, account, traits) : 0;
  const existingAgeCatchUp = ageCatchUpDeferrals(account.existingContributions);
  const agePotential = minMoney(
    nonnegative(ageLimit - existingAgeCatchUp),
    poolRemaining(ageCatchUpPool),
    compensationRemaining,
  );

  const specialInput = account.planRules.section457SpecialCatchUp;
  const specialStatutoryExtra = specialInput?.eligible
    ? minMoney(
        statutoryBase,
        money(specialInput.unusedDeferralsFromPriorYears, `${account.id}.unused457Deferrals`),
        poolRemaining(specialPool),
        compensationRemaining,
      )
    : 0;

  if (specialStatutoryExtra > agePotential) {
    const specialAdded = takeAcrossPools([specialPool], specialStatutoryExtra, sharedLimits);
    additional.special457CatchUp = specialAdded;
    annual.special457CatchUp = roundMoney(annual.special457CatchUp + specialAdded);
    compensationRemaining = nonnegative(compensationRemaining - specialAdded);
    if (ageLimit > 0) {
      diagnostics.push(
        diagnostic(
          "SECTION_457_SPECIAL_CATCH_UP_SELECTED_OVER_AGE_CATCH_UP",
          DiagnosticSeverity.INFO,
          "The special last-three-years 457(b) catch-up produced the larger limit; it cannot be combined with the age-based catch-up.",
          `accounts.${account.id}`,
        ),
      );
    }
  } else if (agePotential > 0) {
    const treatment = catchUpTaxTreatment(context, account, traits, diagnostics);
    if (treatment === "unknown") {
      reportPoolWithoutConsuming(ageCatchUpPool, sharedLimits);
    } else if (treatment !== "unavailable") {
      const ageAdded = takeAcrossPools([ageCatchUpPool], agePotential, sharedLimits);
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
    statutoryMaximum: roundMoney(accountBaseLimit + Math.max(ageLimit, specialStatutoryExtra)),
    annualComponents: annual,
    additionalComponents: additional,
    planTermDependentCapacity: 0,
    sharedLimits,
    diagnostics,
  };
}

function allocateDefinedBenefit(account: NormalizedAccount): AllocationOutcome {
  return emptyOutcome(account, CalculationStatus.INDETERMINATE, null, [
    diagnostic(
      "DEFINED_BENEFIT_CONTRIBUTION_REQUIRES_ACTUARIAL_VALUATION",
      DiagnosticSeverity.ERROR,
      "A defined-benefit or cash-balance contribution is determined by the plan formula, funding method, assets, assumptions, participant census, and minimum/maximum funding rules; it is not a single statutory contribution limit.",
      `accounts.${account.id}`,
      "IRC 404, 412, 415(b); ERISA funding rules",
    ),
  ]);
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
  conversions: RothConversionInput[],
  persons: Map<string, NormalizedPerson>,
  accountsById: Map<string, NormalizedAccount>,
): NormalizedConversion[] {
  const ids = new Set<string>();
  return conversions.map((input, index) => {
    if (!input.id?.trim()) {
      throw new RetirementParameterError("CONVERSION_ID_REQUIRED", `conversions[${index}].id is required.`);
    }
    if (ids.has(input.id)) {
      throw new RetirementParameterError("DUPLICATE_CONVERSION_ID", `Duplicate conversion ID: ${input.id}`);
    }
    ids.add(input.id);
    if (!persons.has(input.ownerId)) {
      throw new RetirementParameterError(
        "UNKNOWN_CONVERSION_OWNER",
        `Conversion ${input.id} references unknown owner ${input.ownerId}.`,
      );
    }
    if (input.sourceAccountId && !accountsById.has(input.sourceAccountId)) {
      throw new RetirementParameterError(
        "UNKNOWN_CONVERSION_SOURCE_ACCOUNT",
        `Conversion ${input.id} references unknown source account ${input.sourceAccountId}.`,
      );
    }
    return {
      ...input,
      type: parseConversionType(input.type),
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

export function calculateRetirementScenario(input: RetirementScenarioInput): RetirementScenarioResult {
  const scenarioDiagnostics: Diagnostic[] = [];
  const taxYear = input.taxYear;
  const parameters = getParametersForYear(taxYear);
  const filingStatus = parseFilingStatus(input.filingStatus, scenarioDiagnostics);
  const persons = normalizePersons(input.persons);
  const accounts = normalizeAccounts(input.accounts ?? [], persons);
  const allocationOrder = [...accounts].sort(
    (left, right) => (left.priority! - right.priority!) || (left.inputIndex - right.inputIndex),
  );
  const context = createCalculationContext(
    taxYear,
    filingStatus,
    parameters,
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
      if (shared.limit !== null && shared.usedBeforeAccount > shared.limit + 0.009) {
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
      contributionComponents: outcome.annualComponents,
      planTermDependentCapacity: outcome.planTermDependentCapacity,
      federalTaxEffects: contributionTaxEffects(outcome.annualComponents, traits, account.planRules),
      sharedLimits: outcome.sharedLimits,
      diagnostics,
    };
    accountResultById.set(account.id, result);
  }

  const accountResults = accounts.map((account) => accountResultById.get(account.id)!);
  const normalizedConversions = normalizeConversions(input.conversions ?? [], persons, context.accountsById);
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

  public build(): PersonInput {
    return deepClone(this.value);
  }
}

export class RetirementAccountBuilder {
  private readonly value: RetirementAccountInput;

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

  public grandfatheredSarsep(grandfathered = true): this {
    (this.value.planRules ??= {}).grandfatheredSarsep = grandfathered;
    return this;
  }

  public existing(contributions: ExistingContributionInput): this {
    this.value.existingContributions = { ...contributions };
    return this;
  }

  public build(): RetirementAccountInput {
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

export class RetirementScenario {
  public constructor(private readonly input: RetirementScenarioInput) {}

  public calculate(): RetirementScenarioResult {
    return calculateRetirementScenario(deepClone(this.input));
  }

  public toInput(): RetirementScenarioInput {
    return deepClone(this.input);
  }
}

export class RetirementScenarioBuilder {
  private readonly value: RetirementScenarioInput;

  public static forTaxYear(taxYear: number): RetirementScenarioBuilder {
    return new RetirementScenarioBuilder(taxYear);
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

  public addAccount(account: RetirementAccountInput | RetirementAccountBuilder): this {
    this.value.accounts.push(
      account instanceof RetirementAccountBuilder ? account.build() : deepClone(account),
    );
    return this;
  }

  public account(
    id: string,
    ownerId: string,
    type: AccountType | string,
    configure?: (builder: RetirementAccountBuilder) => void,
  ): this {
    const builder = new RetirementAccountBuilder(id, ownerId, type);
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

  public build(): RetirementScenario {
    return new RetirementScenario(deepClone(this.value));
  }

  public calculate(): RetirementScenarioResult {
    return this.build().calculate();
  }

  public toInput(): RetirementScenarioInput {
    return deepClone(this.value);
  }
}

export class USTaxAdvantagedParams {
  public static forTaxYear(taxYear: number): RetirementScenarioBuilder {
    return RetirementScenarioBuilder.forTaxYear(taxYear);
  }

  public static calculate(input: RetirementScenarioInput): RetirementScenarioResult {
    return calculateRetirementScenario(input);
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
}

export default USTaxAdvantagedParams;
