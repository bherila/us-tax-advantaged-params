# Primary-source evidence — retirement limits

The conformance vectors prove the TypeScript and PHP engines agree with each
other. They cannot prove the encoded dollar amounts are the ones the IRS
actually published: two engines reading the same mistyped table agree
perfectly. This directory closes that gap.

`primary-values.json` transcribes the figures from the notices in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/retirement-parameters.json`. The shared engine
`scripts/verify-evidence.mjs` does the comparing, so the shipped parameters are
anchored to the documents that create them rather than merely self-consistent.

```
npm run validate:evidence               # every corpus under evidence/
npm run validate:evidence:retirement    # this corpus alone
```

**402 comparisons over 2009–2026, 0 mismatches.**

## What is compared

Per plan year: §415(c)(1)(A) annual additions, §402(g)(1) elective deferral,
§457(e)(15), §414(v)(2)(B)(i) age-50 catch-up, §414(v)(2)(E)(i) age 60–63
catch-up, §414(v)(7)(A) Roth catch-up wage threshold, §401(a)(17) compensation,
§219(b)(5)(A) IRA contribution, and §219(b)(5)(B)(ii) IRA catch-up.

The 2009 and 2010 blocks additionally record three figures their notices publish
and the package models: §408(p)(2)(E) SIMPLE salary reduction, §414(v)(2)(B)(ii)
SIMPLE catch-up, and §408(k)(2)(C) SEP compensation. The 2013–2026 notices
publish them too and those blocks do not yet record them — backfilling is a
coverage gain, not a correction.

All six IRA phase-out bands, **both ends of each**: §219(g)(3) covered,
§219(g)(7)(A) spouse-covered, and §408A(c)(3) Roth. A band's width is a
convention rather than a published figure, so inferring the end from the start
would verify an assumption instead of the notice.

That holds from 2013 on, where the notice prints the range itself. Notice
2008-102 and Notice 2009-94 print only the applicable dollar amount — the band
start. For those two years the start is transcribed from the notice and the end
is the start plus the width the Code fixes: $10,000, or $20,000 on a joint
return, under §219(g)(2)(A)(ii); $10,000 in the spouse-covered case under
§219(g)(7)(B); $15,000, or $10,000 on a joint or separate return, under
§408A(c)(3)(A)(ii). The married-filing-separately start is the zero applicable
dollar amount at §219(g)(3)(B)(iii) and §408A(c)(3)(B)(ii)(III), which no notice
prints either. Each year block records which half came from where, and the
statute text is committed as `usc-26-219.pdf` and `usc-26-408A.pdf`.

The §402(g)/§457(e)(15) elective series is compared for every year it records.

## Sources

Twenty-one documents: IRS COLA notices from 2008 through 2025, the
IR-series releases that carried the figures before the notice format, SSA
Federal Register wage-base determinations, and the text of 26 U.S.C. §219 and
§408A for the phase-out widths and zero applicable dollar amounts the notices
never print. Every file is fixed by `SHA256SUMS.txt`:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).

## Two things not to "fix"

**The §414(v)(7)(A) wage threshold is keyed by the catch-up year, not the wage
year.** The IRS describes the 2025 threshold as the figure applied to 2025
wages to determine whether *2026* catch-up contributions must be Roth. The
transcription keys it by the catch-up year and the engine compares against
prior-year wages. The pairing reproduces the statute exactly; changing either
half alone breaks it.

**The data carries `null` for catch-up years 2024 and 2025 where the evidence
records $145,000.** This is a deliberate divergence, asserted rather than
skipped by the verifier. The evidence records the figure the IRS *published*;
the data records the *operative* threshold, and the engine reads `null` as "the
mandatory-Roth catch-up rule does not apply this year". Notice 2023-62 granted
an administrative transition period for §414(v)(7)(A) as added by SECURE 2.0
§603, so catch-up contributions for 2024 and 2025 satisfy the requirement
regardless of prior-year wages. The mandate first bites for 2026.

## Adding a year

Take the amounts from the notice itself, never from a summary table — summary
tables are where transcription errors originate. Add the document to
`sources/`, extend `SHA256SUMS.txt`, add the year to `primary-values.json`
citing the notice, then update `data/retirement-parameters.json` until
`npm run validate:evidence:retirement` passes.

Any figure recorded in `primary-values.json` that the verifier compares against
nothing is reported as `UNCOVERED` and fails the run, so a new parameter cannot
be recorded and then quietly ignored. Figures outside what the package models
are listed explicitly in this corpus's `unmodelled` declaration.
