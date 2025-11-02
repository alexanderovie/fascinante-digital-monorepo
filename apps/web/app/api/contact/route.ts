/**
 * Contact Form API Route
 * Protected with BotID and honeypot validation
 *
 * References:
 * - BotID: https://vercel.com/docs/botid
 * - Best practices: https://vercel.com/docs/bot-management
 */

import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';
import { HONEYPOT_FIELD_NAME } from '@/lib/bot-protection';

/**
 * POST /api/contact
 * Protected contact form endpoint with multi-layer bot protection
 */
export async function POST(request: NextRequest) {
  try {
    // Layer 1: Rate limiting (prevent abuse)
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, 10, 3600000); // 10 requests per hour

    if (rateLimit.rateLimited) {
      return NextResponse.json(
        {
          success: false,
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

    // Parse request body
    const body = await request.json();

    // Layer 2: Honeypot check (simple bot detection)
    if (body[HONEYPOT_FIELD_NAME] && body[HONEYPOT_FIELD_NAME] !== '') {
      // Honeypot field was filled - likely a bot
      // Logging removed for production (following Context7 best practices)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form submission',
        },
        { status: 400 }
      );
    }

    // Layer 3: BotID verification (sophisticated bot detection)
    try {
      const { isBot } = await checkBotId();
      if (isBot) {
        // Bot detected - logging removed for production
        return NextResponse.json(
          {
            success: false,
            error: 'Bot detected',
            message: 'Please use a real browser to submit the form.',
          },
          { status: 403 }
        );
      }
    } catch {
      // If BotID check fails, continue with submission (graceful degradation)
      // BotID may not be fully configured yet - logging removed for production
    }

    // Layer 4: Basic validation
    const { name, email, message, service, phone } = body as {
      name?: string;
      email?: string;
      phone?: string;
      service?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name, email, and message are required.',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs (basic protection)
    const sanitizedName = name.trim().substring(0, 200);
    const sanitizedEmail = email.trim().substring(0, 254);
    const sanitizedMessage = message.trim().substring(0, 5000);

    // Forward to Cloudflare Worker API
    const workerApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.fascinantedigital.com';
    const response = await fetch(`${workerApiUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        service: service || 'Contact Form',
        phone: phone?.trim().substring(0, 20),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to send message');
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        ...data,
      },
      { status: 200 }
    );

  } catch (error) {
    // Error handling - logging removed for production (following Context7 best practices)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
