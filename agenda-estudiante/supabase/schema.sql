-- Esquema de "Mi semana" (agenda del estudiante trabajador).
-- Ejecutar una vez en Supabase: SQL Editor > New query > Run.
-- Las tablas se llenan automáticamente la primera vez que se abre la app.

create table if not exists actividades (
  id          text primary key,
  titulo      text not null,
  categoria   text not null check (categoria in ('academica', 'laboral', 'personal')),
  fecha       date not null,
  inicio      time not null,
  fin         time not null,
  prioridad   text not null check (prioridad in ('alta', 'media', 'baja')),
  reservada   boolean not null default false,
  created_at  timestamptz not null default now(),
  constraint hora_valida check (fin > inicio)
);

create table if not exists tareas (
  id                   text primary key,
  titulo               text not null,
  asignatura_id        text not null,
  fecha_limite         date not null,
  completada           boolean not null default false,
  minutos_planificados integer not null default 0,
  minutos_reales       integer not null default 0
);

create table if not exists alertas (
  id             text primary key,
  tipo           text not null check (tipo in ('examen', 'entrega', 'descanso')),
  titulo         text not null,
  mensaje        text not null,
  prioridad      text not null check (prioridad in ('alta', 'media', 'baja')),
  titulo_bloque  text not null,
  categoria      text not null check (categoria in ('academica', 'laboral', 'personal')),
  opciones       jsonb not null,
  indice         integer not null default 0,
  estado         text not null default 'pendiente' check (estado in ('pendiente', 'aceptada', 'rechazada')),
  reorganizada   boolean not null default false
);

create table if not exists habitos (
  id           text primary key,
  nombre       text not null,
  descripcion  text not null,
  categoria    text not null check (categoria in ('pausa', 'hidratacion', 'ejercicio', 'descanso', 'alimentacion')),
  completado   boolean not null default false
);

-- Row Level Security: la clave publicable (anon) del front-end puede leer, insertar, actualizar y eliminar.
-- Es adecuado para una demo; para producción conviene exigir autenticación por usuario.
alter table actividades enable row level security;
alter table tareas      enable row level security;
alter table alertas     enable row level security;
alter table habitos     enable row level security;

create policy "anon lee actividades"     on actividades for select to anon using (true);
create policy "anon escribe actividades" on actividades for all to anon using (true) with check (true);
create policy "anon lee tareas"          on tareas      for select to anon using (true);
create policy "anon escribe tareas"      on tareas      for all to anon using (true) with check (true);
create policy "anon lee alertas"         on alertas     for select to anon using (true);
create policy "anon escribe alertas"     on alertas     for all to anon using (true) with check (true);
create policy "anon lee habitos"         on habitos     for select to anon using (true);
create policy "anon escribe habitos"     on habitos     for all to anon using (true) with check (true);
