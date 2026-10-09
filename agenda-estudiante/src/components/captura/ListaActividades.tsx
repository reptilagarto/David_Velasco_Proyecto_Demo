"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarX2, Trash2 } from "lucide-react";

import { useAgenda } from "@/context/AgendaContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CATEGORIAS, PRIORIDADES } from "@/lib/categorias";
import { aMinutos, formatoDuracion } from "@/lib/time";
import type { Categoria } from "@/types";

const ORDEN_CATEGORIAS: Categoria[] = ["academica", "laboral", "personal"];

export function ListaActividades() {
  const { actividades, fechaSeleccionada, eliminarActividad } = useAgenda();

  const delDia = actividades
    .filter((a) => a.fecha === fechaSeleccionada)
    .sort((a, b) => aMinutos(a.inicio) - aMinutos(b.inicio));

  const minutosTotales = delDia.reduce((total, a) => total + aMinutos(a.fin) - aMinutos(a.inicio), 0);

  // Reparto de tiempo por categoría para la barra de progreso apilada.
  const porCategoria = ORDEN_CATEGORIAS.map((c) => {
    const minutos = delDia
      .filter((a) => a.categoria === c)
      .reduce((total, a) => total + aMinutos(a.fin) - aMinutos(a.inicio), 0);
    return { categoria: c, minutos, porcentaje: minutosTotales ? (minutos / minutosTotales) * 100 : 0 };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jornada</CardTitle>
        <CardDescription>
          {delDia.length} {delDia.length === 1 ? "actividad" : "actividades"}
          {minutosTotales > 0 && ` · ${formatoDuracion(minutosTotales)} en total`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {minutosTotales > 0 && (
          <div>
            <div className="flex h-2 overflow-hidden rounded-full bg-muted" role="img" aria-label="Reparto del tiempo por categoría">
              {porCategoria
                .filter((p) => p.minutos > 0)
                .map((p) => (
                  <motion.div
                    key={p.categoria}
                    className={CATEGORIAS[p.categoria].punto}
                    initial={{ width: 0 }}
                    animate={{ width: `${p.porcentaje}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {porCategoria.map((p) => (
                <li key={p.categoria} className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${CATEGORIAS[p.categoria].punto}`} aria-hidden />
                  {CATEGORIAS[p.categoria].etiqueta} · {formatoDuracion(p.minutos)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {delDia.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            <CalendarX2 className="size-8 opacity-60" aria-hidden />
            Sin actividades este día. Añade la primera arriba.
          </div>
        ) : (
          <ul className="space-y-2.5">
            <AnimatePresence initial={false}>
              {delDia.map((a) => {
                const info = CATEGORIAS[a.categoria];
                const Icono = info.icono;
                return (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-center gap-3 overflow-hidden rounded-lg border-l-4 bg-muted/50 p-3 border-y-0 border-r-0"
                    style={{ borderLeftColor: `var(--${a.categoria})` }}
                  >
                    <div className="w-14 shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
                      {a.inicio}
                      <span className="block text-xs font-normal">{a.fin}</span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.titulo}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <Badge variant={info.insignia} className="gap-1">
                          <Icono className="size-3" aria-hidden />
                          {info.etiqueta}
                        </Badge>
                        <Badge className={PRIORIDADES[a.prioridad].clase}>
                          {PRIORIDADES[a.prioridad].etiqueta}
                        </Badge>
                        {a.reservada && <Badge variant="muted">Reservado</Badge>}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => eliminarActividad(a.id)}
                      aria-label={`Eliminar ${a.titulo}`}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
