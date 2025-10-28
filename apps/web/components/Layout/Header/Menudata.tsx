import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from "@/app/[locale]/i18n-context";
import { useLocale } from "@/lib/hooks/use-locale";
import type { Locale } from "@/lib/i18n";
import { Menu } from "@/types/header/header";

/**
 * Hook to get menu data with translations and localized paths
 * SSG-safe: uses context but handles cases where it's not available
 */
export function useMenuData(locale?: Locale, dict?: Dictionary): Menu[] {
  let finalLocale: Locale;
  let finalDict: Dictionary | undefined;

  try {
    const context = useI18n();
    finalDict = context.dict;
    finalLocale = context.locale;
  } catch {
    finalDict = dict;
    finalLocale = locale || useLocale();
  }

  if (!finalDict || !finalLocale) {
    // Fallback to default locale
    finalLocale = 'en';
    return [
      { id: 1, title: "Home", path: "/en" },
      { id: 2, title: "About us", path: "/en/about-us" },
      { id: 3, title: "Services", path: "/en/services" },
      { id: 4, title: "Portfolio", path: "/en/portfolio" },
      { id: 5, title: "Contact us", path: "/en/contact-us" },
    ];
  }

  const nav = finalDict.navigation as Record<string, string>;

  return [
    {
      id: 1,
      title: nav.home,
      path: `/${finalLocale}`,
    },
    {
      id: 2,
      title: nav.about,
      path: `/${finalLocale}/about-us`,
    },
    {
      id: 3,
      title: nav.services,
      path: `/${finalLocale}/services`,
    },
    {
      id: 4,
      title: nav.portfolio,
      path: `/${finalLocale}/portfolio`,
    },
    {
      id: 5,
      title: nav.contact,
      path: `/${finalLocale}/contact-us`,
    },
  ];
}

// Legacy export for backwards compatibility (will be deprecated)
const MenuData: Menu[] = [];
export default MenuData;
