# 🔍 Verificación de Bindings via API de Cloudflare
## Usando API Token Existente - Octubre 2025

---

## 🔑 **TOKEN ACTUAL**

Según `wrangler whoami`, estás autenticado con:
- **Account ID:** `805bb4fea4f198df0f788aaaad22a1be`
- **Email:** `info@fascinantedigital.com`
- **Token:** Leído de `CLOUDFLARE_API_TOKEN` (variable de entorno)

---

## 📡 **ENDPOINTS DE API NECESARIOS**

### **1. Obtener Script Info (incluye bindings):**

```bash
GET https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}
```

**Parámetros:**
- `account_id`: `805bb4fea4f198df0f788aaaad22a1be`
- `script_name`: `dataforseo-proxy` (o `fd-dataforseo-proxy` si cambió el nombre)

**Headers:**
```
Authorization: Bearer ${CLOUDFLARE_API_TOKEN}
Content-Type: application/json
```

---

### **2. Listar Workers (para confirmar nombre exacto):**

```bash
GET https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts
```

---

## 🎯 **VERIFICACIÓN REAL DE BINDINGS**

### **Script para verificar bindings:**

```bash
#!/bin/bash

ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"
WORKER_NAME="dataforseo-proxy"  # O "fd-dataforseo-proxy"
TOKEN="${CLOUDFLARE_API_TOKEN}"

# 1. Verificar token
echo "🔑 Verificando token..."
curl -s -X GET "https://api.cloudflare.com/client/v4/user" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq '.success'

# 2. Listar workers para confirmar nombre
echo ""
echo "📋 Listando workers..."
curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq '.result[] | .id'

# 3. Obtener script info (incluye bindings)
echo ""
echo "🔍 Obteniendo bindings de ${WORKER_NAME}..."
curl -s -X GET "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_NAME}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq '.result | {
    id: .id,
    created_on: .created_on,
    modified_on: .modified_on,
    bindings: .bindings
  }'
```

---

## 📊 **RESPUESTA ESPERADA**

La respuesta del endpoint `/workers/scripts/{name}` incluye:

```json
{
  "success": true,
  "result": {
    "id": "dataforseo-proxy",
    "bindings": [
      {
        "type": "kv_namespace",
        "name": "CACHE",
        "namespace_id": "42fb9e4d748c4f2696cb933c920c9eeb"
      },
      {
        "type": "analytics_engine",
        "name": "Analitycs_Cursor",
        "dataset": "Fascinante_Cursor"
      }
    ]
  }
}
```

---

## ✅ **EJECUTAR VERIFICACIÓN**

Si el token ya está configurado, puedo ejecutar el comando directamente.

**¿Quieres que ejecute la verificación ahora?**

Necesito confirmar:
1. ✅ Token está en `CLOUDFLARE_API_TOKEN`
2. ✅ Account ID: `805bb4fea4f198df0f788aaaad22a1be`
3. ⚠️ Nombre exacto del worker: `dataforseo-proxy` o `fd-dataforseo-proxy`?

---

**Última actualización:** Octubre 2025
**Estado:** Listo para verificación mediante API

