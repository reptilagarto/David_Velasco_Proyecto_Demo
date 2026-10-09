"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Coffee, Clock3, Sparkles } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Button } from "@/components/ui/button";
import { CATEGORIAS } from "@/lib/categorias";
import { aMinutos, detectarHuecos, formatoDuracion, type Hueco } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Actividad } from "@/types";

type Elemento =
  | { tipo: "actividad"; clave: string; inicio: number; datos: Actividad }
  | { tipo: "hueco"; clave: string; inicio: number; datos: Hueco };

/** Agenda del día: actividades y huecos libres ordenados por hora. */
export function AgendaDia() {
  const { actividades, fechaSeleccionada } = useAgenda();

  const delDia = actividades
    .filter((a) => a.fecha === fechaSeleccionada)
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio));

  const huecos = detectarHuecos(delDia);
  const minutosLibres = huecos.reduce((t, h) => t + h.minutos, 0);

  const elementos: Elemento[] = [
    ...delDia.map<Elemento>((a) => ({ tipo: "actividad", clave: a.id, inicio: aMinutos(a.inicio), datos: a })),
    ...huecos.map<Elemento>((h) => ({ tipo: "hueco", clave: h.id, inicio: aMinutos(h.inicio), datos: h })),
  ].sort((x, y) => x.inicio - y.inicio);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 rounded-xl bg-primary-soft px-3.5 py-2.5 text-sm text-primary">
        <Sparkles className="size-4 shrink-0" aria-hidden />
        <p>
          {huecos.length > 0 ? (
            <>
              <strong>{formatoDuracion(minutosLibres)}</strong> libres en {huecos.length}{" "}
              {huecos.length === 1 ? "hueco" : "huecos"}. Aprovéchalos con un toque.
            </>
          ) : (
            <>No hay huecos libres de 30 min o más.</>
          )}
        </p>
      </div>

      <ol className="space-y-2.5" aria-label="Agenda del día">
        <AnimatePresence initial={false}>
          {elementos.map((el) =>
            el.tipo === "actividad" ? (
              <BloqueActividad key={el.clave} actividad={el.datos} />
            ) : (
              <HuecoLibre key={el.clave} hueco={el.datos} />
            ),
          )}
        </AnimatePresence>
        {elementos.length === 0 && (
          <li className="rounded-xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            Día libre. Registra una actividad desde la pestaña Registro.
          </li>
        )}
      </ol>
    </div>
  );
}

function BloqueActividad({ actividad }: { actividad: Actividad }) {
  const info = CATEGORIAS[actividad.categoria];
  const Icono = info.icono;
  const duracion = aMinutos(actividad.fin) - aMinutos(actividad.inicio);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="flex items-stretch gap-3 rounded-2xl bg-card p-3.5 shadow-sm ring-1 ring-border"
    >
      <span className={cn("w-1 shrink-0 rounded-full", info.punto)} aria-hidden />
      <div className="w-12 shrink-0 tabular-nums">
        <p className="text-sm font-bold">{actividad.inicio}</p>
        <p className="text-xs text-muted-foreground">{actividad.fin}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Icono className={cn("size-4 shrink-0", info.texto)} aria-hidden />
          <span className="truncate">{actividad.titulo}</span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock3 className="size-3" aria-hidden />
          {formatoDuracion(duracion)}
        </p>
      </div>
    </motion.li>
  );
}

function HuecoLibre({ hueco }: { hueco: Hueco }) {
  const { reservarHueco } = useAgenda();
  const reservaMin = Math.min(hueco.minutos, 60);

  return (
    <motion.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border-2 border-dashed border-primary/35 bg-primary-soft/50 p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary tabular-nums">
            Libre · {hueco.inicio} – {hueco.fin}
          </p>
          <p className="text-xs text-muted-foreground">
            Se reservarán {formatoDuracion(reservaMin)} de {formatoDuracion(hueco.minutos)}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button size="sm" className="w-full" onClick={() => reservarHueco(hueco, "estudio")}>
            <BookOpen aria-hidden />
            Estudiar
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button variant="outline" size="sm" className="w-full" onClick={() => reservarHueco(hueco, "descanso")}>
            <Coffee aria-hidden />
            Descansar
          </Button>
        </motion.div>
      </div>
    </motion.li>
  );
}
