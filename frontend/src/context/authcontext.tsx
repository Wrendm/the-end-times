import { createContext } from "react";
import type { UserType } from '../types/index';

type AuthContextType = {
  user: UserType | null;
  token: string | null;
  login: (user: UserType, token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);