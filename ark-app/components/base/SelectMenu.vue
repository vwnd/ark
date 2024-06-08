<template>
  <USelectMenu
    searchable
    searchable-placeholder="Search a project..."
    class="w-full lg:w-48"
    v-model="project"
    placeholder="Select a project"
    :options="[
      'Bojka Tower',
      'Shanghai Libary East',
      'Nio House',
      'Leeds Hospital of the Furture',
    ]"
  />
</template>
<script setup lang="ts">
const project = defineModel();
</script>
