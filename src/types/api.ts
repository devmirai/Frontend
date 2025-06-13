// User Types
export interface Usuario {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  nacimiento: string;
  telefono: number;
  rol: 'USUARIO';
}

export interface Empresa {
  id?: number;
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  direccion: string;
  descripcion: string;
  rol: 'EMPRESA';
}

// Convocatoria Types
export interface Convocatoria {
  id?: number;
  titulo: string;
  descripcion: string;
  puesto: string;
  requisitos: string;
  salario?: number;
  fechaInicio: string;
  fechaFin: string;
  estado: 'ACTIVA' | 'CERRADA' | 'PAUSADA';
  empresaId: number;
  empresa?: Empresa;
}

// Postulacion Types
export interface Postulacion {
  id?: number;
  fechaPostulacion: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'RECHAZADA';
  usuarioId: number;
  convocatoriaId: number;
  usuario?: Usuario;
  convocatoria?: Convocatoria;
}

// Interview Types
export interface Pregunta {
  id?: number;
  texto: string;
  tipo: string;
  dificultad: number;
  postulacionId: number;
  convocatoriaId: number;
}

export interface Respuesta {
  id?: number;
  texto: string;
  fechaRespuesta: string;
  preguntaId: number;
  postulacionId: number;
  pregunta?: Pregunta;
}

export interface Evaluacion {
  id?: number;
  claridad_estructura: number;
  dominio_tecnico: number;
  pertinencia: number;
  puntajeTotal: number;
  porcentajeObtenido: number;
  feedback: string;
  respuestaId: number;
  postulacionId: number;
  respuesta?: Respuesta;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}