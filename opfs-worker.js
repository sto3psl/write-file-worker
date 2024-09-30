import { getDirectoryHandleFromPath } from "./utils.js";

async function writeFile(path, name, buffer) {
  const bc = new BroadcastChannel(path);
  try {
    const dir = await getDirectoryHandleFromPath(path);
    const file = await dir.getFileHandle(name, { create: true });
    const accessHandle = await file.createSyncAccessHandle();
    console.log(file, accessHandle);

    accessHandle.write(buffer, { at: 0 });
    accessHandle.close();
    bc.postMessage("success");
  } catch (error) {
    bc.postMessage("error");
  } finally {
    bc.close();
  }
}

self.addEventListener("message", async (event) => {
  const [operation, path, name, buffer] = event.data;

  switch (operation) {
    case "opfs-write":
      writeFile(path, name, buffer);
      break;
    default:
      console.log("unknown operation");
      break;
  }
});
