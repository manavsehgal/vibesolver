import Dexie, { Table } from 'dexie';

// Type definitions based on existing schema
export interface Solution {
  id: string;
  title: string;
  description: string;
  awsServices: string; // JSON string of AWS services
  architecture: string | null; // JSON string of architecture data
  requirements: string;
  costEstimate: number | null;
  recommendations: string | null; // JSON string of recommendations
  tags: string | null; // JSON string of tags array
  status: string | null; // draft, active, archived
  version: number;
  parentId: string | null; // for version history
  isTemplate: boolean;
  isFavorite: boolean;
  lastAccessedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  solutionId: string | null;
  front: string;
  back: string;
  category: string; // e.g., 'service', 'architecture', 'best-practice'
  createdAt: Date;
}

export interface AnalysisSession {
  id: string;
  solutionId: string | null;
  criteria: string; // JSON string of analysis criteria
  results: string; // JSON string of analysis results
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string; // Project color for UI
  createdAt: Date;
  updatedAt: Date;
}

export interface SolutionProject {
  id: string;
  solutionId: string | null;
  projectId: string | null;
  createdAt: Date;
}

export interface ExportHistory {
  id: string;
  solutionId: string | null;
  exportType: string; // pdf, png, svg, json, yaml, terraform, etc.
  filename: string;
  settings: string | null; // JSON string of export settings
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: Date;
}

// Dexie database class
export class VibeSolverDB extends Dexie {
  solutions!: Table<Solution>;
  flashcards!: Table<Flashcard>;
  analysisSessions!: Table<AnalysisSession>;
  projects!: Table<Project>;
  solutionProjects!: Table<SolutionProject>;
  exportHistory!: Table<ExportHistory>;
  tags!: Table<Tag>;

  constructor() {
    super('VibeSolverDatabase');
    
    this.version(1).stores({
      solutions: 'id, title, description, status, isFavorite, createdAt, updatedAt, lastAccessedAt',
      flashcards: 'id, solutionId, category, createdAt',
      analysisSessions: 'id, solutionId, createdAt',
      projects: 'id, name, createdAt, updatedAt',
      solutionProjects: 'id, solutionId, projectId, createdAt',
      exportHistory: 'id, solutionId, exportType, createdAt',
      tags: 'id, name, usageCount, createdAt'
    });
  }
}

// Initialize database instance
export const db = new VibeSolverDB();

// Helper function to ensure default values
const ensureDefaults = (solutionData: Partial<Solution>): Solution => {
  const now = new Date();
  return {
    architecture: null,
    costEstimate: null,
    recommendations: null,
    tags: null,
    status: 'draft',
    version: 1,
    parentId: null,
    isTemplate: false,
    isFavorite: false,
    lastAccessedAt: null,
    createdAt: now,
    updatedAt: now,
    ...solutionData
  } as Solution;
};

// Solution CRUD operations
export const solutionOperations = {
  async create(solutionData: Partial<Solution>) {
    try {
      const solution = ensureDefaults(solutionData);
      await db.solutions.add(solution);
      return solution;
    } catch (error) {
      console.error('Failed to create solution:', error);
      throw new Error('Failed to save solution');
    }
  },

  async getAll() {
    try {
      return await db.solutions.orderBy('updatedAt').reverse().toArray();
    } catch (error) {
      console.error('Failed to load solutions:', error);
      throw new Error('Failed to load solutions');
    }
  },

  async getById(id: string) {
    try {
      return await db.solutions.get(id) || null;
    } catch (error) {
      console.error('Failed to load solution:', error);
      throw new Error('Failed to load solution');
    }
  },

  async update(id: string, updates: Partial<Solution>) {
    try {
      const updatedData = { ...updates, updatedAt: new Date() };
      await db.solutions.update(id, updatedData);
      return await this.getById(id);
    } catch (error) {
      console.error('Failed to update solution:', error);
      throw new Error('Failed to update solution');
    }
  },

  async delete(id: string) {
    try {
      await db.solutions.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete solution:', error);
      throw new Error('Failed to delete solution');
    }
  },

  async bulkDelete(ids: string[]) {
    try {
      await db.solutions.bulkDelete(ids);
      return true;
    } catch (error) {
      console.error('Failed to bulk delete solutions:', error);
      throw new Error('Failed to delete solutions');
    }
  },

  async search(query: string) {
    try {
      const lowerQuery = query.toLowerCase();
      return await db.solutions
        .filter(solution => 
          solution.title.toLowerCase().includes(lowerQuery) ||
          solution.description.toLowerCase().includes(lowerQuery) ||
          (solution.tags?.toLowerCase().includes(lowerQuery) || false)
        )
        .reverse()
        .sortBy('updatedAt');
    } catch (error) {
      console.error('Failed to search solutions:', error);
      throw new Error('Failed to search solutions');
    }
  },

  async updateLastAccessed(id: string) {
    try {
      await db.solutions.update(id, { lastAccessedAt: new Date() });
    } catch (error) {
      console.error('Failed to update last accessed:', error);
    }
  },

  async toggleFavorite(id: string) {
    try {
      const solution = await this.getById(id);
      if (!solution) throw new Error('Solution not found');
      
      const updatedSolution = { 
        ...solution, 
        isFavorite: !solution.isFavorite, 
        updatedAt: new Date() 
      };
      
      await db.solutions.update(id, updatedSolution);
      return updatedSolution;
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  }
};

// Flashcard operations
export const flashcardOperations = {
  async create(flashcardData: Partial<Flashcard>) {
    try {
      const flashcard: Flashcard = {
        createdAt: new Date(),
        ...flashcardData
      } as Flashcard;
      
      await db.flashcards.add(flashcard);
      return flashcard;
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      throw new Error('Failed to save flashcard');
    }
  },

  async getBySolutionId(solutionId: string) {
    try {
      return await db.flashcards
        .where('solutionId')
        .equals(solutionId)
        .sortBy('createdAt');
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      throw new Error('Failed to load flashcards');
    }
  },

  async delete(id: string) {
    try {
      await db.flashcards.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      throw new Error('Failed to delete flashcard');
    }
  }
};

// Analysis session operations
export const analysisOperations = {
  async create(analysisData: Partial<AnalysisSession>) {
    try {
      const analysis: AnalysisSession = {
        createdAt: new Date(),
        ...analysisData
      } as AnalysisSession;
      
      await db.analysisSessions.add(analysis);
      return analysis;
    } catch (error) {
      console.error('Failed to create analysis session:', error);
      throw new Error('Failed to save analysis');
    }
  },

  async getBySolutionId(solutionId: string) {
    try {
      return await db.analysisSessions
        .where('solutionId')
        .equals(solutionId)
        .reverse()
        .sortBy('createdAt');
    } catch (error) {
      console.error('Failed to load analysis sessions:', error);
      throw new Error('Failed to load analysis sessions');
    }
  }
};

// Tag operations
export const tagOperations = {
  async create(tagData: Partial<Tag>) {
    try {
      const tag: Tag = {
        color: '#6B7280',
        usageCount: 0,
        createdAt: new Date(),
        ...tagData
      } as Tag;
      
      await db.tags.add(tag);
      return tag;
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw new Error('Failed to create tag');
    }
  },

  async getAll() {
    try {
      return await db.tags.orderBy('usageCount').reverse().toArray();
    } catch (error) {
      console.error('Failed to load tags:', error);
      throw new Error('Failed to load tags');
    }
  },

  async incrementUsage(name: string) {
    try {
      const existingTag = await db.tags.where('name').equals(name).first();
      
      if (existingTag) {
        await db.tags.update(existingTag.id, { 
          usageCount: (existingTag.usageCount || 0) + 1 
        });
      } else {
        await this.create({
          id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          usageCount: 1,
        });
      }
    } catch (error) {
      console.error('Failed to increment tag usage:', error);
    }
  }
};

// Database health check
export const dbHealth = {
  async check() {
    try {
      await db.solutions.limit(1).toArray();
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error', 
        timestamp: new Date() 
      };
    }
  },

  async getStats() {
    try {
      const [solutions, flashcards, analyses] = await Promise.all([
        db.solutions.count(),
        db.flashcards.count(),
        db.analysisSessions.count()
      ]);
      
      return {
        solutions,
        flashcards,
        analyses,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return null;
    }
  }
};

// Database migration utility (for migrating from SQLite)
export const migrationUtils = {
  async importSolutions(solutions: Solution[]) {
    try {
      await db.transaction('rw', db.solutions, async () => {
        for (const solution of solutions) {
          await db.solutions.put(solution);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to import solutions:', error);
      return false;
    }
  },

  async clearAllData() {
    try {
      await db.transaction('rw', [db.solutions, db.flashcards, db.analysisSessions, db.tags], async () => {
        await db.solutions.clear();
        await db.flashcards.clear();
        await db.analysisSessions.clear();
        await db.tags.clear();
      });
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  },

  async exportAllData() {
    try {
      const [solutions, flashcards, analyses, tags] = await Promise.all([
        db.solutions.toArray(),
        db.flashcards.toArray(),
        db.analysisSessions.toArray(),
        db.tags.toArray()
      ]);

      return {
        solutions,
        flashcards,
        analyses,
        tags,
        exportedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }
};

// Clean shutdown (not needed for IndexedDB but kept for compatibility)
export const closeDatabase = () => {
  // IndexedDB closes automatically
  console.log('IndexedDB connection will close automatically');
};

// Export schema types for compatibility
export * from './schema';