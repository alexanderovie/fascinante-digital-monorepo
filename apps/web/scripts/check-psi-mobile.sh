#!/bin/bash

# Script para verificar PageSpeed Insights - Mobile Performance
# URL: https://fascinantedigital.com/es

URL="https://fascinantedigital.com/es"
PSI_URL="https://pagespeed.web.dev/analysis?url=${URL}"

echo "🔍 Verificando PageSpeed Insights - Mobile Performance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL a analizar: ${URL}"
echo ""
echo "📱 Métricas a verificar (Mobile):"
echo "  • Performance Score"
echo "  • First Contentful Paint (FCP)"
echo "  • Largest Contentful Paint (LCP)"
echo "  • Cumulative Layout Shift (CLS)"
echo "  • Total Blocking Time (TBT)"
echo "  • Speed Index"
echo ""
echo "🔗 Abrir en navegador:"
echo "${PSI_URL}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para usar API directamente (requiere API key):"
echo "curl -s \"https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=mobile&key=YOUR_API_KEY\" | jq '.lighthouseResult.categories.performance.score'"
echo ""
echo "O usar herramienta online:"
echo "https://pagespeed.web.dev/analysis?url=${URL}"
echo ""
