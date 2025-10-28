# 📊 Análisis de Uso de API Keys - Octubre 2025
## ¿Cuáles están en uso activo?

---

## ✅ **API KEYS EN USO (PRODUCCIÓN)**

### **1. Google Places API Key para Buscar Negocios**
- **ID:** `909bc69e-8807-493e-937c-5ec68f76ae94`
- **Creada:** 24 oct 2025
- **Valor:** `AIzaSyAEMScRC9II36owSiHKdUpJe2UmkmP2GzA`
- **Variable:** `GOOGLE_PLACES_API_KEY`
- **Estado:** ✅ **EN USO ACTIVO**
- **Dónde se usa:**
  - ✅ `apps/api/.dev.vars` (configurada)
  - ✅ `apps/api/src/index.ts` (endpoint `/api/audit/free`)
  - ✅ `apps/api/src/services/business-audit.ts` (búsqueda y detalles)
- **Restricciones:** `places.googleapis.com`
- **Acción:** ✅ **CONSERVAR** - Esta es la que usas para auditoría

---

## ❌ **API KEYS NO EN USO (Probablemente de Prueba)**

### **2. NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
- **ID:** `12e2e028-5850-4e42-9f71-f2f3f1c9c649`
- **Creada:** 13 oct 2025
- **Estado:** ❌ **NO ENCONTRADA EN CÓDIGO**
- **Búsqueda realizada:**
  - ❌ No hay `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` en variables de entorno
  - ❌ No hay uso de Maps Embed API en componentes
  - ❌ MapSection usa imagen estática, no Google Maps
- **Acción:** ⚠️ **VERIFICAR ANTES DE ELIMINAR** - Puede estar en Vercel env vars

### **3. NEXT_PUBLIC_GOOGLE_PLACES_API_KEY**
- **ID:** `2e4766d3-dc27-4bce-bdec-fdeaed1819ef`
- **Creada:** 13 oct 2025
- **Estado:** ❌ **NO ENCONTRADA EN CÓDIGO**
- **Búsqueda realizada:**
  - ❌ No hay `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` en código
  - ❌ No hay uso en frontend
- **Nota:** Similar a la key #1 pero para frontend (parece duplicada)
- **Acción:** ⚠️ **CANDIDATA A ELIMINAR** - Parece duplicado de prueba

### **4. GOOGLE_PLACES_DETAILS_API_KEY**
- **ID:** `536c5338-ec31-4ed2-8d82-45134a571a06`
- **Creada:** 13 oct 2025
- **Estado:** ❌ **NO ENCONTRADA EN CÓDIGO**
- **Búsqueda realizada:**
  - ❌ No hay `GOOGLE_PLACES_DETAILS_API_KEY` en código
  - ❌ La key #1 ya maneja Details (usa Places API completa)
- **Acción:** ⚠️ **CANDIDATA A ELIMINAR** - Duplicada, key #1 hace lo mismo

### **5. Google Search Console Cursor**
- **ID:** `64d82d05-2db7-4c62-b375-ce1b68cdd20f`
- **Creada:** 22 oct 2025
- **Estado:** ❌ **NO ENCONTRADA EN CÓDIGO**
- **Búsqueda realizada:**
  - ❌ No hay uso de Search Console API
  - ❌ No hay referencias a Search Console en código
- **Acción:** ⚠️ **VERIFICAR ANTES DE ELIMINAR** - Reciente (22 oct)

### **6-7. PageSpeed Insights API (2 keys)**
- **IDs:**
  - `b317bb2a-7a83-494c-a299-70be56b25b51` (Fascinante Elite)
  - `4238fcae-0e73-49e6-8e5e-c1511e064de6` (Original)
- **Creadas:** 13 oct 2025 / 8 sept 2025
- **Estado:** ❌ **NO ENCONTRADAS EN CÓDIGO**
- **Búsqueda realizada:**
  - ❌ No hay uso de PageSpeed Insights API
  - ❌ No hay referencias en código
- **Acción:** ⚠️ **CANDIDATAS A ELIMINAR** - No se usan

### **8. Fascinante Elite - Analytics API**
- **ID:** `bebe2e94-d958-4210-98d0-8adcc5dfabf9`
- **Creada:** 7 sept 2025
- **Estado:** ❌ **NO USADA DIRECTAMENTE**
- **Nota:**
  - El código usa `GA_KEY` (Google Analytics Measurement ID)
  - `GA_KEY` NO es una API Key de GCP, es el Measurement ID de GA4
  - Esta API Key sería para Google Analytics Data API (reporting avanzado)
- **Acción:** ⚠️ **VERIFICAR** - Puede ser para features futuras de analytics

### **9. Fascinante Elite - Maps & Places API**
- **ID:** `f7f6244e-c842-4ebe-8687-de5760d57a28`
- **Creada:** 7 sept 2025
- **Estado:** ❌ **NO ENCONTRADA EN CÓDIGO**
- **Servicios:** Places, Maps, Places Backend
- **Acción:** ⚠️ **CANDIDATA A ELIMINAR** - Duplicada de key #1

### **10. Fascinante Elite - My Business API**
- **ID:** `b4a4b594-c61a-447d-a488-681e3a1882da`
- **Creada:** 7 sept 2025
- **Estado:** ❌ **NO USADA (usa OAuth en su lugar)**
- **Nota:**
  - El código usa `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (OAuth)
  - Business Profile API requiere OAuth, no API Key
  - Esta key probablemente no funciona para Business Profile API
- **Acción:** ⚠️ **CANDIDATA A ELIMINAR** - No funcional para Business API

---

## 📋 **RESUMEN EJECUTIVO**

### **✅ EN USO (Conservar):**
1. ✅ **Google Places API Key para Buscar Negocios** (909bc69e-...)
   - **Uso:** Auditoría de negocios
   - **Ubicación:** Backend (Cloudflare Workers)
   - **Estado:** Producción activa

### **⚠️ VERIFICAR (Antes de eliminar):**
2. ⚠️ **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
   - Puede estar en Vercel env vars
   - Verificar si hay componente de mapas en frontend

3. ⚠️ **Google Search Console Cursor**
   - Creada recientemente (22 oct)
   - Verificar si hay features de Search Console pendientes

4. ⚠️ **Fascinante Elite - Analytics API**
   - Puede ser para features futuras
   - Verificar roadmap

### **❌ CANDIDATAS A ELIMINAR (No en uso):**
5. ❌ **NEXT_PUBLIC_GOOGLE_PLACES_API_KEY** - Duplicada
6. ❌ **GOOGLE_PLACES_DETAILS_API_KEY** - Duplicada
7. ❌ **PageSpeed Insights API** (2 keys) - No usadas
8. ❌ **Fascinante Elite - Maps & Places API** - Duplicada
9. ❌ **Fascinante Elite - My Business API** - No funcional (requiere OAuth)

---

## 🔍 **VERIFICACIÓN ADICIONAL NECESARIA**

### **Antes de eliminar, verificar:**

1. **Variables de entorno en Vercel:**
   - Revisar todas las variables `NEXT_PUBLIC_GOOGLE_*`
   - Verificar si alguna key está en producción pero no en código local

2. **Features pendientes:**
   - ¿Hay roadmap para Search Console integration?
   - ¿Hay plan para Analytics API avanzado?
   - ¿Hay plan para Maps en frontend?

3. **Backups:**
   - Hacer backup de todas las keys antes de eliminar
   - Documentar cuál key es cuál

---

## 🎯 **RECOMENDACIÓN FINAL**

### **Limpieza Segura:**

**PRIMERO - Verificar Vercel:**
```bash
# Revisar en Vercel Dashboard
# Settings → Environment Variables
# Ver todas las NEXT_PUBLIC_GOOGLE_* vars
```

**SEGUNDO - Eliminar Duplicados Confirmados:**
1. ❌ `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Duplicado (si key #1 funciona para todo)
2. ❌ `GOOGLE_PLACES_DETAILS_API_KEY` - Duplicado
3. ❌ PageSpeed Insights (2 keys) - No usadas
4. ❌ `Fascinante Elite - Maps & Places API` - Duplicado
5. ❌ `Fascinante Elite - My Business API` - No funcional

**TERCERO - Verificar Antes de Eliminar:**
- ⚠️ `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (verificar Vercel)
- ⚠️ `Google Search Console Cursor` (verificar roadmap)
- ⚠️ `Analytics API` (verificar roadmap)

---

## ✅ **ESTRUCTURA LIMPIA RECOMENDADA**

### **Después de limpieza, deberías tener:**

1. ✅ **Google Places API Key para Buscar Negocios**
   - Para backend (auditoría)

2. (Opcional) **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
   - Solo si planeas usar Maps en frontend

3. (Opcional) **Google Search Console Cursor**
   - Solo si hay feature planificada

4. (Opcional) **Analytics API**
   - Solo si hay reporting avanzado planificado

**Total recomendado:** 1-4 keys (vs 10 actuales)

---

## 📝 **SCRIPT DE VERIFICACIÓN**

```bash
#!/bin/bash
# Verificar uso de API Keys

echo "🔍 Verificando uso de API Keys..."

# Key #1: Google Places (producción)
if grep -r "AIzaSyAEMScRC9II36owSiHKdUpJe2UmkmP2GzA" apps/ 2>/dev/null; then
  echo "✅ Key #1 EN USO (Google Places para Buscar Negocios)"
else
  echo "❌ Key #1 NO ENCONTRADA"
fi

# Otras keys
for key_name in "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY" "GOOGLE_PLACES_DETAILS_API_KEY"; do
  if grep -r "$key_name" apps/ 2>/dev/null; then
    echo "✅ $key_name EN USO"
  else
    echo "❌ $key_name NO ENCONTRADA"
  fi
done
```

---

## 🎯 **CONCLUSIÓN**

**Total de keys:** 10
**En uso activo:** 1 (Google Places API Key para Buscar Negocios)
**Candidatas a eliminar:** 5-7 keys
**A verificar:** 2-3 keys

**Ahorro potencial:** 50-70% de keys innecesarias

---

**Última actualización:** Octubre 2025
**Recomendación:** ⚠️ Verificar Vercel antes de eliminar las `NEXT_PUBLIC_*`
