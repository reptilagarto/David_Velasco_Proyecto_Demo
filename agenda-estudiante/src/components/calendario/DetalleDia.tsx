"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, CalendarClock, Check, ClipboardList, Hourglass } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { AgendaDia } from "@/components/calendario/AgendaDia";
import { LineaDelDia } from "@/components/ui/LineaDelDia";
import { StatTile } from "@/components/ui/StatTile";
import { ASIGNATURAS, FECHA_HOY } from "@/data/mockData";
import { aMinutos, detectarHuecos, formatoDuracion, formatoFechaLarga } from "@/lib/time";
import { cn } from "@/lib/utils";

/**
 * Detalle del día seleccionado. Cada cambio de fecha vuelve a montar el bloque
 * con una transición, para que el contenido se actualice de forma visible.
 */
export function DetalleDia() {
  const { actividades, tareas, fechaSeleccionada, alternarTarea } = useAgenda();

  const delDia = actividades.filter((a) => a.fecha === fechaSeleccionada);
  const minutosOcupados = delDia.reduce((t, a) => t + aMinutos(a.fin) - aMinutos(a.inicio), 0);
  const minutosLibres = detectarHuecos(delDia).reduce((t, h) => t + h.minutos, 0);
  const entregas = tareas.filter((t) => t.fechaLimite === fechaSeleccionada);
  const esHoy = fechaSeleccionada === FECHA_HOY;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.section
        key={fechaSeleccionada}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        aria-live="polite"
        className="space-y-5"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            {esHoy ? "Hoy" : "Día seleccionado"}
          </p>
          <h3 className="text-xl font-bold tracking-tight">{formatoFechaLarga(fechaSeleccionada)}</h3>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatTile etiqueta="Actividades" valor={delDia.length} icono={CalendarDays} tono="primary" />
          <StatTile etiqueta="Ocupado" valor={formatoDuracion(minutosOcupados)} icono={Hourglass} tono="academica" />
          <StatTile etiqueta="Libre" valor={formatoDuracion(minutosLibres)} icono={CalendarClock} tono="personal" />
        </div>

        <LineaDelDia />

        <div className="space-y-2.5">
          <h4 className="flex items-center gap-2 text-sm font-bold">
            <ClipboardList className="size-4 text-primary" aria-hidden />
            Tareas con entrega
            <span className="text-xs font-medium text-muted-foreground">({entregas.length})</span>
          </h4>

          {entregas.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border py-4 text-center text-sm text-muted-foreground">
              No hay entregas este día.
            </p>
          ) : (
            <ul className="space-y-2">
              {entregas.map((t) => {
                const asignatura = ASIGNATURAS.find((a) => a.id === t.asignaturaId);
                return (
                  <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={t.completada}
                      aria-label={`Marcar "${t.titulo}" como ${t.completada ? "pendiente" : "completada"}`}
                      onClick={() => alternarTarea(t.id)}
                      className={cn(
                        "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        t.completada ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
                      )}
                    >
                      {t.completada && <Check className="size-3.5" aria-hidden />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-semibold", t.completada && "text-muted-foreground line-through")}>
                        {t.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asignatura?.nombre} · {formatoDuracion(t.minutosReales)} de {formatoDuracion(t.minutosPlanificados)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        t.completada ? "bg-primary-soft text-primary" : "bg-destructive-soft text-destructive",
                      )}
                    >
                      {t.completada ? "Entregada" : "Pendiente"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="space-y-2.5">
          <h4 className="text-sm font-bold">Agenda del día</h4>
          <AgendaDia />
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
