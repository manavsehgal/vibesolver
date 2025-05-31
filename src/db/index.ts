// Browser-compatible IndexedDB implementation
import { 
  db,
  solutionOperations as solutionOps,
  flashcardOperations as flashcardOps,
  analysisOperations as analysisOps,
  tagOperations as tagOps,
  dbHealth as health,
  migrationUtils,
  closeDatabase as closeDatabaseImpl
} from './indexeddb';

// Re-export operations from IndexedDB implementation
export const solutionOperations = solutionOps;

export const flashcardOperations = flashcardOps;
export const analysisOperations = analysisOps;
export const tagOperations = tagOps;
export const dbHealth = health;
export const closeDatabase = closeDatabaseImpl;

export { db, migrationUtils };
export * from './schema';
