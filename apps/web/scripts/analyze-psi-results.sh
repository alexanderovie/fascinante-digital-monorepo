#!/bin/bash

# Script para analizar resultados de PageSpeed Insights Mobile
# Uso: ./analyze-psi-results.sh [performance_score]

PERFORMANCE_SCORE=${1:-0}
URL="https://fascinantedigital.com/es"

echo "📊 Análisis de Resultados PageSpeed Insights - Mobile"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URL analizada: ${URL}"
echo "Performance Score recibido: ${PERFORMANCE_SCORE}"
echo ""

if [ "$PERFORMANCE_SCORE" = "0" ] || [ -z "$1" ]; then
  echo "⚠️  No se proporcionó Performance Score"
  echo ""
  echo "Uso: ./analyze-psi-results.sh [score]"
  echo "Ejemplo: ./analyze-psi-results.sh 82"
  echo ""
  exit 1
fi

# Convertir a decimal (PSI devuelve 0-100, pero lo mostramos como 0-1)
SCORE_DECIMAL=$(echo "scale=2; $PERFORMANCE_SCORE / 100" | bc)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 ANÁLISIS DEL SCORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if (( $(echo "$PERFORMANCE_SCORE >= 90" | bc -l) )); then
  echo "✅ EXCELENTE: ${PERFORMANCE_SCORE}/100"
  echo "   Tu sitio está optimizado correctamente"
elif (( $(echo "$PERFORMANCE_SCORE >= 75" | bc -l) )); then
  echo "✅ BUENO: ${PERFORMANCE_SCORE}/100"
  echo "   Buen rendimiento, hay margen de mejora"
elif (( $(echo "$PERFORMANCE_SCORE >= 50" | bc -l) )); then
  echo "⚠️  NECESITA MEJORA: ${PERFORMANCE_SCORE}/100"
  echo "   Requiere optimizaciones adicionales"
else
  echo "❌ POBRE: ${PERFORMANCE_SCORE}/100"
  echo "   Requiere optimizaciones urgentes"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 COMPARACIÓN CON OBJETIVO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

OBJETIVO=85
DIFERENCIA=$(echo "$PERFORMANCE_SCORE - $OBJETIVO" | bc)

if (( $(echo "$DIFERENCIA >= 0" | bc -l) )); then
  echo "✅ Supera el objetivo de ${OBJETIVO} puntos"
  echo "   Diferencia: +${DIFERENCIA} puntos"
else
  echo "⚠️  Por debajo del objetivo de ${OBJETIVO} puntos"
  echo "   Diferencia: ${DIFERENCIA} puntos"
  echo "   Puntos necesarios para alcanzar objetivo: $(echo "-1 * $DIFERENCIA" | bc)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 PRÓXIMOS PASOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if (( $(echo "$PERFORMANCE_SCORE < 75" | bc -l) )); then
  echo "1. ✅ Verificar que las optimizaciones se desplegaron correctamente"
  echo "2. ✅ Revisar Core Web Vitals específicos"
  echo "3. ✅ Analizar oportunidades de mejora en PSI"
  echo "4. ✅ Verificar caché de CDN invalidada"
else
  echo "✅ Performance Score aceptable"
  echo "📊 Revisar métricas individuales (LCP, FCP, CLS, TBT)"
  echo "🔍 Analizar oportunidades de mejora menores"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

