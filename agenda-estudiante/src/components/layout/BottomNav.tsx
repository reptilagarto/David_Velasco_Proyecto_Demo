"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, HeartPulse, ListChecks, PencilLine, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const ENLACES: { href: string; etiqueta: string; icono: LucideIcon }[] = [
  { href: "/captura", etiqueta: "Registro", icono: PencilLine },
  { href: "/calendario", etiqueta: "Agenda", icono: CalendarDays },
  { href: "/plan", etiqueta: "Plan", icono: ListChecks },
  { href: "/bienestar", etiqueta: "Bienestar", icono: HeartPulse },
];

export function BottomNav() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-2xl border-t border-border bg-card/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-md"
    >
      <ul className="grid grid-cols-4 gap-1">
        {ENLACES.map(({ href, etiqueta, icono: Icono }) => {
          const activo = ruta === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors",
                  activo ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {activo && (
                  <motion.span
                    layoutId="indicador-nav"
                    className="absolute inset-x-3 -top-2 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icono className="size-5" aria-hidden />
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
