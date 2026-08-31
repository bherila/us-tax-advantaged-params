# Agent instructions

Instructions for AI coding agents working in this repository. Read
[DESIGN.md](DESIGN.md) before changing calculation semantics and
[SOURCES.md](SOURCES.md) / [CONTRIBUTING.md](CONTRIBUTING.md) before changing
legal parameters.

## What this repository is

A dual-runtime library encoding U.S. retirement-account contribution limits,
phase-outs, shared-limit allocation, and Roth-conversion tax effects for tax
years 1975 onward:

- `src/USTaxAdvantagedParams.ts` — native TypeScript engine (npm).
- `php/src/USTaxAdvantagedParams.php` — native PHP 8.5+ engine
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
   pinned in both languages. A vector declares exactly one of `expect`
   (result-path assertions) or `expectError` (`{"code": ...}` for inputs that
   must throw); both kinds run in each native suite and in the parity check.
5. **Money math**: outputs are rounded to cents, allocation is deterministic
   (ascending `priority`, then input order), and phase-outs use IRS
   worksheet-style rounding to the encoded increment with the encoded positive
   reduced minimum. Preserve these semantics.
6. **Never weaken, skip, or special-case a check to get green.** If something
   legitimately cannot pass, leave it failing and say so. A green gate obtained
   by loosening the gate is worse than a red one.
7. **Derive expected values from the statute or the primary source, never from
   engine output.** A vector or test written from the implementation proves only
   that the implementation does what it does. Record the derivation in the
   vector's `description`. When a vector and an engine disagree, work out which
   is wrong before changing either, and say which it was.
8. **Prove a regression test fails without its fix.** Stash the source change,
   re-run the test, quote the failure, restore. A test that would have passed
   without the fix is not a regression test.
9. **Fixtures carry synthetic values only.** Never real taxpayer data, and never
   a real figure rescaled — a rescaled real series is still the real series.

## Naming

Public symbols carry **no** domain prefix. The `Retirement` prefix was dropped in
0.2.0 when the package broadened beyond retirement accounts: the surface is
`AccountInput`, `ScenarioInput`, `ScenarioResult`, `AccountBuilder`, `Scenario`,
`ScenarioBuilder`, `ParameterError` / `ParameterException`, and
`calculateScenario`. Do not reintroduce a domain-prefixed parallel surface where
a shared name fits — a new account domain extends these types, it does not clone
them.

Domain-scoped *detail* types are a different thing and are correct: `HsaRulesInput`,
`HsaAccountDetail`, and `HsaYearParameters` name IRC §223-specific structures that
genuinely have no shared counterpart. Retirement-specific *data field* names such
as `coveredByEmployerRetirementPlan` are likewise correct and stay.

## Documentation

**There is no CHANGELOG in this repository.** It was deliberately removed; do not
recreate one. User-facing behaviour goes in `README.md` and provenance goes in
`SOURCES.md`.

**Do not bump the version or create a tag as part of feature work.** Releasing is
a separate act. The version lives in four places kept in sync by
`npm run validate:manifests` — `package.json`, `package-lock.json`, and
`ENGINE_VERSION` in each engine — so a partial bump fails the gate rather than
shipping a mismatch.

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
npm run validate:evidence # compare every evidence corpus against the data it backs
```

## Evidence

Evidence corpora live under `evidence/<corpus>/`: the source documents in
`sources/`, a `primary-values.json` transcription taken verbatim from those
documents, a `SHA256SUMS.txt` fixing them, and a `verifier-config.mjs` declaring
how recorded fields map onto the data file. `scripts/verify-evidence.mjs` is the
only comparison engine and the only report format; corpora contribute
declarations, never logic. It discovers corpora by scanning `evidence/`, so a
directory without a loadable `verifier-config.mjs` fails rather than being
silently skipped.

- **Transcribe from the document itself, never from a summary table.** Summary
  tables are where transcription errors originate.
- **A recorded figure compared against nothing fails as `UNCOVERED`.** This is
  deliberate: a parameter cannot be transcribed and then quietly ignored. A
  figure the package genuinely does not model goes in the corpus config's
  `unmodelled` declaration, so gaining coverage later is a visible change.
- **A deliberate evidence-vs-data divergence is asserted against its reconciled
  value, never skipped.** The worked example is the Notice 2023-62 case in
  `evidence/retirement-limits/verifier-config.mjs`: the evidence records the
  §414(v)(7)(A) threshold the IRS *published* for catch-up years 2024 and 2025,
  the data records `null` because the transition period suspended the mandate,
  and the verifier's `reconciled` map asserts the data equals `null`. Drifting
  off the reconciled value is still a failure. Copy that pattern; do not add a
  skip.
- **Evidence ships in neither artifact.** npm excludes it via the `files`
  allowlist in `package.json`; Composer excludes it via `/evidence export-ignore`
  in `.gitattributes`. A new corpus must inherit both — check with
  `npm pack --dry-run`.

Two traps, both hit in practice:

- **WebFetch's summariser mangles IRS PDFs.** It has returned figures from the
  wrong year and reported real, non-empty documents as empty. `curl` the PDF and
  extract the text with `pypdf`, then read the extracted text.
- **`SHA256SUMS.txt` lists bare filenames**, so it verifies only from inside
  `sources/`:
  ```bash
  cd evidence/<corpus>/sources && shasum -a 256 -c ../SHA256SUMS.txt
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
