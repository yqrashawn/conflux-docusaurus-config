#!/usr/bin/env node

const path = require("path");
const cpx = require("cpx2");

const cwd = process.cwd();
const siteDir = path.resolve(__dirname, "../");
const lastArg = process.argv[process.argv.length - 1];
const isBuild = lastArg === "build";
const isStart = lastArg === "start";

if (isBuild) {
  process.argv.push("--out-dir");
  process.argv.push(`${cwd}/build`);
}

process.argv.push(siteDir);

if (isBuild) {
  cpx.copySync(`${cwd}/.git/**/*`, `${siteDir}/.git`);
  cpx.copySync(`${cwd}/.gitmodules`, `${siteDir}/.gitmodules`);
}

if (isStart || isBuild) {
  cpx.copySync(`${cwd}/docs/**/*`, `${siteDir}/docs`);
}

if (isStart) {
  const watchingDoc = cpx.watch(`${cwd}/docs/**/*`, `${siteDir}/docs`, {
    initialCopy: false,
  });
  process.on("exit", () => {
    watchingDoc.close();
  });

  watchingDoc.on("watch-ready", () => {
    require("../development/gen_sidebars_config.js");
    require("@docusaurus/core/bin/docusaurus.js");
  });
} else {
  require("../development/gen_sidebars_config.js");
  require("@docusaurus/core/bin/docusaurus.js");
}
