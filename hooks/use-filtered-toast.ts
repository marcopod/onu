'use client';

import { toast as originalToast } from 'sonner';

// Custom toast hook that filters out error messages in development
export const useFilteredToast = () => {
  const toast = {
    success: (message: string, options?: any) => {
      return originalToast.success(message, options);
    },
    
    error: (message: string, options?: any) => {
      // In development, suppress error toasts but log to console
      if (process.env.NODE_ENV === 'development') {
        console.error('Toast Error (suppressed):', message);
        return { id: 'suppressed', dismiss: () => {}, update: () => {} };
      }
      return originalToast.error(message, options);
    },
    
    warning: (message: string, options?: any) => {
      // In development, suppress warning toasts but log to console
      if (process.env.NODE_ENV === 'development') {
        console.warn('Toast Warning (suppressed):', message);
        return { id: 'suppressed', dismiss: () => {}, update: () => {} };
      }
      return originalToast.warning(message, options);
    },
    
    info: (message: string, options?: any) => {
      return originalToast.info(message, options);
    },
    
    loading: (message: string, options?: any) => {
      return originalToast.loading(message, options);
    },
    
    custom: (jsx: any, options?: any) => {
      return originalToast.custom(jsx, options);
    },
    
    dismiss: (id?: string | number) => {
      return originalToast.dismiss(id);
    },
    
    // Generic toast function with filtering
    default: (message: string, options?: any) => {
      // Check if message contains error-related keywords
      const isErrorMessage = message.toLowerCase().includes('error') ||
                            message.toLowerCase().includes('warning') ||
                            message.toLowerCase().includes('failed') ||
                            message.toLowerCase().includes('invalid');
      
      if (process.env.NODE_ENV === 'development' && isErrorMessage) {
        console.log('Toast Message (suppressed):', message);
        return { id: 'suppressed', dismiss: () => {}, update: () => {} };
      }
      
      return originalToast(message, options);
    }
  };

  return toast;
};

// Override the global toast function
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalGlobalToast = (window as any).toast;
  
  (window as any).toast = {
    success: (message: string, options?: any) => originalToast.success(message, options),
    error: (message: string, options?: any) => {
      console.error('Global Toast Error (suppressed):', message);
      return { id: 'suppressed', dismiss: () => {}, update: () => {} };
    },
    warning: (message: string, options?: any) => {
      console.warn('Global Toast Warning (suppressed):', message);
      return { id: 'suppressed', dismiss: () => {}, update: () => {} };
    },
    info: (message: string, options?: any) => originalToast.info(message, options),
    loading: (message: string, options?: any) => originalToast.loading(message, options),
    dismiss: (id?: string | number) => originalToast.dismiss(id),
  };
}

export default useFilteredToast;
