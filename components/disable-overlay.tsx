'use client';

import { useEffect } from 'react';

export default function DisableOverlay() {
  useEffect(() => {
    // Always run in development to suppress all error overlays
    if (process.env.NODE_ENV === 'development') {
      // Aggressively disable all React/Next.js error overlays and notifications
      const disableAllOverlays = () => {
        // Remove all existing overlays
        const overlaySelectors = [
          'iframe[data-nextjs-dialog-overlay]',
          '[data-nextjs-dialog-overlay]',
          '[data-nextjs-dialog]',
          '[data-nextjs-toast]',
          '.__next-dev-overlay-backdrop',
          '.__next-dev-overlay-container',
          '[data-nextjs-error-overlay]',
          '.nextjs-container-errors-header',
          '.nextjs-container-errors',
          '.nextjs-toast-errors',
          '[data-nextjs-terminal]',
          '.nextjs-portal',
          '[data-overlay-backdrop]',
          '[data-error-overlay]',
          '.react-error-overlay',
          '#__next-error-overlay__',
          '.error-overlay-container',
          '.webpack-dev-server-client-overlay',
          '.webpack-dev-server-client-overlay-div',

          // ALL toast notifications
          '.Toaster',
          '[data-sonner-toaster]',
          '.sonner-toast',
          '.toast',
          '.toaster',
          '[data-toast]',
          '[data-toast-viewport]',
          '[data-toast-root]',
          '.toast-container',
          '.toast-wrapper',
          '.react-hot-toast',
          '[data-hot-toast]',
          '[data-radix-toast-viewport]',
          '[data-radix-toast-root]'
        ];

        overlaySelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(element => {
            element.remove();
          });
        });

        // Inject comprehensive CSS to hide all possible overlays
        const style = document.createElement('style');
        style.id = 'disable-all-overlays';
        style.textContent = `
          /* Next.js Error Overlays */
          iframe[data-nextjs-dialog-overlay],
          [data-nextjs-dialog-overlay],
          [data-nextjs-dialog],
          [data-nextjs-toast],
          [data-nextjs-error-overlay],
          .__next-dev-overlay-backdrop,
          .__next-dev-overlay-container,
          .nextjs-container-errors-header,
          .nextjs-container-errors,
          .nextjs-toast-errors,
          [data-nextjs-terminal],
          .nextjs-portal,

          /* React Error Overlays */
          .react-error-overlay,
          #__next-error-overlay__,
          .error-overlay-container,
          [data-overlay-backdrop],
          [data-error-overlay],

          /* Webpack Dev Server Overlays */
          .webpack-dev-server-client-overlay,
          .webpack-dev-server-client-overlay-div,

          /* Generic error overlays */
          [class*="error-overlay"],
          [class*="dev-overlay"],
          [id*="error-overlay"],
          [id*="dev-overlay"],

          /* ALL Toast notifications in development */
          .Toaster,
          [data-sonner-toaster],
          .sonner-toast,
          .toast,
          .toaster,
          [data-toast],
          [data-toast-viewport],
          [data-toast-root],
          .toast-container,
          .toast-wrapper,
          .react-hot-toast,
          [data-hot-toast],
          [data-radix-toast-viewport],
          [data-radix-toast-root],

          /* Toast notifications that might show errors */
          .Toaster[data-sonner-toaster] [data-type="error"],
          .toast[data-type="error"],

          /* Any element with error-related data attributes */
          [data-error="true"],
          [data-has-error="true"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 0 !important;
            height: 0 !important;
            z-index: -9999 !important;
          }

          /* Hide any fixed/absolute positioned elements that might be overlays */
          body > div[style*="position: fixed"],
          body > div[style*="position: absolute"] {
            display: none !important;
          }

          /* Re-enable legitimate fixed elements */
          .toaster:not([data-type="error"]),
          .toast:not([data-type="error"]),
          [data-radix-portal],
          [data-radix-popper-content-wrapper] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            position: fixed !important;
            left: auto !important;
            top: auto !important;
            width: auto !important;
            height: auto !important;
            z-index: auto !important;
          }
        `;

        // Remove existing style if it exists
        const existingStyle = document.getElementById('disable-all-overlays');
        if (existingStyle) {
          existingStyle.remove();
        }

        document.head.appendChild(style);
      };

      // Run immediately and repeatedly
      disableAllOverlays();

      // Run every 100ms to catch any overlays that might appear
      const intervalId = setInterval(disableAllOverlays, 100);

      // Set up a mutation observer to catch dynamically added overlays
      const observer = new MutationObserver((mutations) => {
        let shouldRunDisable = false;

        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;

              // Check if it's any type of overlay, error notification, or toast
              const isOverlay =
                element.hasAttribute('data-nextjs-dialog-overlay') ||
                element.hasAttribute('data-nextjs-dialog') ||
                element.hasAttribute('data-nextjs-toast') ||
                element.hasAttribute('data-nextjs-error-overlay') ||
                element.hasAttribute('data-error-overlay') ||
                element.hasAttribute('data-overlay-backdrop') ||
                element.classList.contains('__next-dev-overlay-backdrop') ||
                element.classList.contains('__next-dev-overlay-container') ||
                element.classList.contains('nextjs-container-errors') ||
                element.classList.contains('react-error-overlay') ||
                element.classList.contains('error-overlay-container') ||
                element.classList.contains('webpack-dev-server-client-overlay') ||
                element.tagName === 'IFRAME' ||
                (element.getAttribute('style') && element.getAttribute('style')?.includes('position: fixed'));

              // Check if it's ANY toast notification
              const isToast =
                element.classList.contains('Toaster') ||
                element.hasAttribute('data-sonner-toaster') ||
                element.classList.contains('sonner-toast') ||
                element.classList.contains('toast') ||
                element.classList.contains('toaster') ||
                element.hasAttribute('data-toast') ||
                element.hasAttribute('data-toast-viewport') ||
                element.hasAttribute('data-toast-root') ||
                element.classList.contains('toast-container') ||
                element.classList.contains('toast-wrapper') ||
                element.classList.contains('react-hot-toast') ||
                element.hasAttribute('data-hot-toast') ||
                element.hasAttribute('data-radix-toast-viewport') ||
                element.hasAttribute('data-radix-toast-root');

              if (isOverlay || isToast) {
                shouldRunDisable = true;
                // Immediately hide the element
                (element as HTMLElement).style.display = 'none';
                // Try to remove it
                try {
                  element.remove();
                } catch (e) {
                  // Ignore removal errors
                }
              }
            }
          });
        });

        if (shouldRunDisable) {
          disableAllOverlays();
        }
      });

      // Start observing the entire document
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'data-nextjs-dialog-overlay', 'data-error-overlay']
      });

      // Override window.onerror to prevent error overlays
      const originalWindowError = window.onerror;
      window.onerror = (message, source, lineno, colno, error) => {
        // Still log to console for debugging
        console.error('Window Error:', { message, source, lineno, colno, error });
        // Prevent default error handling that might trigger overlays
        return true;
      };

      // Override unhandled promise rejection handler
      const originalUnhandledRejection = window.onunhandledrejection;
      window.onunhandledrejection = (event) => {
        // Still log to console for debugging
        console.error('Unhandled Promise Rejection:', event.reason);
        // Prevent default handling that might trigger overlays
        event.preventDefault();
        return true;
      };

      // Override console methods to prevent overlay triggers
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;

      console.error = (...args) => {
        // Still log errors for debugging
        originalConsoleError.apply(console, args);
        // Don't let errors propagate to overlay systems
      };

      console.warn = (...args) => {
        // Still log warnings for debugging
        originalConsoleWarn.apply(console, args);
        // Don't let warnings propagate to overlay systems
      };

      // Disable React error boundaries from showing overlays
      if (typeof window !== 'undefined') {
        // Override React's error handling
        const originalReactError = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot;
        if (originalReactError) {
          (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = () => {
            // Do nothing to prevent React DevTools overlays
          };
        }
      }

      // Cleanup function
      return () => {
        clearInterval(intervalId);
        observer.disconnect();
        window.onerror = originalWindowError;
        window.onunhandledrejection = originalUnhandledRejection;
        console.error = originalConsoleError;
        console.warn = originalConsoleWarn;
      };
    }
  }, []);

  return null; // This component doesn't render anything
}
