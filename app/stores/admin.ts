import type { RealtimeChannel } from '@supabase/supabase-js';

type ConnectionStatus = { status: string; label: string; color: 'neutral' | 'success' | 'error' | 'warning' };

export const useAdminStore = defineStore('admin', () => {
  const toast = useToast();
  const supabase = useSupabase();

  // State
  const isCommandPaletteOpen = ref(false);

  // Songs data
  const _songs = ref<Database['public']['Tables']['songs']['Row'][]>([]);
  const songsStatus = ref('idle');

  // Downloaded IDs
  const downloadedIds = shallowRef<string[]>([]);

  // Download state
  const isDownloading = ref<string | null>(null);

  // Connection state
  const connection = ref<ConnectionStatus>({ status: '', label: 'Connexion...', color: 'neutral' });
  let channel: RealtimeChannel;
  const reconnectInterval = ref<ReturnType<typeof setInterval> | null>(null);

  const songs = computed(() =>
    _songs.value.map(song => {
      return {
        ...song,
        isDownloaded: downloadedIds.value.includes(song.youtube_id),
      };
    }),
  );

  // Fetch songs
  const fetchSongs = async () => {
    try {
      songsStatus.value = 'pending';
      _songs.value = await $fetch('/api/songs');
      songsStatus.value = 'success';
    } catch (error) {
      console.error(error);
      songsStatus.value = 'error';
    }
  };

  // Refresh downloaded IDs
  const refreshDownloadedIds = async () => {
    try {
      downloadedIds.value = await $fetch('/api/downloads');
    } catch (error) {
      console.error(error);
    }
  };

  // Download a song
  const downloadSong = async (youtubeId: string) => {
    try {
      isDownloading.value = youtubeId;
      await $fetch('/api/downloads', { method: 'POST', body: { id: youtubeId } });
      await refreshDownloadedIds();
    } catch (error) {
      console.error(error);
      toast.add({ title: "Une erreur s'est produite", description: (error as Error).message, color: 'error' });
    } finally {
      isDownloading.value = null;
    }
  };

  // Set connection status
  const setConnectionStatus = (status: string, err?: Error) => {
    connection.value.status = status;
    switch (status) {
      case 'SUBSCRIBED':
        connection.value.label = 'Connecté';
        connection.value.color = 'success';
        stopReconnectTimer();
        break;
      case 'CHANNEL_ERROR':
      case 'TIMED_OUT':
        connection.value.label = 'Erreur';
        connection.value.color = 'error';
        if (err) console.error('Realtime Error:', err.message);

        // Start interval only if it's not already running
        if (!reconnectInterval.value) {
          console.log('Connection lost. Starting reconnect attempts every 10 seconds...');
          reconnectInterval.value = setInterval(() => {
            console.log('Attempting to reconnect...');
            subscribeToChannel();
          }, 10000); // Try every 10 seconds
        }
        break;
      case 'CLOSED':
        connection.value.label = 'Déconnecté';
        connection.value.color = 'warning';
        break;
    }
  };

  const stopReconnectTimer = () => {
    if (reconnectInterval.value) {
      clearInterval(reconnectInterval.value);
      reconnectInterval.value = null;
    }
  };

  // Handle realtime updates
  const handleRealtimeUpdate = async () => {
    await fetchSongs();
  };

  // Subscribe to channel
  const subscribeToChannel = () => {
    // If a channel already exists, remove it to start fresh
    if (channel) {
      supabase.removeChannel(channel);
    }

    channel = supabase.channel('public:songs');

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'songs' }, handleRealtimeUpdate)
      .subscribe((status, err) => {
        setConnectionStatus(status, err);
      });
  };

  // Cleanup channel
  const cleanupChannel = () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
    stopReconnectTimer();
  };

  // Initialize store
  const initialize = () => {
    fetchSongs();
    refreshDownloadedIds();
    subscribeToChannel();
  };

  return {
    isCommandPaletteOpen,
    songs,
    songsStatus,
    downloadedIds,
    isDownloading,
    connection,
    fetchSongs,
    refreshDownloadedIds,
    downloadSong,
    subscribeToChannel,
    cleanupChannel,
    initialize,
  };
});
