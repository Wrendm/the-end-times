import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "../api/axios";
import type { UserType } from "../types";

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (user: UserType) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Login just sets user (token handled by Axios)
  const login = (userData: UserType) => {
    setUser(userData);
  };

  // Logout clears backend + state
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  // Bootstrap session ONCE
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};