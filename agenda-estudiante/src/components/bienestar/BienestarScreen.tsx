import { RecomendacionesHabitos } from "@/components/bienestar/RecomendacionesHabitos";
import { ChecklistDiaria } from "@/components/bienestar/ChecklistDiaria";
import { RecursosApoyo } from "@/components/bienestar/RecursosApoyo";

export function BienestarScreen() {
  return (
    <div className="space-y-8">
      <section aria-labelledby="titulo-recomendaciones" className="space-y-3 pt-2">
        <div>
          <h2 id="titulo-recomendaciones" className="text-xl font-semibold tracking-tight">
            Hábitos saludables
          </h2>
          <p className="text-sm text-muted-foreground">Pequeñas pausas que hacen una gran diferencia.</p>
        </div>
        <RecomendacionesHabitos />
      </section>

      <section aria-labelledby="titulo-checklist" className="space-y-3">
        <h3 id="titulo-checklist" className="text-base font-semibold">
          Mi lista de hoy
        </h3>
        <ChecklistDiaria />
      </section>

      <section aria-labelledby="titulo-recursos" className="space-y-3">
        <h3 id="titulo-recursos" className="text-base font-semibold">
          Recursos de apoyo
        </h3>
        <RecursosApoyo />
      </section>
    </div>
  );
}
