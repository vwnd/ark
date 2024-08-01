<template>
  <section class="flex-1 items-center flex bg-gray-100 rounded-lg border">
    <UContainer class="flex items-center gap-3">
      <UButton color="blue" @click="handleSpeckleConnect">Get started</UButton>
      <p class="text-blue-500 text-sm">by connecting your Speckle Account.</p>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
const appId = useRuntimeConfig().public.speckleAppId;
const handleSpeckleConnect = () => {
  const codeChallgenge = crypto.randomUUID();

  localStorage.setItem("SPECKLE_CODE_CHALLENGE", codeChallgenge);

  const speckleAuthUrl = `https://app.speckle.systems/authn/verify/${appId}/${codeChallgenge}`;

  const width = 600;
  const height = 800;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const options = `width=${width},height=${height},left=${left},top=${top}`;

  window.open(speckleAuthUrl, "Ark Speckle Auth", options);
};
</script>

<style scoped></style>
