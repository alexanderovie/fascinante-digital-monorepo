/**
 * Hook de React para Contexto Automatizado
 * Permite usar contexto fresco en componentes React
 */

import { useCallback, useEffect, useState } from 'react';

interface ContextData {
  source: string;
  data: any;
  timestamp: number;
  cached: boolean;
}

interface ContextResponse {
  contexts: ContextData[];
  cached: boolean;
  timestamp: number;
}

interface UseContextOptions {
  topics?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number; // en milisegundos
}

/**
 * Hook principal para usar contexto automatizado
 */
export function useContext(options: UseContextOptions = {}) {
  const {
    topics = ['nextjs', 'supabase'],
    autoRefresh = false,
    refreshInterval = 300000 // 5 minutos por defecto
  } = options;

  const [context, setContext] = useState<ContextResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContext = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        topics: topics.join(','),
        forceRefresh: forceRefresh.toString()
      });

      const response = await fetch(`/api/context?${params}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setContext(data);

      // Guardar en localStorage para persistencia
      localStorage.setItem('fresh-context', JSON.stringify(data));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching context:', err);
    } finally {
      setLoading(false);
    }
  }, [topics]);

  // Cargar contexto inicial
  useEffect(() => {
    // Intentar cargar desde localStorage primero
    const cachedContext = localStorage.getItem('fresh-context');
    if (cachedContext) {
      try {
        const parsed = JSON.parse(cachedContext);
        setContext(parsed);
      } catch {
        // Si hay error parseando, ignorar y fetch fresco
      }
    }

    // Siempre hacer fetch fresco en el background
    fetchContext();
  }, [fetchContext]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchContext();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchContext]);

  const refreshContext = useCallback(() => {
    return fetchContext(true);
  }, [fetchContext]);

  return {
    context,
    loading,
    error,
    refreshContext,
    isStale: context ? Date.now() - context.timestamp > 3600000 : true // 1 hora
  };
}

/**
 * Hook específico para obtener prompt con contexto
 */
export function useContextPrompt(topics: string[] = ['nextjs', 'supabase']) {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        topics: topics.join(',')
      });

      const response = await fetch(`/api/context/prompt?${params}`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPrompt(data.prompt);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching context prompt:', err);
    } finally {
      setLoading(false);
    }
  }, [topics]);

  useEffect(() => {
    fetchPrompt();
  }, [fetchPrompt]);

  return {
    prompt,
    loading,
    error,
    refreshPrompt: fetchPrompt
  };
}

/**
 * Hook para estadísticas del caché
 */
export function useContextStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/context/stats');

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setStats(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching context stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
}

/**
 * Función utilitaria para refrescar todos los contextos
 */
export async function refreshAllContexts(): Promise<boolean> {
  try {
    const response = await fetch('/api/context/refresh', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Contextos actualizados:', data.message);
    return true;

  } catch (error) {
    console.error('❌ Error actualizando contextos:', error);
    return false;
  }
}

/**
 * Componente de ejemplo para mostrar contexto fresco
 */
export function ContextDisplay({ topics = ['nextjs', 'supabase'] }: { topics?: string[] }) {
  // Para evitar JSX en archivo .ts y cumplir ESLint/TS, el componente de ejemplo
  // retorna null. El ejemplo visual puede moverse a un archivo .tsx si se requiere UI.
  void topics;
  return null;
}
