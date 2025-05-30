import { forwardRef } from 'react';
import { type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className = '', 
    label, 
    error, 
    helperText, 
    showCharCount = false,
    maxLength,
    value,
    id, 
    ...props 
  }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;
    
    const baseStyles = 'block w-full px-3 py-2 border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical';
    const errorStyles = error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 placeholder-gray-400';
    
    return (
      <div className="space-y-1">
        {label && (
          <div className="flex items-center justify-between">
            <label 
              htmlFor={textareaId} 
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            {showCharCount && maxLength && (
              <span className={`text-xs ${charCount > maxLength ? 'text-red-500' : 'text-gray-400'}`}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';