# Plan de Implementación i18n - Next.js 15 (Octubre 2025)
## Fascinante Digital - Arquitectura Elite

### 📋 Resumen Ejecutivo

Implementación completa de internacionalización (i18n) siguiendo las mejores prácticas oficiales de Next.js 15.5.6, usando App Router con Server Components, routing sub-path (/es, /en), y detección automática de locale via middleware.

---

## 🎯 Objetivos

1. ✅ Soporte multiidioma: Español (es) e Inglés (en)
2. ✅ Routing internacionalizado: `/es/`, `/en/`
3. ✅ Detección automática de locale desde navegador
4. ✅ Server Components para optimización (zero JS bundle)
5. ✅ Static generation para todas las rutas
6. ✅ SEO optimizado con hreflang
7. ✅ Type-safe translations con TypeScript

---

## 🏗️ Arquitectura Propuesta

### Estructura de Directorios

```
apps/web/
├── app/
│   ├── [locale]/                    # ✨ NUEVO: Rutas localizadas
│   │   ├── layout.tsx               # Layout con lang dinámico
│   │   ├── page.tsx                 # Home localizada
│   │   ├── (site)/                  # Rutas del sitio
│   │   │   ├── about-us/
│   │   │   ├── contact-us/
│   │   │   ├── services/
│   │   │   └── ...
│   │   ├── dictionaries/            # ✨ NUEVO: Diccionarios
│   │   │   ├── en.json
│   │   │   ├── es.json
│   │   │   └── index.ts             # getDictionary function
│   │   └── not-found.tsx
│   ├── middleware.ts                # ✨ NUEVO: Detección de locale
│   ├── api/                         # APIs sin localización
│   └── robots.ts                    # Actualizar con locales
├── lib/
│   └── i18n.ts                      # ✨ NUEVO: Configuración i18n
└── types/
    └── i18n.d.ts                    # ✨ NUEVO: Tipos TypeScript
```

---

## 📦 Dependencias Necesarias

```json
{
  "@formatjs/intl-localematcher": "^0.5.5",
  "negotiator": "^0.6.3"
}
```

**Razón**: Librerías oficiales recomendadas por Next.js para matching de locales.

---

## 🚀 Plan de Implementación (Fases)

### **FASE 1: Configuración Base** ⚙️

#### 1.1 Instalar dependencias
```bash
cd apps/web
pnpm add @formatjs/intl-localematcher negotiator
pnpm add -D @types/negotiator
```

#### 1.2 Crear configuración i18n
**Archivo**: `apps/web/lib/i18n.ts`
```typescript
export const locales = ['en', 'es'] as const
export const defaultLocale = 'en' as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}
```

#### 1.3 Crear tipos TypeScript
**Archivo**: `apps/web/types/i18n.d.ts`
```typescript
import type { Locale } from '@/lib/i18n'

declare global {
  interface LocaleParams {
    params: Promise<{ locale: Locale }>
  }
}

export {}
```

---

### **FASE 2: Middleware para Detección de Locale** 🔍

#### 2.1 Crear middleware
**Archivo**: `apps/web/middleware.ts`

**Características**:
- Detección automática desde `Accept-Language` header
- Redirección a `/locale/path`
- Preservar query params
- Skip API routes y static files

**Archivos afectados**:
- ✨ `apps/web/middleware.ts` (nuevo)

---

### **FASE 3: Reestructuración de Rutas** 📁

#### 3.1 Mover estructura actual a `[locale]`

**Rutas a migrar**:
- `app/page.tsx` → `app/[locale]/page.tsx`
- `app/(site)/*` → `app/[locale]/(site)/*`
- `app/layout.tsx` → `app/[locale]/layout.tsx`
- Mover archivos estáticos (sitemap, robots) si es necesario

#### 3.2 Actualizar imports en todos los componentes
- Buscar y reemplazar rutas absolutas
- Actualizar links para incluir locale

**Archivos afectados**:
- Todos los componentes que usan `Link` o `useRouter`
- `components/Layout/Header/Menudata.tsx`
- Todos los componentes de navegación

---

### **FASE 4: Sistema de Diccionarios** 📚

#### 4.1 Crear estructura de diccionarios
**Archivo**: `apps/web/app/[locale]/dictionaries/index.ts`

**Patrón**:
```typescript
import 'server-only'

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  es: () => import('./es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

#### 4.2 Crear archivos JSON de traducción
**Archivos**:
- `apps/web/app/[locale]/dictionaries/en.json`
- `apps/web/app/[locale]/dictionaries/es.json`

**Estructura sugerida**:
```json
{
  "navigation": {
    "home": "Home",
    "about": "About us",
    "services": "Services",
    "contact": "Contact us"
  },
  "hero": {
    "title": "Ambitious Digital Growth and Branding",
    "subtitle": "We build bilingual marketing systems...",
    "cta": "Get started today"
  },
  "common": {
    "loading": "Loading...",
    "error": "Something went wrong"
  }
}
```

#### 4.3 Generar tipos TypeScript desde JSON
**Archivo**: `apps/web/app/[locale]/dictionaries/types.ts`

Usar herramienta como `json-schema-to-typescript` para type-safety.

---

### **FASE 5: Actualizar Layout y Páginas** 🎨

#### 5.1 Root Layout con locale dinámico
**Archivo**: `apps/web/app/[locale]/layout.tsx`

**Características**:
- `generateStaticParams` para pre-renderizar `en` y `es`
- `lang` attribute dinámico en `<html>`
- Metadata localizada
- Cargar diccionario y pasar a context

#### 5.2 Actualizar páginas para usar diccionarios
**Ejemplo**: `apps/web/app/[locale]/page.tsx`

```typescript
import { getDictionary } from './dictionaries'

export default async function Home({ params }: LocaleParams) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return <HeroSection dict={dict.hero} />
}
```

#### 5.3 Crear componentes client para navegación
**Archivo**: `apps/web/components/i18n/LocaleSwitcher.tsx`

Para cambiar idioma en tiempo real.

---

### **FASE 6: Actualizar Componentes** 🧩

#### 6.1 Componentes a actualizar
- `components/Layout/Header/index.tsx` - Usar dict
- `components/Home/Hero/index.tsx` - Traducir textos
- `components/Layout/Footer/index.tsx` - Traducir links
- Todos los componentes con texto hardcodeado

#### 6.2 Patrón de actualización
```typescript
// Antes
<h1>Welcome</h1>

// Después (Server Component)
interface Props {
  dict: Dictionary['hero']
}
export default function Hero({ dict }: Props) {
  return <h1>{dict.title}</h1>
}
```

---

### **FASE 7: SEO y Metadata** 🔍

#### 7.1 Generar metadata localizada
**Archivo**: `apps/web/app/[locale]/layout.tsx`

```typescript
export async function generateMetadata({ params }: LocaleParams) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    alternates: {
      canonical: `https://fascinantedigital.com/${locale}`,
      languages: {
        'en': 'https://fascinantedigital.com/en',
        'es': 'https://fascinantedigital.com/es',
      },
    },
  }
}
```

#### 7.2 Actualizar sitemap
**Archivo**: `apps/web/app/sitemap.ts`

Generar entradas para cada locale:
```typescript
const locales = ['en', 'es']
const routes = ['', '/about-us', '/services', ...]

return locales.flatMap(locale =>
  routes.map(route => ({
    url: `https://fascinantedigital.com/${locale}${route}`,
    alternates: {
      languages: Object.fromEntries(
        locales.map(l => [l, `https://fascinantedigital.com/${l}${route}`])
      ),
    },
  }))
)
```

#### 7.3 Actualizar robots.txt
Considerar si necesitamos diferentes robots por locale.

---

### **FASE 8: Testing y Validación** ✅

#### 8.1 Tests a realizar
- [ ] Redirección automática funciona
- [ ] Rutas `/en/` y `/es/` renderizan correctamente
- [ ] Cambio de idioma funciona
- [ ] SEO metadata correcto
- [ ] Links internos incluyen locale
- [ ] Static generation funciona
- [ ] Build production sin errores

#### 8.2 Validaciones
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Bundle size no incrementa (Server Components)
- [ ] Performance metrics OK

---

## 🔧 Configuraciones Adicionales

### next.config.ts
```typescript
const nextConfig = {
  // ... existing config
  // i18n config ya no se usa en App Router
}
```

### tsconfig.json
Asegurar que paths estén configurados:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📊 Métricas de Éxito

1. **Performance**: Bundle size no incrementa (solo Server Components)
2. **SEO**: hreflang tags correctos en todas las páginas
3. **UX**: Detección automática de idioma funciona
4. **Maintainability**: Type-safe translations
5. **Coverage**: 100% de textos traducidos

---

## 🚨 Consideraciones Importantes

### Breaking Changes
- ⚠️ Todas las URLs cambiarán: `/about-us` → `/en/about-us`
- ⚠️ Necesitamos redirects 301 para URLs antiguas (Vercel/nginx)
- ⚠️ APIs externas deben actualizar URLs

### Migración Gradual
- Opción A: Implementación completa (recomendado)
- Opción B: Feature flag para habilitar/deshabilitar

### Contenido Dinámico
- APIs deben retornar contenido localizado
- Formularios con validación por idioma
- Emails transaccionales localizados

---

## 📚 Recursos y Referencias

- [Next.js 15 i18n Docs](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [formatjs/intl-localematcher](https://formatjs.io/docs/polyfills/intl-localematcher/)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

---

## 🎯 Próximos Pasos

1. Revisar y aprobar plan
2. Crear branch: `feat/i18n-implementation`
3. Ejecutar FASE 1-8 en orden
4. Testing completo
5. Deploy a staging
6. Validación final
7. Deploy a production con redirects

---

## ⏱️ Estimación de Tiempo

- **FASE 1**: 30 min
- **FASE 2**: 1 hora
- **FASE 3**: 2-3 horas
- **FASE 4**: 2-3 horas (incluye traducciones)
- **FASE 5**: 2 horas
- **FASE 6**: 4-6 horas
- **FASE 7**: 1-2 horas
- **FASE 8**: 2 horas

**Total estimado**: 15-20 horas de desarrollo

---

**Creado**: Octubre 2025
**Versión**: 1.0
**Next.js**: 15.5.6
**Status**: Plan aprobado para implementación

