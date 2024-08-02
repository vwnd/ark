<script setup lang="ts">
const firstName = computed(() => {
  const { data } = useAuth();
  const firstName = data.value?.user?.name?.split(" ")[0];
  return firstName;
});

const speckleAuth = useSpeckleAuth();

const recentProjects: {
  id: string;
  title: string;
  description: string;
  href?: string;
}[] = [
  // {
  //   id: 2,
  //   title: "Recent Project 1",
  //   description: "Recently published by Victor.",
  //   href: "/playground",
  // },
  // {
  //   id: 3,
  //   title: "Recent Project 2",
  //   description: "Recently published by Maria.",
  //   href: "/playground",
  // },
];

const handleCreateProject = () => {
  console.log("Create project");
};
</script>

<template>
  <div class="mt-10 space-y-10 pb-20">
    <UContainer>
      <UCard>
        <template #header>
          <p class="text-2xl font-medium">Hi, {{ firstName }}!</p>
        </template>

        <div
          class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4"
        >
          <HomeWelcomeCard
            title="Playground"
            description="Try ark just for fun."
            href="/playground"
          >
            <div
              class="h-fit aspect-1 bg-primary-100 rounded border-gray-400 dark:border-gray-500 opacity-75 px-4 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-puzzle-piece"
                class="h-12 w-12 text-primary"
              />
            </div>
          </HomeWelcomeCard>
          <HomeConnectSpeckleCard v-if="!speckleAuth" />
          <HomeWelcomeCard
            title="Create a project"
            description="Start publishing to Speckle"
            @click="handleCreateProject"
            v-if="speckleAuth"
          >
            <div
              class="h-fit aspect-1 bg-amber-100 rounded border-gray-400 dark:border-gray-500 opacity-75 px-4 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-building-office"
                class="h-12 w-12 text-amber-500"
              />
            </div>
          </HomeWelcomeCard>
          <HomeWelcomeCard v-for="c in recentProjects" :key="c.id" v-bind="c" />
        </div>
      </UCard>
    </UContainer>
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
  </div>
</template>
