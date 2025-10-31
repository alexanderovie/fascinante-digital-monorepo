/**
 * Cal.com API v2 Client
 * Elite TypeScript client with error handling, retry logic, and rate limiting
 * @see https://cal.com/docs/api-reference/v2
 */

import type { CalComAuthMethod, CalComListResponse, CalComResponse } from '@/types/cal-com';
import { getAuthHeaders, getDefaultAuthConfig, type CalComAuthConfig } from './auth';
import { buildApiUrl, parseCalComError, validateResponse } from './utils';

/**
 * Client configuration
 */
export interface CalComClientConfig {
  auth?: CalComAuthConfig;
  baseUrl?: string;
  timeout?: number; // milliseconds
  retries?: number;
  retryDelay?: number; // milliseconds
}

/**
 * Request options
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

/**
 * Cal.com API v2 Client
 */
export class CalComClient {
  private authConfig: CalComAuthConfig;
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: CalComClientConfig = {}) {
    this.authConfig = config.auth || getDefaultAuthConfig();
    this.baseUrl = config.baseUrl || buildApiUrl('');
    this.timeout = config.timeout || 30000; // 30 seconds
    this.retries = config.retries ?? 2;
    this.retryDelay = config.retryDelay || 1000;
  }

  /**
   * Make authenticated request to Cal.com API
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', body, params, signal } = options;

    // Build URL with query parameters
    const url = new URL(this.baseUrl.replace(/\/$/, '') + endpoint);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Get auth headers
    const headers = getAuthHeaders(this.authConfig);

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      signal: signal || this.createTimeoutSignal(),
    };

    // Add body for POST/PATCH requests
    if (body && (method === 'POST' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(body);
    }

    // Retry logic
    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url.toString(), requestOptions);
        const data = await response.json() as CalComResponse<T> | CalComListResponse<T>;

        // Handle Cal.com error response format
        if (!response.ok) {
          const error = parseCalComError(data);
          throw new Error(error.message || `Cal.com API error: ${response.status} ${response.statusText}`);
        }

        // Check for error in response data structure
        if (data && typeof data === 'object' && 'error' in data) {
          const error = (data as CalComResponse<never>).error;
          throw new Error(error?.message || 'Cal.com API error');
        }

        // Return data (handle both single and list responses)
        let result: T;

        if (Array.isArray(data)) {
          // Direct array response
          result = data as T;
        } else if (data && typeof data === 'object' && 'data' in data) {
          // CalComResponse or CalComListResponse format
          result = (data as CalComResponse<T> | CalComListResponse<T>).data as T;
        } else {
          // Direct response
          result = data as T;
        }

        return validateResponse(response, result);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (error instanceof Error && error.message.includes('4')) {
          const statusMatch = error.message.match(/\b(\d{3})\b/);
          const status = statusMatch ? parseInt(statusMatch[1]) : 0;

          if (status >= 400 && status < 500 && status !== 429) {
            throw lastError;
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.retries) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError || new Error('Cal.com API request failed after retries');
  }

  /**
   * Create abort signal for timeout
   */
  private createTimeoutSignal(): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller.signal;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, params });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: unknown, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, params });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', params });
  }

  /**
   * Update authentication config
   */
  setAuth(config: CalComAuthConfig): void {
    this.authConfig = config;
  }

  /**
   * Get current authentication method
   */
  getAuthMethod(): CalComAuthMethod {
    return this.authConfig.method;
  }
}

/**
 * Default client instance (singleton)
 */
let defaultClient: CalComClient | null = null;

/**
 * Get default Cal.com client instance
 */
export function getCalComClient(config?: CalComClientConfig): CalComClient {
  if (!defaultClient || config) {
    defaultClient = new CalComClient(config);
  }
  return defaultClient;
}
