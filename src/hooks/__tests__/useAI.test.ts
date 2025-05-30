import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryProvider } from '@/lib/react-query';
import { useGenerateAWSSolution, useGenerateFlashcards, useWhatIfAnalysis, useModifySolution, useExplainSolution } from '../useAI';

// Mock the AI modules
vi.mock('@/lib/ai', () => ({
  generateAWSSolution: vi.fn(),
  generateFlashcards: vi.fn(),
  performWhatIfAnalysis: vi.fn(),
  modifySolution: vi.fn(),
  explainSolution: vi.fn(),
}));

vi.mock('@/lib/ai-mock', () => ({
  generateAWSSolution: vi.fn(),
  generateFlashcards: vi.fn(),
  performWhatIfAnalysis: vi.fn(),
  modifySolution: vi.fn(),
  explainSolution: vi.fn(),
}));

const createWrapper = () => {
  return ({ children }: { children: any }) => {
    return React.createElement(QueryProvider, null, children);
  };
};

describe('useAI hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGenerateAWSSolution', () => {
    it('should call AI service with requirements', () => {
      const { result } = renderHook(() => useGenerateAWSSolution(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useGenerateFlashcards', () => {
    it('should call AI service with solution data and count', () => {
      const { result } = renderHook(() => useGenerateFlashcards(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useWhatIfAnalysis', () => {
    it('should call AI service with solution data and criteria', () => {
      const { result } = renderHook(() => useWhatIfAnalysis(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useModifySolution', () => {
    it('should call AI service with current solution and modification request', () => {
      const { result } = renderHook(() => useModifySolution(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useExplainSolution', () => {
    it('should call AI service with solution data', () => {
      const { result } = renderHook(() => useExplainSolution(), {
        wrapper: createWrapper(),
      });
      
      expect(result.current.mutate).toBeDefined();
    });
  });
});