"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Trash2 } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Button } from "@/components/ui/button";
import { LineaDelDia } from "@/components/ui/LineaDelDia";
import { CATEGORIAS } from "@/lib/categorias";
import { aMinutos, formatoDuracion } from "@/lib/time";

/** Jornada seleccionada: línea de tiempo y lista compacta (sin repetir la categoría, ya va en el color). */
export function ListaActividades() {
  const { actividades, fechaSeleccionada, eliminarActividad } = useAgenda();

  const delDia = actividades
    .filter((a) => a.fecha === fechaSeleccionada)
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio));

  const minutos = (a: { inicio: string; fin: string }) => aMinutos(a.fin) - aMinutos(a.inicio);
  const total = delDia.reduce((t, a) => t + minutos(a), 0);

  return (
    <section aria-labelledby="titulo-jornada" className="space-y-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-5">
      <div className="flex items-baseline justify-between">
        <h3 id="titulo-jornada" className="text-sm font-bold">
          Jornada seleccionada
        </h3>
        <p className="text-xs text-muted-foreground tabular-nums">
          {delDia.length} {delDia.length === 1 ? "actividad" : "actividades"}
          {total > 0 && ` · ${formatoDuracion(total)}`}
        </p>
      </div>

      <LineaDelDia />

      {delDia.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
          <CalendarX2 className="size-6 opacity-60" aria-hidden />
          Día sin actividades todavía.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          <AnimatePresence initial={false}>
            {delDia.map((a) => {
              const info = CATEGORIAS[a.categoria];
              return (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.22 }}
                  className="flex items-center gap-3 py-2.5"
                >
                  <span className={`h-9 w-1 shrink-0 rounded-full ${info.punto}`} aria-hidden />
                  <span className="w-11 shrink-0 text-sm font-bold tabular-nums">{a.inicio}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      hasta {a.fin} · {formatoDuracion(minutos(a))}
                      {a.prioridad === "alta" && <span className="ml-1.5 font-semibold text-destructive">· prioridad alta</span>}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => eliminarActividad(a.id)}
                    aria-label={`Eliminar ${a.titulo}`}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
