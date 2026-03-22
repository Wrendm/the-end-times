import { createContext } from "react";
import type { UserType } from "../types";

export type AuthContextType = {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  login: (user: UserType, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);