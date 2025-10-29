/**
 * Simple in-memory rate limiter for Route Handlers
 *
 * For production, consider using Redis-based solution (@upstash/ratelimit)
 * This implementation is suitable for single-server deployments
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for multi-server)
const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Clean up old entries periodically (prevent memory leak)
 */
function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupOldEntries, 5 * 60 * 1000);

/**
 * Check if request should be rate limited
 *
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with rateLimited boolean and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minute default
): { rateLimited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitMap.get(key);

  // No record or window expired - create new
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      rateLimited: false,
      remaining: limit - 1,
      resetTime: now + windowMs,
    };
  }

  // Check if limit exceeded
  if (record.count >= limit) {
    return {
      rateLimited: true,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  return {
    rateLimited: false,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get client IP from NextRequest
 * Checks various headers (X-Forwarded-For, X-Real-IP) for proxy compatibility
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback (may not work in all environments)
  return 'unknown';
}
