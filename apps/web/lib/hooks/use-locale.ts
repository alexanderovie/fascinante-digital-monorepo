'use client'

import { useParams } from 'next/navigation'
import { type Locale, defaultLocale, isValidLocale } from '@/lib/i18n'

/**
 * Hook to get current locale from URL params
 * Returns defaultLocale if invalid or not found
 */
export function useLocale(): Locale {
  const params = useParams()
  const locale = params?.locale as string | undefined
  
  if (!locale || !isValidLocale(locale)) {
    return defaultLocale
  }
  
  return locale
}

