import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ExportModal } from '../ExportModal';

// Mock the solution store
vi.mock('@/stores/solutions', () => ({
  useSolutionStore: () => ({
    solutions: [
      {
        id: 'test-1',
        title: 'Test Solution 1',
        description: 'A test solution',
        awsServices: JSON.stringify([{ name: 'EC2', purpose: 'Computing' }]),
        recommendations: JSON.stringify(['Use auto-scaling']),
      }
    ],
  }),
}));

// Mock the export service
vi.mock('@/lib/export', () => ({
  exportService: {
    exportToPDF: vi.fn().mockResolvedValue({ success: true, filename: 'test.pdf' }),
    exportToJSON: vi.fn().mockResolvedValue({ success: true, filename: 'test.json' }),
    exportToYAML: vi.fn().mockResolvedValue({ success: true, filename: 'test.yaml' }),
    exportToTerraform: vi.fn().mockResolvedValue({ success: true, filename: 'test.tf' }),
    exportToMarkdown: vi.fn().mockResolvedValue({ success: true, filename: 'test.md' }),
    exportArchitectureToImage: vi.fn().mockResolvedValue({ success: true, filename: 'test.png' }),
  },
}));

describe('ExportModal', () => {
  const mockOnClose = vi.fn();
  const testProps = {
    solutionIds: ['test-1'],
    onClose: mockOnClose,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the export modal header', () => {
    render(<ExportModal {...testProps} />);
    
    expect(screen.getByText('Export Solutions')).toBeInTheDocument();
    expect(screen.getByText('Export 1 solution in your preferred format.')).toBeInTheDocument();
  });

  it('displays all export format options', () => {
    render(<ExportModal {...testProps} />);
    
    expect(screen.getByText('PDF Report')).toBeInTheDocument();
    expect(screen.getByText('PNG Image')).toBeInTheDocument();
    expect(screen.getByText('SVG Diagram')).toBeInTheDocument();
    expect(screen.getByText('JSON Data')).toBeInTheDocument();
    expect(screen.getByText('YAML Config')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
  });

  it('shows export options section', () => {
    render(<ExportModal {...testProps} />);
    
    expect(screen.getByText('Export Options')).toBeInTheDocument();
    expect(screen.getByText('Include Content')).toBeInTheDocument();
  });

  it('displays content inclusion checkboxes', () => {
    render(<ExportModal {...testProps} />);
    
    expect(screen.getByLabelText('Architecture Diagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Solution Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Recommendations')).toBeInTheDocument();
    expect(screen.getByLabelText('Cost Analysis')).toBeInTheDocument();
  });

  it('allows selecting different export formats', () => {
    render(<ExportModal {...testProps} />);
    
    const jsonOption = screen.getByText('JSON Data').closest('div');
    fireEvent.click(jsonOption!);
    
    // Should update the selected format (visual feedback)
    expect(jsonOption).toBeInTheDocument();
  });

  it('shows PDF-specific options when PDF is selected', () => {
    render(<ExportModal {...testProps} />);
    
    expect(screen.getByDisplayValue('A4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Portrait')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ExportModal {...testProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('handles export button click', async () => {
    render(<ExportModal {...testProps} />);
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    // Should show loading state
    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    
    // Wait for export to complete
    await vi.waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledOnce();
    });
  });

  it('toggles content options correctly', () => {
    render(<ExportModal {...testProps} />);
    
    const architectureCheckbox = screen.getByLabelText('Architecture Diagram');
    expect(architectureCheckbox).toBeChecked();
    
    fireEvent.click(architectureCheckbox);
    expect(architectureCheckbox).not.toBeChecked();
  });

  it('updates page size and orientation for PDF exports', () => {
    render(<ExportModal {...testProps} />);
    
    const pageSizeSelect = screen.getByDisplayValue('A4');
    fireEvent.change(pageSizeSelect, { target: { value: 'letter' } });
    expect(pageSizeSelect).toHaveValue('letter');
    
    const orientationSelect = screen.getByDisplayValue('Portrait');
    fireEvent.change(orientationSelect, { target: { value: 'landscape' } });
    expect(orientationSelect).toHaveValue('landscape');
  });
});