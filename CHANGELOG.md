# Changelog

All notable changes to this project will be documented in this file. The project follows Semantic Versioning.

## [Unreleased]

## [0.2.0] - 2026-08-30

### Changed

- **Renamed the remaining retirement-scoped public symbols.** The package models only retirement accounts today, so these names were accurate, but they become wrong the moment a non-retirement account type lands, and renaming them after adoption would be a breaking change for real consumers. Done now, while the consumer count is zero:

  | Before | After |
  | --- | --- |
  | `RetirementAccountInput` | `AccountInput` |
  | `RetirementScenarioInput` | `ScenarioInput` |
  | `RetirementScenarioResult` | `ScenarioResult` |
  | `RetirementAccountBuilder` | `AccountBuilder` |
  | `RetirementScenario` | `Scenario` |
  | `RetirementScenarioBuilder` | `ScenarioBuilder` |
  | `RetirementParameterError` (TS) | `ParameterError` |
  | `RetirementParameterException` (PHP) | `ParameterException` |
  | `calculateRetirementScenario` (TS) | `calculateScenario` |

  This makes the surface internally consistent: the prefix was already absent from `PersonBuilder`, `RothConversionBuilder`, `AccountType`, and `UnsupportedTaxYearError`/`Exception`, so the retirement-prefixed names were the minority, not the convention. `UnsupportedTaxYearError extends ParameterError` (and the PHP equivalent) is unchanged.

  Genuinely retirement-specific *data* fields keep their names, because they describe retirement plans and will still be correct alongside other account types: `coveredByEmployerRetirementPlan` (the §219(g) active-participant test) and `selfEmployedRetirementDeduction`.

  Breaking, with no compatibility aliases. Calculation behavior, the encoded 1975-2026 parameter range, the result shape, and the conformance vectors are unchanged — the 46-vector cross-language parity suite passes untouched.

- **Renamed the package and its public symbol.** The scope is broadening from federal retirement accounts to U.S. tax-advantaged accounts generally, so the identities were changed before the package acquired consumers:
  - npm: `usa-retirement-account-parameters` → `us-tax-advantaged-params`
  - Composer: `bherila/usa-retirement-account-parameters` → `bherila/us-tax-advantaged-params`
  - TypeScript class / default export and PHP class and namespace: `USARetirementAccountParameters` → `USTaxAdvantagedParams`
  - Engine, test, and built artifact filenames follow the symbol (`src/USTaxAdvantagedParams.ts`, `php/src/USTaxAdvantagedParams.php`, `dist/{esm,cjs}/USTaxAdvantagedParams.js`, `dist/types/USTaxAdvantagedParams.d.{ts,cts}`).
  - The GitHub repository moved to `bherila/us-tax-advantaged-params`; GitHub redirects the previous path.

  This is a breaking rename with no compatibility alias. Calculation behavior, the encoded 1975-2026 parameter range, the result shape, and the conformance vectors are unchanged.

- `data/retirement-parameters.json` keeps its filename and its `./data/retirement-parameters.json` subpath export; only its `package` field was updated to the new npm name. Renaming the data file is a separate module-layout decision.

### Fixed

- `npm pack --dry-run` no longer fails through `prepack`. npm exported `npm_config_dry_run=true` into the nested `npm pack` that `check:types` runs, so no tarball was written and `attw` failed with `ENOENT`. The inner pack now passes `--no-dry-run`.

## [0.1.0] - 2026-08-28

> **The `0.1.0` published to npm on 2026-08-30 does not match this entry.** It was built from a tree that already carried the package/symbol rename listed under 0.2.0 above, so its public API is `USTaxAdvantagedParams` with the `Retirement*`-prefixed member names — a combination no tagged release describes. It exists only because the rename was published before a release entry was cut. Use 0.2.0; `0.1.0` is superseded and should be treated as a bootstrap artifact.

### Fixed

- Designated Roth governmental 457(b) contributions are now gated on their statutory 2011 start date (Small Business Jobs Act of 2010, IRC §402A(e)(1)); earlier years return `unavailable` instead of a determinate Roth deferral.
- The SIMPLE 401(k) 3% matching contribution is now computed on §401(a)(17)-capped compensation; the SIMPLE IRA match correctly remains exempt from the compensation cap.

### Changed

- Composer autoloading switched from `files` to lazy `classmap` (the engine no longer defines namespace-level constants; `PACKAGE_NAME` and `ENGINE_VERSION` are class constants).
- The PHP requirement was lowered from 8.5 to 8.2, with PHP 8.2-8.5 tested in CI.
- The npm package now ships a CommonJS-flavored `.d.cts` declaration for `require` consumers and exports `./data/retirement-parameters.json` and `./package.json` through the exports map.

### Added

- Error-expectation conformance vectors (`expectError`) exercised by both native suites and the cross-language parity check, plus new vectors covering MFS phase-outs, modern spousal IRAs, ordinary age-50 catch-up, age-64 reversion, and effective-year boundaries (1975, 2010, 2020, 2023).
- `@arethetypeswrong/cli` package-resolution gate, tag-triggered npm publish workflow with provenance, and Dependabot configuration.
- Native single-file TypeScript and PHP retirement-account calculation engines.
- Builder and direct-input interfaces for taxpayers, spouses, accounts, existing contributions, plan rules, and Roth conversions.
- Historical parameter coverage from 1975 through 2026 without future-year extrapolation.
- Traditional/Roth IRA sharing, IRA deduction and Roth phase-outs, spousal IRA compensation, historical restrictions, and nondeductible IRA treatment.
- Qualified-plan §402(g), §414(v), and §415(c) shared-pool allocation.
- Governmental and nongovernmental 457(b), 403(b) 15-year catch-up, 457(b) special catch-up, SIMPLE, SEP, SARSEP, TSP, employer-only plans, and explicit actuarial indeterminacy for pensions.
- Enhanced age-60-to-63 catch-up and high-wage Roth catch-up classification.
- IRA-to-Roth, qualified-plan-to-Roth-IRA, and in-plan Roth conversion calculations with aggregate pro-rata IRA basis.
- Canonical annual data, generation tooling, native tests, shared conformance vectors, and complete cross-runtime parity checking.
- ESM, CommonJS, TypeScript declarations, Composer manifest, CI, release validation, documentation, and MIT license.

#### Pre-release corrections

- Apply the applicable §401(a)(17) recognized-compensation ceiling before multiplying compensation by employer nonelective, employer matching, and common-law SEP contribution rates.
- For self-employed percentage contributions, compare the reduced-rate net-earnings amount with recognized compensation multiplied by the unreduced plan rate before applying other annual limits.
- Preserve actual-compensation treatment for employee elective deferrals rather than imposing the §401(a)(17) ceiling as an additional §402(g) cutoff.
