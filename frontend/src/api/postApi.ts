import api from "./axios";

type PostFormData = FormData;

export const createPost = async (payload: PostFormData) => {
  const { data } = await api.post("/posts", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updatePost = async (id: string, payload: PostFormData) => {
  const { data } = await api.put(`/posts/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const deletePost = async (id: string) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};