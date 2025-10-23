import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole: React.FC<Props> = ({ allowedRoles, children }) => {
  const currentUserStr = localStorage.getItem("user");
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const role = currentUser?.role;

  if (!allowedRoles.includes(role ?? "")) {
    return <Navigate to="/admin/no-access" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
