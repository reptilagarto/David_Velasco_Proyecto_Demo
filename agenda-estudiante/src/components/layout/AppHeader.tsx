"use client";

import { CalendarDays } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { FECHA_HOY } from "@/data/mockData";
import { formatoFechaLarga } from "@/lib/time";

export function AppHeader() {
  const { conectadoBD } = useAgenda();

  return (
    <header className="sticky top-0 z-30 rounded-b-3xl bg-primary px-5 pb-5 pt-4 text-primary-foreground shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <CalendarDays className="size-5" aria-hidden />
          </span>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight">Mi semana</h1>
            <p className="text-xs opacity-80">{formatoFechaLarga(FECHA_HOY)}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium">
          <span className={conectadoBD ? "size-2 rounded-full bg-white" : "size-2 rounded-full bg-destructive ring-2 ring-white/40"} aria-hidden />
          {conectadoBD ? "Sincronizado" : "Datos locales"}
        </span>
      </div>
    </header>
  );
}
