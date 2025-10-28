/**
 * Smart Title Case function for Spanish and English
 * Capitalizes important words (nouns, verbs, adjectives) while keeping
 * articles, prepositions, and conjunctions lowercase.
 */

// Spanish stop words (artículos, preposiciones, conjunciones, pronombres posesivos) - en minúsculas
const SPANISH_STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'en', 'por', 'para', 'con', 'sin', 'sobre', 'bajo', 'entre', 'hasta', 'desde', 'hacia', 'contra', 'mediante', 'durante', 'tras',
  'y', 'o', 'ni', 'pero', 'aunque', 'si', 'que', 'como', 'cuando', 'donde', 'mientras', 'sin embargo',
  'al', 'del', 'a', 'lo',
  'tu', 'tus', 'su', 'sus', 'mi', 'mis', 'nuestro', 'nuestra', 'nuestros', 'nuestras'
]);

// English stop words (articles, prepositions, conjunctions)
const ENGLISH_STOP_WORDS = new Set([
  'a', 'an', 'the',
  'in', 'on', 'at', 'for', 'with', 'from', 'to', 'of', 'by', 'as', 'into', 'onto', 'upon', 'over', 'under', 'through', 'during', 'before', 'after', 'between', 'among',
  'and', 'or', 'nor', 'but', 'yet', 'so', 'if', 'whether', 'because', 'since', 'although', 'though', 'while', 'where', 'when', 'how', 'why',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having'
]);

/**
 * Detects if text is Spanish based on common Spanish words
 */
function isSpanish(text: string): boolean {
  const spanishIndicators = /\b(el|la|los|las|con|del|para|por|que|de|en|tu|su|sus|nuestro|nuestra|es|son|están)\b/i;
  return spanishIndicators.test(text);
}

/**
 * Capitalizes the first letter of a word while preserving the rest
 */
function capitalize(word: string): string {
  if (!word) return word;
  // Preserve existing capitalization in the middle of words (e.g., "EE.UU.")
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Smart Title Case: Capitalizes important words based on their position and type
 *
 * Rules:
 * - First word is always capitalized
 * - Last word is always capitalized
 * - Important words (nouns, verbs, adjectives) are capitalized
 * - Stop words (articles, prepositions, conjunctions) are lowercase (except if first/last)
 *
 * @param text - Text to convert to title case
 * @returns Text in title case format
 */
export function toTitleCase(text: string): string {
  if (!text) return text;

  // Remove trailing period if exists (for headings)
  text = text.trim().replace(/\.$/, '');

  const isSpanishText = isSpanish(text);
  const stopWords = isSpanishText ? SPANISH_STOP_WORDS : ENGLISH_STOP_WORDS;

  const words = text.split(/\s+/);

  return words
    .map((word, index) => {
      // Clean word (remove punctuation for checking, but preserve it)
      const cleanWord = word.replace(/[.,!?;:¿¡]/g, '').toLowerCase().trim();

      // Always capitalize first and last word
      if (index === 0 || index === words.length - 1) {
        return capitalize(word);
      }

      // Capitalize if not a stop word
      if (!stopWords.has(cleanWord) && cleanWord.length > 0) {
        return capitalize(word);
      }

      // Keep stop words lowercase
      return word.toLowerCase();
    })
    .join(' ');
}
