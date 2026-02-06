# 🔧 EJECUTAR MIGRACIÓN SQL - Admin Mode

## ⚠️ IMPORTANTE: Ejecuta esto AHORA

Para que el modo admin funcione, necesitas ejecutar esta migración SQL en Supabase.

---

## 📝 Pasos

### 1. Abre Supabase Dashboard

Ve a: **https://app.supabase.com**

### 2. SQL Editor

1. Click en **SQL Editor** (ícono `</>`)
2. Click en **"New query"**

### 3. Copia y Ejecuta este SQL

```sql
-- Add behavior description column to ingredient_group_temperature
ALTER TABLE ingredient_group_temperature
  ADD COLUMN IF NOT EXISTS behavior_description_de text;
```

### 4. Click en **RUN** (o Ctrl+Enter)

Deberías ver: `Success. No rows returned`

---

## ✅ Listo

Ahora recarga la aplicación (F5) y:

1. **Activa Admin Mode**: Click en el switch arriba a la derecha
2. **Ve a un ingrediente**: Por ejemplo, Kerbel
3. **Verás botones "Bearbeiten"** en la sección de temperatura
4. **Click en "Bearbeiten"** para editar rangos y descripciones

---

## 🎮 Cómo Usar Admin Mode

### Activar/Desactivar

- **Switch arriba a la derecha**: "Admin Mode" / "Lesemodus"
- Se guarda en localStorage (persiste entre sesiones)

### Editar Temperatura

1. **Modo Admin ON**
2. **Ve a perfil de ingrediente** (ej: Kerbel)
3. **Scroll a "Temperaturentfaltung"**
4. **Click en "Bearbeiten"** (ícono lápiz) junto a un grupo
5. **Modal se abre**:
   - Selecciona rango: 0-170°C (múltiplos de 10)
   - Escribe descripción (opcional)
6. **Click "Speichern"**

### Agregar Temperatura a Grupo Sin Datos

1. **Modo Admin ON**
2. **En "Temperaturentfaltung"**, verás chips de grupos sin temperatura
3. **Click en chip** (ej: "Gruppe 3")
4. **Modal se abre** → configura y guarda

### Eliminar Temperatura

1. **Abre modal de edición**
2. **Click en "Löschen"** (botón rojo)
3. **Confirma**

---

## 🧪 Prueba Rápida

1. Ejecuta el SQL arriba
2. Recarga http://localhost:3001
3. Activa Admin Mode (switch arriba)
4. Ve a Kerbel
5. Click "Bearbeiten" en Gruppe 1
6. Cambia rango a 20-100°C
7. Agrega descripción: "Test de comportamiento"
8. Guarda
9. Verifica que se guardó correctamente

---

**¿Ejecutaste el SQL?** Avísame cuando esté listo para probar.
