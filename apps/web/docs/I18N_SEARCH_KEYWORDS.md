# Keywords para Buscar en Next.js.org sobre i18n Moderno (Next.js 15)

## 🎯 Keywords Principales para Next.js.org

### Búsquedas Específicas en nextjs.org/docs:

1. **"App Router internationalization"**
   - Documentación oficial de i18n en App Router
   - Patrones recomendados para Next.js 15+

2. **"Middleware locale detection"**
   - Cómo usar middleware para detectar locale automáticamente
   - Best practices para redirección de locales

3. **"Dynamic routes locale"**
   - Cómo estructurar rutas dinámicas `[locale]`
   - Generación estática con múltiples locales

4. **"generateStaticParams locale"**
   - Pre-renderizar páginas para todos los locales
   - SSG (Static Site Generation) con i18n

5. **"Server Components dictionary"**
   - Cargar diccionarios en Server Components
   - Patrones async/await para diccionarios

6. **"Next.js 15 i18n best practices"**
   - Guías oficiales actualizadas para Next.js 15
   - Comparación con Pages Router (legacy)

7. **"Internationalization App Router"**
   - Documentación completa de i18n en App Router
   - Migración desde Pages Router

8. **"locale routing middleware"**
   - Routing automático basado en headers Accept-Language
   - Manejo de locale por defecto

## 🔍 Búsquedas Específicas en Vercel.com/docs:

1. **"Next.js internationalization deployment"**
   - Configuración de i18n en producción
   - Variables de entorno para locales

2. **"Multi-region deployment i18n"**
   - Deployment en múltiples regiones
   - Edge Functions con i18n

3. **"Vercel i18n routing"**
   - Configuración de rewrites para i18n
   - Headers y routing en Vercel

## 📚 Temas Específicos a Investigar:

### 1. **Dictionary Loading Pattern**
- ✅ Cómo cargar diccionarios en Server Components
- ✅ Lazy loading de diccionarios
- ✅ Type safety para diccionarios
- ✅ Caching de diccionarios

**Keywords:**
- "server-only dictionary"
- "async dictionary loading"
- "type-safe translations"

### 2. **Locale Detection & Routing**
- ✅ Middleware para detección automática
- ✅ Fallback a locale por defecto
- ✅ Preservación de query params en redirects

**Keywords:**
- "middleware locale detection"
- "accept-language header"
- "locale fallback"

### 3. **Static Generation con i18n**
- ✅ `generateStaticParams` con múltiples locales
- ✅ Pre-renderizado de todas las combinaciones
- ✅ ISR (Incremental Static Regeneration) con i18n

**Keywords:**
- "generateStaticParams locale"
- "static generation i18n"
- "ISR internationalization"

### 4. **Metadata y SEO i18n**
- ✅ `generateMetadata` por locale
- ✅ Hreflang tags
- ✅ Canonical URLs por locale

**Keywords:**
- "generateMetadata locale"
- "hreflang tags"
- "canonical URLs i18n"

## 🚀 Mejores Prácticas a Buscar:

1. **"Next.js 15 i18n patterns"**
   - Patrones recomendados oficialmente
   - Server Components + i18n
   - Client Components con i18n

2. **"Type-safe translations Next.js"**
   - Tipos TypeScript para diccionarios
   - Autocomplete de keys de traducción

3. **"Performance i18n Next.js"**
   - Bundle size con múltiples idiomas
   - Code splitting por locale
   - Tree shaking de traducciones

4. **"Testing i18n Next.js"**
   - Tests unitarios con diccionarios
   - E2E tests con múltiples locales

## 📖 URLs Directas para Investigar:

### Next.js Docs:
- `https://nextjs.org/docs/app/building-your-application/routing/internationalization`
- `https://nextjs.org/docs/app/api-reference/functions/generate-static-params`
- `https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config`
- `https://nextjs.org/docs/app/building-your-application/routing/middleware`

### Vercel Docs:
- `https://vercel.com/docs/configuration/routing`
- `https://vercel.com/docs/functions/serverless-functions/runtimes`

## 🎯 Qué Buscar Específicamente:

### 1. **Dictionary Structure Moderna**
Buscar cómo estructurar diccionarios en Next.js 15:
- JSON files vs TypeScript modules
- Nested objects vs flat structure
- Dynamic imports de diccionarios

### 2. **Type Safety**
Buscar patrones para type-safe translations:
- TypeScript interfaces para diccionarios
- Auto-generated types desde JSON
- IntelliSense en VS Code

### 3. **Server vs Client Components**
Buscar cómo manejar i18n en cada tipo:
- Server Components: async dictionary loading
- Client Components: context o props
- Interleaving Server/Client con i18n

### 4. **Performance Optimization**
Buscar optimizaciones específicas:
- Lazy loading de diccionarios
- Code splitting por locale
- Bundle analysis con i18n

## 🔧 Patrones Modernos a Investigar:

### Pattern 1: Server-Only Dictionary Loading
```typescript
// Qué buscar: "server-only dictionary pattern"
import 'server-only'
export async function getDictionary(locale: Locale) {
  return import(`./dictionaries/${locale}.json`)
}
```

### Pattern 2: Type-Safe Dictionary Access
```typescript
// Qué buscar: "type-safe dictionary access"
// Cómo hacer que TypeScript entienda la estructura del diccionario
```

### Pattern 3: Dynamic Route Generation
```typescript
// Qué buscar: "generateStaticParams with locales"
export async function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}
```

## 🎓 Cursos/Guías Recomendados:

1. **Next.js Learn - Internationalization**
   - Curso oficial de Next.js
   - Ejemplos prácticos paso a paso

2. **Vercel Blog - i18n Best Practices**
   - Artículos sobre i18n en producción
   - Case studies reales

3. **Next.js Examples - i18n-routing**
   - Repositorio oficial de ejemplos
   - Código de referencia

---

## 💡 Recomendación Final:

**Búsqueda Principal Recomendada:**
```
"Next.js 15 App Router internationalization best practices"
```

**Búsqueda Secundaria:**
```
"Next.js middleware locale detection server-only dictionary"
```

**Documentación Oficial a Revisar:**
1. `/docs/app/building-your-application/routing/internationalization`
2. `/docs/app/api-reference/functions/generate-static-params`
3. `/docs/app/building-your-application/routing/middleware`
