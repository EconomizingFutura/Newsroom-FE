import { Navigate } from "react-router-dom";
import React from "react";
import { TOKEN } from "@/utils/utils";

interface AuthRouteProps {
  children: React.ReactElement;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const token = TOKEN();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthRoute;
