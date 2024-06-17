export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getSession } = useAuth();
  const session = await getSession();

  if (session.role !== "admin") {
    return navigateTo("/");
  }
});
