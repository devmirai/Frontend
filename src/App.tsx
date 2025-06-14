import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/Landing';
import Login from './components/Login';
import CompanyDashboard from './components/CompanyDashboard';
import UserDashboard from './components/UserDashboard';
import Interview from './components/Interview';
import { Rol } from './types/api';
import './App.css';

const theme = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#06b6d4',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#fafafa',
    },
    Button: {
      borderRadius: 8,
      fontWeight: 500,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Redirect to appropriate dashboard based on user role
  if (user.role === Rol.EMPRESA) {
    return <Navigate to="/empresa/dashboard" replace />;
  } else {
    return <Navigate to="/usuario/dashboard" replace />;
  }
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard Redirect */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                } 
              />
              
              {/* Company Routes */}
              <Route 
                path="/empresa/dashboard" 
                element={
                  <ProtectedRoute requiredRole={Rol.EMPRESA}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/empresa/convocatoria/:id" 
                element={
                  <ProtectedRoute requiredRole={Rol.EMPRESA}>
                    <div>Convocatoria Details (TODO)</div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/empresa/convocatoria/:id/candidates" 
                element={
                  <ProtectedRoute requiredRole={Rol.EMPRESA}>
                    <div>Candidates List (TODO)</div>
                  </ProtectedRoute>
                } 
              />
              
              {/* User Routes */}
              <Route 
                path="/usuario/dashboard" 
                element={
                  <ProtectedRoute requiredRole={Rol.USUARIO}>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/usuario/interview/:id" 
                element={
                  <ProtectedRoute requiredRole={Rol.USUARIO}>
                    <Interview />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/usuario/interview/:id/results" 
                element={
                  <ProtectedRoute requiredRole={Rol.USUARIO}>
                    <Interview />
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy route for backward compatibility */}
              <Route 
                path="/interview/:id" 
                element={
                  <ProtectedRoute>
                    <Interview />
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;