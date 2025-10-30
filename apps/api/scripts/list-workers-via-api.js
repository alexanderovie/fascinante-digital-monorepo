#!/usr/bin/env node
/**
 * 🚀 Script Elite: Listar TODOS los Workers de Cloudflare
 * Octubre 2025 - Usando Cloudflare API v4
 * Método alternativo usando Node.js
 */

const https = require('https');

const ACCOUNT_ID = '805bb4fea4f198df0f788aaaad22a1be';
const API_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts`;

// Obtener token de variable de entorno o wrangler
const getToken = () => {
  // 1. Intentar desde variable de entorno
  if (process.env.CLOUDFLARE_API_TOKEN) {
    return process.env.CLOUDFLARE_API_TOKEN;
  }

  // 2. Intentar leer desde wrangler config
  try {
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    const configPath = path.join(os.homedir(), '.wrangler', 'config', 'default.toml');
    
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, 'utf8');
      // Buscar api_token o oauth_token (solo para referencia, wrangler maneja OAuth diferente)
      const tokenMatch = config.match(/api_token\s*=\s*["']([^"']+)["']/);
      if (tokenMatch) {
        return tokenMatch[1];
      }
    }
  } catch (e) {
    // Ignorar errores de lectura
  }

  return null;
};

const makeRequest = (url, token) => {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!json.success) {
            reject(new Error(`API Error: ${JSON.stringify(json.errors)}`));
          } else {
            resolve(json);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Cloudflare usa nanosegundos, convertir a milisegundos
  const ms = Math.floor(timestamp / 1000000);
  return new Date(ms).toISOString().split('T')[0];
};

const main = async () => {
  console.log('🚀 Cloudflare Workers - Lista Completa');
  console.log(`Account ID: ${ACCOUNT_ID}\n`);

  const token = getToken();
  if (!token) {
    console.error('❌ No se encontró CLOUDFLARE_API_TOKEN');
    console.error('\nPara usar este script:');
    console.error('1. Ve a: https://dash.cloudflare.com/profile/api-tokens');
    console.error('2. Crear token con permisos: Account > Workers Scripts > Read');
    console.error('3. Exportar: export CLOUDFLARE_API_TOKEN="tu-token"');
    console.error('4. Ejecutar: node list-workers-via-api.js\n');
    process.exit(1);
  }

  try {
    console.log('✅ Obteniendo lista de workers...\n');
    const response = await makeRequest(API_URL, token);
    const workers = response.result || [];

    console.log(`📊 Total de Workers encontrados: ${workers.length}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('#  Worker Name                              Created                    Modified');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    workers.forEach((worker, index) => {
      const name = worker.id || 'Unknown';
      const created = formatDate(worker.created_on);
      const modified = formatDate(worker.modified_on);
      console.log(`${String(index + 1).padStart(2)}  ${name.padEnd(40)} ${created.padEnd(20)} ${modified}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Detalles Completos (JSON):\n');
    console.log(JSON.stringify(workers.map(w => ({
      name: w.id,
      created_on: w.created_on,
      modified_on: w.modified_on,
      has_routes: w.has_routes || false
    })), null, 2));

    console.log('\n✅ Análisis completado');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

main();


