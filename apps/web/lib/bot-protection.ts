/**
 * Bot Protection Utilities
 * Multi-layer protection against bots and spam
 *
 * References:
 * - BotID: https://vercel.com/docs/botid
 * - Best practices: https://vercel.com/docs/bot-management
 */

import { checkBotId } from 'botid/server';

/**
 * Verify if request is from a bot using Vercel BotID
 * Returns true if bot is detected (should block)
 */
export async function isBot(): Promise<boolean> {
  try {
    const { isBot } = await checkBotId();
    return isBot;
  } catch {
    // If BotID fails, err on the side of caution and allow (to avoid false positives)
    // In production with proper setup, this should rarely fail
    // Error logging removed for production (following Context7 best practices)
    return false;
  }
}

/**
 * Honeypot field name - hidden field that bots will fill but humans won't
 * IMPORTANT: Keep this name generic to avoid detection
 */
export const HONEYPOT_FIELD_NAME = 'website';

/**
 * Check if honeypot field was filled (indicates bot)
 * @param formData - FormData or object with form fields
 */
export function checkHoneypot(formData: FormData | Record<string, string>): boolean {
  const honeypotValue = formData instanceof FormData
    ? formData.get(HONEYPOT_FIELD_NAME)
    : formData[HONEYPOT_FIELD_NAME];

  // If honeypot field has any value, it's likely a bot
  return honeypotValue !== null && honeypotValue !== '' && honeypotValue !== undefined;
}

/**
 * Validate form submission against bots
 * Returns error message if bot detected, null if valid
 */
export async function validateBotProtection(formData: FormData): Promise<string | null> {
  // Layer 1: Honeypot check (fast, client-side)
  if (checkHoneypot(formData)) {
    return 'Invalid form submission';
  }

  // Layer 2: BotID check (server-side, sophisticated)
  const botDetected = await isBot();
  if (botDetected) {
    return 'Bot detected. Please use a real browser.';
  }

  return null; // Valid submission
}
