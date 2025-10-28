# 🧪 Test Directo: API Cloudflare Workers
## Sin scripts - Comandos directos

---

## 🔑 **PASO 1: Crear API Token**

1. Ve a: **https://dash.cloudflare.com/profile/api-tokens**
2. Click **"Create Token"**
3. Template: **"Edit Cloudflare Workers"** o custom:
   - **Permissions:** `Account > Workers Scripts > Read`
   - **Account Resources:** `Include > All accounts`
4. **Create Token** y copiar (solo se muestra una vez)

---

## ✅ **PASO 2: Exportar Token**

```bash
export CLOUDFLARE_API_TOKEN='tu-token-aqui'
```

---

## 🧪 **PASO 3: Test Directo**

### **Test 1: Verificar Token**

```bash
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json"
```

**Si funciona, verás:** `{"success":true,...}`

---

### **Test 2: Listar TODOS los Workers**

```bash
ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"

curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json"
```

**Esto mostrará JSON crudo con todos los workers**

---

### **Test 3: Formato Legible (si tienes jq)**

```bash
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | \
  jq '.result[] | {name: .id, created: .created_on, modified: .modified_on}'
```

---

### **Test 4: Solo Nombres (sin jq)**

```bash
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | \
  grep -o '"id":"[^"]*"' | sed 's/"id":"\([^"]*\)"/\1/'
```

---

## 📋 **Comando Todo-en-Uno**

```bash
# Definir variables
export ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"
# export CLOUDFLARE_API_TOKEN='tu-token'  # Ya exportado arriba

# Listar workers
curl -s -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | \
  python3 -m json.tool | grep -E '"id"|"created_on"|"modified_on"'
```

---

**Listo para probar directo** ✅
