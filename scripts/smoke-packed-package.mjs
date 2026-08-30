#!/usr/bin/env node
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const tarballArgument = process.argv[2];
if (!tarballArgument) {
  console.error("Usage: node scripts/smoke-packed-package.mjs <package.tgz>");
  process.exit(2);
}
const tarball = resolve(tarballArgument);
const directory = await mkdtemp(join(tmpdir(), "usa-retirement-package-smoke-"));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: directory,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(`${command} ${args.join(" ")} exited with status ${result.status}`);
  }
  return result.stdout;
}

try {
  await writeFile(
    join(directory, "package.json"),
    `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
  );
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-audit",
    "--no-fund",
    "--package-lock=false",
    tarball,
  ]);

  await writeFile(
    join(directory, "esm-smoke.mjs"),
    `import U, { AccountType } from "us-tax-advantaged-params";\n` +
      `if (U.parametersForYear(1997).annualCompensation401a17 !== 160000) throw new Error("bad ESM parameters");\n` +
      `const result = U.calculate({taxYear:1997,filingStatus:"S",persons:[{id:"t",birthYear:1960,compensation:{w2Compensation:500000}}],accounts:[{id:"sep",ownerId:"t",type:AccountType.SEP_IRA,employerId:"e",planRules:{planCompensation:500000}}]});\n` +
      `if (result.accounts[0].contributionComponents.employerPreTax !== 24000) throw new Error("bad ESM calculation");\n`,
  );
  run("node", [join(directory, "esm-smoke.mjs")]);

  await writeFile(
    join(directory, "cjs-smoke.cjs"),
    `const pkg = require("us-tax-advantaged-params");\n` +
      `const U = pkg.default;\n` +
      `if (U.parametersForYear(1997).annualCompensation401a17 !== 160000) throw new Error("bad CJS parameters");\n` +
      `const result = U.calculate({taxYear:1997,filingStatus:"S",persons:[{id:"t",birthYear:1960,compensation:{w2Compensation:500000}}],accounts:[{id:"plan",ownerId:"t",type:"profit_sharing_plan",employerId:"e",planRules:{planCompensation:500000,employerNonelectiveRate:0.15}}]});\n` +
      `if (result.accounts[0].contributionComponents.employerPreTax !== 24000) throw new Error("bad CJS calculation");\n`,
  );
  run("node", [join(directory, "cjs-smoke.cjs")]);

  const installedPackage = JSON.parse(
    await readFile(
      join(directory, "node_modules", "us-tax-advantaged-params", "package.json"),
      "utf8",
    ),
  );
  console.log(
    `Packed npm artifact smoke test passed for ${installedPackage.name}@${installedPackage.version} (ESM and CommonJS).`,
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
