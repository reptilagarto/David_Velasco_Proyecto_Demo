"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ClipboardList } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { AgendaDia } from "@/components/calendario/AgendaDia";
import { ASIGNATURAS } from "@/data/mockData";
import { formatoDuracion, formatoFechaLarga } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Detalle del día seleccionado: tareas con entrega, agenda con huecos libres. */
export function DetalleDia() {
  const { tareas, fechaSeleccionada, alternarTarea } = useAgenda();
  const entregas = tareas.filter((t) => t.fechaLimite === fechaSeleccionada);

  return (
    <section aria-live="polite" className="space-y-5">
      <h2 className="text-lg font-semibold capitalize tracking-tight">{formatoFechaLarga(fechaSeleccionada)}</h2>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ClipboardList className="size-4 text-primary" aria-hidden />
          Tareas con entrega
        </h3>

        {entregas.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border py-4 text-center text-sm text-muted-foreground">
            No hay entregas este día.
          </p>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {entregas.map((t) => {
                const asignatura = ASIGNATURAS.find((a) => a.id === t.asignaturaId);
                return (
                  <motion.li
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
                  >
                    <motion.button
                      type="button"
                      role="checkbox"
                      aria-checked={t.completada}
                      aria-label={`Marcar "${t.titulo}" como ${t.completada ? "pendiente" : "completada"}`}
                      onClick={() => alternarTarea(t.id)}
                      whileTap={{ scale: 0.85 }}
                      className={cn(
                        "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        t.completada ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card",
                      )}
                    >
                      {t.completada && <Check className="size-3.5" aria-hidden />}
                    </motion.button>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-medium", t.completada && "text-muted-foreground line-through")}>
                        {t.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asignatura?.nombre} · {formatoDuracion(t.minutosReales)} / {formatoDuracion(t.minutosPlanificados)}
                      </p>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", t.completada ? "bg-primary-soft text-primary" : "bg-destructive-soft text-destructive")}>
                      {t.completada ? "Entregada" : "Pendiente"}
                    </span>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Agenda del día</h3>
        <AgendaDia />
      </div>
    </section>
  );
}
