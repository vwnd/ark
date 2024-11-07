import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: ['src/database/drizzle/schema.ts'],
  out: __dirname + '/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
