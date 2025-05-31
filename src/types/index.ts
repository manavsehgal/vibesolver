// Database types
import type { 
  solutions,
  flashcards,
  analysisSessions,
  projects,
  solutionProjects,
  exportHistory,
  tags,
} from '@/db/schema';

export type Solution = typeof solutions.$inferSelect;
export type Flashcard = typeof flashcards.$inferSelect;
export type AnalysisSession = typeof analysisSessions.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type SolutionProject = typeof solutionProjects.$inferSelect;
export type ExportHistory = typeof exportHistory.$inferSelect;
export type Tag = typeof tags.$inferSelect;

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

// Export Types
export type ExportFormat = 'pdf' | 'png' | 'svg' | 'json' | 'yaml' | 'markdown' | 'terraform' | 'cloudformation';

export interface ExportOptions {
  format: ExportFormat;
  includeArchitecture: boolean;
  includeDetails: boolean;
  includeRecommendations: boolean;
  includeCostAnalysis: boolean;
  quality?: 'low' | 'medium' | 'high';
  pageSize?: 'A4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  data?: Blob | string;
  error?: string;
}

// Solution Management Types
export interface SolutionFilter {
  search?: string;
  tags?: string[];
  projects?: string[];
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  costRange?: {
    min: number;
    max: number;
  };
  awsServices?: string[];
}

export interface SolutionSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'costEstimate' | 'lastAccessedAt';
  direction: 'asc' | 'desc';
}

export interface SolutionLibraryView {
  mode: 'grid' | 'list';
  filter: SolutionFilter;
  sort: SolutionSort;
  selectedIds: string[];
}

// Sharing Types
export interface ShareableLink {
  id: string;
  solutionId: string;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  isPublic: boolean;
  createdAt: Date;
}
