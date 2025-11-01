#!/bin/bash
# Script para matar procesos en el puerto 3001

PORT=3001

echo "🔍 Checking port $PORT..."

# Intentar matar procesos en el puerto
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "⚠️  Found processes on port $PORT, killing them..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
fi

# Verificar que el puerto esté libre
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "❌ Port $PORT is still in use"
    exit 1
else
    echo "✅ Port $PORT is now free"
    exit 0
fi
