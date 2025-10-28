'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Dictionary } from './dictionaries'
import type { Locale } from '@/lib/i18n'

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

