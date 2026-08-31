/**
 * The attestation files are tracked and are rewritten only by
 * `validate-release.mjs`, which runs the whole suite and is therefore in
 * neither the local `verify` chain nor CI. Every change that moved the
 * conformance vector count left them stale with a green gate: `main` claimed
 * 149 vectors against a suite of 160 until this check was written.
 *
 * Diffing the files wholesale cannot work, because they record timestamps and
 * millisecond durations and so are always dirty. This compares the derived
 * facts a release asserts, which are stable and cheap to recompute from the
 * canonical data: the package identity, the tax-year span, the year the
 * parameters are generated through, and the vector count. It runs no tests, so
 * CI can afford it on every push.
 *
 * Two rules keep this honest, both of which the earlier version broke:
 *
 * 1. **Parse labelled fields; never ask whether a string occurs.** `VALIDATION.md`
 *    embeds the full stdout of every check, so a substring search for a number
 *    can match unrelated test output and mask a genuinely stale header. Every
 *    assertion here anchors on the emitting template's own label, and the
 *    parses on `VALIDATION.md` are confined to the region above
 *    `## Detailed output` so no embedded output is even in scope. A label that
 *    stops matching is itself a failure, so editing a template in
 *    `validate-release.mjs` without updating this file is loud rather than
 *    silent.
 *
 * 2. **Compare every stable field, not a convenient subset.** `passed` and
 *    `phpTargetValidatedLocally` are run outcomes rather than recomputable
 *    facts, so they are cross-checked for agreement across the three files
 *    instead: a hand-edited `RELEASE_STATUS.md` claiming PASS over a failed
 *    `validation-status.json` fails here. `runtimes`, timestamps, and per-check
 *    timings stay out of scope because they are environment-dependent by
 *    design, which is the reason a whole-file diff cannot be the check.
 *
 * `--self-test` mutates each stable input and asserts every mutation is caught.
 * It is a guard on the guard: #32 shipped a checker that looked right and
 * silently missed three fields, and nothing failed.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (name) => readFile(join(root, name), "utf8");

/** Canonical JSON for comparing flat objects without depending on key order. */
const canonical = (value) =>
  value === null || typeof value !== "object"
    ? JSON.stringify(value)
    : JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b))));

/**
 * Reads one labelled field out of a document.
 *
 * @returns {{ found: true, value: string } | { found: false }}
 */
const readField = (text, pattern) => {
  const match = text.match(pattern);
  return match === null ? { found: false } : { found: true, value: match[1] };
};

/**
 * @param {{
 *   packageJson: { name: string, version: string },
 *   parameters: { supportedTaxYears: { minimum: number, maximum: number }, generatedThroughTaxYear: number },
 *   vectors: { vectors: unknown[] },
 *   status: Record<string, unknown>,
 *   validation: string,
 *   releaseStatus: string,
 * }} input
 * @returns {string[]} one message per stale or unparseable field
 */
export function collectFailures({ packageJson, parameters, vectors, status, validation, releaseStatus }) {
  const failures = [];
  const identity = `${packageJson.name}@${packageJson.version}`;
  const span = `${parameters.supportedTaxYears.minimum}-${parameters.supportedTaxYears.maximum}`;
  const vectorCount = vectors.vectors.length;

  /** Compares a recomputed fact against what a document states, by label. */
  const expectField = (text, where, label, pattern, expected) => {
    const field = readField(text, pattern);
    if (!field.found) {
      failures.push(`${where} has no parseable "${label}" field; the emitting template in validate-release.mjs has moved.`);
      return;
    }
    if (field.value !== expected) {
      failures.push(`${where} states ${label} ${field.value}; the canonical data says ${expected}.`);
    }
  };

  // validation-status.json: every stable field, compared exactly.
  const expectJson = (key, actual, expected) => {
    if (actual !== expected) {
      failures.push(`validation-status.json records ${key} ${actual}; the canonical data says ${expected}.`);
    }
  };
  expectJson("package", status.package, packageJson.name);
  expectJson("version", status.version, packageJson.version);
  expectJson("conformanceVectorCount", status.conformanceVectorCount, vectorCount);
  expectJson("generatedThroughTaxYear", status.generatedThroughTaxYear, parameters.generatedThroughTaxYear);
  expectJson("supportedTaxYears", canonical(status.supportedTaxYears), canonical(parameters.supportedTaxYears));

  // VALIDATION.md: parse only above the embedded stdout, and only by label.
  const detailIndex = validation.indexOf("\n## Detailed output");
  if (detailIndex < 0) {
    failures.push('VALIDATION.md has no "## Detailed output" section; its structure has changed and the parses below are no longer bounded.');
  }
  const attested = detailIndex < 0 ? "" : validation.slice(0, detailIndex);
  expectField(attested, "VALIDATION.md", "package", /^- \*\*Package:\*\* `(.+)`$/m, identity);
  expectField(attested, "VALIDATION.md", "tax years", /^- \*\*Tax years:\*\* (.+)$/m, span);
  expectField(attested, "VALIDATION.md", "shared vectors", /^- \*\*Shared vectors:\*\* (.+)$/m, String(vectorCount));

  // RELEASE_STATUS.md embeds no command output, so the whole file is in scope.
  expectField(releaseStatus, "RELEASE_STATUS.md", "package", /^## (.+)$/m, identity);
  expectField(releaseStatus, "RELEASE_STATUS.md", "tax-year span", /^The engines encode (.+?), include \d+ shared conformance vectors,/m, span);
  expectField(releaseStatus, "RELEASE_STATUS.md", "conformance vector count", /^The engines encode .+?, include (\d+) shared conformance vectors,/m, String(vectorCount));

  // Run outcomes are not recomputable, so require the three files to agree.
  const outcome = status.passed === true ? "PASS" : "FAIL";
  expectField(attested, "VALIDATION.md", "overall result", /^- \*\*Overall:\*\* (.+)$/m, outcome);
  expectField(releaseStatus, "RELEASE_STATUS.md", "local validation result", /^\*\*Local validation:\*\* (.+)$/m, outcome);

  // The false branches of the PHP-target note interpolate versions, so
  // discriminate on the fixed prefix each branch begins with rather than
  // reproducing the whole sentence here.
  const phpQualified = status.phpTargetValidatedLocally === true;
  const expectBranch = (text, where, label, truePattern, falsePattern) => {
    const saysQualified = truePattern.test(text);
    const saysUnqualified = falsePattern.test(text);
    if (!saysQualified && !saysUnqualified) {
      failures.push(`${where} has no recognisable ${label}; the emitting template in validate-release.mjs has moved.`);
      return;
    }
    if (saysQualified !== phpQualified) {
      failures.push(
        `${where} ${label} says the PHP target was ${saysQualified ? "" : "not "}validated locally; validation-status.json says phpTargetValidatedLocally is ${phpQualified}.`,
      );
    }
  };
  expectBranch(
    attested,
    "VALIDATION.md",
    "runtime qualification note",
    /^The local PHP run satisfied the Composer PHP requirement\.$/m,
    /^The local container provides PHP /m,
  );
  expectBranch(
    releaseStatus,
    "RELEASE_STATUS.md",
    "publication gate",
    /^The PHP target was validated locally on a supported PHP version\.$/m,
    /^The local runtime is PHP /m,
  );

  return failures;
}

async function loadRealInput() {
  return {
    packageJson: JSON.parse(await read("package.json")),
    parameters: JSON.parse(await read("data/retirement-parameters.json")),
    vectors: JSON.parse(await read("data/conformance-vectors.json")),
    status: JSON.parse(await read("validation-status.json")),
    validation: await read("VALIDATION.md"),
    releaseStatus: await read("RELEASE_STATUS.md"),
  };
}

/**
 * Proves the checker detects a stale value in every field it claims to cover.
 * Each case perturbs one field of a known-good input and asserts at least one
 * failure results; a case that stops failing means the guard has gone blind.
 */
function selfTest(base) {
  if (collectFailures(base).length > 0) {
    console.error("Self-test cannot run: the tracked attestations are already stale. Fix them first.");
    return 1;
  }

  const clone = (input) => structuredClone(input);
  const substitute = (input, file, from, to) => {
    if (!input[file].includes(from)) throw new Error(`self-test fixture missing ${from} in ${file}`);
    input[file] = input[file].replace(from, to);
    return input;
  };

  const identity = `${base.packageJson.name}@${base.packageJson.version}`;
  const span = `${base.parameters.supportedTaxYears.minimum}-${base.parameters.supportedTaxYears.maximum}`;
  const count = base.vectors.vectors.length;

  const cases = [
    ["stale JSON version", (i) => { i.status.version = "0.0.0-stale"; return i; }],
    ["stale JSON package", (i) => { i.status.package = "wrong-package"; return i; }],
    ["stale JSON vector count", (i) => { i.status.conformanceVectorCount = count + 1; return i; }],
    ["stale JSON generatedThroughTaxYear", (i) => { i.status.generatedThroughTaxYear += 1; return i; }],
    ["stale JSON supportedTaxYears", (i) => { i.status.supportedTaxYears.maximum += 1; return i; }],
    ["stale VALIDATION.md version", (i) => substitute(i, "validation", `- **Package:** \`${identity}\``, "- **Package:** `x@0.0.0`")],
    ["stale VALIDATION.md tax years", (i) => substitute(i, "validation", `- **Tax years:** ${span}`, "- **Tax years:** 1900-1901")],
    ["stale VALIDATION.md vector count", (i) => substitute(i, "validation", `- **Shared vectors:** ${count}`, `- **Shared vectors:** ${count + 1}`)],
    ["stale VALIDATION.md overall result", (i) => substitute(i, "validation", "- **Overall:** PASS", "- **Overall:** FAIL")],
    ["stale RELEASE_STATUS.md version", (i) => substitute(i, "releaseStatus", `## ${identity}`, "## x@0.0.0")],
    ["stale RELEASE_STATUS.md tax years", (i) => substitute(i, "releaseStatus", `The engines encode ${span},`, "The engines encode 1900-1901,")],
    ["stale RELEASE_STATUS.md vector count", (i) => substitute(i, "releaseStatus", `include ${count} shared`, `include ${count + 1} shared`)],
    ["stale RELEASE_STATUS.md validation result", (i) => substitute(i, "releaseStatus", "**Local validation:** PASS", "**Local validation:** FAIL")],
    ["disagreeing phpTargetValidatedLocally", (i) => { i.status.phpTargetValidatedLocally = !i.status.phpTargetValidatedLocally; return i; }],
    ["renamed VALIDATION.md label", (i) => substitute(i, "validation", "- **Shared vectors:**", "- **Shared conformance vectors:**")],
  ];

  const blind = [];
  for (const [name, mutate] of cases) {
    const failures = collectFailures(mutate(clone(base)));
    if (failures.length === 0) blind.push(name);
  }

  // The trap this checker exists to avoid: with a stale header, the true
  // vector count still appears inside the embedded stdout, so the substring
  // matching used before #33 was satisfied by output the release never
  // attested. Assert both halves, or the case proves nothing.
  const staleHeader = substitute(clone(base), "validation", `- **Shared vectors:** ${count}`, `- **Shared vectors:** ${count + 1}`);
  if (!staleHeader.validation.includes(`${count} conformance vectors`)) {
    blind.push("substring regression case (VALIDATION.md no longer embeds the count in stdout; rewrite this case)");
  } else if (collectFailures(staleHeader).length === 0) {
    blind.push("stale header whose value still occurs in embedded stdout");
  }

  if (blind.length > 0) {
    console.error("Attestation self-test failed; the checker does not detect:\n");
    for (const name of blind) console.error(`  - ${name}`);
    return 1;
  }

  console.log(`Attestation self-test passed: ${cases.length + 1} mutations, all detected.`);
  return 0;
}

const input = await loadRealInput();

if (process.argv.includes("--self-test")) {
  process.exit(selfTest(input));
}

const failures = collectFailures(input);

if (failures.length > 0) {
  console.error("Attestation check failed:\n");
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error("\nRun `npm run validate:release` and commit the regenerated files.");
  process.exit(1);
}

console.log(
  `Attestations current: ${input.packageJson.name}@${input.packageJson.version}, ` +
    `${input.vectors.vectors.length} conformance vectors, ` +
    `tax years ${input.parameters.supportedTaxYears.minimum}-${input.parameters.supportedTaxYears.maximum}, ` +
    `generated through ${input.parameters.generatedThroughTaxYear}.`,
);
