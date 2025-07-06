import { exec } from 'node:child_process';

export default defineEventHandler(async () => {
  const { downloadPath } = useRuntimeConfig();

  exec(`open "${downloadPath}"`);

  return { success: true };
});
