import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../stores/auth";

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, username, token } = useAuthStore();

  // check if token is still valid
  if (token) {
    const tokenExpiration = JSON.parse(atob(token.split('.')[1])).exp;

    if (Date.now() >= tokenExpiration * 1000) {
      useAuthStore.getState().clearAuthData();
    }
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};