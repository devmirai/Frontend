// Enums
export enum Rol {
  ADMIN = 'ADMIN',
  EMPRESA = 'EMPRESA',
  USUARIO = 'USUARIO'
}

export enum EstadoPostulacion {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADA = 'COMPLETADA',
  RECHAZADA = 'RECHAZADA'
}

// Base Entity Types
export interface Usuario {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password?: string;
  nacimiento: string;
  telefono: number;
  rol: Rol;
}

export interface Empresa {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  telefono: string;
  direccion: string;
  descripcion: string;
  rol: Rol;
}

export interface Convocatoria {
  id?: number;
  titulo: string;
  descripcion: string;
  puesto: string;
  activo: boolean;
  fechaPublicacion: string;
  fechaCierre: string;
  empresa?: Empresa;
}

export interface Postulacion {
  id?: number;
  fechaPostulacion: string;
  estado: EstadoPostulacion;
  usuario?: Usuario;
  convocatoria?: Convocatoria;
}

export interface Pregunta {
  id?: number;
  texto: string;
  tipo: string;
  dificultad: number;
  postulacion?: Postulacion;
  convocatoria?: Convocatoria;
}

export interface Respuesta {
  id?: number;
  texto: string;
  fechaRespuesta: string;
  pregunta?: Pregunta;
  postulacion?: Postulacion;
}

export interface Evaluacion {
  id?: number;
  claridadEstructura: number;
  dominioTecnico: number;
  pertinencia: number;
  puntajeTotal: number;
  porcentajeObtenido: number;
  feedback: string;
  respuesta?: Respuesta;
  postulacion?: Postulacion;
}

// DTO Types
export interface PreguntaRequest {
  puesto: string;
  dificultad: number;
  idConvocatoria: number;
  idPostulacion: number;
}

export interface PreguntaResponse {
  id: number;
  texto: string;
  tipo: string;
  dificultad: number;
}

export interface EvaluacionRequest {
  preguntaId: number;
  answer: string;
  postulacionId: number;
}

export interface EvaluacionResponse {
  id: number;
  claridadEstructura: number;
  dominioTecnico: number;
  pertinencia: number;
  puntajeTotal: number;
  porcentajeObtenido: number;
  feedback: string;
  fechaEvaluacion: string;
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