#!/usr/bin/env node

const path = require("path");
const cpx = require("cpx2");
const fs = require("fs-extra");
const cpr = require("../lib/cp-r.js");
const withTmpDir = require("../lib/withTmpDir.js");

const cwd = process.cwd();
const thisPackageDir = path.resolve(__dirname, "../");
const lastArg = process.argv[process.argv.length - 1];
const isBuild = lastArg === "build";
const isStart = lastArg === "start";
const isHelp = process.argv.includes("--help") || process.argv.includes("-h");

if (isHelp) {
  require("@docusaurus/core/bin/docusaurus.js");
  return;
}

if (isBuild) {
  process.argv.push("--out-dir");
  process.argv.push(`${cwd}/build`);
}

withTmpDir(async (tmpdir) => {
  console.log("tmpdir", tmpdir);
  process.argv.push(tmpdir);
  const promises = [];

  if (isStart || isBuild) {
    promises.push(cpr(`cfxdoc.config.js`, tmpdir, { cwd }));
    promises.push(cpr(`sidebars.js`, tmpdir, { cwd }));
    promises.push(cpr(`docs/**/*`, tmpdir, { cwd }));
    promises.push(cpr(`**/*`, tmpdir, { cwd: thisPackageDir }));
    promises.push(cpr(`.git/**/*`, tmpdir, { cwd }));
    promises.push(cpr(`.gitmodules`, tmpdir, { cwd }));
  }

  await Promise.all(promises).catch((err) => {
    if (err && err.message) {
      err.message = `[conflux-docusaurus-config] Failed copying files to tmpdir. ${err.message}`;
    }
    console.error(err);
    process.exit(1);
  });

  if (isStart || isBuild) {
    await cpr(`static/**/*`, `${tmpdir}`, { cwd }).catch(() => {});
  }

  if (isStart) {
    const watchingDoc = cpx.watch(`${cwd}/docs/**/*`, `${tmpdir}/docs`, {
      initialCopy: false,
    });
    process.on("exit", () => {
      watchingDoc.close();
    });

    watchingDoc.on("watch-ready", () => {
      process.chdir(tmpdir);
      require(path.resolve(tmpdir, "./development/gen_sidebars_config.js"));
      require(path.resolve(
        tmpdir,
        "./node_modules/@docusaurus/core/bin/docusaurus.js"
      ));
    });
  } else if (isBuild) {
    process.chdir(tmpdir);
    require(path.resolve(tmpdir, "./development/gen_sidebars_config.js"));
    require(path.resolve(
      tmpdir,
      "./node_modules/@docusaurus/core/bin/docusaurus.js"
    ));
  }
});
