# 📋 Lista de APIs: DataForSEO Proxy (data-fascinante)
## Endpoints Disponibles a través de `data.fascinantedigital.com/v3`

---

## 🎯 **CÓMO FUNCIONA EL PROXY**

### **Base URL:**
```
https://data.fascinantedigital.com/v3
```

### **Proxy Universal:**
El worker hace proxy de **CUALQUIER endpoint** de DataForSEO API v3:
```
POST/GET https://data.fascinantedigital.com/v3/{cualquier-endpoint-de-dataforseo}
```

**Ventaja:** No necesitas configurar credenciales DataForSEO, el proxy maneja todo.

---

## 📊 **ENDPOINTS IDENTIFICADOS (Ejemplos de Uso)**

### **1. 🏢 Business Data APIs**

#### **1.1 Google Business Info (Identificado)**
```
POST /v3/business_data/google/my_business_info/live.ai
```
**Qué hace:** Obtiene información básica de un negocio en Google Business
**Ejemplo request:**
```json
{
  "keyword": "restaurant miami",
  "location_name": "Miami, FL, US",
  "language_name": "English"
}
```
**Costo:** ~$0.0054 por request
**Status:** ✅ **En uso/documentado**

---

#### **1.2 Business Listings Search (Identificado)**
```
POST /v3/business_data/business_listings/search/live.ai
```
**Qué hace:** Busca competidores locales (top 20)
**Ejemplo request:**
```json
{
  "keyword": "plumber tampa",
  "location_name": "Tampa, FL, US",
  "limit": 20
}
```
**Costo:** ~$0.0119 por request
**Status:** ✅ **En uso/documentado**

---

#### **1.3 Google Reviews (Identificado)**
```
POST /v3/business_data/google/reviews/task_post
POST /v3/business_data/google/reviews/task_get/{task_id}
```
**Qué hace:** Obtiene todas las reviews de un negocio (hasta 4,900)
**Ejemplo request:**
```json
{
  "location_id": "...",
  "depth": 100
}
```
**Costo:** ~$0.0015 por request
**Tiempo:** Async (30-60 segundos)
**Status:** ✅ **Mencionado en análisis**

---

### **2. 🔍 SEO Data APIs**

#### **2.1 Ranked Keywords (Identificado)**
```
POST /v3/dataforseo_labs/google/ranked_keywords/live.ai
```
**Qué hace:** Obtiene keywords posicionadas de un dominio
**Ejemplo request:**
```json
{
  "target": "restaurantexample.com",
  "location_code": 2840,
  "language_code": "en"
}
```
**Costo:** ~$0.02 por request
**Status:** ✅ **Mencionado en análisis de integración**

---

#### **2.2 Keyword Overview**
```
POST /v3/dataforseo_labs/google/keyword_overview/live.ai
```
**Qué hace:** Overview de métricas SEO de una keyword
**Ejemplo request:**
```json
{
  "keyword": "best restaurant miami",
  "location_code": 2840,
  "language_code": "en"
}
```
**Costo:** ~$0.02 por request
**Status:** ⚠️ **No confirmado, pero probable**

---

#### **2.3 Keyword Ideas**
```
POST /v3/dataforseo_labs/google/keyword_ideas/live.ai
```
**Qué hace:** Sugiere keywords relacionadas y oportunidades SEO
**Ejemplo request:**
```json
{
  "keyword": "restaurant miami",
  "location_code": 2840,
  "include_serp_info": true
}
```
**Costo:** ~$0.02 por request
**Status:** ✅ **Mencionado en análisis de integración**

---

#### **2.4 On-Page SEO**
```
POST /v3/on_page/task_post
POST /v3/on_page/task_get/{task_id}
```
**Qué hace:** Auditoría técnica on-page SEO
**Ejemplo request:**
```json
{
  "target": "restaurantexample.com",
  "max_crawl_pages": 100
}
```
**Costo:** ~$0.001 por página
**Tiempo:** Async (puede tardar minutos)
**Status:** ✅ **Mencionado en análisis de integración**

---

#### **2.5 Domain Rank**
```
POST /v3/dataforseo_labs/google/domain_rank_overview/live.ai
```
**Qué hace:** Obtiene Domain Authority/rank de un dominio
**Ejemplo request:**
```json
{
  "target": "restaurantexample.com"
}
```
**Costo:** ~$0.02 por request
**Status:** ✅ **Mencionado en análisis de integración**

---

### **3. 🔄 Cualquier Endpoint DataForSEO (Proxy Universal)**

**El proxy funciona con TODOS los endpoints de DataForSEO API v3:**

```
/v3/business_data/google/my_business_info/live.ai ✅
/v3/business_data/business_listings/search/live.ai ✅
/v3/business_data/google/reviews/task_post ✅
/v3/business_data/google/reviews/task_get/{id} ✅
/v3/dataforseo_labs/google/ranked_keywords/live.ai ✅
/v3/dataforseo_labs/google/keyword_overview/live.ai ⚠️
/v3/dataforseo_labs/google/keyword_ideas/live.ai ✅
/v3/dataforseo_labs/google/domain_rank_overview/live.ai ✅
/v3/on_page/task_post ✅
/v3/on_page/task_get/{id} ✅
/v3/business_data/bing/business_info/live.ai ⚠️
/v3/business_data/yelp/search/live.ai ⚠️
/v3/serp/google/organic/live.ai ⚠️
/v3/serp/google/local_pack/live.ai ⚠️
... y MUCHOS MÁS
```

---

## 📚 **CATEGORÍAS DE ENDPOINTS DISPONIBLES**

### **Según DataForSEO API v3, estas categorías están disponibles:**

#### **🏢 Business Data:**
- Google Business Profile info
- Business listings search
- Reviews (Google, Yelp, Facebook)
- Competitors analysis
- Business details

#### **🔍 SEO & Keywords:**
- Ranked keywords
- Keyword overview
- Keyword ideas/suggestions
- Keyword difficulty
- Search volume

#### **📊 SERP Analysis:**
- Organic results
- Local pack
- Featured snippets
- Knowledge graph
- People also ask

#### **🌐 On-Page SEO:**
- Page audit
- Technical SEO
- Content analysis
- Images optimization
- Links analysis

#### **🔗 Backlinks:**
- Backlinks overview
- Referring domains
- Anchor text analysis
- Toxic links detection

#### **📈 Rank Tracking:**
- Rankings history
- Position changes
- Competitor rankings
- SERP features tracking

---

## 🔍 **ENDPOINTS CONFIRMADOS EN USO**

### **Endpoints que SÍ sabemos que están siendo usados:**

| Endpoint | Propósito | Costo | Estado |
|----------|-----------|-------|--------|
| `/business_data/google/my_business_info/live.ai` | Info básica negocio | $0.0054 | ✅ Confirmado |
| `/business_data/business_listings/search/live.ai` | Buscar competidores | $0.0119 | ✅ Confirmado |
| `/business_data/google/reviews/task_post` | Reviews completas | $0.0015 | ✅ Mencionado |
| `/dataforseo_labs/google/ranked_keywords/live.ai` | Keywords posicionadas | $0.02 | ✅ Mencionado |
| `/dataforseo_labs/google/keyword_ideas/live.ai` | Oportunidades SEO | $0.02 | ✅ Mencionado |
| `/dataforseo_labs/google/domain_rank_overview/live.ai` | Domain Authority | $0.02 | ✅ Mencionado |
| `/on_page/task_post` | Auditoría técnica | ~$0.001 | ✅ Mencionado |

---

## 💡 **CÓMO DESCUBRIR TODOS LOS ENDPOINTS**

### **Método 1: Documentación DataForSEO**
```
https://docs.dataforseo.com/
```
- Lista completa de endpoints
- Ejemplos de requests
- Costos por endpoint

### **Método 2: Probar el Proxy**
```bash
# El proxy acepta CUALQUIER endpoint de DataForSEO
curl -X POST https://data.fascinantedigital.com/v3/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{...}'

# Si funciona → Endpoint disponible
# Si 404 → Endpoint no existe en DataForSEO API
```

### **Método 3: Revisar Logs del Worker**
```bash
wrangler tail dataforseo-proxy
# Ver qué endpoints se están llamando
```

---

## 🎯 **ENDPOINTS MÁS ÚTILES PARA AUDITORÍAS**

### **Para Auditoría Completa de Negocio:**

1. **Business Info** (`/business_data/google/my_business_info/live.ai`)
   - Rating, reviews, ubicación

2. **Competitors** (`/business_data/business_listings/search/live.ai`)
   - Top competidores locales

3. **Reviews** (`/business_data/google/reviews/task_post`)
   - Todas las reviews (4,900 max)

4. **Ranked Keywords** (`/dataforseo_labs/google/ranked_keywords/live.ai`)
   - Keywords posicionadas del dominio

5. **Domain Rank** (`/dataforseo_labs/google/domain_rank_overview/live.ai`)
   - Domain Authority

6. **Keyword Ideas** (`/dataforseo_labs/google/keyword_ideas/live.ai`)
   - Oportunidades SEO

7. **On-Page SEO** (`/on_page/task_post`)
   - Auditoría técnica

---

## 📋 **EJEMPLO DE USO COMPLETO**

### **Auditoría Premium (7 Endpoints):**

```typescript
// 1. Business Info
const businessInfo = await fetch(
  'https://data.fascinantedigital.com/v3/business_data/google/my_business_info/live.ai',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Plan': 'premium'
    },
    body: JSON.stringify({
      keyword: 'restaurant miami',
      location_name: 'Miami, FL, US'
    })
  }
);

// 2. Competitors
const competitors = await fetch(
  'https://data.fascinantedigital.com/v3/business_data/business_listings/search/live.ai',
  { ... }
);

// 3. Ranked Keywords
const keywords = await fetch(
  'https://data.fascinantedigital.com/v3/dataforseo_labs/google/ranked_keywords/live.ai',
  { ... }
);

// ... etc para los demás endpoints
```

---

## ✅ **RESUMEN**

### **Endpoints Confirmados:** 7
### **Endpoints Disponibles:** **TODO DataForSEO API v3** (100+ endpoints)
### **Costo Total Auditoría Premium:** ~$0.08-0.13
### **Tiempo:** 2-3 segundos (síncrono) o 30-60 min (async)

### **Cómo usar:**
- ✅ URL base: `https://data.fascinantedigital.com/v3`
- ✅ Método: POST (mayoría) o GET (algunos)
- ✅ Headers: `X-User-Plan` (free/pro/premium), `X-Force-Refresh` (opcional)
- ✅ Auth: Manejada por el proxy (no necesitas credenciales)

---

## 🔗 **RECURSOS**

- [DataForSEO API Docs](https://docs.dataforseo.com/)
- [DataForSEO Pricing](https://dataforseo.com/pricing)
- Proxy Worker: `dataforseo-proxy` en Cloudflare

---

**Última actualización:** Octubre 2025
**Proxy URL:** `https://data.fascinantedigital.com/v3`
**Status:** ✅ Proxy universal - acepta cualquier endpoint DataForSEO API v3
