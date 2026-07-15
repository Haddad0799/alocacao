// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Carregando...</p>
    </div>
  );
}

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}