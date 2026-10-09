/** Utilidades de fecha y hora sin dependencias externas. */

export const INICIO_JORNADA = 7 * 60; // 07:00
export const FIN_JORNADA = 22 * 60; // 22:00
export const MIN_HUECO = 30; // duración mínima para considerar un hueco aprovechable

/** "08:30" -> 510 */
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

/** 510 -> "08:30" */
export function aHora(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 90 -> "1 h 30 min", 45 -> "45 min" */
export function formatoDuracion(minutos: number): string {
  if (minutos <= 0) return "0 min";
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Convierte "YYYY-MM-DD" en un Date a mediodía (evita desfases de zona horaria). */
export function aFecha(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

/** "2026-10-09" -> "viernes 9 de octubre" */
export function formatoFechaLarga(iso: string): string {
  const f = aFecha(iso);
  const texto = `${DIAS[f.getDay()]} ${f.getDate()} de ${MESES[f.getMonth()]}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** "2026-10-09" -> "vie 9" (para tiras de días) */
export function formatoDiaCorto(iso: string): { dia: string; numero: number } {
  const f = aFecha(iso);
  return { dia: DIAS[f.getDay()].slice(0, 3), numero: f.getDate() };
}

/** Devuelve los 7 días (lunes a domingo) de la semana que contiene `iso`. */
export function diasDeSemana(iso: string): string[] {
  const f = aFecha(iso);
  const diaSemana = (f.getDay() + 6) % 7; // lunes = 0
  const lunes = new Date(f.getFullYear(), f.getMonth(), f.getDate() - diaSemana, 12);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i, 12);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}

export interface Hueco {
  id: string;
  inicio: string;
  fin: string;
  minutos: number;
}

/**
 * Detecta los espacios libres de una jornada entre bloques ya ocupados.
 * Solo devuelve huecos de al menos MIN_HUECO minutos dentro de la franja de la jornada.
 */
export function detectarHuecos(actividades: { inicio: string; fin: string }[]): Hueco[] {
  const ocupados = actividades
    .map((a) => ({ ini: aMinutos(a.inicio), fin: aMinutos(a.fin) }))
    .sort((a, b) => a.ini - b.ini);

  const huecos: Hueco[] = [];
  let cursor = INICIO_JORNADA;

  const agregar = (desde: number, hasta: number) => {
    const minutos = hasta - desde;
    if (minutos >= MIN_HUECO) {
      huecos.push({ id: `${desde}-${hasta}`, inicio: aHora(desde), fin: aHora(hasta), minutos });
    }
  };

  for (const bloque of ocupados) {
    if (bloque.ini > cursor) agregar(cursor, Math.min(bloque.ini, FIN_JORNADA));
    cursor = Math.max(cursor, bloque.fin);
  }
  if (cursor < FIN_JORNADA) agregar(cursor, FIN_JORNADA);

  return huecos;
}

const MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-10-10" -> "sáb 10 oct" */
export function formatoFechaCorta(iso: string): string {
  const f = aFecha(iso);
  return `${DIAS[f.getDay()].slice(0, 3)} ${f.getDate()} ${MESES_CORTOS[f.getMonth()]}`;
}

export interface CeldaMes {
  fecha: string;
  dentroDelMes: boolean;
}

const MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "octubre 2026" para el encabezado del calendario (anio y mes con mes base 0). */
export function nombreMes(anio: number, mes: number): string {
  const texto = `${MESES_LARGOS[mes]} ${anio}`;
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/** Cuadrícula de 6 semanas (lunes primero) que cubre el mes indicado. */
export function cuadriculaMes(anio: number, mes: number): CeldaMes[] {
  const primero = new Date(anio, mes, 1, 12);
  const offset = (primero.getDay() + 6) % 7; // días previos desde el lunes
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(anio, mes, 1 - offset + i, 12);
    const fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { fecha, dentroDelMes: d.getMonth() === mes };
  });
}
