import api from "./axios";

export const loginUser = async (formData: { username: string; password: string }) => {
  const { data } = await api.post("/auth/login", formData);
  return data;
};

export const registerUser = async (payload: { name: string; username: string; email: string; password: string }) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch {
    return null;
  }
};