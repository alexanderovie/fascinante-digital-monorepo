# 🚀 Recomendaciones Elite: API para Auditoría de Negocio Gratis
## Octubre 2025 - Google Cloud Platform

---

## 📊 **Resumen Ejecutivo**

Para ofrecer una **auditoría inicial gratis** solo con el nombre del negocio, recomiendo una **arquitectura híbrida** que combina múltiples APIs de Google Cloud con procesamiento inteligente.

### 🎯 **Stack Recomendado (Elite Tier)**

```
Google Places API (Text Search)
    ↓
Google Business Profile API
    ↓
Google Knowledge Graph API
    ↓
Vertex AI (Gemini 2.0) - Análisis & Generación de Reporte
    ↓
Cloud Functions (Node.js) - Orquestación
```

---

## 🔥 **Opción 1: Google Places API + Vertex AI (RECOMENDADA)**

### **Por qué es Elite (2025)**

✅ **Mejor relación costo/prestación**
✅ **Datos en tiempo real** (reviews, rating, ubicación)
✅ **Escalable** (cuotas generosas)
✅ **Integración nativa con Google Cloud**
✅ **Vertex AI para análisis inteligente automático**

### **Implementación**

```typescript
// 1. Buscar negocio por nombre
const placesResponse = await fetch(
  `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${businessName}&key=${PLACES_API_KEY}`
);

// 2. Obtener detalles completos
const placeId = placesResponse.results[0].place_id;
const detailsResponse = await fetch(
  `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,website,phone_number,business_status,opening_hours,types&key=${PLACES_API_KEY}`
);

// 3. Analizar con Vertex AI (Gemini 2.0)
const auditInsights = await vertexAI.analyze({
  businessData: detailsResponse.result,
  prompt: "Generate a digital marketing audit in Spanish..."
});
```

### **Datos que puedes obtener:**
- ✅ Rating y número de reviews
- ✅ Reviews completos (últimos 5)
- ✅ Website y redes sociales
- ✅ Horarios de atención
- ✅ Categoría del negocio
- ✅ Estado de verificación Google Business
- ✅ Fotos del negocio
- ✅ Ubicación y área de servicio

### **Costos (Octubre 2025)**
- **Places API Text Search**: $32 USD por 1,000 requests
- **Places API Details**: $17 USD por 1,000 requests
- **Vertex AI Gemini 2.0**: ~$0.01-0.05 por auditoría generada
- **Total estimado**: ~$0.05-0.06 USD por auditoría

---

## 🔥 **Opción 2: Google Business Profile API (Para negocios verificados)**

### **Cuándo usar:**
- Si quieres datos **más profundos** (insights, estadísticas internas)
- Para negocios que ya tienen **Business Profile configurado**
- Requiere **OAuth 2.0** del dueño del negocio

### **Ventajas:**
- ✅ Datos internos de Google Business
- ✅ Estadísticas de búsquedas
- ✅ Insights de engagement
- ✅ Action stats (llamadas, direcciones, website clicks)

### **Limitación:**
⚠️ Solo funciona si el negocio te da acceso a su Business Profile API

---

## 🔥 **Opción 3: Google Knowledge Graph Search API**

### **Cuándo usar:**
- Para negocios **muy conocidos** (marcas grandes, empresas públicas)
- Información estructurada de Wikipedia/Wikidata
- Datos históricos y enlaces relacionados

### **Limitación:**
⚠️ No funciona bien para negocios pequeños/locales

---

## 💡 **Arquitectura Recomendada Completa**

### **Flujo del Usuario:**

```
1. Usuario ingresa "Nombre del Negocio"
   ↓
2. Frontend → API Route (Next.js)
   ↓
3. Cloud Function (GCP) o Cloudflare Worker
   ↓
4. Google Places API (buscar negocio)
   ↓
5. Vertex AI Gemini 2.0:
   - Analiza reviews
   - Identifica problemas de SEO/local
   - Genera insights de branding
   - Evalúa presencia digital
   ↓
6. Genera PDF/HTML del reporte
   ↓
7. Envía email con reporte + sigue el lead en CRM
```

### **Stack Tecnológico:**

```typescript
// apps/api/src/services/audit-service.ts

import { GooglePlacesService } from './google-places';
import { VertexAIService } from './vertex-ai';
import { generateAuditPDF } from './pdf-generator';

export class BusinessAuditService {
  async generateFreeAudit(businessName: string) {
    // 1. Buscar negocio
    const places = new GooglePlacesService();
    const business = await places.searchBusiness(businessName);

    if (!business) {
      throw new Error('Business not found');
    }

    // 2. Enriquecer datos
    const details = await places.getBusinessDetails(business.place_id);
    const reviews = details.reviews || [];

    // 3. Analizar con AI
    const ai = new VertexAIService();
    const analysis = await ai.analyzeBusiness({
      name: business.name,
      rating: business.rating,
      reviews: reviews,
      website: details.website,
      categories: details.types,
      verified: details.business_status === 'OPERATIONAL'
    });

    // 4. Generar reporte
    const report = {
      business: business,
      insights: analysis,
      recommendations: analysis.recommendations,
      score: analysis.overallScore
    };

    // 5. PDF (opcional)
    const pdf = await generateAuditPDF(report);

    return { report, pdf };
  }
}
```

---

## 🎯 **Casos de Uso Específicos**

### **1. Auditoría SEO Local**
- Presencia en Google Maps
- Calidad de Business Profile
- Optimización de categorías
- Keywords en nombre/descripción

### **2. Auditoría de Reputación**
- Sentiment analysis de reviews
- Tendencias de rating
- Respuestas a reviews
- Competencia local

### **3. Auditoría de Branding Digital**
- Consistencia de nombre
- Presencia en múltiples plataformas
- Calidad de imágenes
- Información actualizada

---

## 📦 **Implementación Práctica**

### **Servicio Google Places:**

```typescript
// apps/api/src/services/google-places.ts

export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchBusiness(name: string): Promise<PlaceResult | null> {
    const url = `${this.baseUrl}/textsearch/json?query=${encodeURIComponent(name)}&key=${this.apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    return null;
  }

  async getBusinessDetails(placeId: string) {
    const fields = [
      'name',
      'rating',
      'reviews',
      'website',
      'formatted_phone_number',
      'business_status',
      'opening_hours',
      'types',
      'photos',
      'address_components'
    ].join(',');

    const url = `${this.baseUrl}/details/json?place_id=${placeId}&fields=${fields}&key=${this.apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    return data.result;
  }
}
```

### **Servicio Vertex AI:**

```typescript
// apps/api/src/services/vertex-ai.ts

import { VertexAI } from '@google-cloud/vertexai';

export class VertexAIService {
  private vertexAI: VertexAI;

  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.GCP_PROJECT_ID!,
      location: 'us-central1'
    });
  }

  async analyzeBusiness(data: BusinessData) {
    const model = this.vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp', // Latest as of Oct 2025
    });

    const prompt = `
Analiza el siguiente negocio y genera una auditoría de marketing digital:

Nombre: ${data.name}
Rating: ${data.rating}/5
Website: ${data.website || 'No disponible'}
Categorías: ${data.categories.join(', ')}
Reviews recientes:
${data.reviews.slice(0, 5).map(r => `- ${r.text} (${r.rating}/5)`).join('\n')}

Genera:
1. Score general (0-100)
2. Problemas identificados
3. Oportunidades de mejora
4. Recomendaciones prioritarias
5. Análisis de sentimiento de reviews

Responde en formato JSON en español.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return JSON.parse(response.text());
  }
}
```

---

## 💰 **Análisis de Costos**

### **Escenario: 100 auditorías/mes**

| Servicio | Costo/1K | Uso mensual | Costo mensual |
|----------|----------|-------------|---------------|
| Places Text Search | $32 | 100 requests | $3.20 |
| Places Details | $17 | 100 requests | $1.70 |
| Vertex AI Gemini | ~$0.02 | 100 análisis | $2.00 |
| **TOTAL** | - | - | **~$6.90/mes** |

### **ROI:**
- **Costo por auditoría**: $0.069
- **Valor de lead calificado**: $50-500 USD
- **ROI potencial**: 725x - 7,250x

---

## 🔐 **Configuración GCP**

### **1. Habilitar APIs necesarias:**

```bash
gcloud services enable \
  places-backend.googleapis.com \
  aiplatform.googleapis.com \
  cloudfunctions.googleapis.com
```

### **2. Crear Service Account:**

```bash
gcloud iam service-accounts create audit-service \
  --display-name="Business Audit Service"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:audit-service@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### **3. Variables de entorno:**

```env
GOOGLE_PLACES_API_KEY=tu_api_key_aqui
GCP_PROJECT_ID=tu-project-id
GCP_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-2.0-flash-exp
```

---

## 🚀 **Próximos Pasos**

1. ✅ Configurar Google Cloud Project
2. ✅ Obtener Places API Key
3. ✅ Crear endpoint `/api/audit/free`
4. ✅ Integrar Vertex AI
5. ✅ Generar template de reporte PDF
6. ✅ Sistema de email automático
7. ✅ Tracking de conversión

---

## 📚 **Recursos**

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Vertex AI Gemini Docs](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Google Business Profile API](https://developers.google.com/my-business/content/overview)

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
