'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from './auth-context';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

// Internal component that uses useSearchParams - must be wrapped in Suspense
function RouteGuardInternal({
  children,
  requireAuth = true,
  redirectTo = '/login',
  fallback
}: RouteGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth context to finish loading
    if (isLoading) {
      return;
    }

    setIsChecking(false);

    // If authentication is required but user is not authenticated
    if (requireAuth && !user) {
      const redirectUrl = new URL(redirectTo, window.location.origin);
      redirectUrl.searchParams.set('redirect', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
      router.push(redirectUrl.toString());
      return;
    }

    // If authentication is not required but user is authenticated (auth pages)
    if (!requireAuth && user) {
      // Get redirect URL from query params or default to home
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
      return;
    }
  }, [user, isLoading, requireAuth, router, pathname, searchParams, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If authentication is not required but user is authenticated (auth pages), don't render children
  if (!requireAuth && user) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Main RouteGuard component that wraps the internal component with Suspense
export function RouteGuard(props: RouteGuardProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <RouteGuardInternal {...props} />
    </Suspense>
  );
}

// Higher-order component version for easier usage
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteGuardProps, 'children'> = {}
) {
  return function GuardedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

// Specific guards for common use cases
export function ProtectedRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={true} fallback={fallback}>
      {children}
    </RouteGuard>
  );
}

export function AuthRoute({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={false} fallback={fallback}>
      {children}
    </RouteGuard>
  );
}
