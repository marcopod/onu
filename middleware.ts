import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes (routes that don't require authentication)
const publicRoutes = [
  '/login',
  '/register',
  '/register/personal',
  '/register/health-physical',
  '/register/health-mental',
  '/register/complete'
];

// Define auth routes (redirect to home if already authenticated)
const authRoutes = [
  '/login',
  '/register'
];

// Define API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/test-cookie',
  '/api/clear-db',
  '/api/test-db'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.includes('favicon.ico') ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Check if the current path is a public API route
  const isPublicApiRoute = publicApiRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Simple cookie-based authentication check for middleware
  const authToken = request.cookies.get('auth-token')?.value;

  // Allow public API routes without authentication
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Protect all API routes except public ones
  if (pathname.startsWith('/api/')) {
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access protected route
  if (!isPublicRoute && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
