export interface User {
  id: string;
  email: string;
  name: string;
  role: 'empresa' | 'usuario';
  avatar?: string;
  company?: string;
  position?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'empresa' | 'usuario';
  company?: string;
  position?: string;
}