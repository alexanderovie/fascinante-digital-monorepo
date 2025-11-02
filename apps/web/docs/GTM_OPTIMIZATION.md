# 🚀 Optimización de Google Tag Manager

## 📊 Resultados de Performance

### Antes de Optimización:
- **Desktop**: 99-100 ✅
- **Móvil**: 62 ⚠️

### Después de Desactivar GTM:
- **Desktop**: 99-100 ✅
- **Móvil**: 84 ✅ (+22 puntos)

### Con GTM Optimizado (Implementado):
- **Desktop**: 99-100 (esperado)
- **Móvil**: 75-80 (esperado) - Mejora significativa vs GTM original

---

## 🎯 Estrategia de Optimización Implementada

### Componente: `OptimizedGTM.tsx`

#### Optimizaciones Aplicadas:

1. **Lazy Loading Inteligente**
   - GTM solo se carga después de 1 segundo (permite que LCP complete)
   - O al primer user interaction (click, scroll, touch)
   - No bloquea el render inicial

2. **Strategy: `afterInteractive`**
   - Next.js Script component con estrategia optimizada
   - Carga después de que la página es interactiva
   - No bloquea parsing del HTML

3. **Condicional Loading**
   - Controlado por `NEXT_PUBLIC_ENABLE_GTM`
   - Puede desactivarse fácilmente para pruebas

4. **DataLayer Pre-configurado**
   - DataLayer se inicializa antes del script
   - Evita race conditions

---

## 🔧 Configuración

### Variables de Entorno

```bash
# .env.local

# Desactivar completamente (mejor performance)
NEXT_PUBLIC_ENABLE_GTM=false

# Activar con optimizaciones (balance performance/tracking)
NEXT_PUBLIC_ENABLE_GTM=true
NEXT_PUBLIC_GTM_ID=GTM-T7SZM386
```

---

## 📈 Impacto Esperado

### Con GTM Optimizado Activado:

| Métrica | Sin GTM | GTM Original | GTM Optimizado |
|---------|---------|--------------|----------------|
| **Mobile Score** | 84 | 62 | 75-80 (esperado) |
| **Desktop Score** | 99-100 | 99-100 | 99-100 |
| **LCP** | ✅ Excelente | ⚠️ Afectado | ✅ Mejorado |
| **TTI** | ✅ Rápido | ⚠️ Lento | ✅ Mejorado |
| **FID** | ✅ Excelente | ⚠️ Afectado | ✅ Mejorado |

---

## 🎯 Cuándo Usar Cada Configuración

### 1. **Desarrollo/Testing de Performance**
```bash
NEXT_PUBLIC_ENABLE_GTM=false
```
- Mejor rendimiento puro
- Ideal para pruebas de PageSpeed
- No tracking de analytics

### 2. **Producción con Analytics Necesarios**
```bash
NEXT_PUBLIC_ENABLE_GTM=true
```
- Tracking activo pero optimizado
- No bloquea LCP
- Carga después de interacción
- Balance entre performance y analytics

---

## 🔍 Verificación

### Verificar que GTM Optimizado está funcionando:

1. **Abrir DevTools > Network**
2. **Filtrar por "gtm"**
3. **Verificar timing:**
   - ❌ No debe aparecer antes de 1 segundo
   - ❌ No debe aparecer antes de LCP
   - ✅ Debe aparecer después de user interaction o 1 segundo

### Verificar Analytics:

1. **GTM Debug Mode**: `https://tagassistant.google.com/`
2. **GA4 Real-Time**: Verificar que eventos se envían correctamente
3. **Delay esperado**: Los primeros eventos pueden tardar 1-2 segundos más

---

## 📚 Referencias

- [Next.js Script Component](https://nextjs.org/docs/app/api-reference/components/script)
- [Web Vitals Best Practices](https://web.dev/vitals/)
- [GTM Loading Best Practices](https://developers.google.com/tag-manager/web)

---

## ⚠️ Notas Importantes

1. **First Interaction Delay**: Los primeros eventos pueden tener un pequeño delay (1 segundo) debido al lazy loading. Esto es intencional para mejorar performance.

2. **Critical Tracking**: Si necesitas tracking inmediato de eventos críticos (ej: página de error), considera enviarlos directamente a GA4 en lugar de vía GTM.

3. **A/B Testing**: Si usas GTM para A/B testing que requiere ejecución inmediata, considera moverlo a código o usar una estrategia diferente.

4. **Conversion Tracking**: Los eventos de conversión se capturan correctamente, solo con un pequeño delay inicial.

---

**Última actualización**: Noviembre 2025
**Versión Next.js**: 15.5.6
