#!/bin/bash

# Script simplificado para verificar PSI sin API key
# Usa curl para hacer una consulta básica y extraer información clave

URL="https://fascinantedigital.com/es"
PSI_URL="https://pagespeed.web.dev/analysis?url=${URL}"

echo "🔍 Verificación Rápida - PageSpeed Insights"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL: ${URL}"
echo ""

# Intentar obtener información básica sin API key
echo "📡 Consultando PageSpeed Insights (público)..."
echo ""

# Verificar si el sitio está accesible
echo "1. Verificando accesibilidad del sitio..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL" --max-time 10)

if [ "$HTTP_CODE" = "200" ]; then
  echo "   ✅ Sitio accesible (HTTP ${HTTP_CODE})"
else
  echo "   ⚠️  Sitio devolvió HTTP ${HTTP_CODE}"
fi

echo ""
echo "2. Verificando presencia de GTM en el sitio..."

# Verificar si GTM está presente en el HTML
GTM_CHECK=$(curl -s "$URL" --max-time 10 | grep -i "googletagmanager\|gtm.js\|GTM-" | head -3)

if [ -n "$GTM_CHECK" ]; then
  echo "   ✅ GTM detectado en el HTML"
  echo "$GTM_CHECK" | sed 's/^/   /'
else
  echo "   ⚠️  GTM no encontrado en el HTML inicial"
  echo "   (Puede estar cargando de forma diferida - esto es correcto si está optimizado)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Para análisis completo de Performance:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Opción 1: Interfaz Web (Recomendado)"
echo "   ${PSI_URL}"
echo ""
echo "Opción 2: API con key"
echo "   1. Obtener API key: https://developers.google.com/speed/docs/insights/v5/get-started"
echo "   2. export PSI_API_KEY=tu_key"
echo "   3. ./check-psi-gtm-performance.sh"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
