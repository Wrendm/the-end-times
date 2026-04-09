import api from "./axios";

// categoryApi.ts
type CategoryPayload = {
  name: string;
  type?: string;
  published: boolean;
};

export const createCategory = async (payload: CategoryPayload) => {
  const { data } = await api.post("/categories", payload); // default JSON
  return data;
};

export const updateCategory = async (id: string, payload: CategoryPayload) => {
  const { data } = await api.put(`/admin/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id: string) => {
  const { data } = await api.delete(`/admin/categories/${id}`);
  return data;
};