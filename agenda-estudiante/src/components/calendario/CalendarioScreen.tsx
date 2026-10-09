"use client";

import { CalendarioMes } from "@/components/calendario/CalendarioMes";
import { DetalleDia } from "@/components/calendario/DetalleDia";
import { PageHeader } from "@/components/ui/PageHeader";

export function CalendarioScreen() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Agenda" titulo="Calendario" descripcion="Toca un día para ver su detalle." />
      <CalendarioMes />
      <DetalleDia />
    </div>
  );
}
