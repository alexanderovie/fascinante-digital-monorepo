/**
 * Cal.com API v2 Utilities
 * Helper functions for API interactions
 */

import type { CalComEnvironment } from '@/types/cal-com';

/**
 * Get Cal.com API base URL
 */
export function getCalComApiUrl(): string {
  const env = (process.env.CAL_COM_ENVIRONMENT || 'sandbox') as CalComEnvironment;

  if (process.env.CAL_COM_API_URL) {
    return process.env.CAL_COM_API_URL;
  }

  // Default URLs based on environment
  return env === 'production'
    ? 'https://api.cal.com/v2'
    : 'https://api.cal.com/v2'; // Sandbox uses same URL, different API keys
}

/**
 * Build full API endpoint URL
 */
export function buildApiUrl(endpoint: string): string {
  const baseUrl = getCalComApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Parse Cal.com API error response
 */
export function parseCalComError(error: unknown): { message: string; code?: string } {
  if (typeof error === 'string') {
    return { message: error };
  }

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;
    return {
      message: (err.message as string) || 'Unknown Cal.com API error',
      code: err.code as string | undefined,
    };
  }

  return { message: 'Unknown error occurred' };
}

/**
 * Validate API response
 */
export function validateResponse<T>(response: Response, data: T): T {
  if (!response.ok) {
    throw new Error(`Cal.com API error: ${response.status} ${response.statusText}`);
  }

  return data;
}

/**
 * Format date to ISO 8601 (required by Cal.com)
 */
export function formatToISO(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return date.toISOString();
}

/**
 * Check if API key is in test mode
 */
export function isTestModeApiKey(apiKey: string): boolean {
  return apiKey.startsWith('cal_') && !apiKey.startsWith('cal_live_');
}

/**
 * Check if API key is in live mode
 */
export function isLiveModeApiKey(apiKey: string): boolean {
  return apiKey.startsWith('cal_live_');
}
