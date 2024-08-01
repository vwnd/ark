// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@sidebase/nuxt-auth"],
  auth: {
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: {
      isEnabled: true,
    },
    baseURL: process.env.AUTH_ORIGIN + "/api/auth",
  },
  colorMode: {
    preference: "light",
  },
  runtimeConfig: {
    public: {
      speckleAppId: "",
    },
  },
});
