# ✅ Checklist Post-Deploy: Renombramiento Workers
## Pasos Pendientes - Octubre 2025

---

## 📊 **ESTADO ACTUAL**

### **✅ Completado:**
- ✅ Configuraciones actualizadas (`wrangler.toml`, `wrangler.jsonc`)
- ✅ Workers nuevos desplegados:
  - `fd-api-gateway` ✅ Funcionando
  - `fd-dataforseo-proxy` ✅ Desplegado (falta secret)

### **⚠️ Pendiente:**

---

## 🔐 **PASO 1: Configurar Secrets en fd-dataforseo-proxy**

El nuevo worker necesita el secret `DATAFORSEO_AUTH`:

```bash
cd /tmp/data-fascinante  # O donde esté el repo

# Opción A: Si tienes el valor del secret guardado
wrangler secret put DATAFORSEO_AUTH --name fd-dataforseo-proxy
# Pega el valor cuando te lo pida

# Opción B: Si NO lo tienes, obtener del worker antiguo
# Nota: Cloudflare NO permite ver el valor de secrets, solo listarlos
# Necesitas obtenerlo de otra fuente (env vars, backup, etc.)
```

**⚠️ IMPORTANTE:** Cloudflare no permite leer el valor de secrets existentes por seguridad. Necesitas:
- Tener el valor guardado en algún lugar seguro
- O regenerarlo desde DataForSEO dashboard

---

## 🌐 **PASO 2: Reasignar Custom Domain: data.fascinantedigital.com**

### **Via Dashboard (Recomendado):**

1. Ir a: `https://dash.cloudflare.com/805bb4fea4f198df0f788aaaad22a1be/workers-and-pages`
2. Click en **Workers** (no Pages)
3. Buscar route: `data.fascinantedigital.com/*`
4. Click **Edit** o **Configure**
5. Cambiar **Worker/Service** de:
   - `dataforseo-proxy` → `fd-dataforseo-proxy`
6. Save

### **Via API (Alternativo):**

Necesitas obtener el route ID primero:

```bash
ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"
export CLOUDFLARE_API_TOKEN='uCL11vZrqZm6JQEV1aVQD7mvXYX25C57PMtTyY5G'

# Listar routes
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/routes" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.'

# Actualizar route (reemplazar ROUTE_ID)
curl -X PUT \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/routes/{ROUTE_ID}" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "pattern": "data.fascinantedigital.com/*",
    "script": "fd-dataforseo-proxy"
  }'
```

---

## ✅ **PASO 3: Verificar Funcionamiento**

Después de reasignar custom domain:

```bash
# Test 1: Custom domain apunta al nuevo worker
curl https://data.fascinantedigital.com/v3/health

# Test 2: Endpoint real
curl -X POST https://data.fascinantedigital.com/v3/business_data/google/my_business_info/live.ai \
  -H "Content-Type: application/json" \
  -d '{"keyword":"test","location_name":"Miami,FL,US"}'
```

**Si funciona:** ✅ Listo para continuar
**Si falla:** ⚠️ Revisar secret y routes

---

## ✅ **PASO 4: Verificar API Gateway Custom Domain (Si Existe)**

Si `api.fascinantedigital.com` estaba configurado:

1. Ir a Cloudflare Dashboard → Workers & Pages → Routes
2. Buscar route: `api.fascinantedigital.com/*`
3. Verificar que apunta a: `fd-api-gateway`
4. Si no existe, crear route nueva:
   - Pattern: `api.fascinantedigital.com/*`
   - Worker: `fd-api-gateway`

---

## 🗑️ **PASO 5: Eliminar Workers Antiguos (Después de 24-48h)**

**Solo después de confirmar que TODO funciona:**

```bash
# 1. Eliminar API Gateway antiguo
cd /home/alexander/proyectos/fascinante-digital-monorepo/apps/api
wrangler delete fascinante-api-gateway-prod

# 2. Eliminar DataForSEO antiguo
cd /tmp/data-fascinante  # O tu repo real
wrangler delete dataforseo-proxy
```

**⚠️ PRECAUCIÓN:**
- ✅ Esperar 24-48 horas después de migrar
- ✅ Verificar métricas que no hay errores
- ✅ Mantener backup por si necesitas rollback

---

## 📋 **CHECKLIST FINAL**

### **Inmediato:**
- [ ] 🔐 Configurar `DATAFORSEO_AUTH` secret en `fd-dataforseo-proxy`
- [ ] 🌐 Reasignar custom domain `data.fascinantedigital.com`
- [ ] ✅ Verificar que `data.fascinantedigital.com` funciona
- [ ] ✅ Verificar custom domain de API Gateway (si existe)

### **Después de 24-48 horas:**
- [ ] 🗑️ Eliminar `fascinante-api-gateway-prod`
- [ ] 🗑️ Eliminar `dataforseo-proxy`
- [ ] ✅ Verificar que solo quedan workers nuevos

---

## 📊 **RESULTADO ESPERADO**

### **Workers Finales:**
```
✅ fd-api-gateway              (producción)
✅ fd-api-gateway-staging      (staging)
✅ fd-dataforseo-proxy         (proxy SEO)
```

**Total: 3 workers (todos con nombres consistentes)**

---

## 🎯 **PRÓXIMOS PASOS**

1. **Ahora:** Configurar secret y reasignar custom domain
2. **En 24h:** Verificar métricas y logs
3. **En 48h:** Eliminar workers antiguos si todo OK

---

**Estado:** 🟡 **80% Completado** - Pendiente secrets y custom domain

