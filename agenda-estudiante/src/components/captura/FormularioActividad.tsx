"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIAS, PRIORIDADES } from "@/lib/categorias";
import { aMinutos } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Categoria, Prioridad } from "@/types";

const CATEGORIAS_ORDEN: Categoria[] = ["academica", "laboral", "personal"];
const PRIORIDADES_ORDEN: Prioridad[] = ["alta", "media", "baja"];

interface Borrador {
  titulo: string;
  categoria: Categoria;
  fecha: string;
  inicio: string;
  fin: string;
  prioridad: Prioridad;
}

interface Errores {
  titulo?: string;
  horas?: string;
}

function validar(b: Borrador): Errores {
  const errores: Errores = {};
  if (b.titulo.trim().length < 3) errores.titulo = "Escribe un título de al menos 3 letras.";
  if (!b.inicio || !b.fin) errores.horas = "Indica hora de inicio y de fin.";
  else if (aMinutos(b.fin) <= aMinutos(b.inicio)) errores.horas = "La hora de fin debe ser posterior al inicio.";
  return errores;
}

export function FormularioActividad() {
  const { fechaSeleccionada, agregarActividad } = useAgenda();

  const [borrador, setBorrador] = React.useState<Borrador>({
    titulo: "",
    categoria: "academica",
    fecha: fechaSeleccionada,
    inicio: "09:00",
    fin: "10:00",
    prioridad: "media",
  });
  const [errores, setErrores] = React.useState<Errores>({});
  const [intentos, setIntentos] = React.useState(0);

  // Sincroniza la fecha del formulario con el día elegido en la tira semanal.
  React.useEffect(() => {
    setBorrador((b) => ({ ...b, fecha: fechaSeleccionada }));
  }, [fechaSeleccionada]);

  const actualizar = <K extends keyof Borrador>(campo: K, valor: Borrador[K]) => {
    const siguiente = { ...borrador, [campo]: valor };
    setBorrador(siguiente);
    // Tras el primer intento, los errores se revalidan en vivo para dar retroalimentación inmediata.
    if (intentos > 0) setErrores(validar(siguiente));
  };

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIntentos((n) => n + 1);
    const nuevosErrores = validar(borrador);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    agregarActividad({ ...borrador, titulo: borrador.titulo.trim() });
    setBorrador((b) => ({ ...b, titulo: "" }));
    setErrores({});
    setIntentos(0);
  };

  return (
    <form onSubmit={enviar} noValidate className="space-y-5 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
      <Tabs
        value={borrador.categoria}
        onValueChange={(v) => actualizar("categoria", v as Categoria)}
      >
        <TabsList aria-label="Categoría">
          {CATEGORIAS_ORDEN.map((c) => {
            const info = CATEGORIAS[c];
            const Icono = info.icono;
            return (
              <TabsTrigger key={c} value={c} className="data-[state=active]:text-foreground">
                <Icono aria-hidden />
                <span className="hidden min-[360px]:inline">{info.etiqueta}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          placeholder="Ej. Entregar informe de prácticas"
          value={borrador.titulo}
          onChange={(e) => actualizar("titulo", e.target.value)}
          aria-invalid={Boolean(errores.titulo)}
          aria-describedby={errores.titulo ? "error-titulo" : undefined}
          autoComplete="off"
        />
        {errores.titulo && (
          <p id="error-titulo" className="text-xs text-destructive">
            {errores.titulo}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="fecha">Fecha</Label>
          <Input id="fecha" type="date" value={borrador.fecha} onChange={(e) => actualizar("fecha", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="inicio">Inicio</Label>
          <Input id="inicio" type="time" value={borrador.inicio} onChange={(e) => actualizar("inicio", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fin">Fin</Label>
          <Input id="fin" type="time" value={borrador.fin} onChange={(e) => actualizar("fin", e.target.value)} />
        </div>
      </div>
      {errores.horas && <p className="-mt-3 text-xs text-destructive">{errores.horas}</p>}

      <fieldset className="space-y-1.5">
        <legend className="mb-1.5 text-sm font-medium leading-none">Prioridad</legend>
        <div className="grid grid-cols-3 gap-2">
          {PRIORIDADES_ORDEN.map((p) => {
            const activa = borrador.prioridad === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={activa}
                onClick={() => actualizar("prioridad", p)}
                className={cn(
                  "relative h-10 cursor-pointer rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activa ? "border-primary bg-primary-soft text-primary" : "border-input bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {PRIORIDADES[p].etiqueta}
              </button>
            );
          })}
        </div>
      </fieldset>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button type="submit" size="lg" className="w-full">
          <Plus aria-hidden />
          Guardar actividad
        </Button>
      </motion.div>
    </form>
  );
}
