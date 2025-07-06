export default defineEventHandler(async () => {
  const { data: requests, error } = await useSupabase().from('requests').select('*');

  if (error) {
    throw createError(error);
  }

  return requests.map(request => ({ ...request, url: getYoutubeUrl(request.youtube_id) }));
});
