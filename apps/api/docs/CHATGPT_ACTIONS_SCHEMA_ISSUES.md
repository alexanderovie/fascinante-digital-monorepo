# 🔍 Análisis: Problemas Schema OpenAPI en ChatGPT Actions
## Octubre 2025 - Investigación Context7

---

## **PROBLEMAS IDENTIFICADOS:**

### **1. Headers como Parameters son Ignorados**

**Error:**
```
parameter X-User-Plan has location header; ignoring
parameter X-Force-Refresh has location header; ignoring
```

**Causa:**
- ChatGPT Actions **no soporta headers personalizados** como parámetros en OpenAPI schema
- ChatGPT Actions tiene limitaciones conocidas con headers custom
- Los headers deben manejarse de otra manera o documentarse en instrucciones

**Solución aplicada:**
- ✅ **Eliminar headers de `parameters`** completamente
- ✅ **Documentar en instrucciones** que los headers se manejan automáticamente
- ✅ **Mantener response headers** (esos SÍ funcionan)

---

### **2. Schemas de Respuesta Vacíos**

**Error:**
```
object schema missing properties
```

**Causa:**
- OpenAPI requiere que schemas tengan propiedades definidas o `additionalProperties`
- ChatGPT Actions valida estrictamente los schemas

**Solución aplicada:**
- ✅ **Agregar `additionalProperties: true`** a todos los response schemas
- ✅ **Agregar `description`** para claridad

---

## **MEJORES PRÁCTICAS (Octubre 2025):**

### **Para Headers Personalizados:**

**❌ NO HACER:**
```json
"parameters": [
  {
    "name": "X-User-Plan",
    "in": "header",  // ChatGPT ignora esto
    ...
  }
]
```

**✅ HACER:**
1. **Eliminar headers de parameters**
2. **Documentar en descripción del endpoint:**
   ```json
   "description": "Endpoint description. Headers X-User-Plan y X-Force-Refresh se manejan automáticamente por el proxy."
   ```
3. **O manejarlos en instrucciones del GPT:**
   ```
   Siempre enviar headers: X-User-Plan: free en todas las llamadas
   ```

---

### **Para Response Schemas:**

**❌ NO HACER:**
```json
"schema": {
  "type": "object"  // Faltan propiedades
}
```

**✅ HACER:**
```json
"schema": {
  "type": "object",
  "additionalProperties": true,  // Permite cualquier estructura
  "description": "Descripción del contenido"
}
```

---

## **SCHEMA CORREGIDO (Versión Final):**

### **Cambios Clave:**

1. ✅ **Eliminados `parameters` de headers** en todos los endpoints
2. ✅ **Response headers mantenidos** (funcionan correctamente)
3. ✅ **Todos los schemas con `additionalProperties: true`**
4. ✅ **Descripciones mejoradas** mencionando headers automáticos
5. ✅ **Response codes completos** (200, 404, 429, 500)

---

## **ALTERNATIVAS PARA HEADERS:**

### **Opción 1: Headers en Instrucciones (Recomendado)**
```
Siempre usar headers en todas las llamadas:
- X-User-Plan: free
- X-Force-Refresh: false
```

**Ventaja:** ChatGPT enviará los headers automáticamente si están en instrucciones.

---

### **Opción 2: Headers Automáticos en Proxy**
Configurar el proxy para agregar headers automáticamente basado en el origen de la request.

**Ventaja:** No requiere configuración en ChatGPT.

---

### **Opción 3: Query Parameters (NO Recomendado)**
```
?user_plan=free&force_refresh=false
```

**Desventaja:** Menos estándar, más visible en URLs.

---

## **VERIFICACIÓN FINAL:**

### **Schema debe cumplir:**
- [x] Sin headers en `parameters` ✅
- [x] Response headers definidos en `components/headers` ✅
- [x] Todos los schemas con `additionalProperties: true` ✅
- [x] Response codes 200, 404, 429, 500 ✅
- [x] Enum en `language_code` ✅
- [x] Ejemplos en campos clave ✅

---

## **CONCLUSIÓN:**

**ChatGPT Actions tiene limitaciones conocidas:**
- ❌ No soporta headers personalizados como parameters
- ✅ SÍ soporta response headers
- ✅ Requiere schemas completos (con additionalProperties)

**Solución implementada:**
- Headers se documentan en instrucciones del GPT
- Response headers funcionan correctamente
- Schema validado y funcional

---

**Última actualización:** Octubre 2025  
**Enfoque:** Limitarse a funcionalidades soportadas por ChatGPT Actions


