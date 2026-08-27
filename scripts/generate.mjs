#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const checkOnly = process.argv.includes("--check");
const dataPath = join(root, "data", "retirement-parameters.json");
const tsPath = join(root, "src", "USARetirementAccountParameters.ts");
const phpPath = join(root, "php", "src", "USARetirementAccountParameters.php");

const raw = await readFile(dataPath, "utf8");
const parameters = JSON.parse(raw);
const canonical = `${JSON.stringify(parameters, null, 2)}\n`;
if (canonical !== raw) {
  if (checkOnly) {
    console.error("data/retirement-parameters.json is not canonically formatted.");
    process.exitCode = 1;
  } else {
    await writeFile(dataPath, canonical);
  }
}

function replaceGeneratedBlock(source, startMarker, endMarker, generated) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start < 0 || end < 0 || end < start) {
    throw new Error(`Generated markers not found: ${startMarker} / ${endMarker}`);
  }
  const afterEnd = end + endMarker.length;
  return `${source.slice(0, start)}${startMarker}\n${generated}\n${endMarker}${source.slice(afterEnd)}`;
}

async function update(path, startMarker, endMarker, generated) {
  let current;
  try {
    current = await readFile(path, "utf8");
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    throw error;
  }
  const next = replaceGeneratedBlock(current, startMarker, endMarker, generated);
  if (current === next) return;
  if (checkOnly) {
    console.error(`${path.slice(root.length + 1)} is out of date; run npm run generate.`);
    process.exitCode = 1;
  } else {
    await writeFile(path, next);
    console.log(`generated ${path.slice(root.length + 1)}`);
  }
}

await update(
  tsPath,
  "/* <generated-parameters> */",
  "/* </generated-parameters> */",
  `const RAW_PARAMETERS: ParameterData = ${JSON.stringify(parameters, null, 2)} as ParameterData;`,
);

const phpJson = JSON.stringify(parameters, null, 2).replaceAll("'", "\\u0027");
await update(
  phpPath,
  "/* <generated-parameters> */",
  "/* </generated-parameters> */",
  `private const PARAMETER_JSON = <<<'JSON'\n${phpJson}\nJSON;`,
);
