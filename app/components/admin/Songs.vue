<template>
  <UTable :data="adminStore.songs" :columns="columns" :loading="adminStore.songsStatus === 'pending'">
    <template #cover-cell="{ row }">
      <div class="aspect-video h-10 rounded-md overflow-hidden">
        <img v-if="row.original.cover?.length" :src="row.original.cover" class="w-full h-full object-cover" alt="" />
      </div>
    </template>
    <template #title-cell="{ row }">
      <div>
        <p class="text-default font-semibold">{{ row.original.title }}</p>
        <p v-if="row.original.artist">{{ row.original.artist }}</p>
      </div>
    </template>
    <template #duration-cell="{ row }">
      <span>{{ formatDuration(row.original.duration) }}</span>
    </template>
    <template #actions-cell="{ row }">
      <div class="flex items-center justify-end gap-4">
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
</template>

<script setup lang="ts">
const adminStore = useAdminStore();

const columns = [
  { id: 'cover', header: '', accessorKey: 'cover' },
  { id: 'duration', header: 'Durée', accessorKey: 'duration' },
  { id: 'title', header: 'Titre', accessorKey: 'title' },
  { id: 'actions' },
];
</script>
