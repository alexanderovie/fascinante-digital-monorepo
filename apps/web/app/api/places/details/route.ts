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
    // Essentials: addressComponents, formattedAddress, location, types
    // Pro: displayName, businessStatus, primaryType, types
    // Enterprise: nationalPhoneNumber, internationalPhoneNumber, rating, userRatingCount, websiteUri, regularOpeningHours
    const fieldMask = [
      'id', // Essentials IDs Only
      'displayName', // Pro
      'formattedAddress', // Essentials
      'addressComponents', // Essentials
      'businessStatus', // Pro
      'primaryType', // Pro - Primary business category
      'types', // Essentials - All categories/types
      'nationalPhoneNumber', // Enterprise
      'internationalPhoneNumber', // Enterprise
      'rating', // Enterprise
      'userRatingCount', // Enterprise
      'websiteUri', // Enterprise
      'geometry', // Essentials (location)
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
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Places API error:', {
        status: response.status,
        error: errorData,
      });

      // Handle specific Google API errors per documentation
      if (response.status === 400 && errorData.error?.message) {
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
      geometry: data.geometry ? {
        location: {
          lat: data.geometry.location?.latitude || 0,
          lng: data.geometry.location?.longitude || 0,
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

    return NextResponse.json(placeDetails);
  } catch (error) {
    console.error('Error in places details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
