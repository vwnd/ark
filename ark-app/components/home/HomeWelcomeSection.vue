<template>
  <section>
    <UContainer>
      <UCard>
        <template #header>
          <p class="text-2xl font-medium">Hi, {{ firstName }}!</p>
        </template>

        <div
          class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4"
        >
          <HomeWelcomePlaygroundCard />
          <HomeWelcomeCreateProjectCard v-if="speckleAuth" />
          <HomeConnectSpeckleCard v-else />
          <HomeWelcomeCard v-for="c in recentProjects" :key="c.id" v-bind="c" />
        </div>
      </UCard>
    </UContainer>
  </section>
</template>

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
