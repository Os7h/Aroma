# 🚀 Inicio Rápido - AromaExplorer-Circles

## ⚡ Pasos para Iniciar

### 1️⃣ Ejecutar SQL Migration en Supabase

> [!IMPORTANT]
> **DEBES hacer esto ANTES de iniciar la app**

1. Abre [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** (icono de código `</>`)
4. Abre el archivo: `lib/supabase/migrations/001_setup.sql`
5. **Copia TODO** su contenido
6. **Pégalo** en el SQL Editor de Supabase
7. Haz clic en **RUN** (o `Ctrl+Enter`)
8. Verifica que diga "Success"

**¿Qué hace este script?**
- Crea tabla `ingredient_matches` para matches manuales
- Actualiza constraints de temperatura (0-170°C, múltiplos de 10)
- Crea funciones RPC para queries optimizadas
- Configura Row Level Security (RLS)

---

### 2️⃣ Instalar Dependencias

```powershell
cd c:\Users\Os\Documents\AromaExplorer-Circles
npm install
```

⏱️ Primera vez: ~5 minutos

---

### 3️⃣ Iniciar Aplicación

**Opción A: Usando START.bat (Fácil)**
```
Doble click en START.bat
```

**Opción B: Manual**
```powershell
npm run dev -- -p 3001
```

> [!NOTE]
> **Usando puerto 3001** porque el puerto 3000 está ocupado por AromaExplorer original

---

### 4️⃣ Abrir en Navegador

Ve a: **http://localhost:3001**

---

## 🎯 Primera Exploración

### Página Principal
1. Verás lista alfabética de ingredientes
2. Prueba la búsqueda: escribe "Kerbel"
3. Click en cualquier ingrediente

### Página de Perfil
1. **Fila 1**: 9 círculos (activos con color, inactivos grises)
2. **Click en círculo activo**: Abre drawer con moléculas
3. **Fila 2**: Flavor matches (si existen)
4. **Fila 4**: Diagrama de temperaturas 0-170°C

---

## ❓ Problemas Comunes

### "Cannot find module..."
```powershell
npm install
```

### Puerto 3000 en uso
```powershell
npm run dev -- -p 3001
```
Luego abre: http://localhost:3001

### No aparecen ingredientes
1. ¿Ejecutaste el SQL migration?
2. Verifica `.env.local` tiene las credenciales correctas
3. Abre consola del navegador (F12) para ver errores

### SQL migration falla
- Asegúrate de copiar TODO el contenido del archivo
- Verifica que estás en el proyecto correcto en Supabase
- Si ya existe la tabla, el script es idempotente (puedes ejecutarlo de nuevo)

---

## 🔄 Próximas Veces

1. Doble click en `START.bat`
2. Espera 10 segundos
3. Abre http://localhost:3000

---

## 📊 Comparación con AromaExplorer Original

| Característica | Original | Circles |
|----------------|----------|---------|
| **Vista principal** | Tabla con filtros complejos | Lista alfabética simple |
| **Vista detalle** | Paneles + termómetros verticales | 9 círculos + matches |
| **Temperatura** | 0-150°C vertical | 0-170°C horizontal |
| **Matches** | No existe | Manual matches con mini círculos |
| **Navegación** | Filtros múltiples | Búsqueda + click |

---

## 🎨 Diseño de 9 Círculos

```
Grid 3x3 (siempre visible):

[1] [2] [3]
[4] [5] [6]
[7] [8] [9]

- Activo: Relleno con color del grupo
- Inactivo: Solo contorno gris
- Hover: Scale + sombra
- Click: Abre panel con moléculas
```

---

**¿Listo?** Ejecuta el SQL migration y luego `npm run dev`
