import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import App from './App';

// Mock the hooks that cause issues in tests
vi.mock('@/hooks/useAI', () => ({
  useGenerateAWSSolution: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useGenerateFlashcards: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useWhatIfAnalysis: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useModifySolution: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useExplainSolution: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/hooks/useSolutions', () => ({
  useSaveSolution: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('./components/ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
  ToastContainer: () => null,
}));

describe('App', () => {
  it('renders VibeSolver heading', () => {
    render(<App />);
    expect(screen.getByText('VibeSolver')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<App />);
    expect(screen.getByText('AI AWS Solutions Architect')).toBeInTheDocument();
  });

  it('renders main description', () => {
    render(<App />);
    expect(screen.getByText(/Transform Your Ideas into AWS Solutions/i)).toBeInTheDocument();
  });
});
