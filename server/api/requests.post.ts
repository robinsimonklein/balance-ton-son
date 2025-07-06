import { z } from 'zod';

const schema = z.object({
  url: z.string().includes('youtube.com'),
});

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, schema.parse);

  const id = getYoutubeId(body.url);

  const { data: requests, error } = await useSupabase()
    .from('requests')
    .insert([{ youtube_id: id }]);

  if (error) {
    throw createError(error);
  }

  return requests;
});
