<template>
  <div class="min-h-screen grid items-center">
    <div class="w-full">
      <div class="max-w-sm mx-auto grid gap-4 justify-center">
        <UIcon
          v-if="isLoading"
          name="i-heroicons-clock"
          class="w-20 h-20 mx-auto text-yellow-500 animate-bounce"
        />
        <UIcon
          v-else-if="error"
          name="i-heroicons-exclamation-triangle"
          class="w-20 h-20 mx-auto text-primary"
        />
        <UIcon
          v-else
          name="i-heroicons-check-circle"
          class="w-20 h-20 mx-auto text-green-500"
        />
        <p class="w-full text-center text-sm">{{ message }}</p>
        <UProgress v-if="isLoading" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const isLoading = ref(true);
const error = ref(false);
const message = ref("Finishing your connection...");
const route = useRoute();

if (route.query.denied === "true") {
  message.value = "You denied the connection to Speckle.";
  isLoading.value = false;
}

const { execute } = useAsyncData(async () => {
  const accessCode = route.query["access_code"]?.toString();
  const codeChallenge = localStorage.getItem("SPECKLE_CODE_CHALLENGE");
  if (accessCode && codeChallenge) {
    const data = await exchangeAccessCode(accessCode, codeChallenge);
    if (data.token) {
      message.value =
        "You have successfully connected to Speckle!\nYou can close this window now.";
      error.value = false;
    } else {
      message.value = "There was an error connecting to Speckle.";
      error.value = true;
    }
  } else {
    message.value = "There was an error connecting to Speckle.";
    error.value = true;
  }
  isLoading.value = false;
});

async function exchangeAccessCode(accessCode: string, codeChallenge: string) {
  const { speckleAppId, speckleAppSecret } = useRuntimeConfig().public;
  const body = JSON.stringify({
    accessCode,
    appId: speckleAppId,
    appSecret: speckleAppSecret,
    challenge: codeChallenge,
  });

  var res = await fetch(`https://app.speckle.systems/auth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  var data = await res.json();
  console.log("hello", JSON.stringify(data));
  if (data.token) {
    localStorage.removeItem(codeChallenge);
    localStorage.setItem("SPECKLE_TOKEN", data.token);
    localStorage.setItem("SPECKLE_REFRESH_TOKEN", data.refreshToken);
    useSpeckleAuth().value = {
      accessToken: data.token,
      refreshToken: data.refreshToken,
    };
  }
  return data;
}

onMounted(() => {
  execute();
});
</script>

<style scoped></style>
