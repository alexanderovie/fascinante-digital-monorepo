# 🚀 Mejoras Relevantes para Route Handlers - Next.js 15
## Análisis Basado en Documentación Oficial y Código Actual

**Fecha:** 2025-01-27
**Framework:** Next.js 15.5.6
**Basado en:** Next.js 15 Official Docs - "Backend for Frontend"

---

## ✅ **LO QUE YA TIENES BIEN**

1. ✅ Try/catch blocks en todos los handlers
2. ✅ Validación básica de inputs
3. ✅ Manejo de errores con mensajes genéricos (no exponen información sensible)
4. ✅ Uso de NextRequest y NextResponse
5. ✅ Proxy pattern implementado (Google Places, DataForSEO)

---

## 🚨 **MEJORAS CRÍTICAS (Relevantes para Producción)**

### **1. Timeouts con AbortController** ⚠️ CRÍTICO
**Problema:** Los `fetch()` sin timeout pueden colgar el servidor indefinidamente
**Impacto:** Si Google API o DataForSEO API se cuelgan, tu servidor también
**Riesgo:** 🔴 Alto - Puede saturar recursos del servidor

**Código actual:**
```typescript
// apps/web/app/api/places/autocomplete/route.ts línea 83
const response = await fetch(
  'https://places.googleapis.com/v1/places:autocomplete',
  { method: 'POST', ... }
); // ❌ Sin timeout
```

**Solución según docs:**
```typescript
// Agregar timeout de 10 segundos
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

try {
  const response = await fetch(url, {
    method: 'POST',
    signal: controller.signal, // ← Agregar esto
    // ...
  });
  clearTimeout(timeoutId);
  // ...
} catch (error) {
  clearTimeout(timeoutId);
  if (error instanceof Error && error.name === 'AbortError') {
    return NextResponse.json(
      { error: 'Request timeout - API took too long to respond' },
      { status: 504 }
    );
  }
  throw error;
}
```

**Aplicar en:**
- `/api/places/autocomplete/route.ts` (línea 83)
- `/api/places/details/route.ts` (línea 80)
- `/api/audit/generate/route.ts` (línea 27) - múltiples fetch en Promise.all

---

### **2. Rate Limiting** ⚠️ CRÍTICO
**Problema:** Sin rate limiting, alguien puede hacer spam de requests y agotar tu quota de Google API
**Impacto:** Costos excesivos, servicio inestable
**Riesgo:** 🔴 Alto - Protección de costos API

**Solución (biblioteca recomendada):**
```bash
pnpm add @upstash/ratelimit @upstash/redis
# O para desarrollo simple:
pnpm add rate-limiter-flexible
```

**Implementación básica (sin Redis):**
```typescript
// apps/web/lib/rate-limit.ts
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export async function checkRateLimit(
  ip: string,
  limit: number = 10,
  windowMs: number = 60000 // 1 minuto
): Promise<{ rateLimited: boolean }> {
  const now = Date.now();
  const key = ip;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { rateLimited: false };
  }

  if (record.count >= limit) {
    return { rateLimited: true };
  }

  record.count++;
  return { rateLimited: false };
}
```

**Aplicar en:**
- `/api/places/autocomplete/route.ts` - Limitar a 10 req/min por IP
- `/api/places/details/route.ts` - Limitar a 20 req/min por IP
- `/api/audit/generate/route.ts` - Limitar a 3 req/hora por IP (más costoso)

---

### **3. Validación de Tamaño de Payload** 🟡 MEDIO
**Problema:** No validas el tamaño del body antes de procesarlo
**Impacto:** Requests enormes pueden consumir memoria
**Riesgo:** 🟡 Medio - Protección de recursos

**Solución según docs:**
```typescript
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type');

  // Validar content-type
  if (!contentType?.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 400 }
    );
  }

  // Leer body con límite de tamaño
  const body = await request.json();

  // Validar tamaño (ej: máximo 10KB)
  const bodyString = JSON.stringify(body);
  if (bodyString.length > 10 * 1024) {
    return NextResponse.json(
      { error: 'Request body too large' },
      { status: 413 }
    );
  }

  // ... resto del código
}
```

**Aplicar en:**
- `/api/audit/generate/route.ts` (POST con body)

---

### **4. Sanitización de Inputs contra XSS** 🟡 MEDIO
**Problema:** Inputs de usuario se usan directamente sin sanitización
**Impacto:** Potencial vulnerabilidad XSS si se renderizan en frontend
**Riesgo:** 🟡 Medio (pero importante)

**Solución:**
```typescript
// apps/web/lib/sanitize.ts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres peligrosos
    .substring(0, 200); // Limitar longitud
}

// Usar en routes:
const sanitizedInput = sanitizeInput(input);
```

**Aplicar en:**
- `/api/places/autocomplete/route.ts` - `input` parameter (línea 13)
- `/api/audit/generate/route.ts` - `businessName`, `category` (línea 61-73)

---

### **5. Mejor Manejo de Errores (Sin Exponer Info Sensible)** ✅ YA ESTÁ BIEN
**Tu código ya lo hace correctamente:**
```typescript
// ✅ Bien - No expones detalles internos
catch (error) {
  console.error('Error in places autocomplete:', error); // Log interno
  return NextResponse.json(
    { error: 'Internal server error' }, // Genérico al cliente
    { status: 500 }
  );
}
```

**Mejora opcional:**
```typescript
// Diferencia entre errores de usuario vs servidor
catch (error) {
  if (error instanceof Error && error.message.includes('validation')) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // Errores internos - genérico
  console.error('Internal error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## 🟢 **MEJORAS OPCIONALES (Nice to Have)**

### **6. Request Cloning (Si lo Necesitas)**
**Relevancia:** 🟢 Baja
**Cuándo usar:** Solo si necesitas leer el body múltiples veces
**Tu caso:** No lo necesitas actualmente

### **7. Middleware para Auth (Futuro)**
**Relevancia:** 🟢 Baja
**Cuándo usar:** Si agregas autenticación a tus APIs
**Tu caso:** APIs son públicas actualmente, no necesario

### **8. Webhooks/Callbacks (Futuro)**
**Relevancia:** 🟢 Baja
**Cuándo usar:** Si necesitas recibir notificaciones de servicios externos
**Tu caso:** No necesario ahora

---

## 📋 **RESUMEN DE PRIORIDADES**

### **🔴 CRÍTICO (Implementar Pronto)**
1. ✅ **Timeouts con AbortController** - Proteger servidor de requests colgados
2. ✅ **Rate Limiting** - Proteger quota/costos de Google API y DataForSEO

### **🟡 IMPORTANTE (Implementar en Próxima Iteración)**
3. ✅ **Validación de tamaño de payload** - Proteger memoria del servidor
4. ✅ **Sanitización de inputs** - Prevenir XSS

### **🟢 OPCIONAL (Considerar Después)**
5. Mejor diferenciación de errores (usuario vs servidor)
6. Logging más estructurado para debugging

---

## 🎯 **RECOMENDACIÓN**

**Implementar AHORA:**
1. Timeouts en todos los `fetch()` (10 segundos)
2. Rate limiting básico en `/api/places/*` y `/api/audit/*`

**Dejar para después:**
- Validación de tamaño (baja prioridad)
- Sanitización avanzada (ya tienes validación básica)

Esto protegerá tu servidor de los riesgos más críticos sin agregar complejidad innecesaria.
