import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id)
  })),
  
  clearToasts: () => set({ toasts: [] })
}));

export function useToast() {
  const { addToast } = useToastStore();
  
  return {
    showToast: (toast: { type: 'success' | 'error' | 'info' | 'warning'; title?: string; message: string; duration?: number }) => 
      addToast(toast),
    success: (message: string, duration?: number) => 
      addToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      addToast({ message, type: 'error', duration }),
    info: (message: string, duration?: number) => 
      addToast({ message, type: 'info', duration }),
    warning: (message: string, duration?: number) => 
      addToast({ message, type: 'warning', duration })
  };
}