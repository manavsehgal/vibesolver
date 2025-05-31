import { useMutation } from '@tanstack/react-query';

// Check if we're in production mode (using local server on port 3000)
const isProduction = window.location.port === '3000';
const hasApiKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY;

async function getAIService() {
  // In production mode, always use real AI service (with proxy)
  // In development mode, only use real AI if we have an API key
  if (isProduction || hasApiKey) {
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
      try {
        const aiService = await getAIService();
        return await aiService.generateAWSSolution(requirements);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock:', error);
        const mockService = await import('@/lib/ai-mock');
        return mockService.generateAWSSolution(requirements);
      }
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
      try {
        const aiService = await getAIService();
        return await aiService.generateFlashcards(solutionData, count);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock:', error);
        const mockService = await import('@/lib/ai-mock');
        return mockService.generateFlashcards(solutionData, count);
      }
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
      try {
        const aiService = await getAIService();
        return await aiService.performWhatIfAnalysis(solutionData, criteria);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock:', error);
        const mockService = await import('@/lib/ai-mock');
        return mockService.performWhatIfAnalysis(solutionData, criteria);
      }
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
      try {
        const aiService = await getAIService();
        return await aiService.modifySolution(currentSolution, modificationRequest);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock:', error);
        const mockService = await import('@/lib/ai-mock');
        return mockService.modifySolution(currentSolution, modificationRequest);
      }
    },
    onError: (error) => {
      console.error('Failed to modify solution:', error);
    },
  });
}

export function useExplainSolution() {
  return useMutation({
    mutationFn: async (solutionData: string) => {
      try {
        const aiService = await getAIService();
        return await aiService.explainSolution(solutionData);
      } catch (error) {
        console.warn('Real AI service failed, falling back to mock:', error);
        const mockService = await import('@/lib/ai-mock');
        return mockService.explainSolution(solutionData);
      }
    },
    onError: (error) => {
      console.error('Failed to explain solution:', error);
    },
  });
}
