import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserType } from "../types/index";
import api from "../api/axios";
import { AuthContext } from "./authcontext";

type Props = { children: ReactNode };

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData: UserType, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (data?.user) {
          setUser(data.user);
          setToken(null);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch {
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return <div>Loading user...</div>;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};