/**
 * The attestation files are tracked and are rewritten only by
 * `validate-release.mjs`, which runs the whole suite and is therefore in
 * neither the local `verify` chain nor CI. Every change that moved the
 * conformance vector count left them stale with a green gate: `main` claimed
 * 149 vectors against a suite of 160 until this check was written.
 *
 * Diffing the files wholesale cannot work, because they record timestamps and
 * millisecond durations and so are always dirty. This compares only the derived
 * facts a release actually asserts, which are stable and cheap to recompute:
 * the package version, the tax-year span, and the vector count. It runs no
 * tests, so CI can afford it on every push.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = async (name) => readFile(join(root, name), "utf8");

const packageJson = JSON.parse(await read("package.json"));
const parameters = JSON.parse(await read("data/retirement-parameters.json"));
const vectors = JSON.parse(await read("data/conformance-vectors.json"));
const status = JSON.parse(await read("validation-status.json"));
const releaseStatus = await read("RELEASE_STATUS.md");
const validation = await read("VALIDATION.md");

const vectorCount = vectors.vectors.length;
const span = `${parameters.supportedTaxYears.minimum}-${parameters.supportedTaxYears.maximum}`;
const failures = [];

const expectIn = (haystack, needle, where, what) => {
  if (!haystack.includes(needle)) failures.push(`${where} does not state ${what} (${needle}).`);
};

expectIn(releaseStatus, `${vectorCount} shared conformance vectors`, "RELEASE_STATUS.md", "the conformance vector count");
expectIn(releaseStatus, span, "RELEASE_STATUS.md", "the supported tax-year span");
expectIn(releaseStatus, `${packageJson.name}@${packageJson.version}`, "RELEASE_STATUS.md", "the package version");
expectIn(validation, `${vectorCount} conformance vectors`, "VALIDATION.md", "the conformance vector count");

if (status.version !== packageJson.version) {
  failures.push(`validation-status.json records version ${status.version}; package.json says ${packageJson.version}.`);
}
if (status.package !== packageJson.name) {
  failures.push(`validation-status.json records package ${status.package}; package.json says ${packageJson.name}.`);
}

if (failures.length > 0) {
  console.error("Attestation check failed:\n");
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error("\nRun `npm run validate:release` and commit the regenerated files.");
  process.exit(1);
}

console.log(
  `Attestations current: ${packageJson.name}@${packageJson.version}, ${vectorCount} conformance vectors, tax years ${span}.`,
);
