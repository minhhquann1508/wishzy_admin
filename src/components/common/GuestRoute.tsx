import { Navigate } from "react-router";
import { AuthUtils } from "@/utils/auth";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const isAuthenticated = AuthUtils.isAuthenticated();

  if (isAuthenticated) {
    // Redirect to admin page if already authenticated
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
