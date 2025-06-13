import axios from 'axios';

// Define the Convocatoria interface
interface Convocatoria {
  id?: number;
  titulo: string;
  descripcion: string;
  puesto?: string;
  requisitos?: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  empresaId?: number;
  empresa?: any;
  salario?: number;
}

// Define the Empresa interface
interface Empresa {
  id?: number;
  nombre: string;
  name?: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  descripcion?: string;
  rol?: string;
}

// Define the Usuario interface
interface Usuario {
  id?: number;
  email: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nacimiento: string;
  telefono: number;
  password?: string;
  rol?: string;
}

const API_BASE_URL = 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mirai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mirai_token');
      localStorage.removeItem('mirai_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Management
export const userAPI = {
  createUsuario: (userData: any) => api.post('/usuario', userData),
  createEmpresa: (empresaData: any) => api.post('/empresa', empresaData),
  getUsuario: (id: number) => api.get(`/usuario/${id}`),
  getEmpresa: (id: number) => api.get(`/empresa/${id}`),
};

// Convocatoria Management
export const convocatoriaAPI = {
  create: (data: Convocatoria) => api.post('/api/convocatorias', convocatoriaToBackend(data)),
  getAll: () => api.get('/api/convocatorias'),
  getById: (id: number) => api.get(`/api/convocatorias/${id}`),
  delete: (id: number) => api.delete(`/api/convocatorias/${id}`),
  
  // Additional endpoints you might want to implement in your backend
  getByEmpresa: (empresaId: number) => api.get(`/api/convocatorias/empresa/${empresaId}`),
  getActivas: () => api.get('/api/convocatorias?activo=true'),
  update: (id: number, data: Convocatoria) => api.put(`/api/convocatorias/${id}`, convocatoriaToBackend(data))
};

// Adapter to convert frontend model to backend model
function convocatoriaToBackend(convocatoria: any): any {
  return {
    id: convocatoria.id,
    titulo: convocatoria.titulo,
    descripcion: convocatoria.descripcion,
    puesto: convocatoria.puesto || convocatoria.requisitos, // Use puesto or fallback to requisitos
    activo: convocatoria.estado === 'ACTIVA',
    fechaPublicacion: convocatoria.fechaInicio,
    fechaCierre: convocatoria.fechaFin,
    empresa: convocatoria.empresaId ? { id: convocatoria.empresaId } : convocatoria.empresa
  };
}

// Adapter to convert backend model to frontend model
export function convocatoriaFromBackend(data: any): any {
  return {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    puesto: data.puesto,
    requisitos: data.puesto, // Frontend might use requisitos instead of puesto
    fechaInicio: data.fechaPublicacion,
    fechaFin: data.fechaCierre,
    estado: data.activo ? 'ACTIVA' : 'CERRADA',
    empresaId: data.empresa?.id,
    empresa: data.empresa,
    salario: data.salario // In case your backend has this field
  };
}

// Postulacion Management
export const postulacionAPI = {
  create: (data: any) => api.post('/postulacion', data),
  getByConvocatoria: (convocatoriaId: number) => api.get(`/postulacion/convocatoria/${convocatoriaId}`),
  getByUsuario: (usuarioId: number) => api.get(`/postulacion/usuario/${usuarioId}`),
  getById: (id: number) => api.get(`/postulacion/${id}`),
};

// AI Interview Management
export const interviewAPI = {
  generateQuestions: (data: {
    puesto: string;
    dificultad: number;
    idConvocatoria: number;
    idPostulacion: number;
  }) => api.post('/pregunta/generar', data),
  
  evaluateAnswer: (data: {
    preguntaId: number;
    answer: string;
    postulacionId: number;
  }) => api.post('/evaluar', data),
  
  getAnswersByPostulacion: (postulacionId: number) => api.get(`/respuesta/postulacion/${postulacionId}`),
  getEvaluationByPostulacion: (postulacionId: number) => api.get(`/evaluacion/postulacion/${postulacionId}`),
};

// Empresa Management
export const empresaAPI = {
  create: (data: Empresa) => api.post('/api/empresas', empresaAdapter(data)),
  getAll: () => api.get('/api/empresas'),
  getById: (id: number) => api.get(`/api/empresas/${id}`),
  getByEmail: (email: string) => api.get(`/api/empresas/email/${email}`),
  update: (id: number, data: Empresa) => api.put(`/api/empresas/${id}`, empresaAdapter(data)),
};

// Helper function to adapt frontend model to backend model if needed
function empresaAdapter(empresa: any): any {
  return {
    id: empresa.id,
    nombre: empresa.nombre,
    email: empresa.email,
    password: empresa.password,
    telefono: empresa.telefono,
    direccion: empresa.direccion,
    descripcion: empresa.descripcion,
    rol: 'EMPRESA'
  };
}

// Helper function to convert backend model to frontend model
export function empresaFromBackend(data: any): any {
  return {
    id: data.id,
    nombre: data.nombre,
    name: data.nombre, // For compatibility with existing UI
    email: data.email,
    telefono: data.telefono,
    direccion: data.direccion,
    descripcion: data.descripcion,
    rol: data.rol
  };
}

// Usuario Management
export const usuarioAPI = {
  create: (data: Usuario) => api.post('/api/usuarios', usuarioAdapter(data)),
  getAll: () => api.get('/api/usuarios'),
  getById: (id: number) => api.get(`/api/usuarios/${id}`),
  getByEmail: (email: string) => api.get(`/api/usuarios/email/${email}`),
  update: (id: number, data: Usuario) => api.put(`/api/usuarios/${id}`, usuarioAdapter(data)),
};

// Helper function to adapt frontend model to backend model
function usuarioAdapter(usuario: any): any {
  return {
    id: usuario.id,
    email: usuario.email,
    nombre: usuario.nombre || usuario.name,
    apellidoPaterno: usuario.apellidoPaterno,
    apellidoMaterno: usuario.apellidoMaterno,
    nacimiento: usuario.nacimiento,
    telefono: usuario.telefono,
    password: usuario.password,
    rol: 'USUARIO'
  };
}

// Helper function to convert backend model to frontend model
export function usuarioFromBackend(data: any): any {
  return {
    id: data.id,
    email: data.email,
    nombre: data.nombre,
    name: `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`.trim(), // For UI compatibility
    apellidoPaterno: data.apellidoPaterno,
    apellidoMaterno: data.apellidoMaterno,
    nacimiento: data.nacimiento,
    telefono: data.telefono,
    rol: data.rol
  };
}

export default api;