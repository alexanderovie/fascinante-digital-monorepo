import { fetchWithTimeout } from '@/lib/fetch-with-timeout';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Places Details API Route (New)
 * Server-side proxy to get full place details by place_id
 *
 * @see https://developers.google.com/maps/documentation/places/web-service/place-details
 * Documentation: October 2025
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 20 requests per minute per IP (less expensive than autocomplete)
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 20, 60000); // 20 req/min

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
            'X-RateLimit-Limit': '20',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('place_id');
    const sessionToken = searchParams.get('sessionToken'); // Optional for billing optimization
    const languageCode = searchParams.get('languageCode') || 'es';

    // Validate place_id
    if (!placeId || typeof placeId !== 'string') {
      return NextResponse.json(
        { error: 'place_id parameter is required' },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_PLACES_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Places API is not configured' },
        { status: 500 }
      );
    }

    // Build field mask - only request what we need (best practice per docs)
    // According to official Google Places API (New) documentation (Oct 2025)
    // Essentials IDs Only: id, name, photos, attributions, moved_place, moved_place_id
    // Essentials: addressComponents, formattedAddress, location, types, viewport, plusCode, postalAddress, shortFormattedAddress, adrFormatAddress
    // Pro: displayName, businessStatus, primaryType, primaryTypeDisplayName, googleMapsUri, iconBackgroundColor, iconMaskBaseUri, utcOffsetMinutes
    // Enterprise: nationalPhoneNumber, internationalPhoneNumber, rating, userRatingCount, websiteUri, priceLevel, priceRange, regularOpeningHours, currentOpeningHours
    const fieldMask = [
      'id', // Essentials IDs Only
      'displayName', // Pro - Business name (text format)
      'formattedAddress', // Essentials - Full address
      'addressComponents', // Essentials - Address parts
      'location', // Essentials - lat/lng coordinates (NOT geometry!)
      'businessStatus', // Pro - OPERATIONAL, CLOSED_PERMANENTLY, etc.
      'primaryType', // Pro - Primary business category (e.g., "restaurant", "store")
      'primaryTypeDisplayName', // Pro - Human-readable category name
      'types', // Essentials - All categories/types array
      'nationalPhoneNumber', // Enterprise - Phone number
      'internationalPhoneNumber', // Enterprise - International phone format
      'rating', // Enterprise - Rating (1-5)
      'userRatingCount', // Enterprise - Number of reviews
      'websiteUri', // Enterprise - Business website URL
    ].join(',');

    // Build resource name according to official API format
    // Discovery doc pattern: ^places/[^/]+$
    // Format: places/{place_id}
    const placeResourceName = placeId.startsWith('places/')
      ? placeId
      : `places/${placeId}`;

    // Build URL with optional parameters
    // Official endpoint: GET /v1/places/{place_id} (where name = places/{place_id})
    const url = new URL(`https://places.googleapis.com/v1/${placeResourceName}`);
    if (languageCode) {
      url.searchParams.set('languageCode', languageCode);
    }
    if (sessionToken) {
      url.searchParams.set('sessionToken', sessionToken);
    }
    if (searchParams.get('regionCode')) {
      url.searchParams.set('regionCode', searchParams.get('regionCode')!);
    }

    // Call Google Places API (New) - GET /v1/places/{place_id}
    // According to discovery doc: path "v1/{+name}" where name = places/{place_id}
    // With 10 second timeout to prevent hanging requests
    const response = await fetchWithTimeout(
      url.toString(),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': fieldMask,
        },
      },
      10000 // 10 seconds timeout
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Places API error:', {
        status: response.status,
        error: errorData,
        details: errorData.error?.details,
        fieldMask,
      });

      // Handle specific Google API errors per documentation
      if (response.status === 400 && errorData.error?.message) {
        // Log details array to see which field is invalid
        if (errorData.error?.details) {
          console.error('Invalid field details:', JSON.stringify(errorData.error.details, null, 2));
        }
        return NextResponse.json(
          { error: errorData.error.message },
          { status: 400 }
        );
      }

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Place not found. The place_id may be invalid or the place may have moved.' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch place details' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform Google Places API (New) format to our PlaceDetails format
    // Note: The API returns "location" (lat/lng) not "geometry" structure
    const placeDetails = {
      place_id: data.id || placeId,
      name: data.displayName?.text || '',
      formatted_address: data.formattedAddress || '',
      formatted_phone_number: data.nationalPhoneNumber || data.internationalPhoneNumber || undefined,
      international_phone_number: data.internationalPhoneNumber || undefined,
      rating: data.rating || undefined,
      user_rating_count: data.userRatingCount || undefined,
      website: data.websiteUri || undefined,
      business_status: data.businessStatus || 'OPERATIONAL',
      primary_type: data.primaryType || undefined, // Primary category (e.g., "restaurant", "store")
      types: data.types || undefined, // All types/categories
      geometry: data.location ? {
        location: {
          lat: data.location.latitude || data.location.lat || 0,
          lng: data.location.longitude || data.location.lng || 0,
        },
      } : undefined,
      address_components: data.addressComponents?.map((component: {
        longText: string;
        shortText: string;
        types: string[];
      }) => ({
        long_name: component.longText || '',
        short_name: component.shortText || '',
        types: component.types || [],
      })) || undefined,
      opening_hours: data.regularOpeningHours ? {
        open_now: undefined, // Not available in New API
        weekday_text: data.regularOpeningHours.weekdayDescriptions || undefined,
      } : undefined,
    };

    return NextResponse.json(
      placeDetails,
      {
        headers: {
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          // CDN cache (Vercel) con SWR; navegador sin caché persistente
          'Cache-Control': 'max-age=0',
          'CDN-Cache-Control': 's-maxage=3600, stale-while-revalidate=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error in places details:', error);

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
