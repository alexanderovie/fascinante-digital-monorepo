import { supabase } from './client'
import { createServerClient } from './server'

export interface User {
  id: string
  email: string
  name?: string
  image?: string
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Inicia sesión con Google OAuth
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}

/**
 * Cierra la sesión del usuario
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}

/**
 * Maneja el callback de OAuth
 */
export async function handleAuthCallback(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error || !data.session) {
      return { user: null, error: error || new Error('No session found') }
    }

    const user: User = {
      id: data.session.user.id,
      email: data.session.user.email!,
      name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
      image: data.session.user.user_metadata?.avatar_url || data.session.user.user_metadata?.picture
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

/**
 * Obtiene la sesión del servidor
 */
export async function getServerSession(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const supabase = createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { user: null, error: error || new Error('No user found') }
    }

    const userData: User = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      image: user.user_metadata?.avatar_url || user.user_metadata?.picture
    }

    return { user: userData, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}
