import { NextRequest, NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getToken } from "next-auth/jwt";

const locales = ["en", "ar"];
const defaultLocale = "ar";

/**
 * Determines the best locale to use for the request.
 * The lookup order is:
 * 1. Check the URL path for a locale prefix.
 * 2. Check for a locale cookie.
 * 3. Check the 'Accept-Language' header.
 * @param request The incoming NextRequest.
 * @returns The determined locale.
 */
function getLocale(request: NextRequest): string {
  const { pathname } = request.nextUrl;

  // 1. Check URL for locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    return pathname.split("/")[1];
  }

  // 2. Check cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Check 'Accept-Language' header
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => (headers[key] = value));
  
  // @ts-ignore - Negotiator types may not align perfectly with NextRequest headers
  const languages = new Negotiator({ headers }).languages();
  
  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Step 1: Skip middleware for static assets and API routes.
  const isStaticOrApi =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    /\.(jpe?g|png|svg|ico|webmanifest)$/.test(pathname);

  if (isStaticOrApi) {
    return NextResponse.next();
  }

  // Step 2: Determine locale and handle i18n redirects.
  const locale = getLocale(request);
  const pathnameIsMissingLocale = locales.every(
    (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
  );

  // Redirect if the path is missing a locale prefix.
  if (pathnameIsMissingLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Step 3: Handle authentication and authorization.
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  const protectedRoutes = ["/dashboard", "/profile", "/notifications"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`)
  );

  // If trying to access a protected route without being authenticated, redirect to login.
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(`/${locale}${route}`)
  );

  // If authenticated and trying to access an auth page (like login), redirect to dashboard.
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Step 4: Attach the locale to the response for future requests.
  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, { maxAge: 30 * 24 * 60 * 60 }); // 30 days

  return response;
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