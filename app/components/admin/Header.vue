<template>
  <header class="sticky top-0 z-10 mb-8 px-4 py-2 bg-default">
    <div class="flex items-center">
      <div>
        <UNavigationMenu
          :items="[
            {
              label: 'Ajouter',
              icon: 'i-lucide-plus',
              onSelect: () => {
                adminStore.isCommandPaletteOpen = true;
              },
            },
            {
              label: 'Rejoindre',
              icon: 'i-lucide-qr-code',
              onSelect: showQRCode,
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
import { AdminQRCode } from '#components';

const overlay = useOverlay();
const adminStore = useAdminStore();

const qrCodeModal = overlay.create(AdminQRCode);

const showQRCode = () => {
  const instance = qrCodeModal.open();
};
</script>
