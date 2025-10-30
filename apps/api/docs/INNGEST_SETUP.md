# 🔧 Configuración Inngest - Usar App Existente

## ✅ **DECISIÓN: Usar App Existente**

**App:** `fascinante-digital`
**Endpoint actual:** `https://fascinantedigital.com/api/inngest` (Next.js)
**Nuevo endpoint:** `https://api.fascinantedigital.com/api/inngest` (Cloudflare Workers)

---

## 🎯 **ESTRATEGIA**

Inngest permite **múltiples syncs** en la misma app. Vamos a:

1. **Usar la app existente** `fascinante-digital`
2. **Agregar un nuevo sync** para Cloudflare Workers
3. **Compartir el mismo Event Key** (para enviar eventos)
4. **Cada sync maneja sus propias functions** automáticamente

---

## 📝 **PASOS DE CONFIGURACIÓN**

### **Paso 1: Obtener Credenciales Existentes**

Ya tienes acceso a la app. Necesitas:

1. **INNGEST_EVENT_KEY** - Para enviar eventos desde cualquier lugar
2. **INNGEST_SIGNING_KEY** - Para verificar webhooks (ya configurado en Next.js)

Para obtenerlos:
- Ve a Inngest Dashboard → `fascinante-digital` app
- Settings → Keys
- Copia `Event Key` y `Signing Key`

---

### **Paso 2: Agregar Nuevo Sync en Inngest**

En el dashboard de Inngest:

1. Ve a la app `fascinante-digital`
2. Click en **"Sync new app"** o **"+ Add Sync"**
3. Configura:
   - **App Name:** `fascinante-digital-api` (o similar, para identificar)
   - **Framework:** `Cloudflare Workers`
   - **URL:** `https://api.fascinantedigital.com/api/inngest`
   - **Method:** `SERVE` (igual que Next.js)

4. Inngest detectará automáticamente las functions en Cloudflare Workers

---

### **Paso 3: Configurar Endpoint en Cloudflare Workers**

Crear endpoint `/api/inngest` en `apps/api/src/index.ts`:

```typescript
// apps/api/src/routes/inngest.ts
import { serve } from 'inngest/cloudflare'
import { inngest } from '../inngest/client'
import { generateAudit } from '../inngest/functions/generate-audit'

export const inngestHandler = serve({
  client: inngest,
  functions: [
    generateAudit,
    // ... otras functions de audit
  ],
})

// En apps/api/src/index.ts
case pathname === '/api/inngest':
  return inngestHandler(request, env)
```

---

## 🔑 **CREDENCIALES NECESARIAS**

### **Cloudflare Workers Secrets**

```bash
# Mismo Event Key que Next.js (para enviar eventos)
wrangler secret put INNGEST_EVENT_KEY

# Mismo Signing Key que Next.js (para verificar webhooks)
wrangler secret put INNGEST_SIGNING_KEY
```

**Nota:** Puedes usar las **mismas credenciales** que ya tienes configuradas en Next.js.

---

## 📊 **ARQUITECTURA RESULTANTE**

```
┌─────────────────────────────────────┐
│   Inngest App: fascinante-digital   │
├─────────────────────────────────────┤
│                                     │
│  Sync 1: Next.js                   │
│  URL: fascinantedigital.com/       │
│       api/inngest                   │
│  Functions: [existing functions]    │
│                                     │
│  Sync 2: Cloudflare Workers        │
│  URL: api.fascinantedigital.com/   │
│       api/inngest                   │
│  Functions: [audit functions]       │
│                                     │
└─────────────────────────────────────┘
         ↓
    Mismo Event Key
    (para enviar eventos)
```

---

## ✅ **VENTAJAS DE ESTA ESTRATEGIA**

1. ✅ **Un solo billing** - No pagas por dos apps
2. ✅ **Mismo Event Key** - Puedes enviar eventos desde cualquier lugar
3. ✅ **Organización clara** - Cada sync maneja su propio endpoint
4. ✅ **Isolation** - Functions de Next.js y Workers separadas
5. ✅ **Simple** - No necesitas crear cuenta nueva ni gestionar múltiples apps

---

## 🚀 **IMPLEMENTACIÓN**

Cuando implementemos el código:

1. Usaremos las **mismas credenciales** (Event Key y Signing Key)
2. El endpoint `/api/inngest` en Cloudflare Workers será detectado automáticamente
3. Las functions que creemos en Workers aparecerán como un nuevo sync
4. Todo queda bajo la misma app `fascinante-digital`

---

## 📝 **CHECKLIST**

- [ ] ✅ Obtener `INNGEST_EVENT_KEY` de la app existente
- [ ] ✅ Obtener `INNGEST_SIGNING_KEY` de la app existente
- [ ] ✅ Configurar secrets en Cloudflare Workers:
  ```bash
  wrangler secret put INNGEST_EVENT_KEY
  wrangler secret put INNGEST_SIGNING_KEY
  ```
- [ ] ✅ Crear endpoint `/api/inngest` en Cloudflare Workers
- [ ] ✅ Agregar sync manual o dejar que Inngest auto-detecte
- [ ] ✅ Verificar que las functions aparecen en Inngest Dashboard

---

## 🔍 **VERIFICACIÓN**

Después de configurar:

1. Ve a Inngest Dashboard
2. App `fascinante-digital`
3. Deberías ver **2 syncs**:
   - Original: Next.js
   - Nuevo: Cloudflare Workers
4. Las functions de audit deberían aparecer bajo el sync de Workers

---

## ⚠️ **NOTA IMPORTANTE**

- **Event Key**: Se usa para **enviar eventos** (puede ser la misma)
- **Signing Key**: Se usa para **verificar webhooks** (puede ser la misma)
- **Sync**: Cada sync es independiente y detecta sus propias functions
- **Billing**: Todo cuenta hacia el mismo límite de la app

---

**🎯 Conclusión: Usar app existente es la mejor opción. Solo necesitas agregar un nuevo sync.**

