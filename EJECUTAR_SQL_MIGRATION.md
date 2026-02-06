# 🔧 SOLUCIÓN: Ejecutar SQL Migration

## ❌ Error Actual

```
Error fetching ingredients: {}
```

**Causa**: Las funciones RPC (`rpc_get_ingredient_profile`, `rpc_get_ingredient_matches`) no existen en Supabase porque **NO has ejecutado el SQL migration**.

---

## ✅ Solución: Ejecutar SQL en Supabase (5 minutos)

### Paso 1: Abrir Supabase Dashboard

1. Ve a: **https://app.supabase.com**
2. Inicia sesión si es necesario
3. Selecciona tu proyecto: **jajfpjkhbuujaggtgkjh**

---

### Paso 2: Abrir SQL Editor

1. En el menú lateral izquierdo, busca el ícono **`</>`** (SQL Editor)
2. Haz click en **SQL Editor**
3. Click en **"New query"** (botón verde arriba a la derecha)

---

### Paso 3: Copiar el Script SQL

1. Abre el archivo: `c:\Users\Os\Documents\AromaExplorer-Circles\lib\supabase\migrations\001_setup.sql`
2. **Selecciona TODO** el contenido (Ctrl+A)
3. **Copia** (Ctrl+C)

**O copia directamente desde aquí:**

```sql
-- ============================================
-- AromaExplorer-Circles Database Setup
-- ============================================

-- 1. Create ingredient_matches table
CREATE TABLE IF NOT EXISTS ingredient_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  target_ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_match UNIQUE(source_ingredient_id, target_ingredient_id),
  CONSTRAINT no_self_match CHECK (source_ingredient_id != target_ingredient_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ingredient_matches_source 
  ON ingredient_matches(source_ingredient_id);
CREATE INDEX IF NOT EXISTS idx_ingredient_matches_target 
  ON ingredient_matches(target_ingredient_id);

-- 2. Update temperature constraints (0-170°C, multiples of 10)
ALTER TABLE ingredient_group_temperature 
  DROP CONSTRAINT IF EXISTS temp_range_fixed;

ALTER TABLE ingredient_group_temperature
  DROP CONSTRAINT IF EXISTS temp_range_valid;

ALTER TABLE ingredient_group_temperature
  DROP CONSTRAINT IF EXISTS temp_multiples_of_10;

ALTER TABLE ingredient_group_temperature
  ADD CONSTRAINT temp_range_valid 
    CHECK (temp_start_c >= 0 AND temp_end_c <= 170 AND temp_start_c < temp_end_c);

ALTER TABLE ingredient_group_temperature
  ADD CONSTRAINT temp_multiples_of_10
    CHECK (temp_start_c % 10 = 0 AND temp_end_c % 10 = 0);

-- 3. RPC: Get ingredient profile with all groups and molecules
CREATE OR REPLACE FUNCTION rpc_get_ingredient_profile(p_ingredient_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'ingredient', (
      SELECT row_to_json(i) 
      FROM ingredients i 
      WHERE i.id = p_ingredient_id
    ),
    'groups', (
      SELECT json_agg(
        json_build_object(
          'slot', ag.slot,
          'id', ag.id,
          'name_de', ag.name_de,
          'descriptor_de', ag.descriptor_de,
          'color_hex', ag.color_hex,
          'molecules', COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', m.id,
                'name_de', m.name_de,
                'descriptors_de', m.descriptors_de,
                'solubility_de', m.solubility_de,
                'is_key', im.is_key,
                'is_tracked', im.is_tracked
              )
            )
            FROM ingredient_molecules im
            JOIN molecules m ON m.id = im.molecule_id
            WHERE im.ingredient_id = p_ingredient_id AND m.group_id = ag.id
          ), '[]'::json),
          'temperature', (
            SELECT row_to_json(igt)
            FROM ingredient_group_temperature igt
            WHERE igt.ingredient_id = p_ingredient_id AND igt.group_id = ag.id
          )
        )
        ORDER BY ag.slot
      )
      FROM aroma_groups ag
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. RPC: Get ingredient matches with target ingredient details
CREATE OR REPLACE FUNCTION rpc_get_ingredient_matches(p_ingredient_id uuid)
RETURNS json AS $$
BEGIN
  RETURN COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', im.id,
        'note', im.note,
        'target_ingredient', json_build_object(
          'id', i.id,
          'name_de', i.name_de
        ),
        'target_active_slots', COALESCE((
          SELECT json_agg(DISTINCT ag.slot ORDER BY ag.slot)
          FROM ingredient_molecules im2
          JOIN molecules m ON m.id = im2.molecule_id
          JOIN aroma_groups ag ON ag.id = m.group_id
          WHERE im2.ingredient_id = i.id
        ), '[]'::json)
      )
    )
    FROM ingredient_matches im
    JOIN ingredients i ON i.id = im.target_ingredient_id
    WHERE im.source_ingredient_id = p_ingredient_id
  ), '[]'::json);
END;
$$ LANGUAGE plpgsql;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE ingredient_matches ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on ingredient_matches"
  ON ingredient_matches FOR SELECT
  USING (true);

-- Allow insert/update/delete only for authenticated users
CREATE POLICY "Allow authenticated insert on ingredient_matches"
  ON ingredient_matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on ingredient_matches"
  ON ingredient_matches FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on ingredient_matches"
  ON ingredient_matches FOR DELETE
  USING (auth.role() = 'authenticated');
```

---

### Paso 4: Pegar y Ejecutar

1. **Pega** el script en el SQL Editor de Supabase (Ctrl+V)
2. Haz click en **"RUN"** (botón verde abajo a la derecha)
   - O presiona `Ctrl + Enter`
3. Espera a que termine (debería tomar ~5 segundos)

---

### Paso 5: Verificar Éxito

Deberías ver un mensaje como:

```
✓ Success. No rows returned
```

O algo similar indicando que se ejecutó correctamente.

---

### Paso 6: Recargar la Aplicación

1. Ve a tu navegador con http://localhost:3001
2. Presiona **F5** para recargar la página
3. Deberías ver la lista de ingredientes: Ajowan, Bärlauch, Kerbel

---

## 🎯 ¿Qué hace este script?

1. **Crea tabla `ingredient_matches`** para matches manuales
2. **Actualiza constraints de temperatura** (0-170°C, múltiplos de 10)
3. **Crea función `rpc_get_ingredient_profile`** para obtener perfiles completos
4. **Crea función `rpc_get_ingredient_matches`** para obtener matches
5. **Configura RLS** (Row Level Security) para la nueva tabla

---

## ❓ Problemas Comunes

### "relation already exists"
**No es problema** - significa que ya ejecutaste parte del script antes. Continúa.

### "permission denied"
**Solución**: Asegúrate de estar en el proyecto correcto (jajfpjkhbuujaggtgkjh)

### El script no se ejecuta
**Solución**: Verifica que copiaste TODO el contenido (141 líneas)

---

## ✅ Después de Ejecutar

1. Recarga http://localhost:3001 (F5)
2. Deberías ver:
   - Lista alfabética con A, B, K
   - 3 ingredientes: Ajowan, Bärlauch, Kerbel
3. Click en "Kerbel" para ver los 9 círculos

---

**¿Ejecutaste el script?** Avísame si ves algún error o si ya funciona.
