<?php

declare(strict_types=1);

/*
 * PHP side of scripts/fuzz-parity.mjs.
 *
 * This differs from scripts/php-parity-runner.php in one way that matters for
 * fuzzing: it catches every Throwable, not only ParameterException. A native
 * TypeError raised on a malformed input is itself a parity finding — the
 * TypeScript engine rejects the same input with a ParameterError — so it must
 * be reported as a diff rather than aborting the whole batch.
 */

require_once dirname(__DIR__) . '/php/src/USTaxAdvantagedParams.php';

use USTaxAdvantagedParams\ParameterException;
use USTaxAdvantagedParams\USTaxAdvantagedParams;

/*
 * Diagnostics must never reach STDOUT, which carries the JSON result, and a
 * warning is itself a parity finding: where PHP warns and limps on, the
 * TypeScript engine throws. Promoting every diagnostic to an ErrorException
 * makes that visible as a divergence instead of silently corrupting the batch.
 */
ini_set('display_errors', 'stderr');
set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    $raw = stream_get_contents(STDIN);
    if ($raw === false) {
        throw new RuntimeException('Unable to read fuzz input from STDIN.');
    }
    /** @var mixed $decoded */
    $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($decoded)) {
        throw new InvalidArgumentException('Fuzz input must be a JSON array.');
    }

    $results = [];
    foreach ($decoded as $index => $input) {
        if (!is_array($input)) {
            throw new InvalidArgumentException("Fuzz input at index {$index} must be an object.");
        }
        /** @var array<string,mixed> $input */
        try {
            $results[] = USTaxAdvantagedParams::calculate($input);
        } catch (ParameterException $error) {
            $results[] = ['__error' => ['code' => $error->errorCode, 'message' => $error->getMessage()]];
        } catch (Throwable $error) {
            $results[] = ['__throw' => $error::class . ': ' . $error->getMessage()];
        }
    }

    fwrite(STDOUT, json_encode($results, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
} catch (Throwable $error) {
    fwrite(STDERR, $error::class . ': ' . $error->getMessage() . PHP_EOL);
    exit(1);
}
