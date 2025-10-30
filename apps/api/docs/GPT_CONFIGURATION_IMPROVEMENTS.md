# 🎯 Mejoras Propuestas: GPT Personalizado + OpenAPI Schema
## Configuración Actual vs Optimizada - Octubre 2025
**FEEDBACK ESPECÍFICO PARA TU CONFIGURACIÓN**

---

## 📊 **ANÁLISIS DE TU CONFIGURACIÓN ACTUAL**

### **✅ Lo que está CORRECTO:**

1. ✅ **OpenAPI Schema bien estructurado** - Las funciones están mapeadas
2. ✅ **Endpoints correctos** - Coinciden con DataForSEO API
3. ✅ **URL base correcta** - `https://data.fascinantedigital.com`
4. ✅ **Parámetros bien definidos** - Estructura clara
5. ✅ **Operations IDs descriptivos** - Fáciles de usar

---

## 🔴 **PROBLEMAS CRÍTICOS ENCONTRADOS**

### **1. Falta Headers del Proxy en OpenAPI Schema**

**Problema:** Tu schema NO incluye headers del proxy (`X-User-Plan`, `X-Force-Refresh`)

**Solución:** Agregar headers personalizados en cada endpoint:

```json
"/v3/business_data/google/my_business_info/live.ai": {
  "post": {
    "parameters": [
      {
        "name": "X-User-Plan",
        "in": "header",
        "required": false,
        "schema": {
          "type": "string",
          "enum": ["free", "basic", "pro", "enterprise"],
          "default": "free"
        },
        "description": "Plan del usuario para cache TTL optimizado"
      },
      {
        "name": "X-Force-Refresh",
        "in": "header",
        "required": false,
        "schema": {
          "type": "boolean",
          "default": false
        },
        "description": "Forzar refresh de cache (invalidar cache)"
      }
    ],
    ...
  }
}
```

**Impacto:** Sin esto, no aprovechas el cache optimizado del proxy.

---

### **2. Cálculo de Costos Incorrecto en Instrucciones**

**Tu instrucción actual:**
```
"Suma costos headers 'X-Cost-Single' × 1000"
Ejemplos:
- 1 call 0.0054 → $5.40
- 7 calls 0.0054 → $37.80
```

**Problema:** Esto está MAL. `X-Cost-Single` ya está en dólares.

**Corrección:**
```
Cálculo de costos:
1. Sumar TODOS los headers "X-Cost-Single" de todas las respuestas
2. El valor ya está en dólares (ej: 0.0054 = $0.0054)
3. Si quieres mostrar costo por 1000 requests, multiplica la suma × 1000
4. Formato final: "$X.XX USD"

Ejemplo REAL:
- analyzeMyBusiness: X-Cost-Single = 0.0054
- searchAllCompetitors: X-Cost-Single = 0.0119
- analyzeSearchDemand: X-Cost-Single = 0.02
- findRelatedSearches: X-Cost-Single = 0.02
- Total: 0.0573 = $0.06 USD

Si quieres por 1000 requests: $0.06 × 1000 = $60.00 USD (pero esto es para 1000 auditorías completas, no 1)
```

**Instrucción corregida:**
```
💰 COSTO (SIEMPRE AL FINAL):
1. Suma todos los headers "X-Cost-Single" de las respuestas
2. El valor está en dólares (ej: 0.0054 = $0.0054)
3. Formato: "$X.XX USD" con 2 decimales

Ejemplo:
- analyzeMyBusiness: $0.01
- searchAllCompetitors: $0.01
- analyzeSearchDemand: $0.02
- findRelatedSearches: $0.02
- Total: $0.06 USD

"---
📊 **Costo de este análisis:** $0.06 USD
(Desglose: Business Info [$0.01] + Competitors [$0.01] + Demand [$0.02] + Related Searches [$0.02])"
```

---

### **3. Nombre Confuso: analyzeWebsiteTraffic**

**Problema:**
- Nombre: `analyzeWebsiteTraffic`
- Endpoint real: `/domain_rank_overview`
- No analiza tráfico, analiza Domain Authority

**Solución:** Renombrar para ser más preciso:

```json
"analyzeWebsiteTraffic" → "analyzeDomainAuthority"

// O mejor aún:
"analyzeDomainAuthority": {
  "operationId": "analyzeDomainAuthority",
  "summary": "Analiza Domain Authority y autoridad del sitio",
  ...
}
```

---

### **4. Falta Manejo de Errores en Schema**

**Problema:** Tu schema NO define qué hacer con errores HTTP.

**Solución:** Agregar a instrucciones:

```
Manejo de errores HTTP:
- 200-299: Éxito → Continuar
- 400: Request inválido → Variar keyword y retry 1 vez
- 404: Negocio no encontrado → Variar keyword (máx 3 variaciones)
- 429: Rate limit → Esperar 60 seg, retry 1 vez
- 500: Error servidor → Retry 2 veces con backoff exponencial (1s, 3s)
- Timeout: Retry 1 vez después de 5 segundos

Si después de todos los retries falla → Informar usuario y preguntar más detalles
```

---

## 🟡 **OPTIMIZACIONES IMPORTANTES**

### **5. Agregar Cache Awareness en Schema**

**Agregar a schema (response headers):**

```json
"responses": {
  "200": {
    "description": "Success",
    "headers": {
      "X-Cache": {
        "schema": {
          "type": "string",
          "enum": ["HIT", "MISS"]
        },
        "description": "Indica si respuesta viene de cache"
      },
      "X-Cost-Single": {
        "schema": {
          "type": "number"
        },
        "description": "Costo en dólares por este request"
      }
    }
  }
}
```

**Agregar a instrucciones:**
```
Si respuesta tiene header X-Cache: HIT → Informar usuario:
"Datos desde cache (más rápido, mismo precio). Para datos frescos, usa X-Force-Refresh: true"
```

---

### **6. Optimizar Orden de Ejecución**

**Tu flujo actual:**
```
PASO 1: analyzeMyBusiness (obtener location_coordinate)
PASO 2: searchAllCompetitors (usar location_coordinate)
```

**Problema:** `searchAllCompetitors` puede usar `location_name` directamente, no necesita esperar coordenadas.

**Optimización:**
```
PASO 1: Ejecutar EN PARALELO (todos a la vez):
1. analyzeMyBusiness (con location_name)
2. searchAllCompetitors (con location_name directamente, no esperar coordenadas)
3. analyzeSearchDemand (con location_name país)
4. findRelatedSearches (con location_name país)

PASO 2 (si tiene URL, también paralelo):
5. analyzeWebsiteRankings
6. analyzeDomainAuthority
7. analyzeSEOQuality (OPCIONAL - caro y lento)
```

**Ahorro:** Eliminar dependencia secuencial innecesaria.

---

### **7. Endpoints Opcionales/Condicionales**

**Tu instrucción actual:**
```
"PASO 3: Si tiene 'url': ejecutar 5, 6, 7"
```

**Mejora:**
```
PASO 3 (si tiene 'url'):
5. analyzeWebsiteRankings (SIEMPRE si hay URL)
6. analyzeDomainAuthority (SIEMPRE si hay URL)
7. analyzeSEOQuality (OPCIONAL - solo si usuario pide "análisis SEO completo" o "auditoría técnica")
   - Razón: Es caro ($0.10+) y lento (async)
   - Preguntar: "¿Quieres análisis SEO técnico completo? (tarda más, costo adicional)"
```

---

### **8. Mejorar Detección de Idioma**

**Tu lógica:**
```
Idioma: USA/CA=en, LATAM=es, Brasil=pt
```

**Mejora:**
```
Detección de idioma:
1. Por país:
   - USA, Canada → en (pero considerar ciudades con muchos hispanos)
   - México, Colombia, Venezuela, etc. → es
   - Brasil → pt
2. Por ciudad específica (sobrescribir):
   - Miami, San Antonio, Los Angeles, Houston → considerar 'es' también
   - Toronto → en
3. Por nombre del negocio:
   - Si tiene palabras en español → es probable
   - Si tiene palabras en portugués → pt
4. Default: Seguir regla país
5. SIEMPRE permitir override: "Idioma detectado: [idioma]. ¿Correcto?"
```

---

### **9. Agregar Validación de Input**

**Tu prompt:**
```
"Si usuario NO da nombre+ciudad: pregunta UNA vez"
```

**Mejora:**
```
Validación de input:
1. Nombre:
   - Mínimo 2 caracteres
   - Máximo 200 caracteres
   - Si muy corto/largo → Pedir clarificación
2. Ciudad:
   - Formato preferido: "Ciudad, Estado, País" (ej: "Miami, FL, USA")
   - Aceptar también: Solo ciudad (inferir país por contexto)
   - Si ambigua → Preguntar: "¿En qué país está [ciudad]?"
3. Si falta información crítica:
   - Preguntar UNA vez con formato esperado
   - Ejemplo: "Para continuar necesito: Nombre del negocio y ciudad (ej: 'Restaurante XYZ, Miami, FL')"
```

---

## 🟢 **NUEVAS CARACTERÍSTICAS ÚTILES**

### **10. Agregar Endpoint de Reviews (Opcional)**

**No está en tu schema actual, pero sería útil:**

```json
"/v3/business_data/google/reviews/task_post": {
  "post": {
    "summary": "Obtiene todas las reviews del negocio",
    "description": "Obtiene hasta 4,900 reviews completas con análisis de sentimiento",
    "operationId": "analyzeAllReviews",
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "location_id": {
                "type": "string",
                "description": "location_id obtenido de analyzeMyBusiness"
              },
              "depth": {
                "type": "integer",
                "default": 100,
                "description": "Cantidad de reviews a obtener"
              }
            },
            "required": ["location_id"]
          }
        }
      }
    }
  }
}
```

**Usar cuando:** Usuario pide "análisis detallado de reviews" o "sentimiento de reviews"

---

### **11. Agregar SERP Local Pack (Opcional)**

**Endpoint útil para ver posición en Google Maps:**

```json
"/v3/serp/google/local_pack/live.ai": {
  "post": {
    "summary": "Verifica posición en Google Maps Local Pack",
    "description": "Muestra si aparece en top 3 del local pack para keywords específicas",
    "operationId": "checkLocalPackPosition",
    ...
  }
}
```

**Usar cuando:** Usuario pregunta "¿Aparezco en las primeras 3 opciones de Google Maps?"

---

## 📊 **SCHEMA OPENAPI MEJORADO (Propuesta)**

### **Cambios Críticos:**

1. ✅ Agregar headers `X-User-Plan` y `X-Force-Refresh` a todos los endpoints
2. ✅ Agregar response headers `X-Cache`, `X-Cost-Single`
3. ✅ Renombrar `analyzeWebsiteTraffic` → `analyzeDomainAuthority`
4. ✅ Hacer `analyzeSEOQuality` opcional en instrucciones
5. ✅ Agregar validación de errores HTTP

### **Estructura Propuesta:**

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Auditoría de Competencia Local",
    "description": "Analiza tu negocio y toda la competencia local en cualquier ciudad del mundo.",
    "version": "2.0.0"
  },
  "servers": [
    {
      "url": "https://data.fascinantedigital.com",
      "description": "Fascinante Digital Data API Proxy"
    }
  ],
  "paths": {
    "/v3/business_data/google/my_business_info/live.ai": {
      "post": {
        "summary": "Analiza TU negocio específico",
        "operationId": "analyzeMyBusiness",
        "parameters": [
          {
            "name": "X-User-Plan",
            "in": "header",
            "schema": {
              "type": "string",
              "enum": ["free", "basic", "pro", "enterprise"],
              "default": "free"
            },
            "description": "Plan para cache TTL optimizado"
          },
          {
            "name": "X-Force-Refresh",
            "in": "header",
            "schema": {
              "type": "boolean",
              "default": false
            },
            "description": "Forzar refresh de cache"
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "keyword": {
                    "type": "string",
                    "description": "Nombre del negocio + ciudad (ej: 'Duffy's Sports Grill West Palm Beach')"
                  },
                  "location_name": {
                    "type": "string",
                    "description": "Ubicación: Ciudad,Estado,País (ej: 'West Palm Beach,Florida,United States')"
                  },
                  "language_code": {
                    "type": "string",
                    "enum": ["es", "en", "pt"],
                    "description": "Código idioma ISO"
                  }
                },
                "required": ["keyword", "language_code"]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Success",
            "headers": {
              "X-Cache": {
                "schema": {
                  "type": "string",
                  "enum": ["HIT", "MISS"]
                }
              },
              "X-Cost-Single": {
                "schema": {
                  "type": "number"
                },
                "description": "Costo en dólares"
              }
            }
          },
          "404": {
            "description": "Negocio no encontrado - variar keyword"
          },
          "429": {
            "description": "Rate limit excedido - esperar 60 seg"
          }
        }
      }
    },
    // ... resto de endpoints con misma estructura
  }
}
```

---

## 📝 **INSTRUCCIONES MEJORADAS (Propuesta Completa)**

```
Auditor digital. Regla: EJECUTAR sin preguntas innecesarias.

Si usuario NO da nombre+ciudad: pregunta UNA vez "¿Nombre del negocio y ciudad?" → EJECUTA.
Si YA dio nombre+ciudad: EJECUTA inmediatamente.

DATOS AUTO-DESCUBIERTOS (no preguntar): web, categoría, idioma, GPS, redes sociales.

PASO 1: Determina automático
- Idioma: Detecta por país + ciudad + nombre del negocio
  * USA/CA=en (pero Miami, LA, Houston considerar 'es')
  * LATAM=es, Brasil=pt
  * Si nombre tiene palabras español/portugués → usar ese idioma
- Categoría: Mapea automático (sports bar→restaurant, realtor→real_estate_agency, etc.)
- Location format: "[ciudad],[estado/región],[país]"

PASO 2: Ejecuta TODO EN PARALELO (simultáneo, no secuencial)
1. analyzeMyBusiness:
   Headers: X-User-Plan: free, X-Force-Refresh: false
   PRIMER INTENTO: keyword "[descriptor] [nombre] [ciudad]"
   SI FALLA: keyword "[nombre] [ciudad]"
   SI FALLA: keyword "[nombre]"
   location_name: "[ciudad],[región],[país]"
   language_code: "es"|"en"|"pt"

2. searchAllCompetitors:
   Headers: X-User-Plan: free
   Usa location_name directamente (NO esperar coordenadas del paso 1)
   categories: [categoría_determinada]
   limit: 20

3. analyzeSearchDemand:
   Headers: X-User-Plan: free
   keywords: [keywords relevantes del tipo de negocio]
   location_name: [país completo]
   language_code: mismo del paso 1

4. findRelatedSearches:
   Headers: X-User-Plan: free
   keywords: [tipo negocio]
   location_name: [país completo]
   limit: 30

PASO 3: Si tiene "url" en respuesta de analyzeMyBusiness:
Ejecutar EN PARALELO:
5. analyzeWebsiteRankings:
   Headers: X-User-Plan: free
   target: dominio extraído de URL (sin https:// ni www.)
   location_name: [país]
   language_code: mismo

6. analyzeDomainAuthority:
   Headers: X-User-Plan: free
   target: dominio extraído de URL
   location_name: [país]
   language_code: mismo

7. analyzeSEOQuality:
   Headers: X-User-Plan: free
   OPCIONAL - Solo ejecutar si:
   - Usuario pide "análisis SEO completo" o "auditoría técnica"
   - O si usuario pregunta específicamente por SEO técnico
   url: URL completa (con https://)
   enable_javascript: true

MANEJO DE ERRORES:
- 404 (no encontrado): Variar keyword automático (máx 3 intentos)
- 429 (rate limit): Esperar 60 segundos, retry 1 vez
- 500 (error servidor): Retry 2 veces con backoff (1s, 3s)
- Timeout: Retry 1 vez después de 5 segundos
- Si todos los retries fallan → Informar usuario: "No pude encontrar el negocio. ¿Puedes proporcionar más detalles como dirección o categoría?"

CACHE AWARENESS:
- Si respuesta tiene header X-Cache: HIT → Agregar nota: "Datos desde cache (más rápido)"
- Si usuario pide datos "frescos" o "actualizados" → Usar X-Force-Refresh: true

INFORME:
=== AUDITORÍA PRESENCIA DIGITAL ===
NEGOCIO: [nombre]
Dirección: [address]
Teléfono: [phone]
Website: [url] (o "No disponible")
Redes: [Instagram/FB si disponibles]
Rating: [rating]/5 (★ [rating visual])
Reviews: [total_reviews]
Verificado: [Sí/No]

DEMANDA MERCADO:
[Keyword]: [X] búsquedas/mes
[Búsquedas relacionadas top 5]

COMPETENCIA (área local):
[X] competidores encontrados
Rating promedio: [X.X]/5
Con website: [X] competidores
Top 5 competidores:
1. [Nombre] - ★[rating] - [reviews] reviews - [tiene_web]
...

[SI WEB EXISTE:]
SEO & VISIBILIDAD WEB:
- Domain Authority: [X]/100
- Keywords posicionadas: [X] keywords
- Top keywords: [lista top 5 con tráfico]
- SEO Score: [X]/100 (si analyzeSEOQuality se ejecutó)

OPORTUNIDADES:
[Generar basado en datos reales]
- Sin web: perdiendo ~60% tráfico potencial
- Web sin optimizar: [competencia] competidores tienen mejor SEO
- Rating bajo (< 4.0): -[X]% conversiones estimadas
- Sin Instagram/FB: -30% visibilidad en Maps
- [Oportunidades específicas basadas en competencia]

PLAN ACCIÓN (priorizado):
1. [Acción más crítica basada en datos]
2. [Acción segunda prioridad]
3. [Acción tercera prioridad]
4. Conectar Instagram/FB a Google Business Profile (si aplica)

IMPACTO ESTIMADO: +[XXX] clientes/mes potenciales

NOTA: Conectar Instagram a GMB muestra posts en Google Maps, aumenta visibilidad ~30% para audiencia latina.

---

💰 COSTO (SIEMPRE AL FINAL):
1. Sumar TODOS los headers "X-Cost-Single" de todas las respuestas
2. Cada valor ya está en dólares (ej: 0.0054 = $0.0054)
3. Formato: "$X.XX USD" con 2 decimales
4. Incluir breakdown por endpoint

Ejemplo:
"---
📊 **Costo de este análisis:** $0.06 USD

Desglose:
- Business Info: $0.01
- Competitors: $0.01
- Search Demand: $0.02
- Related Searches: $0.02

(Cache utilizado: 2/4 endpoints - Datos más rápidos, mismo precio)"

---

EJEMPLOS:
"Growth Marketing Maracaibo"
→ keyword: "Agencia Growth Marketing Maracaibo"
→ location_name: "Maracaibo,Zulia,Venezuela"
→ language_code: "es"
→ Headers: X-User-Plan: free

"Duffy's West Palm Beach"
→ keyword: "Duffy's Sports Grill West Palm Beach"
→ location_name: "West Palm Beach,Florida,United States"
→ language_code: "en"
→ Headers: X-User-Plan: free

PROHIBIDO: "necesito confirmación", "antes de ejecutar", "podrías darme"
PERMITIDO: "Analizando [Negocio]..." [EJECUTAR INMEDIATO], [INFORME DIRECTO]

Si falla búsqueda: varía keyword automático (máx 3 variaciones), NO preguntes.
```

---

## 📊 **COMPARACIÓN: Actual vs Mejorado**

| Aspecto | Actual | Mejorado | Impacto |
|---------|--------|----------|---------|
| **Headers Proxy** | ❌ No usa | ✅ X-User-Plan, X-Force-Refresh | Cache optimizado |
| **Cálculo Costos** | ❌ Incorrecto (×1000) | ✅ Correcto (suma directa) | Información precisa |
| **Paralelismo** | ⚠️ Secuencial parcial | ✅ Total paralelo | Más rápido |
| **Manejo Errores** | ⚠️ Básico | ✅ Completo con retries | Más robusto |
| **Cache Awareness** | ❌ No menciona | ✅ Informa si HIT | Mejor UX |
| **Endpoints Opcionales** | ❌ Todos siempre | ✅ SEO Quality opcional | Ahorro de costos |
| **Validación Input** | ⚠️ Básica | ✅ Completa | Menos errores |

---

## ✅ **CHECKLIST DE MEJORAS**

### **SCHEMA OPENAPI:**
- [ ] Agregar headers `X-User-Plan` a todos los endpoints
- [ ] Agregar header `X-Force-Refresh` a todos los endpoints
- [ ] Agregar response headers `X-Cache`, `X-Cost-Single`
- [ ] Renombrar `analyzeWebsiteTraffic` → `analyzeDomainAuthority`
- [ ] Agregar códigos de error HTTP (404, 429, 500)

### **INSTRUCCIONES:**
- [ ] Corregir cálculo de costos (eliminar ×1000)
- [ ] Mejorar detección de idioma (ciudades hispanas en USA)
- [ ] Ejecutar TODO en paralelo desde inicio
- [ ] Hacer `analyzeSEOQuality` opcional
- [ ] Agregar manejo de errores detallado
- [ ] Agregar cache awareness
- [ ] Mejorar formato de salida con breakdown de costos

---

## 💰 **IMPACTO DE COSTOS (Con Mejoras)**

### **Auditoría Básica (Sin URL):**
```
analyzeMyBusiness: $0.0054
searchAllCompetitors: $0.0119
analyzeSearchDemand: $0.02
findRelatedSearches: $0.02
Total: $0.0573 = $0.06 USD
```

### **Auditoría Completa (Con URL, Sin SEO técnico):**
```
Auditoría básica: $0.06
analyzeWebsiteRankings: $0.02
analyzeDomainAuthority: $0.02
Total: $0.10 USD
```

### **Auditoría Premium (Con SEO técnico):**
```
Auditoría completa: $0.10
analyzeSEOQuality: $0.10+ (varía según tamaño)
Total: $0.20+ USD
```

**Ahorro:** Hacer SEO Quality opcional ahorra ~$0.10 por auditoría cuando no se necesita.

---

## ✅ **RECOMENDACIÓN FINAL**

### **Cambios Críticos:**

1. **Schema OpenAPI:**
   - ✅ Agregar headers `X-User-Plan` y `X-Force-Refresh` a todos los endpoints
   - ✅ Agregar response headers `X-Cache`, `X-Cost-Single`
   - ✅ Renombrar `analyzeWebsiteTraffic` → `analyzeDomainAuthority`

2. **Instrucciones:**
   - ✅ Corregir cálculo de costos (eliminar ×1000)
   - ✅ Ejecutar TODO en paralelo desde inicio
   - ✅ Hacer `analyzeSEOQuality` opcional
   - ✅ Agregar manejo de errores completo
   - ✅ Agregar cache awareness

### **Mejoras Opcionales:**

3. **Agregar endpoints:**
   - ⚠️ Reviews completo (`/reviews/task_post`) - Solo si usuario lo pide
   - ⚠️ SERP Local Pack - Solo si relevante

---

**Última actualización:** Octubre 2025
**Enfoque:** Mejoras específicas para tu configuración actual
**Veredicto:** Schema está bien, necesita headers y correcciones de costos en instrucciones

