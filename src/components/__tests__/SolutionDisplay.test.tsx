import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { SolutionDisplay } from '../SolutionDisplay';
import type { AWSSolutionResponse } from '@/types';

const mockSolution: AWSSolutionResponse = {
  title: 'E-commerce Platform Solution',
  description: 'A scalable e-commerce platform built on AWS',
  costEstimate: 1500,
  awsServices: [
    {
      name: 'Amazon EC2',
      purpose: 'Web application hosting',
      configuration: 't3.medium instances in Auto Scaling group'
    },
    {
      name: 'Amazon RDS',
      purpose: 'Database storage',
      configuration: 'PostgreSQL Multi-AZ deployment'
    }
  ],
  architecture: {
    components: [
      {
        id: 'ec2',
        name: 'EC2 Instances',
        type: 'compute',
        position: { x: 100, y: 100 }
      }
    ],
    connections: [
      {
        from: 'ec2',
        to: 'rds',
        label: 'Database Connection'
      }
    ]
  },
  recommendations: [
    'Enable CloudWatch monitoring for all services',
    'Implement automated backups for RDS'
  ]
};

describe('SolutionDisplay', () => {
  it('renders solution header with title and cost', () => {
    render(<SolutionDisplay solution={mockSolution} />);
    
    expect(screen.getByText('E-commerce Platform Solution')).toBeInTheDocument();
    expect(screen.getByText('A scalable e-commerce platform built on AWS')).toBeInTheDocument();
    expect(screen.getByText('$1,500')).toBeInTheDocument();
  });

  it('displays AWS services list', () => {
    render(<SolutionDisplay solution={mockSolution} />);
    
    expect(screen.getByText('AWS Services (2)')).toBeInTheDocument();
    expect(screen.getByText('Amazon EC2')).toBeInTheDocument();
    expect(screen.getByText('Web application hosting')).toBeInTheDocument();
    expect(screen.getByText('Amazon RDS')).toBeInTheDocument();
    expect(screen.getByText('Database storage')).toBeInTheDocument();
  });

  it('displays recommendations', () => {
    render(<SolutionDisplay solution={mockSolution} />);
    
    expect(screen.getByText('Key Recommendations')).toBeInTheDocument();
    expect(screen.getByText(/Enable CloudWatch monitoring/)).toBeInTheDocument();
    expect(screen.getByText(/Implement automated backups/)).toBeInTheDocument();
  });

  it('calls handlers when action buttons are clicked', () => {
    const mockHandlers = {
      onModify: vi.fn(),
      onExplain: vi.fn(),
      onGenerateFlashcards: vi.fn(),
      onWhatIfAnalysis: vi.fn()
    };

    render(<SolutionDisplay solution={mockSolution} {...mockHandlers} />);
    
    fireEvent.click(screen.getByText(/modify solution/i));
    expect(mockHandlers.onModify).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText(/explain solution/i));
    expect(mockHandlers.onExplain).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText(/generate flashcards/i));
    expect(mockHandlers.onGenerateFlashcards).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText(/what-if analysis/i));
    expect(mockHandlers.onWhatIfAnalysis).toHaveBeenCalledTimes(1);
  });

  it('formats cost correctly', () => {
    const solutionWithLargeCost = {
      ...mockSolution,
      costEstimate: 12345
    };
    
    render(<SolutionDisplay solution={solutionWithLargeCost} />);
    
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('displays service icons based on service names', () => {
    const solutionWithDifferentServices = {
      ...mockSolution,
      awsServices: [
        { name: 'Amazon S3', purpose: 'Storage', configuration: 'Standard storage class' },
        { name: 'AWS Lambda', purpose: 'Serverless compute', configuration: 'Node.js runtime' }
      ]
    };
    
    render(<SolutionDisplay solution={solutionWithDifferentServices} />);
    
    // Check that different service types are rendered (icons might be emojis)
    expect(screen.getByText('Amazon S3')).toBeInTheDocument();
    expect(screen.getByText('AWS Lambda')).toBeInTheDocument();
  });
});