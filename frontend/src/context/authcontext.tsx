import { createContext } from "react";
import type { UserType } from "../types";

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (user: UserType) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);