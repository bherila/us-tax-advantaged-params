<?php

declare(strict_types=1);

namespace USARetirementAccountParameters;

use DateTimeImmutable;
use DateTimeZone;
use InvalidArgumentException;
use JsonException;
use RuntimeException;


enum FilingStatus: string
{
    case SINGLE = 'single';
    case MARRIED_FILING_JOINTLY = 'married_filing_jointly';
    case MARRIED_FILING_SEPARATELY = 'married_filing_separately';
    case HEAD_OF_HOUSEHOLD = 'head_of_household';
    case QUALIFYING_SURVIVING_SPOUSE = 'qualifying_surviving_spouse';
}

enum AccountType: string
{
    case TRADITIONAL_IRA = 'traditional_ira';
    case ROTH_IRA = 'roth_ira';
    case ROLLOVER_IRA = 'rollover_ira';
    case PAYROLL_DEDUCTION_IRA = 'payroll_deduction_ira';
    case DEEMED_TRADITIONAL_IRA = 'deemed_traditional_ira';
    case DEEMED_ROTH_IRA = 'deemed_roth_ira';
    case INHERITED_TRADITIONAL_IRA = 'inherited_traditional_ira';
    case INHERITED_ROTH_IRA = 'inherited_roth_ira';
    case SEP_IRA = 'sep_ira';
    case ROTH_SEP_IRA = 'roth_sep_ira';
    case SIMPLE_IRA = 'simple_ira';
    case ROTH_SIMPLE_IRA = 'roth_simple_ira';
    case SARSEP_IRA = 'sarsep_ira';
    case TRADITIONAL_401K = 'traditional_401k';
    case ROTH_401K = 'roth_401k';
    case SOLO_401K = 'solo_401k';
    case ROTH_SOLO_401K = 'roth_solo_401k';
    case SIMPLE_401K = 'simple_401k';
    case ROTH_SIMPLE_401K = 'roth_simple_401k';
    case STARTER_401K = 'starter_401k';
    case TRADITIONAL_403B = 'traditional_403b';
    case ROTH_403B = 'roth_403b';
    case SAFE_HARBOR_403B_DEFERRAL_ONLY = 'safe_harbor_403b_deferral_only';
    case GOVERNMENTAL_457B = 'governmental_457b';
    case ROTH_GOVERNMENTAL_457B = 'roth_governmental_457b';
    case NONGOVERNMENTAL_457B = 'nongovernmental_457b';
    case SECTION_457F = 'section_457f';
    case TRADITIONAL_TSP = 'traditional_tsp';
    case ROTH_TSP = 'roth_tsp';
    case SECTION_401A = 'section_401a';
    case PROFIT_SHARING_PLAN = 'profit_sharing_plan';
    case MONEY_PURCHASE_PLAN = 'money_purchase_plan';
    case KEOGH_PLAN = 'keogh_plan';
    case ESOP = 'esop';
    case DEFINED_BENEFIT_PLAN = 'defined_benefit_plan';
    case CASH_BALANCE_PLAN = 'cash_balance_plan';
}

enum ConversionType: string
{
    case IRA_TO_ROTH_IRA = 'ira_to_roth_ira';
    case QUALIFIED_PLAN_TO_ROTH_IRA = 'qualified_plan_to_roth_ira';
    case IN_PLAN_ROTH_ROLLOVER = 'in_plan_roth_rollover';
}

enum CalculationStatus: string
{
    case DETERMINATE = 'determinate';
    case DETERMINATE_WITH_ASSUMPTIONS = 'determinate_with_assumptions';
    case INDETERMINATE = 'indeterminate';
    case UNAVAILABLE = 'unavailable';
    case INELIGIBLE = 'ineligible';
}

enum DiagnosticSeverity: string
{
    case INFO = 'info';
    case WARNING = 'warning';
    case ERROR = 'error';
}

class RetirementParameterException extends InvalidArgumentException
{
    public function __construct(public readonly string $errorCode, string $message)
    {
        parent::__construct($message);
    }
}

final class UnsupportedTaxYearException extends RetirementParameterException
{
    public function __construct(int $year, int $minimum, int $maximum)
    {
        parent::__construct(
            'UNSUPPORTED_TAX_YEAR',
            "Tax year {$year} is not supported. Supported years are {$minimum}-{$maximum}; future years are never extrapolated.",
        );
    }
}

final class PersonBuilder
{
    /** @var array<string,mixed> */
    private array $value;

    public function __construct(string $id)
    {
        $this->value = [
            'id' => $id,
            'compensation' => [],
            'magi' => [],
            'priorYearFicaWagesByEmployer' => [],
        ];
    }

    public function asTaxpayer(): self
    {
        $this->value['role'] = 'taxpayer';
        return $this;
    }

    public function asSpouse(): self
    {
        $this->value['role'] = 'spouse';
        return $this;
    }

    public function role(string $role): self
    {
        $this->value['role'] = $role;
        return $this;
    }

    public function bornOn(string $birthDate): self
    {
        $this->value['birthDate'] = $birthDate;
        unset($this->value['birthYear']);
        return $this;
    }

    public function bornIn(int $birthYear): self
    {
        $this->value['birthYear'] = $birthYear;
        unset($this->value['birthDate']);
        return $this;
    }

    public function iraCompensation(float|int $amount): self
    {
        $this->value['compensation']['iraCompensation'] = $amount;
        return $this;
    }

    public function w2Compensation(float|int $amount): self
    {
        $this->value['compensation']['w2Compensation'] = $amount;
        return $this;
    }

    public function selfEmploymentNetEarnings(float|int $amount): self
    {
        $this->value['compensation']['selfEmploymentNetEarnings'] = $amount;
        return $this;
    }

    public function rothIraMagi(float|int $amount): self
    {
        $this->value['magi']['rothIra'] = $amount;
        return $this;
    }

    public function traditionalIraDeductionMagi(float|int $amount): self
    {
        $this->value['magi']['traditionalIraDeduction'] = $amount;
        return $this;
    }

    public function rothConversionMagi(float|int $amount): self
    {
        $this->value['magi']['rothConversion'] = $amount;
        return $this;
    }

    public function coveredByEmployerPlan(bool $covered = true): self
    {
        $this->value['coveredByEmployerRetirementPlan'] = $covered;
        return $this;
    }

    public function livedWithSpouseDuringYear(bool $livedTogether = true): self
    {
        $this->value['livedWithSpouseDuringYear'] = $livedTogether;
        return $this;
    }

    public function priorYearFicaWages(string $employerId, float|int $amount): self
    {
        $this->value['priorYearFicaWagesByEmployer'][$employerId] = $amount;
        return $this;
    }

    public function aggregateTraditionalSepSimpleIraBasis(float|int $amount): self
    {
        $this->value['traditionalSepSimpleIraBasis'] = $amount;
        return $this;
    }

    public function yearEndTraditionalSepSimpleIraValue(float|int $amount): self
    {
        $this->value['yearEndTraditionalSepSimpleIraValue'] = $amount;
        return $this;
    }

    public function otherTraditionalSepSimpleIraDistributions(float|int $amount): self
    {
        $this->value['otherTraditionalSepSimpleIraDistributions'] = $amount;
        return $this;
    }

    /** @return array<string,mixed> */
    public function build(): array
    {
        return Engine::copy($this->value);
    }
}

final class RetirementAccountBuilder
{
    /** @var array<string,mixed> */
    private array $value;

    public function __construct(string $id, string $ownerId, AccountType|string $type)
    {
        $this->value = [
            'id' => $id,
            'ownerId' => $ownerId,
            'type' => $type instanceof AccountType ? $type->value : $type,
            'planRules' => [],
            'existingContributions' => [],
        ];
    }

    public function owner(string $ownerId): self
    {
        $this->value['ownerId'] = $ownerId;
        return $this;
    }

    public function accountType(AccountType|string $type): self
    {
        $this->value['type'] = $type instanceof AccountType ? $type->value : $type;
        return $this;
    }

    public function employer(string $employerId): self
    {
        $this->value['employerId'] = $employerId;
        return $this;
    }

    public function priority(int $priority): self
    {
        $this->value['priority'] = $priority;
        return $this;
    }

    public function planCompensation(float|int $amount): self
    {
        $this->value['planRules']['planCompensation'] = $amount;
        return $this;
    }

    public function includible457Compensation(float|int $amount): self
    {
        $this->value['planRules']['includibleCompensation457'] = $amount;
        return $this;
    }

    public function annualAdditionsGroup(string $groupId): self
    {
        $this->value['planRules']['annualAdditionsGroupId'] = $groupId;
        return $this;
    }

    public function planDocumentEmployeeLimit(float|int $amount): self
    {
        $this->value['planRules']['planDocumentEmployeeDeferralLimit'] = $amount;
        return $this;
    }

    public function planDocumentAnnualAdditionsLimit(float|int $amount): self
    {
        $this->value['planRules']['planDocumentAnnualAdditionsLimit'] = $amount;
        return $this;
    }

    public function permitsRothContributions(bool $permits = true): self
    {
        $this->value['planRules']['permitsRothContributions'] = $permits;
        return $this;
    }

    public function permitsRothCatchUp(bool $permits = true): self
    {
        $this->value['planRules']['permitsRothCatchUp'] = $permits;
        return $this;
    }

    public function permitsAfterTaxContributions(bool $permits = true): self
    {
        $this->value['planRules']['permitsAfterTaxEmployeeContributions'] = $permits;
        return $this;
    }

    public function permitsInPlanRothRollover(bool $permits = true): self
    {
        $this->value['planRules']['permitsInPlanRothRollover'] = $permits;
        return $this;
    }

    public function contributionPreference(string $preference): self
    {
        $this->value['planRules']['contributionPreference'] = $preference;
        return $this;
    }

    public function expectedEmployerContribution(float|int $amount, ?string $taxTreatment = null): self
    {
        $this->value['planRules']['expectedEmployerContribution'] = $amount;
        if ($taxTreatment !== null) {
            $this->value['planRules']['employerContributionTaxTreatment'] = $taxTreatment;
        }
        return $this;
    }

    public function employerMatch(float $matchRate, float $compensationFraction): self
    {
        $this->value['planRules']['employerMatchRate'] = $matchRate;
        $this->value['planRules']['employerMatchCompensationFraction'] = $compensationFraction;
        return $this;
    }

    public function employerNonelective(float $rate): self
    {
        $this->value['planRules']['employerNonelectiveRate'] = $rate;
        return $this;
    }

    public function employerContributionTaxTreatment(string $treatment): self
    {
        $this->value['planRules']['employerContributionTaxTreatment'] = $treatment;
        return $this;
    }

    public function simpleEmployerMethod(string $method, float|int|null $customAmount = null): self
    {
        $this->value['planRules']['simpleEmployerContributionMethod'] = $method;
        if ($customAmount !== null) {
            $this->value['planRules']['simpleCustomEmployerContribution'] = $customAmount;
        }
        return $this;
    }

    public function simpleEnhancedLimitEligible(bool $eligible = true): self
    {
        $this->value['planRules']['simpleEnhancedLimitEligible'] = $eligible;
        return $this;
    }

    public function simpleAdditionalNonelectiveContribution(float|int $amount): self
    {
        $this->value['planRules']['simpleAdditionalNonelectiveContribution'] = $amount;
        return $this;
    }

    public function selfEmployedOwner(float|int $netEarningsAfterHalfSelfEmploymentTax): self
    {
        $this->value['planRules']['isSelfEmployedOwner'] = true;
        $this->value['planRules']['netEarningsFromSelfEmploymentAfterHalfSETax'] = $netEarningsAfterHalfSelfEmploymentTax;
        return $this;
    }

    /** @param array<string,mixed> $input */
    public function special403bCatchUp(array $input): self
    {
        $this->value['planRules']['special403bCatchUp'] = $input;
        return $this;
    }

    /** @param array<string,mixed> $input */
    public function special457CatchUp(array $input): self
    {
        $this->value['planRules']['section457SpecialCatchUp'] = $input;
        return $this;
    }

    public function grandfatheredSarsep(bool $grandfathered = true): self
    {
        $this->value['planRules']['grandfatheredSarsep'] = $grandfathered;
        return $this;
    }

    /** @param array<string,float|int> $contributions */
    public function existing(array $contributions): self
    {
        $this->value['existingContributions'] = $contributions;
        return $this;
    }

    /** @return array<string,mixed> */
    public function build(): array
    {
        return Engine::copy($this->value);
    }
}

final class RothConversionBuilder
{
    /** @var array<string,mixed> */
    private array $value;

    public function __construct(
        string $id,
        string $ownerId,
        ConversionType|string $type,
        float|int $amount,
    ) {
        $this->value = [
            'id' => $id,
            'ownerId' => $ownerId,
            'type' => $type instanceof ConversionType ? $type->value : $type,
            'amount' => $amount,
        ];
    }

    public function afterTaxBasis(float|int $amount): self
    {
        $this->value['afterTaxBasisInConvertedAmount'] = $amount;
        return $this;
    }

    public function aggregateIraBasis(float|int $amount): self
    {
        $this->value['aggregateIraBasisOverride'] = $amount;
        return $this;
    }

    public function yearEndAggregateIraValue(float|int $amount): self
    {
        $this->value['yearEndAggregateIraValueOverride'] = $amount;
        return $this;
    }

    public function otherwiseDistributable(bool $eligible = true): self
    {
        $this->value['otherwiseDistributableAmount'] = $eligible;
        return $this;
    }

    public function sourceAccount(string $accountId): self
    {
        $this->value['sourceAccountId'] = $accountId;
        return $this;
    }

    /** @return array<string,mixed> */
    public function build(): array
    {
        return Engine::copy($this->value);
    }
}

final class RetirementScenario
{
    /** @param array<string,mixed> $input */
    public function __construct(private readonly array $input)
    {
    }

    /** @return array<string,mixed> */
    public function calculate(): array
    {
        return USARetirementAccountParameters::calculate(Engine::copy($this->input));
    }

    /** @return array<string,mixed> */
    public function toInput(): array
    {
        return Engine::copy($this->input);
    }
}

final class RetirementScenarioBuilder
{
    /** @var array<string,mixed> */
    private array $value;

    public static function forTaxYear(int $taxYear): self
    {
        return new self($taxYear);
    }

    public function __construct(int $taxYear)
    {
        $this->value = [
            'taxYear' => $taxYear,
            'filingStatus' => FilingStatus::SINGLE->value,
            'persons' => [],
            'accounts' => [],
            'conversions' => [],
        ];
    }

    public function filingStatus(FilingStatus|string $status): self
    {
        $this->value['filingStatus'] = $status instanceof FilingStatus ? $status->value : $status;
        return $this;
    }

    public function addPerson(PersonBuilder|array $person): self
    {
        $this->value['persons'][] = $person instanceof PersonBuilder ? $person->build() : Engine::copy($person);
        return $this;
    }

    public function taxpayer(string $id, ?callable $configure = null): self
    {
        $builder = (new PersonBuilder($id))->asTaxpayer();
        if ($configure !== null) {
            $configure($builder);
        }
        return $this->addPerson($builder);
    }

    public function spouse(string $id, ?callable $configure = null): self
    {
        $builder = (new PersonBuilder($id))->asSpouse();
        if ($configure !== null) {
            $configure($builder);
        }
        return $this->addPerson($builder);
    }

    public function addAccount(RetirementAccountBuilder|array $account): self
    {
        $this->value['accounts'][] = $account instanceof RetirementAccountBuilder
            ? $account->build()
            : Engine::copy($account);
        return $this;
    }

    public function account(
        string $id,
        string $ownerId,
        AccountType|string $type,
        ?callable $configure = null,
    ): self {
        $builder = new RetirementAccountBuilder($id, $ownerId, $type);
        if ($configure !== null) {
            $configure($builder);
        }
        return $this->addAccount($builder);
    }

    public function addConversion(RothConversionBuilder|array $conversion): self
    {
        $this->value['conversions'][] = $conversion instanceof RothConversionBuilder
            ? $conversion->build()
            : Engine::copy($conversion);
        return $this;
    }

    public function conversion(
        string $id,
        string $ownerId,
        ConversionType|string $type,
        float|int $amount,
        ?callable $configure = null,
    ): self {
        $builder = new RothConversionBuilder($id, $ownerId, $type, $amount);
        if ($configure !== null) {
            $configure($builder);
        }
        return $this->addConversion($builder);
    }

    public function build(): RetirementScenario
    {
        return new RetirementScenario(Engine::copy($this->value));
    }

    /** @return array<string,mixed> */
    public function calculate(): array
    {
        return $this->build()->calculate();
    }

    /** @return array<string,mixed> */
    public function toInput(): array
    {
        return Engine::copy($this->value);
    }
}

final class USARetirementAccountParameters
{
    public const PACKAGE_NAME = 'usa-retirement-account-parameters';
    public const ENGINE_VERSION = '0.1.0';

    private static ?array $parameters = null;

    /* <generated-parameters> */
private const PARAMETER_JSON = <<<'JSON'
{
  "schemaVersion": 1,
  "package": "usa-retirement-account-parameters",
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
}
JSON;
/* </generated-parameters> */

    public static function forTaxYear(int $taxYear): RetirementScenarioBuilder
    {
        return RetirementScenarioBuilder::forTaxYear($taxYear);
    }

    /** @param array<string,mixed> $input
     *  @return array<string,mixed>
     */
    public static function calculate(array $input): array
    {
        return Engine::calculate($input, self::data());
    }

    /** @return array<string,mixed> */
    public static function parametersForYear(int $taxYear): array
    {
        $data = self::data();
        $minimum = (int) $data['supportedTaxYears']['minimum'];
        $maximum = (int) $data['supportedTaxYears']['maximum'];
        if ($taxYear < $minimum || $taxYear > $maximum || !isset($data['years'][(string) $taxYear])) {
            throw new UnsupportedTaxYearException($taxYear, $minimum, $maximum);
        }
        return Engine::copy($data['years'][(string) $taxYear]);
    }

    /** @return array{minimum:int,maximum:int} */
    public static function supportedTaxYears(): array
    {
        $supported = self::data()['supportedTaxYears'];
        return ['minimum' => (int) $supported['minimum'], 'maximum' => (int) $supported['maximum']];
    }

    public static function generatedThroughTaxYear(): int
    {
        return (int) self::data()['generatedThroughTaxYear'];
    }

    public static function normalizeFilingStatus(FilingStatus|string $status): string
    {
        $diagnostics = [];
        return Engine::parseFilingStatus($status, $diagnostics);
    }

    public static function normalizeAccountType(AccountType|string $type): string
    {
        return Engine::parseAccountType($type);
    }

    /** @return list<array<string,string>> */
    public static function sourceMetadata(): array
    {
        return Engine::copy(self::data()['sources']);
    }

    /** @return array<string,mixed> */
    private static function data(): array
    {
        if (self::$parameters === null) {
            try {
                self::$parameters = json_decode(self::PARAMETER_JSON, true, 512, JSON_THROW_ON_ERROR);
            } catch (JsonException $exception) {
                throw new RuntimeException('Embedded retirement parameter JSON is invalid.', 0, $exception);
            }
        }
        return self::$parameters;
    }
}

/** @internal */
final class Engine
{
    /** @param array<string,mixed> $input
     *  @param array<string,mixed> $data
     *  @return array<string,mixed>
     */
    public static function calculate(array $input, array $data): array
    {
        $scenarioDiagnostics = [];
        $taxYear = (int) ($input['taxYear'] ?? 0);
        $minimum = (int) $data['supportedTaxYears']['minimum'];
        $maximum = (int) $data['supportedTaxYears']['maximum'];
        if ($taxYear < $minimum || $taxYear > $maximum || !isset($data['years'][(string) $taxYear])) {
            throw new UnsupportedTaxYearException($taxYear, $minimum, $maximum);
        }
        $parameters = self::copy($data['years'][(string) $taxYear]);
        $filingStatus = self::parseFilingStatus(
            $input['filingStatus'] ?? FilingStatus::SINGLE->value,
            $scenarioDiagnostics,
        );
        $persons = self::normalizePersons($input['persons'] ?? []);
        $accounts = self::normalizeAccounts($input['accounts'] ?? [], $persons);
        $context = self::createContext(
            $taxYear,
            $filingStatus,
            $parameters,
            $persons,
            $accounts,
            $scenarioDiagnostics,
            $data,
        );

        $allocationOrder = $accounts;
        usort(
            $allocationOrder,
            static fn (array $left, array $right): int =>
                (($left['priority'] ?? 100) <=> ($right['priority'] ?? 100))
                ?: ($left['inputIndex'] <=> $right['inputIndex']),
        );

        $byId = [];
        foreach ($allocationOrder as $account) {
            $outcome = self::allocateAccount($context, $account);
            $traits = self::traits($account['type']);
            $existingAnnual = self::sumComponents($account['existingContributions']);
            $annualMaximum = self::sumComponents($outcome['annualComponents']);
            $additionalMaximum = self::sumComponents($outcome['additionalComponents']);
            $diagnostics = $outcome['diagnostics'];
            if (
                $outcome['statutoryMaximum'] !== null
                && $annualMaximum > (float) $outcome['statutoryMaximum'] + 0.009
            ) {
                $diagnostics[] = self::diagnostic(
                    'SUPPLIED_EXISTING_CONTRIBUTIONS_EXCEED_ACCOUNT_MAXIMUM',
                    DiagnosticSeverity::ERROR,
                    'The annual amount exceeds the calculated account ceiling. Review supplied existing contributions and shared limits.',
                    "accounts.{$account['id']}.existingContributions",
                );
            }
            foreach ($outcome['sharedLimits'] as $shared) {
                if ($shared['limit'] !== null && $shared['usedBeforeAccount'] > $shared['limit'] + 0.009) {
                    $diagnostics[] = self::diagnostic(
                        'SUPPLIED_EXISTING_CONTRIBUTIONS_EXCEED_SHARED_LIMIT',
                        DiagnosticSeverity::ERROR,
                        "Existing contributions already exceed the {$shared['legalLimit']}.",
                        "accounts.{$account['id']}.existingContributions",
                    );
                }
            }
            $finalStatus = $outcome['status'];
            if (self::hasError($diagnostics)
                && !in_array($finalStatus, [CalculationStatus::UNAVAILABLE->value, CalculationStatus::INELIGIBLE->value], true)
            ) {
                $finalStatus = CalculationStatus::INDETERMINATE->value;
            }
            $result = [
                'accountId' => $account['id'],
                'accountType' => $account['type'],
                'ownerId' => $account['ownerId'],
                'status' => $finalStatus,
                'statutoryMaximumAnnualContribution' => $outcome['statutoryMaximum'],
                'maximumAnnualContributionBasedOnInputs' =>
                    $outcome['status'] === CalculationStatus::INDETERMINATE->value && $annualMaximum === 0.0
                        ? null
                        : $annualMaximum,
                'maximumAdditionalContributionBasedOnInputs' =>
                    $outcome['status'] === CalculationStatus::INDETERMINATE->value && $additionalMaximum === 0.0
                        ? null
                        : $additionalMaximum,
                'existingAnnualContribution' => $existingAnnual,
                'contributionComponents' => $outcome['annualComponents'],
                'planTermDependentCapacity' => $outcome['planTermDependentCapacity'],
                'federalTaxEffects' => self::contributionTaxEffects(
                    $outcome['annualComponents'],
                    $traits,
                    $account['planRules'],
                ),
                'sharedLimits' => $outcome['sharedLimits'],
                'diagnostics' => $diagnostics,
            ];
            if (isset($account['employerId'])) {
                $result['employerId'] = $account['employerId'];
            }
            $byId[$account['id']] = $result;
        }

        $accountResults = [];
        foreach ($accounts as $account) {
            $accountResults[] = $byId[$account['id']];
        }
        $conversions = self::normalizeConversions($input['conversions'] ?? [], $persons, $context['accountsById']);
        $conversionResults = self::calculateConversions($context, $conversions, $accountResults);
        $allDiagnostics = $scenarioDiagnostics;
        foreach ($accountResults as $accountResult) {
            array_push($allDiagnostics, ...$accountResult['diagnostics']);
        }
        foreach ($conversionResults as $conversionResult) {
            array_push($allDiagnostics, ...$conversionResult['diagnostics']);
        }

        return [
            'package' => USARetirementAccountParameters::PACKAGE_NAME,
            'engineVersion' => USARetirementAccountParameters::ENGINE_VERSION,
            'taxYear' => $taxYear,
            'filingStatus' => $filingStatus,
            'parameters' => $parameters,
            'accounts' => $accountResults,
            'conversions' => $conversionResults,
            'totals' => self::totals($accountResults, $conversionResults),
            'diagnostics' => $allDiagnostics,
        ];
    }

    /** @template T
     *  @param T $value
     *  @return T
     */
    public static function copy(mixed $value): mixed
    {
        try {
            return json_decode(json_encode($value, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException('Unable to copy retirement-calculation input.', 0, $exception);
        }
    }

    /** @param list<array<string,mixed>> $diagnostics */
    public static function parseFilingStatus(FilingStatus|string $value, array &$diagnostics): string
    {
        if ($value instanceof FilingStatus) {
            return $value->value;
        }
        if (in_array($value, array_column(FilingStatus::cases(), 'value'), true)) {
            return $value;
        }
        $token = self::normalizeToken($value);
        $aliases = [
            'S' => FilingStatus::SINGLE->value,
            'SINGLE' => FilingStatus::SINGLE->value,
            'UNMARRIED' => FilingStatus::SINGLE->value,
            'M' => FilingStatus::MARRIED_FILING_JOINTLY->value,
            'MFJ' => FilingStatus::MARRIED_FILING_JOINTLY->value,
            'MARRIED' => FilingStatus::MARRIED_FILING_JOINTLY->value,
            'MARRIED_FILING_JOINTLY' => FilingStatus::MARRIED_FILING_JOINTLY->value,
            'JOINT' => FilingStatus::MARRIED_FILING_JOINTLY->value,
            'MFS' => FilingStatus::MARRIED_FILING_SEPARATELY->value,
            'MARRIED_FILING_SEPARATELY' => FilingStatus::MARRIED_FILING_SEPARATELY->value,
            'SEPARATE' => FilingStatus::MARRIED_FILING_SEPARATELY->value,
            'HOH' => FilingStatus::HEAD_OF_HOUSEHOLD->value,
            'HEAD_OF_HOUSEHOLD' => FilingStatus::HEAD_OF_HOUSEHOLD->value,
            'QSS' => FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value,
            'QW' => FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value,
            'QUALIFYING_WIDOW' => FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value,
            'QUALIFYING_WIDOWER' => FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value,
            'QUALIFYING_SURVIVING_SPOUSE' => FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value,
        ];
        if (!isset($aliases[$token])) {
            throw new RetirementParameterException('INVALID_FILING_STATUS', "Unsupported filing status: {$value}");
        }
        if ($token === 'M') {
            $diagnostics[] = self::diagnostic(
                'AMBIGUOUS_M_ALIAS_ASSUMED_MFJ',
                DiagnosticSeverity::WARNING,
                'Filing-status alias "M" was interpreted as married filing jointly. Use MFJ or MFS to be explicit.',
                'filingStatus',
            );
        }
        return $aliases[$token];
    }

    public static function parseAccountType(AccountType|string $value): string
    {
        if ($value instanceof AccountType) {
            return $value->value;
        }
        if (in_array($value, array_column(AccountType::cases(), 'value'), true)) {
            return $value;
        }
        $aliases = [
            'IRA' => AccountType::TRADITIONAL_IRA->value,
            'TRADITIONAL_IRA' => AccountType::TRADITIONAL_IRA->value,
            'ROTH_IRA' => AccountType::ROTH_IRA->value,
            'ROLLOVER_IRA' => AccountType::ROLLOVER_IRA->value,
            'PAYROLL_DEDUCTION_IRA' => AccountType::PAYROLL_DEDUCTION_IRA->value,
            'DEEMED_IRA' => AccountType::DEEMED_TRADITIONAL_IRA->value,
            'DEEMED_TRADITIONAL_IRA' => AccountType::DEEMED_TRADITIONAL_IRA->value,
            'DEEMED_ROTH_IRA' => AccountType::DEEMED_ROTH_IRA->value,
            'INHERITED_IRA' => AccountType::INHERITED_TRADITIONAL_IRA->value,
            'INHERITED_TRADITIONAL_IRA' => AccountType::INHERITED_TRADITIONAL_IRA->value,
            'INHERITED_ROTH_IRA' => AccountType::INHERITED_ROTH_IRA->value,
            'SEP' => AccountType::SEP_IRA->value,
            'SEP_IRA' => AccountType::SEP_IRA->value,
            'ROTH_SEP' => AccountType::ROTH_SEP_IRA->value,
            'ROTH_SEP_IRA' => AccountType::ROTH_SEP_IRA->value,
            'SIMPLE' => AccountType::SIMPLE_IRA->value,
            'SIMPLE_IRA' => AccountType::SIMPLE_IRA->value,
            'ROTH_SIMPLE' => AccountType::ROTH_SIMPLE_IRA->value,
            'ROTH_SIMPLE_IRA' => AccountType::ROTH_SIMPLE_IRA->value,
            'SARSEP' => AccountType::SARSEP_IRA->value,
            'SARSEP_IRA' => AccountType::SARSEP_IRA->value,
            '401K' => AccountType::TRADITIONAL_401K->value,
            'TRADITIONAL_401K' => AccountType::TRADITIONAL_401K->value,
            'ROTH_401K' => AccountType::ROTH_401K->value,
            'SOLO_401K' => AccountType::SOLO_401K->value,
            'INDIVIDUAL_401K' => AccountType::SOLO_401K->value,
            'ROTH_SOLO_401K' => AccountType::ROTH_SOLO_401K->value,
            'SIMPLE_401K' => AccountType::SIMPLE_401K->value,
            'ROTH_SIMPLE_401K' => AccountType::ROTH_SIMPLE_401K->value,
            'STARTER_401K' => AccountType::STARTER_401K->value,
            '403B' => AccountType::TRADITIONAL_403B->value,
            'TRADITIONAL_403B' => AccountType::TRADITIONAL_403B->value,
            'ROTH_403B' => AccountType::ROTH_403B->value,
            'SAFE_HARBOR_403B_DEFERRAL_ONLY' => AccountType::SAFE_HARBOR_403B_DEFERRAL_ONLY->value,
            '457' => AccountType::GOVERNMENTAL_457B->value,
            '457B' => AccountType::GOVERNMENTAL_457B->value,
            'GOVERNMENTAL_457B' => AccountType::GOVERNMENTAL_457B->value,
            'ROTH_GOVERNMENTAL_457B' => AccountType::ROTH_GOVERNMENTAL_457B->value,
            'NONGOVERNMENTAL_457B' => AccountType::NONGOVERNMENTAL_457B->value,
            '457F' => AccountType::SECTION_457F->value,
            'SECTION_457F' => AccountType::SECTION_457F->value,
            'TSP' => AccountType::TRADITIONAL_TSP->value,
            'TRADITIONAL_TSP' => AccountType::TRADITIONAL_TSP->value,
            'ROTH_TSP' => AccountType::ROTH_TSP->value,
            '401A' => AccountType::SECTION_401A->value,
            'SECTION_401A' => AccountType::SECTION_401A->value,
            'PROFIT_SHARING' => AccountType::PROFIT_SHARING_PLAN->value,
            'PROFIT_SHARING_PLAN' => AccountType::PROFIT_SHARING_PLAN->value,
            'MONEY_PURCHASE' => AccountType::MONEY_PURCHASE_PLAN->value,
            'MONEY_PURCHASE_PLAN' => AccountType::MONEY_PURCHASE_PLAN->value,
            'KEOGH' => AccountType::KEOGH_PLAN->value,
            'KEOGH_PLAN' => AccountType::KEOGH_PLAN->value,
            'ESOP' => AccountType::ESOP->value,
            'DB' => AccountType::DEFINED_BENEFIT_PLAN->value,
            'PENSION' => AccountType::DEFINED_BENEFIT_PLAN->value,
            'DEFINED_BENEFIT' => AccountType::DEFINED_BENEFIT_PLAN->value,
            'DEFINED_BENEFIT_PLAN' => AccountType::DEFINED_BENEFIT_PLAN->value,
            'CASH_BALANCE' => AccountType::CASH_BALANCE_PLAN->value,
            'CASH_BALANCE_PLAN' => AccountType::CASH_BALANCE_PLAN->value,
        ];
        $token = self::normalizeToken($value);
        if (!isset($aliases[$token])) {
            throw new RetirementParameterException('INVALID_ACCOUNT_TYPE', "Unsupported retirement account type: {$value}");
        }
        return $aliases[$token];
    }

    public static function parseConversionType(ConversionType|string $value): string
    {
        if ($value instanceof ConversionType) {
            return $value->value;
        }
        if (in_array($value, array_column(ConversionType::cases(), 'value'), true)) {
            return $value;
        }
        $aliases = [
            'IRA_TO_ROTH' => ConversionType::IRA_TO_ROTH_IRA->value,
            'IRA_TO_ROTH_IRA' => ConversionType::IRA_TO_ROTH_IRA->value,
            'ROTH_CONVERSION' => ConversionType::IRA_TO_ROTH_IRA->value,
            'QUALIFIED_PLAN_TO_ROTH_IRA' => ConversionType::QUALIFIED_PLAN_TO_ROTH_IRA->value,
            'PLAN_TO_ROTH_IRA' => ConversionType::QUALIFIED_PLAN_TO_ROTH_IRA->value,
            'IN_PLAN_ROTH_ROLLOVER' => ConversionType::IN_PLAN_ROTH_ROLLOVER->value,
            'IN_PLAN_ROTH_CONVERSION' => ConversionType::IN_PLAN_ROTH_ROLLOVER->value,
        ];
        $token = self::normalizeToken($value);
        if (!isset($aliases[$token])) {
            throw new RetirementParameterException('INVALID_CONVERSION_TYPE', "Unsupported Roth conversion type: {$value}");
        }
        return $aliases[$token];
    }

    private static function normalizeToken(string $value): string
    {
        $value = strtoupper(trim($value));
        $value = str_replace(['(', ')'], '', $value);
        $value = (string) preg_replace('/[\-.\/\s]+/', '_', $value);
        $value = (string) preg_replace('/_+/', '_', $value);
        return trim($value, '_');
    }

    /** @return array<string,mixed> */
    private static function traits(string $type): array
    {
        $base = [
            'family' => '',
            'availabilityKey' => null,
            'designatedRoth' => false,
            'shares402g' => false,
            'uses415c' => false,
            'permitsAgeCatchUpByStatute' => false,
            'governmental457' => false,
            'is403b' => false,
            'isStarter' => false,
            'isSimple' => false,
            'isSarsep' => false,
            'employerOnly' => false,
        ];
        $traditionalIras = [
            AccountType::TRADITIONAL_IRA->value,
            AccountType::ROLLOVER_IRA->value,
            AccountType::PAYROLL_DEDUCTION_IRA->value,
            AccountType::DEEMED_TRADITIONAL_IRA->value,
        ];
        if (in_array($type, $traditionalIras, true)) {
            return array_replace($base, ['family' => 'regular_traditional_ira', 'availabilityKey' => 'traditionalIra']);
        }
        if (in_array($type, [AccountType::ROTH_IRA->value, AccountType::DEEMED_ROTH_IRA->value], true)) {
            return array_replace($base, ['family' => 'regular_roth_ira', 'availabilityKey' => 'rothIra', 'designatedRoth' => true]);
        }
        if (in_array($type, [AccountType::INHERITED_TRADITIONAL_IRA->value, AccountType::INHERITED_ROTH_IRA->value], true)) {
            $roth = $type === AccountType::INHERITED_ROTH_IRA->value;
            return array_replace($base, [
                'family' => 'inherited_ira',
                'availabilityKey' => $roth ? 'rothIra' : 'traditionalIra',
                'designatedRoth' => $roth,
            ]);
        }
        if (in_array($type, [AccountType::SEP_IRA->value, AccountType::ROTH_SEP_IRA->value], true)) {
            $roth = $type === AccountType::ROTH_SEP_IRA->value;
            return array_replace($base, [
                'family' => 'sep',
                'availabilityKey' => $roth ? 'rothSimpleOrSep' : 'sepIra',
                'designatedRoth' => $roth,
                'uses415c' => true,
                'employerOnly' => true,
            ]);
        }
        if (in_array($type, [AccountType::SIMPLE_IRA->value, AccountType::ROTH_SIMPLE_IRA->value], true)) {
            $roth = $type === AccountType::ROTH_SIMPLE_IRA->value;
            return array_replace($base, [
                'family' => 'simple',
                'availabilityKey' => $roth ? 'rothSimpleOrSep' : 'simpleIra',
                'designatedRoth' => $roth,
                'shares402g' => true,
                'permitsAgeCatchUpByStatute' => true,
                'isSimple' => true,
            ]);
        }
        if ($type === AccountType::SARSEP_IRA->value) {
            return array_replace($base, [
                'family' => 'qualified_elective',
                'availabilityKey' => 'sepIra',
                'shares402g' => true,
                'uses415c' => true,
                'permitsAgeCatchUpByStatute' => true,
                'isSarsep' => true,
            ]);
        }
        $qualified = [
            AccountType::TRADITIONAL_401K->value => ['traditional401k', false],
            AccountType::ROTH_401K->value => ['designatedRoth401k', true],
            AccountType::SOLO_401K->value => ['traditional401k', false],
            AccountType::ROTH_SOLO_401K->value => ['designatedRoth401k', true],
            AccountType::TRADITIONAL_TSP->value => ['traditionalTsp', false],
            AccountType::ROTH_TSP->value => ['rothTsp', true],
            AccountType::TRADITIONAL_403B->value => ['traditional403b', false],
            AccountType::ROTH_403B->value => ['designatedRoth403b', true],
        ];
        if (isset($qualified[$type])) {
            [$key, $roth] = $qualified[$type];
            return array_replace($base, [
                'family' => 'qualified_elective',
                'availabilityKey' => $key,
                'designatedRoth' => $roth,
                'shares402g' => true,
                'uses415c' => true,
                'permitsAgeCatchUpByStatute' => true,
                'is403b' => in_array($type, [AccountType::TRADITIONAL_403B->value, AccountType::ROTH_403B->value], true),
            ]);
        }
        if (in_array($type, [AccountType::SIMPLE_401K->value, AccountType::ROTH_SIMPLE_401K->value], true)) {
            return array_replace($base, [
                'family' => 'qualified_elective',
                'availabilityKey' => $type === AccountType::ROTH_SIMPLE_401K->value ? 'designatedRoth401k' : 'traditional401k',
                'designatedRoth' => $type === AccountType::ROTH_SIMPLE_401K->value,
                'shares402g' => true,
                'uses415c' => true,
                'permitsAgeCatchUpByStatute' => true,
                'isSimple' => true,
            ]);
        }
        if (in_array($type, [AccountType::STARTER_401K->value, AccountType::SAFE_HARBOR_403B_DEFERRAL_ONLY->value], true)) {
            return array_replace($base, [
                'family' => 'qualified_elective',
                'availabilityKey' => 'starter401kOrSafeHarbor403b',
                'shares402g' => true,
                'uses415c' => true,
                'permitsAgeCatchUpByStatute' => true,
                'isStarter' => true,
                'is403b' => $type === AccountType::SAFE_HARBOR_403B_DEFERRAL_ONLY->value,
            ]);
        }
        if (in_array($type, [AccountType::GOVERNMENTAL_457B->value, AccountType::ROTH_GOVERNMENTAL_457B->value, AccountType::NONGOVERNMENTAL_457B->value], true)) {
            $governmental = $type !== AccountType::NONGOVERNMENTAL_457B->value;
            return array_replace($base, [
                'family' => 'section457',
                'availabilityKey' => $governmental ? 'governmental457b' : 'nongovernmental457b',
                'designatedRoth' => $type === AccountType::ROTH_GOVERNMENTAL_457B->value,
                'permitsAgeCatchUpByStatute' => $governmental,
                'governmental457' => $governmental,
            ]);
        }
        if ($type === AccountType::SECTION_457F->value) {
            return array_replace($base, ['family' => 'section457f']);
        }
        if (in_array($type, [
            AccountType::SECTION_401A->value,
            AccountType::PROFIT_SHARING_PLAN->value,
            AccountType::MONEY_PURCHASE_PLAN->value,
            AccountType::KEOGH_PLAN->value,
            AccountType::ESOP->value,
        ], true)) {
            return array_replace($base, ['family' => 'annual_additions_only', 'uses415c' => true, 'employerOnly' => true]);
        }
        if (in_array($type, [AccountType::DEFINED_BENEFIT_PLAN->value, AccountType::CASH_BALANCE_PLAN->value], true)) {
            return array_replace($base, ['family' => 'defined_benefit', 'employerOnly' => true]);
        }
        throw new RetirementParameterException('INVALID_ACCOUNT_TYPE', "Unsupported retirement account type: {$type}");
    }

    /** @return array<string,mixed> */
    private static function diagnostic(
        string $code,
        DiagnosticSeverity $severity,
        string $message,
        ?string $path = null,
        ?string $legalReference = null,
    ): array {
        $result = ['code' => $code, 'severity' => $severity->value, 'message' => $message];
        if ($path !== null) {
            $result['path'] = $path;
        }
        if ($legalReference !== null) {
            $result['legalReference'] = $legalReference;
        }
        return $result;
    }

    /** @param list<array<string,mixed>> $diagnostics */
    private static function hasError(array $diagnostics): bool
    {
        foreach ($diagnostics as $diagnostic) {
            if (($diagnostic['severity'] ?? null) === DiagnosticSeverity::ERROR->value) {
                return true;
            }
        }
        return false;
    }

    private static function money(mixed $value, string $path, float $default = 0.0): float
    {
        if ($value === null) {
            return $default;
        }
        if (!is_int($value) && !is_float($value)) {
            throw new RetirementParameterException('INVALID_MONEY', "{$path} must be a finite, nonnegative number.");
        }
        $number = (float) $value;
        if (!is_finite($number) || $number < 0) {
            throw new RetirementParameterException('INVALID_MONEY', "{$path} must be a finite, nonnegative number.");
        }
        return self::roundMoney($number);
    }

    private static function rate(mixed $value, string $path, float $default = 0.0): float
    {
        if ($value === null) {
            return $default;
        }
        if (!is_int($value) && !is_float($value)) {
            throw new RetirementParameterException('INVALID_RATE', "{$path} must be between zero and one.");
        }
        $number = (float) $value;
        if (!is_finite($number) || $number < 0 || $number > 1) {
            throw new RetirementParameterException('INVALID_RATE', "{$path} must be between zero and one.");
        }
        return $number;
    }

    private static function roundMoney(float $value): float
    {
        return round($value + PHP_FLOAT_EPSILON, 2);
    }

    private static function floorMoney(float $value): float
    {
        return floor(($value + PHP_FLOAT_EPSILON) * 100) / 100;
    }

    private static function nonnegative(float $value): float
    {
        return self::roundMoney(max(0.0, $value));
    }

    private static function minMoney(float|int|null ...$values): float
    {
        $finite = [];
        foreach ($values as $value) {
            if ($value !== null) {
                $finite[] = (float) $value;
            }
        }
        return $finite === [] ? 0.0 : min($finite);
    }

    /** @return array<string,float> */
    private static function zeroComponents(): array
    {
        return [
            'employeePreTaxDeferral' => 0.0,
            'employeeRothDeferral' => 0.0,
            'employeePreTaxCatchUp' => 0.0,
            'employeeRothCatchUp' => 0.0,
            'employeeAfterTax' => 0.0,
            'employerPreTax' => 0.0,
            'employerRoth' => 0.0,
            'deductibleIra' => 0.0,
            'nondeductibleIra' => 0.0,
            'rothIra' => 0.0,
            'special403bCatchUp' => 0.0,
            'special457CatchUp' => 0.0,
            'unclassifiedIra' => 0.0,
        ];
    }

    /** @param array<string,mixed> $source
     *  @return array<string,float>
     */
    private static function components(array $source = []): array
    {
        $result = self::zeroComponents();
        foreach (array_keys($result) as $key) {
            if ($key === 'unclassifiedIra') {
                continue;
            }
            $result[$key] = self::money($source[$key] ?? null, "existing.{$key}");
        }
        return $result;
    }

    /** @param array<string,float> $components */
    private static function sumComponents(array $components): float
    {
        return self::roundMoney(array_sum($components));
    }

    /** @param array<string,float> $components */
    private static function baseDeferrals(array $components): float
    {
        return self::roundMoney($components['employeePreTaxDeferral'] + $components['employeeRothDeferral']);
    }

    /** @param array<string,float> $components */
    private static function ageCatchUps(array $components): float
    {
        return self::roundMoney($components['employeePreTaxCatchUp'] + $components['employeeRothCatchUp']);
    }

    /** @param array<string,float> $components */
    private static function annualAdditions(array $components): float
    {
        return self::roundMoney(
            $components['employeePreTaxDeferral']
            + $components['employeeRothDeferral']
            + $components['employeeAfterTax']
            + $components['employerPreTax']
            + $components['employerRoth']
            + $components['special403bCatchUp'],
        );
    }

    /** @return array<string,mixed> */
    private static function zeroTaxEffects(): array
    {
        return [
            'federalAgiReduction' => 0.0,
            'federalAgiIncrease' => 0.0,
            'federalTaxableIncomeReduction' => 0.0,
            'formW2Box1WageReduction' => 0.0,
            'ficaWageReduction' => 0.0,
            'selfEmployedRetirementDeduction' => 0.0,
            'nondeductibleContribution' => 0.0,
            'afterTaxOrRothContribution' => 0.0,
            'taxableRothConversion' => 0.0,
            'notes' => [],
        ];
    }

    /** @param array<string,float> $components
     *  @param array<string,mixed> $traits
     *  @param array<string,mixed> $planRules
     *  @return array<string,mixed>
     */
    private static function contributionTaxEffects(array $components, array $traits, array $planRules): array
    {
        $result = self::zeroTaxEffects();
        $pretaxEmployee = self::roundMoney(
            $components['employeePreTaxDeferral']
            + $components['employeePreTaxCatchUp']
            + $components['special403bCatchUp']
            + $components['special457CatchUp'],
        );
        $deductibleIra = $components['deductibleIra'];
        $selfEmployedPlanDeduction = !empty($planRules['isSelfEmployedOwner'])
            ? self::roundMoney($pretaxEmployee + $components['employerPreTax'])
            : 0.0;
        $selfEmployedEmployer = !empty($planRules['isSelfEmployedOwner']) ? $components['employerPreTax'] : 0.0;
        $result['formW2Box1WageReduction'] = !empty($planRules['isSelfEmployedOwner']) ? 0.0 : $pretaxEmployee;
        $result['selfEmployedRetirementDeduction'] = $selfEmployedPlanDeduction;
        $result['federalAgiReduction'] = self::roundMoney($pretaxEmployee + $selfEmployedEmployer + $deductibleIra);
        $result['federalTaxableIncomeReduction'] = $result['federalAgiReduction'];
        $result['nondeductibleContribution'] = self::roundMoney(
            $components['nondeductibleIra'] + $components['unclassifiedIra'],
        );
        $result['afterTaxOrRothContribution'] = self::roundMoney(
            $components['employeeRothDeferral']
            + $components['employeeRothCatchUp']
            + $components['employeeAfterTax']
            + $components['employerRoth']
            + $components['rothIra'],
        );
        if ($pretaxEmployee > 0 && empty($planRules['isSelfEmployedOwner'])) {
            $result['notes'][] = 'Pre-tax salary deferrals generally reduce Form W-2 box 1 wages but not Social Security or Medicare wages.';
        }
        if ($traits['family'] === 'regular_traditional_ira' && $deductibleIra > 0) {
            $result['notes'][] = 'A deductible traditional IRA contribution is an above-the-line federal adjustment to income.';
        }
        if ($components['employerRoth'] > 0) {
            $result['federalAgiIncrease'] = self::roundMoney($result['federalAgiIncrease'] + $components['employerRoth']);
            $result['notes'][] = 'A designated Roth employer contribution is generally included in current federal taxable income.';
        }
        if ($result['afterTaxOrRothContribution'] > 0) {
            $result['notes'][] = 'Roth and voluntary after-tax contributions do not reduce current federal AGI.';
        }
        return $result;
    }

    /** @param list<array<string,mixed>> $persons
     *  @return array<string,array<string,mixed>>
     */
    private static function normalizePersons(array $persons): array
    {
        if ($persons === []) {
            throw new RetirementParameterException('PERSON_REQUIRED', 'At least one person is required.');
        }
        $result = [];
        foreach ($persons as $index => $input) {
            if (!is_array($input)) {
                throw new RetirementParameterException('INVALID_PERSON', "persons[{$index}] must be an object/associative array.");
            }
            $id = trim((string) ($input['id'] ?? ''));
            if ($id === '') {
                throw new RetirementParameterException('PERSON_ID_REQUIRED', "persons[{$index}].id is required.");
            }
            if (isset($result[$id])) {
                throw new RetirementParameterException('DUPLICATE_PERSON_ID', "Duplicate person ID: {$id}");
            }
            if (array_key_exists('birthYear', $input)) {
                $birthYear = $input['birthYear'];
                if (!is_int($birthYear) || $birthYear < 1800 || $birthYear > 3000) {
                    throw new RetirementParameterException('INVALID_BIRTH_YEAR', "persons[{$index}].birthYear is invalid.");
                }
            }
            if (isset($input['birthDate'])) {
                self::validateIsoDate((string) $input['birthDate'], "persons[{$index}].birthDate");
            }
            $compensation = is_array($input['compensation'] ?? null) ? $input['compensation'] : [];
            foreach (['iraCompensation', 'w2Compensation', 'selfEmploymentNetEarnings'] as $key) {
                if (array_key_exists($key, $compensation)) {
                    $compensation[$key] = self::money($compensation[$key], "persons[{$index}].compensation.{$key}");
                }
            }
            $magi = is_array($input['magi'] ?? null) ? $input['magi'] : [];
            foreach (['rothIra', 'traditionalIraDeduction', 'rothConversion'] as $key) {
                if (array_key_exists($key, $magi)) {
                    $magi[$key] = self::money($magi[$key], "persons[{$index}].magi.{$key}");
                }
            }
            $wages = [];
            foreach (($input['priorYearFicaWagesByEmployer'] ?? []) as $employerId => $amount) {
                $wages[(string) $employerId] = self::money(
                    $amount,
                    "persons[{$index}].priorYearFicaWagesByEmployer.{$employerId}",
                );
            }
            $role = $input['role'] ?? ($index === 0 ? 'taxpayer' : ($index === 1 ? 'spouse' : 'other'));
            if (!in_array($role, ['taxpayer', 'spouse', 'other'], true)) {
                throw new RetirementParameterException(
                    'INVALID_PERSON_ROLE',
                    "persons[{$index}].role must be taxpayer, spouse, or other.",
                );
            }
            $normalized = $input;
            $normalized['id'] = $id;
            $normalized['role'] = $role;
            $normalized['compensation'] = $compensation;
            $normalized['magi'] = $magi;
            $normalized['priorYearFicaWagesByEmployer'] = $wages;
            foreach (
                ['traditionalSepSimpleIraBasis', 'yearEndTraditionalSepSimpleIraValue', 'otherTraditionalSepSimpleIraDistributions']
                as $key
            ) {
                if (array_key_exists($key, $input)) {
                    $normalized[$key] = self::money($input[$key], "persons[{$index}].{$key}");
                }
            }
            $result[$id] = $normalized;
        }
        foreach (['taxpayer', 'spouse'] as $role) {
            $matching = array_values(array_filter(
                $result,
                static fn (array $person): bool => ($person['role'] ?? null) === $role,
            ));
            if (count($matching) > 1) {
                $ids = implode(', ', array_column($matching, 'id'));
                throw new RetirementParameterException(
                    'DUPLICATE_PERSON_ROLE',
                    "Only one person may have the {$role} role; found {$ids}.",
                );
            }
        }
        return $result;
    }

    /** @param list<array<string,mixed>> $accounts
     *  @param array<string,array<string,mixed>> $persons
     *  @return list<array<string,mixed>>
     */
    private static function normalizeAccounts(array $accounts, array $persons): array
    {
        $ids = [];
        $result = [];
        foreach ($accounts as $index => $input) {
            if (!is_array($input)) {
                throw new RetirementParameterException('INVALID_ACCOUNT', "accounts[{$index}] must be an object/associative array.");
            }
            $id = trim((string) ($input['id'] ?? ''));
            if ($id === '') {
                throw new RetirementParameterException('ACCOUNT_ID_REQUIRED', "accounts[{$index}].id is required.");
            }
            if (isset($ids[$id])) {
                throw new RetirementParameterException('DUPLICATE_ACCOUNT_ID', "Duplicate account ID: {$id}");
            }
            $ids[$id] = true;
            $ownerId = (string) ($input['ownerId'] ?? '');
            if (!isset($persons[$ownerId])) {
                throw new RetirementParameterException(
                    'UNKNOWN_ACCOUNT_OWNER',
                    "Account {$id} references unknown owner {$ownerId}.",
                );
            }
            $planRules = is_array($input['planRules'] ?? null) ? $input['planRules'] : [];
            self::validatePlanRules($planRules, "accounts[{$index}].planRules");
            $normalized = $input;
            $normalized['id'] = $id;
            $normalized['ownerId'] = $ownerId;
            $normalized['type'] = self::parseAccountType($input['type'] ?? '');
            $normalized['priority'] = isset($input['priority']) ? (int) $input['priority'] : 100;
            $normalized['planRules'] = $planRules;
            $normalized['existingContributions'] = self::components(
                is_array($input['existingContributions'] ?? null) ? $input['existingContributions'] : [],
            );
            $normalized['inputIndex'] = $index;
            $result[] = $normalized;
        }
        return $result;
    }

    /** @param array<string,mixed> $rules */
    private static function validatePlanRules(array $rules, string $path): void
    {
        foreach (
            [
                'planCompensation',
                'includibleCompensation457',
                'planDocumentEmployeeDeferralLimit',
                'planDocumentAnnualAdditionsLimit',
                'expectedEmployerContribution',
                'simpleCustomEmployerContribution',
                'netEarningsFromSelfEmploymentAfterHalfSETax',
                'simpleAdditionalNonelectiveContribution',
            ] as $key
        ) {
            if (array_key_exists($key, $rules)) {
                self::money($rules[$key], "{$path}.{$key}");
            }
        }
        foreach (['employerMatchRate', 'employerMatchCompensationFraction', 'employerNonelectiveRate'] as $key) {
            if (array_key_exists($key, $rules)) {
                self::rate($rules[$key], "{$path}.{$key}");
            }
        }
        if (isset($rules['special403bCatchUp']) && is_array($rules['special403bCatchUp'])) {
            $special = $rules['special403bCatchUp'];
            $years = $special['yearsOfService'] ?? null;
            if ((!is_int($years) && !is_float($years)) || !is_finite((float) $years) || (float) $years < 0) {
                throw new RetirementParameterException(
                    'INVALID_YEARS_OF_SERVICE',
                    "{$path}.special403bCatchUp.yearsOfService is invalid.",
                );
            }
            self::money($special['priorElectiveDeferrals'] ?? null, "{$path}.special403bCatchUp.priorElectiveDeferrals");
            self::money($special['priorSpecialCatchUpUsed'] ?? null, "{$path}.special403bCatchUp.priorSpecialCatchUpUsed");
        }
        if (isset($rules['section457SpecialCatchUp']) && is_array($rules['section457SpecialCatchUp'])) {
            self::money(
                $rules['section457SpecialCatchUp']['unusedDeferralsFromPriorYears'] ?? null,
                "{$path}.section457SpecialCatchUp.unusedDeferralsFromPriorYears",
            );
        }
        if (isset($rules['contributionPreference']) && !in_array(
            $rules['contributionPreference'],
            ['account_type', 'pretax_first', 'roth_first'],
            true,
        )) {
            throw new RetirementParameterException(
                'INVALID_CONTRIBUTION_PREFERENCE',
                "{$path}.contributionPreference is invalid.",
            );
        }
        if (isset($rules['employerContributionTaxTreatment']) && !in_array(
            $rules['employerContributionTaxTreatment'],
            ['pretax', 'roth'],
            true,
        )) {
            throw new RetirementParameterException(
                'INVALID_EMPLOYER_CONTRIBUTION_TAX_TREATMENT',
                "{$path}.employerContributionTaxTreatment is invalid.",
            );
        }
    }

    private static function validateIsoDate(string $value, string $path): void
    {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            throw new RetirementParameterException('INVALID_DATE', "{$path} must use YYYY-MM-DD.");
        }
        [$year, $month, $day] = array_map('intval', explode('-', $value));
        if (!checkdate($month, $day, $year)) {
            throw new RetirementParameterException('INVALID_DATE', "{$path} is not a valid calendar date.");
        }
    }

    /** @param array<string,mixed> $person */
    private static function ageAtEndOfTaxYear(array $person, int $taxYear): ?int
    {
        if (isset($person['birthDate'])) {
            return $taxYear - (int) substr((string) $person['birthDate'], 0, 4);
        }
        if (isset($person['birthYear'])) {
            return $taxYear - (int) $person['birthYear'];
        }
        return null;
    }

    /** @param array<string,mixed> $person */
    private static function reachesAge70HalfByYearEnd(array $person, int $taxYear): ?bool
    {
        if (isset($person['birthDate'])) {
            $birth = new DateTimeImmutable((string) $person['birthDate'], new DateTimeZone('UTC'));
            $seventyHalf = $birth->modify('+70 years')->modify('+6 months');
            $yearEnd = new DateTimeImmutable("{$taxYear}-12-31", new DateTimeZone('UTC'));
            return $seventyHalf <= $yearEnd;
        }
        if (isset($person['birthYear'])) {
            $age = $taxYear - (int) $person['birthYear'];
            if ($age >= 71) {
                return true;
            }
            if ($age <= 69) {
                return false;
            }
        }
        return null;
    }

    /** @param array<string,mixed> $person */
    private static function iraCompensation(array $person): float
    {
        $compensation = $person['compensation'];
        if (array_key_exists('iraCompensation', $compensation)) {
            return self::money($compensation['iraCompensation'], "{$person['id']}.compensation.iraCompensation");
        }
        return self::roundMoney(
            self::money($compensation['w2Compensation'] ?? null, "{$person['id']}.compensation.w2Compensation")
            + self::money(
                $compensation['selfEmploymentNetEarnings'] ?? null,
                "{$person['id']}.compensation.selfEmploymentNetEarnings",
            ),
        );
    }

    /** @param array<string,mixed> $account
     *  @param array<string,mixed> $person
     */
    private static function planCompensation(array $account, array $person): float
    {
        $rules = $account['planRules'];
        if (array_key_exists('planCompensation', $rules)) {
            return self::money($rules['planCompensation'], "{$account['id']}.planRules.planCompensation");
        }
        if (!empty($rules['isSelfEmployedOwner'])) {
            return self::money(
                $rules['netEarningsFromSelfEmploymentAfterHalfSETax']
                    ?? $person['compensation']['selfEmploymentNetEarnings']
                    ?? null,
                "{$account['id']}.selfEmploymentCompensation",
            );
        }
        return self::money(
            $person['compensation']['w2Compensation'] ?? $person['compensation']['iraCompensation'] ?? null,
            "{$account['id']}.planCompensationDefault",
        );
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $person
     */
    private static function recognizedCompensationForEmployerAllocation(
        array $context,
        array $account,
        array $person,
    ): float {
        $compensation = self::planCompensation($account, $person);
        $statutoryLimit = $context['parameters']['annualCompensation401a17'];
        return $statutoryLimit === null
            ? $compensation
            : self::minMoney($compensation, (float) $statutoryLimit);
    }

    /** @param array<string,mixed> $account */
    private static function groupIdForAccount(array $account): string
    {
        $employerGroup = $account['planRules']['annualAdditionsGroupId']
            ?? $account['employerId']
            ?? "account:{$account['id']}";
        return "{$account['ownerId']}:{$employerGroup}";
    }

    /** @param array<string,mixed> $parameters
     *  @param array<string,mixed> $traits
     */
    private static function availabilityForAccount(array $parameters, array $traits): bool
    {
        if ($traits['availabilityKey'] !== null
            && ($parameters['availability'][$traits['availabilityKey']] ?? false) !== true) {
            return false;
        }
        if ($traits['family'] === 'section457' && $traits['governmental457'] && $traits['designatedRoth']) {
            return ($parameters['section457b']['designatedRothAvailableForGovernmentalPlans'] ?? false) === true;
        }
        return true;
    }

    /** @param array<string,mixed> $parameters
     *  @param array<string,mixed> $person
     *  @param array<string,mixed> $traits
     */
    private static function workplaceCatchUpLimit(array $parameters, array $person, array $traits): float
    {
        $age = self::ageAtEndOfTaxYear($person, (int) $parameters['year']);
        if (empty($traits['permitsAgeCatchUpByStatute']) || $age === null || $age < 50) {
            return 0.0;
        }
        if (!empty($traits['isStarter'])) {
            return (float) $parameters['starterDeferralOnly']['age50CatchUp'];
        }
        if (!empty($traits['isSimple'])) {
            if ($age >= 60 && $age <= 63 && $parameters['simple']['age60To63CatchUp'] !== null) {
                return (float) $parameters['simple']['age60To63CatchUp'];
            }
            return (float) $parameters['simple']['generalAge50CatchUp'];
        }
        if ($age >= 60 && $age <= 63 && $parameters['age60To63CatchUp'] !== null) {
            return (float) $parameters['age60To63CatchUp'];
        }
        if ($traits['family'] === 'section457') {
            return (float) $parameters['section457b']['governmentalAge50CatchUp'];
        }
        return (float) $parameters['generalAge50CatchUp'];
    }

    /** @param array<string,mixed> $parameters
     *  @param array<string,mixed> $person
     */
    private static function ownerGeneralCatchUpLimit(array $parameters, array $person): float
    {
        $age = self::ageAtEndOfTaxYear($person, (int) $parameters['year']);
        if ($age === null || $age < 50) {
            return 0.0;
        }
        if ($age >= 60 && $age <= 63 && $parameters['age60To63CatchUp'] !== null) {
            return (float) $parameters['age60To63CatchUp'];
        }
        return (float) $parameters['generalAge50CatchUp'];
    }

    /** @param array<string,mixed>|null $range
     *  @return array{0:float,1:float}|null
     */
    private static function rangeForFilingStatus(
        ?array $range,
        string $status,
        bool $livedWithSpouseDuringYear,
        bool $spouseCoveredRange,
    ): ?array {
        if ($range === null) {
            return null;
        }
        if ($status === FilingStatus::MARRIED_FILING_JOINTLY->value) {
            $value = $spouseCoveredRange
                ? ($range['marriedFilingJointly'] ?? $range['marriedFilingJointlyOrQualifyingSurvivingSpouse'] ?? null)
                : ($range['marriedFilingJointlyOrQualifyingSurvivingSpouse'] ?? $range['marriedFilingJointly'] ?? null);
            return $value === null ? null : [(float) $value[0], (float) $value[1]];
        }
        if ($status === FilingStatus::QUALIFYING_SURVIVING_SPOUSE->value) {
            $value = $range['marriedFilingJointlyOrQualifyingSurvivingSpouse'] ?? null;
            return $value === null ? null : [(float) $value[0], (float) $value[1]];
        }
        if ($status === FilingStatus::MARRIED_FILING_SEPARATELY->value && $livedWithSpouseDuringYear) {
            $value = $range['marriedFilingSeparatelyLivingTogether'] ?? null;
            return $value === null ? null : [(float) $value[0], (float) $value[1]];
        }
        $value = $range['singleOrHeadOfHousehold'] ?? null;
        return $value === null ? null : [(float) $value[0], (float) $value[1]];
    }

    /** @param array{0:float,1:float}|null $range
     *  @param array<string,mixed> $rounding
     */
    private static function phaseoutReducedLimit(
        float $unreducedLimit,
        float $magi,
        ?array $range,
        array $rounding,
    ): float {
        if ($range === null) {
            return $unreducedLimit;
        }
        [$lower, $upper] = $range;
        if ($magi <= $lower) {
            return $unreducedLimit;
        }
        if ($magi >= $upper) {
            return 0.0;
        }
        $raw = $unreducedLimit * (($upper - $magi) / ($upper - $lower));
        $increment = (float) $rounding['iraPhaseoutIncrement'];
        $roundedUp = ceil($raw / $increment) * $increment;
        return self::roundMoney(max((float) $rounding['iraPositiveReducedMinimum'], $roundedUp));
    }

    /** @param array<string,mixed> $person
     *  @param array<string,mixed> $parameters
     */
    private static function personalIraStatutoryLimit(array $person, array $parameters): ?float
    {
        $age = self::ageAtEndOfTaxYear($person, (int) $parameters['year']);
        if ($age === null) {
            return null;
        }
        return self::roundMoney(
            (float) $parameters['ira']['baseContributionLimit']
            + ($age >= 50 ? (float) $parameters['ira']['age50CatchUp'] : 0.0),
        );
    }

    /** @param array<string,mixed> $person */
    private static function livedWithSpouse(array $person, string $filingStatus): bool
    {
        if (array_key_exists('livedWithSpouseDuringYear', $person)) {
            return (bool) $person['livedWithSpouseDuringYear'];
        }
        return $filingStatus === FilingStatus::MARRIED_FILING_SEPARATELY->value;
    }

    /** @param array<string,array<string,mixed>> $persons
     *  @param array<string,mixed> $person
     *  @return array<string,mixed>|null
     */
    private static function spouseForPerson(array $persons, array $person): ?array
    {
        $targetRole = ($person['role'] ?? null) === 'taxpayer'
            ? 'spouse'
            : ((($person['role'] ?? null) === 'spouse') ? 'taxpayer' : null);
        if ($targetRole === null) {
            return null;
        }
        foreach ($persons as $candidate) {
            if (($candidate['role'] ?? null) === $targetRole) {
                return $candidate;
            }
        }
        return null;
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $person
     */
    private static function traditionalIraDeductionLimit(array $context, array $person, ?float $personalLimit): ?float
    {
        if ($personalLimit === null) {
            return null;
        }
        $parameters = $context['parameters'];
        $filingStatus = $context['filingStatus'];
        $selfCoverage = $person['coveredByEmployerRetirementPlan'] ?? null;
        if (!$parameters['ira']['universalEligibility']) {
            if (!array_key_exists('coveredByEmployerRetirementPlan', $person)) {
                return null;
            }
            return $selfCoverage ? 0.0 : $personalLimit;
        }
        if ((int) $parameters['year'] < 1987) {
            return $personalLimit;
        }
        $spouse = self::spouseForPerson($context['persons'], $person);
        $livingTogether = self::livedWithSpouse($person, $filingStatus);
        $spouseCoverageRelevant = (
            $filingStatus === FilingStatus::MARRIED_FILING_JOINTLY->value
            || ($filingStatus === FilingStatus::MARRIED_FILING_SEPARATELY->value && $livingTogether)
        ) && $spouse !== null;
        if (!array_key_exists('coveredByEmployerRetirementPlan', $person)) {
            return null;
        }
        $applicableRange = null;
        $useSpouseCoveredRange = false;
        if ($selfCoverage) {
            $applicableRange = $parameters['phaseouts']['traditionalIraCovered'];
        } elseif ($spouseCoverageRelevant) {
            if (!array_key_exists('coveredByEmployerRetirementPlan', $spouse)) {
                return null;
            }
            if ($spouse['coveredByEmployerRetirementPlan']) {
                $applicableRange = $parameters['phaseouts']['traditionalIraSpouseCovered'];
                $useSpouseCoveredRange = true;
            }
        }
        if ($applicableRange === null) {
            return $personalLimit;
        }
        if (!array_key_exists('traditionalIraDeduction', $person['magi'])) {
            return null;
        }
        return self::phaseoutReducedLimit(
            $personalLimit,
            self::money($person['magi']['traditionalIraDeduction'], "{$person['id']}.magi.traditionalIraDeduction"),
            self::rangeForFilingStatus(
                $applicableRange,
                $filingStatus,
                $livingTogether,
                $useSpouseCoveredRange,
            ),
            $context['rounding'],
        );
    }

    /** @param array<string,mixed> $parameters
     *  @param array<string,array<string,mixed>> $persons
     *  @param list<array<string,mixed>> $accounts
     *  @param list<array<string,mixed>> $scenarioDiagnostics
     *  @param array<string,mixed> $data
     *  @return array<string,mixed>
     */
    private static function createContext(
        int $taxYear,
        string $filingStatus,
        array $parameters,
        array $persons,
        array $accounts,
        array &$scenarioDiagnostics,
        array $data,
    ): array {
        $accountsById = [];
        foreach ($accounts as $account) {
            $accountsById[$account['id']] = $account;
        }
        $context = [
            'taxYear' => $taxYear,
            'filingStatus' => $filingStatus,
            'parameters' => $parameters,
            'persons' => $persons,
            'accountsById' => $accountsById,
            'scenarioDiagnostics' => &$scenarioDiagnostics,
            'rounding' => $data['rounding'],
            'iraOwnerPools' => [],
            'iraCompensationPools' => [],
            'iraRothEligibilityPools' => [],
            'iraDeductionPools' => [],
            'elective402gPools' => [],
            'catchUpPools' => [],
            'special403bCatchUpPools' => [],
            'annualAdditionsPools' => [],
            'section457BasePools' => [],
            'section457CatchUpPools' => [],
            'section457SpecialCatchUpPools' => [],
        ];
        self::initializeIraPools($context, $accounts);
        self::initializeElectiveDeferralPools($context, $accounts);
        self::initializeAnnualAdditionsPools($context, $accounts);
        self::initializeSection457Pools($context, $accounts);
        return $context;
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $accounts
     */
    private static function initializeIraPools(array &$context, array $accounts): void
    {
        $parameters = $context['parameters'];
        $taxpayerAndSpouse = array_values(array_filter(
            $context['persons'],
            static fn (array $person): bool => in_array($person['role'] ?? null, ['taxpayer', 'spouse'], true),
        ));
        $shareSpousalCompensation =
            $context['filingStatus'] === FilingStatus::MARRIED_FILING_JOINTLY->value
            && count($taxpayerAndSpouse) >= 2;
        if ($shareSpousalCompensation) {
            $combinedCompensation = self::roundMoney(array_sum(array_map(self::iraCompensation(...), $taxpayerAndSpouse)));
            $earningCount = count(array_filter($taxpayerAndSpouse, static fn (array $person): bool => self::iraCompensation($person) > 0));
            $householdLimit = self::roundMoney($combinedCompensation * (float) $parameters['ira']['compensationFraction']);
            if ($earningCount === 1 && $parameters['ira']['oneEarnerHouseholdCombinedLimit'] !== null) {
                $householdLimit = min($householdLimit, (float) $parameters['ira']['oneEarnerHouseholdCombinedLimit']);
            }
            $sumPersonal = 0.0;
            $allKnown = true;
            foreach ($taxpayerAndSpouse as $person) {
                $limit = self::personalIraStatutoryLimit($person, $parameters);
                if ($limit === null) {
                    $allKnown = false;
                } else {
                    $sumPersonal += $limit;
                }
            }
            if ($allKnown) {
                $householdLimit = min($householdLimit, $sumPersonal);
            }
            $context['iraCompensationPools']['ira-household'] = [
                'id' => 'ira-household',
                'legalLimit' => 'IRC 219(c) joint-return compensation limit',
                'limit' => self::roundMoney($householdLimit),
                'used' => 0.0,
            ];
        }

        foreach ($context['persons'] as $person) {
            $statutory = self::personalIraStatutoryLimit($person, $parameters);
            $ownCompensation = self::iraCompensation($person);
            $isHouseholdMember = $shareSpousalCompensation
                && in_array($person['role'] ?? null, ['taxpayer', 'spouse'], true);
            $compensationPoolId = $isHouseholdMember ? 'ira-household' : "ira-compensation:{$person['id']}";
            if (!$isHouseholdMember) {
                $context['iraCompensationPools'][$compensationPoolId] = [
                    'id' => $compensationPoolId,
                    'legalLimit' => 'IRC 219(b) compensation limit',
                    'limit' => $statutory === null
                        ? null
                        : self::minMoney($statutory, $ownCompensation * (float) $parameters['ira']['compensationFraction']),
                    'used' => 0.0,
                ];
            }
            $personalLimit = $statutory;
            if ($personalLimit !== null && $isHouseholdMember && $context['taxYear'] < 1997 && $ownCompensation === 0.0) {
                $personalLimit = $parameters['ira']['spousalIraAvailable']
                    ? ($parameters['ira']['nonworkingSpouseIndividualLimit'] === null
                        ? 0.0
                        : (float) $parameters['ira']['nonworkingSpouseIndividualLimit'])
                    : 0.0;
            }
            if ($personalLimit !== null && $isHouseholdMember && $context['taxYear'] < 1997 && $ownCompensation > 0.0) {
                $personalLimit = self::minMoney(
                    $personalLimit,
                    $ownCompensation * (float) $parameters['ira']['compensationFraction'],
                );
            }
            $context['iraOwnerPools'][$person['id']] = [
                'id' => "ira-owner:{$person['id']}",
                'legalLimit' => 'IRC 219(b) aggregate traditional and Roth IRA contribution limit',
                'limit' => $personalLimit,
                'used' => 0.0,
                'blocked' => false,
                'compensationPoolId' => $compensationPoolId,
            ];
            $rothEligibilityLimit = 0.0;
            if ($parameters['ira']['rothAvailable']) {
                if ($personalLimit === null || !array_key_exists('rothIra', $person['magi'])) {
                    $rothEligibilityLimit = null;
                } else {
                    $rothEligibilityLimit = self::phaseoutReducedLimit(
                        $personalLimit,
                        self::money($person['magi']['rothIra'], "{$person['id']}.magi.rothIra"),
                        self::rangeForFilingStatus(
                            $parameters['phaseouts']['rothIra'],
                            $context['filingStatus'],
                            self::livedWithSpouse($person, $context['filingStatus']),
                            false,
                        ),
                        $context['rounding'],
                    );
                }
            }
            $context['iraRothEligibilityPools'][$person['id']] = [
                'id' => "roth-ira-eligibility:{$person['id']}",
                'legalLimit' => 'IRC 408A(c)(3) direct Roth IRA MAGI limit',
                'limit' => $rothEligibilityLimit,
                'used' => 0.0,
            ];
            $context['iraDeductionPools'][$person['id']] = [
                'id' => "traditional-ira-deduction:{$person['id']}",
                'legalLimit' => 'IRC 219(g) traditional IRA deduction limit',
                'limit' => self::traditionalIraDeductionLimit($context, $person, $personalLimit),
                'used' => 0.0,
            ];
        }

        foreach ($accounts as $account) {
            $traits = self::traits($account['type']);
            if (!in_array($traits['family'], ['regular_traditional_ira', 'regular_roth_ira'], true)) {
                continue;
            }
            $existing = self::regularIraContributionAmount($account['existingContributions']);
            if (!isset($context['iraOwnerPools'][$account['ownerId']])) {
                continue;
            }
            $ownerPool =& $context['iraOwnerPools'][$account['ownerId']];
            $ownerPool['used'] = self::roundMoney($ownerPool['used'] + $existing);
            $compensationPoolId = $ownerPool['compensationPoolId'];
            $context['iraCompensationPools'][$compensationPoolId]['used'] = self::roundMoney(
                $context['iraCompensationPools'][$compensationPoolId]['used'] + $existing,
            );
            $context['iraRothEligibilityPools'][$account['ownerId']]['used'] = self::roundMoney(
                $context['iraRothEligibilityPools'][$account['ownerId']]['used']
                + $account['existingContributions']['rothIra'],
            );
            $context['iraDeductionPools'][$account['ownerId']]['used'] = self::roundMoney(
                $context['iraDeductionPools'][$account['ownerId']]['used']
                + $account['existingContributions']['deductibleIra'],
            );
            unset($ownerPool);
        }
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $accounts
     */
    private static function initializeElectiveDeferralPools(array &$context, array $accounts): void
    {
        foreach ($context['persons'] as $person) {
            $id = $person['id'];
            $context['elective402gPools'][$id] = [
                'id' => "402g:{$id}",
                'legalLimit' => 'IRC 402(g) aggregate elective-deferral limit',
                'limit' => $context['parameters']['electiveDeferral402g'] === null
                    ? null
                    : (float) $context['parameters']['electiveDeferral402g'],
                'used' => 0.0,
            ];
            $context['catchUpPools'][$id] = [
                'id' => "414v:{$id}",
                'legalLimit' => 'IRC 414(v) aggregate age-based catch-up limit',
                'limit' => self::ownerGeneralCatchUpLimit($context['parameters'], $person),
                'used' => 0.0,
            ];
            $context['special403bCatchUpPools'][$id] = [
                'id' => "402g7:{$id}",
                'legalLimit' => 'IRC 402(g)(7) aggregate 403(b) 15-year catch-up limit',
                'limit' => 3000.0,
                'used' => 0.0,
            ];
        }
        foreach ($accounts as $account) {
            $traits = self::traits($account['type']);
            if (empty($traits['shares402g'])) {
                continue;
            }
            $ownerId = $account['ownerId'];
            $context['elective402gPools'][$ownerId]['used'] = self::roundMoney(
                $context['elective402gPools'][$ownerId]['used']
                + self::baseDeferrals($account['existingContributions']),
            );
            $context['catchUpPools'][$ownerId]['used'] = self::roundMoney(
                $context['catchUpPools'][$ownerId]['used']
                + self::ageCatchUps($account['existingContributions']),
            );
            if (!empty($traits['is403b'])) {
                $context['special403bCatchUpPools'][$ownerId]['used'] = self::roundMoney(
                    $context['special403bCatchUpPools'][$ownerId]['used']
                    + $account['existingContributions']['special403bCatchUp'],
                );
            }
        }
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $accounts
     */
    private static function initializeAnnualAdditionsPools(array &$context, array $accounts): void
    {
        $groups = [];
        foreach ($accounts as $account) {
            if (empty(self::traits($account['type'])['uses415c'])) {
                continue;
            }
            $groupId = self::groupIdForAccount($account);
            $groups[$groupId][] = $account;
        }
        foreach ($groups as $groupId => $members) {
            $recognizedCompensation = 0.0;
            $existing = 0.0;
            foreach ($members as $account) {
                $person = $context['persons'][$account['ownerId']];
                $recognizedCompensation = max($recognizedCompensation, self::planCompensation($account, $person));
                $existing = self::roundMoney($existing + self::annualAdditions($account['existingContributions']));
            }
            if ($context['parameters']['annualCompensation401a17'] !== null) {
                $recognizedCompensation = min(
                    $recognizedCompensation,
                    (float) $context['parameters']['annualCompensation401a17'],
                );
            }
            $limit = null;
            if (
                $context['parameters']['annualAdditions415c'] !== null
                && $context['parameters']['annualAdditionsCompensationFraction'] !== null
            ) {
                $limit = self::minMoney(
                    (float) $context['parameters']['annualAdditions415c'],
                    $recognizedCompensation * (float) $context['parameters']['annualAdditionsCompensationFraction'],
                );
            }
            $context['annualAdditionsPools'][$groupId] = [
                'id' => "415c:{$groupId}",
                'legalLimit' => 'IRC 415(c) annual-additions limit',
                'limit' => $limit,
                'used' => $existing,
                'compensation' => self::roundMoney($recognizedCompensation),
            ];
        }
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $accounts
     */
    private static function initializeSection457Pools(array &$context, array $accounts): void
    {
        foreach ($context['persons'] as $person) {
            $id = $person['id'];
            $context['section457BasePools'][$id] = [
                'id' => "457b:{$id}",
                'legalLimit' => 'IRC 457(b) aggregate annual deferral limit (separate from IRC 402(g))',
                'limit' => $context['parameters']['section457b']['baseDeferralLimit'] === null
                    ? null
                    : (float) $context['parameters']['section457b']['baseDeferralLimit'],
                'used' => 0.0,
            ];
            $context['section457CatchUpPools'][$id] = [
                'id' => "457b-catch-up:{$id}",
                'legalLimit' => 'IRC 414(v) governmental 457(b) age-based catch-up limit',
                'limit' => self::workplaceCatchUpLimit(
                    $context['parameters'],
                    $person,
                    self::traits(AccountType::GOVERNMENTAL_457B->value),
                ),
                'used' => 0.0,
            ];
            $context['section457SpecialCatchUpPools'][$id] = [
                'id' => "457b-special-catch-up:{$id}",
                'legalLimit' => 'IRC 457(b)(3) special last-three-years catch-up',
                'limit' => $context['parameters']['section457b']['baseDeferralLimit'] === null
                    ? null
                    : (float) $context['parameters']['section457b']['baseDeferralLimit'],
                'used' => 0.0,
            ];
        }
        foreach ($accounts as $account) {
            if (self::traits($account['type'])['family'] !== 'section457') {
                continue;
            }
            $components = $account['existingContributions'];
            $base = self::roundMoney(
                self::baseDeferrals($components)
                + $components['employeeAfterTax']
                + $components['employerPreTax']
                + $components['employerRoth'],
            );
            $ownerId = $account['ownerId'];
            $context['section457BasePools'][$ownerId]['used'] = self::roundMoney(
                $context['section457BasePools'][$ownerId]['used'] + $base,
            );
            $context['section457CatchUpPools'][$ownerId]['used'] = self::roundMoney(
                $context['section457CatchUpPools'][$ownerId]['used'] + self::ageCatchUps($components),
            );
            $context['section457SpecialCatchUpPools'][$ownerId]['used'] = self::roundMoney(
                $context['section457SpecialCatchUpPools'][$ownerId]['used'] + $components['special457CatchUp'],
            );
        }
    }

    /** @param array<string,float> $components */
    private static function regularIraContributionAmount(array $components): float
    {
        return self::roundMoney(
            $components['deductibleIra']
            + $components['nondeductibleIra']
            + $components['rothIra']
            + $components['unclassifiedIra'],
        );
    }

    /** @param array<string,mixed> $pool */
    private static function poolRemaining(array $pool): ?float
    {
        return $pool['limit'] === null ? null : self::nonnegative((float) $pool['limit'] - (float) $pool['used']);
    }

    /** @param array<string,mixed> $pool
     *  @param list<array<string,mixed>> $sharedLimits
     */
    private static function takeFromPool(array &$pool, float $requested, array &$sharedLimits): float
    {
        $usedBefore = (float) $pool['used'];
        if ($pool['limit'] === null) {
            $sharedLimits[] = [
                'id' => $pool['id'],
                'legalLimit' => $pool['legalLimit'],
                'limit' => null,
                'usedBeforeAccount' => $usedBefore,
                'usedByAccount' => 0.0,
                'remainingAfterAccount' => null,
            ];
            return 0.0;
        }
        $taken = self::minMoney($requested, self::nonnegative((float) $pool['limit'] - (float) $pool['used']));
        $pool['used'] = self::roundMoney((float) $pool['used'] + $taken);
        $sharedLimits[] = [
            'id' => $pool['id'],
            'legalLimit' => $pool['legalLimit'],
            'limit' => (float) $pool['limit'],
            'usedBeforeAccount' => $usedBefore,
            'usedByAccount' => $taken,
            'remainingAfterAccount' => self::nonnegative((float) $pool['limit'] - (float) $pool['used']),
        ];
        return $taken;
    }

    /** @param array<string,mixed> $pool
     *  @param list<array<string,mixed>> $sharedLimits
     */
    private static function reportPoolWithoutConsuming(array $pool, array &$sharedLimits): void
    {
        $sharedLimits[] = [
            'id' => $pool['id'],
            'legalLimit' => $pool['legalLimit'],
            'limit' => $pool['limit'] === null ? null : (float) $pool['limit'],
            'usedBeforeAccount' => (float) $pool['used'],
            'usedByAccount' => 0.0,
            'remainingAfterAccount' => self::poolRemaining($pool),
        ];
    }

    /** @param list<array<string,mixed>> $diagnostics */
    private static function accountStatusFromDiagnostics(string $defaultStatus, array $diagnostics): string
    {
        if (self::hasError($diagnostics)) {
            return CalculationStatus::INDETERMINATE->value;
        }
        if ($defaultStatus === CalculationStatus::DETERMINATE->value) {
            foreach ($diagnostics as $entry) {
                $code = (string) ($entry['code'] ?? '');
                if (str_contains($code, 'ASSUM') || str_contains($code, 'PLAN_TERM')) {
                    return CalculationStatus::DETERMINATE_WITH_ASSUMPTIONS->value;
                }
            }
        }
        return $defaultStatus;
    }

    /** @param array<string,mixed> $context
     *  @param list<array{0:string,1:string}> $refs
     *  @param list<array<string,mixed>> $sharedLimits
     */
    private static function takeAcrossPools(
        array &$context,
        array $refs,
        float $requested,
        array &$sharedLimits,
    ): float {
        foreach ($refs as [$category, $key]) {
            if ($context[$category][$key]['limit'] === null) {
                foreach ($refs as [$reportCategory, $reportKey]) {
                    self::reportPoolWithoutConsuming($context[$reportCategory][$reportKey], $sharedLimits);
                }
                return 0.0;
            }
        }
        $limits = [$requested];
        foreach ($refs as [$category, $key]) {
            $limits[] = self::poolRemaining($context[$category][$key]);
        }
        $taken = self::minMoney(...$limits);
        foreach ($refs as [$category, $key]) {
            $pool =& $context[$category][$key];
            $usedBefore = (float) $pool['used'];
            $pool['used'] = self::roundMoney((float) $pool['used'] + $taken);
            $sharedLimits[] = [
                'id' => $pool['id'],
                'legalLimit' => $pool['legalLimit'],
                'limit' => (float) $pool['limit'],
                'usedBeforeAccount' => $usedBefore,
                'usedByAccount' => $taken,
                'remainingAfterAccount' => self::poolRemaining($pool),
            ];
            unset($pool);
        }
        return $taken;
    }

    /** @param array<string,mixed> $pool
     *  @param list<array<string,mixed>> $sharedLimits
     */
    private static function consumeExactFromPool(array &$pool, float $amount, array &$sharedLimits): void
    {
        $usedBefore = (float) $pool['used'];
        $pool['used'] = self::roundMoney((float) $pool['used'] + $amount);
        $sharedLimits[] = [
            'id' => $pool['id'],
            'legalLimit' => $pool['legalLimit'],
            'limit' => $pool['limit'] === null ? null : (float) $pool['limit'],
            'usedBeforeAccount' => $usedBefore,
            'usedByAccount' => $amount,
            'remainingAfterAccount' => self::poolRemaining($pool),
        ];
    }

    /** @param array<string,mixed> $account
     *  @param list<array<string,mixed>> $diagnostics
     *  @return array<string,mixed>
     */
    private static function emptyOutcome(
        array $account,
        string $status,
        ?float $statutoryMaximum,
        array $diagnostics = [],
    ): array {
        return [
            'status' => $status,
            'statutoryMaximum' => $statutoryMaximum,
            'annualComponents' => $account['existingContributions'],
            'additionalComponents' => self::zeroComponents(),
            'planTermDependentCapacity' => 0.0,
            'sharedLimits' => [],
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @return array<string,mixed>
     */
    private static function allocateAccount(array &$context, array $account): array
    {
        $traits = self::traits($account['type']);
        if (!self::availabilityForAccount($context['parameters'], $traits)) {
            $diagnostics = [self::diagnostic(
                'ACCOUNT_TYPE_NOT_AVAILABLE_FOR_YEAR',
                DiagnosticSeverity::ERROR,
                "{$account['type']} was not available in tax year {$context['taxYear']}.",
                "accounts.{$account['id']}",
            )];
            if (self::sumComponents($account['existingContributions']) > 0) {
                $diagnostics[] = self::diagnostic(
                    'EXISTING_CONTRIBUTION_BEFORE_ACCOUNT_AVAILABLE',
                    DiagnosticSeverity::ERROR,
                    'Existing contributions were supplied for an account type that was not yet available.',
                    "accounts.{$account['id']}.existingContributions",
                );
            }
            return self::emptyOutcome($account, CalculationStatus::UNAVAILABLE->value, 0.0, $diagnostics);
        }
        return match ($traits['family']) {
            'regular_traditional_ira' => self::allocateTraditionalIra($context, $account),
            'regular_roth_ira' => self::allocateRothIra($context, $account),
            'inherited_ira' => self::emptyOutcome(
                $account,
                CalculationStatus::INELIGIBLE->value,
                0.0,
                [self::diagnostic(
                    'INHERITED_IRA_CANNOT_ACCEPT_REGULAR_CONTRIBUTIONS',
                    DiagnosticSeverity::INFO,
                    "An inherited IRA cannot accept the beneficiary's regular annual IRA contribution.",
                    "accounts.{$account['id']}",
                    'IRC 408(d)(3)(C)',
                )],
            ),
            'sep' => self::allocateSep($context, $account, $traits),
            'simple' => self::allocateSimple($context, $account, $traits),
            'qualified_elective' => self::allocateQualifiedElective($context, $account, $traits),
            'section457' => self::allocateSection457($context, $account, $traits),
            'annual_additions_only' => self::allocateAnnualAdditionsOnly($context, $account, $traits),
            'defined_benefit' => self::allocateDefinedBenefit($account),
            'section457f' => self::allocateSection457f($account),
            default => throw new RetirementParameterException(
                'UNSUPPORTED_ACCOUNT_FAMILY',
                "Unsupported account family {$traits['family']}.",
            ),
        };
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @return array<string,mixed>
     */
    private static function allocateTraditionalIra(array &$context, array $account): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $ownerId = $account['ownerId'];
        $person = $context['persons'][$ownerId];
        $ownerPool =& $context['iraOwnerPools'][$ownerId];
        $compensationPoolId = $ownerPool['compensationPoolId'];
        $deductionPool =& $context['iraDeductionPools'][$ownerId];

        if ($ownerPool['blocked']) {
            $diagnostics[] = self::diagnostic(
                'IRA_POOL_BLOCKED_BY_PRIOR_INDETERMINATE_ACCOUNT',
                DiagnosticSeverity::ERROR,
                'A higher-priority IRA account has an indeterminate contribution limit, so remaining shared IRA capacity cannot be allocated reliably.',
                "accounts.{$account['id']}",
            );
            $result = [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => $ownerPool['limit'],
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
            unset($ownerPool, $deductionPool);
            return $result;
        }

        if ($context['parameters']['ira']['traditionalContributionAge70HalfRestriction']) {
            $restricted = self::reachesAge70HalfByYearEnd($person, $context['taxYear']);
            if ($restricted === true) {
                unset($ownerPool, $deductionPool);
                return self::emptyOutcome($account, CalculationStatus::INELIGIBLE->value, 0.0, [
                    self::diagnostic(
                        'PRE_2020_TRADITIONAL_IRA_AGE_70_HALF_RESTRICTION',
                        DiagnosticSeverity::INFO,
                        'Traditional IRA contributions were not permitted after age 70½ for this tax year.',
                        "accounts.{$account['id']}",
                    ),
                ]);
            }
            if ($restricted === null) {
                $ownerPool['blocked'] = true;
                $diagnostics[] = self::diagnostic(
                    'BIRTH_DATE_REQUIRED_FOR_AGE_70_HALF_RULE',
                    DiagnosticSeverity::ERROR,
                    'An exact birth date is required to resolve the former age-70½ traditional IRA contribution restriction.',
                    "persons.{$person['id']}.birthDate",
                );
                $result = [
                    'status' => CalculationStatus::INDETERMINATE->value,
                    'statutoryMaximum' => $ownerPool['limit'],
                    'annualComponents' => $annual,
                    'additionalComponents' => $additional,
                    'planTermDependentCapacity' => 0.0,
                    'sharedLimits' => $sharedLimits,
                    'diagnostics' => $diagnostics,
                ];
                unset($ownerPool, $deductionPool);
                return $result;
            }
        }

        if (!$context['parameters']['ira']['universalEligibility']) {
            if (!array_key_exists('coveredByEmployerRetirementPlan', $person)) {
                $ownerPool['blocked'] = true;
                $diagnostics[] = self::diagnostic(
                    'EMPLOYER_PLAN_COVERAGE_REQUIRED_FOR_HISTORICAL_IRA_ELIGIBILITY',
                    DiagnosticSeverity::ERROR,
                    'Employer-plan coverage is required to resolve IRA eligibility before universal IRA eligibility began in 1982.',
                    "persons.{$person['id']}.coveredByEmployerRetirementPlan",
                );
                $result = [
                    'status' => CalculationStatus::INDETERMINATE->value,
                    'statutoryMaximum' => $ownerPool['limit'],
                    'annualComponents' => $annual,
                    'additionalComponents' => $additional,
                    'planTermDependentCapacity' => 0.0,
                    'sharedLimits' => $sharedLimits,
                    'diagnostics' => $diagnostics,
                ];
                unset($ownerPool, $deductionPool);
                return $result;
            }
            if ($person['coveredByEmployerRetirementPlan']) {
                unset($ownerPool, $deductionPool);
                return self::emptyOutcome($account, CalculationStatus::INELIGIBLE->value, 0.0, [
                    self::diagnostic(
                        'PRE_1982_ACTIVE_PARTICIPANT_IRA_INELIGIBLE',
                        DiagnosticSeverity::INFO,
                        'Before 1982, an active participant in an employer retirement plan generally could not make the modeled deductible IRA contribution.',
                        "accounts.{$account['id']}",
                    ),
                ]);
            }
        }

        if ($ownerPool['limit'] === null || $context['iraCompensationPools'][$compensationPoolId]['limit'] === null) {
            $ownerPool['blocked'] = true;
            $diagnostics[] = self::diagnostic(
                'BIRTH_YEAR_OR_DATE_REQUIRED_FOR_IRA_LIMIT',
                DiagnosticSeverity::ERROR,
                'Birth year or birth date is required to determine the IRA catch-up limit.',
                "persons.{$person['id']}",
            );
            self::reportPoolWithoutConsuming($ownerPool, $sharedLimits);
            self::reportPoolWithoutConsuming($context['iraCompensationPools'][$compensationPoolId], $sharedLimits);
            $result = [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
            unset($ownerPool, $deductionPool);
            return $result;
        }

        $amount = self::takeAcrossPools(
            $context,
            [['iraOwnerPools', $ownerId], ['iraCompensationPools', $compensationPoolId]],
            self::minMoney(
                self::poolRemaining($ownerPool),
                self::poolRemaining($context['iraCompensationPools'][$compensationPoolId]),
            ),
            $sharedLimits,
        );
        if ($deductionPool['limit'] === null) {
            $additional['unclassifiedIra'] = $amount;
            $annual['unclassifiedIra'] = self::roundMoney($annual['unclassifiedIra'] + $amount);
            $diagnostics[] = self::diagnostic(
                'TRADITIONAL_IRA_DEDUCTIBILITY_INDETERMINATE',
                DiagnosticSeverity::ERROR,
                'The total traditional IRA contribution limit is known, but employer-plan coverage and/or traditional-IRA MAGI is required to classify it as deductible or nondeductible.',
                "accounts.{$account['id']}",
            );
            self::reportPoolWithoutConsuming($deductionPool, $sharedLimits);
        } else {
            $deductibleAdditional = self::minMoney($amount, self::poolRemaining($deductionPool));
            if ($deductibleAdditional > 0) {
                self::consumeExactFromPool($deductionPool, $deductibleAdditional, $sharedLimits);
            } else {
                self::reportPoolWithoutConsuming($deductionPool, $sharedLimits);
            }
            $additional['deductibleIra'] = $deductibleAdditional;
            $additional['nondeductibleIra'] = self::roundMoney($amount - $deductibleAdditional);
            $annual['deductibleIra'] = self::roundMoney($annual['deductibleIra'] + $deductibleAdditional);
            $annual['nondeductibleIra'] = self::roundMoney($annual['nondeductibleIra'] + $amount - $deductibleAdditional);
            if ($additional['nondeductibleIra'] > 0 && !$context['parameters']['ira']['nondeductibleContributionAvailable']) {
                $diagnostics[] = self::diagnostic(
                    'NONDEDUCTIBLE_IRA_NOT_AVAILABLE_FOR_YEAR',
                    DiagnosticSeverity::ERROR,
                    'A nondeductible traditional IRA contribution was not available in this historical tax year.',
                    "accounts.{$account['id']}",
                );
            }
        }
        $result = [
            'status' => self::accountStatusFromDiagnostics(CalculationStatus::DETERMINATE->value, $diagnostics),
            'statutoryMaximum' => $ownerPool['limit'],
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => 0.0,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
        unset($ownerPool, $deductionPool);
        return $result;
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @return array<string,mixed>
     */
    private static function allocateRothIra(array &$context, array $account): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $ownerId = $account['ownerId'];
        $person = $context['persons'][$ownerId];
        $ownerPool =& $context['iraOwnerPools'][$ownerId];
        $compensationPoolId = $ownerPool['compensationPoolId'];
        $rothPool =& $context['iraRothEligibilityPools'][$ownerId];
        if ($ownerPool['blocked']) {
            $diagnostics[] = self::diagnostic(
                'IRA_POOL_BLOCKED_BY_PRIOR_INDETERMINATE_ACCOUNT',
                DiagnosticSeverity::ERROR,
                'A higher-priority IRA account has an indeterminate contribution limit.',
                "accounts.{$account['id']}",
            );
            $result = [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => $rothPool['limit'],
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
            unset($ownerPool, $rothPool);
            return $result;
        }
        if (
            $ownerPool['limit'] === null
            || $context['iraCompensationPools'][$compensationPoolId]['limit'] === null
            || $rothPool['limit'] === null
        ) {
            $ownerPool['blocked'] = true;
            if (!array_key_exists('rothIra', $person['magi'])) {
                $diagnostics[] = self::diagnostic(
                    'ROTH_IRA_MAGI_REQUIRED',
                    DiagnosticSeverity::ERROR,
                    'Roth-IRA MAGI is required to determine the direct Roth IRA contribution limit.',
                    "persons.{$person['id']}.magi.rothIra",
                );
            }
            if ($ownerPool['limit'] === null) {
                $diagnostics[] = self::diagnostic(
                    'BIRTH_YEAR_OR_DATE_REQUIRED_FOR_IRA_LIMIT',
                    DiagnosticSeverity::ERROR,
                    'Birth year or birth date is required to determine the IRA catch-up limit.',
                    "persons.{$person['id']}",
                );
            }
            self::reportPoolWithoutConsuming($ownerPool, $sharedLimits);
            self::reportPoolWithoutConsuming($context['iraCompensationPools'][$compensationPoolId], $sharedLimits);
            self::reportPoolWithoutConsuming($rothPool, $sharedLimits);
            $result = [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => $rothPool['limit'],
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
            unset($ownerPool, $rothPool);
            return $result;
        }
        $amount = self::takeAcrossPools(
            $context,
            [
                ['iraOwnerPools', $ownerId],
                ['iraCompensationPools', $compensationPoolId],
                ['iraRothEligibilityPools', $ownerId],
            ],
            self::minMoney(
                self::poolRemaining($ownerPool),
                self::poolRemaining($context['iraCompensationPools'][$compensationPoolId]),
                self::poolRemaining($rothPool),
            ),
            $sharedLimits,
        );
        $additional['rothIra'] = $amount;
        $annual['rothIra'] = self::roundMoney($annual['rothIra'] + $amount);
        $result = [
            'status' => CalculationStatus::DETERMINATE->value,
            'statutoryMaximum' => $rothPool['limit'],
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => 0.0,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
        unset($ownerPool, $rothPool);
        return $result;
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     */
    private static function accountPlanCatchUpLimit(array $context, array $account, array $traits): float
    {
        $person = $context['persons'][$account['ownerId']];
        $age = self::ageAtEndOfTaxYear($person, $context['taxYear']);
        if ($age === null || $age < 50 || empty($traits['permitsAgeCatchUpByStatute'])) {
            return 0.0;
        }
        if (!empty($traits['isStarter'])) {
            return (float) $context['parameters']['starterDeferralOnly']['age50CatchUp'];
        }
        if (!empty($traits['isSimple'])) {
            if ($age >= 60 && $age <= 63 && $context['parameters']['simple']['age60To63CatchUp'] !== null) {
                return (float) $context['parameters']['simple']['age60To63CatchUp'];
            }
            if (
                !empty($account['planRules']['simpleEnhancedLimitEligible'])
                && $context['parameters']['simple']['certainPlanAge50CatchUp'] !== null
            ) {
                return (float) $context['parameters']['simple']['certainPlanAge50CatchUp'];
            }
            return (float) $context['parameters']['simple']['generalAge50CatchUp'];
        }
        return self::workplaceCatchUpLimit($context['parameters'], $person, $traits);
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     */
    private static function baseDeferralLimitForAccount(array $context, array $account, array $traits): ?float
    {
        if (!empty($traits['isStarter'])) {
            return $context['parameters']['starterDeferralOnly']['baseDeferralLimit'] === null
                ? null
                : (float) $context['parameters']['starterDeferralOnly']['baseDeferralLimit'];
        }
        if (!empty($traits['isSimple'])) {
            if (
                !empty($account['planRules']['simpleEnhancedLimitEligible'])
                && $context['parameters']['simple']['certainPlanEnhancedSalaryReductionLimit'] !== null
            ) {
                return (float) $context['parameters']['simple']['certainPlanEnhancedSalaryReductionLimit'];
            }
            return $context['parameters']['simple']['salaryReductionLimit'] === null
                ? null
                : (float) $context['parameters']['simple']['salaryReductionLimit'];
        }
        return $context['parameters']['electiveDeferral402g'] === null
            ? null
            : (float) $context['parameters']['electiveDeferral402g'];
    }

    /** @param array<string,mixed> $account */
    private static function special403bCatchUpLimit(array $account): float
    {
        $input = $account['planRules']['special403bCatchUp'] ?? null;
        if (!is_array($input) || empty($input['eligible'])) {
            return 0.0;
        }
        $lifetimeRemaining = self::nonnegative(
            15000.0 - self::money($input['priorSpecialCatchUpUsed'] ?? null, "{$account['id']}.priorSpecialCatchUpUsed"),
        );
        $serviceRemaining = self::nonnegative(
            5000.0 * (float) $input['yearsOfService']
            - self::money($input['priorElectiveDeferrals'] ?? null, "{$account['id']}.priorElectiveDeferrals"),
        );
        return self::floorMoney(self::minMoney(3000.0, $lifetimeRemaining, $serviceRemaining));
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @param list<array<string,mixed>> $diagnostics
     *  @return 'pretax'|'roth'|'unavailable'|'unknown'
     */
    private static function catchUpTaxTreatment(
        array $context,
        array $account,
        array $traits,
        array &$diagnostics,
    ): string {
        $person = $context['persons'][$account['ownerId']];
        $defaultTreatment = self::accountUsesRothEmployeeContributions($account, $traits) ? 'roth' : 'pretax';
        $threshold = $context['parameters']['rothCatchUpPriorYearFicaWageThreshold'];
        if (
            $threshold === null
            || $traits['family'] === 'simple'
            || !empty($traits['isSarsep'])
            || self::accountPlanCatchUpLimit($context, $account, $traits) === 0.0
        ) {
            return $defaultTreatment;
        }
        if (!empty($account['planRules']['isSelfEmployedOwner'])) {
            return $defaultTreatment;
        }
        if (empty($account['employerId'])) {
            $diagnostics[] = self::diagnostic(
                'EMPLOYER_ID_REQUIRED_FOR_ROTH_CATCH_UP_WAGE_TEST',
                DiagnosticSeverity::ERROR,
                'An employerId is required to apply the prior-year FICA-wage test for catch-up contributions.',
                "accounts.{$account['id']}.employerId",
            );
            return 'unknown';
        }
        $employerId = (string) $account['employerId'];
        $wages = $person['priorYearFicaWagesByEmployer'][$employerId] ?? null;
        if ($wages === null) {
            $diagnostics[] = self::diagnostic(
                'PRIOR_YEAR_FICA_WAGES_REQUIRED_FOR_ROTH_CATCH_UP_CLASSIFICATION',
                DiagnosticSeverity::ERROR,
                "Prior-year FICA wages from employer {$employerId} are required to classify catch-up contributions.",
                "persons.{$person['id']}.priorYearFicaWagesByEmployer.{$employerId}",
            );
            return 'unknown';
        }
        if ((float) $wages <= (float) $threshold) {
            return $defaultTreatment;
        }
        $permitsRoth = $account['planRules']['permitsRothCatchUp']
            ?? $account['planRules']['permitsRothContributions']
            ?? $traits['designatedRoth'];
        if (!$permitsRoth) {
            $diagnostics[] = self::diagnostic(
                'HIGH_WAGE_CATCH_UP_REQUIRES_ROTH_BUT_PLAN_DOES_NOT_OFFER_IT',
                DiagnosticSeverity::WARNING,
                'Prior-year FICA wages exceeded $' . number_format((float) $threshold, 0)
                    . '; no catch-up amount was allocated because the supplied plan rules do not permit Roth catch-up contributions.',
                "accounts.{$account['id']}.planRules.permitsRothCatchUp",
                'IRC 414(v)(7)',
            );
            return 'unavailable';
        }
        $diagnostics[] = self::diagnostic(
            'HIGH_WAGE_CATCH_UP_ALLOCATED_AS_ROTH',
            DiagnosticSeverity::INFO,
            'Prior-year FICA wages exceeded $' . number_format((float) $threshold, 0)
                . ', so the age-based catch-up is allocated as Roth.',
            "accounts.{$account['id']}",
            'IRC 414(v)(7)',
        );
        return 'roth';
    }

    /** @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     */
    private static function accountUsesRothEmployeeContributions(array $account, array $traits): bool
    {
        $preference = $account['planRules']['contributionPreference'] ?? 'account_type';
        if ($preference === 'roth_first') {
            return (bool) ($account['planRules']['permitsRothContributions'] ?? $traits['designatedRoth']);
        }
        if ($preference === 'pretax_first') {
            return false;
        }
        return (bool) $traits['designatedRoth'];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @param array<string,float> $annual
     *  @param array<string,float> $additional
     *  @param list<array<string,mixed>> $diagnostics
     *  @param list<array<string,mixed>> $sharedLimits
     *  @return array{baseAdded:float,catchUpAdded:float,compensationRemaining:float}|null
     */
    private static function allocateBaseAndCatchUp(
        array &$context,
        array $account,
        array $traits,
        array &$annual,
        array &$additional,
        array &$diagnostics,
        array &$sharedLimits,
        bool $include415c,
    ): ?array {
        $ownerId = $account['ownerId'];
        $person = $context['persons'][$ownerId];
        $age = self::ageAtEndOfTaxYear($person, $context['taxYear']);
        $anyCatchUpAvailable =
            (float) $context['parameters']['generalAge50CatchUp'] > 0
            || (float) $context['parameters']['simple']['generalAge50CatchUp'] > 0
            || (float) $context['parameters']['starterDeferralOnly']['age50CatchUp'] > 0;
        if ($age === null && $anyCatchUpAvailable) {
            $diagnostics[] = self::diagnostic(
                'BIRTH_YEAR_OR_DATE_REQUIRED_FOR_WORKPLACE_CATCH_UP',
                DiagnosticSeverity::ERROR,
                'Birth year or birth date is required to determine the maximum age-based workplace catch-up contribution.',
                "persons.{$person['id']}",
            );
        }
        $basePlanLimit = self::baseDeferralLimitForAccount($context, $account, $traits);
        $planComp = self::planCompensation($account, $person);
        $groupId = self::groupIdForAccount($account);
        $annualGroupExists = $include415c && isset($context['annualAdditionsPools'][$groupId]);
        if (
            $basePlanLimit === null
            || $context['elective402gPools'][$ownerId]['limit'] === null
            || ($include415c && (!$annualGroupExists || $context['annualAdditionsPools'][$groupId]['limit'] === null))
        ) {
            $diagnostics[] = self::diagnostic(
                'HISTORICAL_EMPLOYER_PLAN_LIMIT_INDETERMINATE',
                DiagnosticSeverity::ERROR,
                "A universal modern elective-deferral/annual-additions maximum is not encoded for {$context['taxYear']}; the historical plan document and applicable law are required.",
                "accounts.{$account['id']}",
            );
            self::reportPoolWithoutConsuming($context['elective402gPools'][$ownerId], $sharedLimits);
            if ($annualGroupExists) {
                self::reportPoolWithoutConsuming($context['annualAdditionsPools'][$groupId], $sharedLimits);
            }
            return null;
        }
        $existingBaseForAccount = self::baseDeferrals($account['existingContributions']);
        $employeePlanLimit = self::minMoney(
            $basePlanLimit,
            $account['planRules']['planDocumentEmployeeDeferralLimit'] ?? $basePlanLimit,
            $planComp,
        );
        $accountAnnualRemainingBefore = !array_key_exists('planDocumentAnnualAdditionsLimit', $account['planRules'])
            ? $employeePlanLimit
            : self::nonnegative(
                self::money(
                    $account['planRules']['planDocumentAnnualAdditionsLimit'],
                    "{$account['id']}.planDocumentAnnualAdditionsLimit",
                ) - self::annualAdditions($account['existingContributions']),
            );
        $desiredBase = self::minMoney(
            self::nonnegative($employeePlanLimit - $existingBaseForAccount),
            $accountAnnualRemainingBefore,
        );
        $refs = [['elective402gPools', $ownerId]];
        if ($annualGroupExists) {
            $refs[] = ['annualAdditionsPools', $groupId];
        }
        $baseAdded = self::takeAcrossPools($context, $refs, $desiredBase, $sharedLimits);
        if (self::accountUsesRothEmployeeContributions($account, $traits)) {
            $additional['employeeRothDeferral'] = $baseAdded;
            $annual['employeeRothDeferral'] = self::roundMoney($annual['employeeRothDeferral'] + $baseAdded);
        } else {
            $additional['employeePreTaxDeferral'] = $baseAdded;
            $annual['employeePreTaxDeferral'] = self::roundMoney($annual['employeePreTaxDeferral'] + $baseAdded);
        }
        $compensationRemaining = self::nonnegative(
            $planComp
            - self::baseDeferrals($annual)
            - self::ageCatchUps($annual)
            - $annual['special403bCatchUp'],
        );
        if (!empty($traits['is403b'])) {
            $specialLimit = self::special403bCatchUpLimit($account);
            $existingSpecial = $account['existingContributions']['special403bCatchUp'];
            $planDocumentRemaining = !array_key_exists('planDocumentAnnualAdditionsLimit', $account['planRules'])
                ? PHP_FLOAT_MAX
                : self::nonnegative(
                    self::money(
                        $account['planRules']['planDocumentAnnualAdditionsLimit'],
                        "{$account['id']}.planDocumentAnnualAdditionsLimit",
                    ) - self::annualAdditions($annual),
                );
            $desiredSpecial = self::minMoney(
                self::nonnegative($specialLimit - $existingSpecial),
                self::poolRemaining($context['special403bCatchUpPools'][$ownerId]),
                $compensationRemaining,
                $planDocumentRemaining,
            );
            if ($desiredSpecial > 0 && $annualGroupExists) {
                $specialAdded = self::takeAcrossPools(
                    $context,
                    [
                        ['annualAdditionsPools', $groupId],
                        ['special403bCatchUpPools', $ownerId],
                    ],
                    $desiredSpecial,
                    $sharedLimits,
                );
                $additional['special403bCatchUp'] = $specialAdded;
                $annual['special403bCatchUp'] = self::roundMoney($annual['special403bCatchUp'] + $specialAdded);
                $compensationRemaining = self::nonnegative($compensationRemaining - $specialAdded);
            }
        }
        $planCatchUpLimit = self::accountPlanCatchUpLimit($context, $account, $traits);
        $existingCatchUp = self::ageCatchUps($account['existingContributions']);
        $desiredCatchUp = self::minMoney(
            self::nonnegative($planCatchUpLimit - $existingCatchUp),
            $compensationRemaining,
        );
        $catchUpAdded = 0.0;
        $treatment = self::catchUpTaxTreatment($context, $account, $traits, $diagnostics);
        if ($treatment === 'unknown') {
            self::reportPoolWithoutConsuming($context['catchUpPools'][$ownerId], $sharedLimits);
        } elseif ($treatment !== 'unavailable' && $desiredCatchUp > 0) {
            $catchUpAdded = self::takeAcrossPools(
                $context,
                [['catchUpPools', $ownerId]],
                $desiredCatchUp,
                $sharedLimits,
            );
            if ($treatment === 'roth') {
                $additional['employeeRothCatchUp'] = $catchUpAdded;
                $annual['employeeRothCatchUp'] = self::roundMoney($annual['employeeRothCatchUp'] + $catchUpAdded);
            } else {
                $additional['employeePreTaxCatchUp'] = $catchUpAdded;
                $annual['employeePreTaxCatchUp'] = self::roundMoney($annual['employeePreTaxCatchUp'] + $catchUpAdded);
            }
            $compensationRemaining = self::nonnegative($compensationRemaining - $catchUpAdded);
        }
        return [
            'baseAdded' => $baseAdded,
            'catchUpAdded' => $catchUpAdded,
            'compensationRemaining' => $compensationRemaining,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @return array{amount:float,known:bool,description:string}
     */
    private static function employerContributionMaximum(
        array $context,
        array $account,
        float $employeeBaseDeferral,
    ): array {
        $person = $context['persons'][$account['ownerId']];
        $recognizedCompensation = self::recognizedCompensationForEmployerAllocation(
            $context,
            $account,
            $person,
        );
        $rules = $account['planRules'];
        if (array_key_exists('expectedEmployerContribution', $rules)) {
            return [
                'amount' => self::money($rules['expectedEmployerContribution'], "{$account['id']}.expectedEmployerContribution"),
                'known' => true,
                'description' => 'caller-supplied employer contribution',
            ];
        }
        $amount = 0.0;
        $hasFormula = false;
        if (array_key_exists('employerNonelectiveRate', $rules)) {
            $amount += $recognizedCompensation * self::rate(
                $rules['employerNonelectiveRate'],
                "{$account['id']}.employerNonelectiveRate",
            );
            $hasFormula = true;
        }
        if (array_key_exists('employerMatchRate', $rules) && array_key_exists('employerMatchCompensationFraction', $rules)) {
            $matchableDeferral = self::minMoney(
                $employeeBaseDeferral,
                $recognizedCompensation * self::rate(
                    $rules['employerMatchCompensationFraction'],
                    "{$account['id']}.employerMatchCompensationFraction",
                ),
            );
            $amount += $matchableDeferral * self::rate($rules['employerMatchRate'], "{$account['id']}.employerMatchRate");
            $hasFormula = true;
        }
        if (!empty($rules['isSelfEmployedOwner']) && !$hasFormula) {
            $netEarnings = self::money(
                $rules['netEarningsFromSelfEmploymentAfterHalfSETax']
                    ?? $person['compensation']['selfEmploymentNetEarnings']
                    ?? null,
                "{$account['id']}.netEarningsFromSelfEmploymentAfterHalfSETax",
            );
            $amount = self::minMoney(
                $netEarnings * (float) $context['parameters']['sep']['selfEmployedEquivalentRate'],
                $recognizedCompensation * (float) $context['parameters']['sep']['maximumEmployerContributionRate'],
            );
            $hasFormula = true;
        }
        return [
            'amount' => self::floorMoney($amount),
            'known' => $hasFormula,
            'description' => $hasFormula ? 'supplied employer formula' : 'unknown plan/employer formula',
        ];
    }

    /** @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @param array<string,float> $annual
     *  @param array<string,float> $additional
     */
    /** @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     */
    private static function employerContributionUsesRoth(array $account, array $traits): bool
    {
        return ($account['planRules']['employerContributionTaxTreatment'] ?? null) === 'roth'
            || ($traits['family'] === 'sep' && !empty($traits['designatedRoth']));
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @param list<array<string,mixed>> $diagnostics
     */
    private static function validateEmployerRothAvailability(
        array $context,
        array $account,
        array $traits,
        array &$diagnostics,
    ): bool {
        if (!self::employerContributionUsesRoth($account, $traits) || $context['taxYear'] >= 2023) {
            return true;
        }
        $diagnostics[] = self::diagnostic(
            'ROTH_EMPLOYER_CONTRIBUTIONS_NOT_AVAILABLE_FOR_YEAR',
            DiagnosticSeverity::ERROR,
            'Employer matching and nonelective contributions designated as Roth are modeled as available beginning in 2023.',
            "accounts.{$account['id']}.planRules.employerContributionTaxTreatment",
        );
        return false;
    }

    private static function addEmployerContribution(
        array $account,
        array $traits,
        array &$annual,
        array &$additional,
        float $amount,
    ): void {
        $roth = self::employerContributionUsesRoth($account, $traits);
        if ($roth) {
            $additional['employerRoth'] = self::roundMoney($additional['employerRoth'] + $amount);
            $annual['employerRoth'] = self::roundMoney($annual['employerRoth'] + $amount);
        } else {
            $additional['employerPreTax'] = self::roundMoney($additional['employerPreTax'] + $amount);
            $annual['employerPreTax'] = self::roundMoney($annual['employerPreTax'] + $amount);
        }
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @return array{amount:float,known:bool,statutoryPotential:float,diagnostics:list<array<string,mixed>>}
     */
    private static function simpleEmployerContribution(
        array $context,
        array $account,
        float $annualEmployeeDeferrals,
        bool $applyCompensationLimitToMatch,
    ): array {
        $diagnostics = [];
        $person = $context['persons'][$account['ownerId']];
        $compensation = self::planCompensation($account, $person);
        $cappedCompensation = $context['parameters']['annualCompensation401a17'] === null
            ? $compensation
            : min($compensation, (float) $context['parameters']['annualCompensation401a17']);
        // SIMPLE IRA matching compensation is exempt from §401(a)(17); a SIMPLE 401(k)
        // is a qualified §401(k)(11) plan whose compensation remains subject to it.
        $matchCompensation = $applyCompensationLimitToMatch ? $cappedCompensation : $compensation;
        $matchMaximum = self::minMoney($annualEmployeeDeferrals, $matchCompensation * 0.03);
        $nonelectiveMaximum = $cappedCompensation * 0.02;
        $additionalCap = (float) ($context['parameters']['simple']['additionalNonelectiveContributionCap'] ?? 0.0);
        $additionalStatutoryMaximum = self::minMoney($additionalCap, $cappedCompensation * 0.10);
        $requestedAdditional = self::money(
            $account['planRules']['simpleAdditionalNonelectiveContribution'] ?? null,
            "{$account['id']}.simpleAdditionalNonelectiveContribution",
        );
        $additional = self::minMoney($requestedAdditional, $additionalStatutoryMaximum);
        if ($requestedAdditional > $additionalStatutoryMaximum) {
            $diagnostics[] = self::diagnostic(
                'SIMPLE_ADDITIONAL_NONELECTIVE_CONTRIBUTION_CAPPED',
                DiagnosticSeverity::WARNING,
                'The additional SIMPLE nonelective contribution was capped at $'
                    . number_format($additionalStatutoryMaximum, 0)
                    . ', the lesser of the indexed dollar cap and 10% of recognized compensation.',
                "accounts.{$account['id']}.planRules.simpleAdditionalNonelectiveContribution",
            );
        }
        $method = $account['planRules']['simpleEmployerContributionMethod'] ?? null;
        $amount = 0.0;
        $known = true;
        switch ($method) {
            case 'match_3_percent':
                $amount = $matchMaximum;
                break;
            case 'nonelective_2_percent':
                $amount = $nonelectiveMaximum;
                break;
            case 'custom':
                $amount = self::money(
                    $account['planRules']['simpleCustomEmployerContribution'] ?? null,
                    "{$account['id']}.simpleCustomEmployerContribution",
                );
                break;
            default:
                $known = false;
                $diagnostics[] = self::diagnostic(
                    'SIMPLE_EMPLOYER_METHOD_IS_PLAN_TERM_DEPENDENT',
                    DiagnosticSeverity::WARNING,
                    'Select the SIMPLE 3% matching, 2% nonelective, or custom employer method to calculate the usable employer contribution.',
                    "accounts.{$account['id']}.planRules.simpleEmployerContributionMethod",
                );
        }
        return [
            'amount' => self::floorMoney($amount + $additional),
            'known' => $known,
            'statutoryPotential' => self::floorMoney(
                max($matchMaximum, $nonelectiveMaximum) + $additionalStatutoryMaximum,
            ),
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @return array<string,mixed>
     */
    private static function allocateQualifiedElective(array &$context, array $account, array $traits): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $groupId = self::groupIdForAccount($account);
        if (!empty($traits['isSarsep']) && $context['taxYear'] >= 1997 && empty($account['planRules']['grandfatheredSarsep'])) {
            return self::emptyOutcome($account, CalculationStatus::INELIGIBLE->value, 0.0, [
                self::diagnostic(
                    'NEW_SARSEP_NOT_PERMITTED_AFTER_1996',
                    DiagnosticSeverity::ERROR,
                    'A SARSEP generally must have been established before 1997. Set grandfatheredSarsep for an eligible continuing plan.',
                    "accounts.{$account['id']}.planRules.grandfatheredSarsep",
                ),
            ]);
        }
        if (!isset($context['annualAdditionsPools'][$groupId]) || $context['annualAdditionsPools'][$groupId]['limit'] === null) {
            $diagnostics[] = self::diagnostic(
                'HISTORICAL_415C_LIMIT_INDETERMINATE',
                DiagnosticSeverity::ERROR,
                "The IRC 415(c) annual-additions limit is not encoded as a universal monetary maximum for {$context['taxYear']}.",
                "accounts.{$account['id']}",
            );
            if (isset($context['annualAdditionsPools'][$groupId])) {
                self::reportPoolWithoutConsuming($context['annualAdditionsPools'][$groupId], $sharedLimits);
            }
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $deferral = self::allocateBaseAndCatchUp(
            $context,
            $account,
            $traits,
            $annual,
            $additional,
            $diagnostics,
            $sharedLimits,
            true,
        );
        if ($deferral === null) {
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $annualGroupLimit = (float) $context['annualAdditionsPools'][$groupId]['limit'];
        $accountAnnualLimit = self::minMoney(
            $annualGroupLimit,
            $account['planRules']['planDocumentAnnualAdditionsLimit'] ?? $annualGroupLimit,
        );
        $employeeBase = self::baseDeferrals($annual);
        $employerKnown = !empty($traits['isStarter']);
        $employerDesired = 0.0;
        $statutoryEmployerPotential = 0.0;
        if (!empty($traits['isStarter'])) {
            // Deferral-only by statute/plan type.
        } elseif (!empty($traits['isSimple'])) {
            $simpleEmployer = self::simpleEmployerContribution(
                $context,
                $account,
                $employeeBase + self::ageCatchUps($annual),
                true,
            );
            array_push($diagnostics, ...$simpleEmployer['diagnostics']);
            $employerKnown = $simpleEmployer['known'];
            $employerDesired = self::nonnegative(
                $simpleEmployer['amount']
                - $account['existingContributions']['employerPreTax']
                - $account['existingContributions']['employerRoth'],
            );
            $statutoryEmployerPotential = $simpleEmployer['statutoryPotential'];
        } else {
            $employer = self::employerContributionMaximum($context, $account, $employeeBase);
            $employerKnown = $employer['known'];
            $employerDesired = self::nonnegative(
                $employer['amount']
                - $account['existingContributions']['employerPreTax']
                - $account['existingContributions']['employerRoth'],
            );
        }
        $accountRemainingBeforeEmployer = self::nonnegative($accountAnnualLimit - self::annualAdditions($annual));
        $employerAdded = 0.0;
        $employerTaxTreatmentAvailable = $employerDesired === 0.0
            || self::validateEmployerRothAvailability($context, $account, $traits, $diagnostics);
        if ($employerKnown && $employerTaxTreatmentAvailable) {
            $employerAdded = self::takeAcrossPools(
                $context,
                [['annualAdditionsPools', $groupId]],
                self::minMoney($employerDesired, $accountRemainingBeforeEmployer),
                $sharedLimits,
            );
        }
        if ($employerKnown && ($employerDesired === 0.0 || !$employerTaxTreatmentAvailable)) {
            self::reportPoolWithoutConsuming($context['annualAdditionsPools'][$groupId], $sharedLimits);
        }
        if ($employerAdded > 0.0) {
            self::addEmployerContribution($account, $traits, $annual, $additional, $employerAdded);
        }
        if (!empty($account['planRules']['permitsAfterTaxEmployeeContributions']) && empty($traits['isStarter'])) {
            $afterTaxCapacity = self::minMoney(
                self::poolRemaining($context['annualAdditionsPools'][$groupId]),
                self::nonnegative($accountAnnualLimit - self::annualAdditions($annual)),
                $deferral['compensationRemaining'],
            );
            if ($afterTaxCapacity > 0.0) {
                $afterTaxAdded = self::takeAcrossPools(
                    $context,
                    [['annualAdditionsPools', $groupId]],
                    $afterTaxCapacity,
                    $sharedLimits,
                );
                $additional['employeeAfterTax'] = $afterTaxAdded;
                $annual['employeeAfterTax'] = self::roundMoney($annual['employeeAfterTax'] + $afterTaxAdded);
            }
        }
        $planTermDependentCapacity = 0.0;
        if (
            empty($traits['isStarter'])
            && !$employerKnown
            && empty($account['planRules']['permitsAfterTaxEmployeeContributions'])
        ) {
            $planTermDependentCapacity = self::minMoney(
                self::poolRemaining($context['annualAdditionsPools'][$groupId]),
                self::nonnegative($accountAnnualLimit - self::annualAdditions($annual)),
            );
            if ($planTermDependentCapacity > 0.0) {
                $diagnostics[] = self::diagnostic(
                    'PLAN_TERM_DEPENDENT_415C_CAPACITY',
                    DiagnosticSeverity::WARNING,
                    '$' . number_format($planTermDependentCapacity, 0)
                        . ' of potential annual-additions capacity requires an employer contribution formula or permission for voluntary after-tax contributions.',
                    "accounts.{$account['id']}.planRules",
                );
            }
        }
        $planCatchUp = self::accountPlanCatchUpLimit($context, $account, $traits);
        $statutoryMaximum = !empty($traits['isStarter'])
            ? self::roundMoney((self::baseDeferralLimitForAccount($context, $account, $traits) ?? 0.0) + $planCatchUp)
            : self::roundMoney(
                $accountAnnualLimit
                + $planCatchUp
                + (!empty($traits['isSimple']) ? max(0.0, $statutoryEmployerPotential - $accountAnnualLimit) : 0.0),
            );
        return [
            'status' => self::accountStatusFromDiagnostics(CalculationStatus::DETERMINATE->value, $diagnostics),
            'statutoryMaximum' => $statutoryMaximum,
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => $planTermDependentCapacity,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @return array<string,mixed>
     */
    private static function allocateSimple(array &$context, array $account, array $traits): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $deferral = self::allocateBaseAndCatchUp(
            $context,
            $account,
            $traits,
            $annual,
            $additional,
            $diagnostics,
            $sharedLimits,
            false,
        );
        if ($deferral === null) {
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $simpleEmployer = self::simpleEmployerContribution(
            $context,
            $account,
            self::baseDeferrals($annual) + self::ageCatchUps($annual),
            false,
        );
        array_push($diagnostics, ...$simpleEmployer['diagnostics']);
        if ($simpleEmployer['known']) {
            $employerAdded = self::nonnegative(
                $simpleEmployer['amount']
                - $account['existingContributions']['employerPreTax']
                - $account['existingContributions']['employerRoth'],
            );
            if (
                $employerAdded > 0.0
                && self::validateEmployerRothAvailability($context, $account, $traits, $diagnostics)
            ) {
                self::addEmployerContribution($account, $traits, $annual, $additional, $employerAdded);
            }
        }
        $planTermDependentCapacity = $simpleEmployer['known'] ? 0.0 : $simpleEmployer['statutoryPotential'];
        $baseLimit = self::baseDeferralLimitForAccount($context, $account, $traits) ?? 0.0;
        $catchUpLimit = self::accountPlanCatchUpLimit($context, $account, $traits);
        return [
            'status' => self::accountStatusFromDiagnostics(CalculationStatus::DETERMINATE->value, $diagnostics),
            'statutoryMaximum' => self::roundMoney($baseLimit + $catchUpLimit + $simpleEmployer['statutoryPotential']),
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => $planTermDependentCapacity,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @return array<string,mixed>
     */
    private static function allocateSep(array &$context, array $account, array $traits): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $groupId = self::groupIdForAccount($account);
        if (!isset($context['annualAdditionsPools'][$groupId]) || $context['annualAdditionsPools'][$groupId]['limit'] === null) {
            $diagnostics[] = self::diagnostic(
                'HISTORICAL_SEP_MAXIMUM_REQUIRES_PLAN_FACTS',
                DiagnosticSeverity::ERROR,
                "The SEP maximum cannot be reduced to a universal monetary amount for {$context['taxYear']} from the encoded facts.",
                "accounts.{$account['id']}",
            );
            if (isset($context['annualAdditionsPools'][$groupId])) {
                self::reportPoolWithoutConsuming($context['annualAdditionsPools'][$groupId], $sharedLimits);
            }
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $person = $context['persons'][$account['ownerId']];
        $compensation = self::planCompensation($account, $person);
        if (
            $context['parameters']['sep']['minimumEligibleCompensation'] !== null
            && $compensation < (float) $context['parameters']['sep']['minimumEligibleCompensation']
        ) {
            $diagnostics[] = self::diagnostic(
                'SEP_COMPENSATION_BELOW_MAXIMUM_EXCLUDABLE_THRESHOLD',
                DiagnosticSeverity::WARNING,
                'Compensation is below the statutory amount a SEP document may use to exclude an employee; actual eligibility depends on the plan document.',
                "accounts.{$account['id']}.planRules.planCompensation",
            );
        }
        $recognizedCompensation = self::recognizedCompensationForEmployerAllocation(
            $context,
            $account,
            $person,
        );
        $rateBasedMaximum = !empty($account['planRules']['isSelfEmployedOwner'])
            ? self::minMoney(
                $compensation * (float) $context['parameters']['sep']['selfEmployedEquivalentRate'],
                $recognizedCompensation * (float) $context['parameters']['sep']['maximumEmployerContributionRate'],
            )
            : $recognizedCompensation * (float) $context['parameters']['sep']['maximumEmployerContributionRate'];
        $groupLimit = (float) $context['annualAdditionsPools'][$groupId]['limit'];
        $planDocumentLimit = (float) ($account['planRules']['planDocumentAnnualAdditionsLimit'] ?? $groupLimit);
        $formulaMaximum = self::floorMoney(self::minMoney(
            $groupLimit,
            $planDocumentLimit,
            $rateBasedMaximum,
        ));
        $existingEmployer = self::roundMoney(
            $account['existingContributions']['employerPreTax'] + $account['existingContributions']['employerRoth'],
        );
        $desired = self::nonnegative($formulaMaximum - $existingEmployer);
        $employerAdded = $desired > 0.0
            && self::validateEmployerRothAvailability($context, $account, $traits, $diagnostics)
            ? self::takeAcrossPools(
                $context,
                [['annualAdditionsPools', $groupId]],
                $desired,
                $sharedLimits,
            )
            : 0.0;
        if ($employerAdded > 0.0) {
            self::addEmployerContribution($account, $traits, $annual, $additional, $employerAdded);
        }
        return [
            'status' => CalculationStatus::DETERMINATE->value,
            'statutoryMaximum' => $formulaMaximum,
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => 0.0,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @return array<string,mixed>
     */
    private static function allocateAnnualAdditionsOnly(array &$context, array $account, array $traits): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $groupId = self::groupIdForAccount($account);
        if (!isset($context['annualAdditionsPools'][$groupId]) || $context['annualAdditionsPools'][$groupId]['limit'] === null) {
            $diagnostics[] = self::diagnostic(
                'HISTORICAL_415C_LIMIT_INDETERMINATE',
                DiagnosticSeverity::ERROR,
                "The employer-plan contribution maximum for {$context['taxYear']} requires historical plan and compensation facts not represented by a universal encoded limit.",
                "accounts.{$account['id']}",
            );
            if (isset($context['annualAdditionsPools'][$groupId])) {
                self::reportPoolWithoutConsuming($context['annualAdditionsPools'][$groupId], $sharedLimits);
            }
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $groupLimit = (float) $context['annualAdditionsPools'][$groupId]['limit'];
        $accountAnnualLimit = self::minMoney(
            $groupLimit,
            $account['planRules']['planDocumentAnnualAdditionsLimit'] ?? $groupLimit,
        );
        $employer = self::employerContributionMaximum($context, $account, 0.0);
        if ($employer['known']) {
            $existingEmployer = self::roundMoney($annual['employerPreTax'] + $annual['employerRoth']);
            $desired = self::minMoney(
                self::nonnegative($employer['amount'] - $existingEmployer),
                self::nonnegative($accountAnnualLimit - self::annualAdditions($annual)),
            );
            $added = $desired > 0.0
                && self::validateEmployerRothAvailability($context, $account, $traits, $diagnostics)
                ? self::takeAcrossPools(
                    $context,
                    [['annualAdditionsPools', $groupId]],
                    $desired,
                    $sharedLimits,
                )
                : 0.0;
            if ($added > 0.0) {
                self::addEmployerContribution($account, $traits, $annual, $additional, $added);
            }
        }
        if (!empty($account['planRules']['permitsAfterTaxEmployeeContributions'])) {
            $desiredAfterTax = self::minMoney(
                self::poolRemaining($context['annualAdditionsPools'][$groupId]),
                self::nonnegative($accountAnnualLimit - self::annualAdditions($annual)),
            );
            if ($desiredAfterTax > 0.0) {
                $added = self::takeAcrossPools(
                    $context,
                    [['annualAdditionsPools', $groupId]],
                    $desiredAfterTax,
                    $sharedLimits,
                );
                $additional['employeeAfterTax'] = $added;
                $annual['employeeAfterTax'] = self::roundMoney($annual['employeeAfterTax'] + $added);
            }
        }
        $planTermDependentCapacity = 0.0;
        if (!$employer['known'] && empty($account['planRules']['permitsAfterTaxEmployeeContributions'])) {
            $planTermDependentCapacity = self::minMoney(
                self::poolRemaining($context['annualAdditionsPools'][$groupId]),
                self::nonnegative($accountAnnualLimit - self::annualAdditions($annual)),
            );
            $diagnostics[] = self::diagnostic(
                'EMPLOYER_CONTRIBUTION_REQUIRES_PLAN_FORMULA',
                DiagnosticSeverity::WARNING,
                "The Code-level annual-additions ceiling is known, but the usable contribution requires the plan's employer contribution formula or voluntary after-tax contribution terms.",
                "accounts.{$account['id']}.planRules",
            );
        }
        return [
            'status' => self::accountStatusFromDiagnostics(CalculationStatus::DETERMINATE->value, $diagnostics),
            'statutoryMaximum' => $accountAnnualLimit,
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => $planTermDependentCapacity,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $account
     *  @param array<string,mixed> $traits
     *  @return array<string,mixed>
     */
    private static function allocateSection457(array &$context, array $account, array $traits): array
    {
        $diagnostics = [];
        $sharedLimits = [];
        $annual = $account['existingContributions'];
        $additional = self::zeroComponents();
        $ownerId = $account['ownerId'];
        $person = $context['persons'][$ownerId];
        $statutoryBase = $context['parameters']['section457b']['baseDeferralLimit'];
        $compensationFraction = $context['parameters']['section457b']['includibleCompensationFraction'];
        if (
            $statutoryBase === null
            || $compensationFraction === null
            || $context['section457BasePools'][$ownerId]['limit'] === null
        ) {
            $diagnostics[] = self::diagnostic(
                'SECTION_457_LIMIT_INDETERMINATE',
                DiagnosticSeverity::ERROR,
                "The 457(b) monetary deferral limit is not available for tax year {$context['taxYear']}.",
                "accounts.{$account['id']}",
            );
            self::reportPoolWithoutConsuming($context['section457BasePools'][$ownerId], $sharedLimits);
            return [
                'status' => CalculationStatus::INDETERMINATE->value,
                'statutoryMaximum' => null,
                'annualComponents' => $annual,
                'additionalComponents' => $additional,
                'planTermDependentCapacity' => 0.0,
                'sharedLimits' => $sharedLimits,
                'diagnostics' => $diagnostics,
            ];
        }
        $includibleCompensation = self::money(
            $account['planRules']['includibleCompensation457']
                ?? $account['planRules']['planCompensation']
                ?? self::planCompensation($account, $person),
            "{$account['id']}.includibleCompensation457",
        );
        $accountBaseLimit = self::minMoney(
            (float) $statutoryBase,
            $includibleCompensation * (float) $compensationFraction,
            $account['planRules']['planDocumentEmployeeDeferralLimit'] ?? (float) $statutoryBase,
        );
        $existingRegular = self::roundMoney(
            self::baseDeferrals($annual)
            + $annual['employeeAfterTax']
            + $annual['employerPreTax']
            + $annual['employerRoth'],
        );
        $expectedEmployer = self::money(
            $account['planRules']['expectedEmployerContribution'] ?? null,
            "{$account['id']}.expectedEmployerContribution",
        );
        $existingEmployer = self::roundMoney($annual['employerPreTax'] + $annual['employerRoth']);
        $employerDesired = self::minMoney(
            self::nonnegative($expectedEmployer - $existingEmployer),
            self::nonnegative($accountBaseLimit - $existingRegular),
        );
        if (
            $employerDesired > 0.0
            && self::validateEmployerRothAvailability($context, $account, $traits, $diagnostics)
        ) {
            $employerAdded = self::takeAcrossPools(
                $context,
                [['section457BasePools', $ownerId]],
                $employerDesired,
                $sharedLimits,
            );
            self::addEmployerContribution($account, $traits, $annual, $additional, $employerAdded);
        }
        $regularBeforeEmployee = self::roundMoney(
            self::baseDeferrals($annual)
            + $annual['employeeAfterTax']
            + $annual['employerPreTax']
            + $annual['employerRoth'],
        );
        $regularDesired = self::nonnegative($accountBaseLimit - $regularBeforeEmployee);
        $regularAdded = self::takeAcrossPools(
            $context,
            [['section457BasePools', $ownerId]],
            $regularDesired,
            $sharedLimits,
        );
        if (self::accountUsesRothEmployeeContributions($account, $traits)) {
            $additional['employeeRothDeferral'] = $regularAdded;
            $annual['employeeRothDeferral'] = self::roundMoney($annual['employeeRothDeferral'] + $regularAdded);
        } else {
            $additional['employeePreTaxDeferral'] = $regularAdded;
            $annual['employeePreTaxDeferral'] = self::roundMoney($annual['employeePreTaxDeferral'] + $regularAdded);
        }
        $compensationRemaining = self::nonnegative(
            $includibleCompensation
            - self::baseDeferrals($annual)
            - self::ageCatchUps($annual)
            - $annual['special457CatchUp']
            - $annual['employerPreTax']
            - $annual['employerRoth'],
        );
        $ageLimit = $traits['governmental457']
            ? self::accountPlanCatchUpLimit($context, $account, $traits)
            : 0.0;
        $existingAgeCatchUp = self::ageCatchUps($account['existingContributions']);
        $agePotential = self::minMoney(
            self::nonnegative($ageLimit - $existingAgeCatchUp),
            self::poolRemaining($context['section457CatchUpPools'][$ownerId]),
            $compensationRemaining,
        );
        $specialInput = $account['planRules']['section457SpecialCatchUp'] ?? null;
        $specialStatutoryExtra = is_array($specialInput) && !empty($specialInput['eligible'])
            ? self::minMoney(
                (float) $statutoryBase,
                self::money(
                    $specialInput['unusedDeferralsFromPriorYears'] ?? null,
                    "{$account['id']}.unused457Deferrals",
                ),
                self::poolRemaining($context['section457SpecialCatchUpPools'][$ownerId]),
                $compensationRemaining,
            )
            : 0.0;
        if ($specialStatutoryExtra > $agePotential) {
            $specialAdded = self::takeAcrossPools(
                $context,
                [['section457SpecialCatchUpPools', $ownerId]],
                $specialStatutoryExtra,
                $sharedLimits,
            );
            $additional['special457CatchUp'] = $specialAdded;
            $annual['special457CatchUp'] = self::roundMoney($annual['special457CatchUp'] + $specialAdded);
            if ($ageLimit > 0.0) {
                $diagnostics[] = self::diagnostic(
                    'SECTION_457_SPECIAL_CATCH_UP_SELECTED_OVER_AGE_CATCH_UP',
                    DiagnosticSeverity::INFO,
                    'The special last-three-years 457(b) catch-up produced the larger limit; it cannot be combined with the age-based catch-up.',
                    "accounts.{$account['id']}",
                );
            }
        } elseif ($agePotential > 0.0) {
            $treatment = self::catchUpTaxTreatment($context, $account, $traits, $diagnostics);
            if ($treatment === 'unknown') {
                self::reportPoolWithoutConsuming($context['section457CatchUpPools'][$ownerId], $sharedLimits);
            } elseif ($treatment !== 'unavailable') {
                $ageAdded = self::takeAcrossPools(
                    $context,
                    [['section457CatchUpPools', $ownerId]],
                    $agePotential,
                    $sharedLimits,
                );
                if ($treatment === 'roth') {
                    $additional['employeeRothCatchUp'] = $ageAdded;
                    $annual['employeeRothCatchUp'] = self::roundMoney($annual['employeeRothCatchUp'] + $ageAdded);
                } else {
                    $additional['employeePreTaxCatchUp'] = $ageAdded;
                    $annual['employeePreTaxCatchUp'] = self::roundMoney($annual['employeePreTaxCatchUp'] + $ageAdded);
                }
            }
        }
        if (!$traits['governmental457']) {
            $diagnostics[] = self::diagnostic(
                'NONGOVERNMENTAL_457B_ASSETS_REMAIN_EMPLOYER_PROPERTY',
                DiagnosticSeverity::INFO,
                "A nongovernmental tax-exempt 457(b) plan is generally unfunded; assets remain subject to the employer's general creditors.",
                "accounts.{$account['id']}",
            );
        }
        return [
            'status' => self::accountStatusFromDiagnostics(CalculationStatus::DETERMINATE->value, $diagnostics),
            'statutoryMaximum' => self::roundMoney($accountBaseLimit + max($ageLimit, $specialStatutoryExtra)),
            'annualComponents' => $annual,
            'additionalComponents' => $additional,
            'planTermDependentCapacity' => 0.0,
            'sharedLimits' => $sharedLimits,
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $account
     *  @return array<string,mixed>
     */
    private static function allocateDefinedBenefit(array $account): array
    {
        return self::emptyOutcome($account, CalculationStatus::INDETERMINATE->value, null, [
            self::diagnostic(
                'DEFINED_BENEFIT_CONTRIBUTION_REQUIRES_ACTUARIAL_VALUATION',
                DiagnosticSeverity::ERROR,
                'A defined-benefit or cash-balance contribution is determined by the plan formula, funding method, assets, assumptions, participant census, and minimum/maximum funding rules; it is not a single statutory contribution limit.',
                "accounts.{$account['id']}",
                'IRC 404, 412, 415(b); ERISA funding rules',
            ),
        ]);
    }

    /** @param array<string,mixed> $account
     *  @return array<string,mixed>
     */
    private static function allocateSection457f(array $account): array
    {
        return self::emptyOutcome($account, CalculationStatus::INDETERMINATE->value, null, [
            self::diagnostic(
                'SECTION_457F_HAS_NO_457B_ANNUAL_DEFERRAL_LIMIT',
                DiagnosticSeverity::ERROR,
                'A 457(f) arrangement is an ineligible deferred-compensation arrangement. Tax timing depends on substantial risk of forfeiture and plan terms rather than the 457(b) annual limit.',
                "accounts.{$account['id']}",
                'IRC 457(f)',
            ),
        ]);
    }

    /** @param list<array<string,mixed>> $conversions
     *  @param array<string,array<string,mixed>> $persons
     *  @param array<string,array<string,mixed>> $accountsById
     *  @return list<array<string,mixed>>
     */
    private static function normalizeConversions(array $conversions, array $persons, array $accountsById): array
    {
        $ids = [];
        $result = [];
        foreach ($conversions as $index => $input) {
            if (!is_array($input)) {
                throw new RetirementParameterException(
                    'INVALID_CONVERSION',
                    "conversions[{$index}] must be an object/associative array.",
                );
            }
            $id = trim((string) ($input['id'] ?? ''));
            if ($id === '') {
                throw new RetirementParameterException(
                    'CONVERSION_ID_REQUIRED',
                    "conversions[{$index}].id is required.",
                );
            }
            if (isset($ids[$id])) {
                throw new RetirementParameterException('DUPLICATE_CONVERSION_ID', "Duplicate conversion ID: {$id}");
            }
            $ids[$id] = true;
            $ownerId = (string) ($input['ownerId'] ?? '');
            if (!isset($persons[$ownerId])) {
                throw new RetirementParameterException(
                    'UNKNOWN_CONVERSION_OWNER',
                    "Conversion {$id} references unknown owner {$ownerId}.",
                );
            }
            if (isset($input['sourceAccountId']) && !isset($accountsById[$input['sourceAccountId']])) {
                throw new RetirementParameterException(
                    'UNKNOWN_CONVERSION_SOURCE_ACCOUNT',
                    "Conversion {$id} references unknown source account {$input['sourceAccountId']}.",
                );
            }
            $normalized = $input;
            $normalized['id'] = $id;
            $normalized['ownerId'] = $ownerId;
            $normalized['type'] = self::parseConversionType($input['type'] ?? '');
            $normalized['amount'] = self::money($input['amount'] ?? null, "conversions[{$index}].amount");
            foreach (
                ['afterTaxBasisInConvertedAmount', 'aggregateIraBasisOverride', 'yearEndAggregateIraValueOverride']
                as $key
            ) {
                if (array_key_exists($key, $input)) {
                    $normalized[$key] = self::money($input[$key], "conversions[{$index}].{$key}");
                }
            }
            $normalized['inputIndex'] = $index;
            $result[] = $normalized;
        }
        return $result;
    }

    /** @return array<string,mixed> */
    private static function conversionTaxEffects(float $taxableAmount): array
    {
        $result = self::zeroTaxEffects();
        $result['federalAgiIncrease'] = $taxableAmount;
        $result['taxableRothConversion'] = $taxableAmount;
        $result['notes'][] = 'A taxable Roth conversion generally increases federal gross income but does not consume an annual contribution limit.';
        return $result;
    }

    /** @param array<string,mixed> $conversion
     *  @return array<string,mixed>
     */
    private static function unavailableConversion(array $conversion, string $code, string $message): array
    {
        return [
            'conversionId' => $conversion['id'],
            'conversionType' => $conversion['type'],
            'ownerId' => $conversion['ownerId'],
            'status' => CalculationStatus::UNAVAILABLE->value,
            'grossConvertedAmount' => $conversion['amount'],
            'taxableAmount' => null,
            'nontaxableBasisAmount' => null,
            'consumesAnnualContributionLimit' => false,
            'federalTaxEffects' => self::zeroTaxEffects(),
            'diagnostics' => [self::diagnostic(
                $code,
                DiagnosticSeverity::ERROR,
                $message,
                "conversions.{$conversion['id']}",
            )],
        ];
    }

    /** @param array<string,mixed> $conversion
     *  @param list<array<string,mixed>> $diagnostics
     *  @return array<string,mixed>
     */
    private static function indeterminateConversion(array $conversion, array $diagnostics): array
    {
        return [
            'conversionId' => $conversion['id'],
            'conversionType' => $conversion['type'],
            'ownerId' => $conversion['ownerId'],
            'status' => CalculationStatus::INDETERMINATE->value,
            'grossConvertedAmount' => $conversion['amount'],
            'taxableAmount' => null,
            'nontaxableBasisAmount' => null,
            'consumesAnnualContributionLimit' => false,
            'federalTaxEffects' => self::zeroTaxEffects(),
            'diagnostics' => $diagnostics,
        ];
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $conversions
     *  @param list<array<string,mixed>> $accountResults
     *  @return list<array<string,mixed>>
     */
    private static function calculateConversions(
        array $context,
        array $conversions,
        array $accountResults,
    ): array {
        $results = [];
        $iraByOwner = [];
        foreach ($conversions as $conversion) {
            if ($conversion['type'] === ConversionType::IRA_TO_ROTH_IRA->value) {
                $iraByOwner[$conversion['ownerId']][] = $conversion;
            } else {
                $results[$conversion['id']] = self::calculateNonIraConversion($context, $conversion);
            }
        }
        foreach ($iraByOwner as $ownerId => $ownerConversions) {
            foreach (self::calculateIraConversionGroup($context, $ownerId, $ownerConversions, $accountResults) as $result) {
                $results[$result['conversionId']] = $result;
            }
        }
        return array_map(
            static fn (array $conversion): array => $results[$conversion['id']],
            $conversions,
        );
    }

    /** @param array<string,mixed> $context
     *  @param array<string,mixed> $conversion
     *  @return array<string,mixed>
     */
    private static function calculateNonIraConversion(array $context, array $conversion): array
    {
        if ($conversion['type'] === ConversionType::QUALIFIED_PLAN_TO_ROTH_IRA->value) {
            if ($context['taxYear'] < 2008) {
                return self::unavailableConversion(
                    $conversion,
                    'DIRECT_QUALIFIED_PLAN_TO_ROTH_IRA_NOT_AVAILABLE',
                    'A direct qualified-plan rollover to a Roth IRA is modeled as available beginning in 2008.',
                );
            }
            $basis = self::minMoney(
                $conversion['amount'],
                self::money(
                    $conversion['afterTaxBasisInConvertedAmount'] ?? null,
                    "{$conversion['id']}.afterTaxBasisInConvertedAmount",
                ),
            );
            $taxable = self::roundMoney($conversion['amount'] - $basis);
            return [
                'conversionId' => $conversion['id'],
                'conversionType' => $conversion['type'],
                'ownerId' => $conversion['ownerId'],
                'status' => CalculationStatus::DETERMINATE->value,
                'grossConvertedAmount' => $conversion['amount'],
                'taxableAmount' => $taxable,
                'nontaxableBasisAmount' => $basis,
                'consumesAnnualContributionLimit' => false,
                'federalTaxEffects' => self::conversionTaxEffects($taxable),
                'diagnostics' => [],
            ];
        }
        if ($context['taxYear'] < 2010) {
            return self::unavailableConversion(
                $conversion,
                'IN_PLAN_ROTH_ROLLOVER_NOT_AVAILABLE',
                'In-plan Roth rollovers are modeled as available beginning in 2010.',
            );
        }
        if (empty($conversion['sourceAccountId'])) {
            return self::indeterminateConversion($conversion, [self::diagnostic(
                'SOURCE_ACCOUNT_REQUIRED_FOR_IN_PLAN_ROTH_ROLLOVER',
                DiagnosticSeverity::ERROR,
                'sourceAccountId is required to verify that the plan permits an in-plan Roth rollover.',
                "conversions.{$conversion['id']}.sourceAccountId",
            )]);
        }
        $source = $context['accountsById'][$conversion['sourceAccountId']];
        if (empty($source['planRules']['permitsInPlanRothRollover'])) {
            return self::indeterminateConversion($conversion, [self::diagnostic(
                'PLAN_DOES_NOT_PERMIT_IN_PLAN_ROTH_ROLLOVER',
                DiagnosticSeverity::ERROR,
                'The supplied source plan rules do not permit an in-plan Roth rollover.',
                "accounts.{$source['id']}.planRules.permitsInPlanRothRollover",
            )]);
        }
        if ($context['taxYear'] < 2013 && ($conversion['otherwiseDistributableAmount'] ?? false) !== true) {
            return self::unavailableConversion(
                $conversion,
                'PRE_2013_IN_PLAN_ROLLOVER_REQUIRES_DISTRIBUTABLE_AMOUNT',
                'For 2010-2012, the modeled in-plan Roth rollover amount must otherwise have been distributable.',
            );
        }
        $basis = self::minMoney(
            $conversion['amount'],
            self::money(
                $conversion['afterTaxBasisInConvertedAmount'] ?? null,
                "{$conversion['id']}.afterTaxBasisInConvertedAmount",
            ),
        );
        $taxable = self::roundMoney($conversion['amount'] - $basis);
        return [
            'conversionId' => $conversion['id'],
            'conversionType' => $conversion['type'],
            'ownerId' => $conversion['ownerId'],
            'status' => CalculationStatus::DETERMINATE->value,
            'grossConvertedAmount' => $conversion['amount'],
            'taxableAmount' => $taxable,
            'nontaxableBasisAmount' => $basis,
            'consumesAnnualContributionLimit' => false,
            'federalTaxEffects' => self::conversionTaxEffects($taxable),
            'diagnostics' => [],
        ];
    }

    /** @param array<string,mixed> $context
     *  @param list<array<string,mixed>> $conversions
     *  @param list<array<string,mixed>> $accountResults
     *  @return list<array<string,mixed>>
     */
    private static function calculateIraConversionGroup(
        array $context,
        string $ownerId,
        array $conversions,
        array $accountResults,
    ): array {
        if ($context['taxYear'] < 1998) {
            return array_map(
                static fn (array $conversion): array => self::unavailableConversion(
                    $conversion,
                    'ROTH_IRA_CONVERSION_NOT_AVAILABLE',
                    'Roth IRA conversions are modeled as available beginning in 1998.',
                ),
                $conversions,
            );
        }
        $person = $context['persons'][$ownerId];
        if ($context['taxYear'] < 2010) {
            if (
                $context['filingStatus'] === FilingStatus::MARRIED_FILING_SEPARATELY->value
                && self::livedWithSpouse($person, $context['filingStatus'])
            ) {
                return array_map(
                    static fn (array $conversion): array => self::unavailableConversion(
                        $conversion,
                        'PRE_2010_MFS_ROTH_CONVERSION_NOT_ELIGIBLE',
                        'Before 2010, a married-filing-separately taxpayer who lived with a spouse during the year is modeled as ineligible for a Roth IRA conversion.',
                    ),
                    $conversions,
                );
            }
            if (!array_key_exists('rothConversion', $person['magi'])) {
                return array_map(
                    static fn (array $conversion): array => self::indeterminateConversion($conversion, [
                        self::diagnostic(
                            'PRE_2010_CONVERSION_MAGI_REQUIRED',
                            DiagnosticSeverity::ERROR,
                            'Pre-conversion MAGI is required to apply the pre-2010 $100,000 Roth-conversion eligibility limit.',
                            "persons.{$conversion['ownerId']}.magi.rothConversion",
                        ),
                    ]),
                    $conversions,
                );
            }
            if ((float) $person['magi']['rothConversion'] > 100000.0) {
                return array_map(
                    static fn (array $conversion): array => self::unavailableConversion(
                        $conversion,
                        'PRE_2010_ROTH_CONVERSION_MAGI_LIMIT_EXCEEDED',
                        'The modeled pre-2010 $100,000 MAGI limit for Roth IRA conversions was exceeded.',
                    ),
                    $conversions,
                );
            }
        }
        $currentNondeductible = 0.0;
        $unclassified = 0.0;
        foreach ($accountResults as $result) {
            if ($result['ownerId'] !== $ownerId) {
                continue;
            }
            $currentNondeductible += (float) $result['contributionComponents']['nondeductibleIra'];
            $unclassified += (float) $result['contributionComponents']['unclassifiedIra'];
        }
        if ($unclassified > 0.0) {
            return array_map(
                static fn (array $conversion): array => self::indeterminateConversion($conversion, [
                    self::diagnostic(
                        'IRA_CONVERSION_BASIS_INDETERMINATE_FROM_UNCLASSIFIED_CONTRIBUTION',
                        DiagnosticSeverity::ERROR,
                        "A current-year traditional IRA contribution has unresolved deductibility, so aggregate IRA basis and the conversion's taxable amount are indeterminate.",
                        "conversions.{$conversion['id']}",
                    ),
                ]),
                $conversions,
            );
        }
        $firstBasisOverride = null;
        $basisOverrideFound = false;
        $firstValueOverride = null;
        $valueOverrideFound = false;
        foreach ($conversions as $conversion) {
            if (!$basisOverrideFound && array_key_exists('aggregateIraBasisOverride', $conversion)) {
                $firstBasisOverride = (float) $conversion['aggregateIraBasisOverride'];
                $basisOverrideFound = true;
            }
            if (!$valueOverrideFound && array_key_exists('yearEndAggregateIraValueOverride', $conversion)) {
                $firstValueOverride = (float) $conversion['yearEndAggregateIraValueOverride'];
                $valueOverrideFound = true;
            }
        }
        $priorBasis = $basisOverrideFound
            ? $firstBasisOverride
            : ($person['traditionalSepSimpleIraBasis'] ?? null);
        $yearEndValue = $valueOverrideFound
            ? $firstValueOverride
            : ($person['yearEndTraditionalSepSimpleIraValue'] ?? null);
        if ($priorBasis === null || $yearEndValue === null) {
            return array_map(
                static fn (array $conversion): array => self::indeterminateConversion($conversion, [
                    self::diagnostic(
                        'AGGREGATE_IRA_BASIS_AND_YEAR_END_VALUE_REQUIRED',
                        DiagnosticSeverity::ERROR,
                        'Aggregate traditional/SEP/SIMPLE IRA basis and December 31 value are required for the Form 8606 pro-rata calculation; explicitly provide zero when applicable.',
                        "persons.{$conversion['ownerId']}",
                        'Form 8606',
                    ),
                ]),
                $conversions,
            );
        }
        $inconsistent = false;
        foreach ($conversions as $conversion) {
            if (
                array_key_exists('aggregateIraBasisOverride', $conversion)
                && (float) $conversion['aggregateIraBasisOverride'] !== $firstBasisOverride
            ) {
                $inconsistent = true;
            }
            if (
                array_key_exists('yearEndAggregateIraValueOverride', $conversion)
                && (float) $conversion['yearEndAggregateIraValueOverride'] !== $firstValueOverride
            ) {
                $inconsistent = true;
            }
        }
        if ($inconsistent) {
            return array_map(
                static fn (array $conversion): array => self::indeterminateConversion($conversion, [
                    self::diagnostic(
                        'INCONSISTENT_AGGREGATE_IRA_OVERRIDES',
                        DiagnosticSeverity::ERROR,
                        'All IRA conversions for one owner must use the same aggregate basis and year-end IRA value overrides.',
                        "conversions.{$conversion['id']}",
                    ),
                ]),
                $conversions,
            );
        }
        $totalConversion = self::roundMoney(array_sum(array_column($conversions, 'amount')));
        $otherDistributions = self::money(
            $person['otherTraditionalSepSimpleIraDistributions'] ?? null,
            "{$ownerId}.otherTraditionalSepSimpleIraDistributions",
        );
        $denominator = self::roundMoney((float) $yearEndValue + $totalConversion + $otherDistributions);
        $availableBasis = self::minMoney($denominator, self::roundMoney((float) $priorBasis + $currentNondeductible));
        $nontaxableRatio = $denominator > 0.0 ? $availableBasis / $denominator : 0.0;
        $aggregateNontaxable = self::minMoney(
            $totalConversion,
            self::roundMoney($totalConversion * $nontaxableRatio),
        );
        $totalConversionCents = (int) round($totalConversion * 100);
        $targetNontaxableCents = (int) round($aggregateNontaxable * 100);
        $allocations = [];
        foreach ($conversions as $index => $conversion) {
            $amountCents = (int) round((float) $conversion['amount'] * 100);
            $rawCents = $totalConversionCents > 0
                ? ($amountCents * $targetNontaxableCents) / $totalConversionCents
                : 0.0;
            $floorCents = min($amountCents, (int) floor($rawCents));
            $allocations[$index] = [
                'index' => $index,
                'amountCents' => $amountCents,
                'cents' => $floorCents,
                'remainder' => $rawCents - $floorCents,
            ];
        }
        $residualCents = $targetNontaxableCents - array_sum(array_column($allocations, 'cents'));
        $allocationOrder = array_keys($allocations);
        usort($allocationOrder, static function (int $left, int $right) use ($allocations): int {
            $remainderComparison = $allocations[$right]['remainder'] <=> $allocations[$left]['remainder'];
            return $remainderComparison !== 0 ? $remainderComparison : ($left <=> $right);
        });
        foreach ($allocationOrder as $index) {
            if ($residualCents <= 0) {
                break;
            }
            if ($allocations[$index]['cents'] < $allocations[$index]['amountCents']) {
                $allocations[$index]['cents']++;
                $residualCents--;
            }
        }
        $results = [];
        foreach ($conversions as $index => $conversion) {
            $nontaxable = self::roundMoney($allocations[$index]['cents'] / 100);
            $taxable = self::roundMoney($conversion['amount'] - $nontaxable);
            $diagnostics = [];
            if ($context['taxYear'] === 2010) {
                $diagnostics[] = self::diagnostic(
                    '2010_SPECIAL_INCOME_INCLUSION_ELECTION_NOT_MODELED',
                    DiagnosticSeverity::INFO,
                    'The optional special timing rule for income from certain 2010 Roth conversions is outside this contribution-limit engine; the result reports total taxable conversion income.',
                    "conversions.{$conversion['id']}",
                );
            }
            $results[] = [
                'conversionId' => $conversion['id'],
                'conversionType' => $conversion['type'],
                'ownerId' => $conversion['ownerId'],
                'status' => CalculationStatus::DETERMINATE->value,
                'grossConvertedAmount' => $conversion['amount'],
                'taxableAmount' => $taxable,
                'nontaxableBasisAmount' => $nontaxable,
                'consumesAnnualContributionLimit' => false,
                'federalTaxEffects' => self::conversionTaxEffects($taxable),
                'diagnostics' => $diagnostics,
            ];
        }
        return $results;
    }

    /** @param list<array<string,mixed>> $accounts
     *  @param list<array<string,mixed>> $conversions
     *  @return array<string,float>
     */
    private static function totals(array $accounts, array $conversions): array
    {
        $totals = [
            'maximumAnnualContributionBasedOnInputs' => 0.0,
            'maximumAdditionalContributionBasedOnInputs' => 0.0,
            'employeePreTaxContribution' => 0.0,
            'employeeRothOrAfterTaxContribution' => 0.0,
            'employerPreTaxContribution' => 0.0,
            'employerRothContribution' => 0.0,
            'deductibleIraContribution' => 0.0,
            'nondeductibleIraContribution' => 0.0,
            'federalAgiReduction' => 0.0,
            'federalAgiIncrease' => 0.0,
            'taxableRothConversions' => 0.0,
        ];
        foreach ($accounts as $account) {
            $components = $account['contributionComponents'];
            $totals['maximumAnnualContributionBasedOnInputs'] = self::roundMoney(
                $totals['maximumAnnualContributionBasedOnInputs']
                + (float) ($account['maximumAnnualContributionBasedOnInputs'] ?? 0.0),
            );
            $totals['maximumAdditionalContributionBasedOnInputs'] = self::roundMoney(
                $totals['maximumAdditionalContributionBasedOnInputs']
                + (float) ($account['maximumAdditionalContributionBasedOnInputs'] ?? 0.0),
            );
            $totals['employeePreTaxContribution'] = self::roundMoney(
                $totals['employeePreTaxContribution']
                + $components['employeePreTaxDeferral']
                + $components['employeePreTaxCatchUp']
                + $components['special403bCatchUp']
                + $components['special457CatchUp'],
            );
            $totals['employeeRothOrAfterTaxContribution'] = self::roundMoney(
                $totals['employeeRothOrAfterTaxContribution']
                + $components['employeeRothDeferral']
                + $components['employeeRothCatchUp']
                + $components['employeeAfterTax']
                + $components['rothIra']
                + $components['nondeductibleIra']
                + $components['unclassifiedIra'],
            );
            $totals['employerPreTaxContribution'] = self::roundMoney(
                $totals['employerPreTaxContribution'] + $components['employerPreTax'],
            );
            $totals['employerRothContribution'] = self::roundMoney(
                $totals['employerRothContribution'] + $components['employerRoth'],
            );
            $totals['deductibleIraContribution'] = self::roundMoney(
                $totals['deductibleIraContribution'] + $components['deductibleIra'],
            );
            $totals['nondeductibleIraContribution'] = self::roundMoney(
                $totals['nondeductibleIraContribution']
                + $components['nondeductibleIra']
                + $components['unclassifiedIra'],
            );
            $totals['federalAgiReduction'] = self::roundMoney(
                $totals['federalAgiReduction'] + $account['federalTaxEffects']['federalAgiReduction'],
            );
            $totals['federalAgiIncrease'] = self::roundMoney(
                $totals['federalAgiIncrease'] + $account['federalTaxEffects']['federalAgiIncrease'],
            );
        }
        foreach ($conversions as $conversion) {
            $totals['federalAgiIncrease'] = self::roundMoney(
                $totals['federalAgiIncrease'] + $conversion['federalTaxEffects']['federalAgiIncrease'],
            );
            $totals['taxableRothConversions'] = self::roundMoney(
                $totals['taxableRothConversions'] + (float) ($conversion['taxableAmount'] ?? 0.0),
            );
        }
        return $totals;
    }
}
