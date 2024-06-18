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
    const extension = file.name.split(".").pop();

    // 1. get signed url
    const { data } = useFetch("/api/documents/upload-url", {
      query: { projectId: 1, extension },
    });

    const uploadUrl = data.value?.url;
    const key = data.value?.key;

    console.log("uploadUrl", uploadUrl, key);

    // const data = new FormData();
    // data.append("file", file);

    // const response = await useFetch("/api/documents", {
    //   method: "post",
    //   body: data,
    //   headers: { "cache-control": "no-cache" },
    // });

    // refreshDocuments();
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
  <div class="flex flex-col px-8 py-6 space-y-2 min-h-screen max-w-7xl mx-auto">
    <AppHeader />
    <main class="lg:grid lg:grid-cols-2 gap-8 flex-1">
      <div class="flex flex-col space-y-4">
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
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none"
          />
        </div>
        <BaseTabs v-model="tableMode" />
        <div class="h-full">
          <BaseTable
            :data="data"
            @drop="upload"
            :mode="tableMode"
            v-model="pending"
            class=""
          />
        </div>
      </div>
      <div class="border rounded-lg mt-8 lg:mt-0 h-[400px] lg:h-full">
        <iframe
          title="Speckle"
          src="https://app.speckle.systems/projects/f97a0b4c05/models/$ark#embed=%7B%22isEnabled%22%3Atrue%2C%22isTransparent%22%3Atrue%2C%22hideControls%22%3Atrue%7D"
          frameborder="0"
          class="h-full w-full"
        ></iframe>
      </div>
    </main>
  </div>
</template>
