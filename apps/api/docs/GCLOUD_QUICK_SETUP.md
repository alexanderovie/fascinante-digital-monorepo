# ⚡ Setup Rápido gcloud CLI - Octubre 2025

## 🚀 **3 Comandos Esenciales**

Ejecuta estos comandos en tu terminal (se abrirá el navegador para autenticación):

```bash
# 1. Autenticar tu cuenta (se abrirá navegador)
gcloud auth login

# 2. Configurar Application Default Credentials (se abrirá navegador)
gcloud auth application-default login

# 3. Configurar proyecto
gcloud config set project fascinante-digit-1698295291643
```

## ✅ **Verificar Configuración**

```bash
# Ver que todo está bien
gcloud config list
gcloud auth list
gcloud auth application-default print-access-token
```

## 📋 **Configuraciones Adicionales (Opcional)**

```bash
# Habilitar APIs necesarias
gcloud services enable \
  places-backend.googleapis.com \
  places-backend-new.googleapis.com \
  aiplatform.googleapis.com

# Configurar región para Vertex AI
gcloud config set ai/region us-central1
```

## 🎯 **¡Listo!**

Después de ejecutar estos comandos, gcloud CLI estará configurado según mejores prácticas de octubre 2025.

**Para más detalles:** Ver `GCLOUD_SETUP_2025.md`
