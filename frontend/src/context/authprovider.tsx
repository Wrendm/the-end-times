import { useState, useEffect, type ReactNode } from "react";
import api from "../api/axios";
import { AuthContext } from "./authcontext";
import type { UserType } from "../types";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: UserType, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);

    localStorage.setItem("token", accessToken);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

useEffect(() => {
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data);
      } catch {
        // Token invalid → try refresh
        try {
          const res = await api.get("/auth/refresh");
          const newToken = res.data.data.token;

          localStorage.setItem("token", newToken);
          setToken(newToken);

          const { data } = await api.get("/auth/me");
          setUser(data.data);
        } catch {
          // Fully unauthenticated → stay guest
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  initializeAuth();
}, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};