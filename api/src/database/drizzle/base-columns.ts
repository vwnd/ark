import { timestamp, varchar } from 'drizzle-orm/pg-core';
import { v7 as uuid } from 'uuid';

export const baseColumns = {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuid()),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
};
