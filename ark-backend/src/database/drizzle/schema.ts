import {
  bigint,
  pgTable,
  serial,
  text,
  varchar,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';

export const migrations = pgTable('migrations', {
  id: serial('id').primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
  name: varchar('name').notNull(),
});

export const documentTypeEnum = pgEnum('document_type', ['pdf', 'rvt', '3dm']);

export const projects = pgTable('projects', {
  id: serial('id').primaryKey().notNull(),
  speckleId: text('speckle_id').notNull(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').notNull(),
  type: documentTypeEnum('type').notNull(),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id),
});
