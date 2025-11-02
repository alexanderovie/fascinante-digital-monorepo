#!/bin/bash

# Script para verificar GTM y Performance mediante PageSpeed Insights API
# URL: https://fascinantedigital.com/es

URL="https://fascinantedigital.com/es"
API_KEY="${PSI_API_KEY:-}" # Puede configurarse como variable de entorno

echo "🔍 Verificando GTM y Performance - PageSpeed Insights API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL: ${URL}"
echo "Estrategia: Mobile"
echo ""

# Función para consultar PSI API
check_psi() {
  local api_key=$1

  if [ -z "$api_key" ]; then
    echo "⚠️  API Key no configurada"
    echo ""
    echo "Para usar la API, necesitas:"
    echo "1. Obtener API key: https://developers.google.com/speed/docs/insights/v5/get-started"
    echo "2. Configurar: export PSI_API_KEY=your_key_here"
    echo ""
    echo "O usar la interfaz web: https://pagespeed.web.dev/analysis?url=${URL}"
    echo ""
    return 1
  fi

  echo "📡 Consultando PageSpeed Insights API..."
  echo ""

  # Consultar API
  RESPONSE=$(curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=mobile&key=${api_key}")

  if [ $? -ne 0 ]; then
    echo "❌ Error al consultar API"
    return 1
  fi

  # Extraer Performance Score
  PERF_SCORE=$(echo "$RESPONSE" | grep -o '"score":[0-9.]*' | head -1 | cut -d: -f2)
  PERF_SCORE_PERCENT=$(echo "$PERF_SCORE * 100" | bc | cut -d. -f1)

  # Extraer Core Web Vitals
  LCP=$(echo "$RESPONSE" | grep -o '"largest-contentful-paint"[^}]*"value":[0-9.]*' | grep -o '"value":[0-9.]*' | cut -d: -f2)
  FID=$(echo "$RESPONSE" | grep -o '"first-input-delay"[^}]*"value":[0-9.]*' | grep -o '"value":[0-9.]*' | cut -d: -f2)
  CLS=$(echo "$RESPONSE" | grep -o '"cumulative-layout-shift"[^}]*"value":[0-9.]*' | grep -o '"value":[0-9.]*' | cut -d: -f2)
  FCP=$(echo "$RESPONSE" | grep -o '"first-contentful-paint"[^}]*"value":[0-9.]*' | grep -o '"value":[0-9.]*' | cut -d: -f2)

  # Verificar si GTM está presente
  GTM_FOUND=$(echo "$RESPONSE" | grep -i "googletagmanager\|gtm.js" | wc -l)

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📊 RESULTADOS - MOBILE PERFORMANCE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  if [ -n "$PERF_SCORE_PERCENT" ]; then
    echo "🎯 Performance Score: ${PERF_SCORE_PERCENT}/100"

    if [ "$PERF_SCORE_PERCENT" -ge 90 ]; then
      echo "   Estado: ✅ EXCELENTE"
    elif [ "$PERF_SCORE_PERCENT" -ge 75 ]; then
      echo "   Estado: ✅ BUENO"
    elif [ "$PERF_SCORE_PERCENT" -ge 50 ]; then
      echo "   Estado: ⚠️  NECESITA MEJORA"
    else
      echo "   Estado: ❌ POBRE"
    fi
  else
    echo "⚠️  No se pudo extraer Performance Score"
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📈 Core Web Vitals"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  if [ -n "$LCP" ]; then
    LCP_MS=$(echo "$LCP * 1000" | bc | cut -d. -f1)
    echo "LCP (Largest Contentful Paint): ${LCP_MS}ms"
    if (( $(echo "$LCP_MS < 2500" | bc -l) )); then
      echo "   ✅ Objetivo cumplido (< 2500ms)"
    else
      echo "   ⚠️  Por encima del objetivo"
    fi
  fi

  if [ -n "$FID" ]; then
    FID_MS=$(echo "$FID * 1000" | bc | cut -d. -f1)
    echo "FID (First Input Delay): ${FID_MS}ms"
    if (( $(echo "$FID_MS < 100" | bc -l) )); then
      echo "   ✅ Objetivo cumplido (< 100ms)"
    else
      echo "   ⚠️  Por encima del objetivo"
    fi
  fi

  if [ -n "$CLS" ]; then
    echo "CLS (Cumulative Layout Shift): ${CLS}"
    if (( $(echo "$CLS < 0.1" | bc -l) )); then
      echo "   ✅ Objetivo cumplido (< 0.1)"
    else
      echo "   ⚠️  Por encima del objetivo"
    fi
  fi

  if [ -n "$FCP" ]; then
    FCP_MS=$(echo "$FCP * 1000" | bc | cut -d. -f1)
    echo "FCP (First Contentful Paint): ${FCP_MS}ms"
    if (( $(echo "$FCP_MS < 1800" | bc -l) )); then
      echo "   ✅ Objetivo cumplido (< 1800ms)"
    else
      echo "   ⚠️  Por encima del objetivo"
    fi
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "🔍 Google Tag Manager (GTM)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""

  if [ "$GTM_FOUND" -gt 0 ]; then
    echo "✅ GTM detectado en el sitio"
    echo "   Referencias encontradas: ${GTM_FOUND}"
    echo ""
    echo "🔍 Detalles de GTM en la respuesta:"
    echo "$RESPONSE" | grep -i "googletagmanager\|gtm.js" | head -3 | sed 's/^/   /'
  else
    echo "⚠️  GTM no detectado en la respuesta de PSI"
    echo "   Esto puede significar:"
    echo "   - GTM está desactivado (NEXT_PUBLIC_ENABLE_GTM=false)"
    echo "   - GTM carga de forma diferida (optimizado)"
    echo "   - GTM no aparece en el análisis inicial"
  fi

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Guardar respuesta completa para análisis
  echo "$RESPONSE" > /tmp/psi-response-$(date +%s).json
  echo ""
  echo "💾 Respuesta completa guardada en: /tmp/psi-response-*.json"
  echo ""

  # Mostrar oportunidades de mejora
  echo "🔧 Oportunidades de mejora detectadas:"
  echo "$RESPONSE" | grep -i "opportunity\|audit" | head -5 | sed 's/^/   /' || echo "   (Revisar respuesta completa)"
  echo ""
}

# Verificar si jq está instalado (útil para parsear JSON)
if ! command -v jq &> /dev/null; then
  echo "⚠️  'jq' no está instalado (útil para parsear JSON mejor)"
  echo "   Instalar: sudo apt-get install jq (Ubuntu/Debian)"
  echo ""
fi

# Ejecutar verificación
if [ -n "$API_KEY" ]; then
  check_psi "$API_KEY"
else
  echo "📝 MODO SIN API KEY"
  echo ""
  echo "Para usar la API completa, necesitas una API key de Google:"
  echo ""
  echo "1. Obtener API key:"
  echo "   https://developers.google.com/speed/docs/insights/v5/get-started"
  echo ""
  echo "2. Configurar variable de entorno:"
  echo "   export PSI_API_KEY=tu_api_key_aqui"
  echo ""
  echo "3. Ejecutar de nuevo este script"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Alternativa: Usar interfaz web"
  echo "https://pagespeed.web.dev/analysis?url=${URL}"
  echo ""
fi
