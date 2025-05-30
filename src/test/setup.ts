import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Zustand stores
vi.mock('@/stores/solutions', () => ({
  useSolutionStore: vi.fn(),
}));

// Mock AI functions
vi.mock('@/lib/ai', () => ({
  generateAWSSolution: vi.fn(),
  generateFlashcards: vi.fn(),
  performWhatIfAnalysis: vi.fn(),
  modifySolution: vi.fn(),
  explainSolution: vi.fn(),
}));

// Mock database
vi.mock('@/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));
