# Release Status

## usa-retirement-account-parameters@0.1.0

**Local validation:** PASS

The engines encode 1975-2026, include 27 shared conformance vectors, and produce ESM, CommonJS, declaration, and native PHP artifacts.

### Completed

- §401(a)(17) recognized-compensation correction in TypeScript and PHP.
- Common-law SEP, employer nonelective, matching-formula, and self-employed worksheet regression coverage.
- Canonical data validation and regenerated native parameter blocks.
- npm and Composer manifests, lockfile, MIT license, documentation, security/contribution policies, and CI.
- Native unit tests, shared conformance tests, complete serialized-output parity, and dual-module smoke imports.
- npm package-content dry run.

### Publication gate

All checks available in this local environment passed.
The local runtime is PHP 8.4.23; PHP 8.5 is configured in CI but was not available in this container. A green PHP 8.5 CI run remains a publication gate.
Composer was not installed locally; `composer validate --strict` and `composer test` are configured in CI.

See `VALIDATION.md` and `validation-status.json` for exact commands and output.
