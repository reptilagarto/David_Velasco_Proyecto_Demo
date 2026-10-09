import { PageHeader } from "@/components/ui/PageHeader";
import { RecomendacionesHabitos } from "@/components/bienestar/RecomendacionesHabitos";
import { ChecklistDiaria } from "@/components/bienestar/ChecklistDiaria";
import { RecursosApoyo } from "@/components/bienestar/RecursosApoyo";

export function BienestarScreen() {
  return (
    <div className="space-y-7">
      <PageHeader eyebrow="Bienestar" titulo="Hábitos saludables" descripcion="Pequeñas pausas que hacen una gran diferencia." />
      <section aria-labelledby="titulo-recomendaciones" className="space-y-3">
        <h3 id="titulo-recomendaciones" className="text-base font-bold">
          Recomendaciones
        </h3>
        <RecomendacionesHabitos />
      </section>

      <section aria-labelledby="titulo-checklist" className="space-y-3">
        <h3 id="titulo-checklist" className="text-base font-bold">
          Mi lista de hoy
        </h3>
        <ChecklistDiaria />
      </section>

      <section aria-labelledby="titulo-recursos" className="space-y-3">
        <h3 id="titulo-recursos" className="text-base font-bold">
          Recursos de apoyo
        </h3>
        <RecursosApoyo />
      </section>
    </div>
  );
}
