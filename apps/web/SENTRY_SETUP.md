# 🔍 Sentry Setup - Fascinante Digital

## Configuración Completada

Sentry ha sido configurado en `apps/web` para monitoreo de errores en producción.

## ✅ Archivos Creados

1. **`instrumentation.ts`** - Configuración para servidor (Next.js 15.5.6 método oficial)
2. **`instrumentation-client.ts`** - Configuración para cliente + router transitions
3. **`sentry.client.config.ts`** - Configuración legacy para cliente (mantenida por compatibilidad)
4. **`app/global-error.tsx`** - Error boundary global con integración Sentry
5. **`next.config.ts`** - Actualizado con `withSentryConfig` wrapper y `serverExternalPackages`
6. **`.env.local.example`** - Template para variables de entorno

## 📝 Pasos para Activar Sentry

### 1. Obtener DSN de Sentry

1. Ve a tu proyecto en Sentry: https://fascinante-digital.sentry.io/settings/projects/javascript-nextjs/keys/
2. Copia el **DSN** (Data Source Name)
3. Tiene el formato: `https://xxxxx@o1234567.ingest.sentry.io/1234567`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en `apps/web/` con:

```bash
# Obtener DSN desde: https://fascinante-digital.sentry.io/settings/projects/javascript-nextjs/keys/
NEXT_PUBLIC_SENTRY_DSN=https://tu-dsn-aqui@o1234567.ingest.sentry.io/1234567
SENTRY_DSN=https://tu-dsn-aqui@o1234567.ingest.sentry.io/1234567

# Opcional: Release version para tracking de deployments
NEXT_PUBLIC_SENTRY_RELEASE=javascript-nextjs@1.0.0
SENTRY_RELEASE=javascript-nextjs@1.0.0

# Opcional: Auth Token para upload de source maps (generar en Sentry Settings > Auth Tokens)
# SENTRY_AUTH_TOKEN=tu-token-aqui
```

### 3. (Opcional) Auth Token para Source Maps

Si quieres que Sentry muestre el código fuente original en los errores:

1. Ve a: https://fascinante-digital.sentry.io/settings/account/api/auth-tokens/
2. Crea un nuevo token con permisos:
   - `project:releases`
   - `project:read`
   - `org:read`
3. Agrega el token a `.env.local`:
   ```bash
   SENTRY_AUTH_TOKEN=tu-token-aqui
   ```

### 4. Verificar Instalación

1. **Ejecutar build:**
   ```bash
   cd apps/web
   pnpm build
   ```

2. **Iniciar servidor de producción:**
   ```bash
   pnpm start
   ```

3. **Probar captura de errores:**
   - Visita: `http://localhost:3001/sentry-example-page` (si existe)
   - O crea un error de prueba en cualquier componente:
     ```typescript
     // Temporal - para testing
     throw new Error('Test error from Sentry');
     ```

4. **Verificar en Sentry:**
   - Ve a: https://fascinante-digital.sentry.io/issues/
   - Deberías ver el error capturado

## 🎯 Características Configuradas

- ✅ **Error Tracking** - Errores automáticos capturados (cliente y servidor)
- ✅ **Performance Monitoring** - Trazado de rendimiento (10% sample rate en producción)
- ✅ **Session Replay** - Reproducción de sesiones en errores (100% en errores, 10% en sesiones normales)
- ✅ **Source Maps** - Upload automático durante build (requiere `SENTRY_AUTH_TOKEN`)
- ✅ **Tunnel Route** - `/monitoring` para evitar bloqueadores de anuncios

## 📊 Sampling Rates

- **Producción:**
  - Traces: 10% (ajustable)
  - Session Replay en errores: 100%
  - Session Replay normal: 10%

- **Desarrollo:**
  - Traces: 100% (para debugging)
  - Session Replay: 100%

## 🔧 Personalización

Puedes ajustar las configuraciones en:
- `instrumentation.ts` - Para errores del servidor y `onRequestError` hook
- `instrumentation-client.ts` - Para tracking de navegación del cliente
- `sentry.client.config.ts` - Para configuración del cliente (legacy, considerar migrar a `instrumentation-client.ts`)
- `app/global-error.tsx` - Para UI de error global

## 📚 Documentación

- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Dashboard](https://fascinante-digital.sentry.io/)

## ⚠️ Notas Importantes

1. **No commitees `.env.local`** - Ya está en `.gitignore`
2. **Source Maps en producción** - Solo se suben si configuras `SENTRY_AUTH_TOKEN`
3. **Tunnel Route** - La ruta `/monitoring` está configurada para evitar bloqueadores
4. **Org/Project** - Ya configurado en `next.config.ts` (`fascinante-digital` / `javascript-nextjs`)

---

**Estado:** ✅ Configuración completa, pendiente de activar con DSN

