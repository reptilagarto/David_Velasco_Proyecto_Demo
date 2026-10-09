import { formatoFechaLarga } from "@/lib/time";
import { FECHA_HOY } from "@/data/mockData";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <p className="text-xs font-medium text-muted-foreground">{formatoFechaLarga(FECHA_HOY)}</p>
      <h1 className="text-lg font-semibold tracking-tight">Mi semana</h1>
    </header>
  );
}
