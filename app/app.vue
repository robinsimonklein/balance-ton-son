<template>
  <div>
    <NuxtRouteAnnouncer />

    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
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
