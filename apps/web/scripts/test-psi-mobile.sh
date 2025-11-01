#!/bin/bash

# Script para ejecutar PageSpeed Insights móvil
# Uso: ./scripts/test-psi-mobile.sh [API_KEY] [URL]

API_KEY="${1:-$PSI_API_KEY}"
BASE_URL="${2:-https://fascinantedigital.com/es}"

if [ -z "$API_KEY" ]; then
  echo "❌ Error: API_KEY requerida"
  echo "Uso: $0 [API_KEY] [URL]"
  echo "O establece PSI_API_KEY como variable de entorno"
  exit 1
fi

# Agregar parámetro de no-cache con timestamp para forzar evaluación fresca
TIMESTAMP=$(date +%s)
URL="${BASE_URL}?_nocache=${TIMESTAMP}"

echo "🚀 Ejecutando PageSpeed Insights Mobile..."
echo "URL base: $BASE_URL"
echo "URL con no-cache: $URL"
echo ""

# Ejecutar PSI y guardar resultado
# URL encode del parámetro _nocache
ENCODED_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$URL', safe=':/?#=&'))" 2>/dev/null || echo "$URL")
RESPONSE=$(curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${ENCODED_URL}&key=${API_KEY}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO")

# Verificar si hay error real (no solo la palabra "error" en cualquier parte)
if echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); exit(0 if 'error' in data and data['error'] else 1)" 2>/dev/null; then
  echo "❌ Error en la API:"
  echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data.get('error', {}), indent=2))" 2>/dev/null || echo "$RESPONSE" | head -c 500
  exit 1
fi

# Verificar si la respuesta está vacía o inválida
if [ -z "$RESPONSE" ] || ! echo "$RESPONSE" | python3 -c "import sys, json; json.load(sys.stdin)" 2>/dev/null; then
  echo "❌ Error: Respuesta inválida de la API"
  echo "Respuesta recibida:"
  echo "$RESPONSE" | head -c 200
  exit 1
fi

# Verificar que tiene lighthouseResult (respuesta válida)
if ! echo "$RESPONSE" | grep -q '"lighthouseResult"'; then
  echo "❌ Error: Respuesta no contiene lighthouseResult"
  echo "$RESPONSE" | head -c 500
  exit 1
fi

# Extraer métricas principales
echo "📊 RESULTADOS PSI MOBILE:"
echo "=========================="

# Performance Score
PERF_SCORE=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['lighthouseResult']['categories']['performance']['score'] * 100)" 2>/dev/null)
echo "🎯 Performance Score: ${PERF_SCORE:-N/A}"

# Métricas Core Web Vitals
echo ""
echo "📈 Core Web Vitals:"

FCP=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); audits=data['lighthouseResult']['audits']; print(f\"FCP: {audits.get('first-contentful-paint', {}).get('numericValue', 'N/A') / 1000:.2f}s\")" 2>/dev/null)
LCP=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); audits=data['lighthouseResult']['audits']; print(f\"LCP: {audits.get('largest-contentful-paint', {}).get('numericValue', 'N/A') / 1000:.2f}s\")" 2>/dev/null)
TBT=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); audits=data['lighthouseResult']['audits']; print(f\"TBT: {audits.get('total-blocking-time', {}).get('numericValue', 'N/A') / 1000:.2f}s\")" 2>/dev/null)
CLS=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); audits=data['lighthouseResult']['audits']; print(f\"CLS: {audits.get('cumulative-layout-shift', {}).get('numericValue', 'N/A')}\")" 2>/dev/null)
SPEED_INDEX=$(echo "$RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); audits=data['lighthouseResult']['audits']; print(f\"Speed Index: {audits.get('speed-index', {}).get('numericValue', 'N/A') / 1000:.2f}s\")" 2>/dev/null)

echo "$FCP"
echo "$LCP"
echo "$TBT"
echo "$CLS"
echo "$SPEED_INDEX"

# Guardar respuesta completa
OUTPUT_FILE="psi-mobile-$(date +%Y%m%d-%H%M%S).json"
echo "$RESPONSE" > "$OUTPUT_FILE"
echo ""
echo "💾 Respuesta completa guardada en: $OUTPUT_FILE"
echo ""
echo "🔗 Ver resultados en: https://pagespeed.web.dev/analysis?url=$(echo $BASE_URL | sed 's/#/%23/g')"
