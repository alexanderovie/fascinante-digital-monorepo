# 🚀 PLAN DE MIGRACIÓN SEGURO - SERVER ACTIONS + SERVER/CLIENT COMPONENTS

## ⚠️ EVALUACIÓN DE RIESGOS

### 🔴 **RIESGO ALTO** (puede romper el sitio):
- Cambiar estructura de componentes existentes
- Modificar lógica de formularios en producción  
- Cambiar manejo de errores
- Multi-step form con Server Actions

### 🟡 **RIESGO MEDIO** (posibles problemas):
- Rate limiting con `headers()` de Next.js
- Google Places Autocomplete con Server Actions
- Context providers con nueva arquitectura

### 🟢 **RIESGO BAJO** (seguro):
- Crear Server Actions nuevas
- Optimizar Server/Client Components
- Mejoras de performance

---

## 📊 PROBABILIDAD DE DAÑAR EL SITIO

| Enfoque | Riesgo | Tiempo | Beneficio |
|---------|--------|--------|-----------|
| **Migración Gradual** | 15-20% | 2-3 días | Medio |
| **Migración Completa** | 40-50% | 1 día | Alto |
| **Sin Migrar** | 0% | 0 días | Ninguno |

---

## 🎯 PLAN RECOMENDADO: MIGRACIÓN GRADUAL Y SEGURA

### **FASE 1: PREPARACIÓN (Riesgo: 5%)**

#### 1.1 Backup y Testing
```bash
# 1. Crear branch de migración
git checkout -b feature/server-actions-migration

# 2. Backup de componentes críticos
cp apps/web/components/Home/Hero/index.tsx apps/web/components/Home/Hero/index.tsx.backup
cp apps/web/components/Audit/Hero/index.tsx apps/web/components/Audit/Hero/index.tsx.backup

# 3. Testing en staging primero
# Deploy a staging environment antes de producción
```

#### 1.2 Instalar dependencias
```bash
# Server Actions no requiere dependencias adicionales
# Solo Next.js 15 (ya lo tienes)
```

---

### **FASE 2: CREAR SERVER ACTIONS (Riesgo: 10%)**

#### 2.1 Crear Server Action para Hero Form
```typescript
// apps/web/app/actions/contact.ts
'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
})

type ContactState = {
  errors?: {
    name?: string[]
    email?: string[]
    services?: string[]
    _form?: string[]
  }
  success?: boolean
}

export async function submitContactForm(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Rate limiting
  const headersList = await headers()
  const clientIP = headersList.get('x-forwarded-for') || 'unknown'
  const rateLimit = checkRateLimit(clientIP, 10, 3600000) // 10 req/hour
  
  if (rateLimit.rateLimited) {
    return {
      errors: {
        _form: ['Too many requests. Please try again later.']
      }
    }
  }

  // Validación
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    services: formData.getAll('services'),
  }

  const validated = contactSchema.safeParse(rawData)
  
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors
    }
  }

  // Lógica existente de route.ts
  try {
    // Mover lógica de apps/web/app/api/contact/route.ts aquí
    const response = await fetch(API_ENDPOINTS.contact, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: validated.data.name,
        email: validated.data.email || undefined,
        message: `Services requested: ${validated.data.services.join(", ")}`,
        service: "Hero Form"
      }),
    })

    const data = await response.json()
    
    if (data.success) {
      return { success: true }
    } else {
      throw new Error(data.error || 'Error al enviar solicitud')
    }
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Error sending request']
      }
    }
  }
}
```

#### 2.2 Crear Server Action para Audit Form
```typescript
// apps/web/app/actions/audit.ts
'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
// ... importar lógica existente de route.ts

const auditSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().optional(),
  placeId: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
})

type AuditState = {
  errors?: {
    businessName?: string[]
    phone?: string[]
    email?: string[]
    website?: string[]
    category?: string[]
    _form?: string[]
  }
  auditId?: string
  success?: boolean
}

export async function generateAudit(
  prevState: AuditState,
  formData: FormData
): Promise<AuditState> {
  // Rate limiting (mismo que route.ts)
  const headersList = await headers()
  const clientIP = headersList.get('x-forwarded-for') || 'unknown'
  const rateLimit = checkRateLimit(clientIP, 3, 3600000) // 3 req/hour
  
  if (rateLimit.rateLimited) {
    return {
      errors: {
        _form: ['Too many audit requests. Please try again later.']
      }
    }
  }

  // Validación
  const rawData = {
    businessName: formData.get('businessName'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    website: formData.get('website'),
    placeId: formData.get('placeId'),
    category: formData.get('category'),
  }

  const validated = auditSchema.safeParse(rawData)
  
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors
    }
  }

  // Mover toda la lógica de apps/web/app/api/audit/generate/route.ts aquí
  try {
    const auditId = generateAuditId()
    // ... lógica existente de DataForSEO ...
    
    return {
      success: true,
      auditId,
    }
  } catch (error) {
    return {
      errors: {
        _form: [error instanceof Error ? error.message : 'Failed to generate audit']
      }
    }
  }
}
```

#### 2.3 Testing de Server Actions
```bash
# Probar Server Actions independientemente
# Crear página de test temporal
```

---

### **FASE 3: MIGRAR FORMULARIO SIMPLE PRIMERO (Riesgo: 20%)**

#### 3.1 Migrar Hero Form (más simple)
```typescript
// apps/web/components/Home/Hero/FormComponent.tsx
'use client'

import { useActionState, useFormStatus } from 'react'
import { submitContactForm } from '@/app/actions/contact'

// Componente para botón de submit
function SubmitButton({ dict }: { dict: any }) {
  const { pending } = useFormStatus()
  
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="group w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary dark:bg-white/25 dark:hover:bg-primary rounded-sm cursor-pointer transition-all duration-300 disabled:opacity-50"
    >
      <span className="text-base text-white group-hover:text-white font-bold">
        {pending ? 'Sending...' : (dict.formSubmit || 'Enviar')}
      </span>
    </button>
  )
}

export default function FormComponent({ dict }: { dict: any }) {
  const [state, formAction, pending] = useActionState(submitContactForm, {
    errors: {},
    success: false,
  })

  // Mantener validación client-side para UX
  const [clientErrors, setClientErrors] = useState({})
  
  const validateForm = () => {
    // ... validación existente ...
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm()) {
      // Server Action se ejecuta automáticamente
    }
  }

  // Redirect después de éxito
  useEffect(() => {
    if (state.success) {
      // ... lógica de redirect existente ...
    }
  }, [state.success])

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Campos existentes */}
      <div className="flex flex-col gap-5">
        <div>
          <input
            type="text"
            name="name"
            placeholder={`${dict.formName || 'Nombre del negocio'} *`}
            className="input-field"
          />
          {/* Mostrar errores de client O server */}
          {(clientErrors.name || state.errors?.name) && (
            <p className="text-red-500 text-sm mt-1">
              {clientErrors.name || state.errors?.name?.[0]}
            </p>
          )}
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            placeholder={dict.formEmail || 'Correo electrónico'}
            className="input-field"
          />
          {(clientErrors.email || state.errors?.email) && (
            <p className="text-red-500 text-sm mt-1">
              {clientErrors.email || state.errors?.email?.[0]}
            </p>
          )}
        </div>
      </div>

      {/* Servicios */}
      <div className="flex flex-col gap-4">
        <p className="font-semibold text-dusty-gray dark:text-white/90">
          {dict.formServices || 'Opciones de servicio'}
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-2.5">
          {['Optimización SEO', 'Google y Meta Ads'].map((title) => (
            <div key={title} className="flex items-center">
              <input
                type="checkbox"
                name="services"
                value={title}
                className="w-5 h-5"
                id={title}
              />
              <label htmlFor={title} className="text-dusty-gray dark:text-white/70 ml-2 cursor-pointer">
                {title}
              </label>
            </div>
          ))}
        </div>
        {(clientErrors.services || state.errors?.services) && (
          <p className="text-red-500 text-sm mt-1">
            {clientErrors.services || state.errors?.services?.[0]}
          </p>
        )}
      </div>

      {/* Errores generales */}
      {state.errors?._form && (
        <div className="text-red-500 text-sm">
          {state.errors._form[0]}
        </div>
      )}

      <SubmitButton dict={dict} />
    </form>
  )
}
```

#### 3.2 Testing del Hero Form
```bash
# 1. Probar en desarrollo
pnpm dev

# 2. Verificar que funciona igual que antes
# 3. Verificar que errores se muestran correctamente
# 4. Verificar que loading funciona
```

---

### **FASE 4: MIGRAR FORMULARIO COMPLEJO (Riesgo: 30%)**

#### 4.1 Migrar Audit Form (multi-step)
```typescript
// apps/web/components/Audit/Hero/AuditForm.tsx
'use client'

import { useActionState, useFormStatus } from 'react'
import { generateAudit } from '@/app/actions/audit'

export default function AuditForm({ dict }: { dict: any }) {
  const [step, setStep] = useState(1)
  const [state, formAction, pending] = useActionState(generateAudit, {
    errors: {},
    success: false,
  })

  // Mantener lógica multi-step
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(1)
  }

  // Redirect después de éxito
  useEffect(() => {
    if (state.success && state.auditId) {
      router.push(`/${locale}/audit/results/${state.auditId}`)
    }
  }, [state.success, state.auditId])

  return (
    <form action={formAction} className="flex flex-col gap-4 md:gap-8">
      {/* Progress Indicator existente */}
      
      {/* Step 1 */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          {/* Campos existentes */}
          <div>
            <input
              type="text"
              name="businessName"
              placeholder={`${dict.formName} *`}
              className="input-field"
            />
            {(clientErrors.name || state.errors?.businessName) && (
              <p className="text-red-500 text-sm mt-1">
                {clientErrors.name || state.errors?.businessName?.[0]}
              </p>
            )}
          </div>
          
          {/* Otros campos... */}
          
          <button type="button" onClick={handleNext}>
            {dict.formNext || 'Continue'}
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          {/* Campos existentes */}
          
          <div className="flex flex-col gap-3">
            <button type="button" onClick={handleBack}>
              {dict.formBack || 'Back'}
            </button>
            
            <SubmitButton dict={dict} />
          </div>
        </div>
      )}
    </form>
  )
}
```

#### 4.2 Testing del Audit Form
```bash
# 1. Probar multi-step
# 2. Verificar Google Places Autocomplete
# 3. Verificar redirect a resultados
# 4. Verificar rate limiting
```

---

### **FASE 5: OPTIMIZACIÓN SERVER/CLIENT (Riesgo: 15%)**

#### 5.1 Separar contenido estático del Hero
```typescript
// apps/web/components/Home/Hero/index.tsx - Server Component
import { FormComponent } from './FormComponent' // Client Component

export default function Hero({ dict }: { dict: any }) {
  return (
    <section>
      <div className="relative pt-24 lg:pt-32">
        <div className="bg-white h-full flex justify-center items-center">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 2xl:gap-32 py-20 items-center lg:items-center justify-between">
              
              {/* Contenido estático - Server Component */}
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col gap-3">
                  <div className="badge">
                    {dict.badge} →
                    <ChevronRight className="ml-1 size-4 text-current" aria-hidden="true" />
                  </div>
                  <h1 className="text-secondary dark:text-white font-semibold min-w-[12ch]">
                    {dict.title}
                  </h1>
                </div>
                <p className="text-secondary dark:text-white text-lg sm:text-xl">
                  {dict.subtitle}
                </p>

                {/* Trust Metrics - Server Component */}
                <div className="hidden md:flex flex-wrap items-center gap-6 md:gap-8 lg:gap-12 mt-8">
                  {/* ... métricas existentes ... */}
                </div>
              </div>

              {/* Formulario - Client Component */}
              <div className="hidden md:block relative bg-white dark:bg-dark-gray rounded-none md:rounded-md max-w-530px lg:max-w-md xl:max-w-530px w-full py-10 sm:px-10 sm:p-10 flex flex-col sm:shadow-2xl sm:shadow-black/10 sm:border sm:border-gray-100 dark:sm:border-gray-700">
                <h4 className="font-semibold dark:text-white mb-6">
                  {toTitleCase(dict.formTitle)}
                </h4>
                <FormComponent dict={dict} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

#### 5.2 Testing de optimización
```bash
# 1. Verificar que UI no cambia
# 2. Medir bundle size
# 3. Verificar performance
```

---

### **FASE 6: CLEANUP (Riesgo: 5%)**

#### 6.1 Eliminar Route Handlers (opcional)
```bash
# Solo después de verificar que todo funciona
rm apps/web/app/api/contact/route.ts
rm apps/web/app/api/audit/generate/route.ts
```

#### 6.2 Testing final
```bash
# 1. Testing completo en staging
# 2. Deploy a producción
# 3. Monitorear errores
```

---

## 🛡️ ESTRATEGIAS DE MITIGACIÓN DE RIESGOS

### 1. **Rollback Plan**
```bash
# Si algo falla, restaurar backups
cp apps/web/components/Home/Hero/index.tsx.backup apps/web/components/Home/Hero/index.tsx
cp apps/web/components/Audit/Hero/index.tsx.backup apps/web/components/Audit/Hero/index.tsx
git checkout main
```

### 2. **Feature Flags**
```typescript
// Usar variable de entorno para alternar entre implementaciones
const USE_SERVER_ACTIONS = process.env.NEXT_PUBLIC_USE_SERVER_ACTIONS === 'true'

if (USE_SERVER_ACTIONS) {
  // Nueva implementación
} else {
  // Implementación actual
}
```

### 3. **Testing Gradual**
- Probar en desarrollo primero
- Probar en staging después
- Deploy a producción solo cuando esté 100% verificado

### 4. **Monitoreo**
- Configurar alertas para errores de formularios
- Monitorear rate limiting
- Verificar que redirects funcionan

---

## 📊 CRONOGRAMA RECOMENDADO

| Fase | Duración | Riesgo | Dependencias |
|------|----------|--------|--------------|
| **Fase 1: Preparación** | 2 horas | 5% | Ninguna |
| **Fase 2: Server Actions** | 4 horas | 10% | Fase 1 |
| **Fase 3: Hero Form** | 3 horas | 20% | Fase 2 |
| **Fase 4: Audit Form** | 4 horas | 30% | Fase 3 |
| **Fase 5: Optimización** | 2 horas | 15% | Fase 4 |
| **Fase 6: Cleanup** | 1 hora | 5% | Fase 5 |

**Total: 16 horas (2 días de trabajo)**

---

## ✅ CHECKLIST DE SEGURIDAD

### Antes de empezar:
- [ ] Backup de componentes críticos
- [ ] Branch de migración creado
- [ ] Testing en staging configurado
- [ ] Plan de rollback definido

### Durante la migración:
- [ ] Probar cada fase antes de continuar
- [ ] Verificar que UI no cambia
- [ ] Verificar que funcionalidad es idéntica
- [ ] Monitorear errores en consola

### Después de cada fase:
- [ ] Testing completo
- [ ] Verificar en múltiples navegadores
- [ ] Verificar en mobile/desktop
- [ ] Verificar rate limiting

### Antes de producción:
- [ ] Testing en staging 100% exitoso
- [ ] Performance igual o mejor
- [ ] Bundle size reducido
- [ ] Plan de rollback probado

---

## 🎯 RECOMENDACIÓN FINAL

### **SÍ MIGRAR** si:
- Tienes tiempo para testing cuidadoso
- Puedes hacer rollback si algo falla
- Quieres mejorar performance y DX

### **NO MIGRAR** si:
- El sitio está funcionando perfectamente
- No tienes tiempo para testing
- Prefieres estabilidad sobre mejoras

### **MIGRACIÓN PARCIAL** (recomendado):
- Migrar solo Hero Form (más simple)
- Mantener Audit Form como está
- Obtener beneficios sin riesgo alto

---

## 📈 BENEFICIOS ESPERADOS

### Inmediatos:
- ✅ Menos código (~70 líneas menos)
- ✅ Loading states más elegantes
- ✅ Validación server-side automática

### A largo plazo:
- ✅ Mejor performance (bundle size)
- ✅ Mejor SEO (Server Components)
- ✅ Mejor DX (menos boilerplate)
- ✅ Progressive enhancement

---

## ⚠️ RIESGOS IDENTIFICADOS

### Críticos:
- Multi-step form con Server Actions
- Google Places Autocomplete
- Rate limiting con headers()

### Mitigables:
- Testing exhaustivo
- Rollback plan
- Feature flags
- Migración gradual

---

## 🎯 CONCLUSIÓN

**Probabilidad de dañar el sitio con migración gradual: 15-20%**

**Probabilidad de dañar el sitio con migración completa: 40-50%**

**Recomendación: Migración gradual con testing exhaustivo**

El plan está diseñado para minimizar riesgos mientras maximiza beneficios. Cada fase es independiente y puede revertirse si hay problemas.

