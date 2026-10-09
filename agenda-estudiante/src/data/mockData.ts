/**
 * Datos simulados (ficticios) de un estudiante trabajador.
 *
 * Perfil: estudiante de Ingeniería de Sistemas que trabaja en atención al cliente
 * de lunes a viernes por la tarde y los sábados por la mañana.
 *
 * "Hoy" está fijado en viernes 9 de octubre de 2026 para que la demo sea
 * determinista (SSR y cliente generan el mismo HTML).
 */
import type {
  Actividad,
  Alerta,
  Asignatura,
  Habito,
  RecomendacionBienestar,
  RecursoApoyo,
  Tarea,
} from "@/types";

export const FECHA_HOY = "2026-10-09";

export const ASIGNATURAS: Asignatura[] = [
  { id: "bd", nombre: "Bases de Datos", profesor: "Prof. Rivas (ficticio)" },
  { id: "est", nombre: "Estadística Aplicada", profesor: "Prof. Mendoza (ficticio)" },
  { id: "etica", nombre: "Ética Profesional", profesor: "Prof. Sánchez (ficticio)" },
];

/* -------------------------------------------------------------------------- */
/*  Agenda de la semana del 5 al 11 de octubre                                */
/* -------------------------------------------------------------------------- */

export const ACTIVIDADES_INICIALES: Actividad[] = [
  // Lunes 5
  { id: "a-01", titulo: "Clase: Bases de Datos", categoria: "academica", fecha: "2026-10-05", inicio: "07:00", fin: "09:00", prioridad: "alta" },
  { id: "a-02", titulo: "Turno: atención al cliente", categoria: "laboral", fecha: "2026-10-05", inicio: "13:00", fin: "20:00", prioridad: "alta" },

  // Martes 6
  { id: "a-03", titulo: "Clase: Estadística Aplicada", categoria: "academica", fecha: "2026-10-06", inicio: "07:00", fin: "09:00", prioridad: "alta" },
  { id: "a-04", titulo: "Gimnasio", categoria: "personal", fecha: "2026-10-06", inicio: "18:00", fin: "19:00", prioridad: "media" },

  // Miércoles 7
  { id: "a-05", titulo: "Clase: Bases de Datos", categoria: "academica", fecha: "2026-10-07", inicio: "07:00", fin: "09:00", prioridad: "alta" },
  { id: "a-06", titulo: "Turno: atención al cliente", categoria: "laboral", fecha: "2026-10-07", inicio: "13:00", fin: "20:00", prioridad: "alta" },

  // Jueves 8
  { id: "a-07", titulo: "Clase: Estadística Aplicada", categoria: "academica", fecha: "2026-10-08", inicio: "07:00", fin: "09:00", prioridad: "alta" },
  { id: "a-08", titulo: "Caminata con amigos", categoria: "personal", fecha: "2026-10-08", inicio: "18:30", fin: "19:30", prioridad: "baja" },

  // Viernes 9 (hoy)
  { id: "a-09", titulo: "Clase: Ética Profesional", categoria: "academica", fecha: "2026-10-09", inicio: "07:00", fin: "09:00", prioridad: "media" },
  { id: "a-10", titulo: "Almuerzo", categoria: "personal", fecha: "2026-10-09", inicio: "12:00", fin: "12:40", prioridad: "media" },
  { id: "a-11", titulo: "Turno: atención al cliente", categoria: "laboral", fecha: "2026-10-09", inicio: "13:00", fin: "20:00", prioridad: "alta" },

  // Sábado 10
  { id: "a-12", titulo: "Turno: atención al cliente", categoria: "laboral", fecha: "2026-10-10", inicio: "08:00", fin: "13:00", prioridad: "alta" },

  // Domingo 11
  { id: "a-13", titulo: "Compras de la semana", categoria: "personal", fecha: "2026-10-11", inicio: "17:00", fin: "18:00", prioridad: "baja" },
];

/* -------------------------------------------------------------------------- */
/*  Tareas pendientes y completadas                                           */
/* -------------------------------------------------------------------------- */

export const TAREAS_INICIALES: Tarea[] = [
  { id: "t-01", titulo: "Taller 3: consultas SQL con JOIN", asignaturaId: "bd", fechaLimite: "2026-10-12", completada: false, minutosPlanificados: 120, minutosReales: 95 },
  { id: "t-02", titulo: "Proyecto final: modelo entidad-relación", asignaturaId: "bd", fechaLimite: "2026-10-12", completada: false, minutosPlanificados: 180, minutosReales: 150 },
  { id: "t-03", titulo: "Ejercicios de probabilidad condicional", asignaturaId: "est", fechaLimite: "2026-10-07", completada: true, minutosPlanificados: 90, minutosReales: 100 },
  { id: "t-04", titulo: "Lectura: muestreo y estimación", asignaturaId: "est", fechaLimite: "2026-10-08", completada: true, minutosPlanificados: 45, minutosReales: 40 },
  { id: "t-05", titulo: "Repaso para el examen parcial", asignaturaId: "est", fechaLimite: "2026-10-12", completada: false, minutosPlanificados: 150, minutosReales: 30 },
  { id: "t-06", titulo: "Ensayo: dilemas éticos en la profesión", asignaturaId: "etica", fechaLimite: "2026-10-14", completada: false, minutosPlanificados: 120, minutosReales: 60 },
  { id: "t-07", titulo: "Cuestionario: código de ética", asignaturaId: "etica", fechaLimite: "2026-10-06", completada: true, minutosPlanificados: 30, minutosReales: 35 },
];

/* -------------------------------------------------------------------------- */
/*  Sugerencias del sistema (alertas)                                         */
/* -------------------------------------------------------------------------- */

export const ALERTAS_INICIALES: Alerta[] = [
  {
    id: "al-01",
    tipo: "examen",
    titulo: "Examen parcial de Estadística el lunes 12",
    mensaje: "Tienes 150 min de repaso planificados y solo 30 min reales. Te sugerimos una sesión en tu sábado libre.",
    prioridad: "alta",
    tituloBloque: "Estudio: repaso parcial de Estadística",
    categoria: "academica",
    opciones: [
      { fecha: "2026-10-10", inicio: "15:00", fin: "17:00" },
      { fecha: "2026-10-11", inicio: "10:00", fin: "12:00" },
      { fecha: "2026-10-09", inicio: "20:00", fin: "21:30" },
    ],
    indice: 0,
    estado: "pendiente",
    reorganizada: false,
  },
  {
    id: "al-02",
    tipo: "entrega",
    titulo: "Entrega del proyecto de Bases de Datos el lunes 12",
    mensaje: "El modelo ER aún no está iniciado. Hoy tienes un hueco libre por la mañana antes de tu turno.",
    prioridad: "alta",
    tituloBloque: "Estudio: modelo ER del proyecto final",
    categoria: "academica",
    opciones: [
      { fecha: "2026-10-09", inicio: "09:00", fin: "11:00" },
      { fecha: "2026-10-11", inicio: "10:00", fin: "12:00" },
    ],
    indice: 0,
    estado: "pendiente",
    reorganizada: false,
  },
  {
    id: "al-03",
    tipo: "descanso",
    titulo: "Semana con muchas horas de turno",
    mensaje: "Acumulas 21 h de turno esta semana. Un bloque de descanso ayuda a recuperar energía.",
    prioridad: "media",
    tituloBloque: "Descanso: caminata y desconexión",
    categoria: "personal",
    opciones: [
      { fecha: "2026-10-11", inicio: "16:00", fin: "17:00" },
      { fecha: "2026-10-10", inicio: "17:00", fin: "18:00" },
    ],
    indice: 0,
    estado: "pendiente",
    reorganizada: false,
  },
];

/* -------------------------------------------------------------------------- */
/*  Bienestar                                                                 */
/* -------------------------------------------------------------------------- */

export const HABITOS_INICIALES: Habito[] = [
  { id: "h-01", nombre: "Beber 2 litros de agua", descripcion: "Reparte el consumo a lo largo del día", categoria: "hidratacion", completado: true },
  { id: "h-02", nombre: "Pausa activa cada 90 min", descripcion: "Levántate y estira cuello y muñecas", categoria: "pausa", completado: false },
  { id: "h-03", nombre: "20 min de ejercicio", descripcion: "Caminata, bici o rutina en casa", categoria: "ejercicio", completado: false },
  { id: "h-04", nombre: "Dormir al menos 7 horas", descripcion: "Pantallas fuera 30 min antes", categoria: "descanso", completado: false },
  { id: "h-05", nombre: "Una fruta o verdura", descripcion: "Un alimento fresco en cada comida", categoria: "alimentacion", completado: false },
];

export const RECOMENDACIONES_INICIALES: RecomendacionBienestar[] = [
  {
    id: "r-01",
    titulo: "Pausas activas",
    descripcion: "Estira cuello, hombros y muñecas después de cada bloque de estudio.",
    categoria: "pausa",
    duracion: "5 min",
  },
  {
    id: "r-02",
    titulo: "Hidratación",
    descripcion: "Bebe un vaso de agua antes de empezar cada sesión de estudio o turno.",
    categoria: "hidratacion",
    duracion: "Continuo",
  },
  {
    id: "r-03",
    titulo: "Ejercicio ligero",
    descripcion: "Una caminata corta al terminar el turno ayuda a bajar la tensión del día.",
    categoria: "ejercicio",
    duracion: "20 min",
  },
  {
    id: "r-04",
    titulo: "Descanso nocturno",
    descripcion: "Apaga las pantallas 30 minutos antes de dormir para mejorar el sueño.",
    categoria: "descanso",
    duracion: "7-8 h",
  },
];

export const RECURSOS_INICIALES: RecursoApoyo[] = [
  {
    id: "rc-01",
    titulo: "Consejería estudiantil",
    descripcion: "Acompañamiento personal y orientación académica con profesionales.",
    origen: "institucional",
    contacto: "Oficina de Bienestar Estudiantil (ficticio)",
  },
  {
    id: "rc-02",
    titulo: "Sala de estudio y biblioteca",
    descripcion: "Espacios tranquilos y tutorías para reforzar tus materias.",
    origen: "institucional",
    contacto: "Lun a vie, 8:00 a 20:00 (ficticio)",
  },
  {
    id: "rc-03",
    titulo: "Talleres de gestión del tiempo",
    descripcion: "Técnicas para equilibrar estudio, trabajo y descanso.",
    origen: "institucional",
    contacto: "Inscripción en el portal del estudiante (ficticio)",
  },
  {
    id: "rc-04",
    titulo: "Grupo de apoyo entre pares",
    descripcion: "Estudiantes trabajadores que comparten experiencias y consejos.",
    origen: "comunitario",
    contacto: "Reuniones quincenales en el campus (ficticio)",
  },
];
