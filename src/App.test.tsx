import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import App from './App';

describe('App', () => {
  it('renders VibeSolver heading', () => {
    render(<App />);
    expect(screen.getByText('VibeSolver')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<App />);
    expect(screen.getByText('AI AWS Solutions Architect')).toBeInTheDocument();
  });

  it('renders counter button', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /count is 0/i })
    ).toBeInTheDocument();
  });
});
