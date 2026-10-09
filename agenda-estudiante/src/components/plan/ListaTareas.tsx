"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { ASIGNATURAS } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { formatoDuracion, formatoFechaCorta } from "@/lib/time";
import { cn } from "@/lib/utils";

export function ListaTareas() {
  const { tareas, alternarTarea, registrarTiempo } = useAgenda();

  const ordenadas = [...tareas].sort((a, b) => Number(a.completada) - Number(b.completada));

  return (
    <ul className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
      <AnimatePresence initial={false}>
        {ordenadas.map((t) => {
          const asignatura = ASIGNATURAS.find((a) => a.id === t.asignaturaId);
          return (
            <motion.li
              key={t.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 shadow-sm", t.completada && "bg-muted/60")}
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
                <AnimatePresence>
                  {t.completada && (
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <Check className="size-3.5" aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", t.completada && "text-muted-foreground line-through")}>
                  {t.titulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {asignatura?.nombre} · entrega {formatoFechaCorta(t.fechaLimite)}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                  Real {formatoDuracion(t.minutosReales)} / {formatoDuracion(t.minutosPlanificados)}
                </p>
              </div>

              {!t.completada && (
                <motion.div whileTap={{ scale: 0.92 }}>
                  <Button variant="soft" size="sm" onClick={() => registrarTiempo(t.id, 15)} aria-label={`Registrar 15 minutos en ${t.titulo}`}>
                    <Plus aria-hidden />
                    15 min
                  </Button>
                </motion.div>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
