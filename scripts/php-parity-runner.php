<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/src/USTaxAdvantagedParams.php';

use USTaxAdvantagedParams\USTaxAdvantagedParams;

/** The public static lookup of that name, or null when PHP does not expose one. */
function publicStaticLookup(string $name): ?ReflectionMethod
{
    if (!method_exists(USTaxAdvantagedParams::class, $name)) {
        return null;
    }
    $method = new ReflectionMethod(USTaxAdvantagedParams::class, $name);
    return $method->isPublic() && $method->isStatic() ? $method : null;
}

try {
    $raw = stream_get_contents(STDIN);
    if ($raw === false) {
        throw new RuntimeException('Unable to read parity input from STDIN.');
    }
    /** @var mixed $decoded */
    $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($decoded)) {
        throw new InvalidArgumentException('Parity input must be a JSON array.');
    }

    $results = [];
    foreach ($decoded as $index => $input) {
        if (!is_array($input)) {
            throw new InvalidArgumentException("Parity input at index {$index} must be an object.");
        }
        /** @var array<string,mixed> $input */
        try {
            $operation = $input['__operation'] ?? null;
            if ($operation === 'tableMethods') {
                // The same discovery rule as scripts/check-parity.mjs.
                $methods = [];
                foreach ((new ReflectionClass(USTaxAdvantagedParams::class))->getMethods() as $method) {
                    if ($method->isPublic() && $method->isStatic() && preg_match('/(?:^p|P)arametersForYear$/', $method->getName()) === 1) {
                        $methods[] = $method->getName();
                    }
                }
                sort($methods, SORT_STRING);
                $results[] = $methods;
            } elseif ($operation === 'table') {
                $name = (string) $input['method'];
                $results[] = publicStaticLookup($name) === null
                    ? ['__missing' => $name]
                    : ['value' => USTaxAdvantagedParams::{$name}(...$input['args'])];
            } elseif ($operation === 'payrollTax') {
                $results[] = USTaxAdvantagedParams::calculatePayrollTax($input['input']);
            } else {
                $results[] = USTaxAdvantagedParams::calculate($input);
            }
        } catch (\USTaxAdvantagedParams\ParameterException $error) {
            $results[] = ['__error' => ['code' => $error->errorCode, 'message' => $error->getMessage()]];
        }
    }

    fwrite(STDOUT, json_encode($results, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
} catch (Throwable $error) {
    fwrite(STDERR, $error::class . ': ' . $error->getMessage() . PHP_EOL);
    exit(1);
}
