# Cal.com API v2 Client

Cliente TypeScript elite para integrar con Cal.com API v2 en modo sandbox.

## 📋 Configuración Rápida

### 1. Variables de Entorno

Agrega estas variables a tu `.env.local`:

```env
# Cal.com API v2 - Sandbox Mode
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_API_KEY=cal_test_xxxxxxxxxxxxx  # Test mode key (obtén en https://app.cal.com/settings/security)
CAL_COM_ENVIRONMENT=sandbox

# OAuth (Opcional - solo para Platform customers)
CAL_COM_OAUTH_CLIENT_ID=
CAL_COM_OAUTH_SECRET_KEY=

# Managed User Token (Opcional - obtenido después de crear managed user)
CAL_COM_MANAGED_USER_ACCESS_TOKEN=
```

### 2. Obtener API Key de Test Mode

1. Ve a [Cal.com Settings > Security](https://app.cal.com/settings/security)
2. Genera una nueva API Key
3. Selecciona **Test Mode** (la key debe empezar con `cal_`)
4. Copia la key a tu `.env.local`

## 🚀 Uso Básico

### Usar el cliente singleton

```typescript
import { getCalComClient } from '@/lib/cal-com/client';
import type { CalComEventType } from '@/types/cal-com';

// Obtener todos los event types
const client = getCalComClient();
const eventTypes = await client.get('/event-types');
```

### Usar con configuración personalizada

```typescript
import { CalComClient } from '@/lib/cal-com/client';

const client = new CalComClient({
  auth: {
    method: 'apiKey',
    apiKey: 'cal_test_xxxxx',
  },
  timeout: 30000,
  retries: 2,
});
```

### Endpoints disponibles

- `GET /event-types` - Listar tipos de eventos
- `GET /bookings` - Listar reservas
- `POST /bookings` - Crear reserva
- `GET /schedules` - Obtener horarios

## 🔐 Métodos de Autenticación

El cliente soporta 3 métodos según la [documentación oficial](https://cal.com/docs/api-reference/v2/introduction#authentication):

1. **API Key** (Recomendado para sandbox)
   - Test mode: `cal_*`
   - Live mode: `cal_live_*`

2. **OAuth Client Credentials**
   - Headers: `x-cal-client-id` y `x-cal-secret-key`

3. **Managed User Access Token**
   - Header: `Authorization: Bearer <token>`

## 📝 Notas

- Todas las requests son HTTPS only
- Rate limiting automático con retry logic
- Timeout por defecto: 30 segundos
- Retries: 2 intentos con exponential backoff
