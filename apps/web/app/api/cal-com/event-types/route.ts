/**
 * Cal.com API v2 - Event Types Endpoint
 * GET /api/cal-com/event-types
 * Lists all event types available for booking
 *
 * @see https://cal.com/docs/api-reference/v2/event-types/get-all-event-types
 */

import { getCalComClient } from '@/lib/cal-com/client';
import type { CalComEventType, CalComListResponse } from '@/types/cal-com';
import { NextResponse } from 'next/server';

/**
 * GET /api/cal-com/event-types
 * Get all event types
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Optional query parameters
    const params: Record<string, string | number | boolean> = {};

    if (searchParams.get('page')) {
      params.page = parseInt(searchParams.get('page')!);
    }
    if (searchParams.get('perPage')) {
      params.perPage = parseInt(searchParams.get('perPage')!);
    }

    const client = getCalComClient();
    const eventTypes = await client.get<CalComListResponse<CalComEventType>>(
      '/event-types',
      params
    );

    return NextResponse.json(eventTypes, {
      headers: {
        'Cache-Control': 'max-age=0',
        'CDN-Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Cal.com Event Types API Error:', error);

    const message = error instanceof Error ? error.message : 'Failed to fetch event types';

    return NextResponse.json(
      { error: { message, code: 'CAL_COM_API_ERROR' } },
      { status: 500 }
    );
  }
}
