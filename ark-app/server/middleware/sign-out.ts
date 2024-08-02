export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  if (url.pathname === "/api/auth/signout") {
    // Clear speckle-auth cookies
    setCookie(event, "speckle-auth", "");
  }
});
