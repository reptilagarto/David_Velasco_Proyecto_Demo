"use client";

import * as React from "react";
import { CalendarClock } from "lucide-react";

import { formatoFechaLarga } from "@/lib/time";

const dosDigitos = (n: number) => String(n).padStart(2, "0");

/** Banner con la fecha y la hora actual. Se muestra solo tras montar para evitar diferencias entre servidor y cliente. */
export function FechaHoraBanner() {
  const [ahora, setAhora] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const actualizar = () => setAhora(new Date());
    actualizar();
    const intervalo = window.setInterval(actualizar, 30_000);
    return () => window.clearInterval(intervalo);
  }, []);

  const fecha = ahora
    ? formatoFechaLarga(`${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`)
    : "Cargando…";
  const hora = ahora ? `${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}` : "--:--";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-primary-soft px-4 py-2.5 text-primary shadow-sm">
      <CalendarClock className="size-5 shrink-0" aria-hidden />
      <div>
        <p className="text-xs font-semibold">{fecha}</p>
        <p className="text-xl font-bold leading-none tabular-nums text-foreground">{hora}</p>
      </div>
    </div>
  );
}
