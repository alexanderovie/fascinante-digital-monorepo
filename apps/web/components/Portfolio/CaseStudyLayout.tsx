import type { Locale } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { CtaSection } from './CtaSection';
import { MDXContent } from './MDXContent';
import { MetricsGrid } from './MetricsGrid';
import { TestimonialSection } from './TestimonialSection';

interface CaseStudyMetadata {
  title?: string;
  client?: string;
  industry?: string;
  location?: string;
  duration?: string;
  heroImage?: string;
  metrics?: Record<string, { before: number; after: number; unit: string }>;
  testimonial?: {
    quote: string;
    clientName: string;
    clientRole: string;
    clientImage?: string;
  };
}

interface CaseStudyLayoutProps {
  locale: Locale;
  metadata: CaseStudyMetadata;
  content: React.ReactNode;
}

export default function CaseStudyLayout({
  locale,
  metadata,
  content,
}: CaseStudyLayoutProps) {
  return (
    <div className="dark:bg-dark-gray">
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32">
        <div className="container">
          <div className="py-12 xl:py-28 flex flex-col gap-6 sm:gap-10">
            {/* Breadcrumb + Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/icon/home-icon.svg"
                    alt="home-icon"
                    width={28}
                    height={28}
                  />
                  <p className="font-semibold text-secondary/50 dark:text-white/50">
                    <Link href={`/${locale}`} className="text-primaryText">
                      Home /{' '}
                    </Link>
                    <Link href={`/${locale}/portfolio`} className="text-primaryText">
                      Portfolio /{' '}
                    </Link>
                    <span>{metadata.client || 'Case Study'}</span>
                  </p>
                </div>
                <div className="badge">
                  <p className="text-current">Caso de Éxito</p>
                </div>
                <h1 className="text-secondary dark:text-white font-semibold text-3xl md:text-4xl lg:text-5xl">
                  {metadata.title || 'Case Study'}
                </h1>
              </div>
              <div className="flex items-center gap-4">
                {metadata.location && (
                  <div className="flex gap-2 pr-4 py-2 border-r border-gray/20">
                    <p className="text-base md:text-lg text-secondary/80 dark:text-white/80 font-medium">
                      📍 {metadata.location}
                    </p>
                  </div>
                )}
                {metadata.duration && (
                  <div className="flex gap-2 px-4 py-2">
                    <p className="text-base md:text-lg text-secondary/80 dark:text-white/80 font-medium">
                      ⏱️ {metadata.duration}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Image */}
            {metadata.heroImage && (
              <div className="w-full h-[450px] lg:h-[600px] relative rounded-md overflow-hidden">
                <Image
                  src={metadata.heroImage}
                  alt={metadata.title || 'Hero image'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Metrics Grid */}
            {metadata.metrics && (
              <MetricsGrid metrics={metadata.metrics} />
            )}

            {/* MDX Content */}
            <MDXContent>{content}</MDXContent>

            {/* Testimonial Section */}
            {metadata.testimonial && (
              <TestimonialSection testimonial={metadata.testimonial} />
            )}

            {/* CTA Section */}
            <CtaSection locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
