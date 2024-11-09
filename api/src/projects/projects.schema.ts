import { baseColumns } from '@/database/drizzle/base-columns';
import { models } from '@/models/persistence/models.schema';
import { users } from '@/users/schema/users.schema';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

// Projects

export const projects = pgTable('projects', {
  name: varchar('name', { length: 255 }).notNull(),
  createdBy: varchar('created_by').notNull(),
  ...baseColumns,
});

export const projectRelations = relations(projects, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  models: many(models),
}));
