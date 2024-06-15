import { db } from "~/server/database/drizzle";
import { users } from "~/server/database/schema";

export async function createUser(email: string, name: string, avatar?: string) {
  return db.insert(users).values({ email, name, avatar }).returning();
}
