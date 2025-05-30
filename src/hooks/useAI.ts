import { useMutation } from '@tanstack/react-query';
import {
  generateAWSSolution,
  generateFlashcards,
  performWhatIfAnalysis,
  modifySolution,
  explainSolution,
} from '@/lib/ai';

export function useGenerateAWSSolution() {
  return useMutation({
    mutationFn: generateAWSSolution,
    onError: (error) => {
      console.error('Failed to generate AWS solution:', error);
    },
  });
}

export function useGenerateFlashcards() {
  return useMutation({
    mutationFn: ({
      solutionData,
      count,
    }: {
      solutionData: string;
      count?: number;
    }) => generateFlashcards(solutionData, count),
    onError: (error) => {
      console.error('Failed to generate flashcards:', error);
    },
  });
}

export function useWhatIfAnalysis() {
  return useMutation({
    mutationFn: ({
      solutionData,
      criteria,
    }: {
      solutionData: string;
      criteria: string[];
    }) => performWhatIfAnalysis(solutionData, criteria),
    onError: (error) => {
      console.error('Failed to perform what-if analysis:', error);
    },
  });
}

export function useModifySolution() {
  return useMutation({
    mutationFn: ({
      currentSolution,
      modificationRequest,
    }: {
      currentSolution: string;
      modificationRequest: string;
    }) => modifySolution(currentSolution, modificationRequest),
    onError: (error) => {
      console.error('Failed to modify solution:', error);
    },
  });
}

export function useExplainSolution() {
  return useMutation({
    mutationFn: explainSolution,
    onError: (error) => {
      console.error('Failed to explain solution:', error);
    },
  });
}
