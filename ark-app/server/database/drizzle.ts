import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema";

if (!process.env.DB_URL) {
  throw new Error("Please provide a DB_URL environment variable.");
}

const queryClient = postgres(process.env.DB_URL!);
const db = drizzle(queryClient, { schema: { ...schema } });
export { db, migrate };
