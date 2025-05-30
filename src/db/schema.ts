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

// Zod schemas for validation
export const insertSolutionSchema = createInsertSchema(solutions);
export const selectSolutionSchema = createSelectSchema(solutions);

export const insertFlashcardSchema = createInsertSchema(flashcards);
export const selectFlashcardSchema = createSelectSchema(flashcards);

export const insertAnalysisSessionSchema = createInsertSchema(analysisSessions);
export const selectAnalysisSessionSchema = createSelectSchema(analysisSessions);
