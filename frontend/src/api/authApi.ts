import api from "./axios";

export const loginUser = async (formData: { username: string; password: string }) => {
  const { data } = await api.post("/auth/login", formData);

  api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

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
    try {
      await api.get("/auth/refresh");
      
      const { data } = await api.get("/auth/me");
      return data;
    } catch {
      return null;
    }
  }
};