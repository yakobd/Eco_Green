import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Allow all API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public routes
  if (pathname === '/login' || pathname === '/') {
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
