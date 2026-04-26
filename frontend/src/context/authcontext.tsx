import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAccessToken } from "../api/axios";
import type { UserType } from "../types";

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (user: UserType) => void;
  logout: () => Promise<void>;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/* ---------------------------
   Axios → React bridge
----------------------------*/

let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
  logoutHandler = fn;
};

export const triggerLogout = () => {
  logoutHandler?.();
};

/* ---------------------------
   Provider
----------------------------*/

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------------------------
     Login (frontend only)
  ----------------------------*/
  const login = (userData: UserType) => {
    setUser(userData);
  };

  /* ---------------------------
     Manual logout (user action)
  ----------------------------*/
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setAccessToken(null);
      navigate("/login");
    }
  };

  /* ---------------------------
     Force logout (token expired)
  ----------------------------*/
  const forceLogout = () => {
    setUser(null);
    setAccessToken(null);
    navigate("/login");
  };

  /* ---------------------------
     Register Axios hook
  ----------------------------*/
  useEffect(() => {
    setLogoutHandler(forceLogout);
  }, []);

  /* ---------------------------
     Bootstrap auth on load
  ----------------------------*/
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. get new access token from refresh cookie
        const refreshRes = await api.get("/auth/refresh");
        const token = refreshRes.data.data.token;

        setAccessToken(token);

        // 2. fetch current user
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