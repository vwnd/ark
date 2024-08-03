<script setup lang="ts">
import UserDropdown from "../users/Dropdown.vue";
</script>

<template>
  <div class="border-b">
    <header
      class="flex w-full items-center justify-between px-8 max-w-7xl mx-auto"
    >
      <span class="flex items-center">
        <NuxtLink to="/">
          <BaseLogo class="w-20 h-12 cursor-pointer hover:t" />
        </NuxtLink>
        <UBadge color="primary" variant="outline" class="ml-4" label="Beta" />
      </span>
      <UsersDropdown />
    </header>
  </div>
</template>
