# Bootcamp UCV · Hackathon de Salud Mental con IA

Plantilla del equipo.

1. Abre este repo con **Code > Codespaces > Create codespace on main**.
2. En el Codespace, abre el panel de Claude Code y escribe tus pedidos.
3. Para publicar: pídele a Claude «Guarda y publica mis cambios».

La página que se publica es `index.html`.

## Páginas

- `index.html` — **Registro de actividades** (académicas, laborales e individuales) y vista de disponibilidad de tiempo.
- `formulario.html` — Registro de estado de ánimo.

## Base de datos (Supabase)

1. En Supabase abre **SQL Editor > New query**.
2. Copia y ejecuta el contenido de `supabase/actividades.sql`.

Esto crea la tabla `actividades` con sus políticas de acceso.

## Despliegue en Vercel

El proyecto es HTML estático, no necesita build.

1. En [vercel.com/new](https://vercel.com/new) importa el repositorio de GitHub.
2. Configura:
   - **Framework Preset:** Other
   - **Build Command:** (vacío)
   - **Output Directory:** (vacío, o `.`)
3. Pulsa **Deploy**.

Alternativa desde el terminal: `vercel` (primera vez) y `vercel --prod` para publicar.
