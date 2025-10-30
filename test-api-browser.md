# 🧪 Prueba Rápida de la API - Desde el Navegador

## ✅ **Forma más fácil: consola del navegador**

### **1. Prueba básica (verificar que funciona)**

Abre DevTools (F12) → Pestaña **Console** y pega:

```javascript
// Prueba básica - debería retornar predicciones
fetch('/api/places/autocomplete?input=restaurant')
  .then(r => r.json())
  .then(data => {
    console.log('✅ Respuesta:', data);
    console.log('Predictions:', data.predictions?.length || 0);
  })
  .catch(err => console.error('❌ Error:', err));
```

**Resultado esperado:** Deberías ver un objeto con `predictions` array.

---

### **2. Ver headers de rate limiting**

```javascript
// Ver headers HTTP
fetch('/api/places/autocomplete?input=restaurant')
  .then(r => {
    console.log('Status:', r.status);
    console.log('X-RateLimit-Limit:', r.headers.get('X-RateLimit-Limit'));
    console.log('X-RateLimit-Remaining:', r.headers.get('X-RateLimit-Remaining'));
    console.log('X-RateLimit-Reset:', r.headers.get('X-RateLimit-Reset'));
    return r.json();
  })
  .then(data => console.log('Data:', data));
```

**Resultado esperado:**
```
Status: 200
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1738123456789
```

---

### **3. Probar rate limiting (hacer 11 requests rápidas)**

```javascript
// Hacer 11 requests para activar rate limit
const testRateLimit = async () => {
  for (let i = 1; i <= 11; i++) {
    const res = await fetch('/api/places/autocomplete?input=restaurant');
    const data = await res.json();

    const remaining = res.headers.get('X-RateLimit-Remaining');
    const limit = res.headers.get('X-RateLimit-Limit');

    if (res.status === 429) {
      console.log(`❌ Request ${i}: RATE LIMITED`);
      console.log('Error:', data.error);
      console.log('Message:', data.message);
      console.log('Remaining: 0');
      break;
    } else {
      console.log(`✅ Request ${i}: OK - Remaining: ${remaining}/${limit}`);
    }

    // Esperar 200ms entre requests
    await new Promise(r => setTimeout(r, 200));
  }
};

testRateLimit();
```

**Resultado esperado:**
- Requests 1-10: ✅ OK con `Remaining` disminuyendo (9, 8, 7...)
- Request 11: ❌ Status 429 con mensaje "Rate limit exceeded"

---

### **4. Probar validación (input muy corto)**

```javascript
// Debe fallar con error 400
fetch('/api/places/autocomplete?input=ab')
  .then(r => r.json())
  .then(data => {
    if (data.error) {
      console.log('✅ Validación funciona:', data.error);
    } else {
      console.log('⚠️ No se validó correctamente');
    }
  });
```

**Resultado esperado:**
```json
{
  "error": "Input must be at least 3 characters long"
}
```

---

### **5. Ver en Network Tab (más visual)**

1. Abre DevTools (F12)
2. Ve a pestaña **Network**
3. Busca el endpoint `/api/places/autocomplete`
4. Haz click en la request
5. Ve a pestaña **Headers**
6. Busca en **Response Headers**:
   - `X-RateLimit-Limit: 10`
   - `X-RateLimit-Remaining: 9`
   - `X-RateLimit-Reset: [timestamp]`

---

## 🌐 **Probar en Producción**

Si estás en `https://fascinantedigital.com`, usa las URLs completas:

```javascript
fetch('https://fascinantedigital.com/api/places/autocomplete?input=restaurant')
  .then(r => r.json())
  .then(console.log);
```

---

## 📝 **Script Completo de Prueba**

Copia y pega esto en la consola del navegador:

```javascript
(async () => {
  console.log('🧪 Iniciando pruebas de API...\n');

  // Test 1: Respuesta básica
  console.log('1️⃣ Test: Respuesta básica');
  const res1 = await fetch('/api/places/autocomplete?input=restaurant');
  const data1 = await res1.json();
  console.log('Status:', res1.status);
  console.log('Predictions:', data1.predictions?.length || 0);
  console.log('Headers:', {
    limit: res1.headers.get('X-RateLimit-Limit'),
    remaining: res1.headers.get('X-RateLimit-Remaining'),
  });
  console.log('');

  // Test 2: Validación
  console.log('2️⃣ Test: Validación (input corto)');
  const res2 = await fetch('/api/places/autocomplete?input=ab');
  const data2 = await res2.json();
  console.log('Status:', res2.status);
  console.log('Error:', data2.error || 'OK');
  console.log('');

  // Test 3: Rate limiting
  console.log('3️⃣ Test: Rate limiting (5 requests)');
  for (let i = 1; i <= 5; i++) {
    const r = await fetch('/api/places/autocomplete?input=test' + i);
    const remaining = r.headers.get('X-RateLimit-Remaining');
    console.log(`Request ${i}: ${r.status} - Remaining: ${remaining}`);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n✅ Pruebas completadas');
})();
```

---

## 🔍 **Verificar que todo funciona**

✅ **API responde:** Deberías ver predicciones de lugares
✅ **Rate limiting activo:** Headers `X-RateLimit-*` presentes
✅ **Validación funciona:** Input corto retorna error 400
✅ **Rate limit bloquea:** Después de 10 requests, el 11º retorna 429
