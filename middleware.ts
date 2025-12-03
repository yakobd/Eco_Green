import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes - allow landing page and login
  if (pathname === '/login') {
    return NextResponse.next();
  }

  // Root path - check if user is logged in
  if (pathname === '/') {
    if (token) {
      // Logged in users go to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Not logged in - show landing page
    return NextResponse.next();
  }

  // Protected routes - require token
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
