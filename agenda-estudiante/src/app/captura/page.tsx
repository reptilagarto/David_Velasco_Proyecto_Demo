import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/PageHeader";
import { FechaHoraBanner } from "@/components/ui/FechaHoraBanner";
import { CalendarioMes } from "@/components/calendario/CalendarioMes";
import { RegistroRapido } from "@/components/captura/RegistroRapido";
import { ListaActividades } from "@/components/captura/ListaActividades";

export const metadata: Metadata = { title: "Registro" };

export default function CapturaPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Registro" titulo="Nueva actividad" descripcion="Elige el día en el calendario y registra tu actividad.">
        <FechaHoraBanner />
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start lg:gap-8">
        <RegistroRapido />
        <div className="space-y-5">
          <CalendarioMes />
          <ListaActividades />
        </div>
      </div>
    </div>
  );
}
