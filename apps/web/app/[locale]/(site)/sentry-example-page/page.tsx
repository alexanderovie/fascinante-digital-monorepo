'use client';

/**
 * Sentry Test Page
 *
 * Esta página permite probar la integración de Sentry de forma segura.
 * Disponible en: /sentry-example-page
 *
 * Reference: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#verify
 */

import * as Sentry from '@sentry/nextjs';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

interface SentryTestPageProps {
  params: Promise<{ locale: Locale }>;
}

export default function SentryTestPage({ params }: SentryTestPageProps) {
  const [testResults, setTestResults] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Test 1: Capturar un error manualmente
  const testManualError = () => {
    try {
      setTestResults(null);
      Sentry.captureException(new Error('Test error from Sentry Test Page - Manual Error'));
      setTestResults({
        type: 'success',
        message: '✅ Error enviado a Sentry. Revisa https://fascinante-digital.sentry.io/issues/',
      });
    } catch (error) {
      setTestResults({
        type: 'error',
        message: `❌ Error al enviar: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Test 2: Error no manejado
  const testUnhandledError = () => {
    setTestResults(null);
    // Este error será capturado automáticamente por Sentry
    throw new Error('Test error from Sentry Test Page - Unhandled Error');
  };

  // Test 3: Error con contexto adicional
  const testErrorWithContext = () => {
    try {
      setTestResults(null);
      Sentry.withScope((scope) => {
        scope.setTag('test-type', 'contextual-error');
        scope.setLevel('warning');
        scope.setContext('test-context', {
          page: 'sentry-example-page',
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        });
        Sentry.captureException(new Error('Test error with additional context'));
        setTestResults({
          type: 'success',
          message: '✅ Error con contexto enviado. Revisa los detalles en Sentry.',
        });
      });
    } catch (error) {
      setTestResults({
        type: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Test 4: Mensaje personalizado
  const testCustomMessage = () => {
    try {
      setTestResults(null);
      Sentry.captureMessage('Test message from Sentry Test Page', 'info');
      setTestResults({
        type: 'success',
        message: '✅ Mensaje enviado a Sentry como "info".',
      });
    } catch (error) {
      setTestResults({
        type: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  };

  // Test 5: Función no definida (como sugiere Sentry docs)
  const testUndefinedFunction = () => {
    setTestResults(null);
    // @ts-expect-error - Intencional para testing
    myUndefinedFunction();
  };

  // Test 6: Verificar que Sentry está inicializado
  const testSentryStatus = () => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    const isConfigured = !!dsn;

    if (isConfigured) {
      setTestResults({
        type: 'success',
        message: `✅ Sentry configurado correctamente. DSN: ${dsn?.substring(0, 30)}...`,
      });
    } else {
      setTestResults({
        type: 'error',
        message: '❌ Sentry NO está configurado. Verifica NEXT_PUBLIC_SENTRY_DSN en .env.local',
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-secondary rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            🧪 Sentry Test Page
          </h1>
          <p className="text-secondary dark:text-white/80 mb-8">
            Esta página permite probar la integración de Sentry de forma segura.
            Todos los errores de prueba serán enviados a tu proyecto de Sentry.
          </p>

          {/* Status Check */}
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="font-semibold mb-2 dark:text-white">Estado de Configuración</h2>
            <button
              onClick={testSentryStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Verificar Configuración de Sentry
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                testResults.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}
            >
              <p className="font-medium">{testResults.message}</p>
            </div>
          )}

          {/* Test Buttons */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              Pruebas Disponibles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testManualError}
                className="p-4 bg-primary text-white rounded-lg hover:bg-darkPrimary transition-colors text-left"
              >
                <div className="font-semibold mb-1">1. Error Manual</div>
                <div className="text-sm opacity-90">
                  Envía un error usando Sentry.captureException()
                </div>
              </button>

              <button
                onClick={testErrorWithContext}
                className="p-4 bg-primary text-white rounded-lg hover:bg-darkPrimary transition-colors text-left"
              >
                <div className="font-semibold mb-1">2. Error con Contexto</div>
                <div className="text-sm opacity-90">
                  Error con información adicional (tags, context)
                </div>
              </button>

              <button
                onClick={testCustomMessage}
                className="p-4 bg-primary text-white rounded-lg hover:bg-darkPrimary transition-colors text-left"
              >
                <div className="font-semibold mb-1">3. Mensaje Personalizado</div>
                <div className="text-sm opacity-90">
                  Envía un mensaje de información (no error)
                </div>
              </button>

              <button
                onClick={testUndefinedFunction}
                className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left"
              >
                <div className="font-semibold mb-1">4. Función No Definida</div>
                <div className="text-sm opacity-90">
                  Como sugiere la documentación oficial de Sentry
                </div>
              </button>

              <button
                onClick={testUnhandledError}
                className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-left md:col-span-2"
              >
                <div className="font-semibold mb-1">5. Error No Manejado</div>
                <div className="text-sm opacity-90">
                  ⚠️ Esto romperá la página temporalmente (se recargará automáticamente)
                </div>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold mb-2 dark:text-white">📋 Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-secondary dark:text-white/80">
              <li>Haz clic en cualquiera de los botones de prueba arriba</li>
              <li>
                Espera unos segundos y revisa tu proyecto en Sentry:
                <br />
                <a
                  href="https://fascinante-digital.sentry.io/issues/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-darkPrimary"
                >
                  https://fascinante-digital.sentry.io/issues/
                </a>
              </li>
              <li>Deberías ver el error/mensaje aparecer en tu dashboard</li>
              <li>
                Haz clic en el error para ver detalles completos, stack trace, contexto, etc.
              </li>
            </ol>
          </div>

          {/* Quick Links */}
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="https://fascinante-digital.sentry.io/issues/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              📊 Ver Issues en Sentry
            </a>
            <a
              href="https://fascinante-digital.sentry.io/performance/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ⚡ Performance Dashboard
            </a>
            <a
              href="https://fascinante-digital.sentry.io/replays/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              🎬 Session Replays
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
