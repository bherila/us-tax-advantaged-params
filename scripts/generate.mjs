#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const checkOnly = process.argv.includes("--check");
const tsPath = join(root, "src", "USTaxAdvantagedParams.ts");
const phpPath = join(root, "php", "src", "USTaxAdvantagedParams.php");

async function readCanonical(relativePath) {
  const path = join(root, relativePath);
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw);
  const canonical = `${JSON.stringify(parsed, null, 2)}\n`;
  if (canonical !== raw) {
    if (checkOnly) {
      console.error(`${relativePath} is not canonically formatted.`);
      process.exitCode = 1;
    } else {
      await writeFile(path, canonical);
    }
  }
  return parsed;
}

const parameters = await readCanonical("data/retirement-parameters.json");
const hsaParameters = await readCanonical("data/hsa-parameters.json");

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
    if (error && error.code === "ENOENT") {
      if (checkOnly) {
        console.error(`${path.slice(root.length + 1)} is missing; the drift check requires both engines.`);
        process.exitCode = 1;
      }
      return;
    }
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

/** Single quotes cannot end a PHP nowdoc, but escaping them keeps the block inert either way. */
const phpEmbed = (value) => JSON.stringify(value, null, 2).replaceAll("'", "\\u0027");

await update(
  tsPath,
  "/* <generated-parameters> */",
  "/* </generated-parameters> */",
  `const RAW_PARAMETERS: ParameterData = ${JSON.stringify(parameters, null, 2)} as ParameterData;`,
);

await update(
  tsPath,
  "/* <generated-hsa-parameters> */",
  "/* </generated-hsa-parameters> */",
  `const RAW_HSA_PARAMETERS: HsaParameterData = ${JSON.stringify(hsaParameters, null, 2)} as HsaParameterData;`,
);

await update(
  phpPath,
  "/* <generated-parameters> */",
  "/* </generated-parameters> */",
  `private const PARAMETER_JSON = <<<'JSON'\n${phpEmbed(parameters)}\nJSON;`,
);

await update(
  phpPath,
  "/* <generated-hsa-parameters> */",
  "/* </generated-hsa-parameters> */",
  `private const HSA_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(hsaParameters)}\nJSON;`,
);
