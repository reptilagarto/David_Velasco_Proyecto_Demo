import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Las variables NEXT_PUBLIC_* se incrustan en el build: deben existir antes de desplegar.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Cliente de Supabase, o null si no hay configuración (la app usa entonces los datos simulados). */
export const supabase: SupabaseClient | null = url && clave ? createClient(url, clave) : null;
