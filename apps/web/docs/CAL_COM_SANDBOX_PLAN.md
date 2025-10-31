# 🎯 Plan Elite: Cal.com API v2 Sandbox Integration

## 📋 Resumen Ejecutivo

Implementación de integración con Cal.com API v2 en modo **sandbox/test** para Fascinante Digital, permitiendo desarrollo y testing seguro antes de producción.

---

## 🎯 Objetivos

1. **Sandbox Testing**: Configurar entorno de pruebas con API keys de test mode (`cal_` prefix)
2. **Autenticación Múltiple**: Soporte para 3 métodos de auth (API Key, OAuth, Managed Users)
3. **TypeScript Elite**: Tipado completo basado en Cal.com API v2
4. **Server-First**: Uso de Server Components y Server Actions según Next.js 15.5.6
5. **Error Handling**: Manejo robusto de errores y rate limiting

---

## 📁 Estructura Propuesta

```
apps/web/
├── lib/
│   └── cal-com/
│       ├── client.ts              # Cliente API configurado
│       ├── types.ts               # TypeScript types para Cal.com
│       ├── auth.ts                # Utilidades de autenticación
│       └── utils.ts               # Helpers y validaciones
├── app/api/
│   └── cal-com/
│       ├── bookings/
│       │   └── route.ts           # GET /api/cal-com/bookings
│       ├── event-types/
│       │   └── route.ts           # GET /api/cal-com/event-types
│       └── webhooks/
│           └── route.ts            # POST /api/cal-com/webhooks
├── types/
│   └── cal-com.ts                 # Tipos globales
└── .env.local                     # Variables de entorno (sandbox)
```

---

## 🔐 Fase 1: Configuración de Entorno Sandbox

### 1.1 Variables de Entorno

```env
# Cal.com API v2 - Sandbox Mode
CAL_COM_API_URL=https://api.cal.com/v2
CAL_COM_API_KEY=cal_test_xxxxxxxxxxxxx  # Test mode key (prefijo cal_)

# OAuth Client (opcional para Platform)
CAL_COM_OAUTH_CLIENT_ID=
CAL_COM_OAUTH_SECRET_KEY=

# Environment
CAL_COM_ENVIRONMENT=sandbox  # sandbox | production
```

### 1.2 Generación de API Key

1. Ir a [Cal.com Settings > Security](https://app.cal.com/settings/security)
2. Generar nueva API Key en **Test Mode** (prefijo `cal_`)
3. Guardar en `.env.local`

---

## 🏗️ Fase 2: Cliente API TypeScript Elite

### 2.1 Cliente Base (`lib/cal-com/client.ts`)

```typescript
// Cliente con:
// - TypeScript completo
// - Retry logic
// - Rate limiting
// - Error handling
// - Request/Response logging (solo en dev)
```

### 2.2 Tipos TypeScript (`lib/cal-com/types.ts`)

```typescript
// Basado en Cal.com API v2 documentation
// - Bookings
// - Event Types
// - Schedules
// - Users
// - Webhooks
```

### 2.3 Autenticación (`lib/cal-com/auth.ts`)

```typescript
// 3 métodos:
// 1. API Key (Bearer token)
// 2. OAuth Client Credentials (headers)
// 3. Managed User Access Token (Bearer)
```

---

## 🔌 Fase 3: API Routes (Next.js 15.5.6)

### 3.1 Estructura Server Actions

```typescript
// app/api/cal-com/bookings/route.ts
// - Server Component/Route Handler
// - Validación con Zod
// - Rate limiting
// - Error handling
```

### 3.2 Endpoints Prioritarios (Sandbox)

1. **GET /api/cal-com/event-types** - Listar tipos de eventos
2. **GET /api/cal-com/bookings** - Listar reservas
3. **POST /api/cal-com/bookings** - Crear reserva (test)
4. **GET /api/cal-com/schedules** - Obtener horarios disponibles

---

## 🧪 Fase 4: Testing & Sandbox

### 4.1 Mock Data

```typescript
// lib/cal-com/mocks.ts
// - Datos de prueba para desarrollo
// - Útil cuando API no está disponible
```

### 4.2 Test Utilities

```typescript
// lib/cal-com/test-utils.ts
// - Helpers para testing
// - Validación de respuestas
```

---

## 📊 Fase 5: Integración con UI

### 5.1 Componentes React

```typescript
// components/CalCom/
// - BookingForm.tsx (Server Component)
// - EventTypeSelector.tsx (Client Component)
// - ScheduleViewer.tsx (Server Component)
```

---

## 🚀 Plan de Implementación (Pasos)

### ✅ Paso 1: Setup Inicial (30 min)
- [ ] Crear estructura de carpetas
- [ ] Configurar variables de entorno
- [ ] Instalar dependencias necesarias (si aplica)

### ✅ Paso 2: Cliente API Base (1-2 horas)
- [ ] Implementar `client.ts` con fetch configurado
- [ ] Tipos TypeScript básicos
- [ ] Sistema de autenticación con API Key

### ✅ Paso 3: Primer Endpoint (1 hora)
- [ ] GET /api/cal-com/event-types
- [ ] Test con API key sandbox
- [ ] Validación de respuesta

### ✅ Paso 4: Endpoints Core (2-3 horas)
- [ ] Bookings endpoints
- [ ] Schedules endpoints
- [ ] Error handling robusto

### ✅ Paso 5: UI Components (2-3 horas)
- [ ] Componentes React básicos
- [ ] Integración con formularios existentes
- [ ] Testing visual

---

## 🔒 Seguridad & Best Practices

1. **Nunca commitear API keys** - Usar `.env.local` en `.gitignore`
2. **Rate Limiting** - Implementar en API routes
3. **Validación** - Zod para request/response validation
4. **Error Handling** - Logs estructurados sin exponer secrets
5. **HTTPS Only** - Todas las requests a Cal.com via HTTPS

---

## 📝 Checklist Pre-Producción

- [ ] API Key de test mode configurada
- [ ] Todos los endpoints probados en sandbox
- [ ] Error handling completo
- [ ] Rate limiting implementado
- [ ] Logs estructurados (sin secrets)
- [ ] Documentación interna completa
- [ ] Tests básicos pasando
- [ ] Variables de entorno documentadas

---

## 📚 Referencias

- [Cal.com API v2 Docs](https://cal.com/docs/api-reference/v2)
- [Cal.com Platform Guide](https://cal.com/docs/platform/quickstart)
- [Cal.com Authentication](https://cal.com/docs/api-reference/v2/introduction#authentication)

---

## 🎯 Próximos Pasos

1. Revisar este plan
2. Confirmar endpoints prioritarios
3. Generar API key de test mode
4. Comenzar implementación fase por fase
