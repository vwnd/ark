<template>
  <section>
    <UContainer>
      <UCard
        :ui="{
          body: {
            padding: 'px-2 py-2 sm:px-2 sm:py-2',
          },
        }"
      >
        <template #header>
          <div class="flex justify-between">
            <p class="text-2xl font-medium">Your recent projects</p>
            <div class="space-x-3">
              <UButton variant="link" to="/projects">See all projects</UButton>
              <UButton @click="isCreateProjectModalOpen = true">Create</UButton>
            </div>
          </div>
        </template>

        <div
          class="h-72 flex items-center justify-center"
          v-if="projects.length === 0"
        >
          <UIcon
            name="i-heroicons-archive-box"
            class="h-6 w-6 text-gray-400 mr-3"
          />
          <p class="text-sm text-gray-400">You currently have no projects.</p>
        </div>

        <div v-if="projects && projects" class="flex">
          <div
            v-for="p in projects"
            :key="p.id"
            class="space-y-3 p-2 w-[150px] hover:bg-gray-50 hover:ring-1 hover:ring-primary-300 cursor-pointer rounded-lg"
          >
            <AppPlaceholder class="h-[150px]" />
            <div>
              <h3 class="font-medium leading-none">{{ p.name }}</h3>
              <p class="text-xs">{{ lastActivity(p) }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </UContainer>
    <ProjectsCreateModal v-model="isCreateProjectModalOpen" />
  </section>
</template>

<script setup lang="ts">
import moment from "moment";

const { data: projects, error } = useFetch("/api/projects", {
  key: "projects",
  default: () => [],
});

const isCreateProjectModalOpen = ref(false);

const lastActivity = (p: { createdAt: string }) => {
  return moment(p.createdAt).fromNow();
};
</script>
