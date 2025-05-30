import { useMutation } from '@tanstack/react-query';

// Use mock AI service for evaluation when no API key is available
const hasApiKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY;

async function getAIService() {
  if (hasApiKey) {
    try {
      return await import('@/lib/ai');
    } catch (error) {
      console.warn('Failed to load real AI service, falling back to mock:', error);
      return await import('@/lib/ai-mock');
    }
  } else {
    console.log('🤖 Using mock AI service for evaluation (no API key configured)');
    return await import('@/lib/ai-mock');
  }
}

export function useGenerateAWSSolution() {
  return useMutation({
    mutationFn: async (requirements: string) => {
      const aiService = await getAIService();
      return aiService.generateAWSSolution(requirements);
    },
    onError: (error) => {
      console.error('Failed to generate AWS solution:', error);
    },
  });
}

export function useGenerateFlashcards() {
  return useMutation({
    mutationFn: async ({
      solutionData,
      count,
    }: {
      solutionData: string;
      count?: number;
    }) => {
      const aiService = await getAIService();
      return aiService.generateFlashcards(solutionData, count);
    },
    onError: (error) => {
      console.error('Failed to generate flashcards:', error);
    },
  });
}

export function useWhatIfAnalysis() {
  return useMutation({
    mutationFn: async ({
      solutionData,
      criteria,
    }: {
      solutionData: string;
      criteria: string[];
    }) => {
      const aiService = await getAIService();
      return aiService.performWhatIfAnalysis(solutionData, criteria);
    },
    onError: (error) => {
      console.error('Failed to perform what-if analysis:', error);
    },
  });
}

export function useModifySolution() {
  return useMutation({
    mutationFn: async ({
      currentSolution,
      modificationRequest,
    }: {
      currentSolution: string;
      modificationRequest: string;
    }) => {
      const aiService = await getAIService();
      return aiService.modifySolution(currentSolution, modificationRequest);
    },
    onError: (error) => {
      console.error('Failed to modify solution:', error);
    },
  });
}

export function useExplainSolution() {
  return useMutation({
    mutationFn: async (solutionData: string) => {
      const aiService = await getAIService();
      return aiService.explainSolution(solutionData);
    },
    onError: (error) => {
      console.error('Failed to explain solution:', error);
    },
  });
}
