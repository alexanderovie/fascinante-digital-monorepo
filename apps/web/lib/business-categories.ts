/**
 * Common Business Categories
 * Used in audit form for DataForSEO queries
 * Categories are based on common Google Places types and general business classifications
 */

export interface BusinessCategory {
  value: string;
  label: string; // Spanish
  labelEn: string; // English
}

/**
 * Map Google Places primary_type to our category value
 */
export function mapGooglePlacesTypeToCategory(primaryType?: string, types?: string[]): string | null {
  if (!primaryType && !types?.length) return null;

  // Check primary type first
  if (primaryType) {
    const mapped = googlePlacesTypeMap[primaryType];
    if (mapped) return mapped;
  }

  // Fallback: check all types
  if (types) {
    for (const type of types) {
      const mapped = googlePlacesTypeMap[type];
      if (mapped) return mapped;
    }
  }

  return null;
}

/**
 * Get category by value
 */
export function getCategoryByValue(value: string): BusinessCategory | undefined {
  return BUSINESS_CATEGORIES.find(cat => cat.value === value);
}

/**
 * Get readable label for a category value
 */
export function getCategoryLabel(value: string, locale: 'es' | 'en' = 'es'): string {
  const category = getCategoryByValue(value);
  if (!category) return value;
  return locale === 'en' ? category.labelEn : category.label;
}

/**
 * Google Places type to category mapping
 */
const googlePlacesTypeMap: Record<string, string> = {
  // Restaurants & Food
  'restaurant': 'restaurant',
  'cafe': 'restaurant',
  'bar': 'restaurant',
  'bakery': 'food_service',
  'meal_takeaway': 'food_service',
  'meal_delivery': 'food_service',
  'food': 'food_service',

  // Retail
  'store': 'retail',
  'shopping_mall': 'retail',
  'clothing_store': 'retail',
  'supermarket': 'retail',
  'department_store': 'retail',

  // Professional Services
  'lawyer': 'professional_services',
  'accounting': 'professional_services',
  'real_estate_agency': 'professional_services',
  'insurance_agency': 'professional_services',
  'financial_service': 'professional_services',

  // Health & Beauty
  'beauty_salon': 'health_beauty',
  'hair_care': 'health_beauty',
  'spa': 'health_beauty',
  'gym': 'health_beauty',
  'hospital': 'health_beauty',
  'doctor': 'health_beauty',
  'dentist': 'health_beauty',

  // Automotive
  'car_dealer': 'automotive',
  'car_repair': 'automotive',
  'gas_station': 'automotive',

  // Home & Garden
  'home_goods_store': 'home_garden',
  'hardware_store': 'home_garden',
  'furniture_store': 'home_garden',
  'locksmith': 'home_garden',
  'plumber': 'home_garden',
  'electrician': 'home_garden',

  // Education
  'school': 'education',
  'university': 'education',
  'library': 'education',

  // Entertainment
  'movie_theater': 'entertainment',
  'night_club': 'entertainment',
  'amusement_park': 'entertainment',
  'tourist_attraction': 'entertainment',

  // Travel & Hospitality
  'lodging': 'travel_hospitality',
  'travel_agency': 'travel_hospitality',
  'airport': 'travel_hospitality',

  // Technology & Communication
  'electronics_store': 'technology',
  'mobile_phone_shop': 'technology',
  'computer_store': 'technology',

  // Other Services
  'bank': 'financial_services',
  'atm': 'financial_services',
  'pharmacy': 'health_pharmacy',
  'veterinary_care': 'veterinary',
  'pet_store': 'veterinary',
  'funeral_home': 'other_services',
  'church': 'religious',
  'park': 'public_space',
};

/**
 * List of common business categories
 * These are the categories we support for DataForSEO queries
 */
export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { value: 'restaurant', label: 'Restaurante', labelEn: 'Restaurant' },
  { value: 'food_service', label: 'Servicio de Comida', labelEn: 'Food Service' },
  { value: 'retail', label: 'Tienda / Retail', labelEn: 'Retail Store' },
  { value: 'professional_services', label: 'Servicios Profesionales', labelEn: 'Professional Services' },
  { value: 'health_beauty', label: 'Salud y Belleza', labelEn: 'Health & Beauty' },
  { value: 'automotive', label: 'Automotriz', labelEn: 'Automotive' },
  { value: 'home_garden', label: 'Hogar y Jardín', labelEn: 'Home & Garden' },
  { value: 'education', label: 'Educación', labelEn: 'Education' },
  { value: 'entertainment', label: 'Entretenimiento', labelEn: 'Entertainment' },
  { value: 'travel_hospitality', label: 'Viajes y Hospedaje', labelEn: 'Travel & Hospitality' },
  { value: 'technology', label: 'Tecnología', labelEn: 'Technology' },
  { value: 'financial_services', label: 'Servicios Financieros', labelEn: 'Financial Services' },
  { value: 'health_pharmacy', label: 'Salud y Farmacia', labelEn: 'Health & Pharmacy' },
  { value: 'veterinary', label: 'Veterinaria', labelEn: 'Veterinary' },
  { value: 'other_services', label: 'Otros Servicios', labelEn: 'Other Services' },
];
