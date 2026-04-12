import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";
import { useLocation } from "react-router-dom";


interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, isHydrated } = useAuthStore(); 
  const location = useLocation();

  if (!isHydrated) {
    return null; // This prevents the "flash" of the login page
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Removed the !username redirect to prevent jumping to "/" on refresh
  return <Outlet />;
};