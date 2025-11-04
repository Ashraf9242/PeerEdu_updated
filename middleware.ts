import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/next/jwt"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // استثناء المسارات العامة
  const publicPaths = [
    '/',
    '/about',
    '/login',
    '/register',
  ]

  if (publicPaths.includes(path) || path.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  const session = await getToken({ req })

  console.log("Session from middleware:", session)

  if (!session) {
    console.log("No session found, redirecting to /login")
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // In NextAuth.js v5, `getToken` returns the JWT payload directly.
  const role = session?.role as "STUDENT" | "TEACHER" | "ADMIN" | undefined

  console.log("Role from session:", role)

  // حماية المسارات بناءً على الـ role
  if (path.startsWith('/dashboard/teacher') && role !== "TEACHER") {
    console.log("Student trying to access teacher dashboard, redirecting to /dashboard/student")
    return NextResponse.redirect(new URL('/dashboard/student', req.nextUrl))
  }

  if (path.startsWith('/dashboard/admin') && role !== "ADMIN") {
    console.log("Teacher trying to access admin dashboard, redirecting to /dashboard/teacher")
    return NextResponse.redirect(new URL('/dashboard/teacher', req.nextUrl))
  }

  // حماية المسارات التي تحتاج تسجيل دخول
  if ((path.startsWith('/dashboard') || path.startsWith('/profile')) && !session) {
    console.log("Unauthorized access, redirecting to /login")
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}

// matcher لتحديد المسارات التي سيتم تطبيق الـ middleware عليها
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
    '/dashboard/:path*',
    '/profile/:path*',
  ],
}

/*
*  - console.log للـ debugging
*/