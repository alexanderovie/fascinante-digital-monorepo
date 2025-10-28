# 🚀 Plan Élite: Integración Google Places API - Octubre 2025

## 📋 Objetivo
Integrar Google Places API en el formulario del Hero para autocompletar búsqueda de negocios y obtener datos completos (dirección, teléfono, ratings, etc.)

---

## 🎯 Estrategia Élite (Octubre 2025)

### **Opción 1: Google Places API (New) - RECOMENDADA** ⭐
- **API**: Places API (New) - Autocomplete
- **Versión**: Nueva API unificada de Google (2024+)
- **Costo**: ~$2.83 por 1000 autocomplete sessions + ~$3.00 por 1000 place details
- **Ventajas**:
  - API moderna y unificada
  - Mejor rendimiento
  - Datos más completos y actualizados
  - Soporte mejorado para negocios

### **Opción 2: Google Places API (Legacy)**
- API antigua (será deprecada)
- No recomendada para nuevos proyectos

---

## 🏗️ Arquitectura Moderna

### **1. Server-Side Proxy (Seguridad)**
```
Cliente → Next.js API Route → Google Places API
        (oculta API key)
```

**Razones**:
- ✅ API key protegida (nunca expuesta al cliente)
- ✅ Rate limiting controlado
- ✅ Validación server-side
- ✅ Caching server-side para reducir costos

### **2. Componente de Autocomplete**
- Debounce: 300ms (reduce llamadas API)
- Mínimo 3 caracteres para buscar
- Cache local con React Query / SWR
- Skeleton states para mejor UX
- Manejo de errores elegante

---

## 📦 Stack Tecnológico

### **Librerías Modernas (Octubre 2025)**
```json
{
  "@tanstack/react-query": "^5.x", // Cache y estado de API
  "use-debounce": "^10.x", // Debouncing moderno
  "zod": "^3.x" // Validación de tipos
}
```

### **API Route Estructura**
```
apps/web/app/api/places/
  ├── autocomplete/route.ts    // Autocomplete suggestions
  └── details/route.ts          // Place details completo
```

---

## 🎨 UX/UI Design

### **Flujo de Usuario**
1. Usuario escribe nombre de negocio (mínimo 3 chars)
2. Aparece dropdown con sugerencias mientras escribe
3. Usuario selecciona negocio de la lista
4. Se auto-completan:
   - ✅ Nombre del negocio
   - ✅ Dirección completa
   - ✅ Teléfono (si disponible)
   - ✅ Rating (si disponible)
   - ✅ Place ID (para detalles adicionales)

### **Estados Visuales**
- 🔄 Loading: Skeleton en dropdown
- ✅ Success: Sugerencias mostradas
- ❌ Error: Mensaje discreto, permite seguir escribiendo manualmente
- 🔍 Empty: "No se encontraron negocios"

---

## 🔒 Seguridad & Costos

### **Medidas de Seguridad**
1. **API Key en Server-Side Only**
   - Variable de entorno `GOOGLE_PLACES_API_KEY`
   - Nunca expuesta al cliente

2. **Rate Limiting**
   - Máximo 5 búsquedas por minuto por IP
   - Cache de resultados populares (1 hora)
   - Debounce client-side (300ms)

3. **Restricciones de API Key**
   - Solo permitir dominio de producción
   - Restringir a Places API únicamente
   - Quotas configuradas en Google Cloud

### **Optimización de Costos**
- Cache server-side (Redis/Vercel KV): 1 hora
- Cache client-side: 5 minutos (SWR)
- Debounce agresivo: 300ms
- Solo hacer Place Details cuando se selecciona

---

## 📐 Implementación Técnica

### **1. Estructura de Archivos**
```
apps/web/
├── app/api/places/
│   ├── autocomplete/route.ts
│   └── details/route.ts
├── components/Home/Hero/
│   ├── BusinessAutocomplete.tsx  (nuevo)
│   ├── FormComponent.tsx         (modificado)
│   └── index.tsx
├── lib/
│   ├── places-api.ts            (nuevo - utilidades)
│   └── api-config.ts            (actualizado)
└── types/
    └── places.ts                (nuevo - tipos TypeScript)
```

### **2. Tipos TypeScript**
```typescript
// types/places.ts
export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  rating?: number;
  website?: string;
  business_status: string;
}
```

### **3. API Route - Autocomplete**
```typescript
// app/api/places/autocomplete/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const input = searchParams.get('input');

  // Validación
  if (!input || input.length < 3) {
    return NextResponse.json({ error: 'Input too short' }, { status: 400 });
  }

  // Rate limiting check (usar Vercel Edge Config o Upstash)

  const response = await fetch(
    `https://places.googleapis.com/v1/places:autocomplete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY!,
        'X-Goog-FieldMask': 'predictions.place_id,predictions.description',
      },
      body: JSON.stringify({
        input,
        locationBias: {
          circle: {
            center: { latitude: 28.5383, longitude: -81.3792 }, // Tampa, FL
            radius: 50000.0, // 50km
          },
        },
        includedPrimaryTypes: ['establishment', 'local_business'],
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
```

### **4. Componente Autocomplete Moderno**
```typescript
// components/Home/Hero/BusinessAutocomplete.tsx
"use client";

import { useState, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Loader2 } from 'lucide-react';
import type { PlacePrediction, PlaceDetails } from '@/types/places';

interface BusinessAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceDetails) => void;
  placeholder?: string;
}

export function BusinessAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
}: BusinessAutocompleteProps) {
  const [debouncedInput] = useDebounce(value, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch autocomplete suggestions
  const { data: predictions, isLoading } = useQuery({
    queryKey: ['places-autocomplete', debouncedInput],
    queryFn: async () => {
      if (debouncedInput.length < 3) return [];

      const res = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(debouncedInput)}`
      );
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.predictions || [];
    },
    enabled: debouncedInput.length >= 3,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const handleSelect = useCallback(async (prediction: PlacePrediction) => {
    // Fetch place details
    const res = await fetch(`/api/places/details?place_id=${prediction.place_id}`);
    const details: PlaceDetails = await res.json();

    onChange(details.name);
    onSelect(details);
    setShowSuggestions(false);
  }, [onChange, onSelect]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-dusty-gray" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="input-field pl-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-dusty-gray" />
        )}
      </div>

      {showSuggestions && predictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction: PlacePrediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelect(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start gap-3"
            >
              <MapPin className="size-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary dark:text-white truncate">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-sm text-dusty-gray dark:text-white/70 truncate">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions &&
       value.length >= 3 &&
       !isLoading &&
       (!predictions || predictions.length === 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-secondary border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 text-center text-dusty-gray dark:text-white/70">
          No se encontraron negocios
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Integración con FormComponent

### **Modificaciones al FormComponent**
```typescript
// Agregar al estado:
const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);

// Reemplazar input de nombre con:
<BusinessAutocomplete
  value={formData.name}
  onChange={(value) => {
    setFormData(prev => ({ ...prev, name: value }));
  }}
  onSelect={(place) => {
    setSelectedPlace(place);
    // Auto-completar otros campos si están disponibles
    if (place.formatted_phone_number && !formData.phone) {
      setFormData(prev => ({ ...prev, phone: place.formatted_phone_number! }));
    }
  }}
  placeholder={dict.formName}
/>
```

---

## 📊 Monitoreo & Analytics

### **Métricas a Trackear**
- Búsquedas exitosas vs fallidas
- Tiempo de respuesta de API
- Uso de cache (hit rate)
- Costos mensuales de API
- Conversión: autocomplete usado vs manual

### **Herramientas**
- Vercel Analytics para métricas de usuario
- Google Cloud Console para métricas de API
- Sentry para errores

---

## 🚦 Fases de Implementación

### **Fase 1: Setup Básico (1-2 días)**
- [ ] Configurar Google Cloud Project
- [ ] Obtener API Key y configurar restricciones
- [ ] Crear API routes básicas
- [ ] Testing manual con Postman/Thunder Client

### **Fase 2: Componente UI (2-3 días)**
- [ ] Implementar BusinessAutocomplete
- [ ] Integrar con FormComponent
- [ ] Estilos y animaciones
- [ ] Testing de UX

### **Fase 3: Optimizaciones (1-2 días)**
- [ ] Implementar cache (server + client)
- [ ] Rate limiting
- [ ] Error handling robusto
- [ ] Analytics

### **Fase 4: Testing & Deploy (1 día)**
- [ ] Testing en staging
- [ ] Optimización de costos
- [ ] Documentación
- [ ] Deploy a producción

---

## 💰 Estimación de Costos

### **Escenario Conservador**
- 1000 usuarios/mes
- 3 búsquedas promedio por usuario
- 50% seleccionan de autocomplete

**Cálculo**:
- Autocomplete: 1000 × 3 = 3,000 sesiones × $2.83/1000 = **$8.49**
- Place Details: 1500 × $3.00/1000 = **$4.50**
- **Total: ~$13/mes**

### **Escenario Agresivo**
- 10,000 usuarios/mes
- 5 búsquedas promedio
- 70% seleccionan

**Total: ~$135/mes**

---

## ✅ Checklist de Calidad Élite

- [ ] API key nunca expuesta al cliente
- [ ] Rate limiting implementado
- [ ] Error handling completo
- [ ] Loading states elegantes
- [ ] Accesibilidad (a11y) completa
- [ ] Mobile responsive
- [ ] TypeScript strict mode
- [ ] Tests unitarios críticos
- [ ] Documentación de código
- [ ] Monitoreo de errores

---

## 🎓 Recursos de Referencia

- [Google Places API (New) Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Next.js 15 API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Google Cloud Best Practices](https://cloud.google.com/docs/security/best-practices)
