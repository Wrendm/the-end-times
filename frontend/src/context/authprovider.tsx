import { useState, useEffect, type ReactNode } from "react";
import api, { setAuthToken } from "../api/axios";
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

    setAuthToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch { }

    setUser(null);
    setToken(null);

    setAuthToken(null);
    localStorage.removeItem("token");
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
        setAuthToken(storedToken);

        const { data } = await api.get("/auth/me");

        setUser(data.user);
      } catch {
        setUser(null);
        setToken(null);
        setAuthToken(null);
        localStorage.removeItem("token");
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