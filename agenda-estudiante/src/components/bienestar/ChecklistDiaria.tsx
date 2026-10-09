"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Trophy } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { cn } from "@/lib/utils";

const COLORES_FESTEJO = ["#1f5fb4", "#c8102e", "#6fa3e0", "#ffffff", "#0f2a4a", "#e4edfa"];

interface Rafaga {
  id: number;
  x: number;
  y: number;
}

/** Lista de verificación diaria con retroalimentación festiva al completar cada hábito. */
export function ChecklistDiaria() {
  const { habitos, alternarHabito, notificar } = useAgenda();
  const [rafagas, setRafagas] = React.useState<Rafaga[]>([]);
  const cuenta = React.useRef(0);

  const completados = habitos.filter((h) => h.completado).length;
  const porcentaje = habitos.length ? Math.round((completados / habitos.length) * 100) : 0;
  const diaCompleto = completados === habitos.length && habitos.length > 0;

  const alternar = (id: string, origen: HTMLElement | null) => {
    const estabaCompletado = habitos.find((h) => h.id === id)?.completado;
    alternarHabito(id);
    if (estabaCompletado || !origen) return;

    // Calcula el centro del botón para lanzar la ráfaga desde ahí.
    const rect = origen.getBoundingClientRect();
    const contenedor = origen.closest("[data-checklist]")?.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - (contenedor?.left ?? 0);
    const y = rect.top + rect.height / 2 - (contenedor?.top ?? 0);

    cuenta.current += 1;
    const id2 = cuenta.current;
    setRafagas((r) => [...r, { id: id2, x, y }]);
    window.setTimeout(() => setRafagas((r) => r.filter((item) => item.id !== id2)), 1000);

    const restantes = habitos.filter((h) => !h.completado && h.id !== id).length;
    notificar(restantes === 0 ? "¡Hoy completaste todos tus hábitos!" : "¡Logro desbloqueado!");
  };

  return (
    <div data-checklist className="relative rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Hábitos de hoy</span>
          <span className="tabular-nums text-muted-foreground">
            {completados}/{habitos.length}
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de hábitos">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-personal"
            initial={false}
            animate={{ width: `${porcentaje}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {habitos.map((h) => (
          <li key={h.id} className="relative">
            <motion.button
              type="button"
              role="checkbox"
              aria-checked={h.completado}
              onClick={(e) => alternar(h.id, e.currentTarget)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                h.completado ? "border-primary/40 bg-primary-soft/50" : "border-border bg-card hover:bg-muted/60",
              )}
            >
              <motion.span
                animate={h.completado ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  h.completado ? "border-primary bg-primary text-primary-foreground" : "border-input",
                )}
              >
                <AnimatePresence>
                  {h.completado && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check className="size-3.5" aria-hidden />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm font-medium", h.completado && "text-muted-foreground line-through")}>
                  {h.nombre}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{h.descripcion}</span>
              </span>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {rafagas.map((r) => (
          <Rafaga key={r.id} x={r.x} y={r.y} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {diaCompleto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mt-4 flex items-center gap-3 rounded-lg bg-primary p-4 text-primary-foreground"
          >
            <motion.span animate={{ rotate: [0, -12, 12, -6, 0] }} transition={{ duration: 0.8, delay: 0.2 }}>
              <Trophy className="size-7" aria-hidden />
            </motion.span>
            <div>
              <p className="font-semibold">¡Día completo!</p>
              <p className="text-sm opacity-90">Cuidaste tu cuerpo y tu mente. Sigue así.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Ráfaga de partículas que se expande desde el punto donde se marcó el hábito. */
function Rafaga({ x, y }: { x: number; y: number }) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }} aria-hidden>
      {COLORES_FESTEJO.map((color, i) => {
        const angulo = (i / COLORES_FESTEJO.length) * Math.PI * 2;
        const distancia = 46;
        return (
          <motion.span
            key={i}
            className="absolute -ml-1.5 -mt-1.5 block size-3 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
            animate={{
              x: Math.cos(angulo) * distancia,
              y: Math.sin(angulo) * distancia,
              opacity: 0,
              scale: 1.1,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
