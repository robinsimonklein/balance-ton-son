type YoutubeResponse = {
  items: {
    id:
      | string
      | {
          kind: string;
          videoId: string;
        };
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

export const searchYoutube = async (query: string) => {
  if (query.length < 3) return [];

  const { youtubeApiKey } = useRuntimeConfig();

  let results: YoutubeResponse;

  if (query.includes('youtube.com')) {
    // Detect youtube URL and search by ID

    const youtubeId = getYoutubeId(query);
    console.log('ici', query, youtubeId);
    if (!youtubeId) return [];

    results = results = await $fetch<YoutubeResponse>('https://www.googleapis.com/youtube/v3/videos', {
      method: 'GET',
      query: {
        id: youtubeId,
        key: youtubeApiKey,
        part: 'snippet,contentDetails',
      },
    });
    console.log(results);
  } else {
    results = await $fetch<YoutubeResponse>('https://www.googleapis.com/youtube/v3/search', {
      method: 'GET',
      query: {
        q: query,
        key: youtubeApiKey,
        part: 'snippet',
        type: 'video',
      },
    });
  }

  return (
    results.items?.map(item => ({
      youtube_id: typeof item.id === 'string' ? item.id : item.id.videoId,
      title: item.snippet?.title,
      artist: item.snippet?.channelTitle,
      cover: item.snippet?.thumbnails?.default.url,
      duration: item.contentDetails?.duration,
    })) || []
  );
};

export const getYoutubeVideoMetadata = async (youtubeId: string) => {
  const results = await searchYoutube(getYoutubeUrl(youtubeId));

  if (!results[0]) throw createError({ statusCode: 404, message: 'Video not found on Youtube' });

  return results[0];
};
