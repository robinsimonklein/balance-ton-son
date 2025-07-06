import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineEventHandler(async event => {
  const { downloadPath } = useRuntimeConfig();

  try {
    // Read all filenames from the directory.
    const files = readdirSync(downloadPath);

    // This regex looks for an 11-character YouTube ID inside square brackets.
    // e.g., "My Song Title [dQw4w9WgXcQ].mp3"
    const youtubeIdRegex = /\[([a-zA-Z0-9_-]{11})\]/;

    // Use reduce to build an array of found IDs.
    const downloadedIds = files.reduce<string[]>((ids, fileName) => {
      const match = fileName.match(youtubeIdRegex);

      // If a match is found, the ID is in the first capture group (match[1]).
      if (match && match[1]) {
        ids.push(match[1]);
      }

      return ids;
    }, []);

    return downloadedIds;
  } catch (error) {
    // This will happen if the directory doesn't exist.
    console.error(`Error reading directory ${downloadPath}:`, error);
    // Return an empty array in case of an error.
    return [];
  }
});
