import { GoogleOAuthConfig, GoogleTokenData, TokenRefreshResponse } from './types'

const GOOGLE_OAUTH_CONFIG: GoogleOAuthConfig = {
  client_id: process.env.GOOGLE_CLIENT_ID!,
  client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
  scope: [
    'https://www.googleapis.com/auth/business.manage',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
}

/**
 * Genera la URL de autorización de Google OAuth
 */
export function generateGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.client_id,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirect_uri,
    response_type: 'code',
    scope: GOOGLE_OAUTH_CONFIG.scope.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    ...(state && { state })
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/**
 * Intercambia el código de autorización por tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<GoogleTokenData> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.client_id,
      client_secret: GOOGLE_OAUTH_CONFIG.client_secret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirect_uri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${error}`)
  }

  const data = await response.json()
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
    scope: data.scope,
    token_type: data.token_type
  }
}

/**
 * Refresca un token de acceso usando el refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TokenRefreshResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.client_id,
      client_secret: GOOGLE_OAUTH_CONFIG.client_secret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token refresh failed: ${error}`)
  }

  return await response.json()
}

/**
 * Obtiene información del perfil de Google Business
 */
export async function getGoogleBusinessProfile(accessToken: string): Promise<GoogleBusinessProfile> {
  // Primero obtenemos la información del usuario
  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!userResponse.ok) {
    throw new Error('Failed to fetch user profile')
  }

  const userData = await userResponse.json()

  // Luego obtenemos la información del negocio
  const businessResponse = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/accounts', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!businessResponse.ok) {
    throw new Error('Failed to fetch business profile')
  }

  const businessData = await businessResponse.json()

  return {
    business_account_id: businessData.accounts?.[0]?.name || userData.id,
    business_name: businessData.accounts?.[0]?.accountName || userData.name,
    access_token: accessToken,
    refresh_token: '', // Se llenará desde la base de datos
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString() // 1 hora por defecto
  }
}
