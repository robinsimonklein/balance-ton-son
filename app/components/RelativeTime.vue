<template>
  <time>{{ formattedTime }}</time>
</template>

<script setup lang="ts">
const props = defineProps<{ date: Date | string }>();

const formattedTime = ref(formatRelativeTime(props.date));

useIntervalFn(() => {
  formattedTime.value = formatRelativeTime(props.date);
}, 30 * 1000);
</script>
