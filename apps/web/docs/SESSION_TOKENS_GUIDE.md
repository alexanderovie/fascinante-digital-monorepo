# 🔐 Session Tokens - Optimización de Facturación

## ¿Qué son los Session Tokens?

Los **session tokens** son cadenas generadas por el usuario que agrupan las llamadas de Autocomplete y Place Details en una sesión para optimizar la facturación de Google Places API.

## ¿Por qué usarlos?

**Sin session token:**
- Cada llamada de Autocomplete se factura individualmente
- Cada llamada de Place Details se factura individualmente
- **Costo mayor** para el mismo flujo

**Con session token:**
- Una sesión de Autocomplete + Place Details se factura como **una sola sesión**
- Reduce costos significativamente
- Recomendado por Google para producción

## Formato del Session Token

Según la [documentación oficial](https://places.googleapis.com/$discovery/rest?version=v1):

- **Tipo**: String base64 URL-safe
- **Longitud máxima**: 36 caracteres ASCII
- **Recomendación**: Usar UUID v4
- **Validez**: Una sesión (desde que el usuario empieza a escribir hasta que selecciona un lugar)

## Cómo implementar

### 1. Generar Session Token

```typescript
import { randomUUID } from 'crypto';

// Generar token único para cada sesión
const sessionToken = randomUUID();
```

### 2. Usar en Autocomplete

```typescript
const response = await fetch(
  `/api/places/autocomplete?input=${input}&sessionToken=${sessionToken}`
);
```

### 3. Usar en Place Details (mismo token)

```typescript
const response = await fetch(
  `/api/places/details?place_id=${placeId}&sessionToken=${sessionToken}`
);
```

### 4. Invalidar después de Place Details

Una vez que se obtiene Place Details, el token ya no es válido. Para la siguiente sesión, generar un nuevo token.

## Ejemplo completo

```typescript
// 1. Usuario empieza a escribir
const sessionToken = randomUUID();

// 2. Autocomplete requests (mismo token)
const predictions = await fetch(
  `/api/places/autocomplete?input=pizza&sessionToken=${sessionToken}`
);

// 3. Usuario selecciona un lugar
const placeId = selectedPrediction.place_id;

// 4. Place Details (mismo token)
const details = await fetch(
  `/api/places/details?place_id=${placeId}&sessionToken=${sessionToken}`
);

// 5. Token usado - invalidar para próxima sesión
sessionToken = null; // O generar nuevo para próxima búsqueda
```

## Reglas importantes

1. ✅ **Una sesión = un token**: Cada sesión de búsqueda necesita su propio token
2. ✅ **Mismo token para Autocomplete + Details**: Usar el mismo token en ambas llamadas
3. ✅ **No reutilizar tokens**: Un token solo es válido para una sesión
4. ✅ **Mismo proyecto Cloud**: Todas las llamadas deben usar credenciales del mismo proyecto
5. ❌ **No reutilizar entre sesiones**: Si reutilizas un token, cada request se factura separadamente

## Implementación en nuestro componente

Actualmente el componente `BusinessAutocomplete` puede generar session tokens automáticamente. Esto está implementado pero es opcional - el backend ya soporta recibir el `sessionToken` como parámetro.

## Referencias

- [Discovery Document](https://places.googleapis.com/$discovery/rest?version=v1)
- [Place Details Documentation](https://developers.google.com/maps/documentation/places/web-service/place-details)
- [Autocomplete Documentation](https://developers.google.com/maps/documentation/places/web-service/autocomplete)
