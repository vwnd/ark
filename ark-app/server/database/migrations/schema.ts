import { pgTable, serial, text, bigint, varchar, foreignKey, uuid, integer, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const projects = pgTable("projects", {
	id: serial("id").primaryKey().notNull(),
	speckle_id: text("speckle_id").notNull(),
});

export const migrations = pgTable("migrations", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint("timestamp", { mode: "number" }).notNull(),
	name: varchar("name").notNull(),
});

export const documents = pgTable("documents", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	type: varchar("type").notNull(),
	project_id: integer("project_id").notNull().references(() => projects.id),
	urn: text("urn"),
	status: varchar("status"),
	version: integer("version").default(1).notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
	created_by: uuid("created_by").default(sql`'69374353-86db-4ca4-bc6c-348c96707b2e'`).notNull().references(() => users.id),
});

export const deliverables = pgTable("deliverables", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar("name").notNull(),
	type: varchar("type").notNull(),
	document_id: uuid("document_id").notNull().references(() => documents.id),
	key: text("key").notNull(),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	email: text("email").notNull(),
	name: text("name").notNull(),
	avatar: text("avatar"),
	created_at: timestamp("created_at", { mode: 'string' }).defaultNow(),
});