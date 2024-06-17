<template>
  <div>Admin page</div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["admin", "auth"],
});
</script>

<style scoped></style>
