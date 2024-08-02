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
      <UserDropdown />
    </header>
  </div>
</template>
