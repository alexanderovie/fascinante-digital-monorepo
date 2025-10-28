/**
 * Google Places API Types
 * TypeScript definitions for Places API (New) - October 2025
 */

export interface PlacePrediction {
  place_id: string;
  place?: string; // Resource name: places/PLACE_ID (from API New)
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{
      offset: number;
      length: number;
    }>;
  };
  types?: string[];
  distance_meters?: number; // Only present when origin parameter is provided in autocomplete request
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  rating?: number;
  user_rating_count?: number;
  website?: string;
  business_status: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
}

export interface AutocompleteResponse {
  predictions: PlacePrediction[];
  suggestions?: unknown[];
}

export interface PlaceDetailsResponse extends PlaceDetails { }
