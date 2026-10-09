# Mi semana · Agenda del estudiante trabajador

Aplicación web móvil-primero para organizar clases, turnos de trabajo, estudio y bienestar.
Construida con **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS v4**, componentes estilo **shadcn/ui**, **Framer Motion** y **Lucide React**.
Todos los datos son simulados (`src/data/mockData.ts`); no requiere backend.

## Pantallas

| Ruta          | Módulo                        | Qué incluye |
|---------------|-------------------------------|-------------|
| `/captura`    | Captura rápida                | Formulario con pestañas de categoría (académica, laboral, personal), título, fecha, hora de inicio/fin y prioridad. Lista de la jornada con barra de reparto por categoría. |
| `/calendario` | Calendario y espacios libres  | Vista diaria con bloques por color y huecos libres detectados (botones *Estudiar* / *Descansar*). Vista semanal compacta. |
| `/plan`       | Plan de estudio y alertas     | Porcentaje de tareas completadas, tiempo planificado frente al real por asignatura, tarjetas de sugerencia (aceptar, cambiar propuesta, rechazar) y lista de tareas. |
| `/bienestar`  | Hábitos saludables y recursos | Recomendaciones (pausas, hidratación, ejercicio, descanso), lista de verificación diaria con animación de logro y recursos de apoyo. |

## Requisitos

- Node.js 20 o superior
- npm

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos: `npm run build`, `npm run start`, `npm run lint`.

## Estructura

```
src/
├── app/                       # App Router: layout, template (transiciones) y una carpeta por pantalla
├── components/
│   ├── ui/                    # Primitivas estilo shadcn/ui (button, card, tabs, badge, input, label)
│   ├── layout/                # Cabecera, barra inferior, avisos y selector de día
│   ├── captura/               # Pantalla 1
│   ├── calendario/            # Pantalla 2
│   ├── plan/                  # Pantalla 3
│   └── bienestar/             # Pantalla 4
├── context/AgendaContext.tsx  # Estado global (Context API + useReducer)
├── data/mockData.ts           # Datos simulados: turnos, 3 asignaturas, tareas, alertas, hábitos
├── lib/                       # Utilidades de tiempo (huecos libres, formatos) y categorías
└── types/index.ts             # Tipos del dominio
```

## Decisiones de diseño

- **Estado:** Context API con `useReducer`. El estado inicial sale de `mockData.ts` de forma determinista, así el render en servidor y en cliente coincide.
- **"Hoy" fijo:** `FECHA_HOY` vale `2026-10-09` para que la demo sea reproducible. Cambia esa constante para usar otra fecha.
- **Sin persistencia:** los cambios viven en memoria y se pierden al recargar. Para guardarlos, el contexto se puede conectar a `localStorage` o a una base de datos.
- **Shadcn/ui:** los componentes de `components/ui/` siguen el código de shadcn/ui (estilo *new-york*, configuración en `components.json`) y se pueden ampliar con `npx shadcn@latest add <componente>`.

## Despliegue en Vercel

1. En Vercel, importa el repositorio y en **Root Directory** elige `agenda-estudiante`.
2. Framework Preset: **Next.js** (se detecta solo). No hace falta variable de entorno.
3. Pulsa **Deploy**.

Desde terminal: `npx vercel` (primera vez) y `npx vercel --prod`.
