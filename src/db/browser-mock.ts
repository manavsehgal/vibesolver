// Browser-compatible mock for database operations
import type { AWSSolutionResponse } from '@/types';

// In-memory storage for browser evaluation
const mockSolutions: Array<{
  id: string;
  title: string;
  description: string;
  requirements: string;
  solutionData: AWSSolutionResponse;
  createdAt: Date;
}> = [];

export const mockDb = {
  solutions: {
    insert: async (data: {
      title: string;
      description: string;
      requirements: string;
      solutionData: AWSSolutionResponse;
    }) => {
      const solution = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date(),
      };
      mockSolutions.push(solution);
      console.log('Mock DB: Solution saved', solution.title);
      return solution;
    },
    
    findMany: async () => {
      console.log('Mock DB: Fetching solutions', mockSolutions.length);
      return mockSolutions;
    },
    
    findFirst: async (where: { id: string }) => {
      const solution = mockSolutions.find(s => s.id === where.id);
      console.log('Mock DB: Finding solution', where.id, !!solution);
      return solution || null;
    },
    
    delete: async (where: { id: string }) => {
      const index = mockSolutions.findIndex(s => s.id === where.id);
      if (index !== -1) {
        const deleted = mockSolutions.splice(index, 1)[0];
        console.log('Mock DB: Solution deleted', deleted.title);
        return deleted;
      }
      return null;
    }
  }
};

// Export schema types for compatibility
export * from './schema';