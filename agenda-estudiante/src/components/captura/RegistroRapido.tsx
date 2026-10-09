"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Button } from "@/components/ui/button";
import { CATEGORIAS, PRIORIDADES } from "@/lib/categorias";
import { aMinutos, formatoFechaLarga } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Categoria, Prioridad } from "@/types";

const CATEGORIAS_ORDEN: Categoria[] = ["academica", "laboral", "personal"];
const PRIORIDADES_ORDEN: Prioridad[] = ["alta", "media", "baja"];

/** Registro: título, categoría, hora de inicio y de fin, y prioridad. El día lo elige el calendario. */
export function RegistroRapido() {
  const { fechaSeleccionada, agregarActividad } = useAgenda();

  const [titulo, setTitulo] = React.useState("");
  const [categoria, setCategoria] = React.useState<Categoria>("academica");
  const [inicio, setInicio] = React.useState("09:00");
  const [fin, setFin] = React.useState("10:00");
  const [prioridad, setPrioridad] = React.useState<Prioridad>("media");
  const [intentado, setIntentado] = React.useState(false);

  const horasValidas = Boolean(inicio && fin) && aMinutos(fin) > aMinutos(inicio);
  const errorTitulo = intentado && titulo.trim().length < 3 ? "Escribe al menos 3 letras." : null;
  const errorHoras = intentado && !horasValidas ? "La hora de fin debe ser posterior a la de inicio." : null;
  const info = CATEGORIAS[categoria];
  const Icono = info.icono;

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIntentado(true);
    if (titulo.trim().length < 3 || !horasValidas) return;
    agregarActividad({ titulo: titulo.trim(), categoria, fecha: fechaSeleccionada, inicio, fin, prioridad });
    setTitulo("");
    setIntentado(false);
  };

  return (
    <form onSubmit={enviar} noValidate className="space-y-5 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-5">
      {/* Categoría */}
      <fieldset className="space-y-2">
        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categoría</legend>
        <div role="radiogroup" className="grid grid-cols-3 gap-2">
          {CATEGORIAS_ORDEN.map((c) => {
            const item = CATEGORIAS[c];
            const CatIcono = item.icono;
            const activa = categoria === c;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={activa}
                onClick={() => setCategoria(c)}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border py-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activa ? "border-transparent text-foreground" : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {activa && (
                  <motion.span
                    layoutId="categoria-activa"
                    className={cn("absolute inset-0 rounded-2xl", item.soft)}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <CatIcono className={cn("relative size-5", activa && item.texto)} aria-hidden />
                <span className="relative">{item.etiqueta}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Título */}
      <div className="space-y-1.5">
        <label htmlFor="titulo" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Qué vas a hacer
        </label>
        <input
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Entregar informe de prácticas"
          autoComplete="off"
          aria-invalid={Boolean(errorTitulo)}
          aria-describedby={errorTitulo ? "error-titulo" : undefined}
          className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base font-medium placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errorTitulo && (
          <p id="error-titulo" className="text-xs font-medium text-destructive">
            {errorTitulo}
          </p>
        )}
      </div>

      {/* Horas: inicio y fin */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="inicio" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hora de inicio
          </label>
          <input
            id="inicio"
            type="time"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            aria-invalid={Boolean(errorHoras)}
            className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="fin" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Hora de fin
          </label>
          <input
            id="fin"
            type="time"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            aria-invalid={Boolean(errorHoras)}
            className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base font-semibold tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      {errorHoras && <p className="-mt-2 text-xs font-medium text-destructive">{errorHoras}</p>}

      {/* Prioridad */}
      <div role="radiogroup" aria-label="Prioridad" className="flex items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Prioridad</span>
        {PRIORIDADES_ORDEN.map((p) => {
          const activa = prioridad === p;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={activa}
              onClick={() => setPrioridad(p)}
              className={cn(
                "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activa ? PRIORIDADES[p].clase + " ring-1 ring-current" : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {PRIORIDADES[p].etiqueta}
            </button>
          );
        })}
      </div>

      {/* Vista previa */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Vista previa</p>
        <motion.div
          key={categoria}
          initial={{ opacity: 0.6, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("flex items-center gap-3 rounded-xl border-l-4 p-3", info.soft, info.acento)}
        >
          <span className="shrink-0 text-sm font-bold tabular-nums">{inicio || "--:--"}</span>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm font-semibold", !titulo.trim() && "italic text-muted-foreground")}>
              {titulo.trim() || "Tu actividad aparecerá aquí"}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
              <Icono className="size-3" aria-hidden />
              {inicio || "--:--"} – {fin || "--:--"}
            </p>
          </div>
        </motion.div>
      </div>

      <p className="text-xs text-muted-foreground">
        Se guardará en: <span className="font-semibold text-foreground">{formatoFechaLarga(fechaSeleccionada)}</span>
      </p>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button type="submit" size="lg" className="h-12 w-full text-base">
          <Plus aria-hidden />
          Agregar a mi agenda
        </Button>
      </motion.div>
    </form>
  );
}
