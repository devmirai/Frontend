import axios from 'axios';

// API Base URL - Update this to match your backend
const API_BASE_URL = 'http://localhost:8080';

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

// Usuario API
export const usuarioAPI = {
  create: (data: any) => api.post('/usuario', data),
  getAll: () => api.get('/usuario'),
  getById: (id: number) => api.get(`/usuario/${id}`),
  getByEmail: (email: string) => api.get(`/usuario/email/${email}`),
  update: (id: number, data: any) => api.put(`/usuario/${id}`, data),
  delete: (id: number) => api.delete(`/usuario/${id}`),
};

// Empresa API
export const empresaAPI = {
  create: (data: any) => api.post('/empresa', data),
  getAll: () => api.get('/empresa'),
  getById: (id: number) => api.get(`/empresa/${id}`),
  getByEmail: (email: string) => api.get(`/empresa/email/${email}`),
  update: (id: number, data: any) => api.put(`/empresa/${id}`, data),
  delete: (id: number) => api.delete(`/empresa/${id}`),
};

// Convocatoria API
export const convocatoriaAPI = {
  create: (data: any) => api.post('/convocatoria', data),
  getAll: () => api.get('/convocatoria'),
  getById: (id: number) => api.get(`/convocatoria/${id}`),
  getByEmpresa: (empresaId: number) => api.get(`/convocatoria/empresa/${empresaId}`),
  getActivas: () => api.get('/convocatoria/activas'),
  update: (id: number, data: any) => api.put(`/convocatoria/${id}`, data),
  delete: (id: number) => api.delete(`/convocatoria/${id}`),
};

// Postulacion API
export const postulacionAPI = {
  create: (data: any) => api.post('/postulacion', data),
  getAll: () => api.get('/postulacion'),
  getById: (id: number) => api.get(`/postulacion/${id}`),
  getByUsuario: (usuarioId: number) => api.get(`/postulacion/usuario/${usuarioId}`),
  getByConvocatoria: (convocatoriaId: number) => api.get(`/postulacion/convocatoria/${convocatoriaId}`),
  update: (id: number, data: any) => api.put(`/postulacion/${id}`, data),
  delete: (id: number) => api.delete(`/postulacion/${id}`),
};

// Pregunta API
export const preguntaAPI = {
  generar: (data: {
    puesto: string;
    dificultad: number;
    idConvocatoria: number;
    idPostulacion: number;
  }) => api.post('/pregunta/generar', data),
  getAll: () => api.get('/pregunta'),
  getById: (id: number) => api.get(`/pregunta/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/pregunta/postulacion/${postulacionId}`),
};

// Respuesta API
export const respuestaAPI = {
  evaluar: (data: {
    preguntaId: number;
    answer: string;
    postulacionId: number;
  }) => api.post('/respuesta/evaluar', data),
  getAll: () => api.get('/respuesta'),
  getById: (id: number) => api.get(`/respuesta/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/respuesta/postulacion/${postulacionId}`),
};

// Evaluacion API
export const evaluacionAPI = {
  getAll: () => api.get('/evaluacion'),
  getById: (id: number) => api.get(`/evaluacion/${id}`),
  getByPostulacion: (postulacionId: number) => api.get(`/evaluacion/postulacion/${postulacionId}`),
  getByRespuesta: (respuestaId: number) => api.get(`/evaluacion/respuesta/${respuestaId}`),
};

export default api;