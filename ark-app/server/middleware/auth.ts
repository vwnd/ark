import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  const session = getServerSession(event);

  if (!session) {
    throw createError({
      status: 403,
      message: "Unauthenticated",
    });
  }
});
