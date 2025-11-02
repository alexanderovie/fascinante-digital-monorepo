#!/bin/bash

# Script para consultar PageSpeed Insights API v5 - Mobile Performance
# Basado en documentación oficial Google (Context7 2025)
# URL: https://fascinantedigital.com/es

URL="https://fascinantedigital.com/es"
API_KEY="${PSI_API_KEY:-}"

echo "📊 PageSpeed Insights API v5 - Mobile Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL: ${URL}"
echo "Estrategia: Mobile"
echo "API: v5 (2025)"
echo ""

if [ -z "$API_KEY" ]; then
  echo "⚠️  API Key no configurada"
  echo ""
  echo "Para usar la API necesitas:"
  echo "1. Obtener API key: https://console.cloud.google.com/"
  echo "2. Habilitar PageSpeed Insights API"
  echo "3. Configurar: export PSI_API_KEY=tu_api_key"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔗 Alternativa: Interfaz Web"
  echo "https://pagespeed.web.dev/analysis?url=${URL}"
  echo ""
  exit 1
fi

echo "📡 Consultando PageSpeed Insights API..."
echo ""

# Construir URL con parámetros según documentación oficial
API_URL="https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
REQUEST_URL="${API_URL}?url=${URL}&strategy=mobile&key=${API_KEY}"

# Realizar consulta
RESPONSE=$(curl -s "$REQUEST_URL")

if [ $? -ne 0 ]; then
  echo "❌ Error al consultar API"
  exit 1
fi

# Verificar si hay errores en la respuesta
ERROR=$(echo "$RESPONSE" | grep -o '"error":{[^}]*}' || echo "")

if [ -n "$ERROR" ]; then
  echo "❌ Error en respuesta de API:"
  echo "$RESPONSE" | grep -o '"message":"[^"]*"' | head -1
  echo ""
  echo "Respuesta completa:"
  echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
  exit 1
fi

# Extraer información usando grep/jq si está disponible
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 RESULTADOS - MOBILE PERFORMANCE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Performance Score
PERF_SCORE=$(echo "$RESPONSE" | grep -o '"performance":{[^}]*"score":[0-9.]*' | grep -o '"score":[0-9.]*' | cut -d: -f2)
if [ -n "$PERF_SCORE" ]; then
  PERF_PERCENT=$(echo "$PERF_SCORE * 100" | bc | cut -d. -f1)
  echo "🎯 Performance Score: ${PERF_PERCENT}/100"

  if (( $(echo "$PERF_PERCENT >= 90" | bc -l) )); then
    echo "   Estado: ✅ EXCELENTE"
  elif (( $(echo "$PERF_PERCENT >= 75" | bc -l) )); then
    echo "   Estado: ✅ BUENO"
  elif (( $(echo "$PERF_PERCENT >= 50" | bc -l) )); then
    echo "   Estado: ⚠️  NECESITA MEJORA"
  else
    echo "   Estado: ❌ POBRE"
  fi
else
  echo "⚠️  No se pudo extraer Performance Score"
fi

echo ""

# Core Web Vitals - Lighthouse Audits
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Core Web Vitals (Lighthouse)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# LCP
LCP=$(echo "$RESPONSE" | grep -o '"largest-contentful-paint"[^}]*"numericValue":[0-9.]*' | grep -o '"numericValue":[0-9.]*' | cut -d: -f2)
if [ -n "$LCP" ]; then
  LCP_MS=$(echo "$LCP" | cut -d. -f1)
  echo "LCP (Largest Contentful Paint): ${LCP_MS}ms"
  if (( $(echo "$LCP_MS < 2500" | bc -l) )); then
    echo "   ✅ Objetivo cumplido (< 2500ms)"
  else
    echo "   ⚠️  Por encima del objetivo"
  fi
fi

# FCP
FCP=$(echo "$RESPONSE" | grep -o '"first-contentful-paint"[^}]*"numericValue":[0-9.]*' | grep -o '"numericValue":[0-9.]*' | cut -d: -f2)
if [ -n "$FCP" ]; then
  FCP_MS=$(echo "$FCP" | cut -d. -f1)
  echo "FCP (First Contentful Paint): ${FCP_MS}ms"
  if (( $(echo "$FCP_MS < 1800" | bc -l) )); then
    echo "   ✅ Objetivo cumplido (< 1800ms)"
  else
    echo "   ⚠️  Por encima del objetivo"
  fi
fi

# TBT
TBT=$(echo "$RESPONSE" | grep -o '"total-blocking-time"[^}]*"numericValue":[0-9.]*' | grep -o '"numericValue":[0-9.]*' | cut -d: -f2)
if [ -n "$TBT" ]; then
  TBT_MS=$(echo "$TBT" | cut -d. -f1)
  echo "TBT (Total Blocking Time): ${TBT_MS}ms"
  if (( $(echo "$TBT_MS < 200" | bc -l) )); then
    echo "   ✅ Objetivo cumplido (< 200ms)"
  else
    echo "   ⚠️  Por encima del objetivo"
  fi
fi

# CLS
CLS=$(echo "$RESPONSE" | grep -o '"cumulative-layout-shift"[^}]*"numericValue":[0-9.]*' | grep -o '"numericValue":[0-9.]*' | cut -d: -f2)
if [ -n "$CLS" ]; then
  echo "CLS (Cumulative Layout Shift): ${CLS}"
  if (( $(echo "$CLS < 0.1" | bc -l) )); then
    echo "   ✅ Objetivo cumplido (< 0.1)"
  else
    echo "   ⚠️  Por encima del objetivo"
  fi
fi

# Speed Index
SI=$(echo "$RESPONSE" | grep -o '"speed-index"[^}]*"numericValue":[0-9.]*' | grep -o '"numericValue":[0-9.]*' | cut -d: -f2)
if [ -n "$SI" ]; then
  SI_MS=$(echo "$SI" | cut -d. -f1)
  echo "Speed Index: ${SI_MS}ms"
  if (( $(echo "$SI_MS < 3400" | bc -l) )); then
    echo "   ✅ Objetivo cumplido (< 3400ms)"
  else
    echo "   ⚠️  Por encima del objetivo"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Google Tag Manager (GTM)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar si GTM está presente
GTM_FOUND=$(echo "$RESPONSE" | grep -i "googletagmanager\|gtm.js\|GTM-" | wc -l)

if [ "$GTM_FOUND" -gt 0 ]; then
  echo "✅ GTM detectado en el análisis"
  echo "   Referencias encontradas: ${GTM_FOUND}"
  echo ""
  echo "🔍 Detalles:"
  echo "$RESPONSE" | grep -i "googletagmanager\|gtm.js\|GTM-" | head -3 | sed 's/^/   /'
else
  echo "⚠️  GTM no detectado en la respuesta"
  echo "   Esto puede significar:"
  echo "   - GTM está desactivado"
  echo "   - GTM carga de forma diferida (optimizado)"
  echo "   - GTM no aparece en el análisis inicial"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Guardar respuesta completa
TIMESTAMP=$(date +%s)
OUTPUT_FILE="/tmp/psi-response-${TIMESTAMP}.json"
echo "$RESPONSE" > "$OUTPUT_FILE"
echo ""
echo "💾 Respuesta completa guardada en: ${OUTPUT_FILE}"
echo ""
echo "📋 Para análisis detallado:"
echo "   cat ${OUTPUT_FILE} | jq '.'"
echo ""
