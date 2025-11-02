# 🚀 Sentry Quick Start - Pasos Finales

## ✅ Estado Actual
- ✅ Proyecto creado: `javascript-nextjs`
- ✅ Código configurado y funcionando
- ✅ Build exitoso sin errores
- ⏳ Pendiente: Agregar DSN

## 📋 Pasos Rápidos

### 1. Obtener DSN
1. Ve a: **https://fascinante-digital.sentry.io/settings/projects/javascript-nextjs/keys/**
2. Verás algo como:
   ```
   DSN
   https://abc123def456@o1234567.ingest.sentry.io/1234567
   ```
3. Copia ese DSN completo

### 2. Configurar `.env.local`
1. Abre `apps/web/.env.local`
2. Reemplaza `TU_DSN_AQUI` con tu DSN real en ambas líneas:
   ```bash
   NEXT_PUBLIC_SENTRY_DSN=https://abc123def456@o1234567.ingest.sentry.io/1234567
   SENTRY_DSN=https://abc123def456@o1234567.ingest.sentry.io/1234567
   ```

### 3. (Opcional) Configurar Allowed Domains
Si quieres restringir de dónde Sentry acepta eventos:

1. Ve a: **Settings > Projects > javascript-nextjs > Client Security**
2. En "Allowed Domains", agrega:
   ```
   http://localhost:3001
   https://fascinantedigital.com
   https://www.fascinantedigital.com
   ```
3. Guarda los cambios

**Nota:** Si estás en desarrollo local, deja el campo vacío o agrega `localhost:*` para permitir todas las conexiones locales.

### 4. Probar la Configuración

#### Opción A: Página de Prueba (si existe)
```bash
cd apps/web
pnpm dev
```
Luego visita: `http://localhost:3001/sentry-example-page`

#### Opción B: Crear Error de Prueba
Agrega temporalmente en cualquier componente:
```typescript
// Temporal - solo para testing
if (typeof window !== 'undefined') {
  throw new Error('Sentry test error');
}
```

#### Opción C: Usar la consola del navegador
Abre la consola del navegador y ejecuta:
```javascript
myUndefinedFunction();
```

### 5. Verificar en Sentry
1. Ve a: **https://fascinante-digital.sentry.io/issues/**
2. Deberías ver el error capturado

## ✅ Listo!

Una vez que veas el error en Sentry, la configuración está completa.

## 📚 Recursos
- [Dashboard Sentry](https://fascinante-digital.sentry.io/)
- [Project Settings](https://fascinante-digital.sentry.io/settings/projects/javascript-nextjs/)
- [Documentación completa](./SENTRY_SETUP.md)
