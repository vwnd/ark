import {
  bigint,
  pgTable,
  serial,
  text,
  varchar,
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

export const migrations = pgTable("migrations", {
  id: serial("id").primaryKey().notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  timestamp: bigint("timestamp", { mode: "number" }).notNull(),
  name: varchar("name").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey().notNull(),
  speckleId: text("speckle_id").notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: varchar("type").notNull(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  urn: text("urn"),
  status: varchar("status"),
});

export const deliverables = pgTable("deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(),
  key: text("key").notNull(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});
