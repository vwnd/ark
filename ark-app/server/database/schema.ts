import { relations } from "drizzle-orm";
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
  name: text("name").notNull(),
  speckleId: text("speckle_id"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").notNull(),
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
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id)
    .default("69374353-86db-4ca4-bc6c-348c96707b2e"),
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
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),
});

export const documentsRelations = relations(documents, ({ one, many }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
  }),
  deliverables: many(deliverables),
}));

export const projectsRelations = relations(projects, ({ many, one }) => ({
  documents: many(documents),
  createdBy: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}));

export const deliverablesRelations = relations(deliverables, ({ one }) => ({
  document: one(documents, {
    fields: [deliverables.documentId],
    references: [documents.id],
  }),
}));
