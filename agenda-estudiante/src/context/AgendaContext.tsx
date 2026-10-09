"use client";

import * as React from "react";

import {
  ACTIVIDADES_INICIALES,
  ALERTAS_INICIALES,
  FECHA_HOY,
  HABITOS_INICIALES,
  TAREAS_INICIALES,
} from "@/data/mockData";
import type { Actividad, Alerta, Categoria, Habito, Prioridad, Tarea } from "@/types";
import type { Hueco } from "@/lib/time";
import { aMinutos, aHora } from "@/lib/time";

/* -------------------------------------------------------------------------- */
/*  Estado                                                                    */
/* -------------------------------------------------------------------------- */

export interface Aviso {
  id: number;
  texto: string;
}

export interface EstadoAgenda {
  actividades: Actividad[];
  tareas: Tarea[];
  alertas: Alerta[];
  habitos: Habito[];
  fechaSeleccionada: string;
  avisos: Aviso[];
}

type Accion =
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

  const notificar = React.useCallback((texto: string) => {
    const id = Date.now() + Math.random();
    dispatch({ type: "agregarAviso", aviso: { id, texto } });
    window.setTimeout(() => dispatch({ type: "quitarAviso", id }), 2600);
  }, []);

  const agregarActividad = React.useCallback(
    (datos: NuevaActividad) => {
      dispatch({ type: "agregarActividad", actividad: { id: nuevoId("act"), ...datos } });
      notificar("Actividad guardada");
    },
    [notificar],
  );

  const eliminarActividad = React.useCallback((id: string) => {
    dispatch({ type: "eliminarActividad", id });
  }, []);

  const seleccionarFecha = React.useCallback((fecha: string) => {
    dispatch({ type: "seleccionarFecha", fecha });
  }, []);

  const alternarTarea = React.useCallback((id: string) => {
    dispatch({ type: "alternarTarea", id });
  }, []);

  const registrarTiempo = React.useCallback(
    (id: string, minutos: number) => {
      dispatch({ type: "registrarTiempo", id, minutos });
      notificar(`+${minutos} min registrados`);
    },
    [notificar],
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
      notificar("Sugerencia añadida a tu calendario");
    },
    [estado.alertas, notificar],
  );

  const reorganizarAlerta = React.useCallback(
    (id: string) => {
      dispatch({ type: "reorganizarAlerta", id });
      notificar("Propuesta reorganizada");
    },
    [notificar],
  );

  const rechazarAlerta = React.useCallback(
    (id: string) => {
      dispatch({ type: "rechazarAlerta", id });
      notificar("Sugerencia descartada");
    },
    [notificar],
  );

  const alternarHabito = React.useCallback((id: string) => {
    dispatch({ type: "alternarHabito", id });
  }, []);

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
      notificar(tipo === "estudio" ? "Sesión de estudio reservada" : "Descanso reservado");
    },
    [estado.fechaSeleccionada, notificar],
  );

  const valor = React.useMemo<AgendaContextValue>(
    () => ({
      ...estado,
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
