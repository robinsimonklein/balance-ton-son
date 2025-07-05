<template>
  <div>
    <NuxtRouteAnnouncer />

    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>

<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: 'dark',
  },
});
</script>
