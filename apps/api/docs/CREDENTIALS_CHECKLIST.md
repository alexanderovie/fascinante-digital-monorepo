# 🔐 CHECKLIST DE CREDENCIALES - Auditoría Digital Gratis
## Pre-implementación: Obtener todas las credenciales antes de comenzar

---

## 📋 **CREDENCIALES ACTUALES (Ya configuradas)**

### ✅ **Cloudflare Workers**
- [x] **CONTEXT_KV** - Namespace ID: `8e325322533443059fa7b0c208d7f5fb`
- [x] **RESEND_API_KEY** - Configurado como secret (para emails)

### ✅ **Supabase** (usado en otros apps)
- [x] `NEXT_PUBLIC_SUPABASE_URL`
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] `SUPABASE_SERVICE_ROLE_KEY`

---

## 🆕 **CREDENCIALES NUEVAS NECESARIAS**

### **1. GOOGLE CLOUD PLATFORM** 🌐
**Prioridad: CRÍTICA (requerida para funcionar)**

#### **1.1 Google Places API Key**
- **Qué es:** API Key para acceder a Google Places API
- **Dónde obtener:**
  1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
  2. Crear/seleccionar proyecto
  3. Habilitar "Places API" y "Places API (New)"
  4. Crear credenciales → API Key
  5. Configurar restricciones:
     - **Application restrictions:** HTTP referrers
       - `https://api.fascinantedigital.com/*`
       - `https://*.workers.dev/*` (para dev)
     - **API restrictions:** Solo "Places API"
- **Variable:** `GOOGLE_PLACES_API_KEY`
- **Tipo:** Secret (Cloudflare Workers)
- **Costos:**
  - Text Search: $32 USD / 1,000 requests
  - Details: $17 USD / 1,000 requests
  - Free tier: $200 USD credit/mes (Google Cloud)
- **Estado:** ⚠️ **PENDIENTE**

#### **1.2 Vertex AI (Opcional pero Recomendado)**
- **Qué es:** Para análisis inteligente con Gemini 2.0
- **Dónde obtener:**
  1. En el mismo proyecto de Google Cloud
  2. Habilitar "Vertex AI API"
  3. Crear Service Account:
     - Rol: "Vertex AI User"
     - Generar JSON key
  4. O usar API Key alternativa (más simple)
- **Variables:**
  - `GCP_PROJECT_ID` - ID del proyecto GCP
  - `GCP_LOCATION` - Región (ej: `us-central1`)
  - `VERTEX_AI_API_KEY` - API Key para Vertex AI (opcional)
  - `VERTEX_AI_ENDPOINT` - Endpoint REST (si se usa REST API)
- **Tipo:** Secrets
- **Costos:**
  - Gemini 2.0 Flash: ~$0.01-0.05 por auditoría
  - Free tier: $300 USD credit/mes (Google Cloud)
- **Estado:** ⚠️ **PENDIENTE** (Opcional - tiene fallback)

---

### **2. UPSTASH REDIS** 🔴
**Prioridad: CRÍTICA (para cache y rate limiting distribuido)**

#### **2.1 Redis Database**
- **Qué es:** Redis serverless para cache y rate limiting
- **Dónde obtener:**
  1. Ir a [Upstash Console](https://console.upstash.com/)
  2. Crear cuenta (o iniciar sesión)
  3. Crear nueva Redis Database:
     - **Type:** Regional o Global
     - **Region:** Cerca de Cloudflare Workers (ej: `us-east-1`)
     - **Eviction:** LRU (Least Recently Used)
  4. Obtener credenciales:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
- **Variables:**
  - `UPSTASH_REDIS_URL` - REST URL endpoint
  - `UPSTASH_REDIS_TOKEN` - REST API Token
- **Tipo:** Secrets (Cloudflare Workers)
- **Costos:**
  - Free tier: 10,000 commands/día
  - Pay-as-you-go: $0.20 por 100K commands
  - Estimado para auditoría: ~$5-10/mes
- **Estado:** ⚠️ **PENDIENTE**

---

### **3. INNGEST** ⚙️
**Prioridad: ✅ YA CONFIGURADO (solo obtener credenciales)**

#### **3.1 Inngest App**
- **Estado:** ✅ App existente `fascinante-digital`
- **Endpoint actual:** `https://fascinantedigital.com/api/inngest` (Next.js)
- **Nuevo endpoint:** `https://api.fascinantedigital.com/api/inngest` (Cloudflare Workers)
- **Estrategia:** Usar app existente, agregar nuevo sync
- **Dónde obtener credenciales:**
  1. Ir a [Inngest Dashboard](https://app.inngest.com/)
  2. App: `fascinante-digital`
  3. Settings → Keys
  4. Copiar:
     - `INNGEST_EVENT_KEY` - Para enviar eventos
     - `INNGEST_SIGNING_KEY` - Para verificar requests
- **Variables:**
  - `INNGEST_EVENT_KEY` - API Key para enviar eventos (mismo que Next.js)
  - `INNGEST_SIGNING_KEY` - Key para verificar webhook signature (mismo que Next.js)
- **Tipo:** Secrets (Cloudflare Workers)
- **Costos:**
  - Free tier: 500 function runs/mes (compartido con Next.js)
  - Pro: $20/mes (primeros 10K runs)
  - Estimado para auditoría: Gratis hasta ~500 audits/mes
- **Estado:** ✅ **YA EXISTE - Solo obtener credenciales**

---

## 📝 **RESUMEN DE VARIABLES**

### **Cloudflare Workers Secrets (wrangler secret put)**

#### **CRÍTICAS (requeridas):**
```bash
# Google Places API
wrangler secret put GOOGLE_PLACES_API_KEY

# Upstash Redis
wrangler secret put UPSTASH_REDIS_URL
wrangler secret put UPSTASH_REDIS_TOKEN

# Inngest
wrangler secret put INNGEST_EVENT_KEY
wrangler secret put INNGEST_SIGNING_KEY
```

#### **OPCIONALES (recomendadas):**
```bash
# Vertex AI (si se usa)
wrangler secret put GCP_PROJECT_ID
wrangler secret put GCP_LOCATION
wrangler secret put VERTEX_AI_API_KEY

# O usar Service Account JSON (más complejo)
```

#### **YA CONFIGURADAS:**
```bash
# Estas ya están configuradas
RESEND_API_KEY  # Ya existe
CONTEXT_KV      # Ya configurado en wrangler.toml
```

---

### **Frontend (Next.js) - Variables de Entorno**

#### **NEXT_PUBLIC_API_URL**
```bash
# .env.local (desarrollo)
NEXT_PUBLIC_API_URL=http://localhost:8787

# Vercel Environment Variables (producción)
NEXT_PUBLIC_API_URL=https://api.fascinantedigital.com
```

**Estado:** ✅ Ya configurado en `lib/api-config.ts` con fallback

---

## 🔄 **PASOS PARA OBTENER CREDENCIALES**

### **Paso 1: Google Cloud Platform** (15-30 min)
- [ ] 1.1 Crear/seleccionar proyecto en GCP
- [ ] 1.2 Habilitar billing (si no está activo)
- [ ] 1.3 Habilitar "Places API" y "Places API (New)"
- [ ] 1.4 Crear API Key con restricciones
- [ ] 1.5 (Opcional) Habilitar "Vertex AI API"
- [ ] 1.6 (Opcional) Crear Service Account para Vertex AI
- [ ] 1.7 Configurar cuotas y alertas de facturación

### **Paso 2: Upstash Redis** (5-10 min)
- [ ] 2.1 Crear cuenta en Upstash
- [ ] 2.2 Crear Redis Database (Regional)
- [ ] 2.3 Copiar `UPSTASH_REDIS_REST_URL`
- [ ] 2.4 Copiar `UPSTASH_REDIS_REST_TOKEN`

### **Paso 3: Inngest** (5 min)
- [ ] 3.1 Ir a Inngest Dashboard → App `fascinante-digital`
- [ ] 3.2 Settings → Keys
- [ ] 3.3 Copiar `INNGEST_EVENT_KEY`
- [ ] 3.4 Copiar `INNGEST_SIGNING_KEY`
- [ ] 3.5 (Opcional) Agregar nuevo sync para Cloudflare Workers cuando tengamos el endpoint listo

### **Paso 4: Configurar en Cloudflare Workers** (5 min)
- [ ] 4.1 Ejecutar comandos `wrangler secret put` para todas las variables
- [ ] 4.2 Verificar que secrets están configurados:
  ```bash
  wrangler secret list
  ```
- [ ] 4.3 (Opcional) Agregar a `wrangler.toml` como comentario para referencia

---

## ✅ **CHECKLIST FINAL**

### **Antes de empezar código:**
- [ ] ✅ Google Places API Key obtenida
- [ ] ✅ Upstash Redis configurado
- [ ] ✅ Inngest app creada
- [ ] ✅ Todos los secrets configurados en Cloudflare
- [ ] ✅ Variables de entorno documentadas
- [ ] ✅ Acceso a todas las plataformas verificado

### **Configuración mínima para MVP:**
- [ ] ✅ Google Places API Key (OBLIGATORIO)
- [ ] ✅ Upstash Redis (OBLIGATORIO)
- [ ] ✅ Inngest (OBLIGATORIO)
- [ ] ⚠️ Vertex AI (OPCIONAL - tiene fallback sin AI)

---

## 🧪 **VERIFICACIÓN POST-CONFIGURACIÓN**

### **Test de Google Places API:**
```bash
curl "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Pizza+Hut&key=YOUR_API_KEY"
```

### **Test de Upstash Redis:**
```bash
curl https://YOUR_REDIS_URL/set/key/value -H "Authorization: Bearer YOUR_TOKEN"
curl https://YOUR_REDIS_URL/get/key -H "Authorization: Bearer YOUR_TOKEN"
```

### **Test de Inngest:**
```bash
curl -X POST https://api.inngest.com/v1/events \
  -H "Authorization: Bearer YOUR_EVENT_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "test/event", "data": {}}'
```

---

## 📊 **COSTOS ESTIMADOS MENSUALES**

| Servicio | Free Tier | Estimado (100 audits/mes) | Estimado (1,000 audits/mes) |
|----------|-----------|---------------------------|----------------------------|
| **Google Places API** | $200 credit | ~$4.90 | ~$49 |
| **Vertex AI** | $300 credit | ~$2.00 | ~$20 |
| **Upstash Redis** | 10K commands/día | Gratis | ~$5 |
| **Inngest** | 500 runs/mes | Gratis | ~$20 |
| **Cloudflare Workers** | Incluido | Gratis | Gratis |
| **TOTAL** | - | **~$6.90/mes** | **~$94/mes** |

---

## 🚨 **IMPORTANTE**

1. **NO commitear credenciales** en el código
2. **Usar Cloudflare Secrets** para todas las API keys
3. **Configurar restricciones** en todas las API keys
4. **Habilitar alertas** de facturación en GCP
5. **Monitorear uso** especialmente en los primeros días

---

## 📚 **DOCUMENTACIÓN DE REFERENCIA**

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Inngest Docs](https://www.inngest.com/docs)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

---

## ✅ **ESTADO ACTUAL**

**Última actualización:** 2025-01-XX

**Credenciales pendientes:**
- ⚠️ Google Places API Key
- ⚠️ Upstash Redis
- ✅ Inngest (ya configurado - solo obtener Event Key y Signing Key)
- ⚠️ Vertex AI (opcional)

**Próximo paso:** Obtener estas credenciales antes de comenzar implementación.

---

**🎯 Una vez todas las credenciales estén listas, proceder con la implementación.**
