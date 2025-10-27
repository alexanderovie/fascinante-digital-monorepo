import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from "next/server";

// 1. Especificar rutas protegidas y públicas
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/dashboard/login', '/dashboard/register', '/dashboard/forgot-password']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route))

  // 2. Verificar si Supabase está configurado
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si no hay credenciales de Supabase, permitir acceso sin autenticación
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase not configured - running without authentication')
    return NextResponse.next()
  }

  // Evitar bucles de redirección - si ya estamos en una ruta de login/register, no redirigir
  if (path.includes('/login') || path.includes('/register') || path.includes('/forgot-password')) {
    return NextResponse.next()
  }

  // 3. Crear cliente Supabase para middleware
  const response = NextResponse.next()
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 3. Verificar sesión
  const { data: { session } } = await supabase.auth.getSession()

  // 4. Solo redirigir si es necesario y no causará bucle
  if (path === '/dashboard' && !session) {
    return NextResponse.redirect(new URL('/dashboard/login/v1', request.url))
  }

  if (path === '/' && !session) {
    return NextResponse.redirect(new URL('/dashboard/login/v1', request.url))
  }

  if (path === '/' && session) {
    return NextResponse.redirect(new URL('/dashboard/default', request.url))
  }

  return response
}

// Rutas donde el middleware debe ejecutarse
export const config = {
  matcher: [
    /*
     * MIDDLEWARE DESHABILITADO TEMPORALMENTE
     * Para evitar bucles de redirección
     */
    '/((?!.*).*)', // No matchea ninguna ruta
  ],
}
