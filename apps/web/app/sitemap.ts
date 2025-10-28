import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fascinantedigital.com';

  // Páginas principales (sin prefijo de locale, se agrega en el map)
  const routes = [
    '',
    '/about-us',
    '/services',
    '/contact-us',
    '/documentation',
    '/privacy-policy',
    '/terms-and-conditions',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/profile',
  ];

  // Generar entradas para cada locale con hreflang
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${locale}${route}`;
      
      // Crear objeto alternates con todas las versiones de idioma
      const alternates: Record<string, string> = {};
      locales.forEach((loc) => {
        alternates[loc] = `${baseUrl}/${loc}${route}`;
      });
      // x-default apunta al idioma por defecto
      alternates['x-default'] = `${baseUrl}/en${route}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route.includes('contact') ? 0.9 : 0.8,
        alternates: {
          languages: alternates as Record<string, string>,
        },
      });
    });
  });

  return sitemapEntries;
}
