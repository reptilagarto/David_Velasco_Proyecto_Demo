import type { Metadata } from "next";

import { SelectorDia } from "@/components/layout/SelectorDia";
import { FormularioActividad } from "@/components/captura/FormularioActividad";
import { ListaActividades } from "@/components/captura/ListaActividades";

export const metadata: Metadata = { title: "Registro rápido" };

export default function CapturaPage() {
  return (
    <div className="space-y-5">
      <section aria-labelledby="titulo-captura" className="space-y-3 pt-2">
        <div>
          <h2 id="titulo-captura" className="text-xl font-semibold tracking-tight">
            Registrar actividad
          </h2>
          <p className="text-sm text-muted-foreground">Tres toques: categoría, horario y guardar.</p>
        </div>
        <SelectorDia />
      </section>

      <FormularioActividad />
      <ListaActividades />
    </div>
  );
}
