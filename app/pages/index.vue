<template>
  <UContainer>
    <div class="my-12">
      <UForm :state class="mx-auto w-lg flex items-center gap-2" @submit.prevent="handleSubmit">
        <UInput v-model="state.url" class="flex-1" placeholder="Coller une URL YoutTube..." />
        <UButton
          type="submit"
          icon="i-lucide-download"
          label="Télécharger"
          :loading="isLoading"
          :disabled="!state.url.length"
        />
      </UForm>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';

const toast = useToast();

const state = reactive({ url: '' });

const isLoading = ref(false);

const handleSubmit = async (event: FormSubmitEvent<{ url: string }>) => {
  try {
    isLoading.value = true;

    await $fetch('/api/download', {
      method: 'POST',
      body: event.data,
    });

    toast.add({ title: 'Morceau téléchargé', color: 'success' });

    state.url = '';
  } catch (error) {
    toast.add({ title: 'Téléchargement échoué', description: (error as Error).message, color: 'error' });
  } finally {
    isLoading.value = false;
  }
};
</script>
