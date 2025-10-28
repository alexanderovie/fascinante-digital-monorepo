# 🚀 Configuración Google Places API

## ⚡ Setup Rápido

### 1. Obtener API Key de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea o selecciona un proyecto
3. Habilita **Places API (New)**:
   - Navega a "APIs & Services" → "Library"
   - Busca "Places API (New)"
   - Haz click en "Enable"
4. Crea credenciales:
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "API Key"
   - Copia la API key generada

### 2. Configurar Restricciones de Seguridad (Recomendado)

En "APIs & Services" → "Credentials" → [Tu API Key] → "Edit":

**Restricciones de aplicación:**
- HTTP referrers (websites)
- Agrega: `fascinantedigital.com/*`, `*.vercel.app/*` (para staging)

**Restricciones de API:**
- Restrict key → Selecciona solo "Places API (New)"

### 3. Configurar Variable de Entorno

**Local (.env.local)**:
```bash
GOOGLE_PLACES_API_KEY=tu_api_key_aqui
```

**Vercel (Producción)**:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `GOOGLE_PLACES_API_KEY` con tu API key

### 4. Verificar Funcionamiento

1. Inicia el servidor: `pnpm dev`
2. Ve a la homepage
3. Escribe 3+ caracteres en el campo "Nombre del negocio"
4. Deberías ver sugerencias de Google Places

---

## 💰 Costos

- **Autocomplete**: ~$2.83 por 1,000 sesiones
- **Place Details**: ~$3.00 por 1,000 requests

**Estimación mensual conservadora**: ~$13-135 según tráfico

---

## 🔧 Troubleshooting

### Error: "Places API is not configured"
- Verifica que `GOOGLE_PLACES_API_KEY` esté configurada
- Reinicia el servidor después de agregar la variable

### No aparecen sugerencias
- Verifica que Places API (New) esté habilitada
- Revisa la consola del navegador para errores
- Verifica que el API key tenga los permisos correctos

### Error 403 en API
- Verifica restricciones de API key
- Asegúrate que Places API (New) esté habilitada
- Verifica que el dominio esté en la lista de referrers permitidos
