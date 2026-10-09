import * as React from "react";

/** Encabezado común de cada pantalla: etiqueta, título, descripción y acción opcional. */
export function PageHeader({
  eyebrow,
  titulo,
  descripcion,
  children,
}: {
  eyebrow: string;
  titulo: string;
  descripcion?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-3 pt-1">
      <div className="space-y-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{titulo}</h2>
        {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      </div>
      {children}
    </header>
  );
}
