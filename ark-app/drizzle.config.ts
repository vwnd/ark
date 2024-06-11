import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/database/schema.ts",
  out: "./server/database/drizzle/migrations",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
});
