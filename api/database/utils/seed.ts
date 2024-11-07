import 'dotenv/config';
import postgres from 'postgres';
import { projects } from '@/projects/projects.schema';
import { drizzle } from 'drizzle-orm/postgres-js';

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL must be set');
}

const client = postgres(databaseURL);
const db = drizzle(client);

(async () => {
  try {
    const result = await db
      .insert(projects)
      .values([
        {
          name: 'Project 1',
        },
      ])
      .returning({ id: projects.id });

    console.log('Seeded projects', result);
  } catch (error) {
    console.error('Failted to seed projects', error);
  } finally {
    await client.end();
  }
})();
