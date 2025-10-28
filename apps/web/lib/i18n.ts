/**
 * i18n Configuration
 * Next.js 15 App Router - Internationalization
 */

export const locales = ['en', 'es'] as const
export const defaultLocale = 'en' as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

/**
 * Check if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Get locale from string, fallback to default
 */
export function getLocale(locale: string | undefined | null): Locale {
  if (!locale || !isValidLocale(locale)) {
    return defaultLocale
  }
  return locale
}
