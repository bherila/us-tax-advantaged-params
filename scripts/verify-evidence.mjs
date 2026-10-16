#!/usr/bin/env node
/**
 * Bind the shipped parameter data to the primary sources recorded under
 * evidence/.
 *
 * The conformance vectors prove the TypeScript and PHP engines agree with each
 * other. They cannot prove the encoded dollar amounts are the ones Congress and
 * the IRS actually published — two engines reading the same mistyped table agree
 * perfectly. This narrows that gap by comparing the shipped parameters against
 * figures transcribed by hand from the notices and Revenue Procedures.
 *
 * What it proves and what it does not: the comparison is JSON against JSON. It
 * does not read a PDF and it cannot check a transcription. What it does check is
 * that the documents are the ones the corpus was transcribed from, by verifying
 * every file in a corpus's sources/ against its SHA256SUMS.txt, and that every
 * recorded figure is either compared or explicitly declared unmodelled. A
 * transcription error that was copied into data/ at the same time still passes.
 *
 * Each corpus under evidence/ owns a `primary-values.json` transcription, taken
 * verbatim from the source text, and a `verifier-config.mjs` declaring how its
 * recorded fields map onto the data file. This script is the only comparison
 * engine and the only report format; a corpus contributes declarations, never
 * logic. Corpora are discovered by scanning evidence/, so a new corpus is
 * checked as soon as it exists — a directory without a `verifier-config.mjs`
 * fails rather than being skipped.
 *
 * Update a transcription from the source document, never from a summary table,
 * then update the data to match.
 *
 * Usage: node scripts/verify-evidence.mjs [corpus...] [--json]
 *   corpus  Directory name under evidence/ (e.g. `retirement-limits`) or its
 *           leading segment (`retirement`). Default: every corpus.
 * Exits 0 when every source document matches its recorded digest and every
 * comparable figure in every selected corpus matches, 1 otherwise.
 */

import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { METADATA, at, figures, loadCorpora, readJson, root } from "./lib/evidence-corpus.mjs";

/**
 * Verify a corpus's source documents against its SHA256SUMS.txt.
 *
 * SHA256SUMS.txt used to be an instruction in a README with no code path, which
 * meant the corpus was bound to *some* document with the right name rather than
 * to the bytes it was transcribed from. This makes it a check. It runs in both
 * directions: a listed file that is missing or has drifted fails, and so does a
 * file sitting in sources/ that nothing attests to.
 *
 * It does not read the documents' contents, so it proves provenance of the
 * bytes, not fidelity of the transcription.
 */
function verifyDigests(corpusId) {
  const dir = join(root, "evidence", corpusId);
  const problems = [];
  let manifest;
  try {
    manifest = readFileSync(join(dir, "SHA256SUMS.txt"), "utf8");
  } catch (error) {
    return { problems: [`SHA256SUMS.txt is unreadable: ${error.message}`], documents: 0 };
  }

  const recorded = new Map();
  for (const line of manifest.split("\n")) {
    if (line.trim() === "") continue;
    // `shasum -a 256` writes "<hex>  <name>"; the binary form uses "<hex> *<name>".
    const match = /^([0-9a-f]{64})\s[\s*](.+)$/.exec(line);
    if (!match) {
      problems.push(`SHA256SUMS.txt has an unparsable line: ${line}`);
      continue;
    }
    recorded.set(match[2].trim(), match[1]);
  }

  let present;
  try {
    present = readdirSync(join(dir, "sources"), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name !== ".DS_Store")
      .map((entry) => entry.name);
  } catch (error) {
    return { problems: [`sources/ is unreadable: ${error.message}`], documents: 0 };
  }

  for (const [name, expected] of recorded) {
    if (!present.includes(name)) {
      problems.push(`${name} is listed in SHA256SUMS.txt but absent from sources/`);
      continue;
    }
    const actual = createHash("sha256").update(readFileSync(join(dir, "sources", name))).digest("hex");
    if (actual !== expected) problems.push(`${name} digest ${actual} does not match the recorded ${expected}`);
  }
  for (const name of present) {
    if (!recorded.has(name)) problems.push(`${name} is in sources/ but nothing in SHA256SUMS.txt attests to it`);
  }

  return { problems, documents: recorded.size };
}

/**
 * Compare one corpus's transcription against its data file.
 *
 * Three declarative field kinds cover every recorded shape so far:
 *
 * - `scalars`  a single figure at a data path.
 * - `tiered`   a figure recorded per member (coverage tier, filing status),
 *              compared member by member. Deriving one member from another
 *              would verify an assumption rather than the source document.
 * - `bands`    a {start, end} range recorded per member against a [start, end]
 *              pair in the data. Both ends are compared: a band's width is a
 *              convention, not a published figure. A member maps to a data
 *              member name, or to `{ data, citation }` when that member rests
 *              on a different authority than the rest of the band — a band the
 *              annual notice publishes can still have one member the notice
 *              never mentions because the Code fixes it.
 *
 * plus `series`, for a transcription section keyed by year outside the main
 * year blocks.
 */
function verifyCorpus(config) {
  const parameters = readJson(config.data);
  const primary = readJson(config.evidence);
  const blocks = primary[config.yearBlocks ?? "planYears"];
  const aliases = new Map(Object.entries(config.aliases ?? {}));
  const unmodelled = new Set(config.unmodelled ?? []);
  const reconciled = new Map(Object.entries(config.reconciled ?? {}));

  const results = [];
  /**
   * Evidence field names that at least one comparison consumed. Tracked by
   * field rather than parsed back out of the label so that a reconciled or
   * per-member label still counts as coverage of its field.
   */
  const comparedFields = new Set();
  const record = (year, field, label, expected, actual, citation) => {
    if (field !== null) comparedFields.add(field);
    results.push({ year, label, expected, actual, citation, ok: expected === actual });
  };

  for (const item of figures(config, parameters, primary)) {
    const { yearKey, field, citation } = item;
    switch (item.kind) {
      case "missingYear":
        results.push({ year: yearKey, label: "(year block)", expected: "present", actual: "missing", citation: "-", ok: false });
        break;
      case "scalar": {
        // A deliberate evidence-vs-data divergence is asserted against the
        // reconciled value, never skipped: if the data stops matching that value,
        // that is still a failure.
        const override = reconciled.get(`${yearKey}:${field}`);
        const expected = override ? override.value : item.value;
        const label = override ? `${field} (${override.why})` : field;
        record(yearKey, field, label, expected, at(item.year, item.path) ?? null, citation);
        break;
      }
      case "tiered":
        record(yearKey, field, `${field}.${item.member}`, item.value, at(item.year, item.path) ?? null, citation);
        break;
      case "band": {
        const actual = at(item.year, item.path);
        record(yearKey, field, `${field}.${item.member}.start`, item.value.start, actual?.[0], citation);
        record(yearKey, field, `${field}.${item.member}.end`, item.value.end, actual?.[1], citation);
        break;
      }
      case "series":
        record(yearKey, null, item.label, item.value, at(item.year, item.path), citation);
        break;
    }
  }

  // Any recorded figure neither compared nor explicitly excluded is a silent
  // gap: a parameter cannot be transcribed and then quietly ignored.
  const uncovered = [];
  for (const rawBlock of Object.values(blocks)) {
    for (const rawKey of Object.keys(rawBlock)) {
      const key = aliases.get(rawKey) ?? rawKey;
      if (METADATA.test(rawKey) || unmodelled.has(key) || comparedFields.has(key)) continue;
      if (!uncovered.includes(key)) uncovered.push(key);
    }
  }

  const years = Object.keys(blocks);
  const digests = verifyDigests(config.id);
  return {
    corpus: config.id,
    comparisons: results.length,
    failures: results.filter((result) => !result.ok),
    uncovered,
    documents: digests.documents,
    digestProblems: digests.problems,
    range: `${years[0]}-${years[years.length - 1]}`,
  };
}

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const requested = args.filter((arg) => !arg.startsWith("--"));

let available;
try {
  available = await loadCorpora();
} catch (error) {
  console.error(`UNCHECKED ${error.message}`);
  process.exit(1);
}
const selected = requested.length === 0
  ? available
  : requested.map((name) => {
      const match = available.find((corpus) => corpus.id === name || corpus.id.split("-")[0] === name);
      if (!match) {
        console.error(`Unknown evidence corpus '${name}'. Available: ${available.map((c) => c.id).join(", ")}`);
        process.exit(2);
      }
      return match;
    });

const reports = selected.map(verifyCorpus);
const clean = reports.every(
  (report) => report.failures.length === 0 && report.uncovered.length === 0 && report.digestProblems.length === 0,
);

if (asJson) {
  console.log(JSON.stringify({ corpora: reports }, null, 2));
} else {
  for (const report of reports) {
    for (const failure of report.failures) {
      console.error(
        `MISMATCH ${report.corpus} ${failure.year} ${failure.label}: evidence ${failure.expected}, data ${failure.actual}  [${failure.citation}]`,
      );
    }
    for (const key of report.uncovered) {
      console.error(`UNCOVERED ${report.corpus} ${key} is recorded in the evidence but compared against nothing`);
    }
    for (const problem of report.digestProblems) {
      console.error(`DIGEST ${report.corpus} ${problem}`);
    }
    console.log(
      report.failures.length === 0 && report.uncovered.length === 0 && report.digestProblems.length === 0
        ? `Primary-source verification (${report.corpus}) passed: ${report.comparisons} comparisons over ${report.range}, 0 mismatches, ${report.documents} source documents hash-verified.`
        : `Primary-source verification (${report.corpus}) FAILED: ${report.failures.length} mismatch(es), ${report.uncovered.length} uncovered field(s), ${report.digestProblems.length} document digest problem(s), of ${report.comparisons} comparisons.`,
    );
  }
}

process.exit(clean ? 0 : 1);
