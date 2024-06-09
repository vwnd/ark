<script setup lang="ts">
const items = [
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
  <UTabs :items="items" class="w-full">
    <template #default="{ item, index, selected }">
      <div class="flex items-center gap-2 relative truncate">
        <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

        <span class="truncate">{{ item.label }}</span>
      </div>
    </template>
  </UTabs>
</template>
