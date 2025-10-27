import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getGoogleTokens, isTokenExpired } from '@/lib/google/token-manager'

export async function GET(request: NextRequest) {
  try {
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

    // Verificar que el usuario esté autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Obtener tokens de Google
    const { tokens, businessProfile, error } = await getGoogleTokens(user.id)

    if (error) {
      return NextResponse.json({ 
        hasTokens: false, 
        error: error 
      })
    }

    if (!tokens) {
      return NextResponse.json({ 
        hasTokens: false, 
        message: 'No Google tokens found' 
      })
    }

    const isExpired = isTokenExpired(tokens.expires_at)

    return NextResponse.json({
      hasTokens: true,
      isExpired,
      expiresAt: tokens.expires_at,
      businessName: businessProfile?.business_name,
      businessAccountId: businessProfile?.business_account_id,
      message: isExpired ? 'Tokens expired, refresh needed' : 'Tokens valid'
    })
  } catch (error) {
    console.error('Token status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
