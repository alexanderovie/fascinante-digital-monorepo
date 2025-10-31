/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

const getApiUrl = (): string => {
  // Use environment variable if available
  if (typeof window !== 'undefined') {
    // Client-side: check for environment variable
    return process.env.NEXT_PUBLIC_API_URL || 'https://api.fascinantedigital.com';
  }

  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://api.fascinantedigital.com';
};

/**
 * Base URL for the API
 * Use this constant throughout the application instead of hardcoding URLs
 */
export const API_BASE_URL = getApiUrl();

/**
 * Helper function to build API endpoint URLs
 */
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Pre-defined API endpoints
 */
export const API_ENDPOINTS = {
  contact: apiUrl('/api/contact'),
  audit: {
    free: apiUrl('/api/audit/free'),
  },
  company: apiUrl('/api/company'),
  services: apiUrl('/api/services'),
  health: apiUrl('/api/health'),
  places: {
    autocomplete: '/api/places/autocomplete',
    details: '/api/places/details',
  },
  dataforseo: {
    baseUrl: 'https://data.fascinantedigital.com/v3',
    rankedKeywords: '/dataforseo_labs/google/ranked_keywords/live.ai',
    domainRank: '/dataforseo_labs/google/domain_rank_overview/live.ai',
    keywordIdeas: '/dataforseo_labs/google/keyword_ideas/live.ai',
    onPageTask: '/on_page/task_post',
    onPageGet: '/on_page/task_get',
    keywordOverview: '/dataforseo_labs/google/keyword_overview/live.ai',
  },
  audit: {
    generate: '/api/audit/generate',
    results: (auditId: string) => `/api/audit/results/${auditId}`,
  },
  calCom: {
    baseUrl: process.env.CAL_COM_API_URL || 'https://api.cal.com/v2',
    eventTypes: '/event-types',
    bookings: '/bookings',
    schedules: '/schedules',
    slots: (eventTypeId: number, startDate: string, endDate: string) =>
      `/slots/event-types/${eventTypeId}?startDate=${startDate}&endDate=${endDate}`,
  },
} as const;
