#!/bin/bash

# Script rápido para probar rate limiting
# Uso: ./test-rate-limit-quick.sh [url]

BASE_URL="${1:-http://localhost:3003}"
ENDPOINT="$BASE_URL/api/places/autocomplete"

# Verificar que el servidor esté accesible
if ! curl -s --head "$BASE_URL" > /dev/null 2>&1; then
  echo "❌ Error: No se puede conectar a $BASE_URL"
  echo ""
  echo "💡 Opciones:"
  echo "   1. Inicia el servidor local: pnpm dev"
  echo "   2. O prueba en producción: ./test-rate-limit-quick.sh https://fascinantedigital.com"
  exit 1
fi

echo "🧪 Probando Rate Limiting - Autocomplete API"
echo "📍 URL: $ENDPOINT"
echo "🎯 Límite esperado: 10 req/min"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Hacer 12 requests (el 11º debería ser rate limited)
for i in {1..12}; do
  RESPONSE=$(curl -s -w "\n%{http_code}" "$ENDPOINT?input=restaurant")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  # Extraer headers (necesitamos hacer request separado para headers)
  HEADERS=$(curl -s -I "$ENDPOINT?input=restaurant" 2>/dev/null)
  REMAINING=$(echo "$HEADERS" | grep -i "X-RateLimit-Remaining" | cut -d' ' -f2 | tr -d '\r\n')
  LIMIT=$(echo "$HEADERS" | grep -i "X-RateLimit-Limit" | cut -d' ' -f2 | tr -d '\r\n')

  if [ "$HTTP_CODE" = "429" ]; then
    ERROR_MSG=$(echo "$BODY" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "❌ Request $i: RATE LIMITED"
    echo "   Status: $HTTP_CODE"
    echo "   Error: $ERROR_MSG"
    echo "   Remaining: 0"
    echo ""
    echo "✅ Rate limiting funciona correctamente!"
    break
  elif [ "$HTTP_CODE" = "200" ]; then
    PREDICTIONS_COUNT=$(echo "$BODY" | grep -o '"predictions"' | wc -l)
    echo "✅ Request $i: OK"
    echo "   Status: $HTTP_CODE"
    echo "   Predictions: $PREDICTIONS_COUNT"
    echo "   Remaining: ${REMAINING:-N/A}"
    echo "   Limit: ${LIMIT:-N/A}"
  else
    echo "⚠️  Request $i: Unexpected status $HTTP_CODE"
    echo "$BODY" | head -n5
  fi

  echo ""
  sleep 0.3
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 Si llegaste al request 12 sin rate limit, espera 1 minuto y prueba de nuevo"
echo "💡 El rate limit se resetea cada 60 segundos"
