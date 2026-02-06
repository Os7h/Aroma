# 🌿 AromaExplorer-Circles

Aplicación web que replica el sistema de 9 grupos aromáticos del libro "Aroma / Die Kunst des Würzens" de Vierich & Vilgis.

## 🚀 Características

- ✅ **9 Círculos Aromáticos** siempre visibles (slots 1-9)
- ✅ **Visualización de Moléculas** por grupo con descriptores y solubilidad
- ✅ **Flavor Matches Manuales** con mini círculos clickeables
- ✅ **Diagrama de Temperaturas** 0-170°C en bloques de 10°C
- ✅ **Lista Alfabética** con búsqueda en tiempo real
- ✅ **Material UI** con diseño moderno y responsive
- ✅ **Supabase** como base de datos

## 📋 Requisitos Previos

- **Node.js** v18 o superior (ya instalado)
- **npm** (incluido con Node.js)

## 🛠️ Instalación

### 1. Instalar dependencias

```powershell
cd c:\Users\Os\Documents\AromaExplorer-Circles
npm install
```

⏱️ Esto tomará ~5 minutos la primera vez.

### 2. Configurar Base de Datos en Supabase

**IMPORTANTE**: Ejecuta el script SQL en Supabase:

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Abre el archivo `lib/supabase/migrations/001_setup.sql`
5. Copia TODO su contenido
6. Pégalo en el SQL Editor
7. Haz clic en **RUN**

Esto creará:
- Tabla `ingredient_matches`
- Constraints de temperatura (0-170°C, múltiplos de 10)
- RPCs `rpc_get_ingredient_profile` y `rpc_get_ingredient_matches`
- Row Level Security (RLS)

### 3. Iniciar servidor de desarrollo

```powershell
npm run dev
```

Abre tu navegador en: **http://localhost:3000**

## 🎯 Uso

### Página Principal
- **Búsqueda**: Filtra ingredientes por nombre
- **Lista alfabética**: Agrupada por letra (A, B, C...)
- **Click en ingrediente**: Navega al perfil

### Página de Perfil

**Fila 1: 9 Círculos Aromáticos**
- Siempre visibles (slots 1-9)
- Círculos activos: rellenos con color del grupo
- Círculos inactivos: solo contorno gris
- Click en círculo: abre panel con moléculas

**Fila 2: Flavor Matches**
- Matches manuales con mini círculos
- Click en nombre: navega al ingrediente match

**Fila 3: Detalles del Grupo**
- Panel drawer con moléculas del grupo seleccionado
- ◆ = molécula clave
- ◦ = molécula rastreada
- Muestra aromáticos y solubilidad

**Fila 4: Diagrama de Temperaturas**
- Bandas horizontales por grupo activo
- 0-170°C en bloques de 10°C
- Color saturado en rango activo

## 📊 Estructura del Proyecto

```
AromaExplorer-Circles/
├── app/
│   ├── ingredients/
│   │   ├── page.tsx (lista alfabética)
│   │   └── [id]/page.tsx (perfil)
│   ├── layout.tsx
│   └── page.tsx (redirect)
├── components/
│   ├── circles/
│   │   ├── AromaCircle.tsx
│   │   ├── AromaCircleGrid9.tsx
│   │   └── MiniCircleStrip9.tsx
│   ├── molecules/
│   │   └── GroupMoleculePanel.tsx
│   ├── matches/
│   │   └── FlavorMatchesList.tsx
│   ├── temperature/
│   │   └── TemperatureBands.tsx
│   └── Providers.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── migrations/001_setup.sql
│   ├── hooks/
│   │   └── useIngredients.ts
│   ├── queries/
│   │   └── ingredients.ts
│   └── validation/
│       └── schemas.ts
├── types/
│   ├── database.ts
│   └── app.ts
└── styles/
    └── theme.ts
```

## 🎨 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **UI**: Material UI v6
- **Base de datos**: Supabase (PostgreSQL)
- **Data fetching**: TanStack Query
- **Validación**: Zod
- **Lenguaje**: TypeScript

## 🐛 Solución de Problemas

### Error: "Module not found"
```powershell
npm install
```

### Puerto 3000 ya en uso
```powershell
npm run dev -- -p 3001
```

### No aparecen ingredientes
1. Verifica que ejecutaste el script SQL en Supabase
2. Verifica credenciales en `.env.local`
3. Revisa la consola del navegador (F12)

## 📝 Próximos Pasos

- [ ] Implementar admin mode completo
- [ ] Agregar autenticación con Supabase Auth
- [ ] Modales de edición para admin
- [ ] Crear/editar matches manuales
- [ ] Editar rangos de temperatura
- [ ] Modo oscuro

## 🔄 Diferencias con AromaExplorer Original

| Característica | Original | Circles |
|----------------|----------|---------|
| Vista principal | Tabla con filtros | Lista alfabética |
| Vista detalle | Paneles + termómetros | 9 círculos + matches |
| Navegación | Filtros complejos | Búsqueda simple |
| Matches | No existe | Manual matches |
| Temperatura | Vertical 0-150°C | Horizontal 0-170°C |

---

**Desarrollado siguiendo el libro "Aroma / Die Kunst des Würzens" de Vierich & Vilgis**
