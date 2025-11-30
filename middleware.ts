import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes.
  const isStaticOrApi =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    /\.(jpe?g|png|svg|ico|webmanifest)$/.test(pathname);

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // Handle authentication and authorization.
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const protectedRoutes = ["/dashboard", "/profile", "/notifications"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If trying to access a protected route without being authenticated, redirect to login.
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If authenticated and trying to access an auth page (like login), redirect to dashboard.
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except for the ones that start with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // This matcher is a broad-phase filter. Specific exclusions are handled in the middleware.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
