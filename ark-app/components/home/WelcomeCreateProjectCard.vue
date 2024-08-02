<template>
  <HomeWelcomeCard
    title="Create a project"
    description="Start publishing to Speckle"
    @click="isOpen = true"
  >
    <div
      class="h-fit aspect-1 bg-amber-100 rounded border-gray-400 dark:border-gray-500 opacity-75 px-4 flex items-center justify-center"
    >
      <UIcon
        name="i-heroicons-building-office"
        class="h-12 w-12 text-amber-500"
      />
    </div>
    <ProjectsCreateModal v-model="isOpen" />
  </HomeWelcomeCard>
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>
