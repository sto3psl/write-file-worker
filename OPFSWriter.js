export class OPFSWriter {
  #worker = new Worker(new URL("opfs-worker.js", import.meta.url), {
    type: "module",
  });

  write(path, name, buffer) {
    return new Promise((resolve, reject) => {
      const bc = new BroadcastChannel(path);

      bc.addEventListener("message", (event) => {
        console.log(event);
        if (event.data === "success") {
          resolve();
        }
        if (event.data === "error") {
          reject(new TypeError("Failed to write file."));
        }
        bc.close();
      });

      this.#worker.postMessage(["opfs-write", path, name, buffer], [buffer]);
    });
  }

  dispose() {
    this.#worker.terminate();
  }
}
