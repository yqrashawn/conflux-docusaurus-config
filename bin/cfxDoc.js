#!/usr/bin/env node

const path = require("path");

const cwd = process.cwd();
const siteDir = path.resolve(__dirname, "../");
const lastArg = process.argv[process.argv.length - 1];

if (lastArg === "build") {
  process.argv.push("--out-dir");
  process.argv.push(`${cwd}/build`);
}

process.argv.push(siteDir);

require("@docusaurus/core/bin/docusaurus.js");
