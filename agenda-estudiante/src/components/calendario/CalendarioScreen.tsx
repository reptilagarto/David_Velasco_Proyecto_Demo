"use client";

import { CalendarioMes } from "@/components/calendario/CalendarioMes";
import { DetalleDia } from "@/components/calendario/DetalleDia";
import { PageHeader } from "@/components/ui/PageHeader";

export function CalendarioScreen() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-8">
      <div className="space-y-5 lg:sticky lg:top-6">
        <PageHeader eyebrow="Agenda" titulo="Calendario" descripcion="Toca un día para ver su detalle." />
        <CalendarioMes />
      </div>
      <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-5 lg:p-6">
        <DetalleDia />
      </div>
    </div>
  );
}
