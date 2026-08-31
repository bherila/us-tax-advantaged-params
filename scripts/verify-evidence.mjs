#!/usr/bin/env node
/**
 * Bind the shipped parameter data to the primary sources recorded under
 * evidence/.
 *
 * The conformance vectors prove the TypeScript and PHP engines agree with each
 * other. They cannot prove the encoded dollar amounts are the ones Congress and
 * the IRS actually published — two engines reading the same mistyped table agree
 * perfectly. This closes that gap by comparing the shipped parameters against
 * figures transcribed from the notices and Revenue Procedures themselves.
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
 * Exits 0 when every comparable figure in every selected corpus matches,
 * 1 otherwise.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

/**
 * Non-figure keys in a year block: provenance and commentary, not amounts to
 * compare. Everything else must be either compared or explicitly declared
 * unmodelled, or the run fails with UNCOVERED.
 */
const METADATA = /^(source|_.*|.*_note|.*_source)$/;

/** Resolve `path` against `obj`, tolerating a null or missing intermediate. */
const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Load every corpus config under evidence/, sorted by directory name. */
async function loadCorpora() {
  const dirs = readdirSync(join(root, "evidence"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const corpora = [];
  for (const dir of dirs) {
    const configPath = join(root, "evidence", dir, "verifier-config.mjs");
    let module;
    try {
      module = await import(pathToFileURL(configPath).href);
    } catch (error) {
      throw new Error(
        `evidence/${dir} has no loadable verifier-config.mjs, so its figures would never be checked: ${error.message}`,
      );
    }
    corpora.push({ id: dir, ...module.default });
  }
  return corpora;
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
 *              convention, not a published figure.
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

  for (const [yearKey, rawBlock] of Object.entries(blocks)) {
    const year = parameters.years[yearKey];
    if (!year) {
      results.push({ year: yearKey, label: "(year block)", expected: "present", actual: "missing", citation: "-", ok: false });
      continue;
    }

    /** Field names differ between transcription and data in a few places. */
    const block = {};
    for (const [key, value] of Object.entries(rawBlock)) block[aliases.get(key) ?? key] = value;

    for (const [field, path, citation] of config.scalars ?? []) {
      if (!(field in block)) continue;
      // A deliberate evidence-vs-data divergence is asserted against the
      // reconciled value, never skipped: if the data stops matching that value,
      // that is still a failure.
      const override = reconciled.get(`${yearKey}:${field}`);
      const expected = override ? override.value : block[field];
      const label = override ? `${field} (${override.why})` : field;
      record(yearKey, field, label, expected, at(year, path) ?? null, citation);
    }

    for (const [field, path, members, citation] of config.tiered ?? []) {
      const recorded = block[field];
      if (!recorded) continue;
      for (const member of members) {
        if (!(member in recorded)) continue;
        record(yearKey, field, `${field}.${member}`, recorded[member], at(year, [...path, member]) ?? null, citation);
      }
    }

    for (const [field, path, members, citation] of config.bands ?? []) {
      const recorded = block[field];
      if (!recorded) continue;
      for (const [evidenceMember, dataMember] of Object.entries(members)) {
        const expected = recorded[evidenceMember];
        if (!expected) continue;
        const actual = at(year, [...path, dataMember]);
        record(yearKey, field, `${field}.${evidenceMember}.start`, expected.start, actual?.[0], citation);
        record(yearKey, field, `${field}.${evidenceMember}.end`, expected.end, actual?.[1], citation);
      }
    }
  }

  // Sections recorded outside the year blocks, typically because they span more
  // years than those blocks do.
  for (const series of config.series ?? []) {
    for (const [yearKey, entry] of Object.entries(primary[series.section] ?? {})) {
      const year = parameters.years[yearKey];
      if (!year) continue;
      for (const [label, evidencePath, dataPath, citation] of series.comparisons) {
        record(yearKey, null, label, at(entry, evidencePath), at(year, dataPath), citation);
      }
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
  return {
    corpus: config.id,
    comparisons: results.length,
    failures: results.filter((result) => !result.ok),
    uncovered,
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
const clean = reports.every((report) => report.failures.length === 0 && report.uncovered.length === 0);

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
    console.log(
      report.failures.length === 0 && report.uncovered.length === 0
        ? `Primary-source verification (${report.corpus}) passed: ${report.comparisons} comparisons over ${report.range}, 0 mismatches.`
        : `Primary-source verification (${report.corpus}) FAILED: ${report.failures.length} mismatch(es), ${report.uncovered.length} uncovered field(s), of ${report.comparisons} comparisons.`,
    );
  }
}

process.exit(clean ? 0 : 1);
