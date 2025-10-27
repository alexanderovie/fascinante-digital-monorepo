import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: ['/dashboard/', '/api/', '/private/']
      }
    ],
    sitemap: 'https://app.fascinantedigital.com/sitemap.xml',
    host: 'https://app.fascinantedigital.com'
  };
}
