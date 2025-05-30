import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email Address" />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Invalid email format" />);
    
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass('border-red-300');
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toHaveClass('text-red-600');
  });

  it('displays helper text when no error', () => {
    render(<Input label="Email" helperText="We'll never share your email" />);
    
    expect(screen.getByText("We'll never share your email")).toBeInTheDocument();
    expect(screen.getByText("We'll never share your email")).toHaveClass('text-gray-500');
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input 
        label="Email" 
        error="Invalid email" 
        helperText="Helper text" 
      />
    );
    
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/name/i);
    fireEvent.change(input, { target: { value: 'John Doe' } });
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('John Doe');
  });

  it('forwards ref to input element', () => {
    const ref = vi.fn();
    render(<Input ref={ref} label="Test" />);
    
    expect(ref).toHaveBeenCalled();
  });
});