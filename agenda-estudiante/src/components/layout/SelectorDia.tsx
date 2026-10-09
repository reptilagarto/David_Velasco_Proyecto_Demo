"use client";

import { motion } from "framer-motion";

import { useAgenda } from "@/context/AgendaContext";
import { CATEGORIAS } from "@/lib/categorias";
import { cn } from "@/lib/utils";
import { diasDeSemana, formatoDiaCorto } from "@/lib/time";
import { FECHA_HOY } from "@/data/mockData";
import type { Categoria } from "@/types";

/** Tira semanal (lunes a domingo). Cada día muestra puntos de color por categoría. */
export function SelectorDia() {
  const { actividades, fechaSeleccionada, seleccionarFecha } = useAgenda();
  const dias = diasDeSemana(fechaSeleccionada);

  return (
    <div role="group" aria-label="Seleccionar día" className="grid grid-cols-7 gap-1.5">
      {dias.map((fecha) => {
        const activo = fecha === fechaSeleccionada;
        const esHoy = fecha === FECHA_HOY;
        const { dia, numero } = formatoDiaCorto(fecha);
        const categorias = [
          ...new Set(actividades.filter((a) => a.fecha === fecha).map((a) => a.categoria)),
        ] as Categoria[];

        return (
          <button
            key={fecha}
            type="button"
            onClick={() => seleccionarFecha(fecha)}
            aria-pressed={activo}
            aria-label={`${dia} ${numero}${esHoy ? ", hoy" : ""}`}
            className={cn(
              "relative flex cursor-pointer flex-col items-center gap-0.5 rounded-lg py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activo ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted",
            )}
          >
            {activo && (
              <motion.span
                layoutId="dia-activo"
                className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative capitalize">{dia}</span>
            <span className="relative text-base font-semibold">{numero}</span>
            <span className="relative flex h-1.5 gap-0.5">
              {categorias.map((c) => (
                <span
                  key={c}
                  className={cn("size-1.5 rounded-full", activo ? "bg-primary-foreground/80" : CATEGORIAS[c].punto)}
                />
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}
