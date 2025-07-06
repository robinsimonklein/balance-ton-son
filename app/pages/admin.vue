<template>
  <UContainer>
    <div class="my-4 flex justify-end">
      <div class="flex items-center gap-2 text-sm">
        <UChip :color="connection.color" standalone inset />
        <p>{{ connection.label }}</p>
        <UButton
          v-if="connection.status !== 'SUBSCRIBED'"
          size="xs"
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-ccw"
          square
          @click="channel.subscribe()"
        />
      </div>
    </div>

    <UTable :data="data || []" :columns :loading="status === 'pending'">
      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <div class="flex items-center gap-1">
            <UButton
              color="neutral"
              variant="subtle"
              :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
              square
              @click="copy(row.original.url)"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-external-link"
              :to="row.original.url"
              external
              target="_blank"
              square
            />
          </div>
          <div class="flex items-center gap-1">
            <UButton
              variant="solid"
              icon="i-lucide-download"
              square
              :loading="isDownloading === row.original.youtube_id"
              :disabled="!!isDownloading"
              @click="download(row.original.youtube_id)"
            />
          </div>
        </div>
      </template>
    </UTable>
  </UContainer>
</template>

<script setup lang="ts">
import type { RealtimeChannel } from '@supabase/supabase-js';

const toast = useToast();
const { copy, copied } = useClipboard();

const columns = [{ id: 'url', header: 'URL', accessorKey: 'url' }, { id: 'actions' }];

const { data, status, refresh } = await useFetch('/api/requests');

const isDownloading = ref<string | null>(null);

// Un état plus riche pour la connexion
type ConnectionStatus = { status: string; label: string; color: 'neutral' | 'success' | 'error' | 'warning' };
const connection = ref<ConnectionStatus>({ status: '', label: 'Connecting...', color: 'neutral' });
let channel: RealtimeChannel;

const supabase = useSupabase();

// Fonction pour gérer la mise à jour de l'état
function setConnectionStatus(status: string, err?: Error) {
  connection.value.status = status;
  switch (status) {
    case 'SUBSCRIBED':
      connection.value.label = 'Connected';
      connection.value.color = 'success';
      break;
    case 'CHANNEL_ERROR':
    case 'TIMED_OUT':
      connection.value.label = 'Connection Error';
      connection.value.color = 'error';
      if (err) console.error('Realtime Error:', err.message);
      break;
    case 'CLOSED':
      connection.value.label = 'Disconnected';
      connection.value.color = 'warning';
      break;
  }
}

const handleRealtimeUpdate = (payload: any) => {
  console.log('Realtime update received:', payload);
  refresh();
};

// Fonction pour s'abonner (ou se réabonner)
const subscribeToChannel = () => {
  // Si un canal existe déjà, on le supprime pour repartir de zéro proprement
  if (channel) {
    supabase.removeChannel(channel);
  }

  channel = supabase.channel('requests-channel');

  channel
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'requests' }, handleRealtimeUpdate)
    .subscribe((status, err) => {
      setConnectionStatus(status, err);
    });
};

onMounted(() => {
  subscribeToChannel();
});

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel);
  }
});

// Le reste de votre script (columns, useClipboard, etc.)

const download = async (youtubeId: string) => {
  try {
    isDownloading.value = youtubeId;

    await $fetch('/api/download', { method: 'POST', body: { id: youtubeId } });
  } catch (error) {
    console.error(error);
    toast.add({ title: "Une erreur s'est produite", description: (error as Error).message, color: 'error' });
  } finally {
    isDownloading.value = null;
  }
};
</script>
