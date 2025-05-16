
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = '/auth' }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // If auth is still loading, show nothing yet
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated, render the children routes
  return <Outlet />;
};

export default ProtectedRoute;
