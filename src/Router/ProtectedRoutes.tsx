import React from "react";
import { Navigate } from "react-router-dom";
import { USER_ROLE } from "@/utils/utils";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: "editor" | "reporter";
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const role = USER_ROLE();
  if (!role || allowedRoles !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;
