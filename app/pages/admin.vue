<template>
  <UContainer>
    <div class="my-4 flex justify-end">
      <div class="flex items-center gap-2 text-sm">
        <UChip :color="adminStore.connection.color" standalone inset />
        <p>{{ adminStore.connection.label }}</p>
        <UButton
          v-if="adminStore.connection.status !== 'SUBSCRIBED'"
          size="xs"
          color="neutral"
          variant="soft"
          icon="i-lucide-refresh-ccw"
          square
          @click="adminStore.subscribeToChannel"
        />
      </div>
    </div>

    <pre class="text-xs">{{ adminStore.songs }}</pre>

    <UTable :data="adminStore.songs" :columns="columns" :loading="adminStore.songsStatus === 'pending'">
      <template #cover-cell="{ row }">
        <div class="size-10 rounded-sm overflow-hidden">
          <img v-if="row.original.cover?.length" :src="row.original.cover" class="w-full h-full object-cover" alt="" />
        </div>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-2">
          <div class="flex items-center gap-1">
            <CopyButton :value="row.original.url" />
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
              :variant="row.original.isDownloaded ? 'subtle' : 'solid'"
              :color="row.original.isDownloaded ? 'success' : 'primary'"
              :icon="row.original.isDownloaded ? 'i-lucide-check' : 'i-lucide-download'"
              square
              :loading="adminStore.isDownloading === row.original.youtube_id"
              :disabled="!!adminStore.isDownloading"
              @click="adminStore.downloadSong(row.original.youtube_id)"
            />
          </div>
        </div>
      </template>
    </UTable>
  </UContainer>
</template>

<script setup lang="ts">
import CopyButton from '~/CopyButton.vue';

const adminStore = useAdminStore();
const interval = ref<ReturnType<typeof setInterval> | null>(null);

const columns = [
  { id: 'cover', header: '', accessorKey: 'cover' },
  { id: 'title', header: 'Titre', accessorKey: 'title' },
  { id: 'artist', header: 'Artiste', accessorKey: 'artist' },
  { id: 'actions' },
];

onMounted(() => {
  adminStore.initialize();

  interval.value = setInterval(() => {
    adminStore.refreshDownloadedIds();
  }, 10 * 1000);
});

onUnmounted(() => {
  adminStore.cleanupChannel();

  if (interval.value) clearInterval(interval.value);
});
</script>
