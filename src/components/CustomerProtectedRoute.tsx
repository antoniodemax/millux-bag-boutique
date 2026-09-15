import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCustomerProfile } from '@/services/authService';

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const CustomerProtectedRoute = ({
  children,
  redirectTo = '/customer/login'
}: CustomerProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCustomerProfile();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default CustomerProtectedRoute;