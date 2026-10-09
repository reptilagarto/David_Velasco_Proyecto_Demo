"use client";

import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

import { PageHeader } from "@/components/ui/PageHeader";

import { useAgenda } from "@/context/AgendaContext";
import { IndicadoresProgreso } from "@/components/plan/IndicadoresProgreso";
import { TarjetaAlerta } from "@/components/plan/TarjetaAlerta";
import { ListaTareas } from "@/components/plan/ListaTareas";

export function PlanScreen() {
  const { alertas } = useAgenda();
  const pendientes = alertas.filter((a) => a.estado === "pendiente").length;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Estudio" titulo="Plan de estudio" descripcion="Adaptado a tus turnos y clases de esta semana." />

      <IndicadoresProgreso />

      <section aria-labelledby="titulo-alertas" className="space-y-3">
        <h3 id="titulo-alertas" className="flex items-center gap-2 text-base font-semibold">
          <Bell className="size-4 text-primary" aria-hidden />
          Sugerencias
          {pendientes > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground tabular-nums">{pendientes}</span>
          )}
        </h3>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {alertas.map((alerta) => (
              <TarjetaAlerta key={alerta.id} alerta={alerta} />
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section aria-labelledby="titulo-tareas" className="space-y-3">
        <h3 id="titulo-tareas" className="text-base font-semibold">
          Tareas
        </h3>
        <ListaTareas />
      </section>
    </div>
  );
}
