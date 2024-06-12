<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits(["drop"]);
const pending = defineModel();

const columns = ref<Column[]>([
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
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
  },
]);

const selectedColumns = ref<Column[]>([...columns.value]);
const isDraggingOver = ref(false);

// Define props with types
const props = defineProps<{
  data: Item[];
  mode: number;
}>();

export interface Item {
  id: string;
  name: string;
  type: string;
  projectId: number;
  urn: string;
}

export interface Column {
  key: string;
  sortable?: boolean;
  label?: string;
  direction?: "asc" | "desc";
}

const sort = ref({
  column: "name",
  direction: "desc",
});

watchEffect(() => {
  switch (props.mode) {
    case 0:
      if (props.data) selectedColumns.value = [...columns.value];
      break;
    case 1:
      if (props.data) selectedColumns.value = [...columns.value];
      break;
    case 2:
      if (props.data)
        selectedColumns.value = [
          ...columns.value.filter((column) => column.key !== "status"),
        ];
      break;
  }
});

const items = (row) => [
  [
    {
      label: "Edit Name",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Download",
      icon: "i-heroicons-arrow-down-on-square",
      click: () => console.log("Download", row.id),
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => useFetch(`/api/documents/${row.id}`, { method: "delete" }),
    },
  ],
];

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDraggingOver.value = true;
};

const handleDragLeave = () => {
  isDraggingOver.value = false;
};

const handleDrop = async (event: DragEvent) => {
  event.preventDefault();

  emits("drop", event.dataTransfer?.files);
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
        :progress="{ color: 'primary', animation: 'carousel' }"
        :loading="pending"
        :columns="selectedColumns"
        :rows="props.data"
        :sort="sort"
        class="h-80"
      >
        <template #status-data="{ row }">
          <template v-if="row.status === 'done'"
            ><div class="w-3 h-3 bg-green-400 rounded-full" />
          </template>
          <template v-else-if="row.status === 'progress'"
            ><div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
          /></template>
        </template>
        <template #loading-state>
          <div class="flex items-center justify-center h-32">
            <i class="loader --6" />
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
    </div>
  </div>
</template>

<style scoped>
.loader {
  --color: rgb(var(--color-primary-400));
  --size-mid: 6vmin;
  --size-dot: 1.5vmin;
  --size-bar: 0.4vmin;
  --size-square: 3vmin;

  display: block;
  position: relative;
  width: 50%;
  display: grid;
  place-items: center;
}

.loader::before,
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
}

/**
    loader --6
**/
.loader.--6::before {
  width: var(--size-square);
  height: var(--size-square);
  background-color: var(--color);
  top: calc(50% - var(--size-square));
  left: calc(50% - var(--size-square));
  animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {
  0%,
  100% {
    transform: none;
  }

  25% {
    transform: translateX(100%);
  }

  50% {
    transform: translateX(100%) translateY(100%);
  }

  75% {
    transform: translateY(100%);
  }
}
</style>
