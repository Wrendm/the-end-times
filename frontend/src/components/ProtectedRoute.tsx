import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authcontext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) throw new Error("AuthContext not found");

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
