import * as React from 'react';
import { Navigate } from 'react-router';
import { useSession } from '../SessionContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session } = useSession();
  
  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(session.user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}