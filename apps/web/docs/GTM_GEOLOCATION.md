# 🌍 Google Tag Manager con Geolocalización (GTM)

## 📋 Resumen

Esta implementación permite cargar GTM condicionalmente basado en la ubicación del usuario, útil para cumplir con GDPR y otras regulaciones de privacidad.

**Aplica para:** ✅ Sí, estás desplegado en Vercel y puedes usar `x-vercel-ip-country` header.

---

## 🎯 Casos de Uso

### 1. **Excluir Países de la EU (GDPR)**
Cargar GTM solo para usuarios fuera de la Unión Europea:

```tsx
import { GTMWithGeoLocation, EU_COUNTRY_CODES } from '@/components/SEO/GTMWithGeoLocation';

<GTMWithGeoLocation 
  gtmId="GTM-T7SZM386"
  excludeCountries={EU_COUNTRY_CODES}
  dataLayer={{ page_type: 'marketing_site' }}
/>
```

### 2. **Solo Cargar en Países Específicos**
Cargar GTM solo en Estados Unidos y México:

```tsx
<GTMWithGeoLocation 
  gtmId="GTM-T7SZM386"
  includeCountries={['US', 'MX']}
  dataLayer={{ page_type: 'marketing_site' }}
/>
```

### 3. **Sin Restricciones (Actual)**
Cargar GTM para todos los usuarios (comportamiento actual):

```tsx
<GTMWithGeoLocation 
  gtmId="GTM-T7SZM386"
  dataLayer={{ page_type: 'marketing_site' }}
/>
```

---

## 🔧 Implementación

### Paso 1: Actualizar Layout

```tsx
// apps/web/app/[locale]/layout.tsx
import { Suspense } from 'react';
import { GTMWithGeoLocation, EU_COUNTRY_CODES } from '@/components/SEO/GTMWithGeoLocation';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const enableGTM = process.env.NEXT_PUBLIC_ENABLE_GTM === 'true';
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T7SZM386';

  return (
    <html lang={locale}>
      {enableGTM && (
        <Suspense fallback={null}>
          <GTMWithGeoLocation
            gtmId={gtmId}
            excludeCountries={EU_COUNTRY_CODES} // Excluir EU para GDPR
            dataLayer={{ page_type: 'marketing_site' }}
          />
        </Suspense>
      )}
      <body>
        {children}
      </body>
    </html>
  );
}
```

---

## ✅ Ventajas

1. **GDPR Compliance**: No cargar GTM en países EU si no tienes consentimiento
2. **Performance**: Menos scripts = mejor rendimiento en ciertas regiones
3. **Flexibilidad**: Fácil de ajustar qué países incluir/excluir
4. **Tag Assistant**: Funciona correctamente (GTM está en el HTML inicial)

---

## ⚠️ Consideraciones

### Requisitos de Vercel
- ✅ Solo funciona en Vercel (usa header `x-vercel-ip-country`)
- ✅ No funciona en desarrollo local (header no disponible)
- ✅ Fallback a 'US' si header no está disponible

### Desarrollo Local
En desarrollo, el componente siempre cargará GTM (fallback a 'US'). Para testing:
1. Usar variable de entorno `NEXT_PUBLIC_ENABLE_GTM=false` para desactivar
2. O modificar temporalmente el código

### Performance
- El script GTM inline es pequeño (~1KB)
- No bloquea renderizado (carga asíncrona)
- Tag Assistant lo detecta correctamente

---

## 🧪 Testing

### Verificar en Producción:
1. Abrir https://fascinantedigital.com/es desde:
   - Un país EU (ej: España, Alemania) → GTM **NO** debería cargar
   - Un país no-EU (ej: US, MX) → GTM **SÍ** debería cargar

2. Verificar en DevTools:
   - Network tab → Filtrar por "gtm"
   - EU: No debería aparecer `gtm.js`
   - No-EU: Debería aparecer `gtm.js?id=GTM-T7SZM386`

3. Verificar Tag Assistant:
   - Ejecutar Tag Assistant extension
   - En países no-EU: Debería detectar GTM-T7SZM386
   - En países EU: No debería detectar nada (si está excluido)

---

## 📊 Comparación: Con vs Sin Geolocalización

| Aspecto | Sin Geolocalización | Con Geolocalización (Excluir EU) |
|---------|---------------------|----------------------------------|
| **GDPR Compliance** | ⚠️ Carga en todos lados | ✅ No carga en EU |
| **Performance EU** | ⚠️ GTM carga innecesariamente | ✅ Mejor performance |
| **Tag Assistant** | ✅ Funciona | ✅ Funciona |
| **Complejidad** | ✅ Simple | ⚠️ Requiere Suspense |

---

## 🔗 Referencias

- **Vercel Docs**: https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
- **GTM Documentation**: https://tagmanager.google.com/
- **GDPR Compliance**: https://gdpr.eu/

---

**Última actualización**: Noviembre 2025  
**Status**: ✅ Componente creado - Pendiente de implementación opcional

