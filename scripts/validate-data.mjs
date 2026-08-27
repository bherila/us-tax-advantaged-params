#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parameterPath = join(root, "data", "retirement-parameters.json");
const vectorPath = join(root, "data", "conformance-vectors.json");
const errors = [];

function fail(message) {
  errors.push(message);
}

async function parseCanonicalJson(path, label) {
  const raw = await readFile(path, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
    return null;
  }
  const canonical = `${JSON.stringify(parsed, null, 2)}\n`;
  if (raw !== canonical) fail(`${label} is not canonically formatted with two-space indentation.`);
  return parsed;
}

function walk(value, path) {
  if (typeof value === "number" && !Number.isFinite(value)) {
    fail(`${path} contains a non-finite number.`);
  } else if (Array.isArray(value)) {
    value.forEach((entry, index) => walk(entry, `${path}[${index}]`));
  } else if (value !== null && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) walk(entry, `${path}.${key}`);
  }
}

const parameters = await parseCanonicalJson(parameterPath, "data/retirement-parameters.json");
const conformance = await parseCanonicalJson(vectorPath, "data/conformance-vectors.json");

if (parameters) {
  walk(parameters, "parameters");
  if (!Number.isInteger(parameters.schemaVersion) || parameters.schemaVersion < 1) {
    fail("Parameter schemaVersion must be a positive integer.");
  }
  const minimum = parameters.supportedTaxYears?.minimum;
  const maximum = parameters.supportedTaxYears?.maximum;
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
    fail("supportedTaxYears must contain an ordered integer minimum and maximum.");
  } else {
    if (parameters.generatedThroughTaxYear !== maximum) {
      fail("generatedThroughTaxYear must equal supportedTaxYears.maximum.");
    }
    const keys = Object.keys(parameters.years ?? {}).map(Number).sort((a, b) => a - b);
    const expected = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);
    if (JSON.stringify(keys) !== JSON.stringify(expected)) {
      fail(`Year rows must be contiguous from ${minimum} through ${maximum}.`);
    }
    for (const year of expected) {
      const row = parameters.years?.[String(year)];
      if (!row || row.year !== year) fail(`Year row ${year} is missing or has a mismatched year field.`);
      if (row && row.annualCompensation401a17 !== null && row.annualCompensation401a17 <= 0) {
        fail(`Year ${year} has an invalid annualCompensation401a17 value.`);
      }
      if (row && row.annualAdditions415c !== null && row.annualAdditions415c <= 0) {
        fail(`Year ${year} has an invalid annualAdditions415c value.`);
      }
    }
  }

  if (!Array.isArray(parameters.sources) || parameters.sources.length === 0) {
    fail("At least one source record is required.");
  } else {
    const ids = new Set();
    for (const [index, source] of parameters.sources.entries()) {
      const prefix = `sources[${index}]`;
      for (const key of ["id", "title", "url", "authority"]) {
        if (typeof source?.[key] !== "string" || source[key].trim() === "") {
          fail(`${prefix}.${key} must be a nonempty string.`);
        }
      }
      if (ids.has(source.id)) fail(`Duplicate source id: ${source.id}`);
      ids.add(source.id);
      if (typeof source.url === "string" && !source.url.startsWith("https://")) {
        fail(`${prefix}.url must use HTTPS.`);
      }
    }
    for (const required of [
      "irs-notice-2001-56",
      "irs-employee-plans-news-fall-2009",
      "irs-pub-535-2001",
    ]) {
      if (!ids.has(required)) fail(`Required §401(a)(17) provenance source is missing: ${required}`);
    }
  }

  const row1997 = parameters.years?.["1997"];
  if (row1997?.annualCompensation401a17 !== 160000) {
    fail("The 1997 §401(a)(17) compensation limit regression fixture must be 160000.");
  }
  if (row1997?.sep?.maximumEmployerContributionRate !== 0.15) {
    fail("The 1997 SEP employer-rate regression fixture must be 0.15.");
  }
}

if (conformance) {
  walk(conformance, "conformance");
  if (!Number.isInteger(conformance.schemaVersion) || conformance.schemaVersion < 1) {
    fail("Conformance schemaVersion must be a positive integer.");
  }
  if (!Array.isArray(conformance.vectors) || conformance.vectors.length === 0) {
    fail("Conformance vectors must be a nonempty array.");
  } else {
    const names = new Set();
    for (const [index, vector] of conformance.vectors.entries()) {
      const prefix = `vectors[${index}]`;
      if (typeof vector?.name !== "string" || vector.name.trim() === "") {
        fail(`${prefix}.name must be a nonempty string.`);
      } else if (names.has(vector.name)) {
        fail(`Duplicate conformance vector name: ${vector.name}`);
      } else {
        names.add(vector.name);
      }
      if (!vector?.input || typeof vector.input !== "object" || Array.isArray(vector.input)) {
        fail(`${prefix}.input must be an object.`);
      }
      if (!vector?.expect || typeof vector.expect !== "object" || Array.isArray(vector.expect)) {
        fail(`${prefix}.expect must be an object.`);
      }
      const year = vector?.input?.taxYear;
      const minimum = parameters?.supportedTaxYears?.minimum;
      const maximum = parameters?.supportedTaxYears?.maximum;
      if (!Number.isInteger(year) || (Number.isInteger(minimum) && (year < minimum || year > maximum))) {
        fail(`${prefix}.input.taxYear is outside the supported range.`);
      }
    }
    for (const required of [
      "1997 SEP formula applies 401a17 compensation ceiling before 15 percent rate",
      "1997 nonelective formula applies 401a17 compensation ceiling",
      "1997 self-employed SEP uses reduced-rate and capped plan-rate worksheet ceilings",
      "1997 self-employed qualified plan applies reduced-rate and capped plan-rate ceilings",
    ]) {
      if (!names.has(required)) fail(`Required §401(a)(17) conformance vector is missing: ${required}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(
  `Canonical data validation passed: ${Object.keys(parameters.years).length} contiguous tax years, ` +
    `${parameters.sources.length} sources, ${conformance.vectors.length} conformance vectors.`,
);
