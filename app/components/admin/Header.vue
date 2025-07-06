<template>
  <header class="sticky top-0 z-10 mb-8 px-4 py-2 bg-default">
    <div class="flex items-center">
      <div>
        <UNavigationMenu
          :items="[
            {
              label: 'Ajouter',
              icon: 'i-lucide-plus',
              onSelect: () => (adminStore.isCommandPaletteOpen = true),
            },
          ]"
        />
      </div>
      <div class="ml-auto">
        <div class="flex items-center gap-2 text-sm">
          <UChip :color="adminStore.connection.color" standalone inset />
          <p>{{ adminStore.connection.label }}</p>
          <UButton
            size="xs"
            color="neutral"
            variant="soft"
            icon="i-lucide-refresh-ccw"
            square
            @click="adminStore.subscribeToChannel"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const adminStore = useAdminStore();
</script>
