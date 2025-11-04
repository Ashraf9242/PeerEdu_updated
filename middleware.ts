import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // المسارات العامة
  const publicPaths = ['/', '/about', '/login', '/register']

  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // Get session token from cookies
  const token = req.cookies.get('next-auth.session-token') 
    || req.cookies.get('__Secure-next-auth.session-token') // for production (HTTPS)

  console.log("Token from cookies:", token)
  console.log("Current path:", path)

  // If no token and trying to access protected routes
  if (!token) {
    console.log("No token found, redirecting to /login")
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // For role-based checks, you'll need to verify the session on the server
  // Or pass role info through a custom cookie

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
  ],
}