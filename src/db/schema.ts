import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const solutions = sqliteTable('solutions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  awsServices: text('aws_services').notNull(), // JSON string of AWS services
  architecture: text('architecture'), // JSON string of architecture data
  requirements: text('requirements').notNull(),
  costEstimate: real('cost_estimate'),
  recommendations: text('recommendations'), // JSON string of recommendations
  tags: text('tags'), // JSON string of tags array
  status: text('status').default('draft'), // draft, active, archived
  version: integer('version').default(1),
  parentId: text('parent_id'), // for version history
  isTemplate: integer('is_template', { mode: 'boolean' }).default(false),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  lastAccessedAt: integer('last_accessed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const flashcards = sqliteTable('flashcards', {
  id: text('id').primaryKey(),
  solutionId: text('solution_id').references(() => solutions.id),
  front: text('front').notNull(),
  back: text('back').notNull(),
  category: text('category').notNull(), // e.g., 'service', 'architecture', 'best-practice'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const analysisSessions = sqliteTable('analysis_sessions', {
  id: text('id').primaryKey(),
  solutionId: text('solution_id').references(() => solutions.id),
  criteria: text('criteria').notNull(), // JSON string of analysis criteria
  results: text('results').notNull(), // JSON string of analysis results
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color').default('#3B82F6'), // Project color for UI
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const solutionProjects = sqliteTable('solution_projects', {
  id: text('id').primaryKey(),
  solutionId: text('solution_id').references(() => solutions.id),
  projectId: text('project_id').references(() => projects.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const exportHistory = sqliteTable('export_history', {
  id: text('id').primaryKey(),
  solutionId: text('solution_id').references(() => solutions.id),
  exportType: text('export_type').notNull(), // pdf, png, svg, json, yaml, terraform, etc.
  filename: text('filename').notNull(),
  settings: text('settings'), // JSON string of export settings
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').default('#6B7280'),
  usageCount: integer('usage_count').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Zod schemas for validation
export const insertSolutionSchema = createInsertSchema(solutions);
export const selectSolutionSchema = createSelectSchema(solutions);

export const insertFlashcardSchema = createInsertSchema(flashcards);
export const selectFlashcardSchema = createSelectSchema(flashcards);

export const insertAnalysisSessionSchema = createInsertSchema(analysisSessions);
export const selectAnalysisSessionSchema = createSelectSchema(analysisSessions);

export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);

export const insertSolutionProjectSchema = createInsertSchema(solutionProjects);
export const selectSolutionProjectSchema = createSelectSchema(solutionProjects);

export const insertExportHistorySchema = createInsertSchema(exportHistory);
export const selectExportHistorySchema = createSelectSchema(exportHistory);

export const insertTagSchema = createInsertSchema(tags);
export const selectTagSchema = createSelectSchema(tags);
