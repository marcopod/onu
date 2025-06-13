'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bug, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TestErrorOverlayPage() {
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const [suppressionActive, setSuppressionActive] = useState(false);

  useEffect(() => {
    // Check if suppression is active
    const checkSuppression = () => {
      const hasSuppressionScript = document.querySelector('script[src="/suppress-overlays.js"]');
      const hasSuppressionCSS = document.querySelector('style#disable-all-overlays');
      const hasDevUtils = typeof (window as any).devUtils !== 'undefined';

      setSuppressionActive(!!(hasSuppressionScript || hasSuppressionCSS || hasDevUtils));
    };

    checkSuppression();
    const interval = setInterval(checkSuppression, 1000);

    return () => clearInterval(interval);
  }, []);

  const throwError = () => {
    setShouldThrowError(true);
  };

  const throwConsoleError = () => {
    console.error('This is a test console error - should appear in console but not as overlay');
  };

  const throwWarning = () => {
    console.warn('This is a test warning - should appear in console but not as overlay');
  };

  const throwUncaughtError = () => {
    // This will throw an uncaught error
    setTimeout(() => {
      throw new Error('This is an uncaught error for testing overlay suppression');
    }, 100);
  };

  const throwPromiseRejection = () => {
    // This will create an unhandled promise rejection
    Promise.reject(new Error('This is an unhandled promise rejection for testing'));
  };

  const triggerReactError = () => {
    // This will trigger a React error
    const invalidElement = React.createElement('invalid-element', {}, 'This should cause a React error');
    console.error('React Error Test:', invalidElement);
  };

  const triggerNextJSError = () => {
    // This will trigger a Next.js specific error
    if (typeof window !== 'undefined') {
      (window as any).__NEXT_DATA__ = null;
      console.error('Next.js Error Test: Invalid __NEXT_DATA__');
    }
  };

  // This will trigger the error boundary
  if (shouldThrowError) {
    throw new Error('This is a test error thrown by the component to test error boundary');
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <RefreshCw className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Test Error Overlay</h1>
          </div>

          <div className={`border rounded-lg p-4 ${suppressionActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
              <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${suppressionActive ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <h3 className={`font-medium ${suppressionActive ? 'text-green-800' : 'text-red-800'}`}>
                  Error Overlay Suppression Status: {suppressionActive ? 'ACTIVE ✅' : 'INACTIVE ❌'}
                </h3>
                <p className={`text-sm mt-1 ${suppressionActive ? 'text-green-700' : 'text-red-700'}`}>
                  {suppressionActive
                    ? 'Overlay suppression is working. Errors will be logged to console but no overlays should appear.'
                    : 'Overlay suppression may not be working properly. Check the console for errors.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800">Testing Instructions</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Use the buttons below to test different types of errors.
                  If the overlay suppression is working correctly, you should see errors
                  in the browser console but no error overlay popups or notifications in the corner.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Console Errors (No Overlay)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These should appear in console but not trigger error overlays.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={throwConsoleError}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Throw Console Error
                </Button>
                <Button
                  onClick={throwWarning}
                  variant="outline"
                  className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                >
                  Throw Console Warning
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Component Errors (Error Boundary)
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This will trigger the error boundary instead of showing an overlay.
              </p>
              <Button
                onClick={throwError}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Throw Component Error
              </Button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <Bug className="h-4 w-4 mr-2" />
                Uncaught Errors & Promise Rejections
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                These will throw various types of errors that should all be suppressed.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={throwUncaughtError}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Throw Uncaught Error
                </Button>
                <Button
                  onClick={throwPromiseRejection}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Unhandled Promise Rejection
                </Button>
                <Button
                  onClick={triggerReactError}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Trigger React Error
                </Button>
                <Button
                  onClick={triggerNextJSError}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Trigger Next.js Error
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Dev Utils Available</h3>
            <p className="text-sm text-blue-700 mb-2">
              Open browser console and try these commands:
            </p>
            <div className="text-xs font-mono bg-blue-100 p-2 rounded text-blue-800">
              <div>devUtils.getOverlayStatus()</div>
              <div>devUtils.toggleErrorOverlay(false)</div>
              <div>devUtils.logError(new Error('test'))</div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/">
              <Button className="bg-green-500 hover:bg-green-600">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
