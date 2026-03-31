import api from "./axios";

export const createPost = async (payload: { title: string; postCategory: string; imgSrc: string; postContent: string; published: boolean }) => {
  const { data } = await api.post("/posts", payload);
  return data;
};
