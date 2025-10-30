# 🧪 Guía de Pruebas - Mejoras de Seguridad API
## Cómo Probar Rate Limiting, Timeouts y Validaciones

**Fecha:** 2025-01-27
**Base URL:** `https://fascinantedigital.com` (producción) o `http://localhost:3003` (desarrollo local)

---

## 🎯 **1. PROBAR RATE LIMITING**

### **A) Autocomplete API - 10 requests/minuto**

**Endpoint:** `/api/places/autocomplete`

**Prueba rápida con curl (hacer 11 requests rápidas):**
```bash
# Hacer 11 requests (el 11º debe fallar con 429)
for i in {1..11}; do
  echo "Request $i:"
  curl -s "http://localhost:3003/api/places/autocomplete?input=restaurant" \
    -H "Content-Type: application/json" \
    -w "\nStatus: %{http_code}\nX-RateLimit-Remaining: %{header_X-RateLimit-Remaining}\n\n"
  sleep 0.5
done
```

**Respuesta esperada (request 11):**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "resetTime": 1234567890
}
```
**Headers esperados:**
- `HTTP 429 Too Many Requests`
- `Retry-After: 45` (segundos hasta reset)
- `X-RateLimit-Limit: 10`
- `X-RateLimit-Remaining: 0`

---

### **B) Details API - 20 requests/minuto**

**Endpoint:** `/api/places/details`

**Prueba:**
```bash
# Necesitas un place_id válido primero
PLACE_ID="ChIJN1t_tDeuEmsRUsoyG83frY4" # Google Sydney ejemplo

for i in {1..21}; do
  echo "Request $i:"
  curl -s "http://localhost:3003/api/places/details?place_id=$PLACE_ID" \
    -w "\nStatus: %{http_code}\nX-RateLimit-Remaining: %{header_X-RateLimit-Remaining}\n\n"
  sleep 0.5
done
```

---

### **C) Audit Generate API - 3 requests/hora** ⚠️ MÁS ESTRICTO

**Endpoint:** `/api/audit/generate` (POST)

**Prueba:**
```bash
# Hacer 4 requests (el 4º debe fallar)
for i in {1..4}; do
  echo "Request $i:"
  curl -s -X POST "http://localhost:3003/api/audit/generate" \
    -H "Content-Type: application/json" \
    -d '{
      "businessName": "Test Business",
      "category": "restaurant",
      "email": "test@example.com"
    }' \
    -w "\nStatus: %{http_code}\nX-RateLimit-Remaining: %{header_X-RateLimit-Remaining}\n\n"
  sleep 1
done
```

**Respuesta esperada (request 4):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many audit requests. Please try again later.",
  "resetTime": 1234567890
}
```

**⚠️ NOTA:** Este límite es de 1 hora, necesitarás esperar o cambiar tu IP para probar de nuevo.

---

## ⏱️ **2. PROBAR TIMEOUTS**

### **A) Simular timeout (requiere mock/manipulación)**

Los timeouts están configurados internamente, pero puedes verificarlos si la API externa es lenta:

**Test manual:**
```bash
# Si Google Places API está lento (>10s), deberías ver:
curl -v "http://localhost:3003/api/places/autocomplete?input=test" \
  --max-time 15

# Respuesta esperada si timeout:
{
  "error": "Request timeout - Google Places API took too long to respond"
}
# Status: 504 Gateway Timeout
```

**Para simular timeout artificialmente**, necesitarías modificar temporalmente el código o usar un proxy lento.

---

## ✅ **3. PROBAR VALIDACIONES**

### **A) Validación de Content-Type** (solo en `/api/audit/generate`)

```bash
# ❌ Content-Type incorrecto
curl -X POST "http://localhost:3003/api/audit/generate" \
  -H "Content-Type: text/plain" \
  -d '{"businessName": "Test"}'

# Respuesta esperada:
{
  "success": false,
  "error": "Content-Type must be application/json"
}
# Status: 400 Bad Request
```

---

### **B) Validación de tamaño de payload** (>10KB)

```bash
# Crear payload grande (>10KB)
LARGE_PAYLOAD=$(python3 -c "print('x' * 12000)")

curl -X POST "http://localhost:3003/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d "{\"businessName\": \"$LARGE_PAYLOAD\"}"

# Respuesta esperada:
{
  "success": false,
  "error": "Request body too large (max 10KB)"
}
# Status: 413 Payload Too Large
```

---

### **C) Validación de campos requeridos**

```bash
# ❌ Sin businessName
curl -X POST "http://localhost:3003/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d '{"category": "restaurant"}'

# Respuesta esperada:
{
  "success": false,
  "error": "Business name is required (min 2 characters)"
}
# Status: 400

# ❌ Sin category
curl -X POST "http://localhost:3003/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d '{"businessName": "Test Business"}'

# Respuesta esperada:
{
  "success": false,
  "error": "Business category is required"
}
# Status: 400
```

---

### **D) Sanitización de inputs** (remueve caracteres peligrosos)

```bash
# Input con caracteres peligrosos
curl -X POST "http://localhost:3003/api/audit/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "<script>alert(1)</script>Bad Business",
    "category": "restaurant",
    "email": "test@example.com"
  }'

# El input debería ser sanitizado automáticamente:
# <script>alert(1)</script> → scriptalert(1)/script
# Y limitado a 200 caracteres
```

---

## 🌐 **4. PROBAR EN PRODUCCIÓN**

**Base URL:** `https://fascinantedigital.com`

```bash
# Reemplazar localhost:3003 con fascinantedigital.com
curl "https://fascinantedigital.com/api/places/autocomplete?input=restaurant"
```

**⚠️ IMPORTANTE:** En producción, el rate limiting es por IP real. Si usas un VPN o cambias de red, los límites se reinician.

---

## 📊 **5. VERIFICAR HEADERS DE RATE LIMIT**

Los headers HTTP incluyen información útil:

```bash
curl -I "http://localhost:3003/api/places/autocomplete?input=test"

# Headers esperados en respuesta exitosa:
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 9
# X-RateLimit-Reset: 1234567890

# Headers cuando excedes el límite:
# HTTP/1.1 429 Too Many Requests
# Retry-After: 45
# X-RateLimit-Limit: 10
# X-RateLimit-Remaining: 0
# X-RateLimit-Reset: 1234567890
```

---

## 🛠️ **6. SCRIPT DE PRUEBA AUTOMATIZADO**

Guardar como `test-rate-limit.sh`:

```bash
#!/bin/bash

BASE_URL="${1:-http://localhost:3003}"
ENDPOINT="/api/places/autocomplete"

echo "🧪 Probando rate limiting en $BASE_URL$ENDPOINT"
echo "Límite esperado: 10 req/min"
echo ""

for i in {1..12}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "$BASE_URL$ENDPOINT?input=restaurant")

  REMAINING=$(curl -s -I "$BASE_URL$ENDPOINT?input=restaurant" \
    | grep -i "X-RateLimit-Remaining" \
    | cut -d' ' -f2 | tr -d '\r')

  if [ "$STATUS" = "429" ]; then
    echo "❌ Request $i: RATE LIMITED (esperado en request 11+)"
    echo "   Status: $STATUS"
    echo "   Remaining: $REMAINING"
    break
  else
    echo "✅ Request $i: OK - Remaining: $REMAINING"
  fi

  sleep 0.3
done
```

**Ejecutar:**
```bash
chmod +x test-rate-limit.sh
./test-rate-limit.sh http://localhost:3003
```

---

## 📝 **7. PRUEBAS EN EL NAVEGADOR**

### **Prueba rápida en DevTools Console:**

```javascript
// Probar autocomplete (hacer 11 requests rápidas)
const testRateLimit = async () => {
  for (let i = 1; i <= 11; i++) {
    try {
      const res = await fetch(`/api/places/autocomplete?input=restaurant`);
      const data = await res.json();

      console.log(`Request ${i}:`, {
        status: res.status,
        remaining: res.headers.get('X-RateLimit-Remaining'),
        limit: res.headers.get('X-RateLimit-Limit'),
        data: res.status === 429 ? data : 'OK'
      });
    } catch (error) {
      console.error(`Request ${i} failed:`, error);
    }
    await new Promise(r => setTimeout(r, 100)); // 100ms entre requests
  }
};

testRateLimit();
```

---

## ✅ **CHECKLIST DE PRUEBAS**

- [ ] Rate limit autocomplete: 11º request retorna 429
- [ ] Rate limit details: 21º request retorna 429
- [ ] Rate limit audit: 4º request retorna 429
- [ ] Headers X-RateLimit-* presentes en respuestas
- [ ] Header Retry-After presente en 429
- [ ] Validación Content-Type funciona
- [ ] Validación tamaño payload funciona (>10KB)
- [ ] Validación campos requeridos funciona
- [ ] Sanitización de inputs funciona (remueve < >)
- [ ] Respuestas 504 cuando timeout ocurre

---

## 🐛 **DEBUGGING**

Si algo no funciona:

1. **Verificar logs del servidor:**
```bash
# En desarrollo local
pnpm dev
# Ver console.log de errores
```

2. **Verificar que las utilidades están importadas:**
```bash
grep -r "checkRateLimit\|fetchWithTimeout" apps/web/app/api/
```

3. **Verificar rate limit map (en desarrollo):**
El rate limit es in-memory, por lo que:
- Se resetea al reiniciar el servidor
- No persiste entre deployments
- En producción serverless (Vercel), cada instancia tiene su propio contador

---

## 📚 **RECURSOS**

- [Next.js 15 Backend for Frontend Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#rate-limiting)
- Endpoints disponibles en `/apps/web/app/api/`
