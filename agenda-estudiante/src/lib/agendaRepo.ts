import type { SupabaseClient } from "@supabase/supabase-js";

import {
  ACTIVIDADES_INICIALES,
  ALERTAS_INICIALES,
  HABITOS_INICIALES,
  TAREAS_INICIALES,
} from "@/data/mockData";
import type { Actividad, Alerta, Habito, Tarea } from "@/types";

/* Filas tal como están en Postgres (snake_case). Las horas llegan como "07:00:00". */
interface FilaActividad {
  id: string;
  titulo: string;
  categoria: Actividad["categoria"];
  fecha: string;
  inicio: string;
  fin: string;
  prioridad: Actividad["prioridad"];
  reservada: boolean;
}

interface FilaTarea {
  id: string;
  titulo: string;
  asignatura_id: string;
  fecha_limite: string;
  completada: boolean;
  minutos_planificados: number;
  minutos_reales: number;
}

interface FilaAlerta {
  id: string;
  tipo: Alerta["tipo"];
  titulo: string;
  mensaje: string;
  prioridad: Alerta["prioridad"];
  titulo_bloque: string;
  categoria: Alerta["categoria"];
  opciones: Alerta["opciones"];
  indice: number;
  estado: Alerta["estado"];
  reorganizada: boolean;
}

interface FilaHabito {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: Habito["categoria"];
  completado: boolean;
}

export interface DatosAgenda {
  actividades: Actividad[];
  tareas: Tarea[];
  alertas: Alerta[];
  habitos: Habito[];
}

const horaCorta = (hora: string) => hora.slice(0, 5);

const aActividad = (f: FilaActividad): Actividad => ({
  id: f.id,
  titulo: f.titulo,
  categoria: f.categoria,
  fecha: f.fecha,
  inicio: horaCorta(f.inicio),
  fin: horaCorta(f.fin),
  prioridad: f.prioridad,
  reservada: f.reservada,
});

const aTarea = (f: FilaTarea): Tarea => ({
  id: f.id,
  titulo: f.titulo,
  asignaturaId: f.asignatura_id,
  fechaLimite: f.fecha_limite,
  completada: f.completada,
  minutosPlanificados: f.minutos_planificados,
  minutosReales: f.minutos_reales,
});

const aAlerta = (f: FilaAlerta): Alerta => ({
  id: f.id,
  tipo: f.tipo,
  titulo: f.titulo,
  mensaje: f.mensaje,
  prioridad: f.prioridad,
  tituloBloque: f.titulo_bloque,
  categoria: f.categoria,
  opciones: f.opciones,
  indice: f.indice,
  estado: f.estado,
  reorganizada: f.reorganizada,
});

const aHabito = (f: FilaHabito): Habito => ({
  id: f.id,
  nombre: f.nombre,
  descripcion: f.descripcion,
  categoria: f.categoria,
  completado: f.completado,
});

/** Convierte la actividad de la app en fila de la base de datos. */
export function aFilaActividad(a: Actividad) {
  return { id: a.id, titulo: a.titulo, categoria: a.categoria, fecha: a.fecha, inicio: a.inicio, fin: a.fin, prioridad: a.prioridad, reservada: Boolean(a.reservada) };
}

/**
 * Lee la agenda completa. Si las tablas están vacías, las llena con los datos simulados
 * y devuelve null (la app ya tiene esos mismos datos en memoria).
 */
export async function cargarAgenda(sb: SupabaseClient): Promise<DatosAgenda | null> {
  const [act, tar, ale, hab] = await Promise.all([
    sb.from("actividades").select("*").order("fecha").order("inicio"),
    sb.from("tareas").select("*"),
    sb.from("alertas").select("*"),
    sb.from("habitos").select("*"),
  ]);
  for (const r of [act, tar, ale, hab]) if (r.error) throw r.error;

  const hayDatos = (act.data?.length ?? 0) + (tar.data?.length ?? 0) + (ale.data?.length ?? 0) + (hab.data?.length ?? 0) > 0;
  if (!hayDatos) {
    await sembrarAgenda(sb);
    return null;
  }

  return {
    actividades: (act.data as FilaActividad[]).map(aActividad),
    tareas: (tar.data as FilaTarea[]).map(aTarea),
    alertas: (ale.data as FilaAlerta[]).map(aAlerta),
    habitos: (hab.data as FilaHabito[]).map(aHabito),
  };
}

/** Inserta los datos simulados. `ignoreDuplicates` evita duplicados si dos cargas compiten. */
async function sembrarAgenda(sb: SupabaseClient) {
  const opciones = { onConflict: "id", ignoreDuplicates: true };
  const resultados = await Promise.all([
    sb.from("actividades").upsert(ACTIVIDADES_INICIALES.map(aFilaActividad), opciones),
    sb.from("tareas").upsert(
      TAREAS_INICIALES.map((t) => ({
        id: t.id,
        titulo: t.titulo,
        asignatura_id: t.asignaturaId,
        fecha_limite: t.fechaLimite,
        completada: t.completada,
        minutos_planificados: t.minutosPlanificados,
        minutos_reales: t.minutosReales,
      })),
      opciones,
    ),
    sb.from("alertas").upsert(
      ALERTAS_INICIALES.map((a) => ({
        id: a.id,
        tipo: a.tipo,
        titulo: a.titulo,
        mensaje: a.mensaje,
        prioridad: a.prioridad,
        titulo_bloque: a.tituloBloque,
        categoria: a.categoria,
        opciones: a.opciones,
        indice: a.indice,
        estado: a.estado,
        reorganizada: a.reorganizada,
      })),
      opciones,
    ),
    sb.from("habitos").upsert(
      HABITOS_INICIALES.map((h) => ({ id: h.id, nombre: h.nombre, descripcion: h.descripcion, categoria: h.categoria, completado: h.completado })),
      opciones,
    ),
  ]);
  for (const r of resultados) if (r.error) throw r.error;
}
