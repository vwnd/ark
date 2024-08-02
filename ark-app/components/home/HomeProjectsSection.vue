<template>
  <section>
    <UContainer>
      <UCard>
        <template #header>
          <div class="flex justify-between">
            <p class="text-2xl font-medium">Your projects</p>
            <div class="space-x-3">
              <UButton variant="link" to="/projects">Show all</UButton>
              <UButton>Create</UButton>
            </div>
          </div>
        </template>

        <div class="h-72 flex items-center justify-center">
          <UIcon
            name="i-heroicons-archive-box"
            class="h-6 w-6 text-gray-400 mr-3"
          />
          <p class="text-sm text-gray-400">You currently have no projects.</p>
        </div>
      </UCard>
    </UContainer>
  </section>
</template>
