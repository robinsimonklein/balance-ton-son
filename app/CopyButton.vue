<template>
  <UButton
    color="neutral"
    variant="subtle"
    :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
    square
    @click="handleClick"
  />
</template>

<script setup lang="ts">
const { copy, copied } = useClipboard();

const props = defineProps<{ value: string }>();

const handleClick = () => {
  copy(props.value);
};
</script>
