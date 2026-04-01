import api from "./axios";

export const createPost = async (payload: { title: string; postCategory: string; imgSrc: string; postContent: string; published: boolean }) => {
  const { data } = await api.post("/posts", payload);
  return data;
};

export const updatePost = async (id: string, payload: { title: string; postCategory: string; imgSrc: string; postContent: string; published: boolean }) => {
  const { data } = await api.put(`/posts/${id}`, payload);
  return data;
};

export const deletePost = async (id: string) => {
  const { data } = await api.delete(`/posts/${id}`);
  return data;
};
