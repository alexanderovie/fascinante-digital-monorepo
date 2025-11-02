# 📊 PageSpeed Insights API v5 - Parámetros Modernos (2025)

## 🔗 Endpoint Oficial

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
```

**Referencia**: [Google Developers - PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed)

---

## 📋 Parámetros de la API

### Parámetros Requeridos

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `url` | string | **Requerido** - La URL a analizar |
| `key` | string | **Requerido** - Tu API key de Google Cloud |

### Parámetros Opcionales

| Parámetro | Tipo | Valores | Descripción |
|-----------|------|---------|-------------|
| `strategy` | string | `mobile` \| `desktop` | Estrategia de análisis (default: `desktop`) |
| `category` | string[] | `performance` \| `accessibility` \| `seo` \| `best-practices` | Categorías a analizar (puede especificarse múltiples veces) |
| `locale` | string | ej: `en-US`, `es-ES` | Locale para resultados |

---

## 🚀 Ejemplos de Uso

### 1. Análisis Básico - Mobile Performance

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://fascinantedigital.com/es&strategy=mobile&key=YOUR_API_KEY"
```

### 2. Análisis con Múltiples Categorías

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://fascinantedigital.com/es&strategy=mobile&category=performance&category=accessibility&category=seo&key=YOUR_API_KEY"
```

### 3. Análisis Desktop con Locale

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://fascinantedigital.com/es&strategy=desktop&locale=en-US&key=YOUR_API_KEY"
```

---

## 📊 Estructura de Respuesta

### Campos Principales

```json
{
  "kind": "pagespeedonline#result",
  "id": "https://fascinantedigital.com/es",
  "analysisId": "20251102T010000",
  "lighthouseResult": {
    "categories": {
      "performance": {
        "score": 0.85  // 0-1, multiplicar por 100 para porcentaje
      }
    },
    "audits": {
      "first-contentful-paint": {
        "numericValue": 1500,  // en milisegundos
        "displayValue": "1.5 s"
      },
      "largest-contentful-paint": {
        "numericValue": 2200,
        "displayValue": "2.2 s"
      },
      "total-blocking-time": {
        "numericValue": 150,
        "displayValue": "150 ms"
      },
      "cumulative-layout-shift": {
        "numericValue": 0.08,
        "displayValue": "0.08"
      }
    }
  },
  "loadingExperience": {
    "metrics": {
      "FIRST_CONTENTFUL_PAINT_MS": {
        "percentile": 1800,
        "category": "AVERAGE"
      },
      "LARGEST_CONTENTFUL_PAINT_MS": {
        "percentile": 2200,
        "category": "AVERAGE"
      }
    }
  }
}
```

---

## 🔍 Métricas Clave a Extraer

### Performance Score
```json
"categories": {
  "performance": {
    "score": 0.85  // 85/100
  }
}
```

### Core Web Vitals (Lighthouse)
- **LCP**: `lighthouseResult.audits["largest-contentful-paint"].numericValue`
- **FCP**: `lighthouseResult.audits["first-contentful-paint"].numericValue`
- **TBT**: `lighthouseResult.audits["total-blocking-time"].numericValue`
- **CLS**: `lighthouseResult.audits["cumulative-layout-shift"].numericValue`
- **Speed Index**: `lighthouseResult.audits["speed-index"].numericValue`

### Real User Metrics (CrUX)
- **FCP**: `loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile`
- **LCP**: `loadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.percentile`
- **CLS**: `loadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile`
- **INP**: `loadingExperience.metrics.INTERACTION_TO_NEXT_PAINT.percentile`

---

## 🛠️ Script Disponible

### Uso del Script

```bash
# 1. Configurar API key
export PSI_API_KEY=tu_api_key_de_google_cloud

# 2. Ejecutar script
./apps/web/scripts/psi-mobile-api.sh
```

### El Script Extrae:
- ✅ Performance Score
- ✅ LCP, FCP, TBT, CLS, Speed Index
- ✅ Estado de GTM
- ✅ Guarda respuesta completa en JSON

---

## 📝 Notas Importantes

### Límites de API
- **Free Tier**: 25,000 requests/día
- **Rate Limit**: Sin límite específico documentado, pero evitar hacer requests muy frecuentes

### Obtención de API Key
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear proyecto o seleccionar existente
3. Habilitar "PageSpeed Insights API"
4. Crear credenciales → API Key
5. Restringir key a "PageSpeed Insights API" (recomendado)

### Validación de URL
- URL debe ser accesible públicamente
- Debe incluir protocolo (`https://` o `http://`)
- URL encode si contiene caracteres especiales

---

## ✅ Checklist para Consulta Exitosa

- [ ] API key configurada y válida
- [ ] PageSpeed Insights API habilitada en Google Cloud
- [ ] URL accesible públicamente
- [ ] Parámetros correctos (`strategy=mobile`)
- [ ] Respuesta parseada correctamente

---

**Última actualización**: Noviembre 2025
**Fuente**: Context7 + Google Developers Documentation
**API Version**: v5
