import CaseStudyLayout from '@/components/Portfolio/CaseStudyLayout';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/**
 * Generate static params for all case studies
 * This pre-renders all case study pages at build time
 */
export async function generateStaticParams() {
  // List of case study slugs
  // TODO: Dynamically read from content/cases directory
  const cases = [
    { slug: 'restaurante-tampa' },
    { slug: 'clinica-dental-miami' },
    { slug: 'abogado-inmigracion-orlando' },
    { slug: 'spa-bienestar-fortlauderdale' },
    { slug: 'agencia-bienes-raices-jacksonville' },
    { slug: 'servicios-limpieza-tampa' },
  ];

  // Generate params for all locales
  const locales = ['es', 'en'];
  const params = [];

  for (const locale of locales) {
    for (const caseItem of cases) {
      params.push({ locale, slug: caseItem.slug });
    }
  }

  return params;
}

/**
 * Generate metadata for case study page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Dynamically import the MDX file
    const CaseStudy = await import(`@/content/cases/${slug}.mdx`);
    const metadata = (CaseStudy.metadata || {}) as {
      title?: string;
      client?: string;
      industry?: string;
    };

    const caseTitle = metadata.title || 'Case Study';
    const client = metadata.client || 'Client';
    const industry = metadata.industry || 'Digital Marketing';

    return {
      title: `${caseTitle} - Case Study | Fascinante Digital`,
      description: `Discover how ${client} achieved remarkable growth with our marketing strategies. Case study showing ${industry} results, proven tactics, and measurable outcomes.`,
    };
  } catch {
    return {
      title: 'Case Study - Digital Marketing Success Stories | Fascinante',
      description: 'Discover detailed case studies showcasing how businesses achieved remarkable growth with our marketing strategies. Real results and proven tactics.',
    };
  }
}

/**
 * Case Study Page Component
 * Uses dynamic imports to load MDX content
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;

  try {
    // Dynamically import the MDX file
    // Note: The .mdx extension must be specified
    const CaseStudy = await import(`@/content/cases/${slug}.mdx`);
    const metadata = (CaseStudy.metadata || {}) as {
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
    };

    const Content = CaseStudy.default;

    return (
      <main>
        <CaseStudyLayout locale={locale} metadata={metadata} Content={Content} />
      </main>
    );
  } catch {
    notFound();
  }
}

// Disable dynamic params - only allow pre-rendered routes
export const dynamicParams = false;
