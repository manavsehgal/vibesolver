import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { VibeSolver } from '../VibeSolver';

// Mock the hooks
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

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
  useToastStore: () => ({
    toasts: [],
    addToast: vi.fn(),
    removeToast: vi.fn(),
    clearToasts: vi.fn(),
  }),
}));

vi.mock('@/stores/solutions', () => ({
  useSolutionStore: () => ({
    addSolution: vi.fn(),
    solutions: [],
    currentSolution: null,
    setCurrentSolution: vi.fn(),
  }),
}));

// Mock ToastContainer component
vi.mock('../ui/Toast', () => ({
  ToastContainer: () => null,
}));

describe('VibeSolver', () => {
  it('renders initial state with form', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText('Transform Your Ideas into AWS Solutions')).toBeInTheDocument();
    expect(screen.getByLabelText(/business & technical requirements/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate aws solution/i })).toBeInTheDocument();
  });

  it('renders header with branding', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText('VibeSolver')).toBeInTheDocument();
    expect(screen.getByText('AI AWS Solutions Architect')).toBeInTheDocument();
  });

  it('shows navigation items', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('displays example requirements', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText(/example requirements/i)).toBeInTheDocument();
    expect(screen.getByText(/scalable e-commerce platform/i)).toBeInTheDocument();
  });

  it('shows tips for better results', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText(/tips for better results/i)).toBeInTheDocument();
    expect(screen.getByText(/include expected user load/i)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<VibeSolver />);
    
    expect(screen.getByText(/comprehensive aws architecture/i)).toBeInTheDocument();
    expect(screen.getByText('Transform Your Ideas into AWS Solutions')).toBeInTheDocument();
  });
});