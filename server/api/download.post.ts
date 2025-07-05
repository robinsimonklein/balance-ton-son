import { z } from 'zod';
import { spawn } from 'node:child_process';

const schema = z.object({
  url: z.string().includes('youtube.com'),
});

export default defineEventHandler(async event => {
  const { url } = await readValidatedBody(event, schema.parse);

  const outputDir = '~/Music/Mixxx/Test'; // à adapter si besoin
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
    '--write-thumbnail',
    '-o',
    `${outputDir}/%(title)s.%(ext)s`,
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
