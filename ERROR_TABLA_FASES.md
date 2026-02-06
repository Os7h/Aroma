# ⚠️ ERROR: Tabla no existe

## El Problema

Estás viendo este error porque **no has ejecutado la migración SQL** para crear la tabla de fases de temperatura.

---

## ✅ Solución Rápida

### Paso 1: Abre Supabase

Ve a: **https://app.supabase.com**

### Paso 2: SQL Editor

1. Click en **SQL Editor** (ícono `</>`)
2. Click en **"New query"**

### Paso 3: Copia y Pega este SQL

```sql
CREATE TABLE IF NOT EXISTS ingredient_temperature_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  phase_name varchar(10) NOT NULL,
  temp_start_c integer NOT NULL CHECK (temp_start_c >= 0 AND temp_start_c <= 170 AND temp_start_c % 10 = 0),
  temp_end_c integer NOT NULL CHECK (temp_end_c >= 0 AND temp_end_c <= 170 AND temp_end_c % 10 = 0),
  description_de text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_temp_range CHECK (temp_start_c < temp_end_c),
  CONSTRAINT unique_phase_per_ingredient UNIQUE(ingredient_id, phase_name)
);

CREATE INDEX IF NOT EXISTS idx_ingredient_temperature_phases_ingredient 
  ON ingredient_temperature_phases(ingredient_id);

ALTER TABLE ingredient_temperature_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR DELETE
  USING (auth.role() = 'authenticated');
```

### Paso 4: Ejecuta

Click en **RUN** (o Ctrl+Enter)

### Paso 5: Recarga la App

1. Ve a http://localhost:3001
2. Presiona **F5**
3. Intenta agregar una fase de nuevo

---

## 🎯 Después de Ejecutar

Podrás:
- Agregar fases (A, B, C)
- Definir rangos de temperatura
- Agregar descripciones
- Ver las fases en el termómetro

---

**¿Ejecutaste el SQL?** Avísame si aún tienes errores después de ejecutarlo.
