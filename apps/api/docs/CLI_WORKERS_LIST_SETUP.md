# 🔧 Setup: Listar Todos los Workers via CLI
## Método Elite - Octubre 2025

---

## 🎯 **OBJETIVO**

Listar TODOS los workers de Cloudflare usando CLI, sin necesidad del dashboard.

---

## 🔑 **MÉTODO 1: Cloudflare API Token (Recomendado)**

### **Paso 1: Crear API Token**

1. Ve a: https://dash.cloudflare.com/profile/api-tokens
2. Click en **"Create Token"**
3. Usa template: **"Edit Cloudflare Workers"** O crea custom con:
   - **Permissions:**
     - Account > Workers Scripts > Read
   - **Account Resources:**
     - Include > All accounts (o tu cuenta específica)

4. Click **"Continue to summary"** → **"Create Token"**
5. **COPIAR EL TOKEN** (solo se muestra una vez)

### **Paso 2: Configurar Token**

```bash
# Opción 1: Exportar temporalmente
export CLOUDFLARE_API_TOKEN='tu-token-aqui'

# Opción 2: Agregar a .bashrc/.zshrc para persistencia
echo 'export CLOUDFLARE_API_TOKEN="tu-token-aqui"' >> ~/.bashrc
source ~/.bashrc

# Opción 3: Usar archivo .env (más seguro)
echo 'CLOUDFLARE_API_TOKEN=tu-token-aqui' > apps/api/.env.local
```

### **Paso 3: Ejecutar Script**

```bash
# Método 1: Script Bash (requiere jq)
cd apps/api/scripts
chmod +x list-all-workers.sh
./list-all-workers.sh

# Método 2: Script Node.js (no requiere dependencias)
cd apps/api/scripts
chmod +x list-workers-via-api.js
node list-workers-via-api.js
```

---

## 🔑 **MÉTODO 2: Usando Wrangler OAuth (Si funciona)**

Wrangler usa OAuth tokens, pero estos no funcionan directamente con la API REST. Necesitas un API Token separado.

---

## 🔑 **MÉTODO 3: Direct API Call con curl**

```bash
# Definir token
export CLOUDFLARE_API_TOKEN='tu-token'

# Account ID
ACCOUNT_ID="805bb4fea4f198df0f788aaaad22a1be"

# Listar workers
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | jq '.'

# Formato simple (solo nombres)
curl -X GET \
  "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" | \
  jq -r '.result[] | .id'
```

---

## 📋 **SCRIPT COMPLETO INTEGRADO**

He creado 2 scripts:

1. **`list-all-workers.sh`** - Script Bash (requiere `jq` y `curl`)
2. **`list-workers-via-api.js`** - Script Node.js (solo Node)

### **Instalar Dependencias (Bash script):**

```bash
# Ubuntu/Debian
sudo apt-get install jq curl

# macOS
brew install jq

# Verificar
jq --version
```

---

## ✅ **VERIFICACIÓN**

### **Test rápido:**

```bash
# Verificar que el token funciona
curl -X GET \
  "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" | jq '.'

# Si retorna success:true, el token funciona
```

---

## 🎯 **OUTPUT ESPERADO**

```
🚀 Cloudflare Workers - Lista Completa
Account ID: 805bb4fea4f198df0f788aaaad22a1be

✅ Obteniendo lista de workers...

📊 Total de Workers encontrados: 5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#  Worker Name                              Created                    Modified
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1  dataforseo-proxy                         2025-10-11                2025-10-15
2  fascinante-api-gateway-prod              2025-10-27                2025-10-28
3  fascinante-api-staging                   2025-10-27                2025-10-27
4  test-worker-old                          2025-09-01                2025-09-01
5  my-worker-demo                           2025-08-15                2025-08-15
```

---

## 🔒 **SEGURIDAD**

- ✅ **NUNCA commits el token** a git
- ✅ Usa `.env`` o variables de entorno
- ✅ Agrega `.env*` a `.gitignore`
- ✅ Rotar tokens regularmente

---

**Listo para usar** ✅


