# 🔧 SOLUCIÓN: Error de RLS (Row Level Security)

## El Problema

**Error**: `"new row violates row-level security policy for table \"ingredient_temperature_phases\""`

**Causa**: Las políticas RLS requieren que estés autenticado (`auth.role() = 'authenticated'`), pero como no tienes login implementado, Supabase te ve como usuario anónimo.

---

## ✅ Solución: Permitir Acceso Anónimo (Desarrollo)

### Paso 1: Abre Supabase Dashboard

Ve a: **https://app.supabase.com**

### Paso 2: SQL Editor

1. Click en **SQL Editor** (ícono `</>`)
2. Click en **"New query"**

### Paso 3: Ejecuta este SQL

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated insert on ingredient_temperature_phases" ON ingredient_temperature_phases;
DROP POLICY IF EXISTS "Allow authenticated update on ingredient_temperature_phases" ON ingredient_temperature_phases;
DROP POLICY IF EXISTS "Allow authenticated delete on ingredient_temperature_phases" ON ingredient_temperature_phases;

-- Create new policies that allow anonymous access (for development)
CREATE POLICY "Allow all insert on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on ingredient_temperature_phases"
  ON ingredient_temperature_phases FOR DELETE
  USING (true);
```

### Paso 4: Click RUN

### Paso 5: Recarga la App

1. Ve a http://localhost:3001
2. Presiona **F5**
3. Intenta agregar una fase de nuevo

---

## 🎯 Ahora Debería Funcionar

Podrás:
- ✅ Agregar fases (A, B, C)
- ✅ Editar fases existentes
- ✅ Eliminar fases
- ✅ Ver las fases en el termómetro

---

## ⚠️ Nota de Seguridad

Esta solución permite que **cualquiera** pueda editar las fases (sin login).

**Para producción**, deberías:
1. Implementar Supabase Auth (login)
2. Volver a las políticas con `auth.role() = 'authenticated'`
3. O agregar un check de rol admin

**Para desarrollo/demo**, esta solución es perfecta.

---

**¿Ejecutaste el SQL?** Avísame si ahora funciona.
