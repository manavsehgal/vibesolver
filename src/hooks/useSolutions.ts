import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSolutionStore } from '@/stores/solutions';
import type { AWSSolutionResponse } from '@/types';

// Browser-compatible mock database
const mockDb = {
  solutions: [] as Array<{
    id: string;
    title: string;
    description: string;
    requirements: string;
    awsServices: string;
    architecture: string;
    costEstimate: number;
    createdAt: Date;
    updatedAt: Date;
  }>
};

export function useSolutions() {
  return useQuery({
    queryKey: ['solutions'],
    queryFn: async () => {
      return mockDb.solutions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },
  });
}

export function useSaveSolution() {
  const queryClient = useQueryClient();
  const { addSolution } = useSolutionStore();
  
  return useMutation({
    mutationFn: async (data: { 
      solution: AWSSolutionResponse; 
      requirements: string 
    }) => {
      const { solution, requirements } = data;
      const id = Math.random().toString(36).substr(2, 9);
      const now = new Date();
      
      const solutionRecord = {
        id,
        title: solution.title,
        description: solution.description,
        awsServices: JSON.stringify(solution.awsServices),
        architecture: JSON.stringify(solution.architecture),
        requirements,
        costEstimate: solution.costEstimate,
        recommendations: JSON.stringify(solution.recommendations),
        tags: JSON.stringify([]),
        status: 'draft' as const,
        version: 1,
        parentId: null,
        isTemplate: false,
        isFavorite: false,
        lastAccessedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      
      mockDb.solutions.push(solutionRecord);
      
      // Update Zustand store
      addSolution(solutionRecord);
      
      return solutionRecord;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
    },
  });
}

export function useUpdateSolution() {
  const queryClient = useQueryClient();
  const { updateSolution } = useSolutionStore();
  
  return useMutation({
    mutationFn: async (data: { 
      id: string; 
      updates: Partial<{
        title: string;
        description: string;
        requirements: string;
        awsServices: string;
        architecture: string;
        costEstimate: number;
      }>
    }) => {
      const { id, updates } = data;
      const updatedData = {
        ...updates,
        updatedAt: new Date(),
      };
      
      const solution = mockDb.solutions.find(s => s.id === id);
      if (solution) {
        Object.assign(solution, updatedData);
      }
      
      // Update Zustand store
      updateSolution(id, updatedData);
      
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
    },
  });
}

export function useDeleteSolution() {
  const queryClient = useQueryClient();
  const { removeSolution } = useSolutionStore();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const index = mockDb.solutions.findIndex(s => s.id === id);
      if (index !== -1) {
        mockDb.solutions.splice(index, 1);
      }
      
      // Update Zustand store
      removeSolution(id);
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solutions'] });
    },
  });
}

export function useSolution(id: string) {
  return useQuery({
    queryKey: ['solution', id],
    queryFn: async () => {
      return mockDb.solutions.find(s => s.id === id) || null;
    },
    enabled: !!id,
  });
}