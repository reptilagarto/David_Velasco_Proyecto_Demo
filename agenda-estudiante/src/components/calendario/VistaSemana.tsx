"use client";

import { motion } from "framer-motion";

import { useAgenda } from "@/context/AgendaContext";
import { CATEGORIAS } from "@/lib/categorias";
import { aMinutos, diasDeSemana, formatoDiaCorto, FIN_JORNADA, INICIO_JORNADA } from "@/lib/time";
import { cn } from "@/lib/utils";
import { FECHA_HOY } from "@/data/mockData";

const ESCALA = FIN_JORNADA - INICIO_JORNADA;

/** Vista semanal compacta: cada fila es un día y los bloques ocupan su franja horaria real. */
export function VistaSemana({ onSeleccionarDia }: { onSeleccionarDia: (fecha: string) => void }) {
  const { actividades, fechaSeleccionada } = useAgenda();
  const dias = diasDeSemana(fechaSeleccionada);

  return (
    <div className="space-y-2">
      <div className="flex justify-between px-14 text-[10px] text-muted-foreground" aria-hidden>
        <span>07:00</span>
        <span>14:00</span>
        <span>21:00</span>
      </div>

      <ul className="space-y-2">
        {dias.map((fecha, i) => {
          const { dia, numero } = formatoDiaCorto(fecha);
          const delDia = actividades.filter((a) => a.fecha === fecha);
          const esHoy = fecha === FECHA_HOY;

          return (
            <li key={fecha}>
              <button
                type="button"
                onClick={() => onSeleccionarDia(fecha)}
                aria-label={`Ver ${dia} ${numero} en vista diaria`}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-lg p-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  fecha === fechaSeleccionada && "bg-primary-soft/60",
                )}
              >
                <span className={cn("w-10 shrink-0 text-center text-xs capitalize", esHoy ? "font-bold text-primary" : "text-muted-foreground")}>
                  {dia}
                  <span className="block text-sm font-semibold text-foreground">{numero}</span>
                </span>
                <span className="relative h-7 flex-1 overflow-hidden rounded-md bg-muted">
                  {delDia.map((a, j) => {
                    const inicio = aMinutos(a.inicio) - INICIO_JORNADA;
                    const duracion = aMinutos(a.fin) - aMinutos(a.inicio);
                    return (
                      <motion.span
                        key={a.id}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: i * 0.04 + j * 0.02, duration: 0.3 }}
                        style={{
                          left: `${(inicio / ESCALA) * 100}%`,
                          width: `${(duracion / ESCALA) * 100}%`,
                          transformOrigin: "left",
                        }}
                        className={cn("absolute inset-y-1 rounded-sm", CATEGORIAS[a.categoria].punto)}
                        title={`${a.titulo} · ${a.inicio}–${a.fin}`}
                      />
                    );
                  })}
                </span>
                <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">{delDia.length}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
