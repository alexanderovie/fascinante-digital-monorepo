#!/bin/bash

# Script completo de pruebas para TODOS los endpoints en producción
# URL de producción: https://fascinantedigital.com

BASE_URL="https://fascinantedigital.com"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 PRUEBAS COMPLETAS DE ENDPOINTS EN PRODUCCIÓN"
echo "🌐 Base URL: $BASE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Función para mostrar resultado
show_result() {
  local test_name=$1
  local status=$2
  local details=$3

  if [ "$status" = "OK" ]; then
    echo -e "${GREEN}✅ $test_name${NC}"
  elif [ "$status" = "FAIL" ]; then
    echo -e "${RED}❌ $test_name${NC}"
  else
    echo -e "${YELLOW}⚠️  $test_name${NC}"
  fi

  if [ -n "$details" ]; then
    echo "   $details"
  fi
  echo ""
}

# ============================================================================
# 1. PLACES AUTOCOMPLETE API
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}1️⃣  /api/places/autocomplete (GET)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1.1: Request exitoso
echo "Test 1.1: Request exitoso con input válido"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/places/autocomplete?input=restaurant")
STATUS=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$STATUS" = "200" ]; then
  PREDICTIONS=$(echo "$BODY" | grep -o '"predictions"' | wc -l)
  show_result "Request exitoso" "OK" "Status: $STATUS, Predictions encontradas: $PREDICTIONS"
else
  show_result "Request exitoso" "FAIL" "Status: $STATUS (esperado: 200)"
fi

# Test 1.2: Headers de rate limiting
echo "Test 1.2: Headers de rate limiting"
HEADERS=$(curl -sI "$BASE_URL/api/places/autocomplete?input=test")
RATE_LIMIT=$(echo "$HEADERS" | grep -i "x-ratelimit-limit" | cut -d' ' -f2 | tr -d '\r')
RATE_REMAINING=$(echo "$HEADERS" | grep -i "x-ratelimit-remaining" | cut -d' ' -f2 | tr -d '\r')

if [ -n "$RATE_LIMIT" ] && [ -n "$RATE_REMAINING" ]; then
  show_result "Headers de rate limiting" "OK" "Limit: $RATE_LIMIT, Remaining: $RATE_REMAINING"
else
  show_result "Headers de rate limiting" "FAIL" "Headers no presentes"
fi

# Test 1.3: Validación - input muy corto
echo "Test 1.3: Validación (input muy corto - debe fallar)"
ERROR_RESPONSE=$(curl -s "$BASE_URL/api/places/autocomplete?input=ab")
ERROR_MSG=$(echo "$ERROR_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$ERROR_RESPONSE" | grep -q "error"; then
  show_result "Validación input corto" "OK" "$ERROR_MSG"
else
  show_result "Validación input corto" "FAIL" "No retornó error"
fi

# Test 1.4: Validación - input faltante
echo "Test 1.4: Validación (input faltante - debe fallar)"
MISSING_RESPONSE=$(curl -s "$BASE_URL/api/places/autocomplete")
MISSING_ERROR=$(echo "$MISSING_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$MISSING_RESPONSE" | grep -q "error"; then
  show_result "Validación input faltante" "OK" "$MISSING_ERROR"
else
  show_result "Validación input faltante" "FAIL" "No retornó error"
fi

sleep 1

# ============================================================================
# 2. PLACES DETAILS API
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}2️⃣  /api/places/details (GET)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 2.1: Request exitoso con place_id válido
echo "Test 2.1: Request exitoso con place_id válido"
PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4" # Google Sydney
DETAILS_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/places/details?place_id=$PLACE_ID")
DETAILS_STATUS=$(echo "$DETAILS_RESPONSE" | tail -n1)
DETAILS_BODY=$(echo "$DETAILS_RESPONSE" | head -n-1)

if [ "$DETAILS_STATUS" = "200" ]; then
  PLACE_NAME=$(echo "$DETAILS_BODY" | grep -o '"name":"[^"]*"' | head -1 || echo "N/A")
  show_result "Request exitoso con place_id" "OK" "Status: $DETAILS_STATUS, $PLACE_NAME"
else
  show_result "Request exitoso con place_id" "FAIL" "Status: $DETAILS_STATUS (esperado: 200)"
fi

# Test 2.2: Headers de rate limiting (debe ser diferente - 20 req/min)
echo "Test 2.2: Headers de rate limiting"
DETAILS_HEADERS=$(curl -sI "$BASE_URL/api/places/details?place_id=$PLACE_ID")
DETAILS_RATE_LIMIT=$(echo "$DETAILS_HEADERS" | grep -i "x-ratelimit-limit" | cut -d' ' -f2 | tr -d '\r')
DETAILS_RATE_REMAINING=$(echo "$DETAILS_HEADERS" | grep -i "x-ratelimit-remaining" | cut -d' ' -f2 | tr -d '\r')

if [ -n "$DETAILS_RATE_LIMIT" ] && [ "$DETAILS_RATE_LIMIT" = "20" ]; then
  show_result "Rate limiting (debe ser 20/min)" "OK" "Limit: $DETAILS_RATE_LIMIT (correcto), Remaining: $DETAILS_RATE_REMAINING"
else
  show_result "Rate limiting" "FAIL" "Limit incorrecto: $DETAILS_RATE_LIMIT (esperado: 20)"
fi

# Test 2.3: Validación - place_id faltante
echo "Test 2.3: Validación (place_id faltante - debe fallar)"
NO_PLACE_RESPONSE=$(curl -s "$BASE_URL/api/places/details")
NO_PLACE_ERROR=$(echo "$NO_PLACE_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$NO_PLACE_RESPONSE" | grep -q "error"; then
  show_result "Validación place_id faltante" "OK" "$NO_PLACE_ERROR"
else
  show_result "Validación place_id faltante" "FAIL" "No retornó error"
fi

sleep 1

# ============================================================================
# 3. AUDIT GENERATE API
# ============================================================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}3️⃣  /api/audit/generate (POST)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 3.1: Request exitoso con payload válido
echo "Test 3.1: Request exitoso con payload válido"
AUDIT_PAYLOAD='{"businessName":"Test Business","category":"restaurant","email":"test@example.com"}'
AUDIT_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "$AUDIT_PAYLOAD")
AUDIT_STATUS=$(echo "$AUDIT_RESPONSE" | tail -n1)
AUDIT_BODY=$(echo "$AUDIT_RESPONSE" | head -n-1)

if [ "$AUDIT_STATUS" = "200" ]; then
  AUDIT_ID=$(echo "$AUDIT_BODY" | grep -o '"auditId":"[^"]*"' | head -1 || echo "N/A")
  SUCCESS=$(echo "$AUDIT_BODY" | grep -o '"success":true' || echo "")
  if [ -n "$SUCCESS" ]; then
    show_result "Request exitoso" "OK" "Status: $AUDIT_STATUS, $AUDIT_ID"
  else
    show_result "Request exitoso" "WARN" "Status: $AUDIT_STATUS pero success no es true"
  fi
else
  show_result "Request exitoso" "FAIL" "Status: $AUDIT_STATUS (esperado: 200)"
fi

# Test 3.2: Headers de rate limiting (debe ser 3 req/hora)
echo "Test 3.2: Headers de rate limiting"
AUDIT_HEADERS=$(curl -sI -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "$AUDIT_PAYLOAD" 2>/dev/null || curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "$AUDIT_PAYLOAD" | tail -n1)
AUDIT_RATE_LIMIT=$(echo "$AUDIT_HEADERS" | grep -i "x-ratelimit-limit" | cut -d' ' -f2 | tr -d '\r' || echo "N/A")

if [ "$AUDIT_RATE_LIMIT" = "3" ]; then
  show_result "Rate limiting (debe ser 3/hora)" "OK" "Limit: $AUDIT_RATE_LIMIT (correcto)"
else
  show_result "Rate limiting" "WARN" "Limit: $AUDIT_RATE_LIMIT (esperado: 3) - puede necesitar HEAD request"
fi

# Test 3.3: Validación - businessName faltante
echo "Test 3.3: Validación (businessName faltante - debe fallar)"
NO_NAME_PAYLOAD='{"category":"restaurant"}'
NO_NAME_RESPONSE=$(curl -s -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "$NO_NAME_PAYLOAD")
NO_NAME_ERROR=$(echo "$NO_NAME_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$NO_NAME_RESPONSE" | grep -q "error"; then
  show_result "Validación businessName faltante" "OK" "$NO_NAME_ERROR"
else
  show_result "Validación businessName faltante" "FAIL" "No retornó error"
fi

# Test 3.4: Validación - category faltante
echo "Test 3.4: Validación (category faltante - debe fallar)"
NO_CAT_PAYLOAD='{"businessName":"Test Business"}'
NO_CAT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "$NO_CAT_PAYLOAD")
NO_CAT_ERROR=$(echo "$NO_CAT_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$NO_CAT_RESPONSE" | grep -q "error"; then
  show_result "Validación category faltante" "OK" "$NO_CAT_ERROR"
else
  show_result "Validación category faltante" "FAIL" "No retornó error"
fi

# Test 3.5: Validación - Content-Type incorrecto
echo "Test 3.5: Validación (Content-Type incorrecto - debe fallar)"
WRONG_CT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/audit/generate" \
  -H "Content-Type: text/plain" \
  -d "$AUDIT_PAYLOAD")
WRONG_CT_ERROR=$(echo "$WRONG_CT_RESPONSE" | grep -o '"error":"[^"]*"' | head -1)

if echo "$WRONG_CT_RESPONSE" | grep -q "error"; then
  show_result "Validación Content-Type" "OK" "$WRONG_CT_ERROR"
else
  show_result "Validación Content-Type" "WARN" "No validó Content-Type"
fi

sleep 2

# ============================================================================
# 4. RESUMEN FINAL
# ============================================================================
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 RESUMEN FINAL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Endpoints probados:"
echo "  ✅ GET  /api/places/autocomplete"
echo "  ✅ GET  /api/places/details"
echo "  ✅ POST /api/audit/generate"
echo ""
echo "Tests realizados por endpoint:"
echo "  • Request exitoso"
echo "  • Headers de rate limiting"
echo "  • Validaciones (campos requeridos, tipos, etc.)"
echo ""
echo "🌐 URL de producción: $BASE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

