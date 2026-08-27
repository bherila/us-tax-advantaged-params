# Agent instructions

Instructions for AI coding agents working in this repository. Read
[DESIGN.md](DESIGN.md) before changing calculation semantics and
[SOURCES.md](SOURCES.md) / [CONTRIBUTING.md](CONTRIBUTING.md) before changing
legal parameters.

## What this repository is

A dual-runtime library encoding U.S. retirement-account contribution limits,
phase-outs, shared-limit allocation, and Roth-conversion tax effects for tax
years 1975 onward:

- `src/USARetirementAccountParameters.ts` — native TypeScript engine (npm).
- `php/src/USARetirementAccountParameters.php` — native PHP 8.5+ engine
  (Packagist).
- `data/retirement-parameters.json` — the single source of truth for annual
  legal parameters.
- `data/conformance-vectors.json` — language-neutral behavioral fixtures both
  engines must reproduce exactly.

## Hard rules

1. **Never hand-edit generated blocks.** Both engines contain marked generated
   regions produced by `scripts/generate.mjs` from
   `data/retirement-parameters.json`. Edit the JSON, then run
   `npm run generate`. `npm run generate:check` (run in CI) fails on drift.
2. **The two engines must stay in behavioral lockstep.** Any semantic change to
   one engine must be mirrored natively in the other in the same change.
   `scripts/check-parity.mjs` compares complete serialized output for every
   conformance vector; it must pass.
3. **Legal parameters come from primary authority only** (IRS notices, statutes,
   Revenue Procedures — see SOURCES.md). Never inflation-extrapolate an
   unannounced year, never silently reuse a prior year's value, and record the
   source for each new annual row. When a historical rule cannot be reduced to a
   universal value, return `indeterminate` with a diagnostic — do not invent a
   modernized approximation.
4. **Behavioral changes need conformance vectors.** Add or update vectors in
   `data/conformance-vectors.json` alongside the change so the behavior is
   pinned in both languages.
5. **Money math**: outputs are rounded to cents, allocation is deterministic
   (ascending `priority`, then input order), and phase-outs use IRS
   worksheet-style rounding to the encoded increment with the encoded positive
   reduced minimum. Preserve these semantics.

## Commands

```bash
npm ci                    # install (no runtime deps; dev-only toolchain)
npm run verify            # full local gate: data validation, generate:check,
                          # typecheck, TS + PHP tests, build, smoke imports,
                          # TS/PHP parity, manifest validation
npm run test:ts           # TypeScript unit + conformance tests (node --test)
npm run test:php          # PHP unit + conformance tests (plain PHP, no PHPUnit)
npm run test:parity       # build then full-output TS/PHP parity
npm run generate          # regenerate embedded data blocks in both engines
npm run validate:data     # canonical-format and range validation of the JSON
```

PHP 8.5+ and Node 20+ are required locally; CI runs Node 20/22/24 and PHP 8.5
on GitHub-hosted arm64 runners (`ubuntu-24.04-arm`).

`npm run verify` rewrites `VALIDATION.md`, `RELEASE_STATUS.md`, and
`validation-status.json`; commit those regenerated files with the change that
produced them.

## Adding a new tax year

1. Add one row to `data/retirement-parameters.json` from primary authority;
   update the declared maximum year.
2. Cite the source in SOURCES.md.
3. `npm run generate`, then `npm run verify`.
4. Add conformance vectors exercising anything new that year (new limits,
   phase-out ranges, effective-date rules).

## Scope boundary

The engine calculates statutory parameters from caller-supplied facts. It does
not prepare returns, derive MAGI, compute SE tax, model state tax, RMDs,
nondiscrimination testing, or plan-document eligibility. Keep new features
inside this boundary; prefer an `indeterminate` status plus diagnostics over
guessing.
