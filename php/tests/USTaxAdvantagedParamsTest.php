<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/USTaxAdvantagedParams.php';

use USTaxAdvantagedParams\AccountType;
use USTaxAdvantagedParams\CalculationStatus;
use USTaxAdvantagedParams\ConversionType;
use USTaxAdvantagedParams\FilingStatus;
use USTaxAdvantagedParams\AccountBuilder;
use USTaxAdvantagedParams\ParameterException;
use USTaxAdvantagedParams\ScenarioBuilder;
use USTaxAdvantagedParams\USTaxAdvantagedParams as U;
use USTaxAdvantagedParams\UnsupportedTaxYearException;

/** @var array<string,Closure():void> $tests */
$tests = [];

function test(string $name, Closure $body): void
{
    global $tests;
    $tests[$name] = $body;
}

function failTest(string $message): never
{
    throw new RuntimeException($message);
}

function assertSameValue(mixed $expected, mixed $actual, string $message = ''): void
{
    if (is_float($expected) || is_float($actual)) {
        if (is_numeric($expected) && is_numeric($actual) && abs((float) $expected - (float) $actual) < 0.005) {
            return;
        }
    }
    if ($expected !== $actual) {
        failTest(($message !== '' ? $message . ': ' : '')
            . 'expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}

function assertTrue(bool $condition, string $message = 'assertion failed'): void
{
    if (!$condition) {
        failTest($message);
    }
}

/** @param array<string,mixed> $result
 *  @return array<string,mixed>
 */
function accountResult(array $result, string $id): array
{
    foreach ($result['accounts'] as $account) {
        if ($account['accountId'] === $id) {
            return $account;
        }
    }
    failTest("Missing account result {$id}");
}

/** @param list<array<string,mixed>> $diagnostics */
function hasDiagnostic(array $diagnostics, string $code): bool
{
    foreach ($diagnostics as $diagnostic) {
        if (($diagnostic['code'] ?? null) === $code) {
            return true;
        }
    }
    return false;
}

/** @param list<array<string,mixed>> $persons
 *  @param list<array<string,mixed>> $accounts
 *  @param list<array<string,mixed>> $conversions
 *  @return array<string,mixed>
 */
function scenario(
    int $year,
    array $persons,
    array $accounts = [],
    string $filingStatus = 'S',
    array $conversions = [],
): array {
    return U::calculate([
        'taxYear' => $year,
        'filingStatus' => $filingStatus,
        'persons' => $persons,
        'accounts' => $accounts,
        'conversions' => $conversions,
    ]);
}

test('supports 1975 through 2026 without extrapolation', function (): void {
    assertSameValue(['minimum' => 1975, 'maximum' => 2026], U::supportedTaxYears());
    assertSameValue(1500, U::parametersForYear(1975)['ira']['baseContributionLimit']);
    assertSameValue(7500, U::parametersForYear(2026)['ira']['baseContributionLimit']);
    assertSameValue([
        'annualLimit' => 3000,
        'lifetimeLimit' => 15000,
        'serviceLimitPerYear' => 5000,
    ], U::parametersForYear(2026)['special403b15YearCatchUp']);
    try {
        U::parametersForYear(2027);
        failTest('Expected UnsupportedTaxYearException');
    } catch (UnsupportedTaxYearException) {
    }
});

test('exposes the IRC 414(q), 416(i) and 25B figures from the first year each has one', function (): void {
    // Notice 96-55: the IRC 414(q)(1)(B) threshold "as amended by the Small
    // Business Job Protection Act of 1996, is $80,000" for 1997.
    assertSameValue(null, U::parametersForYear(1996)['highlyCompensatedEmployeeCompensation414q']);
    assertSameValue(80000, U::parametersForYear(1997)['highlyCompensatedEmployeeCompensation414q']);
    // Pub. L. 107-16 section 613 inserts the $130,000 officer threshold for years
    // beginning after December 31, 2001.
    assertSameValue(null, U::parametersForYear(2001)['keyEmployeeOfficerCompensation416i']);
    assertSameValue(130000, U::parametersForYear(2002)['keyEmployeeOfficerCompensation416i']);
    // Pub. L. 107-16 section 618 enacts IRC 25B for taxable years beginning after
    // December 31, 2001, with a fixed head-of-household column of $22,500 / $24,375 / $37,500.
    assertSameValue(null, U::parametersForYear(2001)['saversCredit25B']);
    assertSameValue(
        ['fiftyPercent' => 22500, 'twentyPercent' => 24375, 'tenPercent' => 37500],
        U::parametersForYear(2002)['saversCredit25B']['adjustedGrossIncomeLimits']['headOfHousehold'],
    );
    // Notice 2025-67 for 2026: the HCE threshold "remains $160,000", the key
    // employee threshold "is increased from $230,000 to $235,000", and the IRC
    // 25B(b) ceilings are increased to $48,500 / $52,500 / $80,500 on a joint return,
    // $36,375 / $39,375 / $60,375 for a head of household and $24,250 / $26,250 / $40,250
    // for all other taxpayers.
    $row2026 = U::parametersForYear(2026);
    assertSameValue(160000, $row2026['highlyCompensatedEmployeeCompensation414q']);
    assertSameValue(235000, $row2026['keyEmployeeOfficerCompensation416i']);
    assertSameValue([
        'adjustedGrossIncomeLimits' => [
            'jointReturn' => ['fiftyPercent' => 48500, 'twentyPercent' => 52500, 'tenPercent' => 80500],
            'headOfHousehold' => ['fiftyPercent' => 36375, 'twentyPercent' => 39375, 'tenPercent' => 60375],
            'allOtherTaxpayers' => ['fiftyPercent' => 24250, 'twentyPercent' => 26250, 'tenPercent' => 40250],
        ],
        // IRC 25B(d)(1)(B), as rewritten by Pub. L. 119-21 section 70116(a)(1), counts
        // retirement contributions only for taxable years beginning before January 1, 2027.
        'retirementPlanAndIraContributionsQualify' => true,
    ], $row2026['saversCredit25B']);
});

test('normalizes common aliases', function (): void {
    assertSameValue(FilingStatus::SINGLE->value, U::normalizeFilingStatus('S'));
    assertSameValue(FilingStatus::MARRIED_FILING_JOINTLY->value, U::normalizeFilingStatus('MFJ'));
    assertSameValue(FilingStatus::HEAD_OF_HOUSEHOLD->value, U::normalizeFilingStatus('HOH'));
    assertSameValue(AccountType::TRADITIONAL_401K->value, U::normalizeAccountType('401(k)'));
    assertSameValue(AccountType::GOVERNMENTAL_457B->value, U::normalizeAccountType('457b'));
});

test('builder pattern calculates an ordinary 2026 401k', function (): void {
    $result = ScenarioBuilder::forTaxYear(2026)
        ->filingStatus('S')
        ->taxpayer('t', static fn ($person) => $person->bornIn(1980)->w2Compensation(200000))
        ->account('k', 't', '401k', static fn (AccountBuilder $plan) =>
            $plan->employer('e')->planCompensation(200000))
        ->calculate();
    $k = accountResult($result, 'k');
    assertSameValue(72000, $k['statutoryMaximumAnnualContribution']);
    assertSameValue(24500, $k['maximumAnnualContributionBasedOnInputs']);
    assertSameValue(47500, $k['planTermDependentCapacity']);
    assertSameValue(CalculationStatus::DETERMINATE_WITH_ASSUMPTIONS->value, $k['status']);
});

test('2026 age 60 to 63 high wage catch-up is Roth', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1965,
        'compensation' => ['w2Compensation' => 250000],
        'priorYearFicaWagesByEmployer' => ['e' => 150001],
    ]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e',
        'planRules' => [
            'planCompensation' => 250000,
            'permitsRothContributions' => true,
            'permitsRothCatchUp' => true,
        ],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(24500, $k['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(11250, $k['contributionComponents']['employeeRothCatchUp']);
    assertSameValue(0, $k['contributionComponents']['employeePreTaxCatchUp']);
    assertSameValue(35750, $k['maximumAnnualContributionBasedOnInputs']);
});

test('reports the quantified amount of an existing contribution above an account ceiling', function (): void {
    $result = scenario(2026, [[
        'id' => 't',
        'birthYear' => 1980,
        'compensation' => ['iraCompensation' => 50000],
        'coveredByEmployerRetirementPlan' => false,
        'magi' => ['traditionalIraDeduction' => 50000, 'rothIra' => 50000],
    ]], [[
        'id' => 'ira',
        'ownerId' => 't',
        'type' => 'traditional_ira',
        'existingContributions' => ['deductibleIra' => 20000],
    ]]);
    // IRC 219(b)(5)(A)'s 2026 $7,500 limit leaves $12,500 excessive.
    assertSameValue(12500, accountResult($result, 'ira')['excessContribution']);
});

test('high wage catch-up is unavailable without plan Roth catch-up', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1965,
        'compensation' => ['w2Compensation' => 250000],
        'priorYearFicaWagesByEmployer' => ['e' => 200000],
    ]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 250000],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(24500, $k['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(0, $k['contributionComponents']['employeePreTaxCatchUp']);
    assertSameValue(0, $k['contributionComponents']['employeeRothCatchUp']);
    assertTrue(hasDiagnostic($k['diagnostics'], 'HIGH_WAGE_CATCH_UP_REQUIRES_ROTH_BUT_PLAN_DOES_NOT_OFFER_IT'));
});

test('Roth IRA MFJ phase-out', function (): void {
    $result = scenario(2026, [
        ['id' => 't', 'role' => 'taxpayer', 'birthYear' => 1980, 'compensation' => ['iraCompensation' => 100000], 'magi' => ['rothIra' => 247000], 'coveredByEmployerRetirementPlan' => false],
        ['id' => 's', 'role' => 'spouse', 'birthYear' => 1980, 'compensation' => ['iraCompensation' => 100000], 'magi' => ['rothIra' => 247000], 'coveredByEmployerRetirementPlan' => false],
    ], [['id' => 'roth', 'ownerId' => 't', 'type' => 'roth_ira']], 'MFJ');
    assertSameValue(3750, accountResult($result, 'roth')['contributionComponents']['rothIra']);
});

test('traditional IRA deduction phases out without reducing total contribution', function (): void {
    $result = scenario(2026, [
        ['id' => 't', 'role' => 'taxpayer', 'birthYear' => 1980, 'compensation' => ['iraCompensation' => 100000], 'magi' => ['traditionalIraDeduction' => 139000], 'coveredByEmployerRetirementPlan' => true],
        ['id' => 's', 'role' => 'spouse', 'birthYear' => 1980, 'compensation' => ['iraCompensation' => 100000], 'coveredByEmployerRetirementPlan' => false],
    ], [['id' => 'ira', 'ownerId' => 't', 'type' => 'traditional_ira']], 'MFJ');
    $ira = accountResult($result, 'ira');
    assertSameValue(3750, $ira['contributionComponents']['deductibleIra']);
    assertSameValue(3750, $ira['contributionComponents']['nondeductibleIra']);
    assertSameValue(7500, $ira['maximumAnnualContributionBasedOnInputs']);
});

test('traditional and Roth IRA share owner pool', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1980,
        'compensation' => ['iraCompensation' => 100000],
        'magi' => ['rothIra' => 158000, 'traditionalIraDeduction' => 50000],
        'coveredByEmployerRetirementPlan' => false,
    ]], [
        ['id' => 'roth', 'ownerId' => 't', 'type' => 'roth_ira', 'priority' => 1],
        ['id' => 'traditional', 'ownerId' => 't', 'type' => 'traditional_ira', 'priority' => 2],
    ]);
    assertSameValue(5000, accountResult($result, 'roth')['contributionComponents']['rothIra']);
    assertSameValue(2500, accountResult($result, 'traditional')['contributionComponents']['deductibleIra']);
});

test('401k and 457b limits are separate', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 200000]]], [
        ['id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'private', 'planRules' => ['planCompensation' => 200000]],
        ['id' => 'g457', 'ownerId' => 't', 'type' => '457b', 'employerId' => 'government', 'planRules' => ['includibleCompensation457' => 200000]],
    ]);
    assertSameValue(24500, accountResult($result, 'k')['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(24500, accountResult($result, 'g457')['contributionComponents']['employeePreTaxDeferral']);
});

test('two 401k plans share 402g and retain separate 415c groups', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 300000]]], [
        ['id' => 'first', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'a', 'priority' => 1, 'planRules' => ['planCompensation' => 150000]],
        ['id' => 'second', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'b', 'priority' => 2, 'planRules' => ['planCompensation' => 150000]],
    ]);
    assertSameValue(24500, accountResult($result, 'first')['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(0, accountResult($result, 'second')['contributionComponents']['employeePreTaxDeferral']);
});

test('mega backdoor fills remaining 415c space', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 200000]]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 200000, 'expectedEmployerContribution' => 10000, 'permitsAfterTaxEmployeeContributions' => true],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(24500, $k['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(10000, $k['contributionComponents']['employerPreTax']);
    assertSameValue(37500, $k['contributionComponents']['employeeAfterTax']);
    assertSameValue(72000, $k['maximumAnnualContributionBasedOnInputs']);
});

test('self employed solo 401k uses 20 percent equivalent rate', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['selfEmploymentNetEarnings' => 200000]]], [[
        'id' => 'solo', 'ownerId' => 't', 'type' => 'solo_401k',
        'planRules' => ['isSelfEmployedOwner' => true, 'netEarningsFromSelfEmploymentAfterHalfSETax' => 200000, 'planCompensation' => 200000, 'permitsAfterTaxEmployeeContributions' => true],
    ]]);
    $solo = accountResult($result, 'solo');
    assertSameValue(24500, $solo['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(40000, $solo['contributionComponents']['employerPreTax']);
    assertSameValue(7500, $solo['contributionComponents']['employeeAfterTax']);
});

test('self employed SEP uses 20 percent equivalent rate', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['selfEmploymentNetEarnings' => 200000]]], [[
        'id' => 'sep', 'ownerId' => 't', 'type' => 'sep_ira',
        'planRules' => ['isSelfEmployedOwner' => true, 'netEarningsFromSelfEmploymentAfterHalfSETax' => 200000, 'planCompensation' => 200000],
    ]]);
    assertSameValue(40000, accountResult($result, 'sep')['contributionComponents']['employerPreTax']);
});

test('403b 15-year catch-up', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 200000]]], [[
        'id' => 'b', 'ownerId' => 't', 'type' => '403b', 'employerId' => 'school',
        'planRules' => ['planCompensation' => 200000, 'special403bCatchUp' => ['eligible' => true, 'yearsOfService' => 15, 'priorElectiveDeferrals' => 20000, 'priorSpecialCatchUpUsed' => 0]],
    ]]);
    $b = accountResult($result, 'b');
    assertSameValue(24500, $b['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(3000, $b['contributionComponents']['special403bCatchUp']);
});

test('457b special catch-up selected when larger', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1970,
        'compensation' => ['w2Compensation' => 150000],
        'priorYearFicaWagesByEmployer' => ['gov' => 100000],
    ]], [[
        'id' => 'g457', 'ownerId' => 't', 'type' => 'governmental_457b', 'employerId' => 'gov',
        'planRules' => ['includibleCompensation457' => 150000, 'section457SpecialCatchUp' => ['eligible' => true, 'unusedDeferralsFromPriorYears' => 30000]],
    ]]);
    $g = accountResult($result, 'g457');
    assertSameValue(24500, $g['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(24500, $g['contributionComponents']['special457CatchUp']);
    assertSameValue(49000, $g['maximumAnnualContributionBasedOnInputs']);
});

test('1994 historical limits', function (): void {
    $result = scenario(1994, [['id' => 't', 'birthYear' => 1960, 'compensation' => ['w2Compensation' => 100000]]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e', 'planRules' => ['planCompensation' => 100000],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(9240, $k['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(25000, $k['statutoryMaximumAnnualContribution']);
});

test('1985 401k is indeterminate', function (): void {
    $result = scenario(1985, [['id' => 't', 'birthYear' => 1950, 'compensation' => ['w2Compensation' => 100000]]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e', 'planRules' => ['planCompensation' => 100000],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(CalculationStatus::INDETERMINATE->value, $k['status']);
    assertSameValue(null, $k['statutoryMaximumAnnualContribution']);
});

test('1981 active participant is ineligible for IRA', function (): void {
    $result = scenario(1981, [['id' => 't', 'birthYear' => 1950, 'compensation' => ['iraCompensation' => 20000], 'coveredByEmployerRetirementPlan' => true]], [[
        'id' => 'ira', 'ownerId' => 't', 'type' => 'traditional_ira',
    ]]);
    $ira = accountResult($result, 'ira');
    assertSameValue(0, $ira['maximumAnnualContributionBasedOnInputs']);
    assertSameValue(CalculationStatus::INELIGIBLE->value, $ira['status']);
});

test('1982 one earner spousal IRA allows 2000 to the spousal account when the worker contributes nothing', function (): void {
    // IRC 219(c)(2) (ERTA 1981): min(2250, compensation) minus the working
    // spouse's own-IRA deduction, never more than 2000 to the spousal account.
    $result = scenario(1982, [
        ['id' => 't', 'role' => 'taxpayer', 'birthYear' => 1950, 'compensation' => ['iraCompensation' => 20000], 'coveredByEmployerRetirementPlan' => true],
        ['id' => 's', 'role' => 'spouse', 'birthYear' => 1950, 'compensation' => ['iraCompensation' => 0], 'coveredByEmployerRetirementPlan' => false],
    ], [['id' => 'spouse-ira', 'ownerId' => 's', 'type' => 'traditional_ira']], 'MFJ');
    assertSameValue(2000, accountResult($result, 'spouse-ira')['contributionComponents']['deductibleIra']);
});

test('1982 one earner spousal IRA is limited to the 2250 household residue after the worker uses 2000', function (): void {
    $result = scenario(1982, [
        ['id' => 't', 'role' => 'taxpayer', 'birthYear' => 1950, 'compensation' => ['iraCompensation' => 20000], 'coveredByEmployerRetirementPlan' => true],
        ['id' => 's', 'role' => 'spouse', 'birthYear' => 1950, 'compensation' => ['iraCompensation' => 0], 'coveredByEmployerRetirementPlan' => false],
    ], [
        ['id' => 'own-ira', 'ownerId' => 't', 'type' => 'traditional_ira', 'existingContributions' => ['deductibleIra' => 2000]],
        ['id' => 'spouse-ira', 'ownerId' => 's', 'type' => 'traditional_ira'],
    ], 'MFJ');
    assertSameValue(250, accountResult($result, 'spouse-ira')['maximumAnnualContributionBasedOnInputs']);
});

test('2019 traditional IRA age 70.5 restriction', function (): void {
    $result = scenario(2019, [['id' => 't', 'birthDate' => '1948-01-01', 'compensation' => ['iraCompensation' => 100000], 'coveredByEmployerRetirementPlan' => false]], [[
        'id' => 'ira', 'ownerId' => 't', 'type' => 'traditional_ira',
    ]]);
    $ira = accountResult($result, 'ira');
    assertSameValue(CalculationStatus::INELIGIBLE->value, $ira['status']);
    assertSameValue(0, $ira['maximumAnnualContributionBasedOnInputs']);
});

test('IRA conversion applies Form 8606 pro rata basis', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1980,
        'traditionalSepSimpleIraBasis' => 20000,
        'yearEndTraditionalSepSimpleIraValue' => 80000,
        'otherTraditionalSepSimpleIraDistributions' => 0,
    ]], [], 'S', [[
        'id' => 'c', 'ownerId' => 't', 'type' => 'ira_to_roth_ira', 'amount' => 20000,
    ]]);
    $conversion = $result['conversions'][0];
    assertSameValue(4000, $conversion['nontaxableBasisAmount']);
    assertSameValue(16000, $conversion['taxableAmount']);
    assertSameValue(false, $conversion['consumesAnnualContributionLimit']);
});

test('in plan Roth rollover taxes pre-tax portion only', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 100000]]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => '401k', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 100000, 'permitsInPlanRothRollover' => true],
    ]], 'S', [[
        'id' => 'c', 'ownerId' => 't', 'type' => 'in_plan_roth_rollover', 'amount' => 50000,
        'sourceAccountId' => 'k', 'afterTaxBasisInConvertedAmount' => 10000,
    ]]);
    assertSameValue(40000, $result['conversions'][0]['taxableAmount']);
    assertSameValue(10000, $result['conversions'][0]['nontaxableBasisAmount']);
});

test('cash balance contribution remains indeterminate', function (): void {
    $result = scenario(2026, [['id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 200000]]], [[
        'id' => 'cb', 'ownerId' => 't', 'type' => 'cash_balance_plan', 'employerId' => 'e',
    ]]);
    $cb = accountResult($result, 'cb');
    assertSameValue(null, $cb['statutoryMaximumAnnualContribution']);
    assertSameValue(CalculationStatus::INDETERMINATE->value, $cb['status']);
});

test('2026 enhanced SIMPLE and age 60 to 63 catch-up', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1965,
        'compensation' => ['w2Compensation' => 100000],
        'priorYearFicaWagesByEmployer' => ['e' => 100000],
    ]], [[
        'id' => 'simple', 'ownerId' => 't', 'type' => 'simple_ira', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 100000, 'simpleEnhancedLimitEligible' => true, 'simpleEmployerContributionMethod' => 'match_3_percent'],
    ]]);
    $simple = accountResult($result, 'simple');
    assertSameValue(18100, $simple['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(5250, $simple['contributionComponents']['employeePreTaxCatchUp']);
    assertSameValue(3000, $simple['contributionComponents']['employerPreTax']);
    assertSameValue(26350, $simple['maximumAnnualContributionBasedOnInputs']);
});

test('self employed plan deduction excludes IRA deduction classification', function (): void {
    $result = scenario(2026, [[
        'id' => 't',
        'birthYear' => 1980,
        'compensation' => [
            'selfEmploymentNetEarnings' => 200000,
            'iraCompensation' => 200000,
        ],
        'magi' => ['traditionalIraDeduction' => 50000],
        'coveredByEmployerRetirementPlan' => false,
    ]], [
        [
            'id' => 'solo', 'ownerId' => 't', 'type' => 'solo_401k',
            'planRules' => [
                'isSelfEmployedOwner' => true,
                'netEarningsFromSelfEmploymentAfterHalfSETax' => 200000,
                'planCompensation' => 200000,
            ],
        ],
        ['id' => 'ira', 'ownerId' => 't', 'type' => 'traditional_ira'],
    ]);
    $solo = accountResult($result, 'solo');
    $ira = accountResult($result, 'ira');
    assertSameValue(64500, $solo['federalTaxEffects']['selfEmployedRetirementDeduction']);
    assertSameValue(64500, $solo['federalTaxEffects']['federalAgiReduction']);
    assertSameValue(0, $ira['federalTaxEffects']['selfEmployedRetirementDeduction']);
    assertSameValue(7500, $ira['federalTaxEffects']['federalAgiReduction']);
});

test('pre 2010 MFS taxpayer living apart may convert under MAGI ceiling', function (): void {
    $result = scenario(2009, [[
        'id' => 't',
        'birthYear' => 1980,
        'livedWithSpouseDuringYear' => false,
        'magi' => ['rothConversion' => 90000],
        'traditionalSepSimpleIraBasis' => 10000,
        'yearEndTraditionalSepSimpleIraValue' => 10000,
    ]], [], 'MFS', [[
        'id' => 'c', 'ownerId' => 't', 'type' => 'ira_to_roth_ira', 'amount' => 10000,
    ]]);
    assertSameValue(CalculationStatus::DETERMINATE->value, $result['conversions'][0]['status']);
    assertSameValue(5000, $result['conversions'][0]['nontaxableBasisAmount']);
    assertSameValue(5000, $result['conversions'][0]['taxableAmount']);
});

test('additional SIMPLE nonelective contribution is capped at 10 percent compensation', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 20000],
    ]], [[
        'id' => 'simple', 'ownerId' => 't', 'type' => 'simple_ira', 'employerId' => 'e',
        'planRules' => [
            'planCompensation' => 20000,
            'simpleEmployerContributionMethod' => 'nonelective_2_percent',
            'simpleAdditionalNonelectiveContribution' => 5300,
        ],
    ]]);
    $simple = accountResult($result, 'simple');
    assertSameValue(2400, $simple['contributionComponents']['employerPreTax']);
    assertSameValue(19600, $simple['statutoryMaximumAnnualContribution']);
    assertTrue(hasDiagnostic($simple['diagnostics'], 'SIMPLE_ADDITIONAL_NONELECTIVE_CONTRIBUTION_CAPPED'));
});

test('SIMPLE IRA catch-up remains pre-tax under 408p exclusion', function (): void {
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1965, 'compensation' => ['w2Compensation' => 100000],
    ]], [[
        'id' => 'simple', 'ownerId' => 't', 'type' => 'simple_ira', 'employerId' => 'e',
        'planRules' => [
            'planCompensation' => 100000,
            'simpleEmployerContributionMethod' => 'match_3_percent',
        ],
    ]]);
    $simple = accountResult($result, 'simple');
    assertSameValue(5250, $simple['contributionComponents']['employeePreTaxCatchUp']);
    assertSameValue(0, $simple['contributionComponents']['employeeRothCatchUp']);
    assertTrue(!hasDiagnostic($simple['diagnostics'], 'PRIOR_YEAR_FICA_WAGES_REQUIRED_FOR_ROTH_CATCH_UP_CLASSIFICATION'));
});

test('multiple 403b accounts share one 15-year catch-up pool', function (): void {
    $special = [
        'eligible' => true,
        'yearsOfService' => 15,
        'priorElectiveDeferrals' => 20000,
        'priorSpecialCatchUpUsed' => 0,
    ];
    $result = scenario(2026, [[
        'id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 300000],
    ]], [
        [
            'id' => 'first', 'ownerId' => 't', 'type' => 'traditional_403b',
            'employerId' => 'school-a', 'priority' => 1,
            'planRules' => ['planCompensation' => 150000, 'special403bCatchUp' => $special],
        ],
        [
            'id' => 'second', 'ownerId' => 't', 'type' => 'traditional_403b',
            'employerId' => 'school-b', 'priority' => 2,
            'planRules' => ['planCompensation' => 150000, 'special403bCatchUp' => $special],
        ],
    ]);
    assertSameValue(3000, accountResult($result, 'first')['contributionComponents']['special403bCatchUp']);
    assertSameValue(0, accountResult($result, 'second')['contributionComponents']['special403bCatchUp']);
});

test('Roth employer contributions are rejected before 2023', function (): void {
    $result = scenario(2022, [[
        'id' => 't', 'birthYear' => 1980, 'compensation' => ['w2Compensation' => 100000],
    ]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => 'traditional_401k', 'employerId' => 'e',
        'planRules' => [
            'planCompensation' => 100000,
            'expectedEmployerContribution' => 10000,
            'employerContributionTaxTreatment' => 'roth',
        ],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(0, $k['contributionComponents']['employerRoth']);
    assertSameValue(CalculationStatus::INDETERMINATE->value, $k['status']);
    assertTrue(hasDiagnostic($k['diagnostics'], 'ROTH_EMPLOYER_CONTRIBUTIONS_NOT_AVAILABLE_FOR_YEAR'));
});

test('multiple IRA conversions do not over-allocate basis by pennies', function (): void {
    $result = scenario(2026, [[
        'id' => 't',
        'birthYear' => 1980,
        'traditionalSepSimpleIraBasis' => 1,
        'yearEndTraditionalSepSimpleIraValue' => 147,
    ]], [], 'S', [
        ['id' => 'c1', 'ownerId' => 't', 'type' => 'ira_to_roth_ira', 'amount' => 1],
        ['id' => 'c2', 'ownerId' => 't', 'type' => 'ira_to_roth_ira', 'amount' => 1],
        ['id' => 'c3', 'ownerId' => 't', 'type' => 'ira_to_roth_ira', 'amount' => 1],
    ]);
    assertSameValue(0.01, $result['conversions'][0]['nontaxableBasisAmount']);
    assertSameValue(0.01, $result['conversions'][1]['nontaxableBasisAmount']);
    assertSameValue(0, $result['conversions'][2]['nontaxableBasisAmount']);
    assertSameValue(0.02, array_sum(array_column($result['conversions'], 'nontaxableBasisAmount')));
});

test('duplicate taxpayer or spouse roles are rejected', function (): void {
    try {
        scenario(2026, [
            ['id' => 't1', 'role' => 'taxpayer', 'birthYear' => 1980],
            ['id' => 't2', 'role' => 'taxpayer', 'birthYear' => 1981],
        ], [], 'MFJ');
        failTest('Expected ParameterException');
    } catch (ParameterException $error) {
        assertSameValue('DUPLICATE_PERSON_ROLE', $error->errorCode);
    }
});

test('ambiguous M alias emits diagnostic', function (): void {
    $result = scenario(2026, [
        ['id' => 't', 'role' => 'taxpayer', 'birthYear' => 1980],
        ['id' => 's', 'role' => 'spouse', 'birthYear' => 1980],
    ], [], 'M');
    assertSameValue(FilingStatus::MARRIED_FILING_JOINTLY->value, $result['filingStatus']);
    assertTrue(hasDiagnostic($result['diagnostics'], 'AMBIGUOUS_M_ALIAS_ASSUMED_MFJ'));
});


test('1997 common-law SEP applies the 401(a)(17) compensation ceiling before the 15% rate', function (): void {
    $result = scenario(1997, [[
        'id' => 't', 'birthYear' => 1960, 'compensation' => ['w2Compensation' => 500000],
    ]], [[
        'id' => 'sep', 'ownerId' => 't', 'type' => 'sep_ira', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 500000],
    ]]);
    $sep = accountResult($result, 'sep');
    assertSameValue(24000, $sep['statutoryMaximumAnnualContribution']);
    assertSameValue(24000, $sep['contributionComponents']['employerPreTax']);
});

test('1997 employer nonelective formula applies the 401(a)(17) compensation ceiling', function (): void {
    $result = scenario(1997, [[
        'id' => 't', 'birthYear' => 1960, 'compensation' => ['w2Compensation' => 500000],
    ]], [[
        'id' => 'profit-sharing', 'ownerId' => 't', 'type' => 'profit_sharing_plan', 'employerId' => 'e',
        'planRules' => ['planCompensation' => 500000, 'employerNonelectiveRate' => 0.15],
    ]]);
    $plan = accountResult($result, 'profit-sharing');
    assertSameValue(30000, $plan['statutoryMaximumAnnualContribution']);
    assertSameValue(24000, $plan['contributionComponents']['employerPreTax']);
});

test('1997 employer match uses recognized compensation without capping employee elective deferrals', function (): void {
    $result = scenario(1997, [[
        'id' => 't', 'birthYear' => 1960, 'compensation' => ['w2Compensation' => 500000],
    ]], [[
        'id' => 'k', 'ownerId' => 't', 'type' => 'traditional_401k', 'employerId' => 'e',
        'planRules' => [
            'planCompensation' => 500000,
            'employerMatchRate' => 1,
            'employerMatchCompensationFraction' => 0.01,
        ],
    ]]);
    $k = accountResult($result, 'k');
    assertSameValue(9500, $k['contributionComponents']['employeePreTaxDeferral']);
    assertSameValue(1600, $k['contributionComponents']['employerPreTax']);
});

test('1997 self-employed SEP applies reduced-rate and recognized-compensation worksheet ceilings', function (): void {
    $result = scenario(1997, [[
        'id' => 't', 'birthYear' => 1960,
        'compensation' => ['selfEmploymentNetEarnings' => 500000],
    ]], [[
        'id' => 'sep', 'ownerId' => 't', 'type' => 'sep_ira', 'employerId' => 'sole-proprietor',
        'planRules' => [
            'planCompensation' => 500000,
            'isSelfEmployedOwner' => true,
            'netEarningsFromSelfEmploymentAfterHalfSETax' => 500000,
        ],
    ]]);
    $sep = accountResult($result, 'sep');
    assertSameValue(24000, $sep['statutoryMaximumAnnualContribution']);
    assertSameValue(24000, $sep['contributionComponents']['employerPreTax']);
});


test('1997 self-employed qualified-plan formula applies reduced-rate and recognized-compensation ceilings', function (): void {
    $result = scenario(1997, [[
        'id' => 't', 'birthYear' => 1960,
        'compensation' => ['selfEmploymentNetEarnings' => 500000],
    ]], [[
        'id' => 'profit-sharing', 'ownerId' => 't', 'type' => 'profit_sharing_plan',
        'employerId' => 'sole-proprietor',
        'planRules' => [
            'planCompensation' => 500000,
            'isSelfEmployedOwner' => true,
            'netEarningsFromSelfEmploymentAfterHalfSETax' => 500000,
        ],
    ]]);
    $plan = accountResult($result, 'profit-sharing');
    assertSameValue(30000, $plan['statutoryMaximumAnnualContribution']);
    assertSameValue(24000, $plan['contributionComponents']['employerPreTax']);
});

test('exposes the 2027 IRC 223 amounts Rev. Proc. 2026-24 publishes, and no later year', function (): void {
    // Rev. Proc. 2026-24 section 3.01: $4,500 self-only and $9,000 family under
    // IRC 223(b)(2); an HDHP deductible of at least $1,750 / $3,500 and
    // out-of-pocket expenses of at most $8,700 / $17,400 under IRC 223(c)(2)(A).
    // The IRC 223(b)(3)(B) age-55 amount is the statute's unindexed $1,000.
    assertSameValue(['minimum' => 2004, 'maximum' => 2027], U::supportedHsaTaxYears());
    $row = U::hsaParametersForYear(2027);
    assertSameValue(['selfOnly' => 4500, 'family' => 9000], $row['annualContributionLimit']);
    assertSameValue(
        [
            'minimumAnnualDeductible' => ['selfOnly' => 1750, 'family' => 3500],
            'maximumAnnualOutOfPocket' => ['selfOnly' => 8700, 'family' => 17400],
        ],
        $row['hdhp'],
    );
    assertSameValue(1000, $row['additionalContributionAmountAge55']);
    $ids = array_column(U::hsaSourceMetadata(), 'id');
    assertSameValue(true, in_array('irs-rev-proc-2026-24', $ids, true));
    assertSameValue(null, U::hsaParametersForYear(2028));
});

test('exposes the IRC 125 and IRC 129 parameter table without extrapolating it', function (): void {
    // The table starts where IRC 129 does, not where its dollar ceiling does: a
    // year can exist with no statutory ceiling, and that is a state rather than
    // an absence. Absence now means only "the program did not exist".
    assertSameValue(['minimum' => 1982, 'maximum' => 2026], U::supportedFsaTaxYears());
    assertSameValue('statutory_dollar_limit', U::fsaParametersForYear(2026)['healthFsa']['state']);
    assertSameValue(3400, U::fsaParametersForYear(2026)['healthFsa']['salaryReductionLimit']);
    assertSameValue(7500, U::fsaParametersForYear(2026)['dependentCare']['exclusionLimit']);
    assertSameValue(
        'available_without_statutory_dollar_limit',
        U::fsaParametersForYear(2012)['healthFsa']['state'],
    );
    assertSameValue(null, U::fsaParametersForYear(2012)['healthFsa']['salaryReductionLimit']);
    assertSameValue(
        'available_without_statutory_dollar_limit',
        U::fsaParametersForYear(1986)['dependentCare']['state'],
    );
    assertSameValue(null, U::fsaParametersForYear(1986)['dependentCare']['exclusionLimit']);
    assertSameValue(null, U::fsaParametersForYear(1981));
    $ids = array_column(U::fsaSourceMetadata(), 'id');
    assertTrue(in_array('pl-119-21', $ids, true), 'Pub. L. 119-21 must be listed as an FSA source');
});

test('exposes the IRC 530, IRC 127 and IRC 529 parameter table from the statutes that set it', function (): void {
    // Pub. L. 104-188 section 1806(c)(1) applies IRC 529 to taxable years ending
    // after August 20, 1996. A 1996 taxable year can end on either side of that
    // date and a year lookup cannot say which, so 1996 is indeterminate; every
    // taxable year from 1997 ends after it.
    assertSameValue(['minimum' => 1996, 'maximum' => 2026], U::supportedEducationTaxYears());
    assertSameValue(null, U::educationParametersForYear(1995));
    assertSameValue('indeterminate', U::educationParametersForYear(1996)['qualifiedTuitionProgram']['state']);
    assertSameValue('available_without_statutory_dollar_limit', U::educationParametersForYear(1997)['qualifiedTuitionProgram']['state']);
    // Pub. L. 105-34 section 213: IRC 530 applies to taxable years beginning after
    // December 31, 1997, with a $500 limit reduced from $95,000 over $15,000, or from
    // $150,000 over $10,000 on a joint return.
    assertSameValue('unavailable', U::educationParametersForYear(1997)['coverdellEducationSavingsAccount']['state']);
    assertSameValue([
        'state' => 'statutory_dollar_limit',
        'annualContributionLimit' => 500,
        'contributionPhaseout' => ['jointReturn' => [150000, 160000], 'otherReturns' => [95000, 110000]],
    ], U::educationParametersForYear(1998)['coverdellEducationSavingsAccount']);
    // Pub. L. 107-16 section 401(a) and (b), for taxable years beginning after
    // December 31, 2001: $2,000, and a joint reduction from $190,000 over $30,000.
    assertSameValue(2000, U::educationParametersForYear(2002)['coverdellEducationSavingsAccount']['annualContributionLimit']);
    assertSameValue(
        ['jointReturn' => [190000, 220000], 'otherReturns' => [95000, 110000]],
        U::educationParametersForYear(2002)['coverdellEducationSavingsAccount']['contributionPhaseout'],
    );
    // IRC 127(a)(2): $5,250.
    assertSameValue(
        ['state' => 'statutory_dollar_limit', 'annualExclusionLimit' => 5250],
        U::educationParametersForYear(2026)['educationalAssistanceProgram'],
    );
    // IRC 529(b)(6) states no contribution limit. The IRC 529(e)(3) cap counts
    // "expenses described in subsection (c)(7)". Pub. L. 115-97 section 11032 added
    // both for distributions after 2017, with (c)(7) reaching tuition only. Pub. L.
    // 119-21 section 70413(a) rewrote (c)(7) to eight categories, tuition among
    // them, for distributions after July 4, 2025, and section 70413(b) raised the
    // cap to $20,000 for taxable years beginning after 2025. The IRC 529(c)(9)(B)
    // $10,000 and IRC 529(c)(3)(E)(ii)(II) $35,000 apply to distributions after
    // 2018 and after 2023.
    assertSameValue([
        'state' => 'available_without_statutory_dollar_limit',
        'annualContributionLimit' => null,
        'elementarySecondaryExpenseAnnualLimit' => 20000,
        'elementarySecondaryExpenseScope' => 'tuition_and_other_school_expenses',
        'qualifiedEducationLoanLifetimeLimit' => 10000,
        'rothIraRolloverLifetimeLimit' => 35000,
    ], U::educationParametersForYear(2026)['qualifiedTuitionProgram']);
    assertSameValue(10000, U::educationParametersForYear(2025)['qualifiedTuitionProgram']['elementarySecondaryExpenseAnnualLimit']);
    assertSameValue('varies_within_year', U::educationParametersForYear(2025)['qualifiedTuitionProgram']['elementarySecondaryExpenseScope']);
    assertSameValue('tuition', U::educationParametersForYear(2024)['qualifiedTuitionProgram']['elementarySecondaryExpenseScope']);
    assertSameValue('tuition', U::educationParametersForYear(2018)['qualifiedTuitionProgram']['elementarySecondaryExpenseScope']);
    assertSameValue(null, U::educationParametersForYear(2017)['qualifiedTuitionProgram']['elementarySecondaryExpenseAnnualLimit']);
    assertSameValue(null, U::educationParametersForYear(2017)['qualifiedTuitionProgram']['elementarySecondaryExpenseScope']);
    assertSameValue(null, U::educationParametersForYear(2018)['qualifiedTuitionProgram']['qualifiedEducationLoanLifetimeLimit']);
    assertSameValue(null, U::educationParametersForYear(2023)['qualifiedTuitionProgram']['rothIraRolloverLifetimeLimit']);
    $ids = array_column(U::educationSourceMetadata(), 'id');
    assertTrue(in_array('pl-119-21', $ids, true), 'Pub. L. 119-21 must be listed as an education source');
});

test('exposes the IRC 529A ABLE table and its 2026 separation from the IRC 2503(b) exclusion', function (): void {
    // Pub. L. 113-295 div. B section 102(f)(1): taxable years beginning after December 31, 2014.
    assertSameValue(['minimum' => 2015, 'maximum' => 2026], U::supportedAbleTaxYears());
    assertSameValue(null, U::ableParametersForYear(2014));
    // Rev. Proc. 2014-61: "the first $14,000 of gifts" for 2015, which IRC
    // 529A(b)(2)(B)(i) adopts. Age 26 under IRC 529A(e)(1)(A) as enacted, and no
    // employed-beneficiary contribution before Pub. L. 115-97 section 11024.
    assertSameValue([
        'state' => 'statutory_dollar_limit',
        'annualContributionLimit' => 14000,
        'section2503bExclusion' => 14000,
        'equalsSection2503bExclusion' => true,
        'ableToWorkContributionAvailable' => false,
        'disabilityOnsetAgeLimit' => 26,
    ], U::ableParametersForYear(2015)['ableAccount']);
    // Pub. L. 115-97 section 11024(c): taxable years beginning after December 22, 2017.
    assertSameValue(false, U::ableParametersForYear(2017)['ableAccount']['ableToWorkContributionAvailable']);
    assertSameValue(true, U::ableParametersForYear(2018)['ableAccount']['ableToWorkContributionAvailable']);
    // Rev. Proc. 2024-40: $19,000 for 2025, still the gift exclusion.
    assertSameValue(19000, U::ableParametersForYear(2025)['ableAccount']['annualContributionLimit']);
    // Rev. Proc. 2025-32: section 4.34 states $20,000 for ABLE "instead of" the
    // $19,000 of section 4.42(1). Pub. L. 117-328 div. T section 124 raises the
    // onset age to 46, and Pub. L. 119-21 section 70115(a)(2) keeps the
    // employed-beneficiary contribution.
    assertSameValue([
        'state' => 'statutory_dollar_limit',
        'annualContributionLimit' => 20000,
        'section2503bExclusion' => 19000,
        'equalsSection2503bExclusion' => false,
        'ableToWorkContributionAvailable' => true,
        'disabilityOnsetAgeLimit' => 46,
    ], U::ableParametersForYear(2026)['ableAccount']);
    $ids = array_column(U::ableSourceMetadata(), 'id');
    assertTrue(in_array('irs-rev-proc-2025-32', $ids, true), 'Rev. Proc. 2025-32 must be listed as an ABLE source');
});

test('exposes the IRC 23 and IRC 137 adoption table through each statutory change', function (): void {
    // Pub. L. 104-188 section 1807: taxable years beginning after December 31, 1996,
    // $5,000 ($6,000 for a child with special needs), reduced above $75,000 over $40,000.
    assertSameValue(['minimum' => 1997, 'maximum' => 2026], U::supportedAdoptionTaxYears());
    assertSameValue(null, U::adoptionParametersForYear(1996));
    assertSameValue([
        'state' => 'statutory_dollar_limit',
        'codeSection' => '23',
        'dollarLimit' => 5000,
        'specialNeedsDollarLimit' => 6000,
        'specialNeedsCreditAmount' => null,
        'phaseout' => [75000, 115000],
        'refundability' => 'nonrefundable',
        'refundablePortionLimit' => null,
    ], U::adoptionParametersForYear(1997)['adoptionCredit']);
    // Pub. L. 107-16 section 202(b) and (g): $10,000 and $150,000 for 2002, but the
    // flat special-needs amount of section 202(a) only from 2003 (Rev. Proc. 2002-70: $10,160).
    assertSameValue(10000, U::adoptionParametersForYear(2002)['adoptionCredit']['dollarLimit']);
    assertSameValue(null, U::adoptionParametersForYear(2002)['adoptionCredit']['specialNeedsCreditAmount']);
    assertSameValue(10160, U::adoptionParametersForYear(2003)['adoptionAssistanceExclusion']['specialNeedsExclusionAmount']);
    // Rev. Proc. 2010-35: Pub. L. 111-148 section 10909 moved the credit to IRC 36C,
    // made it refundable and raised 2010 from $12,170 to $13,170.
    assertSameValue('36C', U::adoptionParametersForYear(2010)['adoptionCredit']['codeSection']);
    assertSameValue(13170, U::adoptionParametersForYear(2010)['adoptionCredit']['dollarLimit']);
    assertSameValue('refundable', U::adoptionParametersForYear(2010)['adoptionCredit']['refundability']);
    // Pub. L. 111-312 section 101(b): nonrefundable IRC 23 again after 2011 (Rev. Proc. 2011-52: $12,650).
    assertSameValue('23', U::adoptionParametersForYear(2012)['adoptionCredit']['codeSection']);
    assertSameValue('nonrefundable', U::adoptionParametersForYear(2012)['adoptionCredit']['refundability']);
    // Pub. L. 119-21 section 70402: up to $5,000 refundable for taxable years after 2024.
    assertSameValue(5000, U::adoptionParametersForYear(2025)['adoptionCredit']['refundablePortionLimit']);
    // Rev. Proc. 2025-32 sections 4.04 and 4.18: $17,670, phase-out from $265,080 to
    // $305,080, and a $5,120 refundable portion.
    assertSameValue([
        'year' => 2026,
        'adoptionCredit' => [
            'state' => 'statutory_dollar_limit',
            'codeSection' => '23',
            'dollarLimit' => 17670,
            'specialNeedsDollarLimit' => 17670,
            'specialNeedsCreditAmount' => 17670,
            'phaseout' => [265080, 305080],
            'refundability' => 'partially_refundable',
            'refundablePortionLimit' => 5120,
        ],
        'adoptionAssistanceExclusion' => [
            'state' => 'statutory_dollar_limit',
            'dollarLimit' => 17670,
            'specialNeedsDollarLimit' => 17670,
            'specialNeedsExclusionAmount' => 17670,
            'phaseout' => [265080, 305080],
        ],
    ], U::adoptionParametersForYear(2026));
    $ids = array_column(U::adoptionSourceMetadata(), 'id');
    assertTrue(in_array('irs-rev-proc-2010-35', $ids, true), 'Rev. Proc. 2010-35 must be listed as an adoption source');
});

test('rejects a bare FSA account type but accepts each unambiguous spelling', function (): void {
    assertSameValue(AccountType::HEALTH_FSA->value, U::normalizeAccountType('health fsa'));
    assertSameValue(AccountType::HEALTH_FSA->value, U::normalizeAccountType('Medical-FSA'));
    try {
        U::normalizeAccountType('FSA');
        failTest('Expected ParameterException');
    } catch (ParameterException $error) {
        assertSameValue('INVALID_ACCOUNT_TYPE', $error->errorCode);
        assertTrue(str_contains($error->getMessage(), 'health_fsa'), 'message must name health_fsa');
        assertTrue(str_contains($error->getMessage(), 'dependent_care_fsa'), 'message must name dependent_care_fsa');
    }
});

test('validates health FSA plan facts before calculating anything', function (): void {
    $cases = [
        'INVALID_HEALTH_FSA_PURPOSE' => ['purpose' => 'general'],
        'INVALID_BOOLEAN' => ['offersCarryover' => 'yes'],
        'INVALID_MONEY' => ['priorYearUnusedAmount' => -1],
    ];
    foreach ($cases as $expectedCode => $rules) {
        try {
            scenario(2026, [['id' => 't', 'birthYear' => 1980]], [[
                'id' => 'f', 'ownerId' => 't', 'type' => 'health_fsa',
                'planRules' => ['healthFsa' => $rules],
            ]]);
            failTest("Expected ParameterException {$expectedCode}");
        } catch (ParameterException $error) {
            assertSameValue($expectedCode, $error->errorCode);
        }
    }
    try {
        scenario(2026, [['id' => 't', 'birthYear' => 1980]], [[
            'id' => 'f', 'ownerId' => 't', 'type' => 'health_fsa',
            'planRules' => ['healthFsa' => 3400],
        ]]);
        failTest('Expected ParameterException INVALID_INPUT_OBJECT');
    } catch (ParameterException $error) {
        assertSameValue('INVALID_INPUT_OBJECT', $error->errorCode);
    }
});

test('the health FSA builder reaches every IRC 125(i) plan fact', function (): void {
    $result = ScenarioBuilder::forTaxYear(2026)
        ->taxpayer('t', static fn ($person) => $person->bornIn(1985)->w2Compensation(150000))
        ->addAccount(
            (new AccountBuilder('f', 't', AccountType::HEALTH_FSA))
                ->employer('e')
                ->healthFsaPurpose('post_deductible')
                ->healthFsaCarryover(true, 700)
                ->healthFsaEmployerFlexCredit(250, false)
                ->healthFsaCalendarPlanYear(),
        )
        ->calculate();
    $fsa = accountResult($result, 'f');
    assertSameValue(CalculationStatus::DETERMINATE->value, $fsa['status']);
    assertSameValue(3400.0, $fsa['statutoryMaximumAnnualContribution']);
    assertSameValue('post_deductible', $fsa['healthFsa']['purpose']);
    assertSameValue(false, $fsa['healthFsa']['disqualifiesHsaEligibility']);
    assertSameValue(660.0, $fsa['healthFsa']['carryoverFromPriorYear']);
    assertSameValue(40.0, $fsa['healthFsa']['forfeitedAmount']);
    assertSameValue(0.0, $fsa['healthFsa']['employerFlexCreditCountedAgainstLimit']);
});

test('validates IRC 129 earned income facts before calculating anything', function (): void {
    // The IRC 129(b)(1) facts describe the people on the return, not the
    // program, so they are validated on the person rather than on plan rules.
    $personCases = [
        'INVALID_MONEY' => ['dependentCareEarnedIncome' => -1],
        'INVALID_BOOLEAN' => ['isStudentOrIncapableOfSelfCare' => 'yes'],
    ];
    foreach ($personCases as $expectedCode => $extra) {
        try {
            scenario(2026, [array_merge(['id' => 't', 'birthYear' => 1985], $extra)], [[
                'id' => 'd', 'ownerId' => 't', 'type' => 'dependent_care_fsa',
            ]]);
            failTest("Expected ParameterException {$expectedCode}");
        } catch (ParameterException $error) {
            assertSameValue($expectedCode, $error->errorCode);
        }
    }
    try {
        scenario(2026, [['id' => 't', 'birthYear' => 1985]], [[
            'id' => 'd', 'ownerId' => 't', 'type' => 'dependent_care_fsa',
            'planRules' => ['dependentCareFsa' => ['planDocumentLimit' => -1]],
        ]]);
        failTest('Expected ParameterException INVALID_MONEY');
    } catch (ParameterException $error) {
        assertSameValue('INVALID_MONEY', $error->errorCode);
    }
    assertSameValue(AccountType::DEPENDENT_CARE_FSA->value, U::normalizeAccountType('DCAP'));
    assertSameValue(AccountType::DEPENDENT_CARE_FSA->value, U::normalizeAccountType('dependent care assistance'));
});

test('the dependent care builder reaches the IRC 129(b) earned income facts', function (): void {
    $result = ScenarioBuilder::forTaxYear(2026)
        ->filingStatus(FilingStatus::MARRIED_FILING_JOINTLY)
        ->taxpayer('t', static fn ($person) => $person->bornIn(1985)->dependentCareEarnedIncome(90000))
        ->spouse('s', static fn ($person) => $person->bornIn(1986)->dependentCareEarnedIncome(4000))
        ->addAccount(
            (new AccountBuilder('d', 't', AccountType::DEPENDENT_CARE_FSA))
                ->employer('e'),
        )
        ->calculate();
    $dc = accountResult($result, 'd');
    assertSameValue(CalculationStatus::DETERMINATE->value, $dc['status']);
    // The statutory maximum is the IRC 129(a)(2)(A) amount; what the supplied
    // earned income allows within it is the input-based maximum.
    assertSameValue(7500.0, $dc['statutoryMaximumAnnualContribution']);
    assertSameValue(4000.0, $dc['maximumAnnualContributionBasedOnInputs']);
    assertSameValue(7500.0, $dc['dependentCareFsa']['statutoryExclusion']);
    assertSameValue(4000.0, $dc['dependentCareFsa']['earnedIncomeLimitation']);
    assertSameValue(0.0, $dc['federalTaxEffects']['federalAgiReduction']);
    assertSameValue(4000.0, $dc['federalTaxEffects']['ficaWageReduction']);
});


test('the IRC 223(b)(5)(B)(ii) division diagnostic does not claim a shared limit it is not reporting', function (): void {
    // Both spouses hold family coverage all year in 2005, when IRC 223(b)(2) still
    // capped each month by the plan's annual deductible, and the spouse's family
    // plan states 400 -- below the 2005 family minimum of 2000 (Rev. Proc.
    // 2004-71). That impeaches the division under Notice 2004-50 Q&A-31 *and*,
    // because a family plan is a candidate for the IRC 223(b)(5)(A) lowest
    // deductible, leaves the amount being divided undeterminable too. Both
    // diagnostics fire, and the division one must not end by saying the shared
    // limit still reports the limitation when the pool beside it is null.
    $result = U::calculate([
        'taxYear' => 2005,
        'filingStatus' => FilingStatus::MARRIED_FILING_JOINTLY->value,
        'persons' => [['id' => 't', 'birthYear' => 1970], ['id' => 's', 'birthYear' => 1972]],
        'accounts' => [
            ['id' => 'a', 'ownerId' => 't', 'type' => 'hsa', 'planRules' => ['hsa' => [
                'coverageTier' => 'family', 'hdhpAnnualDeductible' => 5000,
            ]]],
            ['id' => 'b', 'ownerId' => 's', 'type' => 'hsa', 'planRules' => ['hsa' => [
                'coverageTier' => 'family', 'hdhpAnnualDeductible' => 400,
            ]]],
        ],
    ]);
    $codes = array_column($result['diagnostics'], 'code');
    if (!in_array('HSA_SHARED_FAMILY_LIMIT_INDETERMINATE', $codes, true)) {
        failTest('expected HSA_SHARED_FAMILY_LIMIT_INDETERMINATE');
    }
    $division = null;
    foreach ($result['diagnostics'] as $entry) {
        if ($entry['code'] === 'HSA_FAMILY_LIMIT_DIVISION_INDETERMINATE') {
            $division = $entry;
        }
    }
    if ($division === null) {
        failTest('expected the division diagnostic');
    }
    $pool = null;
    foreach ($result['accounts'][0]['sharedLimits'] as $entry) {
        if ($entry['id'] === 'hsa223b5:t|s') {
            $pool = $entry;
        }
    }
    assertSameValue(null, $pool['limit']);
    if (str_contains($division['message'], 'shared limit still reports it')) {
        failTest('division diagnostic claims a limit that is null: ' . $division['message']);
    }
    if (!str_contains($division['message'], 'HSA_SHARED_FAMILY_LIMIT_INDETERMINATE')) {
        failTest('division diagnostic does not point at the amount diagnostic');
    }
});

$failed = 0;
// Fixed priorities hold allocation order constant; compare all public account fields.
$normalizationVectors = json_decode(file_get_contents(dirname(__DIR__, 2) . '/data/conformance-vectors.json'), true, 512, JSON_THROW_ON_ERROR)['vectors'];
foreach ($normalizationVectors as $vector) {
    if (!str_starts_with($vector['name'], 'HSA owner normalization:') || str_ends_with($vector['name'], ' reversed')) continue;
    $tests[$vector['name'] . ' is invariant under account permutation'] = static function () use ($vector): void {
        $input = $vector['input'];
        $forward = U::calculate($input);
        $input['accounts'] = array_reverse($input['accounts']);
        $reverse = U::calculate($input);
        foreach ($input['accounts'] as $account) {
            assertSameValue(accountResult($forward, $account['id']), accountResult($reverse, $account['id']));
        }
    };
}

test('nonempty unusable person HSA statements never assert no coverage', static function () use ($normalizationVectors): void {
    foreach ($normalizationVectors as $vector) {
        if ($vector['name'] !== '2026 nonempty unusable person HSA coverage is not explicit no coverage') continue;
        foreach ([['hdhpAnnualDeductible' => 3400], ['eligibleMonths' => [1]]] as $coverage) {
            $input = $vector['input'];
            $input['persons'][1]['hsaCoverage'] = $coverage;
            $row = accountResult(U::calculate($input), 't-hsa');
            if (isset($coverage['eligibleMonths'])) {
                // Q&A-31: eleven family months whole, one equally divided.
                // 8750 - (8750 / 12 / 2) = 8385.42, not the sole-spouse 8750.
                assertSameValue(8385.42, $row['statutoryMaximumAnnualContribution']);
                assertTrue(hasDiagnostic($row['diagnostics'], 'HSA_COHERENT_COVERAGE_COMPLETIONS_AGREE'));
                continue;
            }
            assertSameValue(null, $row['statutoryMaximumAnnualContribution']);
            assertSameValue(CalculationStatus::INDETERMINATE->value, $row['status']);
            assertTrue(hasDiagnostic($row['diagnostics'], 'HSA_SPOUSE_COVERAGE_FACTS_REQUIRED'));
            assertTrue(hasDiagnostic($row['diagnostics'], 'HSA_FAMILY_LIMIT_DIVISION_INDETERMINATE'));
            assertTrue(!hasDiagnostic($row['diagnostics'], 'HSA_SOLE_ELIGIBLE_SPOUSE_TAKES_WHOLE_FAMILY_LIMIT'));
        }
    }
});
test('the married capped-year comparison preserves deductible conflict provenance', static function () use ($normalizationVectors): void {
    foreach ($normalizationVectors as $vector) {
        if ($vector['name'] !== '2005 supplied conflicting HSA deductibles A first') continue;
        foreach ([false, true] as $reverse) {
            $input = $vector['input'];
            $input['filingStatus'] = FilingStatus::MARRIED_FILING_JOINTLY;
            $input['persons'][] = ['id' => 's', 'role' => 'spouse', 'birthYear' => 1980];
            foreach ($input['accounts'] as &$a) $a['planRules']['hsa']['coverageTier'] = 'family';
            unset($a);
            $input['accounts'][] = ['id' => 's-hsa', 'ownerId' => 's', 'type' => AccountType::HSA,
                'priority' => 3, 'planRules' => ['hsa' => ['coverageTier' => 'family', 'hdhpAnnualDeductible' => 4000]]];
            if ($reverse) $input['accounts'] = array_reverse($input['accounts']);
            $result = U::calculate($input);
            foreach ($input['accounts'] as $a) {
                $row = accountResult($result, $a['id']);
                assertSameValue(CalculationStatus::INDETERMINATE->value, $row['status']);
                assertSameValue(null, $row['statutoryMaximumAnnualContribution']);
                assertTrue(!hasDiagnostic($row['diagnostics'], 'HSA_HDHP_ANNUAL_DEDUCTIBLE_REQUIRED'));
            }
        }
    }
});

test('missing married person records leave the Archer operand unestablished even with a whole share', static function (): void {
    foreach ([2005, 2026] as $taxYear) {
        foreach (['MFJ', 'MFS'] as $filingStatus) {
            foreach (['taxpayer', 'spouse'] as $role) {
                foreach ([0.25, $role === 'taxpayer' ? 1 : 0] as $taxpayerShare) {
                    $result = U::calculate(['taxYear' => $taxYear, 'filingStatus' => $filingStatus,
                        'persons' => [['id' => 'owner', 'role' => $role, 'birthYear' => 1980]],
                        'accounts' => [['id' => 'a', 'ownerId' => 'owner', 'type' => 'hsa',
                            'planRules' => ['hsa' => ['coverageTier' => 'family', 'hdhpAnnualDeductible' => 3400]]]],
                        'hsaFamilyLimitDivision' => ['status' => 'agreed', 'taxpayerShare' => $taxpayerShare]]);
                    $row = accountResult($result, 'a');
                    assertSameValue(null, $row['statutoryMaximumAnnualContribution']);
                    assertSameValue('indeterminate', $row['status']);
                    assertSameValue(true, hasDiagnostic($row['diagnostics'], 'HSA_SPOUSE_COVERAGE_FACTS_REQUIRED'));
                }
            }
        }
    }
});

test('an agreed whole share with both person records retains paragraph-5 Archer ordering for either owner role', static function () use ($normalizationVectors): void {
    foreach ($normalizationVectors as $vector) {
        if ($vector['name'] !== '2026 known partner agreed whole preserves the age-55 amount after Archer reduction') continue;
        foreach (['taxpayer', 'spouse'] as $role) {
            foreach (['MFJ', 'MFS'] as $filingStatus) {
                $input = $vector['input'];
                $input['filingStatus'] = $filingStatus;
                $input['persons'][0]['role'] = $role;
                $input['persons'][1]['role'] = $role === 'taxpayer' ? 'spouse' : 'taxpayer';
                $input['hsaFamilyLimitDivision'] = ['status' => 'agreed', 'taxpayerShare' => $role === 'taxpayer' ? 1 : 0];
                $row = accountResult(U::calculate($input), 'a');
                assertSameValue(1000, $row['statutoryMaximumAnnualContribution']);
                assertSameValue(8750, $row['hsa']['archerMsaLimitReduction']);
                assertSameValue(true, $row['hsa']['archerMsaReductionPrecedesFamilyDivision']);
                assertSameValue(1, $row['hsa']['familyLimitShare']);
            }
        }
    }
});

test('payroll parameter and scenario builder snapshots are detached', static function (): void {
    assertSameValue(['minimum' => 1991, 'maximum' => 2026], U::supportedPayrollTaxYears());
    $row = U::payrollParametersForYear(2026);
    $row['contributionAndBenefitBase'] = 1;
    assertSameValue(184500, U::payrollParametersForYear(2026)['contributionAndBenefitBase']);
    assertSameValue(null, U::payrollParametersForYear(1990));
    $persons = [['id' => 't', 'wages' => [['employerId' => 'e', 'socialSecurityWages' => 10000, 'medicareWages' => 10000]]]];
    $builder = U::forTaxYear(2026)->payrollTax($persons);
    $persons[0]['wages'][0]['medicareWages'] = 0;
    assertSameValue(10000, $builder->toInput()['payrollTax']['persons'][0]['wages'][0]['medicareWages']);
});

$started = microtime(true);
foreach ($tests as $name => $body) {
    try {
        $body();
        fwrite(STDOUT, "ok - {$name}\n");
    } catch (Throwable $error) {
        $failed++;
        fwrite(STDERR, "not ok - {$name}\n  " . $error->getMessage() . "\n");
    }
}
$elapsed = number_format(microtime(true) - $started, 3);
fwrite(STDOUT, sprintf("\n%d tests, %d failed (%ss)\n", count($tests), $failed, $elapsed));
exit($failed === 0 ? 0 : 1);
