import { Menu } from "@/types/header/header";
import { useI18n } from "@/app/[locale]/i18n-context";
import { useLocale } from "@/lib/hooks/use-locale";

/**
 * Hook to get menu data with translations and localized paths
 */
export function useMenuData(): Menu[] {
  const { dict } = useI18n();
  const locale = useLocale();
  const nav = dict.navigation as Record<string, string>;

  return [
    {
      id: 1,
      title: nav.home,
      path: `/${locale}`,
    },
    {
      id: 2,
      title: nav.about,
      path: `/${locale}/about-us`,
    },
    {
      id: 3,
      title: nav.services,
      path: `/${locale}/services`,
    },
    {
      id: 4,
      title: nav.portfolio,
      path: `/${locale}/portfolio`,
    },
    {
      id: 5,
      title: nav.contact,
      path: `/${locale}/contact-us`,
    },
  ];
}

// Legacy export for backwards compatibility (will be deprecated)
const MenuData: Menu[] = [];
export default MenuData;
