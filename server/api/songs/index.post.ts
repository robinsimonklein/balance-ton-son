import { z } from 'zod';

const schema = z.object({
  youtubeId: z.string().optional(),
  url: z.string().includes('youtube.com').optional(),
});

export default defineEventHandler(async event => {
  const body = await readValidatedBody(event, schema.parse);

  let youtubeId: string | null = null;
  if (body.youtubeId) {
    youtubeId = body.youtubeId;
  } else if (body.url) {
    youtubeId = getYoutubeId(body.url);
  }

  if (!youtubeId?.length) throw createError({ statusCode: 400, message: 'Invalid body' });

  // Check if the song already exists in the database
  const { data: existingSong, error: selectError } = await useSupabase()
    .from('songs')
    .select('id')
    .eq('youtube_id', youtubeId)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // 'PGRST116' means no rows found, which is fine
    throw createError(selectError);
  }

  if (existingSong) {
    throw createError({ statusCode: 400, message: 'This song has already been added.', data: existingSong });
  }

  // Get song data
  const metadata = await getYoutubeVideoMetadata(youtubeId);

  const { data: songs, error } = await useSupabase()
    .from('songs')
    .insert([{ youtube_id: youtubeId, url: getYoutubeUrl(youtubeId), ...metadata }]);

  if (error) {
    throw createError(error);
  }

  return songs;
});
