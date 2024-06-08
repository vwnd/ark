<script setup lang="ts">
import { ref } from "vue";

const columns = [
  {
    key: "name",
    sortable: true,
    label: "Name",
  },
  {
    key: "title",
    sortable: true,
    label: "Title",
  },
  {
    key: "email",
    sortable: true,
    label: "Email",
  },
  {
    key: "role",
    sortable: true,
    label: "Role",
  },
];

const selectedColumns = ref([...columns]);

const people = [
  {
    id: 2,
    name: "Belmon Dawg",
    title: "Designer",
    email: "courtney.henry@example.com",
    role: "Admin",
  },
  {
    id: 3,
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    role: "Member",
  },
  {
    id: 4,
    name: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    role: "Admin",
  },
  {
    id: 5,
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    role: "Owner",
  },
  {
    id: 6,
    name: "Floyd Miles",
    title: "Principal Designer",
    email: "floyd.miles@example.com",
    role: "Member",
  },
];

const isDraggingOver = ref(false);

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDraggingOver.value = true;
};

const handleDragLeave = () => {
  isDraggingOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDraggingOver.value = false;
  // Handle file drop logic here
};
</script>

<template>
  <div
    class="relative"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div
      class="border rounded-lg"
      :class="{
        'ring-2 ring-gray-400 opacity-50': isDraggingOver,
      }"
    >
      <div
        class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <USelectMenu
          v-model="selectedColumns"
          :options="columns"
          multiple
          placeholder="Columns"
        />
      </div>

      <UTable :columns="selectedColumns" :rows="people" class="h-80" />
    </div>
  </div>
</template>

<style scoped></style>
