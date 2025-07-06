export default defineEventHandler(async () => {
  const { data: songs, error } = await useSupabase()
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw createError(error);
  }

  return songs.map(song => ({ ...song }));
});
