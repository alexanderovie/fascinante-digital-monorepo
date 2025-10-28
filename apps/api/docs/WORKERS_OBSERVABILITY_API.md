# 📊 Workers Observability API - Análisis de Logs
## Cómo obtener logs mediante API/CLI - Octubre 2025

---

## 🔍 **MÉTODOS PARA OBTENER LOGS**

### **Método 1: wrangler tail (Recomendado)**

```bash
cd /tmp/data-fascinante
wrangler tail dataforseo-proxy
```

**Filtros:**
```bash
# Solo errores
wrangler tail dataforseo-proxy --status error

# Formato JSON
wrangler tail dataforseo-proxy --format json

# Buscar específico
wrangler tail dataforseo-proxy | grep "Analytics error"
```

**Ventajas:**
- ✅ Tiempo real
- ✅ Fácil de usar
- ✅ No requiere API token específico (usa wrangler auth)

**Desventajas:**
- ⚠️ Solo logs nuevos (desde que inicias tail)
- ⚠️ No muestra logs históricos

---

### **Método 2: Dashboard de Cloudflare**

**URL proporcionada:**
```
https://dash.cloudflare.com/805bb4fea4f198df0f788aaaad22a1be/workers/services/view/dataforseo-proxy/production/observability/logs?workers-observability-view=invocations
```

**Ventajas:**
- ✅ Logs históricos
- ✅ Filtros avanzados
- ✅ UI visual

**Desventajas:**
- ❌ No automatizable
- ❌ Requiere acceso manual

---

### **Método 3: API de Cloudflare (Investigando)**

**Posible endpoint (por confirmar):**
```
POST https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/observability/logs/query
```

**Body:**
```json
{
  "query": "...",
  "filters": {
    "script": "dataforseo-proxy",
    "status": ["success", "error"]
  },
  "timeRange": {
    "since": "2025-10-28T00:00:00Z",
    "until": "2025-10-28T23:59:59Z"
  }
}
```

**Estado:** ⚠️ Endpoint exacto por confirmar (no documentado públicamente)

---

## 🎯 **QUÉ BUSCAR EN LOS LOGS**

### **1. Confirmar que Analytics Engine funciona:**

**Buscar:**
```
✅ NO debe aparecer: "Analytics error:"
✅ SÍ debe aparecer: "Cache HIT:" y "Cache MISS:"
```

**Ejemplo de log exitoso:**
```
Cache HIT: cache:/v3/endpoint:abc123, plan: gpt
Cache MISS: cache:/v3/endpoint:xyz789, plan: pro
```

**Ejemplo de error (si binding no funciona):**
```
Analytics error: TypeError: Cannot read properties of undefined (reading 'writeDataPoint')
```

---

### **2. Verificar que se están registrando consultas:**

**En Analytics Engine (Dashboard):**
```
Cloudflare Dashboard → Analytics Engine → Fascinante_Cursor → Query
```

**Query SQL:**
```sql
SELECT 
  blob1 as plan,
  blob2 as cache_status,
  blob3 as endpoint,
  double1 as cost,
  double2 as latency_ms,
  timestamp
FROM dataset.Fascinante_Cursor
WHERE timestamp > NOW() - INTERVAL 1 HOUR
ORDER BY timestamp DESC
LIMIT 100
```

---

## 🔧 **SCRIPT DE VERIFICACIÓN COMPLETO**

```bash
#!/bin/bash

ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"
WORKER_NAME="dataforseo-proxy"

echo "🔍 Verificando logs de ${WORKER_NAME}..."
echo ""

# 1. Verificar que Observability esté habilitado
echo "✅ 1. Verificando configuración..."
cd /tmp/data-fascinante
grep -q "observability" wrangler.jsonc wrangler-elite.jsonc && echo "   Observability configurado en código" || echo "   ⚠️ Observability no encontrado en código"

# 2. Iniciar tail y buscar errores
echo ""
echo "✅ 2. Buscando errores recientes..."
timeout 10 wrangler tail ${WORKER_NAME} 2>&1 | grep -i "Analytics error" | head -5 && echo "   ❌ Errores encontrados" || echo "   ✅ No hay errores recientes"

# 3. Verificar logs de Cache
echo ""
echo "✅ 3. Verificando logs de Cache..."
timeout 10 wrangler tail ${WORKER_NAME} 2>&1 | grep -E "Cache HIT|Cache MISS" | head -5 && echo "   ✅ Cache funcionando" || echo "   ⚠️ No hay logs de cache recientes"

echo ""
echo "📊 Para ver más logs:"
echo "   wrangler tail ${WORKER_NAME}"
```

---

## 📋 **RESULTADO ESPERADO**

### **Si todo funciona correctamente:**
- ✅ No aparece "Analytics error"
- ✅ Aparecen logs de "Cache HIT" y "Cache MISS"
- ✅ Datos aparecen en Analytics Engine dataset

### **Si hay problemas:**
- ❌ Aparece "Analytics error" → Binding no funciona
- ⚠️ No aparecen logs → Worker no está recibiendo requests o logs no se capturan

---

**Última actualización:** Octubre 2025  
**Estado:** Verificando endpoint de API para logs históricos

