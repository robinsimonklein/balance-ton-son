<template>
  <div>
    <AdminHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const adminStore = useAdminStore();
const interval = ref<ReturnType<typeof setInterval> | null>(null);

onMounted(() => {
  adminStore.initialize();

  interval.value = setInterval(() => {
    adminStore.refreshDownloadedIds();
  }, 15 * 1000);
});

onUnmounted(() => {
  adminStore.cleanupChannel();

  if (interval.value) clearInterval(interval.value);
});
</script>
