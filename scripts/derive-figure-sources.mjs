#!/usr/bin/env node
/**
 * Derive, for every figure the evidence corpora verify, which primary source
 * published it, and write the result beside each data file as
 * `data/<table>-figure-sources.json`. The legal data files stay hand-reviewed;
 * this sidecar is machine-written.
 * The engines embed that block and return it from the `*ParameterSourcesForYear`
 * lookups, so a consumer can show "IRC 402(g)(1), $24,500 for 2026, Notice
 * 2025-67" without re-deriving provenance.
 *
 *   node scripts/derive-figure-sources.mjs          write the data files
 *   node scripts/derive-figure-sources.mjs --check  fail if any would change
 *
 * The attribution is derived, never hand-written, from three declarations:
 *
 * 1. The year block's `source`: the document the corpus transcribed that
 *    year's figures from.
 * 2. A `<field>_source` key in the same block, or `<prefix>_source` where the
 *    field name starts with `<prefix>_`: the corpus recording that one figure
 *    rests on a different document.
 * 3. A group key declared in the corpus's `verifier-config.mjs` under
 *    `sources.groups`, as an ordered list of `[key, pattern]`: the first group
 *    present in the block whose pattern matches the raw field name.
 *
 * Precedence is 2, then 3, then 1. A source value that is an evidence id, or a
 * list of them, cites those documents. Anything else is prose, and prose is
 * never parsed for citations: notes say things like "not stated in Notice
 * 2023-75". Every distinct prose value is reviewed once and recorded in the
 * corpus's `figure-sources.json` under `notes`, keyed by the first 10 hex characters of the
 * sha256 of its trimmed text, as `{ cites: [ids], why }` or
 * `{ useYearSource: true, why }`. The prose is kept as the figure's note. An
 * unreviewed note fails the run, so changed evidence text is reviewed again.
 *
 * Evidence ids are translated to the data file's `sources` ids through `ids`
 * in the corpus's `figure-sources.json`, and every cited id must exist in that data
 * file's `sources`, with a verified URL (see SOURCES.md).
 *
 * Only figures the corpus actually transcribes for a year are attributed. A
 * figure the evidence does not cover for a year has no entry; it is unknown,
 * not defaulted to that year's notice.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { figures, loadCorpora, readJson, root } from "./lib/evidence-corpus.mjs";

const checkOnly = process.argv.includes("--check");
/** Print attribution statistics and exit without writing or failing. */
const report = process.argv.includes("--report");

/** Split "a and b", "a, b" or "a + b" into candidate ids. */
const LIST = /\s*(?:,|;|\+|\band\b)\s*/;

/**
 * Parse one recorded source value into the evidence ids it cites and, for
 * prose, the note itself. `problems` collects prose nobody has reviewed.
 */
function parseSource(value, context) {
  const { evidenceIds, reviewed, yearSource, where, problems } = context;
  if (typeof value !== "string" || value.trim() === "") return { ids: [], note: null };
  const text = value.trim();
  if (evidenceIds.has(text)) return { ids: [text], note: null };
  const parts = text.split(LIST).filter(Boolean);
  if (parts.length > 1 && parts.every((part) => evidenceIds.has(part))) return { ids: parts, note: null };
  const hash = createHash("sha256").update(text).digest("hex").slice(0, 10);
  const review = reviewed[hash];
  if (!review) {
    problems.push(`${where}: unreviewed source note ${hash}: ${text.slice(0, 120)}`);
    return { ids: [], note: text };
  }
  const citation = refine(review, context.item);
  const ids = citation.useYearSource ? parseSource(yearSource, { ...context, yearSource: undefined }).ids : [...(citation.cites ?? [])];
  const year = Number(context.item.yearKey);
  for (const [id, [from, to]] of Object.entries(citation.citesInYears ?? {})) {
    if (year >= from && year <= to && !ids.includes(id)) ids.push(id);
  }
  for (const id of ids) {
    if (!evidenceIds.has(id)) problems.push(`${where}: reviewed note ${hash} cites ${id}, which the corpus does not list`);
  }
  return { ids, note: text };
}

/**
 * A reviewed note's citation for one figure. `byField` entries (optionally
 * year-bounded) and then `byMember` entries for band and tier members each
 * replace the whole citation when they match; `citesInYears` adds an id only
 * within its year range.
 */
function refine(review, item) {
  let citation = review;
  const year = Number(item.yearKey);
  const field = (review.byField ?? []).find((entry) =>
    new RegExp(entry.pattern).test(item.rawField ?? "") && (!entry.years || (year >= entry.years[0] && year <= entry.years[1])));
  if (field) citation = field;
  const member = item.member === undefined ? undefined : review.byMember?.[item.member];
  if (member) citation = member;
  return citation;
}

/** The recorded source value that governs `item`, by the precedence above. */
function governingSource(item, groups) {
  if (item.kind === "series") return item.entry?.source;
  const block = item.rawBlock;
  const raw = item.rawField;
  if (`${raw}_source` in block) return block[`${raw}_source`];
  const prefixKeys = Object.keys(block)
    .filter((key) => key.endsWith("_source") && key !== "source")
    .map((key) => key.slice(0, -"_source".length))
    .filter((prefix) => raw.startsWith(`${prefix}_`))
    .sort((a, b) => b.length - a.length);
  if (prefixKeys.length > 0) return block[`${prefixKeys[0]}_source`];
  for (const [key, pattern] of groups) {
    if (key in block && pattern.test(raw)) return block[key];
  }
  return block.source;
}

/** Merge two transcribed fields that bind one data figure in the same year. */
function mergeLeaf(existing, leaf) {
  // The figure then rests on every document either cites.
  for (const id of leaf.sources) if (!existing.sources.includes(id)) existing.sources.push(id);
  if (leaf.citation && !existing.citation.split("; ").includes(leaf.citation)) {
    existing.citation = existing.citation ? `${existing.citation}; ${leaf.citation}` : leaf.citation;
  }
  if (leaf.note && existing.note !== leaf.note) existing.note = existing.note ? `${existing.note} ${leaf.note}` : leaf.note;
}

/** The most frequent value of `key(item)` over `items`, ties broken by first occurrence. */
function mostCommon(items, key) {
  const counts = new Map();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  let best = null;
  for (const [k, count] of counts) if (best === null || count > counts.get(best)) best = k;
  return best;
}

/**
 * Encode the per-year attribution compactly, since both engines embed it:
 *
 *   figureCitations  { path: citation }, the citation a figure usually carries
 *   figureNotes      [note], each distinct note once
 *   figureSets       [[path]], each distinct list of default-sourced paths once
 *   figureSources    { year: { sources, figures, exceptions } }
 *     sources        the documents most of that year's figures rest on
 *     figures        index into figureSets: the paths resting on exactly
 *                    `sources`, with the usual citation and no note
 *     exceptions     { path: { sources?, citation?, note? } } for the rest,
 *                    each member present only where it differs; `note` is an
 *                    index into figureNotes
 *
 * A path appears in a year's figure set or exceptions only for a year the
 * evidence transcribes it; every other figure that year is unattributed.
 */
function encode(byYear) {
  const all = Object.values(byYear).flatMap((leaves) => Object.entries(leaves));
  const citations = {};
  for (const path of [...new Set(all.map(([path]) => path))].sort()) {
    citations[path] = mostCommon(all.filter(([p]) => p === path), ([, leaf]) => leaf.citation);
  }
  const notes = [];
  const sets = [];
  const indexOf = (list, value) => {
    const key = JSON.stringify(value);
    let index = list.findIndex((existing) => JSON.stringify(existing) === key);
    if (index < 0) index = list.push(value) - 1;
    return index;
  };
  const years = {};
  for (const yearKey of Object.keys(byYear).sort()) {
    const leaves = Object.entries(byYear[yearKey]).sort(([a], [b]) => a.localeCompare(b));
    const plain = leaves.filter(([, leaf]) => leaf.note === null && leaf.sources.length > 0);
    const defaultKey = mostCommon(plain.length > 0 ? plain : leaves, ([, leaf]) => JSON.stringify(leaf.sources));
    const sources = JSON.parse(defaultKey ?? "[]");
    const figures = [];
    const exceptions = {};
    for (const [path, leaf] of leaves) {
      const sameSources = JSON.stringify(leaf.sources) === JSON.stringify(sources);
      const sameCitation = leaf.citation === citations[path];
      if (sameSources && sameCitation && leaf.note === null) {
        figures.push(path);
        continue;
      }
      const exception = {};
      if (!sameSources) exception.sources = leaf.sources;
      if (!sameCitation) exception.citation = leaf.citation;
      if (leaf.note !== null) exception.note = indexOf(notes, leaf.note);
      exceptions[path] = exception;
    }
    years[yearKey] = { sources, figures: indexOf(sets, figures), exceptions };
  }
  return { figureCitations: citations, figureNotes: notes, figureSets: sets, figureSources: years };
}

/**
 * The reviewed declarations kept beside a corpus as figure-sources.json:
 * `ids`, evidence id to data source id where the two differ; `notes`, the
 * reviewed citation of every distinct prose source note; and `fieldOverrides`,
 * `{ pattern, years: [from, to], cites, note, why }` for a figure whose year
 * source does not print it and that no source key in the corpus covers. An
 * override takes precedence over every source key.
 */
function readDeclarations(corpus) {
  try {
    return JSON.parse(readFileSync(join(root, "evidence", corpus, "figure-sources.json"), "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return {};
    throw error;
  }
}

function derive(config) {
  const parameters = readJson(config.data);
  const primary = readJson(config.evidence);
  const evidenceIds = new Set(Object.keys(primary._sources ?? {}));
  const declared = readDeclarations(config.id);
  const reviewed = declared.notes ?? {};
  const groups = config.sources?.groups ?? [];
  const idMap = new Map(Object.entries(declared.ids ?? {}));
  const dataIds = new Set((parameters.sources ?? []).map((source) => source.id));

  const problems = [];
  const byYear = {};
  for (const item of figures(config, parameters, primary)) {
    if (item.kind === "missingYear") continue;
    const yearSource = item.kind === "series" ? undefined : item.rawBlock.source;
    const where = `${config.id} ${item.yearKey} ${item.path.join(".")}`;
    const override = (declared.fieldOverrides ?? []).find((entry) =>
      new RegExp(entry.pattern).test(item.rawField ?? "") && Number(item.yearKey) >= entry.years[0] && Number(item.yearKey) <= entry.years[1]);
    const { ids, note } = override
      ? { ids: [...override.cites], note: override.note }
      : parseSource(governingSource(item, groups), { evidenceIds, reviewed, yearSource, where, problems, item });
    const sources = ids.map((id) => idMap.get(id) ?? id);
    for (const id of sources) {
      if (!dataIds.has(id)) {
        problems.push(`${config.id} ${item.yearKey} ${item.path.join(".")}: cites ${id}, which ${config.data} sources does not list`);
      }
    }
    byYear[item.yearKey] ??= {};
    const path = item.path.join(".");
    // A deliberate evidence-versus-data divergence is part of the figure's
    // provenance: the data does not carry the transcribed value, and why.
    const reconciled = item.field === null ? undefined : config.reconciled?.[`${item.yearKey}:${item.field}`];
    const fullNote = reconciled ? [note, `The data carries ${JSON.stringify(reconciled.value)} rather than the transcribed figure: ${reconciled.why}.`].filter(Boolean).join(" ") : note;
    const leaf = { citation: item.citation ?? "", sources, note: fullNote ?? null };
    if (byYear[item.yearKey][path]) mergeLeaf(byYear[item.yearKey][path], leaf);
    else byYear[item.yearKey][path] = leaf;
  }

  return { data: config.data, ...encode(byYear), problems };
}

const corpora = await loadCorpora();
let changed = 0;
const problems = [];
for (const config of corpora) {
  const result = derive(config);
  if (report) {
    const years = Object.values(result.figureSources);
    const count = years.reduce((n, y) => n + result.figureSets[y.figures].length + Object.keys(y.exceptions).length, 0);
    const exceptions = years.flatMap((y) => Object.values(y.exceptions));
    const withNote = exceptions.filter((e) => e.note !== undefined).length;
    const noteOnly = years.reduce((n, y) => n + Object.values(y.exceptions).filter((e) => (e.sources ?? y.sources).length === 0).length, 0);
    const unmapped = new Set(result.problems.map((problem) => problem.match(/cites (\S+),/)[1]));
    const bytes = JSON.stringify([result.figureCitations, result.figureNotes, result.figureSets, result.figureSources]).length;
    console.log(`${config.id}: ${years.length} years, ${count} figures, ${exceptions.length} exceptions, ${withNote} with notes, ${noteOnly} citing no document, ${unmapped.size} evidence ids not in data sources, ${bytes} bytes`);
    continue;
  }
  problems.push(...result.problems);
  const sidecar = result.data.replace(/-parameters\.json$/, "-figure-sources.json");
  const path = join(root, sidecar);
  const next = `${JSON.stringify({
    figureCitations: result.figureCitations,
    figureNotes: result.figureNotes,
    figureSets: result.figureSets,
    figureSources: result.figureSources,
  }, null, 2)}\n`;
  let raw = null;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    if (!error || error.code !== "ENOENT") throw error;
  }
  if (next === raw) continue;
  changed += 1;
  if (checkOnly) {
    console.error(`${sidecar} is out of date; run node scripts/derive-figure-sources.mjs.`);
  } else {
    writeFileSync(path, next);
    console.log(`derived ${sidecar}`);
  }
}

for (const problem of problems) console.error(`UNSOURCED ${problem}`);
if (problems.length > 0 || (checkOnly && changed > 0)) process.exitCode = 1;
