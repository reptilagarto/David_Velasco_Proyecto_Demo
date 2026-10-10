-- Tabla de registro de usuarios (datos de cada estudiante que crea una cuenta)
-- Ejecutar una vez en Supabase: SQL Editor > New query > Run
-- Requiere que la autenticación por correo y contraseña esté activa (Authentication > Providers > Email).

create table if not exists usuarios (
  id                   uuid primary key references auth.users (id) on delete cascade,
  created_at           timestamptz not null default now(),
  nombre_completo      text not null,
  codigo_estudiante    text not null unique,
  correo_institucional text not null unique,
  constraint codigo_valido check (codigo_estudiante ~ '^[A-Z0-9-]{4,20}$'),
  constraint correo_valido check (correo_institucional ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Cada vez que se crea una cuenta en Authentication, se copian sus datos a la tabla usuarios.
-- El front-end envía nombre, código y correo como metadatos al registrarse.
create or replace function registrar_usuario_nuevo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into usuarios (id, nombre_completo, codigo_estudiante, correo_institucional)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nombre_completo',
    upper(new.raw_user_meta_data ->> 'codigo_estudiante'),
    lower(new.raw_user_meta_data ->> 'correo_institucional')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_creado on auth.users;

create trigger on_auth_user_creado
  after insert on auth.users
  for each row execute function registrar_usuario_nuevo();

-- Row Level Security: cada usuario solo puede leer su propio registro.
-- Las altas las hace el trigger (security definer), así que no hace falta una política de insert.
alter table usuarios enable row level security;

create policy "usuario lee su propio registro"
  on usuarios for select to authenticated using (auth.uid() = id);
