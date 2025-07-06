export const getYoutubeId = (url: string) => {
  if (!url.includes('youtube.com')) return null;

  const u = new URL(url);
  return u.searchParams.get('v') || null;
};

export const getYoutubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
