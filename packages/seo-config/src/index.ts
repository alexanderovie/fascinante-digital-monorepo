import { Metadata } from "next";

// **CONFIGURACIÓN ELITE DE SEO PARA FASCINANTE DIGITAL**

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface AppConfig {
  name: string;
  description: string;
  url: string;
  domain: string;
  logo: string;
  favicon: string;
  themeColor: string;
  backgroundColor: string;
  twitterHandle?: string;
  facebookPage?: string;
  linkedinPage?: string;
  instagramHandle?: string;
}

// **CONFIGURACIONES POR APP**
export const APP_CONFIGS: Record<string, AppConfig> = {
  web: {
    name: "Fascinante Digital",
    description: "Agencia de marketing digital especializada en estrategias personalizadas que generan resultados reales.",
    url: "https://fascinantedigital.com",
    domain: "fascinantedigital.com",
    logo: "/fascinante-digital-logo-main.png",
    favicon: "/favicon.ico",
    themeColor: "#6366f1", // indigo-500
    backgroundColor: "#ffffff",
    twitterHandle: "@fascinantedig",
    facebookPage: "fascinante-digital",
    linkedinPage: "fascinante-digital",
    instagramHandle: "@fascinantedigital"
  },
  app: {
    name: "Fascinante Digital Dashboard",
    description: "Panel de control avanzado para gestión de marketing digital y automatización de procesos.",
    url: "https://app.fascinantedigital.com",
    domain: "app.fascinantedigital.com",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    themeColor: "#6366f1",
    backgroundColor: "#ffffff"
  },
  api: {
    name: "Fascinante Digital API",
    description: "API REST para servicios de marketing digital y automatización empresarial.",
    url: "https://api.fascinantedigital.com",
    domain: "api.fascinantedigital.com",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    themeColor: "#6366f1",
    backgroundColor: "#ffffff"
  }
};

// **FUNCIÓN PRINCIPAL DE GENERACIÓN DE METADATA**
export function generateMeta(config: SEOConfig, appName: keyof typeof APP_CONFIGS = 'web'): Metadata {
  const appConfig = APP_CONFIGS[appName];

  if (!appConfig) {
    throw new Error(`App config not found for: ${appName}`);
  }

  const fullTitle = config.title ? `${config.title} - ${appConfig.name}` : appConfig.name;
  const description = config.description || appConfig.description;
  const canonical = config.canonical;
  const image = config.image || `${appConfig.url}/og-image.jpg`;

  return {
    title: fullTitle,
    description: description,
    keywords: config.keywords,
    authors: config.author ? [{ name: config.author }] : [{ name: "Fascinante Digital Team" }],

    metadataBase: new URL(appConfig.url),

    alternates: canonical ? {
      canonical: canonical
    } : undefined,

    openGraph: {
      type: config.type || 'website',
      title: fullTitle,
      description: description,
      url: canonical ? `${appConfig.url}${canonical}` : appConfig.url,
      siteName: appConfig.name,
      locale: config.locale || 'es_ES',
      alternateLocale: config.alternateLocales || ['en_US'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
      publishedTime: config.publishedTime,
      modifiedTime: config.modifiedTime,
      section: config.section,
      tags: config.tags,
    },

    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description,
      images: [image],
      creator: appConfig.twitterHandle,
      site: appConfig.twitterHandle,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },

    category: config.section || 'Marketing Digital',
  };
}

// **FUNCIÓN PARA GENERAR MANIFEST PWA**
export function generateManifest(appName: keyof typeof APP_CONFIGS = 'web') {
  const appConfig = APP_CONFIGS[appName];

  if (!appConfig) {
    throw new Error(`App config not found for: ${appName}`);
  }

  return {
    name: appConfig.name,
    short_name: appConfig.name.split(' ')[0], // "Fascinante"
    description: appConfig.description,
    start_url: "/",
    display: "standalone" as const,
    background_color: appConfig.backgroundColor,
    theme_color: appConfig.themeColor,
    orientation: "portrait-primary" as const,
    scope: "/",
    lang: "es-ES",
    dir: "ltr" as const,
    categories: ["business", "marketing", "productivity"],
    screenshots: [
      {
        src: "/screenshots/desktop-1.jpg",
        sizes: "1280x720",
        type: "image/jpeg",
        form_factor: "wide"
      },
      {
        src: "/screenshots/mobile-1.jpg",
        sizes: "390x844",
        type: "image/jpeg",
        form_factor: "narrow"
      }
    ],
    icons: [
      {
        src: "/icons/icon-16x16.png",
        sizes: "16x16",
        type: "image/png"
      },
      {
        src: "/icons/icon-32x32.png",
        sizes: "32x32",
        type: "image/png"
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}

// **CONFIGURACIONES DE FAVICON COMPLETAS**
export const FAVICON_CONFIG = {
  // Favicon tradicional
  favicon: "/favicon.ico",

  // Apple Touch Icons
  appleTouchIcon: "/icons/apple-touch-icon.png",
  appleTouchIcon57: "/icons/apple-touch-icon-57x57.png",
  appleTouchIcon60: "/icons/apple-touch-icon-60x60.png",
  appleTouchIcon72: "/icons/apple-touch-icon-72x72.png",
  appleTouchIcon76: "/icons/apple-touch-icon-76x76.png",
  appleTouchIcon114: "/icons/apple-touch-icon-114x114.png",
  appleTouchIcon120: "/icons/apple-touch-icon-120x120.png",
  appleTouchIcon144: "/icons/apple-touch-icon-144x144.png",
  appleTouchIcon152: "/icons/apple-touch-icon-152x152.png",
  appleTouchIcon180: "/icons/apple-touch-icon-180x180.png",

  // PNG Icons
  icon16: "/icons/icon-16x16.png",
  icon32: "/icons/icon-32x32.png",
  icon96: "/icons/icon-96x96.png",
  icon192: "/icons/icon-192x192.png",
  icon512: "/icons/icon-512x512.png",

  // Microsoft Tiles
  msTileColor: "#6366f1",
  msTileImage: "/icons/ms-tile-144x144.png",

  // Safari Pinned Tab
  safariPinnedTab: "/icons/safari-pinned-tab.svg",
  safariPinnedTabColor: "#6366f1"
};

// **SCHEMAS ESTRUCTURADOS JSON-LD**
export function generateOrganizationSchema(appName: keyof typeof APP_CONFIGS = 'web') {
  const appConfig = APP_CONFIGS[appName];

  if (!appConfig) {
    throw new Error(`App config not found for: ${appName}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fascinante Digital",
    "description": appConfig.description,
    "url": appConfig.url,
    "logo": `${appConfig.url}${appConfig.logo}`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-023-903-10",
      "contactType": "customer service",
      "availableLanguage": ["Spanish", "English"]
    },
    "sameAs": [
      appConfig.facebookPage ? `https://facebook.com/${appConfig.facebookPage}` : '',
      appConfig.twitterHandle ? `https://twitter.com/${appConfig.twitterHandle}` : '',
      appConfig.linkedinPage ? `https://linkedin.com/company/${appConfig.linkedinPage}` : '',
      appConfig.instagramHandle ? `https://instagram.com/${appConfig.instagramHandle}` : ''
    ].filter(Boolean),
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US",
      "addressRegion": "FL",
      "addressLocality": "Tampa"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5"
    }
  };
}

export function generateWebsiteSchema(appName: keyof typeof APP_CONFIGS = 'web') {
  const appConfig = APP_CONFIGS[appName];

  if (!appConfig) {
    throw new Error(`App config not found for: ${appName}`);
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": appConfig.name,
    "description": appConfig.description,
    "url": appConfig.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${appConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fascinante Digital",
      "logo": `${appConfig.url}${appConfig.logo}`
    }
  };
}

// **HELPER PARA METATAGS PERSONALIZADOS**
export function generateCustomMetaTags(appName: keyof typeof APP_CONFIGS = 'web') {
  const appConfig = APP_CONFIGS[appName];

  if (!appConfig) {
    throw new Error(`App config not found for: ${appName}`);
  }

  return [
    // Viewport
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },

    // Theme Color
    { name: 'theme-color', content: appConfig.themeColor },
    { name: 'msapplication-TileColor', content: appConfig.themeColor },

    // Apple Meta Tags
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: appConfig.name },

    // Microsoft Meta Tags
    { name: 'msapplication-config', content: '/browserconfig.xml' },

    // PWA Meta Tags
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'application-name', content: appConfig.name },

    // SEO Meta Tags
    { name: 'author', content: 'Fascinante Digital Team' },
    { name: 'creator', content: 'Fascinante Digital' },
    { name: 'publisher', content: 'Fascinante Digital' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'bingbot', content: 'index, follow' },

    // Social Meta Tags
    { property: 'fb:app_id', content: process.env.FACEBOOK_APP_ID || '' },

    // Security Headers
    { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
    { httpEquiv: 'Content-Type', content: 'text/html; charset=utf-8' },
  ];
}
