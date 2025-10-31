# 🚀 Cal.com API v2 - Guía de Configuración Rápida

## ⚡ Setup en 5 Minutos

### Paso 1: Obtener API Key de Test Mode

1. Ve a [Cal.com Settings > Security](https://app.cal.com/settings/security)
2. Haz click en **"Create API Key"**
3. Selecciona **Test Mode** (las keys de test empiezan con `cal_`)
4. Copia la API Key generada

### Paso 2: Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local` en `apps/web/`:

```env
# Cal.com API v2 - Sandbox Configuration
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_API_KEY=cal_test_tu_api_key_aqui
CAL_COM_ENVIRONMENT=sandbox
```

**⚠️ Importante:**
- Nunca commitees tu `.env.local` (ya está en `.gitignore`)
- Las keys de test mode empiezan con `cal_`
- Las keys de producción empiezan con `cal_live_`

### Paso 3: Verificar la Instalación

El cliente ya está implementado en:
- `lib/cal-com/client.ts` - Cliente API principal
- `lib/cal-com/auth.ts` - Sistema de autenticación
- `lib/cal-com/utils.ts` - Utilidades
- `types/cal-com.ts` - Tipos TypeScript

### Paso 4: Probar el Endpoint

Ya existe un endpoint de ejemplo en:
- `GET /api/cal-com/event-types`

Puedes probarlo localmente:

```bash
# Con tu servidor corriendo (pnpm dev)
curl http://localhost:3001/api/cal-com/event-types
```

---

## 📚 Uso del Cliente

### Ejemplo Básico

```typescript
import { getCalComClient } from '@/lib/cal-com/client';
import type { CalComEventType } from '@/types/cal-com';

// Obtener todos los event types
const client = getCalComClient();
const eventTypes = await client.get<CalComEventType[]>('/event-types');
```

### Ejemplo con Parámetros

```typescript
const client = getCalComClient();

// Con query parameters
const bookings = await client.get('/bookings', {
  page: 1,
  perPage: 10,
});
```

### Ejemplo POST (Crear Booking)

```typescript
import type { CalComCreateBookingRequest } from '@/types/cal-com';

const bookingData: CalComCreateBookingRequest = {
  eventTypeId: 123,
  start: '2025-10-30T10:00:00Z',
  end: '2025-10-30T10:30:00Z',
  responses: {
    email: 'cliente@example.com',
    name: 'Juan Pérez',
  },
};

const booking = await client.post('/bookings', bookingData);
```

---

## 🔐 Métodos de Autenticación

### 1. API Key (Más Simple - Recomendado para Sandbox)

Ya está configurado por defecto usando `CAL_COM_API_KEY`.

### 2. OAuth Client Credentials

Si eres Platform customer, agrega a `.env.local`:

```env
CAL_COM_OAUTH_CLIENT_ID=tu_client_id
CAL_COM_OAUTH_SECRET_KEY=tu_secret_key
```

### 3. Managed User Access Token

Si creas managed users:

```env
CAL_COM_MANAGED_USER_ACCESS_TOKEN=tu_access_token
```

---

## 🧪 Testing en Sandbox

### Verificar que funciona

```bash
# Terminal 1: Inicia el servidor
pnpm dev

# Terminal 2: Prueba el endpoint
curl http://localhost:3001/api/cal-com/event-types \
  -H "Content-Type: application/json"
```

### Debug Mode

Agrega a `.env.local` para ver logs detallados:

```env
NEXT_PUBLIC_DEBUG=1
```

---

## 📖 Referencias

- [Documentación Cal.com API v2](https://cal.com/docs/api-reference/v2)
- [Cal.com Platform Guide](https://cal.com/docs/platform/quickstart)
- [Autenticación](https://cal.com/docs/api-reference/v2/introduction#authentication)

---

## ✅ Checklist de Setup

- [ ] API Key de test mode obtenida (`cal_*`)
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Build exitoso (`pnpm build`)
- [ ] Endpoint `/api/cal-com/event-types` probado
- [ ] Documentación leída

---

## 🎯 Próximos Pasos

1. **Probar endpoint básico**: `GET /api/cal-com/event-types`
2. **Implementar más endpoints**: Bookings, Schedules, Slots
3. **Integrar con UI**: Componentes React para booking
4. **Testing**: Tests unitarios y E2E
