import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children', () => {
      render(
        <Card>
          <div>Card content</div>
        </Card>
      );
      
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies different padding sizes', () => {
      const { rerender } = render(
        <Card padding="none">
          <div data-testid="content">Content</div>
        </Card>
      );
      expect(screen.getByTestId('content').parentElement).not.toHaveClass('p-6');

      rerender(
        <Card padding="lg">
          <div data-testid="content">Content</div>
        </Card>
      );
      expect(screen.getByTestId('content').parentElement).toHaveClass('p-8');
    });

    it('applies hover styles when hover prop is true', () => {
      render(
        <Card hover>
          <div data-testid="content">Content</div>
        </Card>
      );
      
      expect(screen.getByTestId('content').parentElement).toHaveClass('hover:shadow-md');
    });
  });

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(
        <CardHeader>
          <h2>Header Title</h2>
        </CardHeader>
      );
      
      expect(screen.getByText('Header Title')).toBeInTheDocument();
    });
  });

  describe('CardTitle', () => {
    it('renders title with correct styling', () => {
      render(<CardTitle>My Title</CardTitle>);
      
      const title = screen.getByText('My Title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });
  });

  describe('CardContent', () => {
    it('renders content with correct styling', () => {
      render(<CardContent>Card body content</CardContent>);
      
      const content = screen.getByText('Card body content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('text-gray-600');
    });
  });

  describe('CardFooter', () => {
    it('renders footer with border', () => {
      render(
        <CardFooter>
          Footer content
        </CardFooter>
      );
      
      const footer = screen.getByText('Footer content');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass('border-t', 'border-gray-100');
    });
  });

  describe('Complete Card', () => {
    it('renders all card components together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            This is the card content
          </CardContent>
          <CardFooter>
            Footer actions
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByText('Test Card')).toBeInTheDocument();
      expect(screen.getByText('This is the card content')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });
  });
});