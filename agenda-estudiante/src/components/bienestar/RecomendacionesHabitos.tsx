import { Apple, Droplet, Dumbbell, Moon, PersonStanding, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RECOMENDACIONES_INICIALES } from "@/data/mockData";
import type { CategoriaHabito } from "@/types";

const ICONOS: Record<CategoriaHabito, LucideIcon> = {
  pausa: PersonStanding,
  hidratacion: Droplet,
  ejercicio: Dumbbell,
  descanso: Moon,
  alimentacion: Apple,
};

export function RecomendacionesHabitos() {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-4">
      {RECOMENDACIONES_INICIALES.map((r) => {
        const Icono = ICONOS[r.categoria];
        return (
          <Card key={r.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="gap-3 pb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icono className="size-5" aria-hidden />
              </span>
              <CardTitle className="text-sm">{r.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-xs leading-relaxed">{r.descripcion}</CardDescription>
              <Badge variant="muted">{r.duracion}</Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
