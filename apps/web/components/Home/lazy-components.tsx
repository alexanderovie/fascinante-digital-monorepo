/**
 * Lazy-loaded components for homepage
 *
 * Optimizations based on Next.js 15.5.6 official docs:
 * https://nextjs.org/docs/app/guides/lazy-loading
 *
 * These components are lazy-loaded because they:
 * - Use framer-motion (201 KiB JS without use)
 * - Use embla-carousel (heavy library)
 * - Are below the fold (not critical for initial render)
 */

import dynamic from 'next/dynamic';

// Lazy load components with framer-motion
// Note: These components are Client Components internally ("use client")
// Next.js will handle code splitting automatically
export const ExcepServicesLazy = dynamic(
  () => import('@/components/Home/ExcepServices'),
  {
    loading: () => (
      <section>
        <div className='bg-[#F5F6F6] dark:bg-[#121212]'>
          <div className="container">
            <div className='flex flex-col gap-10 sm:gap-16 border-t border-natural-gray dark:border-natural-gray/20 py-20 sm:py-28'>
              <div className="flex flex-col gap-3 items-center justify-center">
                <div className="badge">
                  <p className="text-current">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export const UserImpactLazy = dynamic(
  () => import('@/components/UserImpact'),
  {
    loading: () => (
      <section>
        <div className='relative'>
          <div className="bg-[#F5F6F6] dark:bg-dark-gray h-full flex justify-center items-center">
            <div className="container">
              <div className='grid grid-cols-1 xxl:grid-cols-2'>
                <div></div>
                <div className='flex flex-col gap-5 py-20 xxl:py-52 items-center text-center'>
                  <div className="badge">
                    <p className="text-current">Loading...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export const PricingLazy = dynamic(
  () => import('@/components/Home/Pricing'),
  {
    loading: () => (
      <section id='pricing'>
        <div className='bg-[#F5F6F6] dark:bg-[#121212]'>
          <div className="container">
            <div className='py-20 sm:py-28 flex flex-col gap-9 sm:gap-16'>
              <div className="flex flex-col gap-3 items-center justify-center">
                <div className="badge">
                  <p className="text-current">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

export const CleaningHighlightLazy = dynamic(
  () => import('@/components/Home/CleaningHighlight'),
  {
    loading: () => (
      <section>
        <div className='py-20 sm:py-28 bg-white dark:bg-[#121212]'>
          <div className="container">
            <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
              <div className="flex flex-col gap-3">
                <div className="badge">
                  <p className="text-current">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);

// Lazy load ServiceOfferings (uses embla-carousel)
export const ServiceOfferingsLazy = dynamic(
  () => import('@/components/Home/ServiceOfferings'),
  {
    loading: () => (
      <section>
        <div className='bg-white dark:bg-[#121212] py-20 sm:py-28'>
          <div className="container">
            <div className='flex flex-col gap-10'>
              <div className="flex flex-col gap-3 items-center justify-center">
                <div className="badge">
                  <p className="text-current">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ),
  }
);
