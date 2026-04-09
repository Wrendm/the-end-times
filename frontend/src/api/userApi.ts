import api from "./axios";

export interface UserFormData {
  name?: string;
  username?: string;
  password?: string;
}

export const updateUser = async (id: string, payload: UserFormData) => {
  const { data } = await api.patch(`/users/${id}`, payload, {
    headers: { "Content-Type": "application/json" }, // JSON now
  });
  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};