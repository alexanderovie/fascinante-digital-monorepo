import { defaultLocale, isValidLocale, locales, type Locale } from '@/lib/i18n'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Get the preferred locale from the request headers
 */
function getLocale(request: NextRequest): Locale {
  // Get Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? undefined

  // If no header, return default
  if (!acceptLanguage) {
    return defaultLocale
  }

  // Parse preferred languages using Negotiator
  const headers: Record<string, string> = { 'accept-language': acceptLanguage }
  const languages = new Negotiator({ headers }).languages()

  // Match against supported locales
  return match(languages, locales as unknown as string[], defaultLocale) as Locale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for:
  // - API routes
  // - Static files (_next, images, fonts, etc.)
  // - Favicon and other assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/icon') ||
    pathname.startsWith('/apple-icon') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If locale is already in pathname, proceed
  if (pathnameHasLocale) {
    // Validate the locale from pathname
    const pathnameLocale = pathname.split('/')[1]
    if (isValidLocale(pathnameLocale)) {
      return NextResponse.next()
    }
    // Invalid locale in pathname, redirect to default
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(newUrl)
  }

  // No locale in pathname, detect and redirect
  const locale = getLocale(request)
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  // Preserve search params and hash
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
}
