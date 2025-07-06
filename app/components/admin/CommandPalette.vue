<template>
  <UModal v-model:open="adminStore.isCommandPaletteOpen" :ui="{ content: 'max-w-2xl' }">
    <template #content>
      <UCommandPalette
        v-model:search-term="searchTerm"
        :groups
        :loading="status === 'pending'"
        placeholder="Rechercher une vidéo ou coller l'URL..."
        icon="i-logos-youtube-icon"
        :ui="{
          itemLeadingAvatar: 'rounded-none',
          itemLeadingAvatarSize: 'lg',
        }"
      >
        <template #item-trailing="{ item }">
          <UBadge v-if="item.isExisting" color="success" variant="subtle" icon="i-lucide-check">Ajouté</UBadge>
        </template>
      </UCommandPalette>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const toast = useToast();
const adminStore = useAdminStore();

const searchTerm = ref('');
const searchTermDebounced = refDebounced(searchTerm, 500);

const { data: results, status } = await useFetch('/api/youtube/search', {
  params: { q: searchTermDebounced },
  transform: data => {
    return (
      data?.map(result => {
        const existing = adminStore.songs.find(song => song.youtube_id === result.youtube_id);

        return {
          id: result.youtube_id,
          label: result.title,
          suffix: result.artist,
          avatar: { src: result.cover },
          isExisting: !!existing,
          isDownloaded: existing?.isDownloaded || false,
          disabled: !!existing,
          onSelect: handleSelect,
        };
      }) || []
    );
  },
  lazy: true,
});

const groups = computed(() => [
  {
    id: 'results',
    items: results.value || [],
    ignoreFilter: true,
  },
]);

const handleSelect = async (event: CustomEvent<{ value: { id: string; isExisting: boolean } }>) => {
  const { id, isExisting } = event.detail.value;

  if (isExisting) return;

  try {
    await $fetch('/api/songs', {
      method: 'POST',
      body: {
        youtubeId: id,
      },
    });

    searchTerm.value = '';
    adminStore.isCommandPaletteOpen = false;

    toast.add({ title: 'Titre ajouté', icon: 'i-lucide-check', color: 'success' });
  } catch (error) {
    toast.add({ title: "Une erreur s'est produite", description: (error as Error).message, color: 'error' });
  }
};

defineShortcuts({
  meta_k: () => {
    adminStore.isCommandPaletteOpen = true;
  },
});
</script>
