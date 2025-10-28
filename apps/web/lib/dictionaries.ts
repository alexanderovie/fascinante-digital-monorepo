/**
 * Dictionary Helpers
 * Centralized dictionary loading utilities
 * Re-exports from app/[locale]/dictionaries for consistent import paths
 *
 * Usage:
 *   import { getDictionary } from '@/lib/dictionaries';
 *
 * This ensures all pages use the same import path regardless of nesting level
 */

import 'server-only'

// Re-export from the actual dictionaries module
export { getDictionary, type Dictionary } from '@/app/[locale]/dictionaries'
