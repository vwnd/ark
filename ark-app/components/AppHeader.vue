<template>
  <header>
    <nav class="flex w-full items-center justify-between mb-8">
      <BaseLogo class="w-20 h-12" />
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
    </nav>
  </header>
</template>

<script setup lang="ts">
const { data: authData, signOut } = useAuth();

const items = [
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
