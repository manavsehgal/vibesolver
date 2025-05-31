// Browser-compatible mock for database operations
import type { solutions, flashcards, analysisSessions, tags } from './schema';

type Solution = typeof solutions.$inferSelect;
type SolutionInsert = typeof solutions.$inferInsert;
type Flashcard = typeof flashcards.$inferSelect;
type FlashcardInsert = typeof flashcards.$inferInsert;
type AnalysisInsert = typeof analysisSessions.$inferInsert;
type TagInsert = typeof tags.$inferInsert;

// In-memory storage for browser evaluation
const mockSolutions: Solution[] = [];
const mockFlashcards: Flashcard[] = [];
const mockAnalysis: any[] = [];
const mockTags: any[] = [];

// Solution CRUD operations matching the real database interface
export const solutionOperations = {
  async create(solutionData: SolutionInsert): Promise<Solution> {
    const solution: Solution = {
      ...solutionData,
      id: solutionData.id || crypto.randomUUID(),
      architecture: solutionData.architecture || null,
      costEstimate: solutionData.costEstimate || null,
      recommendations: solutionData.recommendations || null,
      status: solutionData.status || 'draft',
      version: solutionData.version || 1,
      parentId: solutionData.parentId || null,
      isTemplate: solutionData.isTemplate || false,
      tags: solutionData.tags || null,
      isFavorite: solutionData.isFavorite || false,
      lastAccessedAt: solutionData.lastAccessedAt || null,
      createdAt: solutionData.createdAt || new Date(),
      updatedAt: solutionData.updatedAt || new Date(),
    };
    mockSolutions.push(solution);
    console.log('Mock DB: Solution saved', solution.title);
    return solution;
  },

  async getAll(): Promise<Solution[]> {
    console.log('Mock DB: Fetching solutions', mockSolutions.length);
    return [...mockSolutions].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  },

  async getById(id: string): Promise<Solution | null> {
    const solution = mockSolutions.find(s => s.id === id);
    console.log('Mock DB: Finding solution', id, !!solution);
    return solution || null;
  },

  async update(id: string, updates: Partial<SolutionInsert>): Promise<Solution> {
    const index = mockSolutions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Solution not found');
    
    const updatedSolution = {
      ...mockSolutions[index],
      ...updates,
      updatedAt: new Date(),
    };
    mockSolutions[index] = updatedSolution;
    console.log('Mock DB: Solution updated', updatedSolution.title);
    return updatedSolution;
  },

  async delete(id: string): Promise<boolean> {
    const index = mockSolutions.findIndex(s => s.id === id);
    if (index !== -1) {
      const deleted = mockSolutions.splice(index, 1)[0];
      console.log('Mock DB: Solution deleted', deleted.title);
      return true;
    }
    return false;
  },

  async bulkDelete(ids: string[]): Promise<boolean> {
    ids.forEach(id => {
      const index = mockSolutions.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSolutions.splice(index, 1);
      }
    });
    console.log('Mock DB: Bulk deleted', ids.length, 'solutions');
    return true;
  },

  async search(query: string): Promise<Solution[]> {
    const searchTerm = query.toLowerCase();
    return mockSolutions.filter(s => 
      s.title.toLowerCase().includes(searchTerm) ||
      s.description.toLowerCase().includes(searchTerm) ||
      (s.tags && s.tags.toLowerCase().includes(searchTerm))
    );
  },

  async updateLastAccessed(id: string): Promise<void> {
    const solution = mockSolutions.find(s => s.id === id);
    if (solution) {
      solution.lastAccessedAt = new Date();
    }
  },

  async toggleFavorite(id: string): Promise<Solution> {
    const solution = mockSolutions.find(s => s.id === id);
    if (!solution) throw new Error('Solution not found');
    
    solution.isFavorite = !solution.isFavorite;
    solution.updatedAt = new Date();
    console.log('Mock DB: Toggled favorite for', solution.title);
    return solution;
  }
};

// Flashcard operations
export const flashcardOperations = {
  async create(flashcardData: FlashcardInsert) {
    const flashcard: Flashcard = {
      ...flashcardData,
      id: flashcardData.id || crypto.randomUUID(),
      solutionId: flashcardData.solutionId || null,
      createdAt: new Date(),
    };
    mockFlashcards.push(flashcard);
    return flashcard;
  },

  async getBySolutionId(solutionId: string) {
    return mockFlashcards.filter(f => f.solutionId === solutionId);
  },

  async delete(id: string) {
    const index = mockFlashcards.findIndex(f => f.id === id);
    if (index !== -1) {
      mockFlashcards.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Analysis session operations
export const analysisOperations = {
  async create(analysisData: AnalysisInsert) {
    const analysis = {
      ...analysisData,
      id: analysisData.id || crypto.randomUUID(),
      createdAt: new Date(),
    };
    mockAnalysis.push(analysis);
    return analysis;
  },

  async getBySolutionId(solutionId: string) {
    return mockAnalysis.filter(a => a.solutionId === solutionId);
  }
};

// Tag operations
export const tagOperations = {
  async create(tagData: TagInsert) {
    const tag = {
      ...tagData,
      id: tagData.id || crypto.randomUUID(),
      createdAt: new Date(),
    };
    mockTags.push(tag);
    return tag;
  },

  async getAll() {
    return mockTags.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
  },

  async incrementUsage(name: string) {
    const existingTag = mockTags.find(t => t.name === name);
    if (existingTag) {
      existingTag.usageCount = (existingTag.usageCount || 0) + 1;
    } else {
      await this.create({
        id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        usageCount: 1,
        createdAt: new Date(),
      });
    }
  }
};

// Database health check
export const dbHealth = {
  async check() {
    return { status: 'healthy', timestamp: new Date() };
  },

  async getStats() {
    return {
      solutions: mockSolutions.length,
      flashcards: mockFlashcards.length,
      analyses: mockAnalysis.length,
      timestamp: new Date()
    };
  }
};

// Clean shutdown (no-op for browser)
export const closeDatabase = () => {
  console.log('Mock DB: Clean shutdown');
};

// Mock database operations interface
export const mockDb = {
  solutions: {
    insert: solutionOperations.create,
    findMany: solutionOperations.getAll,
    findFirst: (where: { id: string }) => solutionOperations.getById(where.id),
    delete: (where: { id: string }) => {
      const solution = mockSolutions.find(s => s.id === where.id);
      if (solution) {
        solutionOperations.delete(where.id);
        return solution;
      }
      return null;
    },
    update: (where: { id: string }, data: Partial<SolutionInsert>) => solutionOperations.update(where.id, data)
  },
  flashcards: flashcardOperations,
  analysis: analysisOperations,
  tags: tagOperations,
};

// Legacy export for backward compatibility
export const db = {
  solutions: mockSolutions,
  flashcards: mockFlashcards,
  analysis: mockAnalysis,
  tags: mockTags,
};

// Export schema types for compatibility
export * from './schema';