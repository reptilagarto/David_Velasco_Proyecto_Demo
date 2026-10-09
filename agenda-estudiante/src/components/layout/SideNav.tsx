"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { ENLACES_NAVEGACION } from "@/lib/navegacion";
import { cn } from "@/lib/utils";

/** Navegación lateral fija para pantallas grandes (desde 1024 px). */
export function SideNav() {
  const ruta = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <CalendarDays className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-base font-bold leading-tight">Mi semana</p>
          <p className="text-xs text-muted-foreground">Agenda del estudiante</p>
        </div>
      </div>

      <nav aria-label="Navegación principal">
        <ul className="space-y-1">
          {ENLACES_NAVEGACION.map(({ href, etiqueta, icono: Icono }) => {
            const activo = ruta === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    activo ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icono className="size-5" aria-hidden />
                  {etiqueta}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
