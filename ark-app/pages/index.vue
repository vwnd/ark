<script setup lang="ts">
import { ref } from "vue";
import type { Item } from "~/components/base/Table.vue";

const { data: documents, refresh: refreshDocuments } = await useFetch(
  "/api/documents"
);
const { data: deliverables, refresh: refreshdeliverables } =
  useFetch("/api/deliverables");

const pending = ref(false);
const tableMode = ref(0);
const data = ref<Item[]>(documents.value);

const project = ref<string | null>("Bojka Tower");
const fileName = ref<string>("No file selected");
const fileInput = ref<HTMLInputElement | null>(null);

watchEffect(() => {
  switch (tableMode.value) {
    case 0:
      if (documents.value && deliverables.value)
        data.value = [...documents.value, ...deliverables.value];
      break;
    case 1:
      if (documents.value) data.value = documents.value;
      break;
    case 2:
      if (deliverables.value) data.value = deliverables.value;
      break;
  }
});

const pickFile = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

async function upload(files: File[]) {
  pending.value = true;

  if (files.length > 0) {
    const file = files[0];
    const data = new FormData();
    data.append("file", file);

    const response = await useFetch("/api/documents/upload", {
      method: "post",
      body: data,
      headers: { "cache-control": "no-cache" },
    });

    refreshDocuments();
  }

  pending.value = false;
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    fileName.value = `Selected file: ${input.files[0].name}`;
  } else {
    fileName.value = "No file selected";
  }
};
</script>

<template>
  <div class="flex w-full justify-center">
    <div class="p-8 max-w-3xl space-y-2 w-full">
      <nav class="flex w-full items-center justify-between mb-8">
        <BaseLogo class="w-20 h-12" />
        <UAvatar
          alt="D B"
          class="bg-red-400"
          size="sm"
          :ui="{ placeholder: 'text-white' }"
        />
      </nav>
      <div class="flex h-8 w-full justify-between">
        <BaseSelectMenu class="max-w-60" v-model="project" />
        <UButton
          @click="pickFile()"
          icon="i-heroicons-arrow-down-tray"
          size="sm"
          color="primary"
          variant="solid"
          label="Upload"
          :trailing="false"
        />
      </div>
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        style="display: none"
      />
      <div>
        <BaseTabs v-model="tableMode" />
      </div>
      <BaseTable :data="data" @drop="upload" v-model="pending" class="pb-10" />
      <div class="border rounded-lg">
        <iframe
          title="Speckle"
          src="https://app.speckle.systems/projects/f97a0b4c05/models/3e6646ea69,e00437cc0d,ec537459b4#embed=%7B%22isEnabled%22%3Atrue%2C%22isTransparent%22%3Atrue%7D"
          width="700"
          height="400"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>
