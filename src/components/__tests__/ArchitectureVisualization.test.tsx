import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { ArchitectureVisualization } from '../ArchitectureVisualization';
import type { Architecture } from '@/types';

const mockArchitecture: Architecture = {
  components: [
    {
      id: 'ec2-1',
      name: 'Web Server',
      type: 'compute',
      position: { x: 100, y: 100 }
    },
    {
      id: 'rds-1',
      name: 'Database',
      type: 'database',
      position: { x: 300, y: 200 }
    }
  ],
  connections: [
    {
      from: 'ec2-1',
      to: 'rds-1',
      label: 'Connection'
    }
  ]
};

describe('ArchitectureVisualization', () => {
  it('renders architecture diagram with title', () => {
    render(<ArchitectureVisualization architecture={mockArchitecture} />);
    
    expect(screen.getByText('Architecture Diagram')).toBeInTheDocument();
  });

  it('renders zoom controls', () => {
    render(<ArchitectureVisualization architecture={mockArchitecture} />);
    
    expect(screen.getByText('−')).toBeInTheDocument(); // Zoom out
    expect(screen.getByText('+')).toBeInTheDocument(); // Zoom in
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument(); // Initial zoom level
  });

  it('renders architecture components', () => {
    render(<ArchitectureVisualization architecture={mockArchitecture} />);
    
    expect(screen.getByText('Web Server')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
  });

  it('handles zoom in and out', () => {
    render(<ArchitectureVisualization architecture={mockArchitecture} />);
    
    const zoomInButton = screen.getByText('+');
    const zoomOutButton = screen.getByText('−');
    const resetButton = screen.getByText('Reset');
    
    fireEvent.click(zoomInButton);
    expect(screen.getByText('120%')).toBeInTheDocument();
    
    fireEvent.click(zoomOutButton);
    expect(screen.getByText('100%')).toBeInTheDocument();
    
    fireEvent.click(zoomInButton);
    fireEvent.click(resetButton);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles mouse wheel zoom', () => {
    render(<ArchitectureVisualization architecture={mockArchitecture} />);
    
    const canvas = screen.getByText('Web Server').closest('.relative');
    expect(canvas).toBeInTheDocument();
    
    if (canvas) {
      fireEvent.wheel(canvas, { deltaY: -100 });
      // Should zoom in on wheel up
      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    }
  });

  it('handles empty architecture gracefully', () => {
    const emptyArchitecture: Architecture = {
      components: [],
      connections: []
    };
    
    render(<ArchitectureVisualization architecture={emptyArchitecture} />);
    
    expect(screen.getByText('Architecture Diagram')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ArchitectureVisualization 
        architecture={mockArchitecture} 
        className="custom-class"
      />
    );
    
    const card = screen.getByText('Architecture Diagram').closest('.bg-white');
    expect(card).toHaveClass('custom-class');
  });
});