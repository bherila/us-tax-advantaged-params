# Primary-source evidence — retirement limits

The conformance vectors prove the TypeScript and PHP engines agree with each
other. They cannot prove the encoded dollar amounts are the ones the IRS
actually published: two engines reading the same mistyped table agree
perfectly. This directory narrows that gap, and the next section says by how
much.

`primary-values.json` transcribes the figures from the notices in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/retirement-parameters.json`. The shared engine
`scripts/verify-evidence.mjs` does the comparing.

## What this proves, and what it does not

The comparison is JSON against JSON. The verifier never opens a PDF and cannot
read a figure out of one. It proves three things:

- every shipped parameter it covers equals the figure a human transcribed from
  the notice, so the two files cannot drift apart afterwards;
- no transcribed figure is quietly ignored — one compared against nothing fails
  as `UNCOVERED`, and one outside what the package models has to be declared;
- the documents in `sources/` are byte-for-byte the ones `SHA256SUMS.txt`
  records, checked on every run rather than by an instruction someone might
  follow.

It does not prove the transcription is right. A figure misread from the notice
and copied into `data/` in the same sitting passes with 0 mismatches, because
both sides of the comparison carry the same mistake. Nothing here substitutes
for reading the document — take the amounts from the notice text itself, never
from a summary table, and expect a second reader to check them.

```
npm run validate:evidence               # every corpus under evidence/
npm run validate:evidence:retirement    # this corpus alone
```

The checked comparison count is reported by `npm run validate:evidence:retirement`.

## What is compared

Per plan year: §415(c)(1)(A) annual additions, §402(g)(1) elective deferral,
§402(g)(7) annual, lifetime, and service-based 403(b) 15-year catch-up limits,
§457(e)(15), §414(v)(2)(B)(i) age-50 catch-up, §414(v)(2)(E)(i) age 60–63
catch-up, §414(v)(7)(A) Roth catch-up wage threshold, §401(a)(17) compensation,
§219(b)(5)(A) IRA contribution, and §219(b)(5)(B)(ii) IRA catch-up.

Representative years also bind every modeled `ira` policy field: the historical
compensation fraction and employer-plan eligibility rule, nondeductible and
spousal availability, the retired fixed-spousal-limit fields as `null`, the
pre-2020 age-70½ restriction, and pre-Roth availability.

Every available plan-year block transcribes three additional figures that its
notice publishes and the package models: §408(p)(2)(E) SIMPLE salary reduction,
§414(v)(2)(B)(ii) SIMPLE catch-up, and §408(k)(2)(C) SEP compensation. For
2024–2026, it also binds the SECURE 2.0-era certain-SIMPLE, additional
nonelective, and starter-plan dollar limits published in the notices. Section
457(e)(15) base deferrals are compared in both the plan-year blocks and the
separate elective-deferral/457 series; the latter retains its wider treatment
for the historical releases.

2024 through 2026 also record the §402A(e)(3)(A)(i) pension-linked emergency
savings account limitation. The notices state it for 2025 and 2026 only — Notice
2023-75 is silent — so 2024 is transcribed from 26 U.S.C. §402A itself, whose
flush text adjusts the amount only "[i]n the case of contributions made in taxable
years beginning after December 31, 2024", leaving the first effective year on the
unadjusted statutory $2,500. The 2024 block also records the availability flag,
cited to Pub. L. 117-328 section 127(g), which applies §127 to "plan years
beginning after December 31, 2023".

All seven IRA phase-out bands, **both ends of each**: §219(g)(3) covered,
§219(g)(7)(A) spouse-covered, and §408A(c)(3) Roth. A band's width is a
convention rather than a published figure, so inferring the end from the start
would verify an assumption instead of the notice.

Seven, not six: the spouse-covered family has a married-filing-separately band
as well as a joint one. The data has always carried it and the verifier used to
compare only the joint member, so it went unchecked in every year — silently,
because `UNCOVERED` scans evidence keys and this gap was a missing evidence key,
not an unused one.

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

The enacted texts of ERISA, the Tax Reform Act of 1976, the Revenue Act of 1978,
and ERTA establish the 1975–86 discontinuities. The remaining sources include
IRS COLA notices and Bulletin publications from 1996 through 2025; annual IRS
Publication 590 editions for 1995 through 2000 and 2002; IRS CODA and SEP/SARSEP
technical guidance; the IR-series releases that carried the figures before the
notice format; EGTRRA's enacted text; SSA Federal Register wage-base
determinations; and the text of 26 U.S.C. §§219, 402, 402A, 408, and 408A for
statutory amounts the notices never print. Every file is fixed by
`SHA256SUMS.txt`, which
`npm run validate:evidence` verifies in both directions: a listed file that is
missing or has changed fails, and so does a file in `sources/` that nothing
attests to. The manual form, which reads only the bare filenames in the
manifest and so must run from inside `sources/`:

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
`sources/`, extend `SHA256SUMS.txt` (a document with no entry now fails the
run), add the year to `primary-values.json` citing the notice, then update
`data/retirement-parameters.json` until `npm run validate:evidence:retirement`
passes.

Any figure recorded in `primary-values.json` that the verifier compares against
nothing is reported as `UNCOVERED` and fails the run, so a new parameter cannot
be recorded and then quietly ignored. Figures outside what the package models
are listed explicitly in this corpus's `unmodelled` declaration.
