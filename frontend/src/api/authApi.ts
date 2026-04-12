import api from "./axios";
import { setAccessToken } from "./tokenStorage";

export const loginUser = async (formData: { username: string; password: string }) => {
  try {
    const { data } = await api.post("/auth/login", formData);
    return data;
  } catch (err: any) {
    console.error("FULL ERROR:", err.response?.data || err);
    throw err;
  }
};

export const registerUser = async (payload: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch {
    return null;
  }
};