"use client";

import { CalendarioMes } from "@/components/calendario/CalendarioMes";
import { DetalleDia } from "@/components/calendario/DetalleDia";

export function CalendarioScreen() {
  return (
    <div className="space-y-6">
      <section className="pt-2">
        <h2 className="text-xl font-semibold tracking-tight">Calendario</h2>
        <p className="text-sm text-muted-foreground">Toca un día para ver sus actividades y entregas.</p>
      </section>

      <CalendarioMes />
      <DetalleDia />
    </div>
  );
}
