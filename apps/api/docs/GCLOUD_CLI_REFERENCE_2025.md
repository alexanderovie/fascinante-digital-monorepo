# 📚 gcloud CLI Reference - Octubre 2025
## Comandos Modernos para Consultar GCP

---

## 🎯 **COMANDOS ESENCIALES**

### **1. INFORMACIÓN DEL PROYECTO**

```bash
# Información general del proyecto
gcloud projects describe PROJECT_ID

# Con formato específico
gcloud projects describe PROJECT_ID \
  --format="value(projectId,name,projectNumber,lifecycleState)"

# Listar todos los proyectos accesibles
gcloud projects list --format="table(projectId,name,projectNumber)"
```

### **2. CONFIGURACIÓN ACTUAL**

```bash
# Ver toda la configuración
gcloud config list

# Ver configuración con formato YAML
gcloud config list --format="yaml"

# Ver solo el proyecto activo
gcloud config get-value project

# Ver cuenta autenticada
gcloud config get-value account

# Ver todas las cuentas autenticadas
gcloud auth list
```

---

## 🔌 **APIS Y SERVICIOS**

### **2.1 Listar APIs Habilitadas**

```bash
# Todas las APIs habilitadas
gcloud services list --enabled

# Con formato tabla
gcloud services list --enabled \
  --format="table(config.name,config.title)"

# Solo nombres de servicios
gcloud services list --enabled \
  --format="value(config.name)"

# Filtrar por nombre (case-insensitive)
gcloud services list --enabled \
  --filter="name:places OR name:aiplatform"

# Filtrar por palabras clave
gcloud services list --enabled \
  --filter="config.title:Places" \
  --format="table(config.name,config.title)"
```

### **2.2 Habilitar/Deshabilitar APIs**

```bash
# Habilitar una API
gcloud services enable SERVICE_NAME \
  --project=PROJECT_ID

# Habilitar múltiples APIs
gcloud services enable \
  places-backend.googleapis.com \
  aiplatform.googleapis.com \
  --project=PROJECT_ID

# Deshabilitar API
gcloud services disable SERVICE_NAME \
  --project=PROJECT_ID

# Verificar si una API está habilitada
gcloud services list --enabled \
  --filter="config.name:SERVICE_NAME" \
  --project=PROJECT_ID
```

### **2.3 Información Detallada de una API**

```bash
# Ver detalles de una API específica
gcloud services describe SERVICE_NAME \
  --project=PROJECT_ID

# Ver configuración de una API
gcloud services describe SERVICE_NAME \
  --format="yaml(config)" \
  --project=PROJECT_ID
```

---

## 🔑 **API KEYS**

### **3.1 Listar API Keys**

```bash
# Todas las API Keys del proyecto
gcloud services api-keys list \
  --project=PROJECT_ID

# Con formato tabla detallado
gcloud services api-keys list \
  --format="table(name,displayName,createTime,restrictions.apiTargets)" \
  --project=PROJECT_ID

# Solo IDs y nombres
gcloud services api-keys list \
  --format="table(name:label=ID,displayName:label=Nombre)" \
  --project=PROJECT_ID
```

### **3.2 Detalles de una API Key Específica**

```bash
# Ver detalles completos
gcloud services api-keys describe KEY_ID \
  --project=PROJECT_ID

# Solo restricciones
gcloud services api-keys describe KEY_ID \
  --format="yaml(restrictions)" \
  --project=PROJECT_ID

# Ver restricciones de API targets
gcloud services api-keys describe KEY_ID \
  --format="value(restrictions.apiTargets)" \
  --project=PROJECT_ID
```

### **3.3 Crear/Actualizar/Eliminar API Keys**

```bash
# Crear nueva API Key
gcloud services api-keys create \
  --display-name="Nombre descriptivo" \
  --project=PROJECT_ID

# Restringir API Key a servicios específicos
gcloud services api-keys update KEY_ID \
  --api-target=service=places.googleapis.com \
  --project=PROJECT_ID

# Eliminar API Key
gcloud services api-keys delete KEY_ID \
  --project=PROJECT_ID
```

---

## 👤 **SERVICE ACCOUNTS**

### **4.1 Listar Service Accounts**

```bash
# Todos los Service Accounts
gcloud iam service-accounts list \
  --project=PROJECT_ID

# Con formato tabla
gcloud iam service-accounts list \
  --format="table(email,displayName,disabled)" \
  --project=PROJECT_ID

# Solo emails
gcloud iam service-accounts list \
  --format="value(email)" \
  --project=PROJECT_ID
```

### **4.2 Detalles de Service Account**

```bash
# Información completa
gcloud iam service-accounts describe SERVICE_ACCOUNT_EMAIL \
  --project=PROJECT_ID

# Ver roles asignados al Service Account
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:SERVICE_ACCOUNT_EMAIL" \
  --format="table(bindings.role)"
```

### **4.3 Keys de Service Account**

```bash
# Listar keys de un Service Account
gcloud iam service-accounts keys list \
  --iam-account=SERVICE_ACCOUNT_EMAIL \
  --project=PROJECT_ID

# Crear nueva key
gcloud iam service-accounts keys create KEY_FILE.json \
  --iam-account=SERVICE_ACCOUNT_EMAIL \
  --project=PROJECT_ID
```

---

## 📊 **CUOTAS Y LÍMITES**

### **5.1 Consultar Cuotas (Service Usage API)**

```bash
# Listar cuotas de un servicio (Alpha)
gcloud alpha services quotas list \
  --service=SERVICE_NAME \
  --consumer=projects/PROJECT_ID

# Ejemplo: Cuotas de Places API
gcloud alpha services quotas list \
  --service=places-backend.googleapis.com \
  --consumer=projects/fascinante-digit-1698295291643

# Ver cuota específica
gcloud alpha services quotas describe \
  --service=SERVICE_NAME \
  --consumer=projects/PROJECT_ID \
  --metric=METRIC_NAME
```

### **5.2 Alternativa: Cloud Console o API REST**

**Nota:** Para cuotas detalladas, es mejor usar:
- Google Cloud Console → IAM & Admin → Quotas
- O la API REST directamente

---

## 📈 **MONITOREO Y USO**

### **6.1 Operaciones de Servicios**

```bash
# Listar operaciones recientes
gcloud services operations list \
  --service=SERVICE_NAME \
  --project=PROJECT_ID \
  --limit=10

# Ver detalle de una operación
gcloud services operations describe OPERATION_NAME \
  --service=SERVICE_NAME \
  --project=PROJECT_ID
```

### **6.2 Uso de APIs (Logs)**

```bash
# Ver logs de uso (requiere Cloud Logging habilitado)
gcloud logging read \
  "resource.type=api AND resource.labels.service=places.googleapis.com" \
  --limit=50 \
  --format=json \
  --project=PROJECT_ID
```

---

## 🔍 **BÚSQUEDAS AVANZADAS**

### **7.1 Filtrar Resultados**

```bash
# Filtrar por nombre (case-insensitive)
gcloud services list --enabled \
  --filter="name:places"

# Filtrar por múltiples condiciones
gcloud services list --enabled \
  --filter="name:places OR name:maps"

# Filtrar APIs que contengan texto
gcloud services list --enabled \
  --filter="config.title~'Business'"

# Filtrar Service Accounts activos
gcloud iam service-accounts list \
  --filter="disabled=false" \
  --project=PROJECT_ID
```

### **7.2 Formatos de Salida**

```bash
# JSON (para scripts)
gcloud services list --enabled --format="json"

# YAML
gcloud services list --enabled --format="yaml"

# CSV
gcloud services list --enabled --format="csv(name,title)"

# Tabla personalizada
gcloud services list --enabled \
  --format="table(config.name:label=API,config.title:label=Título)"

# Solo valores (para piping)
gcloud services list --enabled \
  --format="value(config.name)"
```

---

## 🎯 **COMANDOS ÚTILES PARA AUDITORÍA**

### **8.1 Verificar Configuración Completa**

```bash
# Script de verificación completa
gcloud config list && \
gcloud auth list && \
gcloud services list --enabled --filter="name:places OR name:aiplatform" && \
gcloud services api-keys list --format="table(name,displayName)" && \
gcloud iam service-accounts list --format="table(email,displayName)"
```

### **8.2 Validar APIs Necesarias**

```bash
# Verificar Places API
gcloud services list --enabled \
  --filter="config.name:places" \
  --format="value(config.name)"

# Verificar Vertex AI
gcloud services list --enabled \
  --filter="config.name:aiplatform" \
  --format="value(config.name)"

# Verificar Business Profile
gcloud services list --enabled \
  --filter="config.name:mybusiness" \
  --format="value(config.name)"
```

### **8.3 Verificar Permisos**

```bash
# Permisos del proyecto actual
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:USER_EMAIL"

# Ver qué Service Accounts tienen acceso
gcloud projects get-iam-policy PROJECT_ID \
  --flatten="bindings[].members" \
  --format="table(bindings.role,bindings.members)" \
  --filter="bindings.members:serviceAccount"
```

---

## 🚀 **COMANDOS POR CASO DE USO**

### **Caso 1: Verificar que todo está listo para auditoría**

```bash
# Proyecto
gcloud config get-value project

# APIs necesarias
gcloud services list --enabled \
  --filter="config.name:places-backend OR config.name:aiplatform" \
  --format="table(config.name,config.title)"

# API Key de Places
gcloud services api-keys list \
  --filter="restrictions.apiTargets.service:places.googleapis.com" \
  --format="table(name,displayName,createTime)" \
  --project=$(gcloud config get-value project)

# Service Account para AI (si aplica)
gcloud iam service-accounts list \
  --filter="displayName~'AI'" \
  --format="table(email,displayName)" \
  --project=$(gcloud config get-value project)
```

### **Caso 2: Buscar API Key específica**

```bash
# Por nombre
gcloud services api-keys list \
  --filter="displayName:'Places API'" \
  --format="table(name,displayName)"

# Por servicio
gcloud services api-keys list \
  --filter="restrictions.apiTargets.service:places.googleapis.com" \
  --format="table(name,displayName)"
```

### **Caso 3: Verificar cuotas disponibles**

```bash
# Usar Cloud Console o API REST
# CLI no tiene comando directo estable para cuotas

# Alternativa: Verificar billing
gcloud billing projects describe PROJECT_ID
```

---

## 📝 **FORMATOS ÚTILES**

### **Formato para Scripts (JSON)**

```bash
gcloud services list --enabled --format="json"
```

### **Formato para Tablas Legibles**

```bash
gcloud services list --enabled \
  --format="table(config.name,config.title,config.documentation.summary)"
```

### **Formato para Piping a Otros Comandos**

```bash
# Solo valores, separados por nuevas líneas
gcloud services list --enabled \
  --format="value(config.name)" | \
  grep -i places
```

---

## ⚡ **ATAJOS ÚTILES**

```bash
# Aliases útiles (agregar a ~/.bashrc o ~/.zshrc)
alias gcp-proj='gcloud config get-value project'
alias gcp-apis='gcloud services list --enabled --format="table(config.name,config.title)"'
alias gcp-keys='gcloud services api-keys list --format="table(name,displayName)"'
alias gcp-svc='gcloud iam service-accounts list --format="table(email,displayName)"'
```

---

## 🔗 **REFERENCIAS OFICIALES**

- [gcloud CLI Reference](https://cloud.google.com/sdk/gcloud/reference)
- [Service Usage API](https://cloud.google.com/service-usage/docs)
- [API Keys Management](https://cloud.google.com/docs/apis/api-keys)
- [Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

---

## 🎯 **RESUMEN: Comandos Más Usados**

```bash
# Configuración
gcloud config list
gcloud config get-value project

# APIs
gcloud services list --enabled
gcloud services enable SERVICE_NAME

# API Keys
gcloud services api-keys list
gcloud services api-keys describe KEY_ID

# Service Accounts
gcloud iam service-accounts list
gcloud iam service-accounts describe EMAIL

# Búsqueda
gcloud services list --enabled --filter="name:SERVICE"
```

---

**Última actualización:** Octubre 2025
**Versión gcloud CLI:** 544.0.0
