// Development utilities for managing error overlay behavior

export const devUtils = {
  // Toggle error overlay on/off
  toggleErrorOverlay: (disable: boolean = true) => {
    if (typeof window !== 'undefined') {
      if (disable) {
        window.localStorage.setItem('disable-error-overlay', 'true');
        console.log('✅ Error overlay disabled. Refresh the page to apply changes.');
      } else {
        window.localStorage.removeItem('disable-error-overlay');
        console.log('✅ Error overlay enabled. Refresh the page to apply changes.');
      }
    }
  },

  // Check if error overlay is disabled
  isErrorOverlayDisabled: (): boolean => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('disable-error-overlay') === 'true';
    }
    return false;
  },

  // Get current overlay status
  getOverlayStatus: () => {
    const isDisabled = devUtils.isErrorOverlayDisabled();
    console.log(`Error overlay is currently: ${isDisabled ? 'DISABLED' : 'ENABLED'}`);
    return isDisabled;
  },

  // Helper to log errors without triggering overlay
  logError: (error: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.group(`🐛 Error ${context ? `(${context})` : ''} - ${timestamp}`);
    console.error(error);
    if (error?.stack) {
      console.error('Stack trace:', error.stack);
    }
    console.groupEnd();
  },

  // Helper to log warnings without triggering overlay
  logWarning: (warning: any, context?: string) => {
    const timestamp = new Date().toISOString();
    console.group(`⚠️ Warning ${context ? `(${context})` : ''} - ${timestamp}`);
    console.warn(warning);
    console.groupEnd();
  },
};

// Make devUtils available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).devUtils = devUtils;
  console.log('🛠️ Dev utils available globally as window.devUtils');
  console.log('📝 Available methods:');
  console.log('  - devUtils.toggleErrorOverlay(true/false)');
  console.log('  - devUtils.getOverlayStatus()');
  console.log('  - devUtils.logError(error, context)');
  console.log('  - devUtils.logWarning(warning, context)');
}

export default devUtils;
