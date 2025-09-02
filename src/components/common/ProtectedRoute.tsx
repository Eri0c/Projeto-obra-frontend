import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'cliente' | 'responsavel' | 'colaborador'; // Define possible roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth(); // Get user from useAuth

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If a requiredRole is specified, check if the user has it
  if (requiredRole && user && user.tipo !== requiredRole) {
    // Determine the correct dashboard based on user's actual role
    let redirectTo = "/dashboard"; // Default fallback

    switch (user.tipo) {
      case "cliente":
        redirectTo = "/dashboard/cliente";
        break;
      case "responsavel":
        redirectTo = "/dashboard/responsavel";
        break;
      case "colaborador":
        redirectTo = "/dashboard/colaborador";
        break;
      default:
        redirectTo = "/dashboard"; // Fallback for unknown types
    }
    // Redirect to their own dashboard or a generic dashboard if unauthorized for the requested one
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
