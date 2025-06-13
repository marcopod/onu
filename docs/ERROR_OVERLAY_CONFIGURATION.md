# Error Overlay Configuration

This document explains how to configure and control the Next.js development error overlay in your application.

## Overview

The application has been configured to disable the Next.js development error overlay notifications while maintaining proper error logging for debugging purposes. This provides a cleaner development experience without losing important error information.

## Configuration

### Automatic Disabling

The error overlay is automatically disabled in development mode through several mechanisms:

1. **Next.js Configuration** (`next.config.mjs`):
   - `reactStrictMode: false` - Disables React strict mode warnings
   - Custom webpack configuration to disable overlay components
   - Development indicators are turned off

2. **Client-side Overlay Suppression** (`components/disable-overlay.tsx`):
   - Automatically hides error overlay elements
   - Uses CSS to make overlays invisible
   - Monitors DOM for dynamically added overlays

3. **Error Boundary** (`components/error-boundary.tsx`):
   - Provides graceful error handling
   - Shows user-friendly error messages
   - Maintains error logging for debugging

## Manual Control

### Environment Variables

Add these to your `.env.local` file:

```bash
# Disable error overlay (default: true)
NEXT_PUBLIC_DISABLE_ERROR_OVERLAY="true"

# Show detailed error information in development (default: false)
NEXT_PUBLIC_SHOW_ERROR_DETAILS="false"
```

### Browser Console Commands

In development, you can use these browser console commands:

```javascript
// Disable error overlay
devUtils.toggleErrorOverlay(true)

// Enable error overlay
devUtils.toggleErrorOverlay(false)

// Check current status
devUtils.getOverlayStatus()

// Log errors without triggering overlay
devUtils.logError(new Error('Test error'), 'Testing')

// Log warnings without triggering overlay
devUtils.logWarning('Test warning', 'Testing')
```

## Error Handling

### Console Logging

All errors are still logged to the browser console for debugging:

- ✅ **Errors are logged** - You can still see all error details in the console
- ✅ **Stack traces preserved** - Full error information is available
- ✅ **Context maintained** - Error boundaries provide additional context

### Production Behavior

In production:
- Error overlays are never shown (Next.js default)
- Error boundaries show user-friendly error messages
- Errors can be sent to monitoring services (configurable)

### Development Behavior

In development:
- Error overlays are suppressed by default
- Errors are logged to console with full details
- Error boundaries show detailed error information (when enabled)

## Customization

### Custom Error Boundaries

You can create custom error boundaries for specific components:

```tsx
import ErrorBoundary, { withErrorBoundary } from '@/components/error-boundary'

// Wrap a component
const MyComponent = withErrorBoundary(YourComponent, {
  onError: (error, errorInfo) => {
    // Custom error handling
    console.error('Custom error handler:', error)
  }
})

// Or use as a wrapper
<ErrorBoundary fallback={CustomErrorComponent}>
  <YourComponent />
</ErrorBoundary>
```

### Custom Error Fallback

Create custom error fallback components:

```tsx
function CustomErrorFallback({ error, resetError }) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <button onClick={resetError}>Try again</button>
    </div>
  )
}
```

## Troubleshooting

### If Error Overlays Still Appear

1. **Clear browser cache** and refresh the page
2. **Check environment variables** are set correctly
3. **Restart the development server** after configuration changes
4. **Use browser console** to manually disable: `devUtils.toggleErrorOverlay(true)`

### If Errors Are Not Logged

1. **Check browser console settings** - ensure errors are not filtered
2. **Verify error boundary setup** - make sure components are wrapped
3. **Check network tab** - some errors might be network-related

### Re-enabling Error Overlays

If you need to temporarily re-enable error overlays for debugging:

```javascript
// In browser console
devUtils.toggleErrorOverlay(false)
// Then refresh the page
```

Or set environment variable:
```bash
NEXT_PUBLIC_DISABLE_ERROR_OVERLAY="false"
```

## Best Practices

1. **Keep error logging enabled** - Always maintain console error logging
2. **Use error boundaries** - Wrap components that might throw errors
3. **Test error scenarios** - Regularly test error handling in development
4. **Monitor production errors** - Set up error monitoring for production
5. **Document custom errors** - Document any custom error handling logic

## Files Modified

- `next.config.mjs` - Next.js configuration
- `app/layout.tsx` - Root layout with error boundary
- `components/error-boundary.tsx` - Error boundary component
- `components/disable-overlay.tsx` - Overlay suppression
- `lib/dev-utils.ts` - Development utilities
- `lib/error-config.ts` - Error configuration

## Support

If you encounter issues with error overlay configuration, check:

1. Browser developer tools console for any configuration errors
2. Next.js documentation for the latest overlay configuration options
3. The application's error boundary implementation for custom error handling
