#!/bin/bash

# Sentry Configuration Quick Check
# Versión simplificada y más robusta

echo "🔍 Verificando Configuración de Sentry..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌ $2${NC}"
        ((FAIL++))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARN++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Variables de entorno
echo "📋 Variables de Entorno:"
[ -f ".env.local" ] && check "Archivo .env.local existe" "Archivo .env.local no existe"

if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SENTRY_DSN=" .env.local && ! grep "NEXT_PUBLIC_SENTRY_DSN=" .env.local | grep -q "TU_DSN_AQUI"; then
        DSN=$(grep "NEXT_PUBLIC_SENTRY_DSN=" .env.local | sed 's/.*=//' | tr -d ' ')
        if [ -n "$DSN" ] && [ "$DSN" != "" ]; then
            check "NEXT_PUBLIC_SENTRY_DSN configurado" "NEXT_PUBLIC_SENTRY_DSN no configurado"
            info "   DSN: ${DSN:0:60}..."
        else
            warn "NEXT_PUBLIC_SENTRY_DSN vacío"
        fi
    else
        warn "NEXT_PUBLIC_SENTRY_DSN no configurado o tiene placeholder"
    fi

    grep -q "SENTRY_DSN=" .env.local && ! grep "SENTRY_DSN=" .env.local | grep -q "TU_DSN_AQUI" && check "SENTRY_DSN configurado" "SENTRY_DSN no configurado"
fi
echo ""

# 2. Dependencias
echo "📦 Dependencias:"
[ -f "package.json" ] && grep -q "@sentry/nextjs" package.json && check "@sentry/nextjs en package.json" "@sentry/nextjs NO en package.json"
[ -d "node_modules/@sentry/nextjs" ] && check "@sentry/nextjs instalado" "@sentry/nextjs NO instalado (ejecuta: pnpm install)"
echo ""

# 3. Archivos de configuración
echo "📁 Archivos de Configuración:"
[ -f "instrumentation.ts" ] && check "instrumentation.ts existe" "instrumentation.ts NO existe"
[ -f "instrumentation.ts" ] && grep -q "Sentry.init" instrumentation.ts && check "Sentry.init en instrumentation.ts" "Sentry.init NO en instrumentation.ts"
[ -f "instrumentation-client.ts" ] && check "instrumentation-client.ts existe" "instrumentation-client.ts NO existe"
[ -f "instrumentation-client.ts" ] && grep -q "Sentry.init" instrumentation-client.ts && check "Sentry.init en instrumentation-client.ts" "Sentry.init NO en instrumentation-client.ts"
[ -f "app/global-error.tsx" ] && check "global-error.tsx existe" "global-error.tsx NO existe (opcional)"
echo ""

# 4. next.config.ts
echo "⚙️  next.config.ts:"
[ -f "next.config.ts" ] && check "next.config.ts existe" "next.config.ts NO existe"
[ -f "next.config.ts" ] && grep -q "withSentryConfig" next.config.ts && check "withSentryConfig configurado" "withSentryConfig NO configurado"
[ -f "next.config.ts" ] && grep -q "serverExternalPackages" next.config.ts && grep -A 3 "serverExternalPackages" next.config.ts | grep -q "@sentry" && check "serverExternalPackages incluye @sentry" "serverExternalPackages no incluye @sentry"
[ -f "next.config.ts" ] && grep -q "fascinante-digital" next.config.ts && check "Organización configurada" "Organización NO configurada"
[ -f "next.config.ts" ] && grep -q "javascript-nextjs" next.config.ts && check "Proyecto configurado" "Proyecto NO configurado"
echo ""

# 5. Página de prueba
echo "🧪 Página de Prueba:"
[ -f "app/[locale]/(site)/sentry-example-page/page.tsx" ] && check "Página de prueba existe" "Página de prueba NO existe"
echo ""

# Resumen
echo "=========================================="
echo "📊 Resumen:"
echo -e "${GREEN}✅ Pasados: $PASS${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $WARN${NC}"
echo -e "${RED}❌ Fallos: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Configuración completa!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. pnpm dev"
    echo "2. http://localhost:3001/es/sentry-example-page"
    echo "3. https://fascinante-digital.sentry.io/issues/"
    exit 0
else
    echo -e "${RED}⚠️  Hay $FAIL problema(s) que resolver${NC}"
    exit 1
fi
