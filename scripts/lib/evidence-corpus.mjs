/**
 * Shared reading of the evidence corpora under evidence/: loading each
 * corpus's verifier-config.mjs and walking its transcribed figures onto the
 * data file. Both scripts/verify-evidence.mjs (which compares the figures) and
 * scripts/derive-figure-sources.mjs (which records where each figure came
 * from) walk the same declarations, so a figure the verifier checks is exactly
 * a figure that gets a source.
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const readJson = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

/**
 * Non-figure keys in a year block: provenance and commentary, not amounts to
 * compare. Everything else must be either compared or explicitly declared
 * unmodelled, or the verifier fails with UNCOVERED.
 */
export const METADATA = /^(source|_.*|.*_note|.*_source)$/;

/** Resolve `path` against `obj`, tolerating a null or missing intermediate. */
export const at = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);

/** Load every corpus config under evidence/, sorted by directory name. */
export async function loadCorpora() {
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
 * Every transcribed figure a corpus maps onto its data file, one item per
 * comparison the verifier makes.
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
 *
 * Each item carries the year, the evidence field (after `aliases`) and its raw
 * transcription name, the data path, the citation, the raw year block (or the
 * series entry) it came from, and the transcribed value. A year block with no
 * matching data year yields `{ kind: "missingYear" }`.
 */
export function* figures(config, parameters, primary) {
  const blocks = primary[config.yearBlocks ?? "planYears"];
  const aliases = new Map(Object.entries(config.aliases ?? {}));
  const rawName = new Map([...aliases].map(([raw, aliased]) => [aliased, raw]));

  for (const [yearKey, rawBlock] of Object.entries(blocks)) {
    const year = parameters.years[yearKey];
    if (!year) {
      yield { kind: "missingYear", yearKey };
      continue;
    }

    /** Field names differ between transcription and data in a few places. */
    const block = {};
    for (const [key, value] of Object.entries(rawBlock)) block[aliases.get(key) ?? key] = value;
    const base = (field) => ({ yearKey, year, field, rawField: rawName.get(field) ?? field, rawBlock });

    for (const [field, path, citation] of config.scalars ?? []) {
      if (!(field in block)) continue;
      yield { ...base(field), kind: "scalar", path, citation, value: block[field] };
    }

    for (const [field, path, members, citation] of config.tiered ?? []) {
      const recorded = block[field];
      if (!recorded) continue;
      for (const member of members) {
        if (!(member in recorded)) continue;
        yield { ...base(field), kind: "tiered", member, path: [...path, member], citation, value: recorded[member] };
      }
    }

    for (const [field, path, members, citation] of config.bands ?? []) {
      const recorded = block[field];
      if (!recorded) continue;
      for (const [evidenceMember, target] of Object.entries(members)) {
        const value = recorded[evidenceMember];
        if (!value) continue;
        const dataMember = typeof target === "string" ? target : target.data;
        const memberCitation = typeof target === "string" ? citation : target.citation;
        yield {
          ...base(field),
          kind: "band",
          member: evidenceMember,
          path: [...path, dataMember],
          citation: memberCitation,
          value,
        };
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
        yield {
          kind: "series",
          yearKey,
          year,
          field: null,
          rawField: null,
          label,
          section: series.section,
          entry,
          path: dataPath,
          citation,
          value: at(entry, evidencePath),
        };
      }
    }
  }
}
