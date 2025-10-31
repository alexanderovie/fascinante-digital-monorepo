# Cal.com API v2 - Workflows Élite

> Workflows profesionales basados en endpoints disponibles para cuentas **Organizations**

## 📋 Índice de Endpoints Disponibles

### ✅ Endpoints Disponibles (Organizations)
- ✅ **Event Types** (todos los endpoints)
- ✅ **Bookings** (todos los endpoints)
- ✅ **Schedules** (todos los endpoints)
- ✅ **Slots** (disponibilidad y reservas)
- ✅ **Calendars** (horarios ocupados)
- ✅ **Me** (perfil del usuario)
- ✅ **Verified Resources** (verificación email/teléfono)
- ✅ **Stripe** (conexión y credenciales)
- ❌ **Platform** endpoints (solo Platform customers)
- ❌ **Teams** endpoints (solo Teams customers)
- ❌ **Orgs/Orgs** (children organizations, solo Platform)

---

## 🚀 Workflow 1: Listar y Mostrar Event Types Disponibles

**Caso de Uso**: Mostrar los tipos de eventos disponibles en la landing page o formulario de auditoría.

### Flujo Completo:
1. **GET** `/v2/event-types` → Listar todos los event types
2. **GET** `/v2/event-types/{id}` → Detalles de un event type específico
3. **GET** `/v2/slots/event-types/{eventTypeId}` → Obtener horarios disponibles

### Implementación:

```typescript
// apps/web/lib/workflows/event-types.ts
import { getCalComClient } from '@/lib/cal-com';
import type { CalComEventType, CalComAvailableSlot } from '@/types/cal-com';

/**
 * Obtener todos los event types con sus slots disponibles
 */
export async function getAvailableEventTypes(
  startDate: string,
  endDate: string
): Promise<Array<{
  eventType: CalComEventType;
  availableSlots: CalComAvailableSlot[];
}>> {
  const client = getCalComClient();

  // 1. Obtener todos los event types
  const eventTypes = await client.get<CalComEventType[]>('/event-types');

  // 2. Para cada event type, obtener slots disponibles
  const eventTypesWithSlots = await Promise.all(
    eventTypes.map(async (eventType) => {
      try {
        const slots = await client.get<CalComAvailableSlot[]>(
          `/slots/event-types/${eventType.id}`,
          { startDate, endDate }
        );

        return {
          eventType,
          availableSlots: slots,
        };
      } catch (error) {
        console.warn(`No slots available for event type ${eventType.id}:`, error);
        return {
          eventType,
          availableSlots: [],
        };
      }
    })
  );

  // 3. Filtrar solo los que tienen slots disponibles
  return eventTypesWithSlots.filter((item) => item.availableSlots.length > 0);
}

/**
 * Obtener un event type específico por slug
 */
export async function getEventTypeBySlug(
  slug: string,
  username?: string
): Promise<CalComEventType | null> {
  const client = getCalComClient();

  const params: Record<string, string> = { slug };
  if (username) params.username = username;

  const eventTypes = await client.get<CalComEventType[]>('/event-types', params);

  return eventTypes[0] || null;
}
```

### API Route:

```typescript
// apps/web/app/api/cal-com/event-types/available/route.ts
import { getAvailableEventTypes } from '@/lib/workflows/event-types';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date().toISOString();
    const endDate =
      searchParams.get('endDate') ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // +30 días

    const eventTypes = await getAvailableEventTypes(startDate, endDate);

    return NextResponse.json(
      { eventTypes },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching available event types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Workflow 2: Proceso Completo de Booking (Auditoría Gratuita)

**Caso de Uso**: Cuando un cliente completa el formulario de auditoría y quiere agendar una consulta.

### Flujo Completo:
1. **GET** `/v2/slots/event-types/{eventTypeId}` → Obtener slots disponibles
2. **POST** `/v2/bookings` → Crear booking
3. **GET** `/v2/bookings/{bookingUid}` → Verificar booking creado
4. **GET** `/v2/bookings/{bookingUid}/add-to-calendar` → Obtener links para agregar al calendario

### Implementación:

```typescript
// apps/web/lib/workflows/bookings.ts
import { getCalComClient } from '@/lib/cal-com';
import type {
  CalComCreateBookingRequest,
  CalComCreateBookingResponse,
  CalComBooking,
  CalComAvailableSlot,
} from '@/types/cal-com';

/**
 * Crear booking completo con validaciones
 */
export async function createBookingFlow(
  eventTypeId: number,
  startTime: string,
  attendee: {
    email: string;
    name: string;
    notes?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<{
  booking: CalComBooking;
  calendarLinks: {
    google?: string;
    microsoft?: string;
    apple?: string;
  };
}> {
  const client = getCalComClient();

  // 1. Validar que el slot está disponible
  const endTime = new Date(
    new Date(startTime).getTime() + 30 * 60 * 1000
  ).toISOString(); // +30 min por defecto

  const availableSlots = await client.get<CalComAvailableSlot[]>(
    `/slots/event-types/${eventTypeId}`,
    {
      startDate: startTime.split('T')[0],
      endDate: endTime.split('T')[0],
    }
  );

  const isSlotAvailable = availableSlots.some(
    (slot) => slot.time === startTime
  );

  if (!isSlotAvailable) {
    throw new Error('El horario seleccionado ya no está disponible');
  }

  // 2. Crear booking
  const bookingRequest: CalComCreateBookingRequest = {
    eventTypeId,
    start: startTime,
    end: endTime,
    responses: {
      email: attendee.email,
      name: attendee.name,
      notes: attendee.notes,
      ...attendee.metadata,
    },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const bookingResponse = await client.post<CalComCreateBookingResponse>(
    '/bookings',
    bookingRequest
  );

  // 3. Obtener detalles del booking
  const booking = await client.get<CalComBooking>(
    `/bookings/${bookingResponse.uid}`
  );

  // 4. Obtener links de calendario
  const calendarLinksResponse = await client.get<{
    google?: string;
    microsoft?: string;
    apple?: string;
  }>(`/bookings/${bookingResponse.uid}/add-to-calendar`);

  return {
    booking,
    calendarLinks: calendarLinksResponse || {},
  };
}
```

### API Route:

```typescript
// apps/web/app/api/cal-com/bookings/create/route.ts
import { createBookingFlow } from '@/lib/workflows/bookings';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { eventTypeId, startTime, attendee } = body;

    if (!eventTypeId || !startTime || !attendee?.email || !attendee?.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await createBookingFlow(eventTypeId, startTime, attendee);

    return NextResponse.json(result, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}
```

---

## 🚀 Workflow 3: Gestionar Schedules (Horarios de Disponibilidad)

**Caso de Uso**: Gestionar los horarios de disponibilidad del equipo de Fascinante Digital.

### Flujo Completo:
1. **GET** `/v2/schedules` → Listar todos los schedules
2. **GET** `/v2/schedules/{id}` → Obtener un schedule específico
3. **POST** `/v2/schedules` → Crear nuevo schedule
4. **PATCH** `/v2/schedules/{id}` → Actualizar schedule
5. **DELETE** `/v2/schedules/{id}` → Eliminar schedule

### Implementación:

```typescript
// apps/web/lib/workflows/schedules.ts
import { getCalComClient } from '@/lib/cal-com';
import type { CalComSchedule } from '@/types/cal-com';

/**
 * Obtener todos los schedules con disponibilidad consolidada
 */
export async function getAllSchedules(): Promise<CalComSchedule[]> {
  const client = getCalComClient();

  return await client.get<CalComSchedule[]>('/schedules');
}

/**
 * Crear schedule con validación
 */
export async function createSchedule(data: {
  name: string;
  timeZone: string;
  availability: Array<{
    days: number[];
    startTime: string;
    endTime: string;
  }>;
}): Promise<CalComSchedule> {
  const client = getCalComClient();

  // Validar timezone
  try {
    Intl.DateTimeFormat(undefined, { timeZone: data.timeZone });
  } catch {
    throw new Error(`Invalid timezone: ${data.timeZone}`);
  }

  return await client.post<CalComSchedule>('/schedules', data);
}

/**
 * Actualizar schedule
 */
export async function updateSchedule(
  scheduleId: number,
  updates: Partial<{
    name: string;
    timeZone: string;
    availability: Array<{
      days: number[];
      startTime: string;
      endTime: string;
    }>;
  }>
): Promise<CalComSchedule> {
  const client = getCalComClient();

  return await client.patch<CalComSchedule>(`/schedules/${scheduleId}`, updates);
}
```

---

## 🚀 Workflow 4: Consultar Horarios Ocupados (Busy Times)

**Caso de Uso**: Verificar cuándo el equipo NO está disponible para mostrar solo horarios libres.

### Flujo Completo:
1. **GET** `/v2/calendars/busy-times` → Obtener horarios ocupados
2. Combinar con slots disponibles para filtrar

### Implementación:

```typescript
// apps/web/lib/workflows/busy-times.ts
import { getCalComClient } from '@/lib/cal-com';
import type { CalComAvailableSlot } from '@/types/cal-com';

interface BusyTime {
  start: string;
  end: string;
  source?: string;
}

/**
 * Obtener horarios ocupados y filtrar slots disponibles
 */
export async function getAvailableSlotsExcludingBusyTimes(
  eventTypeId: number,
  startDate: string,
  endDate: string
): Promise<CalComAvailableSlot[]> {
  const client = getCalComClient();

  // 1. Obtener slots disponibles
  const availableSlots = await client.get<CalComAvailableSlot[]>(
    `/slots/event-types/${eventTypeId}`,
    { startDate, endDate }
  );

  // 2. Obtener horarios ocupados
  const busyTimesResponse = await client.get<{ data: BusyTime[] }>(
    '/calendars/busy-times',
    { startDate, endDate }
  );

  const busyTimes = busyTimesResponse.data || [];

  // 3. Filtrar slots que no se solapan con busy times
  const freeSlots = availableSlots.filter((slot) => {
    const slotStart = new Date(slot.time);
    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // +30 min

    return !busyTimes.some((busy) => {
      const busyStart = new Date(busy.start);
      const busyEnd = new Date(busy.end);

      // Verificar solapamiento
      return (
        (slotStart >= busyStart && slotStart < busyEnd) ||
        (slotEnd > busyStart && slotEnd <= busyEnd) ||
        (slotStart <= busyStart && slotEnd >= busyEnd)
      );
    });
  });

  return freeSlots;
}
```

---

## 🚀 Workflow 5: Gestionar Bookings (Cancelar, Reprogramar)

**Caso de Uso**: Permitir a los clientes cancelar o reprogramar sus auditorías.

### Flujo Completo:
1. **GET** `/v2/bookings/{bookingUid}` → Obtener booking
2. **POST** `/v2/bookings/{bookingUid}/cancel` → Cancelar booking
3. **POST** `/v2/bookings/{bookingUid}/reschedule` → Reprogramar booking

### Implementación:

```typescript
// apps/web/lib/workflows/booking-management.ts
import { getCalComClient } from '@/lib/cal-com';
import type { CalComBooking } from '@/types/cal-com';

/**
 * Cancelar booking con verificación
 */
export async function cancelBooking(
  bookingUid: string,
  reason?: string
): Promise<CalComBooking> {
  const client = getCalComClient();

  // 1. Verificar que el booking existe
  const booking = await client.get<CalComBooking>(`/bookings/${bookingUid}`);

  if (booking.status === 'cancelled') {
    throw new Error('Este booking ya está cancelado');
  }

  // 2. Cancelar
  await client.post(`/bookings/${bookingUid}/cancel`, {
    cancellationReason: reason,
  });

  // 3. Obtener booking actualizado
  return await client.get<CalComBooking>(`/bookings/${bookingUid}`);
}

/**
 * Reprogramar booking
 */
export async function rescheduleBooking(
  bookingUid: string,
  newStartTime: string,
  newEndTime: string
): Promise<CalComBooking> {
  const client = getCalComClient();

  // 1. Verificar que el booking existe
  const booking = await client.get<CalComBooking>(`/bookings/${bookingUid}`);

  if (booking.status === 'cancelled') {
    throw new Error('No se puede reprogramar un booking cancelado');
  }

  // 2. Reprogramar
  await client.post(`/bookings/${bookingUid}/reschedule`, {
    rescheduleTime: newStartTime,
    endTime: newEndTime,
  });

  // 3. Obtener booking actualizado
  return await client.get<CalComBooking>(`/bookings/${bookingUid}`);
}
```

---

## 🚀 Workflow 6: Integración con Formulario de Auditoría

**Caso de Uso**: Cuando un cliente completa el formulario de auditoría, automáticamente crear un booking.

### Flujo Completo:
1. Usuario completa formulario de auditoría
2. Server Action llama a Cal.com API
3. Crear booking automático
4. Enviar email de confirmación con links de calendario

### Implementación:

```typescript
// apps/web/app/actions/audit-booking.ts
'use server';

import { createBookingFlow } from '@/lib/workflows/bookings';
import { getEventTypeBySlug } from '@/lib/workflows/event-types';

export async function createAuditBooking(formData: {
  businessName: string;
  email: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
}) {
  try {
    // 1. Buscar event type de "Auditoría Gratuita"
    const eventType = await getEventTypeBySlug('auditoria-gratuita');

    if (!eventType) {
      throw new Error('Event type "Auditoría Gratuita" no encontrado');
    }

    // 2. Determinar fecha/hora
    let startTime: string;

    if (formData.preferredDate && formData.preferredTime) {
      // Combinar fecha y hora
      startTime = new Date(
        `${formData.preferredDate}T${formData.preferredTime}`
      ).toISOString();
    } else {
      // Usar siguiente slot disponible
      // (Aquí implementarías lógica para obtener próximo slot)
      throw new Error('Por favor selecciona una fecha y hora');
    }

    // 3. Crear booking
    const result = await createBookingFlow(eventType.id, startTime, {
      email: formData.email,
      name: formData.businessName,
      notes: `Teléfono: ${formData.phone || 'N/A'}`,
      metadata: {
        source: 'audit-form',
        businessName: formData.businessName,
      },
    });

    return {
      success: true,
      booking: result.booking,
      calendarLinks: result.calendarLinks,
    };
  } catch (error) {
    console.error('Error creating audit booking:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Error al crear el booking',
    };
  }
}
```

---

## 📊 Resumen de Endpoints por Categoría

### Event Types
- ✅ `GET /v2/event-types` - Listar todos
- ✅ `GET /v2/event-types/{id}` - Obtener uno
- ✅ `POST /v2/event-types` - Crear (requiere managed user token)
- ✅ `PATCH /v2/event-types/{id}` - Actualizar (requiere managed user token)
- ✅ `DELETE /v2/event-types/{id}` - Eliminar (requiere managed user token)

### Bookings
- ✅ `POST /v2/bookings` - Crear booking (público o con token)
- ✅ `GET /v2/bookings` - Listar todos (requiere token)
- ✅ `GET /v2/bookings/{uid}` - Obtener uno
- ✅ `POST /v2/bookings/{uid}/cancel` - Cancelar
- ✅ `POST /v2/bookings/{uid}/reschedule` - Reprogramar
- ✅ `POST /v2/bookings/{uid}/confirm` - Confirmar
- ✅ `POST /v2/bookings/{uid}/decline` - Rechazar
- ✅ `GET /v2/bookings/{uid}/add-to-calendar` - Links de calendario

### Schedules
- ✅ `GET /v2/schedules` - Listar todos (requiere token)
- ✅ `GET /v2/schedules/{id}` - Obtener uno (requiere token)
- ✅ `POST /v2/schedules` - Crear (requiere token)
- ✅ `PATCH /v2/schedules/{id}` - Actualizar (requiere token)
- ✅ `DELETE /v2/schedules/{id}` - Eliminar (requiere token)

### Slots
- ✅ `GET /v2/slots/event-types/{eventTypeId}` - Slots disponibles
- ✅ `POST /v2/slots/reserve` - Reservar slot
- ✅ `GET /v2/slots/reserved/{reservedSlotId}` - Obtener slot reservado

### Calendars
- ✅ `GET /v2/calendars/busy-times` - Horarios ocupados

### Me
- ✅ `GET /v2/me` - Perfil del usuario autenticado

---

## 🎯 Próximos Pasos

1. **Implementar workflows básicos** (Workflow 1 y 2)
2. **Integrar con formulario de auditoría** (Workflow 6)
3. **Agregar gestión de bookings** (Workflow 5)
4. **Implementar horarios ocupados** (Workflow 4)

---

## 📝 Notas Importantes

- **API Key**: Funciona para endpoints públicos (GET event types, crear bookings)
- **Managed User Token**: Requerido para gestionar schedules y event types propios
- **OAuth Credentials**: Solo necesario si vas a crear managed users o webhooks
- **Rate Limiting**: El cliente ya incluye retry logic y timeout
- **Caching**: Usa `Cache-Control` headers apropiados en API routes

