import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: 'src/database/drizzle',
  schema: 'src/database/drizzle/schema.ts',
  dbCredentials: {
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    ssl: false,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
});
