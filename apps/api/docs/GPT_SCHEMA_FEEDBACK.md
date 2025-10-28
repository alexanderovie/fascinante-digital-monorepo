# 🔍 Feedback: Schema OpenAPI Actual
## Análisis Detallado - Octubre 2025

---

## ✅ **LO QUE ESTÁ BIEN:**

1. ✅ **Estructura OpenAPI correcta** - Schema válido
2. ✅ **URL base correcta** - `https://data.fascinantedigital.com`
3. ✅ **Endpoints correctos** - Todos coinciden con DataForSEO API
4. ✅ **Operation IDs descriptivos** - Fáciles de usar
5. ✅ **Parámetros bien definidos** - Tipo, descripción, requeridos

---

## 🔴 **PROBLEMAS CRÍTICOS (Agregar Obligatorio):**

### **1. Falta Headers del Proxy**

**Problema:** No hay headers `X-User-Plan` ni `X-Force-Refresh` en ningún endpoint.

**Impacto:** No aprovechas el cache optimizado del proxy.

**Solución:** Agregar como `parameters` en cada endpoint:

```json
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
]
```

---

### **2. Falta Response Headers**

**Problema:** No defines headers de respuesta `X-Cache` y `X-Cost-Single`.

**Impacto:** ChatGPT no puede detectar cache hits ni calcular costos correctamente.

**Solución:** Agregar en `responses` de cada endpoint:

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
          "type": "number",
          "format": "float"
        },
        "description": "Costo en dólares por este request (ej: 0.0054 = $0.0054)"
      }
    },
    "content": {
      "application/json": {
        "schema": {
          "type": "object"
        }
      }
    }
  },
  "404": {
    "description": "Negocio no encontrado - variar keyword"
  },
  "429": {
    "description": "Rate limit excedido - esperar 60 segundos"
  },
  "500": {
    "description": "Error del servidor - retry con backoff"
  }
}
```

---

### **3. Problema en searchAllCompetitors**

**Problema:**
- Schema define `location_coordinate` como requerido
- Pero en tus instrucciones optimizadas dijiste: "Usa location_name directamente (NO esperar coordenadas)"

**Conflicto:** El endpoint DataForSEO puede aceptar ambos, pero necesitas decidir cuál usar.

**Solución:**
- **Opción A (Mejor):** Agregar `location_name` como alternativa a `location_coordinate`
- **Opción B:** Cambiar instrucciones para usar coordenadas (menos eficiente)

**Recomendación:** Opción A - Agregar `location_name` al schema:

```json
"properties": {
  "location_coordinate": {
    "type": "string",
    "description": "Coordenadas GPS: latitud,longitud,radio_km (ej: 10.6666,-71.6333,50) - OPCIONAL si usas location_name"
  },
  "location_name": {
    "type": "string",
    "description": "Ubicación en formato: Ciudad,Estado,País (ej: Maracaibo,Zulia,Venezuela) - OPCIONAL si usas location_coordinate"
  },
  "categories": { ... },
  "limit": { ... }
}
```

---

### **4. Nombre Confuso: analyzeWebsiteTraffic**

**Problema:**
- Nombre: `analyzeWebsiteTraffic`
- Endpoint real: `/domain_rank_overview`
- No analiza "tráfico", analiza "Domain Authority"

**Solución:** Renombrar para ser más preciso:

```json
"operationId": "analyzeDomainAuthority",
"summary": "Analiza Domain Authority y autoridad del sitio",
"description": "Muestra Domain Authority, autoridad del dominio y comparación con el mercado."
```

**Nota:** También actualizar en las instrucciones para usar este nombre.

---

## 🟡 **MEJORAS RECOMENDADAS (No Críticas):**

### **5. Agregar Enum para language_code**

**Mejora:** Restringir valores permitidos:

```json
"language_code": {
  "type": "string",
  "enum": ["es", "en", "pt"],
  "description": "Código de idioma ISO: es (español), en (inglés), pt (portugués)"
}
```

**Beneficio:** ChatGPT no puede poner "Spanish" o "English" (que está prohibido en tus instrucciones).

---

### **6. Agregar Ejemplos en Schema**

**Mejora:** Agregar `examples` para que ChatGPT entienda mejor el formato:

```json
"location_name": {
  "type": "string",
  "description": "...",
  "examples": [
    "Maracaibo,Zulia,Venezuela",
    "West Palm Beach,Florida,United States",
    "Miami,Florida,United States"
  ]
}
```

---

### **7. Actualizar Versión**

**Sugerencia:** Cambiar versión para reflejar mejoras:

```json
"version": "2.0.0"
```

---

## 📊 **SCHEMA CORREGIDO (Ejemplo Completo para un Endpoint)**

### **Ejemplo: analyzeMyBusiness (Con todas las mejoras):**

```json
"/v3/business_data/google/my_business_info/live.ai": {
  "post": {
    "summary": "Analiza TU negocio específico",
    "description": "Busca un negocio por su nombre exacto y devuelve su información completa: rating, reseñas, verificación, dirección, horarios.",
    "operationId": "analyzeMyBusiness",
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
    "requestBody": {
      "required": true,
      "content": {
        "application/json": {
          "schema": {
            "type": "object",
            "properties": {
              "keyword": {
                "type": "string",
                "description": "Nombre exacto del negocio a buscar (incluir ciudad para mayor precisión)",
                "examples": [
                  "Agencia Growth Marketing Maracaibo",
                  "Duffy's Sports Grill West Palm Beach"
                ]
              },
              "location_name": {
                "type": "string",
                "description": "Ubicación en formato: Ciudad,Estado,País (ej: Maracaibo,Zulia,Venezuela)",
                "examples": [
                  "Maracaibo,Zulia,Venezuela",
                  "West Palm Beach,Florida,United States"
                ]
              },
              "language_code": {
                "type": "string",
                "enum": ["es", "en", "pt"],
                "description": "Código de idioma ISO: es (español), en (inglés), pt (portugués)"
              }
            },
            "required": [
              "keyword",
              "language_code"
            ]
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
            },
            "description": "Indica si respuesta viene de cache"
          },
          "X-Cost-Single": {
            "schema": {
              "type": "number",
              "format": "float"
            },
            "description": "Costo en dólares por este request (ej: 0.0054 = $0.0054)"
          }
        },
        "content": {
          "application/json": {
            "schema": {
              "type": "object"
            }
          }
        }
      },
      "404": {
        "description": "Negocio no encontrado - variar keyword automático"
      },
      "429": {
        "description": "Rate limit excedido - esperar 60 segundos"
      },
      "500": {
        "description": "Error del servidor - retry con backoff exponencial"
      }
    }
  }
}
```

---

## ✅ **CHECKLIST DE CORRECCIONES:**

### **Crítico (Hacer Ahora):**
- [ ] Agregar `X-User-Plan` header a TODOS los endpoints
- [ ] Agregar `X-Force-Refresh` header a TODOS los endpoints
- [ ] Agregar response headers `X-Cache` y `X-Cost-Single` a TODOS los endpoints
- [ ] Agregar response codes 404, 429, 500 a TODOS los endpoints
- [ ] Renombrar `analyzeWebsiteTraffic` → `analyzeDomainAuthority`
- [ ] Agregar `location_name` a `searchAllCompetitors` (o cambiar instrucciones)

### **Recomendado (Mejorar):**
- [ ] Agregar `enum` a `language_code` en TODOS los endpoints
- [ ] Agregar `examples` a campos clave
- [ ] Actualizar versión a "2.0.0"

---

## 🎯 **VEREDICTO:**

### **Estado Actual:**
- 🟡 **Funcional pero incompleto** - Funcionará, pero no aprovecha todas las capacidades del proxy

### **Problemas:**
1. 🔴 **Crítico:** Sin headers del proxy → No cache optimizado
2. 🔴 **Crítico:** Sin response headers → No puede calcular costos ni detectar cache
3. 🟡 **Importante:** Conflicto `location_coordinate` vs `location_name`
4. 🟡 **Recomendado:** Nombre confuso `analyzeWebsiteTraffic`

### **Recomendación:**
**Agregar los headers faltantes** antes de usar en producción. Sin ellos, ChatGPT no podrá:
- Optimizar cache correctamente
- Calcular costos precisamente
- Informar si datos vienen de cache

---

**Prioridad:** 🔴 **ALTA** - Agregar headers antes de usar.

---

**Última actualización:** Octubre 2025
