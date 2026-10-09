"use client";

import { motion } from "framer-motion";

import { useAgenda } from "@/context/AgendaContext";
import { CATEGORIAS } from "@/lib/categorias";
import { aMinutos, FIN_JORNADA, INICIO_JORNADA } from "@/lib/time";
import { cn } from "@/lib/utils";

const ESCALA = FIN_JORNADA - INICIO_JORNADA;
const MARCAS = [8, 12, 16, 20];

/** Barra horizontal de la jornada (07:00 a 22:00) con cada bloque en su color. */
export function LineaDelDia() {
  const { actividades, fechaSeleccionada } = useAgenda();
  const delDia = actividades.filter((a) => a.fecha === fechaSeleccionada);

  return (
    <div className="space-y-1.5">
      <div
        className="relative h-10 overflow-hidden rounded-xl bg-muted ring-1 ring-inset ring-border"
        role="img"
        aria-label={`Jornada con ${delDia.length} actividades`}
      >
        {delDia.map((a, i) => {
          const izquierda = ((aMinutos(a.inicio) - INICIO_JORNADA) / ESCALA) * 100;
          const ancho = ((aMinutos(a.fin) - aMinutos(a.inicio)) / ESCALA) * 100;
          return (
            <motion.div
              key={a.id}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              style={{ left: `${izquierda}%`, width: `${ancho}%`, transformOrigin: "left" }}
              className={cn("absolute inset-y-1.5 rounded-md shadow-sm", CATEGORIAS[a.categoria].punto)}
              title={`${a.titulo} · ${a.inicio}–${a.fin}`}
            />
          );
        })}
      </div>
      <div className="relative h-4 text-[10px] tabular-nums text-muted-foreground">
        {MARCAS.map((h) => (
          <span key={h} className="absolute -translate-x-1/2" style={{ left: `${((h * 60 - INICIO_JORNADA) / ESCALA) * 100}%` }}>
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>
    </div>
  );
}
