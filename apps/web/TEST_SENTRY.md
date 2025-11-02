# 🧪 Guía de Pruebas de Sentry

## ✅ Página de Prueba Creada

He creado una página dedicada para probar Sentry de forma segura:

**URL:** `/sentry-example-page` o `/es/sentry-example-page` o `/en/sentry-example-page`

## 🚀 Cómo Probar

### Opción 1: Usar la Página de Prueba (Recomendado)

1. **Inicia el servidor de desarrollo:**
   ```bash
   cd apps/web
   pnpm dev
   ```

2. **Abre en el navegador:**
   ```
   http://localhost:3001/es/sentry-example-page
   ```
   O:
   ```
   http://localhost:3001/en/sentry-example-page
   ```

3. **Haz clic en cualquier botón de prueba:**
   - **Error Manual** - Envía un error controlado
   - **Error con Contexto** - Error con información adicional
   - **Mensaje Personalizado** - Mensaje de info (no error)
   - **Función No Definida** - Como sugiere la doc oficial
   - **Error No Manejado** - Error que rompe la página (se recarga sola)

4. **Revisa en Sentry:**
   - Ve a: https://fascinante-digital.sentry.io/issues/
   - Deberías ver el error/mensaje en unos segundos
   - Click en el error para ver detalles completos

### Opción 2: Consola del Navegador

1. Abre cualquier página de tu sitio (ej: http://localhost:3001)
2. Abre la consola del navegador (F12 o clic derecho > Inspeccionar)
3. Ejecuta:
   ```javascript
   myUndefinedFunction();
   ```
4. Revisa en Sentry: https://fascinante-digital.sentry.io/issues/

### Opción 3: Error en Código (Temporal)

Agrega temporalmente en cualquier componente:

```typescript
'use client';

import * as Sentry from '@sentry/nextjs';

// Temporal - solo para testing
if (typeof window !== 'undefined') {
  Sentry.captureException(new Error('Test error desde componente'));
}
```

## 📊 Verificar en Sentry

### Dashboard Principal
https://fascinante-digital.sentry.io/issues/

### Performance Monitoring
https://fascinante-digital.sentry.io/performance/

### Session Replays
https://fascinante-digital.sentry.io/replays/

## ✅ Qué Verificar

1. ✅ **Error aparece en Issues** - Debe aparecer en 5-10 segundos
2. ✅ **Stack Trace visible** - Debe mostrar la línea de código exacta
3. ✅ **Contexto disponible** - Tags, user agent, URL, etc.
4. ✅ **Session Replay** (si activaste) - Debe haber un replay asociado al error

## 🐛 Troubleshooting

### No aparecen errores en Sentry

1. **Verifica el DSN:**
   ```bash
   cat apps/web/.env.local | grep SENTRY_DSN
   ```
   Debe mostrar tu DSN real (no `TU_DSN_AQUI`)

2. **Verifica que el servidor tenga las variables:**
   ```bash
   # Reinicia el servidor después de cambiar .env.local
   cd apps/web
   pnpm dev
   ```

3. **Revisa la consola del navegador:**
   - No deberían aparecer errores de conexión a Sentry
   - Si hay errores CORS, verifica "Allowed Domains" en Sentry Settings

4. **Verifica en Network tab:**
   - Abre DevTools > Network
   - Filtra por "sentry"
   - Debe haber requests a `ingest.us.sentry.io`
   - Status debe ser 200 OK

### Errores CORS

Si ves errores CORS:
1. Ve a Sentry Settings > Projects > javascript-nextjs > Client Security
2. Agrega `http://localhost:3001` a "Allowed Domains"
3. O usa `*` para desarrollo

## 📝 Notas

- Los errores pueden tardar 5-10 segundos en aparecer en Sentry
- La página de prueba está disponible en todos los locales (`/es/sentry-example-page`, `/en/sentry-example-page`)
- Los errores se agrupan automáticamente por tipo y mensaje similar
- Puedes resolver/archivar errores de prueba cuando termines
