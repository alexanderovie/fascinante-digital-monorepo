import 'server-only'

import type { Locale } from '@/lib/i18n'

/**
 * Dictionary type - will be generated from JSON files
 * For now, using a flexible type that will be refined
 */
export type Dictionary = {
  [key: string]: string | Dictionary
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./en.json').then((module) => module.default as Dictionary),
  es: () => import('./es.json').then((module) => module.default as Dictionary),
}

/**
 * Get dictionary for a specific locale
 * Server-only function - dictionaries are loaded on the server
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

