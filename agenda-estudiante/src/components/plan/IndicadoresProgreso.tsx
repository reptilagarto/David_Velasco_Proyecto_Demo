"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { ASIGNATURAS } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatoDuracion } from "@/lib/time";

/** Indicadores en tiempo real: avance de tareas y tiempo planificado frente al real. */
export function IndicadoresProgreso() {
  const { tareas } = useAgenda();

  const completadas = tareas.filter((t) => t.completada).length;
  const porcentaje = tareas.length ? Math.round((completadas / tareas.length) * 100) : 0;

  const planificado = tareas.reduce((t, x) => t + x.minutosPlanificados, 0);
  const real = tareas.reduce((t, x) => t + x.minutosReales, 0);
  const maximo = Math.max(...ASIGNATURAS.map((asig) => sumar(tareas, asig.id, "minutosPlanificados")), 1);

  return (
    <div className="grid gap-4">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="size-4 text-primary" aria-hidden />
            Tareas completadas
          </CardTitle>
          <CardDescription>
            {completadas} de {tareas.length} tareas · {porcentaje}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="h-3 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Porcentaje de tareas completadas"
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 text-primary" aria-hidden />
            Planificado frente a real
          </CardTitle>
          <CardDescription>
            Real: {formatoDuracion(real)} de {formatoDuracion(planificado)} planificados
            {" · "}
            <span className={real > planificado ? "text-laboral" : "text-personal"}>
              {Math.round((real / Math.max(planificado, 1)) * 100)}%
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ASIGNATURAS.map((asig) => {
            const plan = sumar(tareas, asig.id, "minutosPlanificados");
            const reales = sumar(tareas, asig.id, "minutosReales");
            return (
              <div key={asig.id} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{asig.nombre}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatoDuracion(reales)} / {formatoDuracion(plan)}
                  </span>
                </div>
                <BarraComparativa valor={plan} maximo={maximo} clase="bg-muted-foreground/25" etiqueta="Planificado" />
                <BarraComparativa valor={reales} maximo={maximo} clase="bg-primary" etiqueta="Real" />
              </div>
            );
          })}
          <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-muted-foreground/25" aria-hidden /> Planificado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-primary" aria-hidden /> Real
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function sumar(
  tareas: { asignaturaId: string; minutosPlanificados: number; minutosReales: number }[],
  asignaturaId: string,
  campo: "minutosPlanificados" | "minutosReales",
) {
  return tareas.filter((t) => t.asignaturaId === asignaturaId).reduce((t, x) => t + x[campo], 0);
}

function BarraComparativa({ valor, maximo, clase, etiqueta }: { valor: number; maximo: number; clase: string; etiqueta: string }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${etiqueta}: ${formatoDuracion(valor)}`}>
      <motion.div
        className={`h-full rounded-full ${clase}`}
        initial={false}
        animate={{ width: `${(valor / maximo) * 100}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}
