-- Tabla para el registro de actividades (académicas, laborales e individuales)
-- Ejecutar una vez en Supabase: SQL Editor > New query > Run

create table if not exists actividades (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  nombre      text not null,
  tipo        text not null check (tipo in ('academica', 'laboral', 'individual')),
  titulo      text not null,
  fecha       date not null,
  hora_inicio time not null,
  hora_fin    time not null,
  nota        text,
  constraint hora_valida check (hora_fin > hora_inicio)
);

create index if not exists actividades_nombre_fecha_idx on actividades (nombre, fecha);

-- Row Level Security: la clave publicable (anon) del front-end puede leer, insertar y eliminar.
-- Es adecuado para una demo; para producción conviene exigir autenticación.
alter table actividades enable row level security;

create policy "anon puede leer actividades"
  on actividades for select to anon using (true);

create policy "anon puede insertar actividades"
  on actividades for insert to anon with check (true);

create policy "anon puede eliminar actividades"
  on actividades for delete to anon using (true);
