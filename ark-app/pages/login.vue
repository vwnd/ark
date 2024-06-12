<template>
  <div class="grid lg:grid-cols-2 min-h-screen w-full">
    <div class="flex items-center justify-center p-6 lg:p-10">
      <div class="mx-auto w-full max-w-[400px] space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold">Welcome to ark</h1>
          <p class="text-gray-500 dark:text-gray-400">
            Use your preferred provider to sign in or create a new account.
          </p>
        </div>
        <div class="space-y-4">
          <UButton
            size="md"
            color="primary"
            variant="outline"
            label="Sign in with Google"
            block
            :trailing="false"
            @click="signInWithGoogle"
          >
            <template #leading>
              <UIcon name="i-fe-google" dynamic />
            </template>
          </UButton>
          <UButton
            size="md"
            color="primary"
            variant="outline"
            label="Sign in with GitHub"
            block
            :trailing="false"
            @click="signInWithGithub"
          >
            <template #leading>
              <UIcon name="i-fe-github" dynamic />
            </template>
          </UButton>
          <!-- <UButton
            size="md"
            color="primary"
            variant="outline"
            label="Sign in with Microsoft"
            block
            :trailing="false"
          >
            <template #leading>
              <UIcon name="i-gg-microsoft" dynamic />
            </template>
          </UButton>-->
        </div>
      </div>
    </div>
    <div class="hidden lg:block relative bg-red-400">
      <span class="h-full w-full object-cover m-auto">
        <img src="/hero.png" class="h-full w-full" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const { signIn, data, status } = useAuth();

async function signInWithGoogle() {
  signIn("google");
}

async function signInWithGithub() {
  signIn("github");
}
</script>

<style scoped></style>
