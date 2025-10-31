/**
 * Cal.com API v2 Types
 * Based on official Cal.com API v2 documentation
 * @see https://cal.com/docs/api-reference/v2
 */

/**
 * Authentication Methods
 */
export type CalComAuthMethod = 'apiKey' | 'oauth' | 'managedUser';

/**
 * API Environment
 */
export type CalComEnvironment = 'sandbox' | 'production';

/**
 * Cal.com API Error Response
 */
export interface CalComError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Base API Response
 */
export interface CalComResponse<T> {
  data?: T;
  error?: CalComError;
}

/**
 * Event Type (simplified)
 */
export interface CalComEventType {
  id: number;
  title: string;
  slug: string;
  description?: string;
  length: number; // in minutes
  locations?: CalComLocation[];
  price?: number;
  currency?: string;
  requiresConfirmation?: boolean;
}

/**
 * Location Type
 */
export interface CalComLocation {
  type: 'integrations:google:meet' | 'integrations:zoom' | 'integrations:jitsi' | 'integrations:daily' | 'integrations:caldav' | 'integrations:apple_calendar' | 'integrations:google_calendar' | 'integrations:outlook_calendar' | 'integrations:office365_calendar' | 'integrations:caldav' | 'integrations:caldav_calendar' | 'integrations:caldav_other';
  displayLocationPublicly?: boolean;
  address?: string;
}

/**
 * Booking Status
 */
export type CalComBookingStatus = 'upcoming' | 'recurring' | 'past' | 'cancelled';

/**
 * Booking (simplified)
 */
export interface CalComBooking {
  id: number;
  uid: string;
  title: string;
  description?: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  status: CalComBookingStatus;
  attendees: CalComAttendee[];
  location?: string;
  eventType?: {
    id: number;
    title: string;
    slug: string;
  };
}

/**
 * Attendee
 */
export interface CalComAttendee {
  email: string;
  name?: string;
  timeZone?: string;
}

/**
 * Schedule
 */
export interface CalComSchedule {
  id: number;
  name: string;
  timeZone: string;
  availability: CalComAvailability[];
}

/**
 * Availability Slot
 */
export interface CalComAvailability {
  days: number[]; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

/**
 * Available Time Slot
 */
export interface CalComAvailableSlot {
  time: string; // ISO 8601
  attendees?: number;
}

/**
 * Create Booking Request
 */
export interface CalComCreateBookingRequest {
  eventTypeId: number;
  start: string; // ISO 8601
  end: string; // ISO 8601
  responses: {
    email: string;
    name: string;
    notes?: string;
    [key: string]: string | undefined;
  };
  timeZone?: string;
  language?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create Booking Response
 */
export interface CalComCreateBookingResponse {
  id: number;
  uid: string;
  bookingUid: string;
}

/**
 * Pagination
 */
export interface CalComPagination {
  total: number;
  page: number;
  perPage: number;
}

/**
 * List Response
 */
export interface CalComListResponse<T> {
  data: T[];
  pagination?: CalComPagination;
}
