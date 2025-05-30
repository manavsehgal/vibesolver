// Re-export database types
export type {
  solutions as Solution,
  flashcards as Flashcard,
  analysisSessions as AnalysisSession,
} from '@/db/schema';

// AI Response Types
export interface AWSService {
  name: string;
  purpose: string;
  configuration: string;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
}

export interface ArchitectureConnection {
  from: string;
  to: string;
  label: string;
}

export interface Architecture {
  components: ArchitectureComponent[];
  connections: ArchitectureConnection[];
}

export interface AWSSolutionResponse {
  title: string;
  description: string;
  awsServices: AWSService[];
  architecture: Architecture;
  costEstimate: number;
  recommendations: string[];
}

export interface FlashcardResponse {
  front: string;
  back: string;
  category: string;
}

export interface AnalysisResult {
  criterion: string;
  impact: string;
  recommendation: string;
  confidence: number;
}

export interface WhatIfAnalysisResponse {
  criteria: string[];
  results: AnalysisResult[];
  summary: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
