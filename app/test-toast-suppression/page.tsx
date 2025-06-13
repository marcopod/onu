'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TestToastSuppressionPage() {
  const [suppressionActive, setSuppressionActive] = useState(false);

  useEffect(() => {
    // Check if toast suppression is active
    const checkSuppression = () => {
      const toasterExists = document.querySelector('.Toaster') || document.querySelector('[data-sonner-toaster]');
      const hasSuppressionCSS = document.querySelector('style#disable-all-overlays');
      const hasSuppressionScript = document.querySelector('script[src="/suppress-overlays.js"]');
      
      setSuppressionActive(!toasterExists && !!(hasSuppressionCSS || hasSuppressionScript));
    };

    checkSuppression();
    const interval = setInterval(checkSuppression, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const testToastError = () => {
    console.log('Attempting to show error toast...');
    toast.error('This is a test error toast - should be suppressed!');
  };

  const testToastSuccess = () => {
    console.log('Attempting to show success toast...');
    toast.success('This is a test success toast - should be suppressed!');
  };

  const testToastWarning = () => {
    console.log('Attempting to show warning toast...');
    toast.warning('This is a test warning toast - should be suppressed!');
  };

  const testToastInfo = () => {
    console.log('Attempting to show info toast...');
    toast.info('This is a test info toast - should be suppressed!');
  };

  const testHydrationError = () => {
    console.log('Simulating hydration error...');
    // Simulate a hydration mismatch
    const div = document.createElement('div');
    div.innerHTML = '<p>Server content</p>';
    document.body.appendChild(div);
    
    setTimeout(() => {
      div.innerHTML = '<p>Client content</p>';
      console.error('Hydration failed because the initial UI does not match what was rendered on the server.');
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="text-green-800">
              <CheckCircle className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-green-800 ml-4">Test Toast Suppression</h1>
          </div>

          <div className={`border rounded-lg p-4 ${suppressionActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start">
              {suppressionActive ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div>
                <h3 className={`font-medium ${suppressionActive ? 'text-green-800' : 'text-red-800'}`}>
                  Toast Suppression Status: {suppressionActive ? 'ACTIVE ✅' : 'INACTIVE ❌'}
                </h3>
                <p className={`text-sm mt-1 ${suppressionActive ? 'text-green-700' : 'text-red-700'}`}>
                  {suppressionActive 
                    ? 'Toast suppression is working. No toast notifications should appear in the corner.'
                    : 'Toast suppression may not be working. Check if toaster components are still present.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">Testing Instructions</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Click the buttons below to test toast notifications. If suppression is working correctly:
                </p>
                <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                  <li>No toast notifications should appear in the corner</li>
                  <li>Console messages will show the toast attempts</li>
                  <li>No hydration error toasts should appear</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Toast Notification Tests</h3>
              <p className="text-sm text-gray-600 mb-3">
                These should NOT show any toast notifications in the corner.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={testToastError}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Error Toast
                </Button>
                <Button
                  onClick={testToastSuccess}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  Success Toast
                </Button>
                <Button
                  onClick={testToastWarning}
                  variant="outline"
                  className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                >
                  Warning Toast
                </Button>
                <Button
                  onClick={testToastInfo}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Info Toast
                </Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Hydration Error Test</h3>
              <p className="text-sm text-gray-600 mb-3">
                This simulates a hydration error that typically shows toast notifications.
              </p>
              <Button
                onClick={testHydrationError}
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Simulate Hydration Error
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Console Output</h3>
            <p className="text-sm text-gray-600">
              Open browser console (F12) to see suppressed toast messages and any errors.
              All toast attempts should be logged but no visual notifications should appear.
            </p>
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
