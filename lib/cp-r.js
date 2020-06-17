const fg = require("fast-glob");
const os = require("os");
const RunQueue = require("run-queue");
const fs = require("fs-extra");

function cpr(
  source,
  dest,
  { cwd = process.cwd(), concurrency = os.cpus().length } = {}
) {
  const files = fg.sync(source, {
    cwd,
    concurrency,
  });
  const queue = new RunQueue({
    maxCocurrency: concurrency,
  });
  files.forEach((path) => {
    queue.add(0, () => {
      fs.copySync(`${cwd}/${path}`, `${dest}/${path}`, {
        overwrite: true,
        dereference: true,
      });
    });
  });
  return queue.run();
}

module.exports = cpr;
