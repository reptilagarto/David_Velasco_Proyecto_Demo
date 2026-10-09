import { Briefcase, GraduationCap, User, type LucideIcon } from "lucide-react";

import type { Categoria, Prioridad } from "@/types";

/** Clases literales para que Tailwind las detecte. */
export interface InfoCategoria {
  etiqueta: string;
  icono: LucideIcon;
  /** Fondo suave para tarjetas y selectores activos. */
  soft: string;
  /** Color de texto para iconos y etiquetas. */
  texto: string;
  /** Borde lateral de acento. */
  acento: string;
  /** Color sólido para puntos y barras. */
  punto: string;
  /** Variante de insignia. */
  insignia: "academica" | "laboral" | "personal";
}

export const CATEGORIAS: Record<Categoria, InfoCategoria> = {
  academica: {
    etiqueta: "Académica",
    icono: GraduationCap,
    soft: "bg-academica-soft",
    texto: "text-academica",
    acento: "border-academica",
    punto: "bg-academica",
    insignia: "academica",
  },
  laboral: {
    etiqueta: "Laboral",
    icono: Briefcase,
    soft: "bg-laboral-soft",
    texto: "text-laboral",
    acento: "border-laboral",
    punto: "bg-laboral",
    insignia: "laboral",
  },
  personal: {
    etiqueta: "Personal",
    icono: User,
    soft: "bg-personal-soft",
    texto: "text-personal",
    acento: "border-personal",
    punto: "bg-personal",
    insignia: "personal",
  },
};

export const PRIORIDADES: Record<Prioridad, { etiqueta: string; clase: string }> = {
  alta: { etiqueta: "Alta", clase: "bg-destructive-soft text-destructive" },
  media: { etiqueta: "Media", clase: "bg-primary-soft text-primary" },
  baja: { etiqueta: "Baja", clase: "bg-muted text-muted-foreground" },
};
