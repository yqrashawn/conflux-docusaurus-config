const tmp = require("tmp");
const { removeSync } = require("fs-extra");

module.exports = async function withTmpDir(func) {
  const { name: tmpdir } = tmp.dirSync();
  await func(tmpdir);
  process.on("beforeExit", () => {
    console.log('beforeexit')
    removeSync(tmpdir);
  });
};
