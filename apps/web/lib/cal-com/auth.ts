/**
 * Cal.com API v2 Authentication
 * Supports 3 authentication methods as per official documentation
 * @see https://cal.com/docs/api-reference/v2/introduction#authentication
 */

import type { CalComAuthMethod } from '@/types/cal-com';

/**
 * Authentication configuration
 */
export interface CalComAuthConfig {
  method: CalComAuthMethod;
  apiKey?: string; // For 'apiKey' method (test: cal_*, live: cal_live_*)
  clientId?: string; // For 'oauth' method
  secretKey?: string; // For 'oauth' method
  accessToken?: string; // For 'managedUser' method
}

/**
 * Get authentication headers based on method
 */
export function getAuthHeaders(config: CalComAuthConfig): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'cal-api-version': '2024-06-14', // Required for PATCH/POST/DELETE operations
  };

  switch (config.method) {
    case 'apiKey':
      if (!config.apiKey) {
        throw new Error('Cal.com API Key is required for apiKey authentication');
      }
      headers['Authorization'] = `Bearer ${config.apiKey}`;
      break;

    case 'oauth':
      if (!config.clientId || !config.secretKey) {
        throw new Error('Cal.com OAuth Client ID and Secret Key are required for OAuth authentication');
      }
      headers['x-cal-client-id'] = config.clientId;
      headers['x-cal-secret-key'] = config.secretKey;
      break;

    case 'managedUser':
      if (!config.accessToken) {
        throw new Error('Cal.com Managed User Access Token is required for managedUser authentication');
      }
      headers['Authorization'] = `Bearer ${config.accessToken}`;
      break;

    default:
      throw new Error(`Unknown authentication method: ${config.method}`);
  }

  return headers;
}

/**
 * Get default auth config from environment variables
 * Priority: Managed User Token > OAuth > API Key
 */
export function getDefaultAuthConfig(): CalComAuthConfig {
  // Managed User Token (highest priority)
  if (process.env.CAL_COM_MANAGED_USER_ACCESS_TOKEN) {
    return {
      method: 'managedUser',
      accessToken: process.env.CAL_COM_MANAGED_USER_ACCESS_TOKEN,
    };
  }

  // OAuth Client Credentials
  if (process.env.CAL_COM_OAUTH_CLIENT_ID && process.env.CAL_COM_OAUTH_SECRET_KEY) {
    return {
      method: 'oauth',
      clientId: process.env.CAL_COM_OAUTH_CLIENT_ID,
      secretKey: process.env.CAL_COM_OAUTH_SECRET_KEY,
    };
  }

  // API Key (default for sandbox)
  const apiKey = process.env.CAL_COM_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Cal.com API Key is required. Set CAL_COM_API_KEY in your .env.local file. ' +
      'For sandbox, use a test mode key (starts with cal_)'
    );
  }

  // Validate API key format (warnings removed for production - following Context7 best practices)
  // In production, ensure API key starts with 'cal_live_' prefix
  // In sandbox, API key should start with 'cal_' prefix

  return {
    method: 'apiKey',
    apiKey,
  };
}
