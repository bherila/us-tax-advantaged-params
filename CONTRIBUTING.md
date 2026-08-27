# Contributing

Contributions are welcome, but tax-law calculation changes require a higher evidentiary and testing standard than ordinary utility code.

## Development requirements

- Node.js 20 or later.
- npm with lockfile support.
- TypeScript 5.8 or later.
- PHP 8.2 or later for the supported PHP target.

Install dependencies and run the suite:

```bash
npm ci
npm run verify
```

## Repository layout

```text
src/USARetirementAccountParameters.ts          TypeScript engine
php/src/USARetirementAccountParameters.php    PHP engine
data/retirement-parameters.json                Canonical annual parameters
data/conformance-vectors.json                  Shared behavioral fixtures
tests/                                         TypeScript tests
php/tests/                                     PHP tests
scripts/generate.mjs                           Embedded-data generator
scripts/check-parity.mjs                       Full-output parity checker
```

Do not manually edit content between generated-parameter markers in either engine. Change the canonical JSON and run:

```bash
npm run generate
```

## Change categories

### Annual parameter update

An annual update should generally change the canonical data, relevant conformance vectors, source/changelog documentation, and the two generated parameter blocks. It should not change algorithms unless the law changed semantically.

### Calculation-semantic change

A semantic change must update both native engines and include:

1. A primary IRS, Treasury, statutory, or Department of Labor source.
2. TypeScript regression tests.
3. PHP regression tests.
4. A shared conformance vector when the behavior is language-neutral.
5. A design or documentation update.
6. Passing complete-output parity.

### Public API change

Avoid breaking serialized inputs and outputs. When a break is unavoidable, document it, add migration guidance, and use the next appropriate semantic-versioning release.

## Source requirements

Primary authorities are preferred: the Internal Revenue Code, enacted legislation, Treasury regulations, IRS notices/revenue procedures/revenue rulings/publications/instructions, and relevant Department of Labor materials. A secondary article may identify an issue but should not be the sole support when a primary source is available.

Every canonical source record must have a unique stable ID, title, HTTPS URL, and authority.

## Data validation

`npm run validate:data` checks:

- canonical JSON formatting;
- contiguous years within the declared range;
- required annual fields;
- nonnegative money values and valid rate ranges;
- coherent SEP reduced rates;
- source metadata;
- conformance-vector structure and uniqueness.

The package never extrapolates an unencoded year. Add a complete row or leave the year unsupported.

## Testing commands

```bash
npm run validate:data      # Canonical data and fixture validation
npm run generate:check     # Embedded blocks match canonical data
npm run typecheck          # Strict TypeScript typecheck
npm run test:ts            # TypeScript unit and conformance tests
npm run test:php           # PHP unit and conformance tests
npm run test:parity        # Complete TypeScript/PHP output equality
npm run build              # ESM, CommonJS, and declarations
npm run verify             # Full release-oriented validation
```

Do not weaken a test merely to make a calculation pass. When authorities conflict or a result depends on plan terms, encode the uncertainty in diagnostics rather than selecting an unsupported universal result.

## Coding conventions

- Keep TypeScript and PHP public APIs conceptually aligned.
- Use explicit domain names such as `annualAdditionsGroupId`.
- Validate caller money values and rates at the boundary.
- Preserve deterministic allocation order and cents-level results.
- Attach stable diagnostic codes to material assumptions and missing facts.
- Keep runtime dependencies at zero absent a compelling reviewed reason.
- Do not add network access to the calculation path.

## Pull-request checklist

- [ ] Primary authority is documented for tax-law changes.
- [ ] TypeScript unit tests cover the behavior.
- [ ] PHP unit tests cover the same behavior.
- [ ] Shared conformance vectors are added or updated.
- [ ] `npm run generate:check` passes.
- [ ] `npm run verify` passes.
- [ ] README, DESIGN, SOURCES, and CHANGELOG are updated where relevant.
- [ ] Generated build output and `node_modules` are not committed.
