import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-emerald-700 text-xs">
            ECO
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 animate-pulse">Securing session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
