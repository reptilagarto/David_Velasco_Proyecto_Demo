"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { ENLACES_NAVEGACION } from "@/lib/navegacion";
import { cn } from "@/lib/utils";

/** Barra inferior para celular y tableta. En escritorio se oculta y aparece la lateral. */
export function BottomNav() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl rounded-2xl border border-border bg-card/95 p-1.5 shadow-lg backdrop-blur-md lg:hidden"
    >
      <ul className="grid grid-cols-4 gap-1">
        {ENLACES_NAVEGACION.map(({ href, etiqueta, icono: Icono }) => {
          const activo = ruta === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-semibold transition-colors",
                  activo ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {activo && (
                  <motion.span
                    layoutId="pastilla-nav"
                    className="absolute inset-0 rounded-xl bg-primary-soft"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icono className="relative size-5" aria-hidden />
                <span className="relative">{etiqueta}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
