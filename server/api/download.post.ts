import { z } from 'zod';
import { spawn } from 'node:child_process';

const schema = z.object({
  id: z.string(),
});

export default defineEventHandler(async event => {
  const { id } = await readValidatedBody(event, schema.parse);

  const url = getYoutubeUrl(id);

  const { downloadPath } = useRuntimeConfig();

  const args = [
    url,
    '-x',
    '--audio-format',
    'mp3',
    '--no-playlist',
    '--match-filter',
    'duration < 960',
    '--max-filesize',
    '100M',
    '--embed-metadata',
    '--embed-thumbnail',
    '-o',
    `${downloadPath}/%(id)s.%(ext)s`,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', args);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', data => {
      stdout += data.toString();
    });

    proc.stderr.on('data', data => {
      stderr += data.toString();
    });

    proc.on('close', code => {
      if (code === 0) {
        resolve({ success: true, output: stdout });
      } else {
        reject(
          createError({
            statusCode: 500,
            message: `yt-dlp exited with code ${code}`,
            data: stderr,
          }),
        );
      }
    });
  });
});
