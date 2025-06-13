// Error configuration for development and production environments

export const errorConfig = {
  // Disable error overlay in development
  showErrorOverlay: false,
  
  // Enable console logging for debugging
  logErrors: true,
  
  // Error reporting configuration
  reportErrors: process.env.NODE_ENV === 'production',
  
  // Custom error handler
  handleError: (error: Error, errorInfo?: any) => {
    // Always log to console for debugging
    if (errorConfig.logErrors) {
      console.error('Application Error:', error);
      if (errorInfo) {
        console.error('Error Info:', errorInfo);
      }
    }
    
    // In production, you might want to send errors to a monitoring service
    if (errorConfig.reportErrors) {
      // Example: Send to error monitoring service
      // sendToErrorService(error, errorInfo);
    }
  },
};

// Global error handler for unhandled promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default browser error handling
    event.preventDefault();
  });
  
  // Global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    // Prevent the default browser error handling
    event.preventDefault();
  });
}

export default errorConfig;
