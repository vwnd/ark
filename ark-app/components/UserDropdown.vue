<template>
  <UDropdown v-if="authData?.user" :items="items">
    <UAvatar
      v-if="authData.user"
      :src="authData?.user?.image || undefined"
      :alt="authData.user.name || 'user-name'"
      class="bg-red-400"
      size="sm"
      :ui="{ placeholder: 'text-white' }"
    />
  </UDropdown>
</template>

<script setup lang="ts">
import type { DropdownItem } from "#ui/types";
const { data: authData, signOut } = useAuth();

const items: DropdownItem[][] = [
  [
    {
      label: "Sign Out",
      icon: "i-heroicons-arrow-right-start-on-rectangle",
      click: () => {
        signOut();
      },
    },
  ],
];
</script>

<style scoped></style>
