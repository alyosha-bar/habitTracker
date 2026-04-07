import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, username } = useAuthStore();

//   if (isLoading) {
//     return <div>Loading...</div>; // or null/spinner
//   }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};