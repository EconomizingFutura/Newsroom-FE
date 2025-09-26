import React from "react";
import { Navigate } from "react-router-dom";
import { TOKEN, USER_ROLE } from "@/utils/utils";

interface PublicRouteProps {
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = TOKEN();
  const role = USER_ROLE();

  if (token && role) {
    if (role === "REPORTER") {
      return <Navigate to="/news-feeds" replace />;
    }
    if (role === "EDITOR") {
      return <Navigate to="/editor/dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
