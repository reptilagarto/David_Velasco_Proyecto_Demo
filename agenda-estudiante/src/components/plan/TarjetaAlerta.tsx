"use client";

import { motion } from "framer-motion";
import { BedDouble, BookOpen, Check, CheckCircle2, RefreshCw, X, AlertTriangle, type LucideIcon } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIAS, PRIORIDADES } from "@/lib/categorias";
import { formatoFechaCorta } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { Alerta, TipoAlerta } from "@/types";

const ICONOS: Record<TipoAlerta, LucideIcon> = {
  examen: AlertTriangle,
  entrega: BookOpen,
  descanso: BedDouble,
};

export function TarjetaAlerta({ alerta }: { alerta: Alerta }) {
  const { aceptarAlerta, reorganizarAlerta, rechazarAlerta } = useAgenda();
  const Icono = ICONOS[alerta.tipo];
  const slot = alerta.opciones[alerta.indice];
  const pendiente = alerta.estado === "pendiente";

  if (alerta.estado === "rechazada") {
    return (
      <motion.div
        layout
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.6 }}
        className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"
      >
        <X className="size-4" aria-hidden />
        <span className="line-through">{alerta.titulo}</span>
        <span className="ml-auto text-xs">Descartada</span>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={pendiente ? "border-primary/30" : "border-primary/50 bg-primary-soft/40"}>
        <CardHeader className="gap-2 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Icono className="size-4" aria-hidden />
              </span>
              <CardTitle className="text-sm leading-snug">{alerta.titulo}</CardTitle>
            </div>
            <Badge className={PRIORIDADES[alerta.prioridad].clase}>{PRIORIDADES[alerta.prioridad].etiqueta}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{alerta.mensaje}</p>

          <div className={cn("flex items-center gap-2 rounded-md border-l-4 bg-card p-2.5 text-sm", CATEGORIAS[alerta.categoria].acento)}>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{alerta.tituloBloque}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {formatoFechaCorta(slot.fecha)} · {slot.inicio} – {slot.fin}
                {alerta.reorganizada && " · reorganizada"}
              </p>
            </div>
          </div>

          {pendiente ? (
            <div className="grid grid-cols-3 gap-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="w-full" onClick={() => aceptarAlerta(alerta.id)}>
                  <Check aria-hidden />
                  Aceptar
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="w-full" onClick={() => reorganizarAlerta(alerta.id)}>
                  <RefreshCw aria-hidden />
                  Cambiar
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="ghost" className="w-full text-muted-foreground" onClick={() => rechazarAlerta(alerta.id)}>
                  <X aria-hidden />
                  Rechazar
                </Button>
              </motion.div>
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4" aria-hidden />
              Añadida a tu calendario
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
