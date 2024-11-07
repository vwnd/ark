import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { baseColumns } from '@/database/drizzle/base-columns';

export const users = pgTable('users', {
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 320 }).unique().notNull(),
  password: text('password').notNull(),
  ...baseColumns,
});
