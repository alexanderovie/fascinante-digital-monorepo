#!/bin/bash
# 🚀 Script Elite: Listar TODOS los Workers de Cloudflare
# Octubre 2025 - Usando Cloudflare API v4

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Account ID (de wrangler whoami)
ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"

echo -e "${BLUE}🚀 Cloudflare Workers - Lista Completa${NC}"
echo -e "${BLUE}Account ID: ${ACCOUNT_ID}${NC}\n"

# Verificar si tenemos API token
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  CLOUDFLARE_API_TOKEN no está configurado${NC}"
    echo -e "${YELLOW}Creando token desde wrangler...${NC}\n"
    
    # Intentar obtener token de wrangler
    WRANGLER_CONFIG="${HOME}/.wrangler/config/default.toml"
    if [ -f "$WRANGLER_CONFIG" ]; then
        echo -e "${BLUE}Leyendo configuración de wrangler...${NC}"
    fi
    
    echo -e "${YELLOW}Para usar este script, necesitas un API Token:${NC}"
    echo -e "1. Ve a: https://dash.cloudflare.com/profile/api-tokens"
    echo -e "2. Crear token con permisos: Account > Workers Scripts > Read"
    echo -e "3. Exportar: export CLOUDFLARE_API_TOKEN='tu-token'"
    echo -e "4. Ejecutar este script nuevamente\n"
    exit 1
fi

# Endpoint de Cloudflare API
API_URL="https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts"

echo -e "${GREEN}✅ Obteniendo lista de workers...${NC}\n"

# Hacer request a la API
RESPONSE=$(curl -s -X GET "${API_URL}" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json")

# Verificar si hubo error
if echo "$RESPONSE" | grep -q '"success":false'; then
    echo -e "${RED}❌ Error al obtener workers:${NC}"
    echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

# Verificar si tenemos jq instalado
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq no está instalado. Instalando formato...${NC}\n"
    echo "$RESPONSE"
    exit 0
fi

# Procesar respuesta con jq
WORKERS_COUNT=$(echo "$RESPONSE" | jq '.result | length')
echo -e "${GREEN}📊 Total de Workers encontrados: ${WORKERS_COUNT}${NC}\n"

# Formatear output
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}#  Worker Name                              Created                    Modified${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "$RESPONSE" | jq -r '.result[] | 
    "\(.id)\t\(.created_on // "N/A")\t\(.modified_on // "N/A")"' | \
    while IFS=$'\t' read -r id created modified; do
        # Formatear fechas si existen
        if [ "$created" != "N/A" ] && [ "$created" != "null" ]; then
            created=$(date -d "@$((created / 1000000000))" "+%Y-%m-%d" 2>/dev/null || echo "$created")
        fi
        if [ "$modified" != "N/A" ] && [ "$modified" != "null" ]; then
            modified=$(date -d "@$((modified / 1000000000))" "+%Y-%m-%d" 2>/dev/null || echo "$modified")
        fi
        printf "${GREEN}%s${NC}\t${YELLOW}%s${NC}\t${YELLOW}%s${NC}\n" "$id" "$created" "$modified"
    done

# También mostrar en formato JSON estructurado
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 Detalles Completos (JSON):${NC}\n"
echo "$RESPONSE" | jq '.result[] | {
    name: .id,
    created_on: .created_on,
    modified_on: .modified_on
}' | jq -s '.'

echo -e "\n${GREEN}✅ Análisis completado${NC}"

