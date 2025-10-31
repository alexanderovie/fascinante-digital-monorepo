/**
 * Cal.com API v2 - Barrel Export
 * Centralized exports for easy importing
 */

export { CalComClient, getCalComClient } from './client';
export type { CalComClientConfig } from './client';

export { getAuthHeaders, getDefaultAuthConfig } from './auth';
export type { CalComAuthConfig } from './auth';

export {
  buildApiUrl, formatToISO, getCalComApiUrl, isLiveModeApiKey, isTestModeApiKey, parseCalComError,
  validateResponse
} from './utils';

// Re-export types for convenience
export type {
  CalComAuthMethod, CalComAvailableSlot, CalComBooking, CalComCreateBookingRequest,
  CalComCreateBookingResponse, CalComEnvironment, CalComError, CalComEventType, CalComListResponse,
  CalComResponse, CalComSchedule
} from '@/types/cal-com';
