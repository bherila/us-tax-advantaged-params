<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/php/src/USTaxAdvantagedParams.php';

use USTaxAdvantagedParams\USTaxAdvantagedParams;

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
            $results[] = USTaxAdvantagedParams::calculate($input);
        } catch (\USTaxAdvantagedParams\RetirementParameterException $error) {
            $results[] = ['__error' => ['code' => $error->errorCode, 'message' => $error->getMessage()]];
        }
    }

    fwrite(STDOUT, json_encode($results, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
} catch (Throwable $error) {
    fwrite(STDERR, $error::class . ': ' . $error->getMessage() . PHP_EOL);
    exit(1);
}
