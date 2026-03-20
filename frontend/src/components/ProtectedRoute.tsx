import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("AuthContext not found");

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userRoles = auth.user.roles?.map(r => r.toLowerCase()) ?? [];

    const hasAccess = allowedRoles.some(role =>
      userRoles.includes(role.toLowerCase())
    );

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}