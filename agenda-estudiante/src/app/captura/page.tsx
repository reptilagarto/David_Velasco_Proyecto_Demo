import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/PageHeader";
import { SelectorDia } from "@/components/layout/SelectorDia";
import { RegistroRapido } from "@/components/captura/RegistroRapido";
import { ListaActividades } from "@/components/captura/ListaActividades";

export const metadata: Metadata = { title: "Registro" };

export default function CapturaPage() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="space-y-5">
        <PageHeader eyebrow="Registro" titulo="Nueva actividad" descripcion="Elige el día y registra en tres toques." />
        <SelectorDia />
        <RegistroRapido />
      </div>
      <div className="lg:sticky lg:top-6">
        <ListaActividades />
      </div>
    </div>
  );
}
