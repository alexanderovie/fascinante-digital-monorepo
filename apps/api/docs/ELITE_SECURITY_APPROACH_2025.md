# 🎯 Enfoque Elite: Seguridad Cloudflare Workers
## Basado en Mejores Prácticas Octubre 2025

---

## 🔍 **CONTEXTO ACTUAL (2025)**

### **Nuevas Capacidades Cloudflare (2025):**
- ✅ **Workers Observability** - Logs detallados y métricas en tiempo real
- ✅ **Workers Secrets Store** - Gestión centralizada de secretos
- ✅ **Rate Limiting nativo** - Via Durable Objects o WAF Rules
- ✅ **Workers VPC** - Conexión segura a recursos privados
- ✅ **Source Maps** - Debugging mejorado en producción
- ✅ **Gradual Rollouts** - Despliegues seguros y controlados

---

## 🎯 **ENFOQUE ELITE: ESTRATEGIA EN 3 CAPAS**

### **CAPA 1: Edge Security (Cloudflare WAF + Rules)**
### **CAPA 2: Worker-Level Security (Código)**
### **CAPA 3: Application-Level Security (Validación + Auth)**

---

## 🔒 **CAPA 1: EDGE SECURITY (Cloudflare Dashboard)**

### **1.1 WAF Rules (Workers Protection)**

**Qué haría un elite:**

```typescript
// Configurar en Cloudflare Dashboard → Security → WAF
// O via Cloudflare API:

1. Rate Limiting Rules:
   - Endpoint: /api/contact
   - Rate: 10 req/10 min por IP
   - Action: Block
   
2. Rate Limiting Rules:
   - Endpoint: /api/audit/free
   - Rate: 5 req/1 hour por IP
   - Action: Challenge (CAPTCHA)
   
3. Rate Limiting Rules:
   - Endpoint: /v3/* (dataforseo-proxy)
   - Rate: 50 req/hour por IP
   - Action: Block (ya implementado en código, pero reforzar en edge)
```

**Ventaja Elite:**
- ✅ Rate limiting ANTES de que llegue al worker
- ✅ No consume CPU del worker
- ✅ Menor latencia para requests bloqueados
- ✅ Configuración centralizada

---

### **1.2 Firewall Rules (Custom Rules)**

**Qué haría un elite:**

```typescript
// Bloquear requests sin Origin header válido
(http.request.method eq "POST" or http.request.method eq "PUT") 
and not http.request.headers["origin"][*] in {
  "https://fascinantedigital.com"
  "https://www.fascinantedigital.com"
  "https://app.fascinantedigital.com"
}

// Bloquear bots maliciosos conocidos
cf.threat_score gt 20

// Bloquear countries de alto riesgo (si aplica)
ip.geoip.country in {"CN" "RU" "KP"}  // Ejemplo
```

---

### **1.3 Security Headers (Transform Rules)**

**Qué haría un elite:**

```typescript
// Agregar headers de seguridad automáticamente
1. Content-Security-Policy
2. X-Content-Type-Options: nosniff
3. X-Frame-Options: DENY
4. X-XSS-Protection: 1; mode=block
5. Strict-Transport-Security: max-age=31536000
6. Referrer-Policy: strict-origin-when-cross-origin
```

**Implementación:**
- Via Cloudflare Dashboard → Rules → Transform Rules
- O via `wrangler.toml` (limitado)

---

## 🔒 **CAPA 2: WORKER-LEVEL SECURITY**

### **2.1 CORS con Validación Dinámica (Elite Pattern 2025)**

**Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Validación dinámica + caching
const ALLOWED_ORIGINS = [
  'https://fascinantedigital.com',
  'https://www.fascinantedigital.com',
  'https://app.fascinantedigital.com'
];

// Cache de validación (KV)
async function getCorsHeaders(request: Request, env: Env) {
  const origin = request.headers.get('Origin');
  
  // Si no hay Origin, permitir solo mismo-origin
  if (!origin) {
    return {
      'Access-Control-Allow-Origin': request.headers.get('Host') || '',
      'Vary': 'Origin'
    };
  }
  
  // Validar contra whitelist
  const isValid = ALLOWED_ORIGINS.includes(origin);
  
  if (!isValid) {
    // Log para monitoreo
    console.warn(`Invalid CORS origin: ${origin}`);
    // Opcional: Rate limit este origen
    await trackSuspiciousOrigin(origin, env);
    return null; // Rechazar
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin' // Importante para cache
  };
}
```

**Mejoras Elite:**
- ✅ Vary header para correcto caching
- ✅ Logging de origins inválidos
- ✅ Tracking de intentos sospechosos

---

### **2.2 Rate Limiting Distribuido (Durable Objects - 2025)**

**Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Durable Objects para rate limiting global
// Más preciso que KV para rate limiting distribuido

// durable-objects-rate-limiter.ts
export class RateLimiter {
  state: DurableObjectState;
  env: Env;
  
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }
  
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('id') || 'default';
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const window = parseInt(url.searchParams.get('window') || '3600');
    
    const key = `ratelimit:${identifier}`;
    const current = await this.state.storage.get<number>(key) || 0;
    
    if (current >= limit) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retry_after: window
      }), { status: 429 });
    }
    
    await this.state.storage.put(key, current + 1, {
      expirationTtl: window
    });
    
    return new Response(JSON.stringify({
      allowed: true,
      remaining: limit - current - 1
    }));
  }
}

// En el worker:
async function checkRateLimit(identifier: string, env: Env): Promise<boolean> {
  const id = env.RATE_LIMITER.idFromName(identifier);
  const limiter = env.RATE_LIMITER.get(id);
  const response = await limiter.fetch(
    new Request(`https://rate-limiter/?id=${identifier}&limit=50&window=3600`)
  );
  return response.ok;
}
```

**Ventajas Elite:**
- ✅ Rate limiting global (no solo por worker instance)
- ✅ Más preciso que KV
- ✅ Menor latencia
- ✅ Escalable

**Alternativa Más Simple (2025):**
- Usar Cloudflare WAF Rate Limiting Rules (recomendado para mayoría de casos)

---

### **2.3 Input Validation con Zod (Elite Pattern 2025)**

**Qué haría un elite:**

```typescript
import { z } from 'zod';

// Schemas centralizados
const ContactSchema = z.object({
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').max(255),
  message: z.string().min(1, 'Message required').max(5000, 'Message too long'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone').optional(),
  service: z.string().max(100).optional()
}).strict(); // Rechazar campos extra

const AuditSchema = z.object({
  businessName: z.string().min(1).max(200).trim(),
  email: z.string().email().optional(),
  location: z.string().max(200).optional()
}).strict();

// Middleware de validación
async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: Response }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: jsonResponse({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        }, 400)
      };
    }
    return {
      success: false,
      error: jsonResponse({ error: 'Invalid JSON' }, 400)
    };
  }
}

// Uso:
const validation = await validateRequest(request, ContactSchema);
if (!validation.success) {
  return validation.error;
}
const { data } = validation; // Type-safe
```

**Ventajas Elite:**
- ✅ Type-safe
- ✅ Mensajes de error claros
- ✅ Prevención de inyección
- ✅ Validación automática

---

### **2.4 Secrets Management (Secrets Store 2025)**

**Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Usar Workers Secrets Store
// No solo wrangler secret put

// En wrangler.toml:
[secrets]
# Binding automático
DATAFORSEO_AUTH = { from_secrets_store = "dataforseo-auth" }
RESEND_API_KEY = { from_secrets_store = "resend-api-key" }

// Rotación automática:
// - Cloudflare puede rotar secretos automáticamente
// - Worker actualiza sin redeploy

interface Env {
  // Secrets Store bindings
  DATAFORSEO_AUTH: string;
  RESEND_API_KEY: string;
  
  // Verificar que existen
  assertEnv() {
    if (!this.DATAFORSEO_AUTH || !this.RESEND_API_KEY) {
      throw new Error('Required secrets not configured');
    }
  }
}
```

**Ventajas Elite:**
- ✅ Rotación sin downtime
- ✅ Gestión centralizada
- ✅ Auditoría de acceso
- ✅ Versionado de secretos

---

## 🔒 **CAPA 3: APPLICATION-LEVEL SECURITY**

### **3.1 API Key Authentication (Simple pero Efectivo)**

**Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: API Key para frontend + JWT para servicios internos

const FRONTEND_API_KEY = 'cf_fd_2025_'; // Prefijo para identificar
const VALID_API_KEYS = new Set([
  env.FRONTEND_API_KEY, // Del secret store
  env.INTERNAL_API_KEY  // Para servicios internos
]);

async function authenticateRequest(request: Request, env: Env): Promise<boolean> {
  // Opción 1: API Key en header
  const apiKey = request.headers.get('X-API-Key');
  if (apiKey && VALID_API_KEYS.has(apiKey)) {
    return true;
  }
  
  // Opción 2: API Key en query (solo para GET, no recomendado)
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('api_key');
  if (queryKey && VALID_API_KEYS.has(queryKey) && request.method === 'GET') {
    return true;
  }
  
  // Opción 3: Verificar Origin (complementario, no único)
  const origin = request.headers.get('Origin');
  if (ALLOWED_ORIGINS.includes(origin || '')) {
    // Permitir pero con rate limiting más agresivo
    return true;
  }
  
  return false;
}

// Middleware
async function withAuth(
  request: Request,
  env: Env,
  handler: (request: Request, env: Env) => Promise<Response>
): Promise<Response> {
  if (!(await authenticateRequest(request, env))) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  return handler(request, env);
}
```

---

### **3.2 Request Size Limits**

**Qué haría un elite:**

```typescript
const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_URL_LENGTH = 2048;

async function validateRequestSize(request: Request): Promise<Response | null> {
  const contentLength = request.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    return jsonResponse({ error: 'Request too large' }, 413);
  }
  
  const url = new URL(request.url);
  if (url.toString().length > MAX_URL_LENGTH) {
    return jsonResponse({ error: 'URL too long' }, 414);
  }
  
  return null;
}
```

---

### **3.3 Error Handling Elite (2025)**

**Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Error handling estructurado

class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Error handlers centralizados
function handleError(error: unknown, env: Env): Response {
  // Log estructurado
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : { message: String(error) },
    // Contexto adicional
    env: env.ENVIRONMENT
  };
  
  console.error(JSON.stringify(errorLog));
  
  // Respuesta al cliente
  if (error instanceof AppError) {
    return jsonResponse({
      error: error.message,
      code: error.code,
      ...(env.ENVIRONMENT === 'development' && { details: error.details })
    }, error.statusCode);
  }
  
  // Error genérico para producción
  return jsonResponse({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }, 500);
}

// Uso:
try {
  // ... código
} catch (error) {
  return handleError(error, env);
}
```

**Ventajas Elite:**
- ✅ Logs estructurados (JSON)
- ✅ Fácil de buscar en Workers Observability
- ✅ Información útil sin exponer detalles sensibles

---

## 📊 **MONITORING Y OBSERVABILITY (2025)**

### **Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Workers Observability + Analytics Engine

// 1. Configurar Observability en wrangler.toml
[observability]
enabled = true
head_sampling_rate = 1.0  # 100% para producción crítica
tail_sampling_rate = 0.1  # 10% para optimizar costos

// 2. Analytics Engine para métricas personalizadas
interface Env {
  Analytics: AnalyticsEngineDataset;
}

// Tracking de eventos importantes
function trackEvent(
  env: Env,
  event: {
    type: 'api_call' | 'rate_limit' | 'error' | 'audit_generated';
    endpoint: string;
    status: number;
    latency: number;
    metadata?: Record<string, any>;
  }
) {
  env.Analytics.writeDataPoint({
    blobs: [event.type, event.endpoint, event.metadata?.ip || 'unknown'],
    doubles: [event.status, event.latency, Date.now()],
    indexes: [`status_${event.status}`, `endpoint_${event.endpoint}`]
  });
}

// 3. Alertas automáticas
// Configurar en Cloudflare Dashboard → Notifications
// Alertas para:
// - Rate limit excedido > 100 veces/hora
// - Error rate > 5%
// - Latencia p95 > 1 segundo
```

---

## 🚀 **DESPLIEGUE SEGURO (Gradual Rollouts 2025)**

### **Qué haría un elite:**

```typescript
// ✅ Enfoque Elite: Gradual Rollouts para cambios críticos

// En wrangler.toml o via API:
[experimental]
gradual_rollouts = {
  enabled = true
  percentage = 10  // 10% de tráfico a nueva versión
  duration = 3600  // 1 hora
}

// O via Workers Versions API:
// 1. Deploy nueva versión
// 2. Gradual rollout: 10% → 50% → 100%
// 3. Rollback automático si error rate > threshold
```

**Ventajas Elite:**
- ✅ Reducir riesgo de bugs en producción
- ✅ Detección temprana de problemas
- ✅ Rollback automático posible

---

## 📋 **CHECKLIST ELITE IMPLEMENTACIÓN**

### **FASE 1: Edge Security (Dashboard) - 1 día**
- [ ] Configurar WAF Rate Limiting Rules para `/api/contact`
- [ ] Configurar WAF Rate Limiting Rules para `/api/audit/free`
- [ ] Configurar Firewall Rules para bloquear origins inválidos
- [ ] Configurar Transform Rules para Security Headers
- [ ] Habilitar Workers Observability

### **FASE 2: Worker CORS + Validation - 1 día**
- [ ] Implementar CORS dinámico con whitelist
- [ ] Instalar Zod y crear schemas de validación
- [ ] Implementar middleware de validación
- [ ] Agregar request size limits

### **FASE 3: Authentication + Rate Limiting - 2 días**
- [ ] Implementar API Key authentication
- [ ] Configurar Secrets Store para API keys
- [ ] Implementar rate limiting distribuido (Durable Objects O WAF)
- [ ] Testing de rate limits

### **FASE 4: Monitoring + Error Handling - 1 día**
- [ ] Configurar Analytics Engine
- [ ] Implementar error handling estructurado
- [ ] Configurar alertas en Cloudflare Dashboard
- [ ] Documentar incident response

### **FASE 5: Gradual Rollout - Continuo**
- [ ] Configurar gradual rollouts para deployments
- [ ] Testing en staging primero
- [ ] Monitor métricas durante rollout

---

## 🎯 **PRIORIDADES ELITE**

### **INMEDIATO (Esta Semana):**
1. 🔴 **CORS Whitelist** - 2 horas
2. 🔴 **WAF Rate Limiting** - 1 hora (Dashboard)
3. 🔴 **Security Headers** - 30 min (Transform Rules)

### **PRÓXIMA SEMANA:**
4. 🟡 **Input Validation (Zod)** - 4 horas
5. 🟡 **API Key Auth** - 4 horas
6. 🟡 **Error Handling** - 2 horas

### **MEJORAS CONTINUAS:**
7. 🟢 **Monitoring & Alerts** - 2 horas
8. 🟢 **Gradual Rollouts** - Configurar
9. 🟢 **Durable Objects** - Si rate limiting simple no es suficiente

---

## 💡 **VENTAJAS DEL ENFOQUE ELITE**

1. ✅ **Defensa en Profundidad:** 3 capas de seguridad
2. ✅ **Edge-First:** Bloquea amenazas antes del worker
3. ✅ **Type-Safe:** Zod para validación
4. ✅ **Observable:** Logs estructurados y métricas
5. ✅ **Escalable:** Durable Objects para rate limiting global
6. ✅ **Moderno:** Usa features 2025 de Cloudflare
7. ✅ **Mantenible:** Código limpio y documentado

---

**Basado en:** Mejores prácticas Cloudflare Workers (Octubre 2025)  
**Tiempo Estimado:** 5-7 días para implementación completa  
**ROI:** Alta seguridad con mantenimiento mínimo


