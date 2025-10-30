#!/bin/bash
# Setup gcloud CLI - Moderno Octubre 2025
# Configuración completa para desarrollo local

set -e

echo "🔧 Configurando gcloud CLI - Octubre 2025"
echo "=========================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
PROJECT_ID="fascinante-digit-1698295291643"
REGION="us-central1"
ACCOUNT="info@fascinantedigital.com"

echo -e "${YELLOW}Paso 1: Actualizando gcloud CLI...${NC}"
gcloud components update --quiet || echo "Ya está actualizado"

echo ""
echo -e "${YELLOW}Paso 2: Autenticando cuenta de usuario...${NC}"
gcloud auth login $ACCOUNT --brief || gcloud auth login

echo ""
echo -e "${YELLOW}Paso 3: Configurando proyecto...${NC}"
gcloud config set project $PROJECT_ID

echo ""
echo -e "${YELLOW}Paso 4: Configurando cuenta activa...${NC}"
gcloud config set account $ACCOUNT

echo ""
echo -e "${YELLOW}Paso 5: Configurando Application Default Credentials (ADC)...${NC}"
gcloud auth application-default login

echo ""
echo -e "${YELLOW}Paso 6: Configurando región para Vertex AI...${NC}"
gcloud config set ai/region $REGION
gcloud config set aiplatform/region $REGION

echo ""
echo -e "${YELLOW}Paso 7: Habilitando APIs necesarias...${NC}"
gcloud services enable \
  places-backend.googleapis.com \
  places-backend-new.googleapis.com \
  aiplatform.googleapis.com \
  --project=$PROJECT_ID

echo ""
echo -e "${YELLOW}Paso 8: Verificando configuración...${NC}"
echo ""
echo "Configuración actual:"
gcloud config list

echo ""
echo -e "${YELLOW}Verificando APIs habilitadas:${NC}"
gcloud services list --enabled \
  --project=$PROJECT_ID \
  --filter="name:places OR name:aiplatform" \
  --format="table(service.name,service.title)"

echo ""
echo -e "${GREEN}✅ Configuración completada!${NC}"
echo ""
echo "Para verificar autenticación:"
echo "  gcloud auth list"
echo ""
echo "Para verificar ADC:"
echo "  gcloud auth application-default print-access-token"
echo ""
echo "Para verificar proyecto:"
echo "  gcloud config get-value project"

