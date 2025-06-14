import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { message } from 'antd';
import { usuarioAPI, empresaAPI } from '../services/api';
import { Usuario, Empresa, Rol } from '../types/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Rol;
  avatar?: string;
  // Additional fields based on role
  telefono?: string | number;
  direccion?: string;
  descripcion?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nacimiento?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  role: Rol;
  // Usuario fields
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  nacimiento?: string;
  telefono?: number;
  // Empresa fields
  direccion?: string;
  descripcion?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('mirai_token');
    const userData = localStorage.getItem('mirai_user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('mirai_token');
        localStorage.removeItem('mirai_user');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // For demo purposes, we'll use test credentials
      // In a real implementation, you'd have a login endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      let user: User;
      const token = 'mock_jwt_token_' + Date.now();

      if (credentials.email === 'empresa@demo.com' && credentials.password === '123456') {
        user = {
          id: 1,
          email: 'empresa@demo.com',
          name: 'TechCorp',
          role: Rol.EMPRESA,
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100',
          telefono: '999999999',
          direccion: 'Av. Demo 123',
          descripcion: 'Empresa demo'
        };
      } else if (credentials.email === 'usuario@demo.com' && credentials.password === '123456') {
        user = {
          id: 1,
          email: 'usuario@demo.com',
          name: 'Juan Pérez Lopez',
          role: Rol.USUARIO,
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
          apellidoPaterno: 'Pérez',
          apellidoMaterno: 'Lopez',
          nacimiento: '1990-01-01',
          telefono: 987654321
        };
      } else {
        throw new Error('Invalid credentials');
      }

      // Store in localStorage
      localStorage.setItem('mirai_token', token);
      localStorage.setItem('mirai_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      message.success(`Welcome back, ${user.name}!`);
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      message.error('Invalid credentials. Try empresa@demo.com/123456 or usuario@demo.com/123456');
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      let response;
      
      if (data.role === Rol.USUARIO) {
        const usuarioData: Usuario = {
          nombre: data.nombre!,
          apellidoPaterno: data.apellidoPaterno!,
          apellidoMaterno: data.apellidoMaterno!,
          email: data.email,
          password: data.password,
          nacimiento: data.nacimiento!,
          telefono: data.telefono!,
          rol: Rol.USUARIO
        };
        response = await usuarioAPI.create(usuarioData);
      } else {
        const empresaData: Empresa = {
          nombre: data.nombre!,
          email: data.email,
          password: data.password,
          telefono: data.telefono?.toString() || '',
          direccion: data.direccion!,
          descripcion: data.descripcion!,
          rol: Rol.EMPRESA
        };
        response = await empresaAPI.create(empresaData);
      }

      const userData = response.data;
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: data.role === Rol.USUARIO 
          ? `${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`
          : userData.nombre,
        role: data.role,
        avatar: data.role === Rol.EMPRESA 
          ? 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100'
          : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
        ...userData
      };

      const token = 'mock_jwt_token_' + Date.now();

      localStorage.setItem('mirai_token', token);
      localStorage.setItem('mirai_user', JSON.stringify(user));

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      message.success(`Account created successfully! Welcome, ${user.name}!`);
      return true;
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mirai_token');
    localStorage.removeItem('mirai_user');
    dispatch({ type: 'LOGOUT' });
    message.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};