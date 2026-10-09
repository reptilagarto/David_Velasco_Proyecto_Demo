import { ExternalLink, HeartHandshake, Building2, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RECURSOS_INICIALES } from "@/data/mockData";

export function RecursosApoyo() {
  return (
    <div className="space-y-3">
      {RECURSOS_INICIALES.map((recurso) => {
        const institucional = recurso.origen === "institucional";
        const Icono = institucional ? Building2 : Users;
        return (
          <Card key={recurso.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex-row items-start gap-3 pb-2">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-personal-soft text-personal">
                <Icono className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-sm">{recurso.titulo}</CardTitle>
                  <Badge variant={institucional ? "academica" : "personal"}>
                    {institucional ? "Institucional" : "Comunitario"}
                  </Badge>
                </div>
                <CardDescription className="mt-1 text-xs">{recurso.descripcion}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              <span>{recurso.contacto}</span>
            </CardContent>
          </Card>
        );
      })}

      <p className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        <HeartHandshake className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Si sientes que la carga es demasiado grande, pide ayuda. En una emergencia, contacta a los servicios de
        emergencia de tu país.
      </p>
    </div>
  );
}
