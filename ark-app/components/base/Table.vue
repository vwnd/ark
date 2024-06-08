<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const emits = defineEmits(["drop"]);

// Define interfaces
interface Document {
  id: string;
  name: string;
  type: string;
  projectId: number;
  urn: string;
}

interface Column {
  key: string;
  sortable?: boolean;
  label: string;
  direction?: "asc" | "desc";
}

// Define props with types
const props = defineProps<{
  data: Document[];
}>();

const sort = ref({
  column: "name",
  direction: "desc",
});

// Define columns with the correct types
const columns: Column[] = [
  {
    key: "name",
    sortable: true,
    label: "Name",
  },
  {
    key: "type",
    sortable: true,
    label: "Type",
  },

  {
    key: "urn",
    label: "URN",
  },
];

const selectedColumns = ref<Column[]>([...columns]);

const isDraggingOver = ref(false);

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDraggingOver.value = true;
};

const handleDragLeave = () => {
  isDraggingOver.value = false;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();

  emits("drop", event.dataTransfer.files);
  isDraggingOver.value = false;
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

      <UTable
        :columns="selectedColumns"
        :rows="props.data"
        :sort="sort"
        class="h-80"
      />
    </div>
  </div>
</template>

<style>
/* Global scrollbar styles */
::-webkit-scrollbar {
  width: 10px; /* Make the scrollbar narrow */
  height: 10px; /* For horizontal scrollbar */
}

::-webkit-scrollbar-track {
  background: #f0f0f0; /* Light gray background */
  border-radius: 10px; /* Rounded corners */
}

::-webkit-scrollbar-thumb {
  background-color: #b0b0b0; /* Gray thumb */
  border-radius: 10px; /* Rounded corners */
  border: 2px solid #f0f0f0; /* Optional: creates a space around the thumb */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a0; /* Darker gray on hover */
}
</style>
