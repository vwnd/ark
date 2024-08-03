<template>
  <UModal v-model="model" @after-leave="onCancelOrLeave">
    <UForm ref="form" :state="state" :schema="schema" @submit="onSubmit">
      <UCard>
        <template #header>
          <div class="flex items-start justify-between">
            <div>
              <h2 class="text-gray-900 dark:text-white font-semibold">
                Create project
              </h2>
              <p class="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                Enter the information below to create a new project.
              </p>
            </div>
            <UButton
              :padded="false"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              @click="model = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Name" name="name" required size="lg">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup
            label="Description"
            name="description"
            hint="(optional)"
            size="lg"
          >
            <UInput v-model="state.description" />
          </UFormGroup>
          <UFormGroup
            label="Access permissions"
            size="lg"
            help="Control how others can access your data."
            required
          >
            <USelectMenu
              v-model="state.access"
              :options="accessOptions"
              by="id"
              option-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="flex flex-row-reverse gap-4">
            <UButton type="submit">Create</UButton>
            <UButton @click="onCancelOrLeave" variant="outline">Cancel</UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>

<script setup lang="ts">
import { z, ZodError } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const accessOptions = [
  {
    id: 0,
    value: "private",
    label: "Private",
  },
  {
    id: 1,
    value: "link-shareable",
    label: "Link Shareable",
  },
  {
    id: 2,
    value: "discoverable",
    label: "Discoverable",
  },
];

const form = ref();

const schema = z.object({
  name: z.string(),
  description: z.string().optional(),
  access: z.enum(["private", "link-shareable", "discoverable"]),
});

const state = reactive({
  name: undefined,
  description: undefined,
  access: accessOptions[0].value,
});

type Schema = z.output<typeof schema>;

const model = defineModel<boolean>();

function resetState() {
  state.name = undefined;
  state.description = undefined;
  state.access = accessOptions[0].value;
}

function onCancelOrLeave() {
  model.value = false;
  resetState();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const response = await $fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(event.data),
  });
  onCancelOrLeave();
}
</script>
