#!/bin/bash

# Sentry Configuration Analyzer
# Verifica toda la configuración de Sentry mediante CLI

set -e

echo "🔍 Analizando Configuración de Sentry..."
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. Check if .env.local exists
echo "📋 1. Verificando Variables de Entorno..."
if [ -f ".env.local" ]; then
    check_pass "Archivo .env.local existe"

    # Check DSN variables
    if grep -q "NEXT_PUBLIC_SENTRY_DSN=" .env.local; then
        DSN=$(grep "NEXT_PUBLIC_SENTRY_DSN=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        if [[ "$DSN" == *"TU_DSN_AQUI"* ]] || [[ -z "$DSN" ]]; then
            check_fail "NEXT_PUBLIC_SENTRY_DSN no está configurado (aún tiene placeholder)"
        else
            check_pass "NEXT_PUBLIC_SENTRY_DSN está configurado"
            info "   DSN: ${DSN:0:50}..."

            # Validate DSN format (simplified regex)
            if [[ "$DSN" =~ ^https://.*@o[0-9]+\..*sentry\.io/[0-9]+$ ]]; then
                check_pass "Formato de DSN es válido"
            else
                check_warn "Formato de DSN puede ser inválido"
            fi
        fi
    else
        check_fail "NEXT_PUBLIC_SENTRY_DSN no encontrado en .env.local"
    fi

    if grep -q "SENTRY_DSN=" .env.local; then
        SERVER_DSN=$(grep "SENTRY_DSN=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        if [[ "$SERVER_DSN" == *"TU_DSN_AQUI"* ]] || [[ -z "$SERVER_DSN" ]]; then
            check_fail "SENTRY_DSN no está configurado (aún tiene placeholder)"
        else
            check_pass "SENTRY_DSN está configurado"
        fi
    else
        check_warn "SENTRY_DSN no encontrado (puede usar NEXT_PUBLIC_SENTRY_DSN como fallback)"
    fi
else
    check_fail "Archivo .env.local no existe"
    info "   Crea el archivo con: cp .env.local.example .env.local"
fi

echo ""

# 2. Check package.json for Sentry
echo "📦 2. Verificando Dependencias..."
if [ -f "package.json" ]; then
    if grep -q "@sentry/nextjs" package.json; then
        SENTRY_VERSION=$(grep "@sentry/nextjs" package.json | sed 's/.*"@sentry\/nextjs": "\([^"]*\)".*/\1/')
        check_pass "@sentry/nextjs está instalado (versión: $SENTRY_VERSION)"
    else
        check_fail "@sentry/nextjs no está en package.json"
    fi
else
    check_fail "package.json no encontrado"
fi

echo ""

# 3. Check configuration files
echo "📁 3. Verificando Archivos de Configuración..."

# Check instrumentation.ts
if [ -f "instrumentation.ts" ]; then
    check_pass "instrumentation.ts existe"

    if grep -q "Sentry.init" instrumentation.ts; then
        check_pass "Sentry.init encontrado en instrumentation.ts"
    else
        check_warn "Sentry.init no encontrado en instrumentation.ts"
    fi

    if grep -q "onRequestError" instrumentation.ts; then
        check_pass "onRequestError hook configurado"
    else
        check_warn "onRequestError hook no encontrado (recomendado para Next.js 15)"
    fi
else
    check_fail "instrumentation.ts no existe"
fi

# Check instrumentation-client.ts
if [ -f "instrumentation-client.ts" ]; then
    check_pass "instrumentation-client.ts existe"

    if grep -q "Sentry.init" instrumentation-client.ts; then
        check_pass "Sentry.init encontrado en instrumentation-client.ts"
    else
        check_warn "Sentry.init no encontrado en instrumentation-client.ts"
    fi

    if grep -q "onRouterTransitionStart" instrumentation-client.ts; then
        check_pass "onRouterTransitionStart exportado"
    else
        check_warn "onRouterTransitionStart no encontrado (recomendado para tracking de navegación)"
    fi
else
    check_fail "instrumentation-client.ts no existe"
fi

# Check global-error.tsx
if [ -f "app/global-error.tsx" ]; then
    check_pass "app/global-error.tsx existe"

    if grep -q "Sentry.captureException" app/global-error.tsx; then
        check_pass "Sentry.captureException encontrado en global-error.tsx"
    else
        check_warn "Sentry.captureException no encontrado en global-error.tsx"
    fi
else
    check_warn "app/global-error.tsx no existe (opcional pero recomendado)"
fi

# Check sentry config files (should NOT exist - deprecated)
if [ -f "sentry.client.config.ts" ] || [ -f "sentry.server.config.ts" ] || [ -f "sentry.edge.config.ts" ]; then
    check_warn "Archivos legacy de Sentry encontrados (deben migrarse a instrumentation.ts)"
    [ -f "sentry.client.config.ts" ] && info "   - sentry.client.config.ts (deprecated)"
    [ -f "sentry.server.config.ts" ] && info "   - sentry.server.config.ts (deprecated)"
    [ -f "sentry.edge.config.ts" ] && info "   - sentry.edge.config.ts (deprecated)"
else
    check_pass "No hay archivos legacy de Sentry (correcto para Next.js 15)"
fi

echo ""

# 4. Check next.config.ts
echo "⚙️  4. Verificando next.config.ts..."
if [ -f "next.config.ts" ]; then
    check_pass "next.config.ts existe"

    if grep -q "withSentryConfig" next.config.ts; then
        check_pass "withSentryConfig encontrado"
    else
        check_fail "withSentryConfig no encontrado en next.config.ts"
    fi

    if grep -q "serverExternalPackages" next.config.ts; then
        if grep -A 5 "serverExternalPackages" next.config.ts | grep -q "@sentry"; then
            check_pass "serverExternalPackages incluye @sentry"
        else
            check_warn "serverExternalPackages existe pero no incluye @sentry"
        fi
    else
        check_warn "serverExternalPackages no encontrado (recomendado para Next.js 15)"
    fi

    if grep -q "org.*fascinante-digital" next.config.ts || grep -q '"org".*"fascinante-digital"' next.config.ts; then
        check_pass "Organización configurada correctamente"
    else
        check_warn "Organización puede no estar configurada"
    fi

    if grep -q "project.*javascript-nextjs" next.config.ts || grep -q '"project".*"javascript-nextjs"' next.config.ts; then
        check_pass "Proyecto configurado correctamente"
    else
        check_warn "Proyecto puede no estar configurado"
    fi
else
    check_fail "next.config.ts no existe"
fi

echo ""

# 5. Check if Sentry test page exists
echo "🧪 5. Verificando Página de Prueba..."
if [ -f "app/[locale]/(site)/sentry-example-page/page.tsx" ]; then
    check_pass "Página de prueba existe"
    info "   URL: /es/sentry-example-page o /en/sentry-example-page"
else
    check_warn "Página de prueba no encontrada (opcional pero útil)"
fi

echo ""

# 6. Check node_modules (optional - can skip if slow)
echo "📚 6. Verificando Instalación..."
if [ -d "node_modules/@sentry/nextjs" ]; then
    check_pass "@sentry/nextjs está instalado en node_modules"
else
    check_fail "@sentry/nextjs no está instalado. Ejecuta: pnpm install"
fi

echo ""

# 7. Summary
echo "=========================================="
echo "📊 Resumen:"
echo -e "${GREEN}✅ Pasados: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Advertencias: $WARNINGS${NC}"
echo -e "${RED}❌ Fallos: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ¡Configuración completa!${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Inicia el servidor: pnpm dev"
    echo "2. Visita: http://localhost:3001/es/sentry-example-page"
    echo "3. Prueba enviando un error"
    echo "4. Revisa: https://fascinante-digital.sentry.io/issues/"
    exit 0
else
    echo -e "${RED}⚠️  Hay problemas que necesitan resolverse${NC}"
    exit 1
fi
