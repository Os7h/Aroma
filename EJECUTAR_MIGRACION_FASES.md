# 🔧 EJECUTAR MIGRACIÓN SQL - Fases de Temperatura

## ⚠️ IMPORTANTE: Nueva Funcionalidad

Para poder definir fases de temperatura (A, B, C), necesitas ejecutar esta migración SQL.

---

## 📝 Pasos

### 1. Abre Supabase Dashboard

Ve a: **https://app.supabase.com**

### 2. SQL Editor

1. Click en **SQL Editor** (ícono `</>`)
2. Click en **"New query"**

### 3. Copia y Ejecuta este SQL

```sql
-- Create table for ingredient temperature phases
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

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_ingredient_temperature_phases_ingredient 
  ON ingredient_temperature_phases(ingredient_id);

-- Enable Row Level Security
ALTER TABLE ingredient_temperature_phases ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read access on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR SELECT
  USING (true);

-- Allow insert/update/delete only for authenticated users
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

### 4. Click en **RUN** (o Ctrl+Enter)

Deberías ver: `Success. No rows returned`

---

## ✅ Cómo Usar Fases de Temperatura

### 1. Activar Admin Mode

- Click en el switch arriba a la derecha

### 2. Ir a un Ingrediente

- Por ejemplo, Kerbel

### 3. Scroll a "Temperaturentfaltung"

- Verás un botón **"Phasen bearbeiten"**

### 4. Click en "Phasen bearbeiten"

- Se abre un modal

### 5. Agregar Fases

- Click en **"Phase hinzufügen"**
- Define:
  - **Phase-Name**: A, B, C, etc.
  - **Von/Bis**: Rango de temperatura (0-170°C, múltiplos de 10)
  - **Beschreibung**: Opcional, describe el comportamiento
- Click **"Speichern"**

### 6. Editar/Eliminar Fases

- Click en una fase existente para editarla
- Click en el ícono de papelera para eliminarla

---

## 🎯 Ejemplo de Uso

**Ingrediente**: Kerbel

**Fases**:
- **A**: 0-60°C - "Frische Phase - grüne Noten dominieren"
- **B**: 60-120°C - "Entwicklungsphase - würzige Aromen entstehen"
- **C**: 120-170°C - "Intensive Phase - komplexe Aromen"

Estas fases se mostrarán como chips arriba del termómetro, ayudando a entender cómo se comporta el ingrediente en diferentes rangos de temperatura.

---

## 📸 Visualización

Después de definir las fases, verás:

```
┌─────────────────────────────────────────────────────┐
│ Temperaturentfaltung      [Phasen bearbeiten]      │
├─────────────────────────────────────────────────────┤
│ Temperaturphasen:                                   │
│ [A: 0–60°C] [B: 60–120°C] [C: 120–170°C]          │
│ A: Frische Phase - grüne Noten dominieren          │
│ B: Entwicklungsphase - würzige Aromen entstehen    │
│ C: Intensive Phase - komplexe Aromen               │
├─────────────────────────────────────────────────────┤
│ Gruppe 1  [████████░░░░░░] 0-80°C  [Bearbeiten]   │
│ Gruppe 2  [░░░░████████░░] 60-140°C [Bearbeiten]  │
└─────────────────────────────────────────────────────┘
```

---

**¿Ejecutaste el SQL?** Recarga la app y prueba a definir fases para Kerbel.
