# 📋 PLAN DE MIGRACIÓN A SERVER ACTIONS (Next.js 15)

## 🎨 ¿CAMBIA EL UI Y ESTILO?

### ❌ NO CAMBIARÍA:
- **Estilos CSS/Tailwind**: Mismo diseño visual, mismos componentes
- **Estructura HTML**: Mismo layout, mismos inputs, mismos botones
- **Animaciones y transiciones**: Todo se mantiene igual
- **Responsive design**: Mismo comportamiento mobile/tablet/desktop
- **Colores, fuentes, espaciado**: Exactamente igual

### ✅ MEJORARÍA (sin cambiar UI visual):
- Loading states más elegantes (sin `toast.loading()`)
- Mejor manejo de errores (usando `useActionState`)
- Validación más robusta (server + client)
- Menos código JavaScript en el cliente

---

## 📐 ARQUITECTURA: ANTES vs DESPUÉS

### ACTUAL (Route Handlers):
```
Client Component (AuditForm.tsx)
  ↓ useState + fetch()
  ↓ POST /api/audit/generate
Route Handler (route.ts)
  ↓ Rate limiting, validation
  ↓ DataForSEO API calls
  ↓ Response JSON
Client Component
  ↓ toast.success/error
  ↓ router.push()
```

### CON SERVER ACTIONS:
```
Client Component (AuditForm.tsx)
  ↓ useActionState
  ↓ form action={generateAudit}
Server Action (actions.ts)
  ↓ Rate limiting, validation
  ↓ DataForSEO API calls
  ↓ Return object
Client Component
  ↓ state.errors (auto)
  ↓ pending (auto)
  ↓ router.push()
```

---

## 🔧 PLAN DE MIGRACIÓN PASO A PASO

### FASE 1: Crear Server Actions

#### 1.1 Crear `apps/web/app/actions/audit.ts`

```typescript
'use server'

import { z } from 'zod'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { fetchWithTimeout } from '@/lib/fetch-with-timeout'
import { headers } from 'next/headers'

const auditSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().optional(),
  placeId: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
})

const DATAFORSEO_BASE_URL = 'https://data.fascinantedigital.com/v3'

type AuditState = {
  errors?: {
    businessName?: string[]
    phone?: string[]
    email?: string[]
    website?: string[]
    category?: string[]
    _form?: string[] // Para errores generales
  }
  auditId?: string
  success?: boolean
}

export async function generateAudit(
  prevState: AuditState,
  formData: FormData
): Promise<AuditState> {
  // 1. Rate limiting (mismo que Route Handler)
  const headersList = await headers()
  const clientIP = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'
  const rateLimit = checkRateLimit(clientIP, 3, 3600000)

  if (rateLimit.rateLimited) {
    return {
      errors: {
        _form: ['Too many audit requests. Please try again later.']
      }
    }
  }

  // 2. Validación con Zod (server-side)
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

  // 3. Llamadas a DataForSEO (mismo código que route.ts)
  try {
    const auditId = generateAuditId()
    // ... lógica existente de route.ts ...

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

---

### FASE 2: Migrar Componente de Formulario

#### 2.1 Modificar `AuditForm.tsx`

**CAMBIOS:**

1. **Reemplazar `useState` + `fetch()` por `useActionState`**:
   ```typescript
   // ANTES:
   const [isProcessing, setIsProcessing] = useState(false)
   const handleSubmit = async (e) => {
     e.preventDefault()
     setIsProcessing(true)
     const response = await fetch(...)
     // ...
   }

   // DESPUÉS:
   import { useActionState } from 'react'
   const [state, formAction, pending] = useActionState(generateAudit, {
     errors: {},
     success: false,
   })

   // pending reemplaza isProcessing automáticamente
   ```

2. **Actualizar el `<form>`**:
   ```typescript
   // ANTES:
   <form onSubmit={handleSubmit}>

   // DESPUÉS:
   <form action={formAction}>
     {/* No necesita onSubmit - Server Action se llama automáticamente */}
   ```

3. **Manejo de errores con `state.errors`**:
   ```typescript
   // ANTES:
   const [errors, setErrors] = useState({})
   {errors.name && <p className="text-red-500">{errors.name}</p>}

   // DESPUÉS:
   {state.errors?.businessName && (
     <p className="text-red-500">{state.errors.businessName[0]}</p>
   )}
   ```

4. **Botón de submit con `useFormStatus`**:
   ```typescript
   // Crear componente separado:
   function SubmitButton({ dict, disabled }: { dict: any, disabled?: boolean }) {
     const { pending } = useFormStatus()

     return (
       <button
         type="submit"
         disabled={pending || disabled}
         className="group w-fit flex items-center py-3 px-6 bg-secondary hover:bg-primary..."
       >
         <span className="text-base text-white font-bold">
           {pending ? (dict.formProcessing || 'Processing...') : (dict.formSubmit || 'Start Audit')}
         </span>
       </button>
     )
   }
   ```

5. **Redirect después de éxito**:
   ```typescript
   // ANTES:
   useEffect(() => {
     if (data.success) {
       setTimeout(() => router.push(...), 1500)
     }
   }, [data.success])

   // DESPUÉS:
   useEffect(() => {
     if (state.success && state.auditId) {
       router.push(`/${locale}/audit/results/${state.auditId}`)
     }
   }, [state.success, state.auditId])
   ```

---

### FASE 3: Mantener Validación Client-Side

**IMPORTANTE**: Mantener validación client-side para UX instantánea:

```typescript
// Validación client-side (se mantiene igual):
const validateStep1 = () => {
  const newErrors = {}
  if (!formData.name.trim()) {
    newErrors.name = "Business name is required."
  }
  // ...
  return isValid
}

// Pero también validamos en server (Zod)
// El server validation actúa como fallback de seguridad
```

---

### FASE 4: Manejo de Rate Limiting

**DESAFÍO**: Rate limiting necesita acceso a request headers.

**SOLUCIÓN**: Usar `headers()` de Next.js:
```typescript
import { headers } from 'next/headers'

export async function generateAudit(prevState, formData) {
  const headersList = await headers()
  const clientIP = headersList.get('x-forwarded-for') ||
                   headersList.get('x-real-ip') ||
                   'unknown'
  // ... rate limiting igual que antes
}
```

---

### FASE 5: Eliminar Route Handler (opcional)

**OPCIÓN A**: Mantener Route Handler para compatibilidad
**OPCIÓN B**: Eliminar `apps/web/app/api/audit/generate/route.ts` después de migrar

---

## 📊 COMPARACIÓN: CÓDIGO ANTES vs DESPUÉS

### ANTES (Route Handler):
```typescript
// AuditForm.tsx - ~350 líneas
const [isProcessing, setIsProcessing] = useState(false)
const [errors, setErrors] = useState({})

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsProcessing(true)

  const loadingToast = toast.loading('Processing...')

  try {
    const response = await fetch(API_ENDPOINTS.audit.generate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (data.success) {
      toast.dismiss(loadingToast)
      toast.success('Success!')
      router.push(...)
    } else {
      throw new Error(data.error)
    }
  } catch (error) {
    toast.dismiss(loadingToast)
    toast.error('Error')
    setIsProcessing(false)
  }
}
```

### DESPUÉS (Server Actions):
```typescript
// AuditForm.tsx - ~280 líneas (menos código)
import { useActionState, useFormStatus } from 'react'
import { generateAudit } from '@/app/actions/audit'

const [state, formAction, pending] = useActionState(generateAudit, {
  errors: {},
  success: false,
})

useEffect(() => {
  if (state.success && state.auditId) {
    router.push(`/${locale}/audit/results/${state.auditId}`)
  }
}, [state.success, state.auditId])

// En el JSX:
<form action={formAction}>
  {/* ... campos ... */}
  {state.errors?.businessName && (
    <p className="text-red-500">{state.errors.businessName[0]}</p>
  )}
  <SubmitButton dict={dict} /> {/* pending automático */}
</form>

// SubmitButton.tsx
function SubmitButton({ dict }) {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? dict.formProcessing : dict.formSubmit}
    </button>
  )
}
```

---

## ✅ VENTAJAS DE LA MIGRACIÓN

1. **Menos código**: ~70 líneas menos por formulario
2. **Mejor UX**: Loading states nativos (sin toasts)
3. **Más seguro**: Validación server-side automática
4. **Type-safe**: Zod garantiza tipos correctos
5. **Progressive Enhancement**: Funciona sin JavaScript
6. **Mejor DX**: Menos boilerplate

---

## ⚠️ CONSIDERACIONES

1. **Multi-step form**: Requiere lógica adicional para manejar paso 1 → paso 2
   - Solución: Validar solo el paso actual antes de avanzar

2. **Google Places Autocomplete**: Se mantiene igual (client-side)

3. **Rate limiting**: Necesita acceso a headers (resuelto con `headers()`)

4. **Migración gradual**: Puedes migrar un formulario a la vez

---

## 🎯 PLAN DE IMPLEMENTACIÓN

### Paso 1: Crear Server Action (sin tocar UI)
- Crear `actions/audit.ts`
- Mover lógica de `route.ts` a Server Action
- Probar con curl/Postman

### Paso 2: Migrar un formulario simple primero
- Empezar con formulario Hero (más simple)
- Verificar que UI no cambia

### Paso 3: Migrar formulario de auditoría
- Formulario multi-step (más complejo)
- Mantener validación client-side + server

### Paso 4: Eliminar Route Handlers (opcional)
- Solo si todo funciona correctamente

---

## 🎨 CONCLUSIÓN SOBRE UI

**✅ EL UI Y ESTILO NO CAMBIAN**

- Mismo diseño visual
- Mismos colores, fuentes, espaciado
- Misma estructura HTML
- Mismos componentes

**📈 MEJORAS INVISIBLES:**
- Loading más elegante (button disabled vs toast)
- Validación más robusta
- Mejor accesibilidad (ARIA automático)
- Funciona sin JavaScript (progressive enhancement)

---

## 📌 RECOMENDACIÓN FINAL

1. **Migrar gradualmente**: Un formulario a la vez
2. **Mantener validación client-side**: UX instantánea
3. **Probar en staging primero**: Verificar comportamiento
4. **No hay prisa**: Sistema actual funciona bien

El cambio es principalmente **arquitectónico**, no visual. El usuario final no notará diferencia en la UI.

