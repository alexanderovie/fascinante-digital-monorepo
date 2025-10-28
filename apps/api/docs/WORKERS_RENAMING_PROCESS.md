# 🔄 Proceso de Renombramiento de Workers
## Opción A: fd-dataforseo-proxy + fd-api-gateway

---

## 📋 **CAMBIOS A REALIZAR**

### **1. dataforseo-proxy → fd-dataforseo-proxy**

**Archivo:** `/tmp/data-fascinante/wrangler.jsonc` (repositorio separado)

```jsonc
{
  "name": "fd-dataforseo-proxy",  // ← Cambiar
  // ... resto igual
}
```

**También actualizar:** `wrangler-elite.jsonc` si se usa

---

### **2. fascinante-api-gateway-prod → fd-api-gateway**

**Archivo:** `apps/api/wrangler.toml`

```toml
name = "fd-api-gateway"  # ← Ya cambiado

[env.production]
name = "fd-api-gateway"  # ← Ya cambiado

[env.staging]
name = "fd-api-gateway-staging"  # ← Opcional: mantener staging separado
```

**✅ Ya actualizado en el archivo**

---

## ⚠️ **IMPORTANTE: Cómo Funciona el Renombramiento**

**Cloudflare NO permite renombrar workers directamente.** El proceso es:

1. ✅ Cambiar nombre en `wrangler.toml` / `wrangler.jsonc`
2. ✅ Deploy (`wrangler deploy`)
3. ✅ Esto **crea un NUEVO worker** con el nuevo nombre
4. ⚠️ El worker antiguo **sigue existiendo** (con el nombre viejo)
5. ✅ Reasignar custom domains al nuevo worker (si aplica)
6. ✅ Verificar que todo funciona
7. ✅ Eliminar worker antiguo (opcional, para limpiar)

---

## 📋 **PASOS DETALLADOS**

### **PASO 1: Actualizar Configuraciones**

**✅ Ya hecho para `fd-api-gateway`**
- `apps/api/wrangler.toml` actualizado

**⚠️ Pendiente para `fd-dataforseo-proxy`:**
- Necesitas actualizar en el repo `data-fascinante`

---

### **PASO 2: Deploy Nuevo Worker (API Gateway)**

```bash
cd apps/api
wrangler deploy --env production
```

Esto creará:
- ✅ Nuevo worker: `fd-api-gateway`
- ⚠️ Worker antiguo: `fascinante-api-gateway-prod` (sigue existiendo)

---

### **PASO 3: Verificar Nuevo Worker**

```bash
# Verificar que responde
curl https://api.fascinantedigital.com/health
# O si no tiene custom domain:
curl https://fd-api-gateway.YOUR_SUBDOMAIN.workers.dev/health
```

---

### **PASO 4: Reasignar Custom Domain (Si Aplica)**

Si `fascinante-api-gateway-prod` tenía custom domain:

1. Ir a Cloudflare Dashboard
2. Workers & Pages → Routes
3. Reasignar route al nuevo worker `fd-api-gateway`

---

### **PASO 5: Deploy Worker DataForSEO**

```bash
cd /tmp/data-fascinante  # O donde esté el repo
# Actualizar wrangler.jsonc primero
wrangler deploy
```

Esto creará:
- ✅ Nuevo worker: `fd-dataforseo-proxy`
- ⚠️ Worker antiguo: `dataforseo-proxy` (sigue existiendo)

**⚠️ IMPORTANTE:** El custom domain `data.fascinantedigital.com` necesita reasignarse

---

### **PASO 6: Reasignar Custom Domain DataForSEO**

**Custom Domain:** `data.fascinantedigital.com`

1. Cloudflare Dashboard → Workers & Pages
2. Encontrar route `data.fascinantedigital.com/*`
3. Cambiar de `dataforseo-proxy` → `fd-dataforseo-proxy`

---

### **PASO 7: Verificar Ambos Workers Funcionan**

```bash
# DataForSEO Proxy
curl https://data.fascinantedigital.com/v3/health

# API Gateway
curl https://api.fascinantedigital.com/health
```

---

### **PASO 8: Eliminar Workers Antiguos (Opcional)**

**Solo después de confirmar que TODO funciona:**

```bash
# Eliminar API Gateway antiguo
wrangler delete fascinante-api-gateway-prod

# Eliminar DataForSEO antiguo
# (desde el directorio del proyecto data-fascinante)
wrangler delete dataforseo-proxy
```

**⚠️ PRECAUCIÓN:** Una vez eliminados, no se pueden recuperar sin redeploy

---

## 🎯 **CHECKLIST DE RENOMBRAMIENTO**

### **Para fd-api-gateway:**
- [x] ✅ Actualizar `wrangler.toml` (completado)
- [ ] ⏳ Deploy nuevo worker: `fd-api-gateway`
- [ ] ⏳ Verificar funcionamiento
- [ ] ⏳ Reasignar custom domain (si aplica)
- [ ] ⏳ Eliminar worker antiguo (después de verificar)

### **Para fd-dataforseo-proxy:**
- [ ] ⏳ Actualizar `wrangler.jsonc` en repo data-fascinante
- [ ] ⏳ Deploy nuevo worker: `fd-dataforseo-proxy`
- [ ] ⏳ Verificar funcionamiento
- [ ] ⏳ Reasignar custom domain `data.fascinantedigital.com`
- [ ] ⏳ Eliminar worker antiguo (después de verificar)

---

## ⚠️ **RIESGOS Y CONSIDERACIONES**

### **Riesgos:**
1. ⚠️ **Downtime mínimo:** Durante reasignación de custom domain (segundos)
2. ⚠️ **Dos workers activos:** Temporalmente tendrás ambos nombres
3. ⚠️ **Custom domains:** Deben reasignarse manualmente

### **Mitigaciones:**
1. ✅ Deploy en horario de bajo tráfico
2. ✅ Verificar funcionamiento antes de eliminar antiguos
3. ✅ Mantener workers antiguos como backup por 24-48 horas

---

## 💡 **ALTERNATIVA: Mantener Ambos (Sin Eliminar)**

Si prefieres ser más conservador:

**Opción:** Mantener workers antiguos inactivos como backup
- ✅ Fácil rollback si algo falla
- ✅ Sin riesgo de pérdida
- ⚠️ Consumen recursos mínimos (muy bajo costo)

---

## 📊 **RESULTADO ESPERADO**

### **Antes:**
```
dataforseo-proxy              (16 chars)
fascinante-api-gateway-prod   (27 chars)
```

### **Después:**
```
fd-dataforseo-proxy   (20 chars) ✅
fd-api-gateway        (15 chars) ✅
```

**Mejoras:**
- ✅ Longitudes balanceadas (diferencia: 5 chars)
- ✅ Prefijo consistente: `fd-`
- ✅ Más profesional y ordenado
- ✅ Fácil de identificar en dashboard

---

## 🚀 **PRÓXIMOS PASOS**

1. ✅ **Archivos actualizados:** `apps/api/wrangler.toml`
2. ⏳ **Pendiente:** Actualizar `data-fascinante/wrangler.jsonc`
3. ⏳ **Deploy:** Ejecutar deploys cuando estés listo
4. ⏳ **Verificar:** Confirmar funcionamiento
5. ⏳ **Limpiar:** Eliminar workers antiguos (opcional)

---

**¿Quieres que proceda con el deploy o prefieres revisar primero?**
