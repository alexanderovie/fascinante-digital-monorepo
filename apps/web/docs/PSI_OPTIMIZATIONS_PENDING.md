# 🚀 Optimizaciones PSI Pendientes

**Basado en documentación oficial:**
- Next.js 15.5.6: https://nextjs.org/docs
- Vercel: https://vercel.com/docs

---

## ❌ **PENDIENTES CRÍTICAS (PSI Issues)**

### 1. **LCP (Largest Contentful Paint) - 8.6s** 🔴
**Problema**: No hay imagen hero visual con priority/preload

**Solución (nextjs.org oficial)**:
- ✅ Agregar imagen hero visual en HeroContent
- ✅ Usar `Image` component con `preload={true}` (Next.js 16) o `priority={true}` (Next.js 15.5.6)
- ✅ Usar `loading="eager"` para above-fold images
- ✅ Agregar `fetchPriority="high"` si soportado

**Archivos a modificar**:
- `components/Home/Hero/HeroContent.tsx` - Agregar imagen hero

---

### 2. **JavaScript sin usar (201 KiB)** 🟠
**Problema**: framer-motion y embla-carousel cargados aunque están below-fold

**Solución (nextjs.org/docs/app/guides/lazy-loading)**:
- ✅ Usar `next/dynamic` con `ssr: false` para componentes con animaciones
- ✅ Lazy load componentes que usan framer-motion:
  - `ExcepServices`
  - `UserImpact`
  - `PricingCards`
  - `CleaningHighlightAnimated`
  - `AuditProcess`
  - `AuditBenefits`
  - `WhatWeAudit`
  - `MetricsGrid`
- ✅ Lazy load `carousel.tsx` (embla-carousel)

**Archivos a modificar**:
- `components/Home/ExcepServices/index.tsx`
- `components/UserImpact/index.tsx`
- `components/Home/Pricing/PricingCards.tsx`
- `components/Home/CleaningHighlight/CleaningHighlightAnimated.tsx`
- `components/Audit/AuditProcess/index.tsx`
- `components/Audit/AuditBenefits/index.tsx`
- `components/Audit/WhatWeAudit/index.tsx`
- `components/Portfolio/MetricsGrid.tsx`
- `components/ui/carousel.tsx`
- `app/[locale]/(site)/page.tsx` - Wrappear componentes below-fold

---

### 3. **TTI (Time to Interactive) - 8.6s** 🟠
**Problema**: Bundle JavaScript grande bloquea interactividad

**Solución (nextjs.org/docs/app/guides/lazy-loading)**:
- ✅ Code splitting dinámico con `next/dynamic`
- ✅ Defer scripts no críticos con `next/script` strategy="lazyOnload"
- ✅ Ya implementado: Facebook/HubSpot via GTM (diferido)

**Archivos a modificar**:
- Ver lista arriba (mismo que JavaScript sin usar)

---

### 4. **FCP (First Contentful Paint) - 2.9s** 🟡
**Problema**: Sin preload de recursos críticos

**Solución (nextjs.org/docs/app/api-reference/components/image#preload)**:
- ✅ Preload de fuente Inter (si usa next/font)
- ✅ Preload de imagen hero (con Image component `preload={true}`)
- ✅ Preconnect a dominios críticos (Google Fonts, API externas)

**Archivos a modificar**:
- `app/[locale]/layout.tsx` - Agregar preconnect links
- `components/Home/Hero/HeroContent.tsx` - Imagen con preload

---

### 5. **Speed Index - 5.5s** 🟡
**Problema**: Contenido visual aparece lentamente

**Solución**:
- ✅ Lazy loading de componentes below-fold (ver punto 2)
- ✅ Priority en imágenes above-fold
- ✅ Optimización de imágenes con `sizes` prop

---

## ✅ **YA IMPLEMENTADO**

1. ✅ Image Optimization configurada (`formats: ['image/webp']`)
2. ✅ Cache-Control headers para assets estáticos
3. ✅ CDN caching para API routes (con headers)
4. ✅ Facebook/HubSpot diferidos via GTM
5. ✅ YouTube videos reemplazados con placeholders

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### Prioridad ALTA (Impacto directo PSI):

- [ ] **LCP**: Agregar imagen hero con `priority`/`preload`
- [ ] **JS Sin usar**: Lazy load `ExcepServices` (framer-motion)
- [ ] **JS Sin usar**: Lazy load `UserImpact` (framer-motion)
- [ ] **JS Sin usar**: Lazy load `PricingCards` (framer-motion)
- [ ] **JS Sin usar**: Lazy load `carousel.tsx` (embla-carousel)

### Prioridad MEDIA:

- [ ] **TTI**: Lazy load resto de componentes con framer-motion
- [ ] **FCP**: Preload de fuente Inter (si usa next/font)
- [ ] **FCP**: Preconnect a dominios críticos

### Prioridad BAJA:

- [ ] Optimización adicional de `sizes` prop en imágenes
- [ ] Font display optimization

---

## 🔗 **REFERENCIAS OFICIALES**

- **Lazy Loading**: https://nextjs.org/docs/app/guides/lazy-loading
- **Image Optimization**: https://nextjs.org/docs/app/api-reference/components/image#preload
- **Script Optimization**: https://nextjs.org/docs/app/guides/scripts#strategy
- **Caching**: https://nextjs.org/docs/app/guides/caching
- **Vercel Data Cache**: https://vercel.com/docs/data-cache

---

**Última actualización**: Basado en Next.js 15.5.6 y Vercel docs (Octubre 2025)
