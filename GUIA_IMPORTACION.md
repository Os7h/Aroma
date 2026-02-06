# 📊 Guía de Importación de Datos Maestros

## ¿Por qué usar una tabla maestra?

**Ventajas:**
- ✅ **Fácil de editar**: Usa Excel/Google Sheets
- ✅ **Visualización completa**: Ves todos los datos de un ingrediente en una fila
- ✅ **Colaboración**: Múltiples personas pueden editar
- ✅ **Backup simple**: Un solo archivo
- ✅ **Importación automática**: Script hace todo el trabajo

---

## 🚀 Método 1: CSV + Script (Recomendado)

### Paso 1: Preparar el CSV

1. Abre `data/MASTER_DATA_TEMPLATE.csv`
2. Llena los datos (puedes usar Excel o Google Sheets)
3. Guarda como CSV UTF-8

**Estructura de columnas:**

```
ingredient_name_de          → Nombre en alemán
ingredient_name_en          → Nombre en inglés
ingredient_category         → Categoría (Gewürz, Frucht, etc.)

group_1_slot               → Número de slot (1-9)
group_1_descriptor         → Descriptor del grupo
group_1_temp_start         → Temperatura inicio (°C)
group_1_temp_end           → Temperatura fin (°C)
... (hasta group_9_*)

molecule_1_name            → Nombre de la molécula
molecule_1_group           → Número de grupo (1-9)
molecule_1_cas             → Número CAS
molecule_1_note            → Nota descriptiva
... (hasta molecule_20_*)

taste_sweet                → Dulce (0-3)
taste_sour                 → Ácido (0-3)
taste_salty                → Salado (0-3)
taste_bitter               → Amargo (0-3)
taste_umami                → Umami (0-3)

phase_a_name               → Nombre fase A
phase_a_start              → Temperatura inicio fase A
phase_a_end                → Temperatura fin fase A
phase_a_desc               → Descripción fase A
... (phase_b_*, phase_c_*)
```

### Paso 2: Configurar variables de entorno

Crea `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  # ⚠️ IMPORTANTE
```

> **Nota**: Necesitas la `SERVICE_ROLE_KEY` para bypass RLS durante importación.

### Paso 3: Instalar dependencias

```bash
npm install csv-parse tsx
```

### Paso 4: Ejecutar importación

```bash
npx tsx scripts/import-master-data.ts
```

---

## 🌐 Método 2: Google Sheets + Apps Script

### Ventajas
- Edición colaborativa en tiempo real
- Validación de datos con fórmulas
- Interfaz visual más amigable

### Configuración

1. Crea una Google Sheet con las mismas columnas del CSV
2. Usa Google Apps Script para conectar con Supabase API
3. Botón "Importar" ejecuta el script

**Script básico:**

```javascript
function importToSupabase() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // Headers en fila 1
  const headers = data[0];
  
  // Procesar cada fila
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const ingredient = {};
    
    headers.forEach((header, index) => {
      ingredient[header] = row[index];
    });
    
    // Llamar a Supabase API
    sendToSupabase(ingredient);
  }
}

function sendToSupabase(data) {
  const url = 'https://tu-proyecto.supabase.co/rest/v1/ingredients';
  const options = {
    method: 'POST',
    headers: {
      'apikey': 'tu_service_role_key',
      'Authorization': 'Bearer tu_service_role_key',
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(data)
  };
  
  UrlFetchApp.fetch(url, options);
}
```

---

## 📋 Método 3: Excel + Power Query (Avanzado)

Si tienes muchos datos y quieres transformaciones complejas:

1. Usa Excel con Power Query
2. Conecta directamente a Supabase PostgreSQL
3. Mapea columnas y transforma datos
4. Carga directamente

---

## 🎯 Recomendaciones

### Para empezar (< 50 ingredientes)
→ **CSV + Script** (Método 1)

### Para colaboración (equipo)
→ **Google Sheets** (Método 2)

### Para producción (> 100 ingredientes)
→ **Excel + Power Query** (Método 3)

---

## ⚠️ Consideraciones Importantes

1. **Orden de inserción**: El script respeta las dependencias (ingrediente → grupos → moléculas)
2. **IDs automáticos**: Supabase genera los UUIDs
3. **Validación**: Agrega validación en el CSV antes de importar
4. **Backup**: Siempre haz backup de Supabase antes de importar masivamente
5. **RLS**: Usa service role key para bypass durante importación

---

## 🔄 Actualización de datos existentes

Para **actualizar** en lugar de insertar:

```typescript
// En lugar de .insert()
const { data, error } = await supabase
  .from('ingredients')
  .upsert({
    name_de: row.ingredient_name_de,
    // ... otros campos
  }, {
    onConflict: 'name_de' // o el campo único que uses
  });
```

---

## 📊 Ejemplo de CSV completo

Ver `data/MASTER_DATA_TEMPLATE.csv` para un ejemplo con 2 ingredientes completos.

---

## 🆘 Troubleshooting

**Error: "RLS policy violation"**
→ Verifica que estés usando `SUPABASE_SERVICE_ROLE_KEY`

**Error: "Foreign key violation"**
→ Verifica el orden de inserción (ingrediente antes que grupos)

**Error: "CSV parse error"**
→ Asegúrate que el CSV esté en UTF-8 y bien formateado

**Datos duplicados**
→ Usa `upsert` en lugar de `insert`
