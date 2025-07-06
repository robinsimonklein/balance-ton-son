<template>
  <UModal>
    <template #content>
      <div class="p-6 flex items-center justify-center">
        <div>
          <div class="size-80">
            <div v-html="svg" />
          </div>
          <div class="flex items-center mt-4 gap-2">
            <UInput :model-value="qrCodeUrl" class="w-full" readonly />
            <div class="flex items-center gap-1">
              <CopyButton :value="qrCodeUrl" />
              <UButton
                :to="qrCodeUrl"
                icon="i-lucide-external-link"
                color="neutral"
                variant="subtle"
                external
                target="_blank"
                square
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { renderSVG } from 'uqr';

const {
  public: { qrCodeUrl },
} = useRuntimeConfig();

const svg = renderSVG((qrCodeUrl as string) || window.location.origin);
</script>
