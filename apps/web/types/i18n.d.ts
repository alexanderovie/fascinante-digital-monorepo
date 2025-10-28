/**
 * TypeScript types for i18n
 */

import type { Locale } from '@/lib/i18n'

declare global {
  /**
   * Standard params for locale-aware routes
   */
  interface LocaleParams {
    params: Promise<{ locale: Locale }>
  }

  /**
   * Extended params with searchParams
   */
  interface LocalePageProps extends LocaleParams {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
  }
}

export { }
