<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/src/USTaxAdvantagedParams.php';

use USTaxAdvantagedParams\USTaxAdvantagedParams as U;

/** @param array<string,mixed> $value */
function readConformancePath(array $value, string $path): mixed
{
    $cursor = $value;
    foreach (explode('.', $path) as $segment) {
        if (!is_array($cursor) || !array_key_exists($segment, $cursor)) {
            throw new RuntimeException("Cannot resolve conformance path {$path} at {$segment}.");
        }
        $cursor = $cursor[$segment];
    }
    return $cursor;
}

function assertConformanceEqual(mixed $expected, mixed $actual, string $message): void
{
    if (is_numeric($expected) && is_numeric($actual)) {
        if (abs((float) $expected - (float) $actual) < 0.005) {
            return;
        }
    } elseif ($expected === $actual) {
        return;
    }
    throw new RuntimeException(
        "{$message}: expected " . var_export($expected, true) . ', got ' . var_export($actual, true),
    );
}

$path = dirname(__DIR__, 2) . '/data/conformance-vectors.json';
$decoded = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
$failed = 0;
foreach ($decoded['vectors'] as $vector) {
    try {
        if (isset($vector['expectError'])) {
            try {
                U::calculate($vector['input']);
                throw new RuntimeException("{$vector['name']}: expected error {$vector['expectError']['code']} was not thrown");
            } catch (USTaxAdvantagedParams\ParameterException $error) {
                if ($error->errorCode !== $vector['expectError']['code']) {
                    throw new RuntimeException(
                        "{$vector['name']}: expected error {$vector['expectError']['code']}, got {$error->errorCode}",
                    );
                }
            }
            fwrite(STDOUT, "ok - {$vector['name']}\n");
            continue;
        }
        $result = U::calculate($vector['input']);
        foreach ($vector['expect'] ?? [] as $resultPath => $expected) {
            assertConformanceEqual(
                $expected,
                readConformancePath($result, $resultPath),
                "{$vector['name']}: {$resultPath}",
            );
        }
        $codes = array_column($result['diagnostics'], 'code');
        foreach ($vector['expectDiagnosticCodes'] ?? [] as $code) {
            if (!in_array($code, $codes, true)) {
                throw new RuntimeException("{$vector['name']}: missing diagnostic {$code}");
            }
        }
        foreach ($vector['expectAbsentDiagnosticCodes'] ?? [] as $code) {
            if (in_array($code, $codes, true)) {
                throw new RuntimeException("{$vector['name']}: unexpected diagnostic {$code}");
            }
        }
        fwrite(STDOUT, "ok - {$vector['name']}\n");
    } catch (Throwable $error) {
        $failed++;
        fwrite(STDERR, "not ok - {$vector['name']}\n  {$error->getMessage()}\n");
    }
}
fwrite(STDOUT, sprintf("\n%d conformance vectors, %d failed\n", count($decoded['vectors']), $failed));
exit($failed === 0 ? 0 : 1);
