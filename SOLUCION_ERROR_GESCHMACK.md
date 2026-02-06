# 🔧 SOLUCIÓN: Error al Editar Geschmack

## El Problema

**Error**: No se pueden guardar los cambios de sabor porque RLS bloquea los updates.

**Causa**: La tabla `ingredients` tiene Row Level Security que requiere autenticación.

---

## ✅ Solución: Permitir Updates Anónimos

### Paso 1: Abre Supabase Dashboard

Ve a: **https://app.supabase.com**

### Paso 2: SQL Editor

1. Click en **SQL Editor** (ícono `</>`)
2. Click en **"New query"**

### Paso 3: Ejecuta este SQL

```sql
-- Allow anonymous updates to ingredients table (for development)
CREATE POLICY IF NOT EXISTS "Allow all updates on ingredients"
  ON ingredients FOR UPDATE
  USING (true);

-- Also allow inserts if needed
CREATE POLICY IF NOT EXISTS "Allow all inserts on ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (true);
```

### Paso 4: Click RUN

### Paso 5: Recarga la App

1. Ve a http://localhost:3001
2. Presiona **F5**
3. Intenta editar los sabores de nuevo

---

## 🎯 Ahora Debería Funcionar

Podrás:
- ✅ Editar intensidad de sabores (0-3)
- ✅ Guardar cambios en Supabase
- ✅ Ver cambios reflejados inmediatamente

---

## 📊 Verificar en Supabase

Después de guardar, puedes verificar en Supabase:

1. Ve a **Table Editor**
2. Selecciona tabla **ingredients**
3. Busca tu ingrediente (ej: Kerbel)
4. Verás las columnas:
   - `taste_sweet`
   - `taste_sour`
   - `taste_salty`
   - `taste_bitter`
   - `taste_umami`

Los valores deben estar actualizados (0-3).

---

## ⚠️ Nota de Seguridad

Esta solución permite que **cualquiera** pueda editar ingredientes (sin login).

**Para producción**, deberías:
1. Implementar Supabase Auth
2. Usar políticas con `auth.role() = 'authenticated'`
3. Agregar check de rol admin

**Para desarrollo/demo**, esta solución es perfecta.

---

**¿Ejecutaste el SQL?** Avísame si ahora funciona.
