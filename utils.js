export async function getDirectoryHandleFromPath(path) {
  const root = await navigator.storage.getDirectory();

  let handle = root;
  for (const directory of path) {
    handle = await handle.getDirectoryHandle(directory, { create: true });
  }

  return handle;
}
