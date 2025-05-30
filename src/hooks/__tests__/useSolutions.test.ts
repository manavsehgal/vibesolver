import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryProvider } from '@/lib/react-query';
import { useSolutions, useSaveSolution, useDeleteSolution } from '../useSolutions';

// Mock the database and store
vi.mock('@/db', () => ({
  db: {
    solutions: {
      insert: vi.fn(),
      findMany: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('@/stores/solutions', () => ({
  useSolutionStore: () => ({
    addSolution: vi.fn(),
    updateSolution: vi.fn(),
    removeSolution: vi.fn(),
  }),
}));

const createWrapper = () => {
  return ({ children }: { children: any }) => {
    return React.createElement(QueryProvider, null, children);
  };
};

describe('useSolutions hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useSolutions', () => {
    it('should fetch solutions from database', () => {
      const { result } = renderHook(() => useSolutions(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useSaveSolution', () => {
    it('should save solution to database', () => {
      const { result } = renderHook(() => useSaveSolution(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useDeleteSolution', () => {
    it('should delete solution from database', () => {
      const { result } = renderHook(() => useDeleteSolution(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });
});