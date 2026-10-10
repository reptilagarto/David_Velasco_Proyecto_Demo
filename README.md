# Bootcamp UCV · Hackathon de Salud Mental con IA

Plantilla del equipo.

1. Abre este repo con **Code > Codespaces > Create codespace on main**.
2. En el Codespace, abre el panel de Claude Code y escribe tus pedidos.
3. Para publicar: pídele a Claude «Guarda y publica mis cambios».

La página que se publica es `index.html` (portada con inicio de sesión y registro).

## Páginas

- `index.html` — **Portada** con inicio de sesión y creación de cuenta (nombre completo, código de estudiante, correo institucional).
- `actividades.html` — **Registro de actividades** (académicas, laborales e individuales) y vista de disponibilidad de tiempo.
- `formulario.html` — Registro de estado de ánimo.

## Base de datos (Supabase)

1. En Supabase abre **SQL Editor > New query**.
2. Copia y ejecuta el contenido de `supabase/actividades.sql`.

Esto crea la tabla `actividades` con sus políticas de acceso.

Después ejecuta `supabase/usuarios.sql` del mismo modo. Crea la tabla `usuarios`, un trigger que copia cada cuenta nueva a esa tabla y sus políticas.

En **Authentication > Providers > Email** deja activo el inicio de sesión con correo y contraseña. Si activas *Confirm email*, el estudiante debe confirmar su correo antes de entrar.

## Despliegue en Vercel

El proyecto es HTML estático, no necesita build.

1. En [vercel.com/new](https://vercel.com/new) importa el repositorio de GitHub.
2. Configura:
   - **Framework Preset:** Other
   - **Build Command:** (vacío)
   - **Output Directory:** (vacío, o `.`)
3. Pulsa **Deploy**.

Alternativa desde el terminal: `vercel` (primera vez) y `vercel --prod` para publicar.
