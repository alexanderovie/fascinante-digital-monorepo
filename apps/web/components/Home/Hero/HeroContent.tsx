import type { Locale } from "@/lib/i18n";
import { toTitleCase } from '@/lib/utils/text-formatting';
import { ChevronRight, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

interface HeroContentProps {
  dict: Record<string, string>;
  locale: Locale;
}

export function HeroContent({ dict, locale }: HeroContentProps) {
  // Hero Image - LCP Optimization (Next.js 15.5.6 Official)
  // Reference: https://nextjs.org/docs/app/api-reference/components/image#priority
  // Note: Consider adding optimized hero image at /public/images/home/hero-image.jpg for improved LCP
  // Recommended dimensions: 1920x1080px (16:9), WebP optimized, <200KB

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-3">
        <Link
          href={`/${locale}/contact-us`}
          className="badge"
        >
          {dict.badge} →
          <ChevronRight className="ml-1 size-4 text-current" aria-hidden="true" />
        </Link>
        <h1 className="text-secondary dark:text-white font-semibold min-w-[12ch]">
          {toTitleCase(dict.title)}
        </h1>
      </div>

      <p className="text-secondary dark:text-white text-lg sm:text-xl">
        {dict.subtitle}
      </p>

      {/* Mobile: Botón de auditoría */}
      <div className="block md:hidden mt-6">
        <Link href={`/${locale}/audit`} className="w-fit group flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm transition-all duration-300">
          <span className="text-base text-white group-hover:text-white font-bold">{dict.mobileAuditButton}</span>
        </Link>
      </div>

      {/* Trust Metrics - Server Component */}
      <div className="hidden md:flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12 mt-8">
        <div className="flex items-center gap-3 text-secondary dark:text-white">
          <Users size={28} className="text-blue-400" />
          <span className="text-lg md:text-xl lg:text-base font-semibold">
            {dict.clients}
          </span>
        </div>
        <div className="flex items-center gap-3 text-secondary dark:text-white">
          <Star size={28} className="text-amber-400" />
          <span className="text-lg md:text-xl lg:text-base font-semibold">
            {dict.satisfaction}
          </span>
        </div>
        <div className="hidden xl:flex items-center gap-3 text-secondary dark:text-white">
          <Clock size={28} className="text-emerald-400" />
          <span className="text-lg md:text-xl lg:text-base font-semibold">
            {dict.support}
          </span>
        </div>
      </div>
    </div>
  );
}
