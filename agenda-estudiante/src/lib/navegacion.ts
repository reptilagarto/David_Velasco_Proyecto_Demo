import { CalendarDays, HeartPulse, ListChecks, PencilLine, type LucideIcon } from "lucide-react";

export interface EnlaceNavegacion {
  href: string;
  etiqueta: string;
  icono: LucideIcon;
}

/** Secciones de la app; las usan la barra inferior (móvil) y la lateral (escritorio). */
export const ENLACES_NAVEGACION: EnlaceNavegacion[] = [
  { href: "/captura", etiqueta: "Registro", icono: PencilLine },
  { href: "/calendario", etiqueta: "Calendario", icono: CalendarDays },
  { href: "/plan", etiqueta: "Plan", icono: ListChecks },
  { href: "/bienestar", etiqueta: "Bienestar", icono: HeartPulse },
];
