import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fascinantedigital.com';
  
  // Páginas principales
  const routes = [
    '',
    '/about-us', 
    '/services',
    '/contact-us',
    '/documentation',
    '/privacy-policy',
    '/terms-of-service'
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : route.includes('contact') ? 0.9 : 0.8,
  }));
}
