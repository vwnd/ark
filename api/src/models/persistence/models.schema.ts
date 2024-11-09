import { baseColumns } from '@/database/drizzle/base-columns';
import { enumToPgEnum } from '@/database/drizzle/utils/enum-to-pg-enum';
import { projects } from '@/projects/projects.schema';
import { users } from '@/users/schema/users.schema';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { ModelStatus } from '../graphql/type/model-status.enum';
import { ModelType } from '../graphql/type/model-type.enum';

export const modelTypeEnum = pgEnum('model_type', enumToPgEnum(ModelType));
export const modelStatusEnum = pgEnum(
  'model_status',
  enumToPgEnum(ModelStatus),
);

export const models = pgTable('models', {
  name: varchar('name', { length: 255 }).notNull(),
  createdBy: varchar('created_by').notNull(),
  projectId: varchar('project_id').notNull(),
  type: modelTypeEnum('type').notNull(),
  status: modelStatusEnum('status').default(ModelStatus.CREATED).notNull(),
  fileStorageKey: varchar('file_storage_key'),
  ...baseColumns,
});

export const modelRelations = relations(models, ({ one }) => ({
  createdBy: one(users, {
    fields: [models.createdBy],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [models.projectId],
    references: [projects.id],
  }),
}));
