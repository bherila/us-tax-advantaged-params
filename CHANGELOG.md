# Changelog

All notable changes to this project will be documented in this file. The project follows Semantic Versioning.

## [Unreleased]

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

## [0.1.0] - 2026-08-27

### Added

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

### Fixed

- Apply the applicable §401(a)(17) recognized-compensation ceiling before multiplying compensation by employer nonelective, employer matching, and common-law SEP contribution rates.
- For self-employed percentage contributions, compare the reduced-rate net-earnings amount with recognized compensation multiplied by the unreduced plan rate before applying other annual limits.
- Preserve actual-compensation treatment for employee elective deferrals rather than imposing the §401(a)(17) ceiling as an additional §402(g) cutoff.
