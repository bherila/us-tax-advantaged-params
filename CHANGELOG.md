# Changelog

All notable changes to this project will be documented in this file. The project follows Semantic Versioning.

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
