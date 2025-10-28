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
} as const;

