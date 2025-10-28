# 🎯 Estrategia Elite: Limpieza GCP Sin Perder Aprobaciones
## Octubre 2025 - Restructuración Limpia

---

## 🚨 **LO QUE DEBES MANTENER (CRÍTICO)**

### **1. Aprobaciones de Google OAuth Consent Screen**
- ✅ **Verificación de dominio** (si aplica)
- ✅ **Configuración de OAuth consent screen**
- ✅ **Scopes aprobados** (`business.manage`, etc.)
- ✅ **Usuarios de prueba configurados**
- ✅ **Verificación de marca** (si existe)

**Dónde verificar:**
- Google Cloud Console → APIs & Services → OAuth consent screen
- **NO se pierde al limpiar APIs/Keys**

### **2. Verificaciones de Dominio**
- ✅ Verificación de propiedad de dominio
- ✅ Configuración de DNS/HTML
- ✅ **NO se pierde** al limpiar recursos del proyecto

### **3. Facturación Activo**
- ✅ Billing account vinculado
- ✅ **NO se pierde** al limpiar recursos

### **4. Proyecto y Permisos IAM**
- ✅ El proyecto en sí (no se puede perder)
- ✅ Permisos de usuarios/SAs importantes

---

## 🗑️ **LO QUE PUEDES LIMPIAR (Seguro)**

### **1. API Keys de Prueba**
- ❌ Puedes eliminar API Keys de prueba
- ✅ Puedes crear nuevas después
- ⚠️ **NO afecta** OAuth consent screen

**Identificar de prueba:**
- Keys con nombres como: "test", "prueba", "dev", "demo"
- Keys antiguas no usadas
- Keys sin restricciones (menos seguras)

### **2. Service Accounts de Prueba**
- ❌ Puedes eliminar SAs de prueba
- ✅ Puedes crear nuevos después
- ⚠️ **NO afecta** aprobaciones OAuth

**Identificar de prueba:**
- Nombres con "test", "dev", "prueba", "demo"
- SAs sin uso activo
- SAs con permisos excesivos

### **3. APIs Habilitadas Innecesarias**
- ❌ Puedes deshabilitar APIs de prueba
- ✅ Puedes habilitarlas de nuevo cuando las necesites
- ⚠️ **NO afecta** aprobaciones OAuth

---

## 🎯 **ESTRATEGIA ELITE: Limpieza Ordenada**

### **FASE 1: Auditoría (Inventario Completo)**

#### **1.1 Documentar TODO antes de eliminar**

```bash
# Crear backup de configuración actual
mkdir -p ~/gcp-backup-$(date +%Y%m%d)

# Exportar APIs habilitadas
gcloud services list --enabled \
  --project=fascinante-digit-1698295291643 \
  --format="json" > ~/gcp-backup-$(date +%Y%m%d)/apis-enabled.json

# Exportar API Keys
gcloud services api-keys list \
  --project=fascinante-digit-1698295291643 \
  --format="json" > ~/gcp-backup-$(date +%Y%m%d)/api-keys.json

# Exportar Service Accounts
gcloud iam service-accounts list \
  --project=fascinante-digit-1698295291643 \
  --format="json" > ~/gcp-backup-$(date +%Y%m%d)/service-accounts.json

# Exportar IAM policies
gcloud projects get-iam-policy fascinante-digit-1698295291643 \
  --format="json" > ~/gcp-backup-$(date +%Y%m%d)/iam-policy.json
```

#### **1.2 Identificar Recursos de Producción vs Prueba**

**Marcadores de "Producción":**
- ✅ Nombres descriptivos profesionales
- ✅ Restricciones de seguridad configuradas
- ✅ Última modificación reciente (en uso)
- ✅ Relacionados con funcionalidades activas

**Marcadores de "Prueba":**
- ❌ Nombres con "test", "dev", "prueba", "demo", "trial"
- ❌ Sin restricciones de seguridad
- ❌ Última modificación muy antigua
- ❌ Sin uso en código actual

---

### **FASE 2: Limpieza Selectiva (Lo Seguro)**

#### **2.1 Limpiar API Keys de Prueba**

```bash
# Listar todas las keys
gcloud services api-keys list \
  --project=fascinante-digit-1698295291643 \
  --format="table(name,displayName,createTime)"

# Eliminar keys de prueba (EJEMPLO - ajustar nombres)
gcloud services api-keys delete KEY_ID \
  --project=fascinante-digit-1698295291643 \
  --quiet
```

**Keys a CONSERVAR:**
- ✅ "Google Places API Key para Buscar Negocios" (producción)
- ✅ Keys usadas en código activo
- ✅ Keys con restricciones de seguridad

**Keys a ELIMINAR:**
- ❌ "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" (si es duplicado/antigua)
- ❌ Keys sin uso en código
- ❌ Keys de prueba obvias

#### **2.2 Limpiar Service Accounts de Prueba**

```bash
# Listar Service Accounts
gcloud iam service-accounts list \
  --project=fascinante-digit-1698295291643 \
  --format="table(email,displayName,createTime)"

# Eliminar SA de prueba (EJEMPLO)
gcloud iam service-accounts delete \
  SERVICE_ACCOUNT_EMAIL \
  --project=fascinante-digit-1698295291643 \
  --quiet
```

**SAs a CONSERVAR:**
- ✅ `google-business-proxy@` (en uso)
- ✅ `fascinante-2025-*` (estructura organizada)
- ✅ SAs referenciados en código

**SAs a ELIMINAR:**
- ❌ Solo si son claramente de prueba
- ❌ Si no se usan hace meses
- ⚠️ **CUIDADO:** Pueden tener keys/permisos importantes

#### **2.3 Deshabilitar APIs Innecesarias**

```bash
# Listar APIs habilitadas
gcloud services list --enabled \
  --project=fascinante-digit-1698295291643

# Deshabilitar APIs de prueba (si hay)
gcloud services disable SERVICE_NAME \
  --project=fascinante-digit-1698295291643 \
  --force  # Ignora dependencias
```

**APIs a CONSERVAR:**
- ✅ Places API (producción)
- ✅ Vertex AI (si la usas)
- ✅ Business Profile APIs (si las usas)
- ✅ APIs relacionadas con OAuth

---

### **FASE 3: Organización (Opcional pero Recomendado)**

#### **3.1 Etiquetar Recursos de Producción**

```bash
# Agregar labels al proyecto (si no tiene)
gcloud projects update fascinante-digit-1698295291643 \
  --labels=environment=production,purpose=production
```

#### **3.2 Renombrar Recursos Importantes**

```bash
# Renombrar API Key (si es necesario)
gcloud services api-keys update KEY_ID \
  --display-name="Places API - Production" \
  --project=fascinante-digit-1698295291643

# Actualizar descripción de Service Account
gcloud iam service-accounts update SERVICE_ACCOUNT_EMAIL \
  --description="Production service account for X" \
  --project=fascinante-digit-1698295291643
```

---

## 🔒 **VERIFICAR ANTES DE ELIMINAR**

### **Checklist Pre-Eliminación:**

Antes de eliminar CUALQUIER recurso:

- [ ] ✅ Verificar en código si está en uso:
  ```bash
  grep -r "KEY_ID\|SERVICE_ACCOUNT" apps/
  ```

- [ ] ✅ Verificar en variables de entorno:
  ```bash
  grep -r "KEY\|SERVICE_ACCOUNT" .env* apps/api/.dev.vars
  ```

- [ ] ✅ Verificar en Cloudflare Workers secrets:
  ```bash
  wrangler secret list
  ```

- [ ] ✅ Verificar últimos logs de uso (Cloud Console)

---

## 🎯 **ALTERNATIVA: CREAR NUEVO PROYECTO**

### **Si quieres empezar COMPLETAMENTE limpio:**

#### **Opción A: Proyecto Nuevo + Migrar Aprobaciones**

1. **Crear proyecto nuevo:**
   ```bash
   gcloud projects create fascinante-digit-2025 \
     --name="Fascinante Digital 2025"
   ```

2. **Migrar OAuth Consent Screen:**
   - ❌ **NO se puede migrar directamente**
   - ✅ Debes reconfigurar en el nuevo proyecto
   - ⚠️ **Requiere nueva verificación** de dominio
   - ⚠️ **Requiere nueva revisión** de Google (si es necesario)

3. **Migrar dominios verificados:**
   - ⚠️ Debes reverificar en el nuevo proyecto
   - ⚠️ Puede requerir cambios de DNS

#### **Opción B: Limpieza Selectiva (RECOMENDADA)**

- ✅ Mantienes el proyecto existente
- ✅ Mantienes todas las aprobaciones
- ✅ Solo limpias recursos innecesarios
- ✅ Empiezas limpio en organización

---

## 📋 **PLAN DE ACCIÓN RECOMENDADO**

### **Paso 1: Backup Completo**
```bash
# Ejecutar comandos de FASE 1
# Guardar backups en lugar seguro
```

### **Paso 2: Análisis**
- Revisar backups
- Identificar qué es producción vs prueba
- Marcar recursos a eliminar

### **Paso 3: Limpieza Gradual**
- Empezar con recursos obviamente de prueba
- Verificar que nada se rompe
- Continuar gradualmente

### **Paso 4: Organización**
- Renombrar recursos importantes
- Agregar descripciones
- Documentar estructura

---

## ✅ **LO QUE NO SE PIERDE**

### **Al Limpiar APIs/Keys/SAs:**

✅ **SE MANTIENE:**
- OAuth Consent Screen configuration
- Dominios verificados
- Facturación
- Permisos IAM de usuarios
- Historial de facturación
- Logs históricos

❌ **SE PIERDE (pero recuperable):**
- API Keys eliminadas (deben recrearse)
- Service Accounts eliminados (deben recrearse)
- APIs deshabilitadas (pueden re-habilitarse)

---

## 🎯 **RECOMENDACIÓN FINAL**

### **Estrategia Elite Recomendada:**

1. ✅ **NO crear nuevo proyecto** (pierdes aprobaciones)
2. ✅ **Hacer backup completo** primero
3. ✅ **Limpiar gradualmente** (no todo de una vez)
4. ✅ **Mantener estructura organizada** (`fascinante-2025-*`)
5. ✅ **Eliminar solo lo obviamente de prueba**
6. ✅ **Renombrar lo importante** con naming consistente
7. ✅ **Documentar estructura final**

### **Orden de Limpieza Seguro:**

1. APIs habilitadas innecesarias (fácil de revertir)
2. API Keys obviamente de prueba
3. Service Accounts sin uso
4. Keys/SAs antiguos sin restricciones

---

## 🔍 **SCRIPTS ÚTILES**

### **Script de Auditoría Pre-Limpieza**

```bash
#!/bin/bash
# audits/gcp-audit.sh

PROJECT="fascinante-digit-1698295291643"
BACKUP_DIR="~/gcp-audit-$(date +%Y%m%d)"

mkdir -p "$BACKUP_DIR"

echo "🔍 Auditoría GCP - $PROJECT"

# APIs
gcloud services list --enabled \
  --project=$PROJECT \
  --format="json" > "$BACKUP_DIR/apis.json"

# API Keys
gcloud services api-keys list \
  --project=$PROJECT \
  --format="json" > "$BACKUP_DIR/api-keys.json"

# Service Accounts
gcloud iam service-accounts list \
  --project=$PROJECT \
  --format="json" > "$BACKUP_DIR/service-accounts.json"

# IAM
gcloud projects get-iam-policy $PROJECT \
  --format="json" > "$BACKUP_DIR/iam.json"

echo "✅ Backup guardado en: $BACKUP_DIR"
```

---

## ⚠️ **ADVERTENCIAS IMPORTANTES**

1. **OAuth Consent Screen:**
   - Está vinculado al proyecto
   - NO se puede migrar fácilmente
   - Si creas proyecto nuevo, debes reconfigurar desde cero

2. **Verificación de Dominio:**
   - También vinculada al proyecto
   - Requiere reverificación en proyecto nuevo

3. **Historial y Logs:**
   - Se pierden al cambiar de proyecto
   - Mejor mantener proyecto existente

---

## 💡 **FEEDBACK FINAL**

### **✅ Lo que DEBES hacer:**

1. ✅ **Backup completo** antes de cualquier eliminación
2. ✅ **Auditar** qué recursos están en uso
3. ✅ **Limpiar gradualmente** (no todo de golpe)
4. ✅ **Mantener el proyecto** (no crear uno nuevo)
5. ✅ **Documentar** qué eliminas y por qué

### **❌ Lo que NO debes hacer:**

1. ❌ **Eliminar todo de una vez**
2. ❌ **Crear proyecto nuevo** (pierdes aprobaciones)
3. ❌ **Eliminar sin verificar uso en código**
4. ❌ **Limpiar sin backup**

---

## 🎯 **PRÓXIMOS PASOS SUGERIDOS**

1. Ejecutar script de auditoría
2. Revisar backups identificando producción vs prueba
3. Crear lista de recursos a eliminar
4. Verificar uso en código
5. Eliminar gradualmente
6. Documentar estructura final

---

**Última actualización:** Octubre 2025
**Recomendación:** ✅ Limpieza selectiva, NO proyecto nuevo
