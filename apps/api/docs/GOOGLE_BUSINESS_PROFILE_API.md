# 📊 Google Business Profile API - Análisis y Cuotas
## Estado en el Proyecto - Octubre 2025

---

## 🔍 **ESTADO ACTUAL**

### **API Key Existente:**
- **ID:** `b4a4b594-c61a-447d-a488-681e3a1882da`
- **Nombre:** "Fascinante Elite - My Business API"
- **Creada:** 2025-09-07
- **Servicio:** `mybusiness.googleapis.com`

### **Service Account Relacionado:**
- **Email:** `google-business-proxy@fascinante-digit-1698295291643.iam.gserviceaccount.com`
- **Display:** "Google Business Profile Proxy"
- **Uso:** Proxy para integraciones con Google Business

### **Código Existente:**
✅ Ya tienes implementación en `apps/app/lib/google/`:
- `oauth.ts` - OAuth flow para Google Business
- `token-manager.ts` - Manejo de tokens
- `types.ts` - Tipos TypeScript
- Endpoint: `mybusinessbusinessinformation.googleapis.com/v1/accounts`

---

## ✅ **ESTADO DE LA API**

### **APIs Habilitadas:**
- ✅ **mybusiness.googleapis.com** - My Business API (Legacy)
- ✅ **mybusinessbusinessinformation.googleapis.com** - Business Profile API v1
- ✅ **mybusinessaccountmanagement.googleapis.com** - Account Management
- ✅ **mybusinessverifications.googleapis.com** - Verifications
- ✅ **mybusinessqanda.googleapis.com** - Q&A
- ✅ **mybusinesslodging.googleapis.com** - Lodging
- ✅ **businessprofileperformance.googleapis.com** - Performance Metrics
- ✅ **API Key existe** (`b4a4b594-c61a-447d-a488-681e3a1882da`)
- ✅ **Código preparado** para usarla

### **Endpoint Usado:**
```
https://mybusinessbusinessinformation.googleapis.com/v1/accounts
```

**Nota:** Este es el endpoint de **Google Business Profile API v1** (la nueva versión).

---

## 📋 **APIS DE GOOGLE BUSINESS**

### **API 1: My Business API (Legacy)**
- **Endpoint:** `mybusiness.googleapis.com`
- **Estado:** ⚠️ Deprecada (pero aún funciona)
- **Reemplazada por:** Business Profile API

### **API 2: Google Business Profile API (Actual)**
- **Endpoint:** `mybusinessbusinessinformation.googleapis.com`
- **Estado:** ✅ Recomendada
- **Versión:** v1
- **Necesita:** `mybusinessbusinessinformation.googleapis.com` habilitada

---

## 🔧 **CONFIGURACIÓN NECESARIA**

### **Paso 1: Habilitar API (si no está):**

```bash
# Habilitar Google Business Profile API (nueva)
gcloud services enable \
  mybusinessbusinessinformation.googleapis.com \
  --project=fascinante-digit-1698295291643

# O si usas la legacy (no recomendado)
gcloud services enable \
  mybusiness.googleapis.com \
  --project=fascinante-digit-1698295291643
```

### **Paso 2: Verificar API Key:**

```bash
# Ver detalles de la API Key existente
gcloud services api-keys describe b4a4b594-c61a-447d-a488-681e3a1882da \
  --project=fascinante-digit-1698295291643
```

---

## 📊 **CUOTAS Y LÍMITES**

### **Google Business Profile API v1:**

#### **Cuotas por Defecto (Sin Solicitar Aumento):**

| Métrica | Límite Diario | Límite por Minuto |
|--------|---------------|------------------|
| **Accounts.list** | 1,000 requests | 10 requests |
| **Locations.get** | 1,000 requests | 10 requests |
| **Locations.list** | 1,000 requests | 10 requests |
| **LocationMedia.get** | 1,000 requests | 10 requests |
| **Cualquier otro método** | 1,000 requests | 10 requests |

#### **Costos:**
- ✅ **GRATIS** - No tiene costo adicional
- ⚠️ **Requiere OAuth 2.0** - Cada negocio debe autorizar acceso

---

## 🎯 **DIFERENCIA CON PLACES API**

| Característica | Places API | Business Profile API |
|----------------|------------|---------------------|
| **Acceso** | Público (API Key) | Privado (OAuth 2.0) |
| **Datos** | Información pública | Datos internos del negocio |
| **Requisito** | Solo API Key | Negocio debe autorizar |
| **Costo** | ~$0.05 por request | Gratis |
| **Uso en Auditoría** | ✅ Perfecto | ⚠️ Requiere autorización previa |

---

## 💡 **PARA LA AUDITORÍA GRATIS**

### **⚠️ PROBLEMA:**

La **Google Business Profile API NO es ideal** para auditoría automática porque:

1. ❌ **Requiere OAuth 2.0** - Cada negocio debe autorizar manualmente
2. ❌ **No es automático** - No puedes buscar cualquier negocio
3. ❌ **Solo accedes a negocios que el usuario autoriza**
4. ❌ **No funciona para auditorías públicas gratuitas**

### **✅ SOLUCIÓN RECOMENDADA:**

Para auditoría **automática y gratuita**, usar:
- ✅ **Places API** - Datos públicos, funciona para cualquier negocio
- ✅ **API Key** - No requiere autorización del negocio
- ✅ **Datos suficientes** - Rating, reviews, ubicación, website

**Business Profile API es útil para:**
- Dashboard de clientes que ya autorizaron
- Información privada (insights internos)
- Gestión de reviews desde tu plataforma
- **NO para auditoría pública gratuita**

---

## 📝 **RECOMENDACIÓN**

### **Para Auditoría Gratis:**

✅ **Usar Places API** (ya lo tienes configurado)
- ✅ Datos públicos suficientes
- ✅ No requiere OAuth
- ✅ Funciona automáticamente

❌ **NO usar Business Profile API** para auditoría pública
- ⚠️ Requiere autorización previa
- ⚠️ Solo para clientes que ya autorizaron

### **Para Dashboard de Clientes:**

✅ **SÍ usar Business Profile API**
- ✅ Cuando cliente autoriza su Google Business
- ✅ Datos internos e insights
- ✅ Gestión de reviews

---

## ✅ **CHECKLIST**

- [x] ✅ API Key de My Business existe
- [x] ✅ Service Account "google-business-proxy" existe
- [x] ✅ Código preparado en `apps/app/lib/google/`
- [x] ✅ **APIs HABILITADAS** (7 APIs relacionadas)
- [x] ✅ Cuotas: 1,000 requests/día (suficiente)
- [x] ✅ Costo: GRATIS

---

## 🚀 **DECISIÓN FINAL**

**Para la auditoría gratis que estamos implementando:**

1. ✅ **Usar Places API** - Ya configurada y perfecta para esto
2. ❌ **NO usar Business Profile API** - No aplica para auditoría pública
3. ✅ **Business Profile API** - Reservar para dashboard de clientes autorizados

**Conclusión:** No necesitas habilitar Business Profile API para la auditoría gratis. Places API es la opción correcta.

---

**Última actualización:** Octubre 2025
**Recomendación:** ⚠️ No habilitar para auditoría gratis, sí para dashboard de clientes
