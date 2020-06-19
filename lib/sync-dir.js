const chokidar = require("chokidar");
const fs = require("fs-extra");

function sync(source, dest, onReady) {
  source = source.endsWith("/") ? source : source + "/";
  dest = dest.endsWith("/") ? dest : dest + "/";
  const watcher = chokidar.watch(source);
  watcher.on("unlink", (path) => {
    fs.removeSync(dest + path.replace(source, ""));
  });
  watcher.on("add", (path) => {
    fs.copySync(path, dest + path.replace(source, ""));
  });
  watcher.on("change", (path) => {
    fs.copySync(path, dest + path.replace(source, ""));
  });
  watcher.on("ready", () => {
    onReady();
  });
  process.on("exit", () => {
    watcher.close();
  });
  return watcher;
}

module.exports = sync;
