type YoutubeResponse = {
  items: {
    snippet?: {
      title: string;
      channelTitle: string;
      thumbnails?: {
        default: {
          url: string;
        };
      };
    };
    contentDetails?: {
      duration: string;
    };
  }[];
};

export const getYoutubeVideoMetadata = async (youtubeId: string) => {
  const { youtubeApiKey } = useRuntimeConfig();

  const data = await $fetch<YoutubeResponse>('https://www.googleapis.com/youtube/v3/videos', {
    method: 'GET',
    query: {
      id: youtubeId,
      key: youtubeApiKey,
      part: 'snippet,contentDetails',
    },
  });

  const item = data.items[0];

  if (!item) throw createError({ statusCode: 404, message: 'Video not found on Youtube' });

  return {
    title: item.snippet?.title,
    artist: item.snippet?.channelTitle,
    cover: item.snippet?.thumbnails?.default.url,
    duration: item.contentDetails?.duration,
  };
};
