"use client";

import * as React from "react";

import { SelectorDia } from "@/components/layout/SelectorDia";
import { AgendaDia } from "@/components/calendario/AgendaDia";
import { VistaSemana } from "@/components/calendario/VistaSemana";
import { useAgenda } from "@/context/AgendaContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, CalendarRange } from "lucide-react";
import { formatoFechaLarga } from "@/lib/time";

export function CalendarioScreen() {
  const { fechaSeleccionada, seleccionarFecha } = useAgenda();
  const [vista, setVista] = React.useState<"dia" | "semana">("dia");

  return (
    <div className="space-y-5">
      <section className="space-y-3 pt-2">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Calendario</h2>
            <p className="text-sm text-muted-foreground">{formatoFechaLarga(fechaSeleccionada)}</p>
          </div>
        </div>

        <Tabs value={vista} onValueChange={(v) => setVista(v as "dia" | "semana")}>
          <TabsList aria-label="Tipo de vista">
            <TabsTrigger value="dia">
              <CalendarDays aria-hidden />
              Día
            </TabsTrigger>
            <TabsTrigger value="semana">
              <CalendarRange aria-hidden />
              Semana
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {vista === "dia" && <SelectorDia />}
      </section>

      {vista === "dia" ? (
        <AgendaDia />
      ) : (
        <VistaSemana
          onSeleccionarDia={(fecha) => {
            seleccionarFecha(fecha);
            setVista("dia");
          }}
        />
      )}
    </div>
  );
}
