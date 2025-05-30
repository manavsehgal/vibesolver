import { useEffect, useState } from 'react';
import { useToastStore, type Toast } from '@/hooks/useToast';


interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(toast.id), 150);
  };
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };
  
  const iconStyles = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        flex items-center p-4 mb-3 border rounded-lg shadow-sm
        ${typeStyles[toast.type]}
      `}
    >
      <span className="mr-3 text-lg">
        {iconStyles[toast.type]}
      </span>
      <p className="flex-1 text-sm font-medium">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="ml-3 text-lg leading-none hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={removeToast}
        />
      ))}
    </div>
  );
}