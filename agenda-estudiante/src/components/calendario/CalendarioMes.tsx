"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Button } from "@/components/ui/button";
import { CATEGORIAS } from "@/lib/categorias";
import { aFecha, cuadriculaMes, nombreMes } from "@/lib/time";
import { cn } from "@/lib/utils";
import { FECHA_HOY } from "@/data/mockData";
import type { Categoria } from "@/types";

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

/** Calendario mensual. Al tocar un día se actualiza el detalle que aparece debajo. */
export function CalendarioMes() {
  const { actividades, tareas, fechaSeleccionada, seleccionarFecha } = useAgenda();

  const [mesVisto, setMesVisto] = React.useState(() => {
    const f = aFecha(fechaSeleccionada);
    return { anio: f.getFullYear(), mes: f.getMonth() };
  });

  const cambiarMes = (delta: number) => {
    setMesVisto((m) => {
      const d = new Date(m.anio, m.mes + delta, 1, 12);
      return { anio: d.getFullYear(), mes: d.getMonth() };
    });
  };

  const celdas = cuadriculaMes(mesVisto.anio, mesVisto.mes);

  return (
    <section aria-labelledby="titulo-mes" className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => cambiarMes(-1)} aria-label="Mes anterior">
          <ChevronLeft aria-hidden />
        </Button>
        <h2 id="titulo-mes" className="text-base font-semibold" aria-live="polite">
          {nombreMes(mesVisto.anio, mesVisto.mes)}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => cambiarMes(1)} aria-label="Mes siguiente">
          <ChevronRight aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 pb-1 text-center text-xs font-medium text-muted-foreground" aria-hidden>
        {DIAS_SEMANA.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map(({ fecha, dentroDelMes }) => {
          const activo = fecha === fechaSeleccionada;
          const esHoy = fecha === FECHA_HOY;
          const delDia = actividades.filter((a) => a.fecha === fecha);
          const categorias = [...new Set(delDia.map((a) => a.categoria))] as Categoria[];
          const entregas = tareas.filter((t) => t.fechaLimite === fecha && !t.completada).length;
          const numero = aFecha(fecha).getDate();

          return (
            <button
              key={fecha}
              type="button"
              onClick={() => seleccionarFecha(fecha)}
              aria-pressed={activo}
              aria-label={`${numero}${esHoy ? ", hoy" : ""}, ${delDia.length} actividades, ${entregas} entregas pendientes`}
              className={cn(
                "relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !dentroDelMes && "text-muted-foreground/40",
                dentroDelMes && !activo && "hover:bg-muted",
                esHoy && !activo && "font-bold text-primary ring-1 ring-primary/50",
                activo && "text-primary-foreground",
              )}
            >
              {activo && (
                <motion.span
                  layoutId="dia-mes-activo"
                  className="absolute inset-0 rounded-md bg-primary shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative tabular-nums">{numero}</span>
              <span className="relative flex h-1.5 items-center gap-0.5">
                {categorias.map((c) => (
                  <span
                    key={c}
                    className={cn("size-1 rounded-full", activo ? "bg-primary-foreground/90" : CATEGORIAS[c].punto)}
                  />
                ))}
                {entregas > 0 && (
                  <span className={cn("size-1.5 rotate-45 bg-foreground", activo && "bg-primary-foreground")} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground" aria-label="Leyenda">
        {(Object.keys(CATEGORIAS) as Categoria[]).map((c) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", CATEGORIAS[c].punto)} aria-hidden />
            {CATEGORIAS[c].etiqueta}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-1.5 rotate-45 bg-foreground" aria-hidden />
          Entrega
        </li>
      </ul>
    </section>
  );
}
