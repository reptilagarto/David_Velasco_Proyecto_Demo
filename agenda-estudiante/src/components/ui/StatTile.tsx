import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONOS = {
  primary: "bg-primary-soft text-primary",
  academica: "bg-academica-soft text-academica",
  laboral: "bg-laboral-soft text-laboral",
  personal: "bg-personal-soft text-personal",
} as const;

export type TonoIndicador = keyof typeof TONOS;

/** Cifra clave con icono y etiqueta, en tonos de la paleta. */
export function StatTile({
  etiqueta,
  valor,
  icono: Icono,
  tono = "primary",
}: {
  etiqueta: string;
  valor: string | number;
  icono: LucideIcon;
  tono?: TonoIndicador;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 rounded-2xl p-3", TONOS[tono])}>
      <Icono className="size-4" aria-hidden />
      <p className="truncate text-lg font-bold leading-none tabular-nums">{valor}</p>
      <p className="text-[11px] font-medium opacity-80">{etiqueta}</p>
    </div>
  );
}
