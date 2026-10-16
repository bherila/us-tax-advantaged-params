#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const checkOnly = process.argv.includes("--check");
const tsPath = join(root, "src", "USTaxAdvantagedParams.ts");
const phpPath = join(root, "php", "src", "USTaxAdvantagedParams.php");

/**
 * A table's data file plus its derived figure-source sidecar
 * (scripts/derive-figure-sources.mjs), merged for embedding.
 */
async function readTable(relativePath) {
  const table = await readCanonical(relativePath);
  const sidecar = await readCanonical(relativePath.replace(/-parameters\.json$/, "-figure-sources.json"));
  return { ...table, ...sidecar };
}

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

const parameters = await readTable("data/retirement-parameters.json");
const hsaParameters = await readTable("data/hsa-parameters.json");
const fsaParameters = await readTable("data/fsa-parameters.json");

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

/**
 * Pretty-print a data file for embedding, except its derived `figure*` blocks
 * (scripts/derive-figure-sources.mjs), which are machine-written and embedded
 * on one line each to keep both engines small.
 */
function embedJson(value) {
  const derived = [];
  const shell = Object.fromEntries(Object.entries(value).map(([key, member]) => {
    if (!key.startsWith("figure")) return [key, member];
    derived.push(JSON.stringify(member));
    return [key, `__derived_${derived.length - 1}__`];
  }));
  return JSON.stringify(shell, null, 2).replace(/"__derived_(\d+)__"/g, (_, index) => derived[Number(index)]);
}

/** Single quotes cannot end a PHP nowdoc, but escaping them keeps the block inert either way. */
const phpEmbed = (value) => embedJson(value).replaceAll("'", "\\u0027");

await update(
  tsPath,
  "/* <generated-parameters> */",
  "/* </generated-parameters> */",
  `const RAW_PARAMETERS: ParameterData = ${embedJson(parameters)} as ParameterData;`,
);

await update(
  tsPath,
  "/* <generated-hsa-parameters> */",
  "/* </generated-hsa-parameters> */",
  `const RAW_HSA_PARAMETERS: HsaParameterData = ${embedJson(hsaParameters)} as HsaParameterData;`,
);

await update(
  tsPath,
  "/* <generated-fsa-parameters> */",
  "/* </generated-fsa-parameters> */",
  `const RAW_FSA_PARAMETERS: FsaParameterData = ${embedJson(fsaParameters)} as FsaParameterData;`,
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

await update(
  phpPath,
  "/* <generated-fsa-parameters> */",
  "/* </generated-fsa-parameters> */",
  `private const FSA_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(fsaParameters)}\nJSON;`,
);

const payrollParameters = await readTable("data/payroll-tax-parameters.json");
await update(tsPath, "/* <generated-payroll-parameters> */", "/* </generated-payroll-parameters> */",
  `const RAW_PAYROLL_PARAMETERS: PayrollParameterData = ${embedJson(payrollParameters)} as PayrollParameterData;`);
await update(phpPath, "/* <generated-payroll-parameters> */", "/* </generated-payroll-parameters> */",
  `private const PAYROLL_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(payrollParameters)}\nJSON;`);

const educationParameters = await readTable("data/education-parameters.json");
await update(tsPath, "/* <generated-education-parameters> */", "/* </generated-education-parameters> */",
  `const RAW_EDUCATION_PARAMETERS: EducationParameterData = ${embedJson(educationParameters)} as EducationParameterData;`);
await update(phpPath, "/* <generated-education-parameters> */", "/* </generated-education-parameters> */",
  `private const EDUCATION_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(educationParameters)}\nJSON;`);

const ableParameters = await readTable("data/able-parameters.json");
await update(tsPath, "/* <generated-able-parameters> */", "/* </generated-able-parameters> */",
  `const RAW_ABLE_PARAMETERS: AbleParameterData = ${embedJson(ableParameters)} as AbleParameterData;`);
await update(phpPath, "/* <generated-able-parameters> */", "/* </generated-able-parameters> */",
  `private const ABLE_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(ableParameters)}\nJSON;`);

const adoptionParameters = await readTable("data/adoption-parameters.json");
await update(tsPath, "/* <generated-adoption-parameters> */", "/* </generated-adoption-parameters> */",
  `const RAW_ADOPTION_PARAMETERS: AdoptionParameterData = ${embedJson(adoptionParameters)} as AdoptionParameterData;`);
await update(phpPath, "/* <generated-adoption-parameters> */", "/* </generated-adoption-parameters> */",
  `private const ADOPTION_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(adoptionParameters)}\nJSON;`);

const hraParameters = await readTable("data/hra-parameters.json");
await update(tsPath, "/* <generated-hra-parameters> */", "/* </generated-hra-parameters> */",
  `const RAW_HRA_PARAMETERS: HraParameterData = ${embedJson(hraParameters)} as HraParameterData;`);
await update(phpPath, "/* <generated-hra-parameters> */", "/* </generated-hra-parameters> */",
  `private const HRA_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(hraParameters)}\nJSON;`);

const commuterParameters = await readTable("data/commuter-parameters.json");
await update(tsPath, "/* <generated-commuter-parameters> */", "/* </generated-commuter-parameters> */",
  `const RAW_COMMUTER_PARAMETERS: CommuterParameterData = ${embedJson(commuterParameters)} as CommuterParameterData;`);
await update(phpPath, "/* <generated-commuter-parameters> */", "/* </generated-commuter-parameters> */",
  `private const COMMUTER_PARAMETER_JSON = <<<'JSON'\n${phpEmbed(commuterParameters)}\nJSON;`);
