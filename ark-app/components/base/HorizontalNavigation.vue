<script setup lang="ts">
const route = useRoute();

const links = [
  {
    label: "All",
    icon: "i-heroicons-folder",
  },
  {
    label: "Models",
    icon: "i-heroicons-home",
  },
  {
    label: "Deliverables",
    icon: "i-heroicons-square-2-stack",
  },
];
</script>

<template>
  <UHorizontalNavigation :links="links" />
</template>
