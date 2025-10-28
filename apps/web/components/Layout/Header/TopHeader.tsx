"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/app/[locale]/i18n-context";
import { useLocale } from "@/lib/hooks/use-locale";

const TopHeader = () => {
  const { dict } = useI18n();
  const locale = useLocale();
  const header = dict.header as Record<string, string>;

  return (
    <div className="bg-indigo-600">
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
