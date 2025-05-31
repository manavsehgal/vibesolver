import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { SolutionLibrary } from '../SolutionLibrary';

// Mock the solution store with minimal setup
vi.mock('@/stores/solutions', () => ({
  useSolutionStore: () => ({
    solutions: [],
    libraryView: {
      mode: 'grid',
      filter: {},
      sort: { field: 'updatedAt', direction: 'desc' },
      selectedIds: [],
    },
    isLoading: false,
    loadSolutions: vi.fn(),
    setLibraryView: vi.fn(),
    setSelectedSolutions: vi.fn(),
    clearSelection: vi.fn(),
    bulkDelete: vi.fn(),
    toggleFavorite: vi.fn(),
  }),
}));

// Mock child components to prevent circular dependencies
vi.mock('../SolutionCard', () => ({
  SolutionCard: () => <div data-testid="solution-card">Mock Solution Card</div>,
}));

vi.mock('../SolutionFilters', () => ({
  SolutionFilters: () => <div data-testid="solution-filters">Mock Filters</div>,
}));

vi.mock('../ExportModal', () => ({
  ExportModal: () => <div data-testid="export-modal">Mock Export Modal</div>,
}));

describe('SolutionLibrary', () => {
  it('renders the solution library header', () => {
    render(<SolutionLibrary />);
    
    expect(screen.getByText('Solution Library')).toBeInTheDocument();
  });

  it('displays the search input', () => {
    render(<SolutionLibrary />);
    
    expect(screen.getByPlaceholderText('Search solutions...')).toBeInTheDocument();
  });

  it('shows grid and list view toggle', () => {
    render(<SolutionLibrary />);
    
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('displays new solution button', () => {
    render(<SolutionLibrary />);
    
    expect(screen.getByText('New Solution')).toBeInTheDocument();
  });

  it('shows empty state when no solutions exist', () => {
    render(<SolutionLibrary />);
    
    expect(screen.getByText('No solutions found')).toBeInTheDocument();
    expect(screen.getByText('Create Solution')).toBeInTheDocument();
  });
});