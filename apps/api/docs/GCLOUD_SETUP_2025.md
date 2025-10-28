# 🔧 Configuración gcloud CLI - Octubre 2025
## Setup Moderno y Completo

---

## 🎯 **OBJETIVO**

Configurar gcloud CLI para desarrollo local siguiendo las mejores prácticas de octubre 2025, con:
- ✅ Autenticación de usuario
- ✅ Application Default Credentials (ADC)
- ✅ Proyecto configurado
- ✅ APIs habilitadas
- ✅ Regiones configuradas

---

## 🚀 **SETUP RÁPIDO (Automático)**

### **Opción A: Script Automático**

```bash
cd apps/api
./scripts/setup-gcloud.sh
```

El script ejecutará todos los pasos automáticamente.

---

## 📋 **SETUP MANUAL (Paso a Paso)**

### **Paso 1: Actualizar gcloud CLI**

```bash
gcloud components update
```

### **Paso 2: Autenticación de Usuario**

```bash
# Login interactivo (se abrirá navegador)
gcloud auth login info@fascinantedigital.com

# O login genérico
gcloud auth login
```

Esto autentica tu cuenta para comandos gcloud.

### **Paso 3: Configurar Proyecto**

```bash
gcloud config set project fascinante-digit-1698295291643
```

### **Paso 4: Configurar Cuenta Activa**

```bash
gcloud config set account info@fascinantedigital.com
```

### **Paso 5: Application Default Credentials (ADC)**

**⚠️ IMPORTANTE:** Esto permite que aplicaciones locales usen credenciales automáticamente.

```bash
gcloud auth application-default login
```

Esto creará credenciales en:
- **Linux/macOS:** `~/.config/gcloud/application_default_credentials.json`
- **Windows:** `%APPDATA%\gcloud\application_default_credentials.json`

### **Paso 6: Configurar Regiones (para Vertex AI)**

```bash
# Región para Vertex AI
gcloud config set ai/region us-central1
gcloud config set aiplatform/region us-central1

# (Opcional) Región para Compute
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a
```

### **Paso 7: Habilitar APIs Necesarias**

```bash
gcloud services enable \
  places-backend.googleapis.com \
  places-backend-new.googleapis.com \
  aiplatform.googleapis.com \
  --project=fascinante-digit-1698295291643
```

### **Paso 8: Verificar Configuración**

```bash
# Ver configuración actual
gcloud config list

# Ver APIs habilitadas
gcloud services list --enabled \
  --project=fascinante-digit-1698295291643 \
  --filter="name:places OR name:aiplatform"

# Verificar ADC funciona
gcloud auth application-default print-access-token
```

---

## 🔐 **TIPOS DE AUTENTICACIÓN**

### **1. User Account (`gcloud auth login`)**
- ✅ Para comandos gcloud CLI
- ✅ Para desarrollo local interactivo
- ✅ Se refresca automáticamente

### **2. Application Default Credentials (`gcloud auth application-default login`)**
- ✅ Para aplicaciones que usan Google Cloud SDKs
- ✅ Para desarrollo local (Next.js, Node.js)
- ✅ Las apps lo detectan automáticamente
- ⚠️ NO funciona en Cloudflare Workers (solo local)

### **3. Service Account Key (JSON)**
- ✅ Para producción/serverless
- ✅ Para Cloudflare Workers (vía REST API)
- ⚠️ NO usar en desarrollo local (menos seguro)

---

## 🔄 **RENOVACIÓN DE CREDENCIALES**

### **Cuando ADC Expira (típicamente cada hora):**

```bash
# Renovar ADC
gcloud auth application-default login
```

### **Cuando User Token Expira:**

```bash
# Renovar token de usuario
gcloud auth login --brief
```

### **Verificar Estado de Credenciales:**

```bash
# Ver cuentas autenticadas
gcloud auth list

# Ver ADC activo
gcloud auth application-default print-access-token
```

---

## 🛠️ **CONFIGURACIONES ÚTILES**

### **Crear Configuraciones Múltiples:**

```bash
# Crear configuración para producción
gcloud config configurations create production
gcloud config set project fascinante-digit-1698295291643
gcloud config set account info@fascinantedigital.com

# Crear configuración para staging
gcloud config configurations create staging
gcloud config set project otro-project-id

# Listar configuraciones
gcloud config configurations list

# Activar configuración
gcloud config configurations activate production
```

### **Configurar Variables Útiles:**

```bash
# Deshabilitar prompts (para scripts)
gcloud config set disable_prompts true

# Configurar formato de output
gcloud config set core/default_output_format json

# Configurar timeouts
gcloud config set core/timeout_sec 300
```

---

## ✅ **VERIFICACIÓN COMPLETA**

### **Checklist de Configuración:**

```bash
# 1. Verificar cuenta activa
gcloud auth list
# ✅ Debe mostrar: info@fascinantedigital.com (ACTIVE)

# 2. Verificar proyecto
gcloud config get-value project
# ✅ Debe mostrar: fascinante-digit-1698295291643

# 3. Verificar ADC funciona
gcloud auth application-default print-access-token
# ✅ Debe devolver un token válido

# 4. Verificar APIs habilitadas
gcloud services list --enabled \
  --project=fascinante-digit-1698295291643 \
  --filter="name:places OR name:aiplatform"
# ✅ Debe mostrar las APIs habilitadas

# 5. Verificar región Vertex AI
gcloud config get-value ai/region
# ✅ Debe mostrar: us-central1
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Reauthentication failed"**

```bash
# Solución: Re-autenticar
gcloud auth login
gcloud auth application-default login
```

### **Error: "ADC no disponible"**

```bash
# Establecer ADC
gcloud auth application-default login
```

### **Error: "API not enabled"**

```bash
# Habilitar API específica
gcloud services enable NOMBRE_API --project=fascinante-digit-1698295291643
```

### **Error: "Project not found"**

```bash
# Verificar proyecto existe
gcloud projects describe fascinante-digit-1698295291643

# Si no existe, verificar permisos
gcloud projects list
```

---

## 📝 **CONFIGURACIÓN EN .env (Desarrollo Local)**

Después de configurar ADC, tus aplicaciones locales pueden usar:

```bash
# .env.local (Next.js)
GOOGLE_APPLICATION_CREDENTIALS=""  # Vacío = usa ADC automáticamente

# O explícitamente:
GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud/application_default_credentials.json"
```

**Para Cloudflare Workers:**
- NO usa ADC (no disponible)
- Usa API Keys directamente
- O Service Account vía REST API

---

## 🔒 **SEGURIDAD**

### **Buenas Prácticas:**

1. ✅ **NUNCA commitees credenciales** en git
2. ✅ Usa `.gitignore` para archivos de credenciales:
   ```
   *.json
   .env
   application_default_credentials.json
   ```
3. ✅ **Rotar credenciales regularmente**
4. ✅ Usar **Service Accounts** en producción (no user accounts)
5. ✅ **Restringir permisos** de Service Accounts (principio de menor privilegio)

---

## 📚 **REFERENCIAS**

- [gcloud CLI Documentation](https://cloud.google.com/sdk/gcloud)
- [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials)
- [gcloud Auth Guide](https://cloud.google.com/sdk/docs/authorizing)

---

## 🎯 **RESUMEN RÁPIDO**

```bash
# Setup completo en 3 comandos:
gcloud auth login
gcloud auth application-default login
gcloud config set project fascinante-digit-1698295291643

# O usar script automático:
./apps/api/scripts/setup-gcloud.sh
```

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
