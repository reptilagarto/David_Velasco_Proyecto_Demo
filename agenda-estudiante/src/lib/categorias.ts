import { Briefcase, GraduationCap, User, type LucideIcon } from "lucide-react";

import type { Categoria } from "@/types";

export interface InfoCategoria {
  etiqueta: string;
  icono: LucideIcon;
  /** Clases para bloques de la agenda (fondo suave + borde de acento). */
  bloque: string;
  /** Color de acento para bordes laterales. */
  acento: string;
  /** Color sólido para puntos e indicadores. */
  punto: string;
  /** Clases de la insignia. */
  insignia: "academica" | "laboral" | "personal";
}

export const CATEGORIAS: Record<Categoria, InfoCategoria> = {
  academica: {
    etiqueta: "Académica",
    icono: GraduationCap,
    bloque: "bg-academica-soft border-academica text-foreground",
    acento: "border-academica",
    punto: "bg-academica",
    insignia: "academica",
  },
  laboral: {
    etiqueta: "Laboral",
    icono: Briefcase,
    bloque: "bg-laboral-soft border-laboral text-foreground",
    acento: "border-laboral",
    punto: "bg-laboral",
    insignia: "laboral",
  },
  personal: {
    etiqueta: "Personal",
    icono: User,
    bloque: "bg-personal-soft border-personal text-foreground",
    acento: "border-personal",
    punto: "bg-personal",
    insignia: "personal",
  },
};

export const PRIORIDADES = {
  alta: { etiqueta: "Alta", clase: "bg-destructive-soft text-destructive" },
  media: { etiqueta: "Media", clase: "bg-primary-soft text-primary" },
  baja: { etiqueta: "Baja", clase: "bg-muted text-muted-foreground" },
} as const;
