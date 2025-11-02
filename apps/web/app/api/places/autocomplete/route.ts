import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Places Autocomplete API Route (New)
 * Server-side proxy to protect API key and implement rate limiting
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/autocomplete
 * Documentation: October 2025
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute per IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 10, 60000); // 10 req/min

    if (rateLimit.rateLimited) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          resetTime: rateLimit.resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');
    const sessionToken = searchParams.get('sessionToken'); // Optional for billing optimization
    const languageCode = searchParams.get('languageCode') || 'es'; // Default to Spanish
    const regionCode = searchParams.get('regionCode'); // Optional region code (CLDR format)

    // Validate input
    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input parameter is required' },
        { status: 400 }
      );
    }

    if (input.length < 3) {
      return NextResponse.json(
        { error: 'Input must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      // API key not configured - logging removed for production
      return NextResponse.json(
        { error: 'Places API is not configured' },
        { status: 500 }
      );
    }

    // Build request body according to official docs (October 2025)
    const requestBody: {
      input: string;
      locationBias?: {
        circle: {
          center: { latitude: number; longitude: number };
          radius: number;
        };
      };
      includedPrimaryTypes?: string[];
      languageCode?: string;
      sessionToken?: string;
      regionCode?: string;
    } = {
      input,
      locationBias: {
        circle: {
          center: {
            latitude: 28.5383, // Tampa, FL default
            longitude: -81.3792,
          },
          radius: 50000.0, // 50km radius
        },
      },
      includedPrimaryTypes: ['establishment'],
      languageCode, // Use requested language or default to Spanish
    };

    // Add session token if provided (for billing optimization)
    if (sessionToken) {
      requestBody.sessionToken = sessionToken;
    }

    // Add region code if provided (CLDR format, e.g., 'us', 'mx')
    // Affects result formatting and regional biasing per discovery doc
    if (regionCode) {
      requestBody.regionCode = regionCode;
    }

    // Call Google Places API (New) - POST /v1/places:autocomplete
    // With 10 second timeout to prevent hanging requests
    const response = await fetchWithTimeout(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify(requestBody),
      },
      10000 // 10 seconds timeout
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Google Places API error - logging removed for production

      // Handle specific Google API errors
      if (response.status === 400 && errorData.error?.message) {
        return NextResponse.json(
          { error: errorData.error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch places suggestions' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform Google Places API (New) response format
    // Official format: suggestions[].placePrediction
    // Transform to: predictions[] with our PlacePrediction interface
    const predictions = (data.suggestions || [])
      .filter((suggestion: { placePrediction?: unknown }) => suggestion.placePrediction) // Only place predictions
      .map((suggestion: {
        placePrediction: {
          placeId: string;
          place: string; // Resource name: places/PLACE_ID
          text: { text: string; matches?: Array<{ startOffset?: number; endOffset?: number }> };
          structuredFormat: {
            mainText: { text: string; matches?: Array<{ startOffset?: number; endOffset?: number }> };
            secondaryText: { text: string };
          };
          types?: string[];
          distanceMeters?: number; // Only if origin is provided
        };
      }) => ({
        place_id: suggestion.placePrediction.placeId,
        place: suggestion.placePrediction.place, // Include resource name
        description: suggestion.placePrediction.text.text,
        structured_formatting: {
          main_text: suggestion.placePrediction.structuredFormat.mainText.text,
          secondary_text: suggestion.placePrediction.structuredFormat.secondaryText.text,
        },
        types: suggestion.placePrediction.types || [],
        distance_meters: suggestion.placePrediction.distanceMeters, // Optional distance
      }));

    return NextResponse.json(
      {
        predictions,
      },
      {
        headers: {
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    // Error handling - logging removed for production

    // Handle timeout errors specifically
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timeout - Google Places API took too long to respond' },
        { status: 504 }
      );
    }

    // Generic error for client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
