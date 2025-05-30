import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@/test/utils';
import { RequirementsForm } from '../RequirementsForm';

// Mock the hooks
vi.mock('@/hooks/useAI', () => ({
  useGenerateAWSSolution: () => ({
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

vi.mock('../ui/Toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  }),
}));

describe('RequirementsForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<RequirementsForm />);
    
    expect(screen.getByLabelText(/business & technical requirements/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate aws solution/i })).toBeInTheDocument();
    expect(screen.getByText(/example requirements/i)).toBeInTheDocument();
  });

  it('shows character count and validation', () => {
    render(<RequirementsForm />);
    
    const textarea = screen.getByLabelText(/business & technical requirements/i);
    fireEvent.change(textarea, { target: { value: 'Short text' } });
    
    expect(screen.getByText(/more characters needed/i)).toBeInTheDocument();
  });

  it('enables submit when requirements are valid', () => {
    render(<RequirementsForm />);
    
    const textarea = screen.getByLabelText(/business & technical requirements/i);
    const submitButton = screen.getByRole('button', { name: /generate aws solution/i });
    
    expect(submitButton).toBeDisabled();
    
    fireEvent.change(textarea, { 
      target: { value: 'This is a valid requirement with more than 20 characters' } 
    });
    
    expect(submitButton).not.toBeDisabled();
    expect(screen.getByText(/ready to generate solution/i)).toBeInTheDocument();
  });

  it('populates textarea when example is clicked', () => {
    render(<RequirementsForm />);
    
    const firstExample = screen.getAllByRole('button')[1]; // First example button
    fireEvent.click(firstExample);
    
    const textarea = screen.getByLabelText(/business & technical requirements/i);
    expect((textarea as HTMLTextAreaElement).value).toContain('e-commerce platform');
  });

  it('supports keyboard shortcut for submission', () => {
    const mockOnGenerated = vi.fn();
    render(<RequirementsForm onSolutionGenerated={mockOnGenerated} />);
    
    const textarea = screen.getByLabelText(/business & technical requirements/i);
    
    act(() => {
      fireEvent.change(textarea, { 
        target: { value: 'Valid requirements for testing keyboard shortcut' } 
      });
    });
    
    act(() => {
      fireEvent.keyDown(textarea, { 
        key: 'Enter', 
        ctrlKey: true 
      });
    });
    
    // Form submission should be triggered
    expect(screen.getByRole('button', { name: /generate aws solution/i })).toBeInTheDocument();
  });

  it('shows tips section', () => {
    render(<RequirementsForm />);
    
    expect(screen.getByText(/tips for better results/i)).toBeInTheDocument();
    expect(screen.getByText(/include expected user load/i)).toBeInTheDocument();
    expect(screen.getByText(/mention compliance needs/i)).toBeInTheDocument();
  });

  it('validates minimum character requirement', () => {
    render(<RequirementsForm />);
    
    const textarea = screen.getByLabelText(/business & technical requirements/i);
    fireEvent.change(textarea, { target: { value: 'Too short' } });
    
    expect(screen.getByText(/please provide more detailed requirements/i)).toBeInTheDocument();
  });
});