"use client";
import type { Dictionary } from "@/app/[locale]/dictionaries";
import { useI18n } from "@/app/[locale]/i18n-context";
import { useLocale } from "@/lib/hooks/use-locale";
import type { Locale } from "@/lib/i18n";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface TopHeaderProps {
  locale?: Locale;
  dict?: Dictionary;
}

const TopHeader = ({ locale: propLocale, dict: propDict }: TopHeaderProps = {}) => {
  // ✅ ALL HOOKS FIRST - per React Rules of Hooks
  // Call all hooks at the top level, before any conditional logic
  let contextDict, contextLocale;
  try {
    const context = useI18n();
    contextDict = context.dict;
    contextLocale = context.locale;
  } catch {
    contextDict = undefined;
    contextLocale = undefined;
  }

  // Fallback locale hook - must be called unconditionally
  const fallbackLocale = useLocale();

  // Now derive final values from hooks (pure logic, not hook calls)
  const dict = contextDict ?? propDict;
  const locale = contextLocale ?? propLocale ?? fallbackLocale;

  const header = dict?.header as Record<string, string> | undefined;

  // ✅ CONDITIONAL RETURN AFTER ALL HOOKS
  if (!header || !locale) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
      <div className="container">
        <div className="flex justify-center py-3">
          <Link
            href={`/${locale}/contact-us`}
            className="group inline-flex items-center text-xs leading-normal md:text-sm text-white hover:text-white/90 transition-all duration-300"
          >
            ✨
            <span className="ml-1 font-[580] dark:font-[550]">
              {header.topBanner}
            </span>
            <ChevronRight
              size={16}
              className="mt-[3px] ml-1 hidden size-4 transition-all duration-300 ease-out group-hover:translate-x-1 lg:inline-block"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TopHeader;
