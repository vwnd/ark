<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-gray-900 dark:text-white font-semibold">
              Create project
            </h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
              Enter the information below to create a new project.
            </p>
          </div>
          <UButton
            :padded="false"
            color="gray"
            variant="link"
            icon="i-heroicons-x-mark-20-solid"
            @click="model = false"
          />
        </div>
      </template>

      <Placeholder class="h-32" />

      <template #footer>
        <div class="flex flex-row-reverse gap-4">
          <UButton>Create</UButton>
          <UButton variant="outline" @click="model = false">Cancel</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();
</script>
