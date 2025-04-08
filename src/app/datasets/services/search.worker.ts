/// <reference lib="webworker" />

/**
 * Worker that handles searching files to avoid blocking the UI
 */
addEventListener("message", ({ data }) => {
  const { files, searchTerm, filters } = data;

  if (!files || !Array.isArray(files)) {
    postMessage({ matchingFiles: [] });
    return;
  }

  // Perform search operation (doesn't block UI thread)
  const matchingFiles = files.filter((file) =>
    file.numor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter based on active filters
  const filteredResults = matchingFiles.filter((file) => {
    for (const [key, value] of Object.entries(filters || {})) {
      if (file[key] !== value) {
        return false;
      }
    }
    return true;
  });

  // Send results back to main thread
  postMessage({ matchingFiles: filteredResults });
});
