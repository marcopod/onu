// Immediate overlay suppression script - runs before React loads
(function() {
  'use strict';
  
  // Only run in development
  if (typeof window === 'undefined' || !window.location.hostname.includes('localhost')) {
    return;
  }

  console.log('🚫 Overlay suppression script loaded');

  // Aggressive overlay suppression function
  function suppressAllOverlays() {
    // Remove all overlay elements
    const overlaySelectors = [
      'iframe[data-nextjs-dialog-overlay]',
      '[data-nextjs-dialog-overlay]',
      '[data-nextjs-dialog]',
      '[data-nextjs-toast]',
      '[data-nextjs-error-overlay]',
      '[data-nextjs-terminal]',
      '.__next-dev-overlay-backdrop',
      '.__next-dev-overlay-container',
      '.nextjs-container-errors-header',
      '.nextjs-container-errors',
      '.nextjs-toast-errors',
      '.nextjs-portal',
      '.react-error-overlay',
      '#__next-error-overlay__',
      '.error-overlay-container',
      '[data-overlay-backdrop]',
      '[data-error-overlay]',
      '.webpack-dev-server-client-overlay',
      '.webpack-dev-server-client-overlay-div',
      '[class*="error-overlay"]',
      '[class*="dev-overlay"]',
      '[id*="error-overlay"]',
      '[id*="dev-overlay"]'
    ];

    overlaySelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          element.remove();
        });
      } catch (e) {
        // Ignore errors
      }
    });

    // Hide any fixed positioned elements that might be overlays
    const fixedElements = document.querySelectorAll('body > div[style*="position: fixed"]');
    fixedElements.forEach(element => {
      const style = element.getAttribute('style') || '';
      const classList = element.className || '';
      
      // Don't hide legitimate UI components
      if (!element.hasAttribute('data-radix-portal') && 
          !element.hasAttribute('data-radix-popper-content-wrapper') &&
          !classList.includes('toaster') &&
          !element.hasAttribute('data-sonner-toaster')) {
        element.style.display = 'none';
      }
    });
  }

  // Override error handlers immediately
  const originalError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error (suppressed overlay):', { message, source, lineno, colno, error });
    return true; // Prevent default error handling
  };

  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    console.error('Unhandled rejection (suppressed overlay):', event.reason);
    event.preventDefault();
    return true;
  };

  // Override console methods to prevent overlay triggers
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    // Don't propagate to overlay systems
  };

  console.warn = function(...args) {
    originalConsoleWarn.apply(console, args);
    // Don't propagate to overlay systems
  };

  // Override all possible toast libraries
  function suppressToast() {
    return {
      success: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      error: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      warning: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      info: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      loading: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      custom: function() { console.log('Toast suppressed'); return { id: 'suppressed', dismiss: function() {} }; },
      dismiss: function() { console.log('Toast dismiss suppressed'); },
      promise: function() { console.log('Toast promise suppressed'); return { id: 'suppressed', dismiss: function() {} }; }
    };
  }

  // Override global toast functions
  window.toast = suppressToast();

  // Override Sonner toast if it exists
  if (window.sonner) {
    window.sonner = suppressToast();
  }

  // Override react-hot-toast if it exists
  if (window.hotToast) {
    window.hotToast = suppressToast();
  }

  // Override any toast function that might be added later
  Object.defineProperty(window, 'toast', {
    get: function() { return suppressToast(); },
    set: function() { console.log('Toast override prevented'); },
    configurable: false
  });

  // Run suppression immediately and repeatedly
  suppressAllOverlays();
  
  // Set up interval to continuously suppress overlays
  const suppressionInterval = setInterval(suppressAllOverlays, 50);

  // Set up mutation observer for immediate suppression
  const observer = new MutationObserver(function(mutations) {
    let shouldSuppress = false;
    
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          const element = node;
          
          // Check if it's an overlay
          if (element.hasAttribute && (
            element.hasAttribute('data-nextjs-dialog-overlay') ||
            element.hasAttribute('data-nextjs-dialog') ||
            element.hasAttribute('data-nextjs-toast') ||
            element.hasAttribute('data-nextjs-error-overlay') ||
            element.hasAttribute('data-error-overlay') ||
            element.classList.contains('__next-dev-overlay-backdrop') ||
            element.classList.contains('__next-dev-overlay-container') ||
            element.classList.contains('nextjs-container-errors') ||
            element.classList.contains('react-error-overlay') ||
            element.classList.contains('error-overlay-container') ||
            element.tagName === 'IFRAME'
          )) {
            shouldSuppress = true;
            element.style.display = 'none';
            try {
              element.remove();
            } catch (e) {
              // Ignore removal errors
            }
          }
        }
      });
    });
    
    if (shouldSuppress) {
      suppressAllOverlays();
    }
  });

  // Start observing immediately
  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', suppressAllOverlays);
  } else {
    suppressAllOverlays();
  }

  // Run when window loads
  window.addEventListener('load', suppressAllOverlays);

  // Run on focus (in case overlays appear when switching tabs)
  window.addEventListener('focus', suppressAllOverlays);

  // Clean up on page unload
  window.addEventListener('beforeunload', function() {
    clearInterval(suppressionInterval);
    observer.disconnect();
    window.onerror = originalError;
    window.onunhandledrejection = originalUnhandledRejection;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  });

  console.log('✅ Overlay suppression active');
})();
