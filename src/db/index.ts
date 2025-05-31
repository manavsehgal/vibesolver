import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, desc, asc, like, or, inArray } from 'drizzle-orm';
import * as schema from './schema';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

// Initialize database connection
let db: ReturnType<typeof drizzle>;
let sqlite: Database.Database;

try {
  sqlite = new Database('./src/db/sqlite.db');
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  db = drizzle(sqlite, { schema });
  
  // Run migrations
  migrate(db, { migrationsFolder: './drizzle' });
} catch (error) {
  console.error('Database initialization failed:', error);
  throw new Error('Failed to initialize database');
}

// Solution CRUD operations
export const solutionOperations = {
  async create(solutionData: typeof schema.solutions.$inferInsert) {
    try {
      const result = await db.insert(schema.solutions).values({
        ...solutionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create solution:', error);
      throw new Error('Failed to save solution');
    }
  },

  async getAll() {
    try {
      return await db.select().from(schema.solutions).orderBy(desc(schema.solutions.updatedAt));
    } catch (error) {
      console.error('Failed to load solutions:', error);
      throw new Error('Failed to load solutions');
    }
  },

  async getById(id: string) {
    try {
      const result = await db.select().from(schema.solutions).where(eq(schema.solutions.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Failed to load solution:', error);
      throw new Error('Failed to load solution');
    }
  },

  async update(id: string, updates: Partial<typeof schema.solutions.$inferInsert>) {
    try {
      const result = await db.update(schema.solutions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(schema.solutions.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Failed to update solution:', error);
      throw new Error('Failed to update solution');
    }
  },

  async delete(id: string) {
    try {
      await db.delete(schema.solutions).where(eq(schema.solutions.id, id));
      return true;
    } catch (error) {
      console.error('Failed to delete solution:', error);
      throw new Error('Failed to delete solution');
    }
  },

  async bulkDelete(ids: string[]) {
    try {
      await db.delete(schema.solutions).where(inArray(schema.solutions.id, ids));
      return true;
    } catch (error) {
      console.error('Failed to bulk delete solutions:', error);
      throw new Error('Failed to delete solutions');
    }
  },

  async search(query: string) {
    try {
      return await db.select().from(schema.solutions)
        .where(
          or(
            like(schema.solutions.title, `%${query}%`),
            like(schema.solutions.description, `%${query}%`),
            like(schema.solutions.tags, `%${query}%`)
          )
        )
        .orderBy(desc(schema.solutions.updatedAt));
    } catch (error) {
      console.error('Failed to search solutions:', error);
      throw new Error('Failed to search solutions');
    }
  },

  async updateLastAccessed(id: string) {
    try {
      await db.update(schema.solutions)
        .set({ lastAccessedAt: new Date() })
        .where(eq(schema.solutions.id, id));
    } catch (error) {
      console.error('Failed to update last accessed:', error);
    }
  },

  async toggleFavorite(id: string) {
    try {
      const solution = await this.getById(id);
      if (!solution) throw new Error('Solution not found');
      
      const result = await db.update(schema.solutions)
        .set({ isFavorite: !solution.isFavorite, updatedAt: new Date() })
        .where(eq(schema.solutions.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  }
};

// Flashcard operations
export const flashcardOperations = {
  async create(flashcardData: typeof schema.flashcards.$inferInsert) {
    try {
      const result = await db.insert(schema.flashcards).values({
        ...flashcardData,
        createdAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create flashcard:', error);
      throw new Error('Failed to save flashcard');
    }
  },

  async getBySolutionId(solutionId: string) {
    try {
      return await db.select().from(schema.flashcards)
        .where(eq(schema.flashcards.solutionId, solutionId))
        .orderBy(asc(schema.flashcards.createdAt));
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      throw new Error('Failed to load flashcards');
    }
  },

  async delete(id: string) {
    try {
      await db.delete(schema.flashcards).where(eq(schema.flashcards.id, id));
      return true;
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      throw new Error('Failed to delete flashcard');
    }
  }
};

// Analysis session operations
export const analysisOperations = {
  async create(analysisData: typeof schema.analysisSessions.$inferInsert) {
    try {
      const result = await db.insert(schema.analysisSessions).values({
        ...analysisData,
        createdAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create analysis session:', error);
      throw new Error('Failed to save analysis');
    }
  },

  async getBySolutionId(solutionId: string) {
    try {
      return await db.select().from(schema.analysisSessions)
        .where(eq(schema.analysisSessions.solutionId, solutionId))
        .orderBy(desc(schema.analysisSessions.createdAt));
    } catch (error) {
      console.error('Failed to load analysis sessions:', error);
      throw new Error('Failed to load analysis sessions');
    }
  }
};

// Tag operations
export const tagOperations = {
  async create(tagData: typeof schema.tags.$inferInsert) {
    try {
      const result = await db.insert(schema.tags).values({
        ...tagData,
        createdAt: new Date(),
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create tag:', error);
      throw new Error('Failed to create tag');
    }
  },

  async getAll() {
    try {
      return await db.select().from(schema.tags).orderBy(desc(schema.tags.usageCount));
    } catch (error) {
      console.error('Failed to load tags:', error);
      throw new Error('Failed to load tags');
    }
  },

  async incrementUsage(name: string) {
    try {
      const existingTag = await db.select().from(schema.tags)
        .where(eq(schema.tags.name, name))
        .limit(1);
      
      if (existingTag.length > 0) {
        await db.update(schema.tags)
          .set({ usageCount: (existingTag[0].usageCount || 0) + 1 })
          .where(eq(schema.tags.id, existingTag[0].id));
      } else {
        await this.create({
          id: `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          usageCount: 1,
          createdAt: new Date(),
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
      await db.select().from(schema.solutions).limit(1);
      return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
      return { status: 'error', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date() };
    }
  },

  async getStats() {
    try {
      const solutionCount = await db.select().from(schema.solutions);
      const flashcardCount = await db.select().from(schema.flashcards);
      const analysisCount = await db.select().from(schema.analysisSessions);
      
      return {
        solutions: solutionCount.length,
        flashcards: flashcardCount.length,
        analyses: analysisCount.length,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to get database stats:', error);
      return null;
    }
  }
};

// Clean shutdown
export const closeDatabase = () => {
  if (sqlite) {
    sqlite.close();
  }
};

export { db };
export * from './schema';
