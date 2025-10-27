import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard/default'

    if (code) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              // No-op for API routes
            },
            remove(name: string, options: any) {
              // No-op for API routes
            },
          },
        }
      )

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        // Crear o actualizar usuario en nuestra tabla personalizada
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
            image: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture,
            updated_at: new Date().toISOString()
          })

        if (upsertError) {
          console.error('Error upserting user:', upsertError)
        }

        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`)
        } else {
          return NextResponse.redirect(`${origin}${next}`)
        }
      }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/dashboard/login/v1?error=auth_callback_error`)
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard/login/v1?error=auth_callback_error`)
  }
}
