<script setup lang="ts">
import { initSpeckleAuth } from "~/lib/speckle";
</script>

<template>
  <HomeWelcomeCard
    title="Connect to Speckle"
    description="Link your account"
    @click="initSpeckleAuth"
  >
    <div
      class="h-fit aspect-1 bg-blue-100 rounded border-gray-400 dark:border-gray-500 opacity-75 px-4 flex items-center justify-center"
    >
      <UIcon name="i-heroicons-cube" class="h-12 w-12 text-blue-500" />
    </div>
  </HomeWelcomeCard>
</template>
