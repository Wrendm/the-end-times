import { createContext, useEffect, useState, type ReactNode } from "react";
import api from "../api/axios";
import type { UserType } from "../types";
import { setAccessToken } from "../api/axios";

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (user: UserType) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // Called after successful login
  const login = (userData: UserType) => {
    setUser(userData);
  };

  // Logs out on backend + clears state
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const refreshRes = await api.get("/auth/refresh");
        const token = refreshRes.data.data.token;
        setAccessToken(token);

        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        console.log("INIT AUTH ERROR:", err);
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