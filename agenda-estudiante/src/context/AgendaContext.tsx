"use client";

import * as React from "react";

import {
  ACTIVIDADES_INICIALES,
  ALERTAS_INICIALES,
  FECHA_HOY,
  HABITOS_INICIALES,
  TAREAS_INICIALES,
} from "@/data/mockData";
import type { Actividad, Categoria, Prioridad } from "@/types";
import { aFilaActividad, cargarAgenda, type DatosAgenda } from "@/lib/agendaRepo";
import { supabase } from "@/lib/supabase";
import type { Hueco } from "@/lib/time";
import { aMinutos, aHora } from "@/lib/time";

/* -------------------------------------------------------------------------- */
/*  Estado                                                                    */
/* -------------------------------------------------------------------------- */

export interface Aviso {
  id: number;
  texto: string;
}

export interface EstadoAgenda extends DatosAgenda {
  fechaSeleccionada: string;
  avisos: Aviso[];
}

type Accion =
  | { type: "cargar"; datos: DatosAgenda }
  | { type: "agregarActividad"; actividad: Actividad }
  | { type: "eliminarActividad"; id: string }
  | { type: "seleccionarFecha"; fecha: string }
  | { type: "alternarTarea"; id: string }
  | { type: "registrarTiempo"; id: string; minutos: number }
  | { type: "aceptarAlerta"; id: string; actividad: Actividad }
  | { type: "reorganizarAlerta"; id: string }
  | { type: "rechazarAlerta"; id: string }
  | { type: "alternarHabito"; id: string }
  | { type: "agregarAviso"; aviso: Aviso }
  | { type: "quitarAviso"; id: number };

const ESTADO_INICIAL: EstadoAgenda = {
  actividades: ACTIVIDADES_INICIALES,
  tareas: TAREAS_INICIALES,
  alertas: ALERTAS_INICIALES,
  habitos: HABITOS_INICIALES,
  fechaSeleccionada: FECHA_HOY,
  avisos: [],
};

function reducer(estado: EstadoAgenda, accion: Accion): EstadoAgenda {
  switch (accion.type) {
    case "cargar":
      return { ...estado, ...accion.datos };

    case "agregarActividad":
      return { ...estado, actividades: [...estado.actividades, accion.actividad] };

    case "eliminarActividad":
      return { ...estado, actividades: estado.actividades.filter((a) => a.id !== accion.id) };

    case "seleccionarFecha":
      return { ...estado, fechaSeleccionada: accion.fecha };

    case "alternarTarea":
      return {
        ...estado,
        tareas: estado.tareas.map((t) => (t.id === accion.id ? { ...t, completada: !t.completada } : t)),
      };

    case "registrarTiempo":
      return {
        ...estado,
        tareas: estado.tareas.map((t) =>
          t.id === accion.id ? { ...t, minutosReales: t.minutosReales + accion.minutos } : t,
        ),
      };

    case "aceptarAlerta":
      return {
        ...estado,
        actividades: [...estado.actividades, accion.actividad],
        alertas: estado.alertas.map((a) => (a.id === accion.id ? { ...a, estado: "aceptada" } : a)),
      };

    case "reorganizarAlerta":
      return {
        ...estado,
        alertas: estado.alertas.map((a) =>
          a.id === accion.id
            ? { ...a, indice: (a.indice + 1) % a.opciones.length, reorganizada: true }
            : a,
        ),
      };

    case "rechazarAlerta":
      return {
        ...estado,
        alertas: estado.alertas.map((a) => (a.id === accion.id ? { ...a, estado: "rechazada" } : a)),
      };

    case "alternarHabito":
      return {
        ...estado,
        habitos: estado.habitos.map((h) => (h.id === accion.id ? { ...h, completado: !h.completado } : h)),
      };

    case "agregarAviso":
      return { ...estado, avisos: [...estado.avisos, accion.aviso].slice(-3) };

    case "quitarAviso":
      return { ...estado, avisos: estado.avisos.filter((a) => a.id !== accion.id) };

    default:
      return estado;
  }
}

/* -------------------------------------------------------------------------- */
/*  Contexto y API pública                                                    */
/* -------------------------------------------------------------------------- */

export interface NuevaActividad {
  titulo: string;
  categoria: Categoria;
  fecha: string;
  inicio: string;
  fin: string;
  prioridad: Prioridad;
}

export interface AgendaContextValue extends EstadoAgenda {
  /** true cuando los datos vienen de Supabase; false si se usan los simulados. */
  conectadoBD: boolean;
  agregarActividad: (datos: NuevaActividad) => void;
  eliminarActividad: (id: string) => void;
  seleccionarFecha: (fecha: string) => void;
  alternarTarea: (id: string) => void;
  registrarTiempo: (id: string, minutos: number) => void;
  aceptarAlerta: (id: string) => void;
  reorganizarAlerta: (id: string) => void;
  rechazarAlerta: (id: string) => void;
  alternarHabito: (id: string) => void;
  reservarHueco: (hueco: Hueco, tipo: "estudio" | "descanso") => void;
  notificar: (texto: string) => void;
}

const AgendaContext = React.createContext<AgendaContextValue | null>(null);

let secuencia = 0;
function nuevoId(prefijo: string) {
  secuencia += 1;
  return `${prefijo}-${Date.now().toString(36)}-${secuencia}`;
}

export function AgendaProvider({ children }: { children: React.ReactNode }) {
  const [estado, dispatch] = React.useReducer(reducer, ESTADO_INICIAL);
  const conectadoBD = supabase !== null;

  const notificar = React.useCallback((texto: string) => {
    const id = Date.now() + Math.random();
    dispatch({ type: "agregarAviso", aviso: { id, texto } });
    window.setTimeout(() => dispatch({ type: "quitarAviso", id }), 2600);
  }, []);

  /** Ejecuta una escritura en Supabase sin bloquear la interfaz; avisa si falla. */
  const persistir = React.useCallback(
    (operacion: PromiseLike<{ error: { message: string } | null }> | undefined) => {
      // Sin Supabase la operación es undefined y no se hace nada.
      if (!operacion) return;
      Promise.resolve(operacion).then(({ error }) => {
        if (error) notificar("No se pudo guardar: " + error.message);
      });
    },
    [notificar],
  );

  // Carga inicial desde Supabase. Si falla, la app sigue con los datos simulados.
  React.useEffect(() => {
    if (!supabase) return;
    let vigente = true;
    cargarAgenda(supabase)
      .then((datos) => {
        if (vigente && datos) dispatch({ type: "cargar", datos });
      })
      .catch((error: { message?: string }) => {
        if (vigente) notificar("Sin conexión a la base de datos: " + (error.message ?? "error desconocido"));
      });
    return () => {
      vigente = false;
    };
  }, [notificar]);

  const agregarActividad = React.useCallback(
    (datos: NuevaActividad) => {
      const actividad: Actividad = { id: nuevoId("act"), ...datos };
      dispatch({ type: "agregarActividad", actividad });
      persistir(supabase?.from("actividades").insert(aFilaActividad(actividad)));
      notificar("Actividad guardada");
    },
    [notificar, persistir],
  );

  const eliminarActividad = React.useCallback(
    (id: string) => {
      dispatch({ type: "eliminarActividad", id });
      persistir(supabase?.from("actividades").delete().eq("id", id));
    },
    [persistir],
  );

  const seleccionarFecha = React.useCallback((fecha: string) => {
    dispatch({ type: "seleccionarFecha", fecha });
  }, []);

  const alternarTarea = React.useCallback(
    (id: string) => {
      const tarea = estado.tareas.find((t) => t.id === id);
      dispatch({ type: "alternarTarea", id });
      if (tarea) persistir(supabase?.from("tareas").update({ completada: !tarea.completada }).eq("id", id));
    },
    [estado.tareas, persistir],
  );

  const registrarTiempo = React.useCallback(
    (id: string, minutos: number) => {
      const tarea = estado.tareas.find((t) => t.id === id);
      dispatch({ type: "registrarTiempo", id, minutos });
      if (tarea)
        persistir(
          supabase?.from("tareas").update({ minutos_reales: tarea.minutosReales + minutos }).eq("id", id),
        );
      notificar(`+${minutos} min registrados`);
    },
    [estado.tareas, notificar, persistir],
  );

  const aceptarAlerta = React.useCallback(
    (id: string) => {
      const alerta = estado.alertas.find((a) => a.id === id);
      if (!alerta) return;
      const slot = alerta.opciones[alerta.indice];
      const actividad: Actividad = {
        id: nuevoId("alerta"),
        titulo: alerta.tituloBloque,
        categoria: alerta.categoria,
        fecha: slot.fecha,
        inicio: slot.inicio,
        fin: slot.fin,
        prioridad: alerta.prioridad,
      };
      dispatch({ type: "aceptarAlerta", id, actividad });
      persistir(supabase?.from("actividades").insert(aFilaActividad(actividad)));
      persistir(supabase?.from("alertas").update({ estado: "aceptada" }).eq("id", id));
      notificar("Sugerencia añadida a tu calendario");
    },
    [estado.alertas, notificar, persistir],
  );

  const reorganizarAlerta = React.useCallback(
    (id: string) => {
      const alerta = estado.alertas.find((a) => a.id === id);
      dispatch({ type: "reorganizarAlerta", id });
      if (alerta)
        persistir(
          supabase?.from("alertas")
            .update({ indice: (alerta.indice + 1) % alerta.opciones.length, reorganizada: true })
            .eq("id", id),
        );
      notificar("Propuesta reorganizada");
    },
    [estado.alertas, notificar, persistir],
  );

  const rechazarAlerta = React.useCallback(
    (id: string) => {
      dispatch({ type: "rechazarAlerta", id });
      persistir(supabase?.from("alertas").update({ estado: "rechazada" }).eq("id", id));
      notificar("Sugerencia descartada");
    },
    [notificar, persistir],
  );

  const alternarHabito = React.useCallback(
    (id: string) => {
      const habito = estado.habitos.find((h) => h.id === id);
      dispatch({ type: "alternarHabito", id });
      if (habito) persistir(supabase?.from("habitos").update({ completado: !habito.completado }).eq("id", id));
    },
    [estado.habitos, persistir],
  );

  const reservarHueco = React.useCallback(
    (hueco: Hueco, tipo: "estudio" | "descanso") => {
      // Reserva hasta 60 min desde el inicio del hueco, sin salirse de él.
      const duracion = Math.min(hueco.minutos, 60);
      const inicio = aMinutos(hueco.inicio);
      const actividad: Actividad = {
        id: nuevoId("hueco"),
        titulo: tipo === "estudio" ? "Sesión de estudio" : "Descanso",
        categoria: tipo === "estudio" ? "academica" : "personal",
        fecha: estado.fechaSeleccionada,
        inicio: hueco.inicio,
        fin: aHora(inicio + duracion),
        prioridad: "media",
        reservada: true,
      };
      dispatch({ type: "agregarActividad", actividad });
      persistir(supabase?.from("actividades").insert(aFilaActividad(actividad)));
      notificar(tipo === "estudio" ? "Sesión de estudio reservada" : "Descanso reservado");
    },
    [estado.fechaSeleccionada, notificar, persistir],
  );

  const valor = React.useMemo<AgendaContextValue>(
    () => ({
      ...estado,
      conectadoBD,
      agregarActividad,
      eliminarActividad,
      seleccionarFecha,
      alternarTarea,
      registrarTiempo,
      aceptarAlerta,
      reorganizarAlerta,
      rechazarAlerta,
      alternarHabito,
      reservarHueco,
      notificar,
    }),
    [
      estado,
      conectadoBD,
      agregarActividad,
      eliminarActividad,
      seleccionarFecha,
      alternarTarea,
      registrarTiempo,
      aceptarAlerta,
      reorganizarAlerta,
      rechazarAlerta,
      alternarHabito,
      reservarHueco,
      notificar,
    ],
  );

  return <AgendaContext.Provider value={valor}>{children}</AgendaContext.Provider>;
}

export function useAgenda(): AgendaContextValue {
  const contexto = React.useContext(AgendaContext);
  if (!contexto) {
    throw new Error("useAgenda debe usarse dentro de <AgendaProvider>");
  }
  return contexto;
}
