<template>
  <div>
    <div
      class="rounded-lg dark:divide-gray-800 ring-1 ring-gray-200 dark:ring-gray-800 shadow bg-white dark:bg-gray-900 p-3 hover:bg-gray-50 hover:ring-primary-300 cursor-pointer"
    >
      <NuxtLink :href="href">
        <div class="space-y-3">
          <slot>
            <AppPlaceholder class="h-fit aspect-1" />
          </slot>
          <div class="">
            <p class="text-lg font-medium">{{ title }}</p>
            <p class="text-sm text-gray-400 truncate">{{ description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: false,
  },
});
</script>
