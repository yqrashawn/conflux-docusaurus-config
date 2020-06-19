#!/usr/bin/env node
const path = require("path");
const cpx = require("cpx2");
const syncdir = require('../lib/sync-dir.js');

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

if (isStart || isBuild) {
  cpx.copySync(`${cwd}/cfxdoc.config.json`, `${siteDir}/`);
  cpx.copySync(`${cwd}/sidebars.js`, `${siteDir}/`);
  cpx.copySync(`${cwd}/static/**/*`, `${siteDir}/static/`);
  cpx.copySync(`${cwd}/docs/**/*`, `${siteDir}/docs`);
}

if (isBuild) {
  cpx.copySync(`${cwd}/.git/**/*`, `${siteDir}/.git`);
}

if (isStart) {
  syncdir(`${cwd}/docs`, `${siteDir}/docs`, () => {
      process.chdir(siteDir);
      require("../development/gen_sidebars_config.js");
      require("@docusaurus/core/bin/docusaurus.js");
  })
} else {
  process.chdir(siteDir);
  require("../development/gen_sidebars_config.js");
  require("@docusaurus/core/bin/docusaurus.js");
}
