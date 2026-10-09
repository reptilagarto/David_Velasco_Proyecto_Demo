export type Categoria = "academica" | "laboral" | "personal";

export type Prioridad = "alta" | "media" | "baja";

/** Bloque de tiempo. Fechas en formato YYYY-MM-DD y horas en HH:mm (24 h). */
export interface Actividad {
  id: string;
  titulo: string;
  categoria: Categoria;
  fecha: string;
  inicio: string;
  fin: string;
  prioridad: Prioridad;
  /** Marca los bloques que el usuario reservó desde un hueco libre. */
  reservada?: boolean;
}

export interface Asignatura {
  id: string;
  nombre: string;
  profesor: string;
}

export interface Tarea {
  id: string;
  titulo: string;
  asignaturaId: string;
  fechaLimite: string;
  completada: boolean;
  minutosPlanificados: number;
  minutosReales: number;
}

export type TipoAlerta = "examen" | "entrega" | "descanso";

export interface Slot {
  fecha: string;
  inicio: string;
  fin: string;
}

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  prioridad: Prioridad;
  /** Propuesta concreta del sistema: se crea una actividad al aceptarla. */
  tituloBloque: string;
  categoria: Categoria;
  /** Huecos alternativos. El índice actual indica cuál está propuesto. */
  opciones: Slot[];
  indice: number;
  estado: "pendiente" | "aceptada" | "rechazada";
  reorganizada: boolean;
}

export type CategoriaHabito = "pausa" | "hidratacion" | "ejercicio" | "descanso" | "alimentacion";

export interface Habito {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaHabito;
  completado: boolean;
}

export interface RecomendacionBienestar {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: CategoriaHabito;
  duracion: string;
}

export interface RecursoApoyo {
  id: string;
  titulo: string;
  descripcion: string;
  origen: "institucional" | "comunitario";
  contacto: string;
}
