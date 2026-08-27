#!/usr/bin/env node
import { copyFile, mkdir, writeFile } from "node:fs/promises";

const cjsDirectory = new URL("../dist/cjs/", import.meta.url);
await mkdir(cjsDirectory, { recursive: true });
await writeFile(
  new URL("package.json", cjsDirectory),
  `${JSON.stringify({ type: "commonjs" }, null, 2)}\n`,
);

// The engine is a single module with no relative imports, so the declaration
// text is identical in both formats; a .d.cts copy gives require() consumers a
// CommonJS-flavored declaration instead of one masquerading as ESM.
const typesDirectory = new URL("../dist/types/", import.meta.url);
await copyFile(
  new URL("USARetirementAccountParameters.d.ts", typesDirectory),
  new URL("USARetirementAccountParameters.d.cts", typesDirectory),
);
