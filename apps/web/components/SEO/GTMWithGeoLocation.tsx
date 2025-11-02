import { headers } from 'next/headers';
import Script from 'next/script';

/**
 * Google Tag Manager with Geo-Location Support
 * 
 * Loads GTM conditionally based on user's location.
 * Useful for GDPR compliance (e.g., exclude EU countries).
 * 
 * Uses Vercel's x-vercel-ip-country header to detect user location.
 * 
 * @example
 * // Only load GTM for non-EU countries
 * <GTMWithGeoLocation 
 *   gtmId="GTM-T7SZM386"
 *   excludeCountries={EU_COUNTRY_CODES}
 * />
 * 
 * Reference: https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
 * Last updated: November 2025
 */

interface GTMWithGeoLocationProps {
  gtmId: string;
  excludeCountries?: string[]; // ISO 3166-1 country codes (e.g., ['DE', 'FR', 'ES'])
  includeCountries?: string[]; // If specified, only load in these countries
  dataLayer?: Record<string, unknown>;
}

// EU Country Codes (ISO 3166-1)
export const EU_COUNTRY_CODES = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
];

export async function GTMWithGeoLocation({
  gtmId,
  excludeCountries = [],
  includeCountries = [],
  dataLayer,
}: GTMWithGeoLocationProps) {
  // Get user's country from Vercel header
  const countryCode = (await headers()).get('x-vercel-ip-country') || 'US';

  // Check if should exclude (for GDPR compliance, etc.)
  if (excludeCountries.length > 0 && excludeCountries.includes(countryCode)) {
    return null;
  }

  // Check if should include (whitelist approach)
  if (includeCountries.length > 0 && !includeCountries.includes(countryCode)) {
    return null;
  }

  // Initialize dataLayer
  const initialDataLayer = dataLayer ? JSON.stringify(dataLayer) : '[]';

  return (
    <>
      {/* GTM Head Script - Standard GTM inline script */}
      <Script
        id="gtm-head"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || ${initialDataLayer};
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      {/* GTM Body noscript fallback - Required by GTM */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

