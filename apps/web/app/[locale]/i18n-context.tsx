'use client'

import type { Dictionary } from '@/lib/dictionaries'
import type { Locale } from '@/lib/i18n'
import { createContext, useContext, type ReactNode } from 'react'

interface I18nContextType {
  locale: Locale
  dict: Dictionary
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  locale,
  dict,
}: {
  children: ReactNode
  locale: Locale
  dict: Dictionary
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
