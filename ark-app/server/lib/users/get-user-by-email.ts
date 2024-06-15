import { db } from "~/server/database/drizzle";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });
}
