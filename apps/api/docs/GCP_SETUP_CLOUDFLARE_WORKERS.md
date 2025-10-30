# 🔧 Configuración Google Cloud para Cloudflare Workers
## Octubre 2025 - Best Practices Elite

---

## 🎯 **ENTENDIMIENTO CLAVE**

### **⚠️ IMPORTANTE: Cloudflare Workers ≠ Servidor Tradicional**

**Cloudflare Workers NO soporta:**
- ❌ `gcloud CLI` en runtime
- ❌ Application Default Credentials (ADC)
- ❌ Service Account JSON files en filesystem
- ❌ Variables de entorno `GOOGLE_APPLICATION_CREDENTIALS`

**Cloudflare Workers SÍ soporta:**
- ✅ REST APIs directas
- ✅ API Keys (para servicios públicos)
- ✅ Service Account tokens vía REST
- ✅ OAuth 2.0 tokens

---

## 🔑 **ESTRATEGIA DE AUTENTICACIÓN**

### **Para Google Places API:**
```
✅ Usar API Key (ya configurado)
   - Simples de usar
   - Perfecto para servicios públicos
   - No requiere autenticación compleja
```

### **Para Vertex AI:**
```
Opción A: Service Account Key (JSON) → Token REST API (RECOMENDADO)
Opción B: API Key si Vertex AI lo soporta
Opción C: OAuth 2.0 Server-to-Server
```

---

## 📋 **SETUP PASO A PASO**

### **PASO 1: Habilitar APIs en Google Cloud**

Usa `gcloud CLI` (solo para configuración, NO en runtime):

```bash
# Configurar proyecto
gcloud config set project fascinante-digit-1698295291643

# Habilitar APIs necesarias
gcloud services enable \
  places-backend.googleapis.com \
  places-backend-new.googleapis.com \
  aiplatform.googleapis.com

# Verificar APIs habilitadas
gcloud services list --enabled --project=fascinante-digit-1698295291643
```

**✅ Ya tienes configurado:**
- Project ID: `fascinante-digit-1698295291643`
- Account: `info@fascinantedigital.com`

---

### **PASO 2: Crear Service Account para Vertex AI**

```bash
# Crear service account
gcloud iam service-accounts create vertex-ai-worker \
  --display-name="Vertex AI Cloudflare Worker" \
  --project=fascinante-digit-1698295291643

# Asignar rol necesario
gcloud projects add-iam-policy-binding fascinante-digit-1698295291643 \
  --member="serviceAccount:vertex-ai-worker@fascinante-digit-1698295291643.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Generar JSON key (guardar en lugar seguro)
gcloud iam service-accounts keys create ./vertex-ai-key.json \
  --iam-account=vertex-ai-worker@fascinante-digit-1698295291643.iam.gserviceaccount.com \
  --project=fascinante-digit-1698295291643
```

**⚠️ IMPORTANTE:**
- El JSON key NO se sube a Cloudflare Workers
- En su lugar, extraemos el token y lo usamos vía REST API
- O usamos el JSON como secret en Cloudflare (no recomendado por tamaño)

---

### **PASO 3: Obtener Access Token (REST API)**

Para Cloudflare Workers, necesitamos obtener un token OAuth2 vía REST:

```typescript
// Función para obtener token desde Service Account JSON
// Esto se hace UNA VEZ y se cachea el token
async function getAccessToken(serviceAccountKey: {
  client_email: string;
  private_key: string;
}): Promise<string> {
  const jwt = await createJWT(serviceAccountKey);

  const response = await fetch(
    'https://oauth2.googleapis.com/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
}
```

**Problema:** Cloudflare Workers no tiene librerías JWT completas.

**✅ SOLUCIÓN MEJOR: Usar API Key para Vertex AI (si está disponible)**

---

## 🚀 **SOLUCIÓN RECOMENDADA: API Keys para Todo**

### **Opción A: API Key para Vertex AI (PREFERIDO)**

1. **Habilitar API Key para Vertex AI:**
   ```bash
   # En Google Cloud Console
   # APIs & Services → Credentials → Create Credentials → API Key
   # Restrict key to: Vertex AI API
   ```

2. **Usar API Key directamente:**
   ```typescript
   // En Cloudflare Workers
   const response = await fetch(
     `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent?key=${API_KEY}`,
     {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({...})
     }
   );
   ```

### **Opción B: Service Account Token vía Endpoint Intermedio**

Si Vertex AI NO soporta API Keys directamente:

1. Crear un endpoint intermedio (Cloud Function o Next.js API Route)
2. Este endpoint usa Service Account
3. Workers llama a este endpoint

```typescript
// Next.js API Route: /api/vertex-ai/proxy
// Usa Service Account localmente
export async function POST(request: Request) {
  const { VertexAI } = await import('@google-cloud/vertexai');
  const vertexAI = new VertexAI({
    project: process.env.GCP_PROJECT_ID,
    location: process.env.GCP_LOCATION,
  });

  // Llamar Vertex AI
  const result = await vertexAI.generateContent(...);
  return Response.json(result);
}
```

---

## 🔐 **CONFIGURACIÓN EN CLOUDFLARE WORKERS**

### **Variables de Entorno (.dev.vars y Production)**

```bash
# Google Places API (ya configurado)
GOOGLE_PLACES_API_KEY="AIzaSyAEMScRC9II36owSiHKdUpJe2UmkmP2GzA"

# Google Cloud Project
GCP_PROJECT_ID="fascinante-digit-1698295291643"
GCP_LOCATION="us-central1"

# Vertex AI - Opción A: API Key (si disponible)
VERTEX_AI_API_KEY="your-api-key-here"

# Vertex AI - Opción B: Service Account (alternativa)
# VERTEX_AI_SERVICE_ACCOUNT_EMAIL="vertex-ai-worker@fascinante-digit-1698295291643.iam.gserviceaccount.com"
# VERTEX_AI_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..." (como secret multilínea)
```

### **Configurar en Producción:**

```bash
cd apps/api

# Secrets de Cloudflare Workers
wrangler secret put GOOGLE_PLACES_API_KEY
wrangler secret put GCP_PROJECT_ID
wrangler secret put GCP_LOCATION

# Si usas API Key para Vertex AI
wrangler secret put VERTEX_AI_API_KEY

# O si usas Service Account (más complejo)
wrangler secret put VERTEX_AI_SERVICE_ACCOUNT_EMAIL
wrangler secret put VERTEX_AI_PRIVATE_KEY
```

---

## 📊 **VERIFICACIÓN DE CONFIGURACIÓN**

### **Verificar APIs Habilitadas:**

```bash
gcloud services list --enabled \
  --project=fascinante-digit-1698295291643 \
  --filter="name:places OR name:aiplatform"
```

Deberías ver:
- `places-backend.googleapis.com`
- `places-backend-new.googleapis.com`
- `aiplatform.googleapis.com`

### **Verificar Service Account (si lo usas):**

```bash
gcloud iam service-accounts list \
  --project=fascinante-digit-1698295291643

gcloud iam service-accounts get-iam-policy \
  vertex-ai-worker@fascinante-digit-1698295291643.iam.gserviceaccount.com \
  --project=fascinante-digit-1698295291643
```

---

## 🎯 **IMPLEMENTACIÓN EN CÓDIGO**

### **Google Places API (Ya funciona):**

```typescript
// apps/api/src/services/business-audit.ts
const response = await fetch(
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}&key=${this.placesApiKey}`
);
```

### **Vertex AI con API Key:**

```typescript
// apps/api/src/services/business-audit.ts
const response = await fetch(
  `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent?key=${vertexAiApiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ content: prompt }],
      parameters: { temperature: 0.7 }
    })
  }
);
```

---

## ✅ **CHECKLIST DE CONFIGURACIÓN**

### **Usando gcloud CLI (solo para setup):**

- [ ] ✅ Proyecto configurado: `fascinante-digit-1698295291643`
- [ ] ✅ APIs habilitadas:
  - [ ] Places API
  - [ ] Places API (New)
  - [ ] Vertex AI API
- [ ] ✅ API Key creada para Places API
- [ ] ✅ (Opcional) Service Account creado para Vertex AI
- [ ] ✅ Secrets configurados en Cloudflare Workers

### **En Código (Runtime en Workers):**

- [ ] ✅ Usar REST APIs directas (no gcloud CLI)
- [ ] ✅ API Keys en secrets (no en código)
- [ ] ✅ Error handling robusto
- [ ] ✅ Rate limiting configurado

---

## 🚨 **LIMITACIONES Y CONSIDERACIONES**

### **Qué NO funciona en Cloudflare Workers:**
1. ❌ `gcloud` CLI commands
2. ❌ `@google-cloud/vertexai` SDK (requiere Node.js completo)
3. ❌ Service Account JSON files en filesystem
4. ❌ Application Default Credentials

### **Qué SÍ funciona:**
1. ✅ REST APIs directas con Fetch API
2. ✅ API Keys (más simple)
3. ✅ Service Account tokens vía OAuth2 REST (más complejo)
4. ✅ Endpoints proxy (Cloud Function/Next.js)

---

## 💡 **RECOMENDACIÓN FINAL**

**Para Octubre 2025 - Cloudflare Workers + Google Cloud:**

1. **Google Places API:** ✅ Usar API Key (ya configurado)
2. **Vertex AI:**
   - **Opción A (Recomendada):** API Key si está disponible
   - **Opción B:** Proxy endpoint en Next.js que usa Service Account
   - **Opción C:** Service Account token vía REST (más complejo)

**gcloud CLI solo se usa para:**
- ✅ Configuración inicial (habilitar APIs, crear service accounts)
- ✅ Setup y administración
- ❌ NO en runtime de Cloudflare Workers

---

## 📚 **REFERENCIAS**

- [Google Cloud REST APIs](https://cloud.google.com/apis/docs/getting-started)
- [Cloudflare Workers Runtime](https://developers.cloudflare.com/workers/runtime-apis/)
- [Vertex AI REST API](https://cloud.google.com/vertex-ai/docs/reference/rest)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

---

**Última actualización:** Octubre 2025
**Estado:** ✅ Configuración lista para implementación

