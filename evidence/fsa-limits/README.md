# Primary-source evidence — flexible spending arrangement limits

Two statutes with two different publication habits share this corpus. The
§125(i) health FSA salary-reduction limit is indexed and published in the
**annual inflation-adjustment Revenue Procedure** — the general one, carrying
dozens of unrelated parameters, not an FSA-specific document. The §129(a)(2)(A)
dependent care exclusion is a fixed statutory amount that appears in **no**
Revenue Procedure at all and is cited to the Code and to the two acts that
changed it.

`primary-values.json` transcribes the figures from the documents in `sources/`,
and `verifier-config.mjs` declares how each recorded field maps onto
`data/fsa-parameters.json`. The shared engine `scripts/verify-evidence.mjs`
does the comparing — these figures have their own corpus, not their own
checking logic. What that comparison does and does not prove is set out in the
retirement corpus README under "What this proves, and what it does not"; it
holds identically here.

```
npm run validate:evidence        # every corpus under evidence/
npm run validate:evidence:fsa    # this corpus alone
```

**108 comparisons over 1987–2026, 0 mismatches, 29 source documents
hash-verified.**

## What is compared

Per year from 2013: the §125(i) dollar limitation on salary reduction
contributions to a health FSA, and the maximum carryover out of that plan year.

Per year from 1987: the §129(a)(2)(A) exclusion, **both members** — the general
amount and the married-filing-separately amount. The separate-return amount is
half the general amount in every year encoded, but that is a pattern rather than
a published rule. The statute writes both figures out, and Pub. L. 117-2 §9632
wrote its 2021 substitution as `"$10,500 (half such dollar amount"` rather than
as two numbers, so deriving one from the other would verify an assumption
instead of the statute.

`healthFsa` is `null` for 1987 through 2012 and those year blocks record no
health FSA fields, so nothing is compared for them and nothing is defaulted.

## Sources
`usc-26-21.pdf` is committed because IRC 129(a)(2)(C) determines marital status
by reference to IRC 21(e)(3) and (4), so the considered-unmarried rule the
engine applies to a married-separate return is IRC 21's text rather than
IRC 129's. The same document contains the IRC 21(d)(2) deemed-earned-income
schedule, which is deliberately **not** encoded: it is not static across
1987-2026 and this package does not derive income. Its presence here attests
the marital-status rule only.



Twenty-eight documents, fixed by `SHA256SUMS.txt`, which
`npm run validate:evidence` verifies on every run — a listed file that is
missing or has changed fails, and so does a file in `sources/` that nothing
attests to. The manual form must run from inside `sources/`, since the manifest
lists bare filenames:

```
cd sources && shasum -a 256 -c ../SHA256SUMS.txt
```

Documents published by the U.S. government are not subject to copyright
(17 U.S.C. §105).

## Five things not to "fix"

**The dependent care amounts are not in any Revenue Procedure.** They are not
inflation-adjusted, so the annual procedures are silent on them. They are cited
to 26 U.S.C. §129 and to Pub. L. 117-2 §9632 and Pub. L. 119-21 §70404. This is
the same shape as the HSA corpus citing the §223(b)(3)(B) age-55 amount to the
statute.

**`usc-26-129.pdf` is the 2024 edition of the Code and still prints
$5,000/$2,500.** Pub. L. 119-21 §70404 struck `"$5,000 ($2,500"` and inserted
`"$7,500 ($3,750"` for taxable years beginning after December 31, 2025, so 2026
is read out of `pl-119-21.pdf`, not out of the Code text. A year block generated
from the Code text alone would be wrong for 2026.

**2013 has no Revenue Procedure figure.** `irb12-45.pdf` carries Rev. Proc.
2012-41, whose §3 list of 2013 adjusted items contains no Cafeteria Plans entry
— the word "cafeteria" does not appear in the document. That is consistent with
§125(i)(2), which indexes only for taxable years beginning after December 31,
2013, so 2013 is the raw statutory $2,500 and Notice 2012-40 is the sole
authority. The bulletin is committed as the negative evidence.

**2018 was reissued, but not this figure.** Rev. Proc. 2018-18, inside
`irb18-10.pdf`, reissued the 2018 inflation figures after the Tax Cuts and Jobs
Act changed the indexing measure. Its §3 and §5 enumerate the sections of Rev.
Proc. 2017-58 it modifies and supersedes, and the list runs `3.14, 3.15, 3.18` —
§3.16, Cafeteria Plans, is absent. So the operative 2018 authority is Rev. Proc.
2017-58 §3.16 at $2,650, unmodified. Both documents are committed so the
reasoning stays auditable. Note that `rp-18-18.pdf` does not exist on irs.gov;
the bulletin is the official form of that document, not a substitute for it.

**The carryover figure belongs to the year the money came *from*.** Notice
2013-71 created it at a fixed $500 and Notice 2020-33 raised it to 20 percent of
the §125(i) limit "for that plan year", both phrased as the maximum unused
amount *from* a plan year carried to the immediately following one. Rev. Proc.
2013-35 through Rev. Proc. 2019-44 state the §125(i) limit and **no** carryover
figure; Rev. Proc. 2020-45 is the first annual procedure here to state one
itself, and every stated figure is 20 percent of that same year's limit, which
is what confirms the direction.

## Adding a year

Take the §125(i) amount and the carryover from the Revenue Procedure itself,
never from a summary table. The §129 amounts change only by statute — if they
have not been amended, the existing citation carries forward; if they have, add
the enrolled act to `sources/`. Add each document, extend `SHA256SUMS.txt` (a
document with no entry now fails the run), add the year to
`primary-values.json`, then update `data/fsa-parameters.json` until
`npm run validate:evidence:fsa` passes.

A figure recorded in `primary-values.json` that is compared against nothing is
reported as `UNCOVERED` and fails the run, so a new parameter cannot be recorded
and then quietly ignored.
