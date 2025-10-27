import { createServerClient } from '../supabase/server'
import { GoogleTokenData, GoogleBusinessProfile } from './types'
import { refreshAccessToken } from './oauth'
import { encrypt, decrypt } from '../utils/encryption'

/**
 * Guarda tokens de Google en la base de datos
 */
export async function saveGoogleTokens(
  userId: string,
  tokenData: GoogleTokenData,
  businessProfile: GoogleBusinessProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    // Encriptar tokens sensibles
    const encryptedAccessToken = encrypt(tokenData.access_token)
    const encryptedRefreshToken = encrypt(tokenData.refresh_token)

    const { error } = await supabase
      .from('google_business_tokens')
      .upsert({
        user_id: userId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: tokenData.expires_at,
        business_account_id: businessProfile.business_account_id,
        business_name: businessProfile.business_name,
        updated_at: new Date().toISOString()
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Obtiene tokens de Google para un usuario
 */
export async function getGoogleTokens(userId: string): Promise<{
  tokens: GoogleTokenData | null
  businessProfile: GoogleBusinessProfile | null
  error?: string
}> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('google_business_tokens')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return { tokens: null, businessProfile: null, error: error?.message || 'No tokens found' }
    }

    // Desencriptar tokens
    const decryptedAccessToken = decrypt(data.access_token)
    const decryptedRefreshToken = data.refresh_token ? decrypt(data.refresh_token) : ''

    const tokens: GoogleTokenData = {
      access_token: decryptedAccessToken,
      refresh_token: decryptedRefreshToken,
      expires_at: data.expires_at,
      scope: 'https://www.googleapis.com/auth/business.manage',
      token_type: 'Bearer'
    }

    const businessProfile: GoogleBusinessProfile = {
      business_account_id: data.business_account_id,
      business_name: data.business_name,
      access_token: decryptedAccessToken,
      refresh_token: decryptedRefreshToken,
      expires_at: data.expires_at
    }

    return { tokens, businessProfile, error: undefined }
  } catch (error) {
    return { tokens: null, businessProfile: null, error: (error as Error).message }
  }
}

/**
 * Verifica si un token está expirado
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt) <= new Date()
}

/**
 * Refresca tokens expirados automáticamente
 */
export async function refreshTokensIfNeeded(userId: string): Promise<{
  success: boolean
  tokens?: GoogleTokenData
  error?: string
}> {
  try {
    const { tokens, error } = await getGoogleTokens(userId)

    if (error || !tokens) {
      return { success: false, error: error || 'No tokens found' }
    }

    // Si el token no está expirado, devolverlo tal como está
    if (!isTokenExpired(tokens.expires_at)) {
      return { success: true, tokens }
    }

    // Si no hay refresh token, no se puede refrescar
    if (!tokens.refresh_token) {
      return { success: false, error: 'No refresh token available' }
    }

    // Refrescar el token
    const refreshResponse = await refreshAccessToken(tokens.refresh_token)
    
    const newTokens: GoogleTokenData = {
      access_token: refreshResponse.access_token,
      refresh_token: tokens.refresh_token, // Mantener el refresh token original
      expires_at: new Date(Date.now() + refreshResponse.expires_in * 1000).toISOString(),
      scope: refreshResponse.scope,
      token_type: refreshResponse.token_type
    }

    // Obtener perfil de negocio actualizado
    const businessProfile: GoogleBusinessProfile = {
      business_account_id: '', // Se mantendrá el existente
      business_name: '', // Se mantendrá el existente
      access_token: newTokens.access_token,
      refresh_token: newTokens.refresh_token,
      expires_at: newTokens.expires_at
    }

    // Guardar tokens actualizados
    const saveResult = await saveGoogleTokens(userId, newTokens, businessProfile)
    
    if (!saveResult.success) {
      return { success: false, error: saveResult.error }
    }

    return { success: true, tokens: newTokens }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Elimina tokens de Google para un usuario
 */
export async function deleteGoogleTokens(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase
      .from('google_business_tokens')
      .delete()
      .eq('user_id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
