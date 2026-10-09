"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Coffee, Clock3, Sparkles } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIAS } from "@/lib/categorias";
import { aMinutos, detectarHuecos, formatoDuracion, type Hueco } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Actividad } from "@/types";

type Elemento = { tipo: "actividad"; clave: string; inicio: number; datos: Actividad } | { tipo: "hueco"; clave: string; inicio: number; datos: Hueco };

/** Agenda diaria: bloques por categoría intercalados con los huecos libres detectados. */
export function AgendaDia() {
  const { actividades, fechaSeleccionada } = useAgenda();

  const delDia = actividades
    .filter((a) => a.fecha === fechaSeleccionada)
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio));

  const huecos = detectarHuecos(delDia);

  const elementos: Elemento[] = [
    ...delDia.map<Elemento>((a) => ({ tipo: "actividad", clave: a.id, inicio: aMinutos(a.inicio), datos: a })),
    ...huecos.map<Elemento>((h) => ({ tipo: "hueco", clave: h.id, inicio: aMinutos(h.inicio), datos: h })),
  ].sort((x, y) => x.inicio - y.inicio);

  const minutosLibres = huecos.reduce((t, h) => t + h.minutos, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-lg bg-primary-soft p-3.5 text-sm text-primary">
        <Sparkles className="size-5 shrink-0" aria-hidden />
        <p>
          {huecos.length > 0 ? (
            <>
              Tienes <strong>{formatoDuracion(minutosLibres)}</strong> libres en {huecos.length}{" "}
              {huecos.length === 1 ? "hueco" : "huecos"}. Toca un botón para aprovecharlos.
            </>
          ) : (
            <>No hay huecos libres de 30 min o más este día.</>
          )}
        </p>
      </div>

      <ol className="relative space-y-2.5" aria-label="Agenda del día">
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
          <li className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Día libre. Registra una actividad desde la pestaña Registro.
          </li>
        )}
      </ol>

      <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground" aria-label="Leyenda">
        {(Object.keys(CATEGORIAS) as (keyof typeof CATEGORIAS)[]).map((c) => (
          <li key={c} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-full", CATEGORIAS[c].punto)} aria-hidden />
            {CATEGORIAS[c].etiqueta}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-dashed border-primary" aria-hidden />
          Hueco libre
        </li>
      </ul>
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
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3 rounded-lg border-l-4 p-3.5 shadow-sm", info.bloque)}
    >
      <div className="w-12 shrink-0 text-sm font-semibold tabular-nums">
        {actividad.inicio}
        <span className="block text-xs font-normal text-muted-foreground">{actividad.fin}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-start gap-1.5 text-sm font-medium leading-snug">
          <Icono className="mt-0.5 size-4 shrink-0 opacity-80" aria-hidden />
          <span className="truncate">{actividad.titulo}</span>
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge variant={info.insignia}>{info.etiqueta}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock3 className="size-3" aria-hidden />
            {formatoDuracion(duracion)}
          </span>
        </div>
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
      className="rounded-lg border border-dashed border-primary/60 bg-primary-soft/40 p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">
            Libre · {hueco.inicio} – {hueco.fin}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatoDuracion(hueco.minutos)} disponibles · se reservarán {formatoDuracion(reservaMin)}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button variant="default" size="sm" className="w-full" onClick={() => reservarHueco(hueco, "estudio")}>
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
