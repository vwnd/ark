import { relations } from "drizzle-orm/relations";
import { projects, documents, deliverables } from "./schema";

export const documentsRelations = relations(documents, ({one, many}) => ({
	project: one(projects, {
		fields: [documents.project_id],
		references: [projects.id]
	}),
	deliverables: many(deliverables),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	documents: many(documents),
}));

export const deliverablesRelations = relations(deliverables, ({one}) => ({
	document: one(documents, {
		fields: [deliverables.document_id],
		references: [documents.id]
	}),
}));