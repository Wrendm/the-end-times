import useAxiosFetch from './useAxiosFetch';
import type { PostType } from '../types/index';


const usePostById = (postId: string) => {
  const { data, isLoading, fetchError } = useAxiosFetch<PostType[]>(`http://localhost:3500/posts?id=${postId}`);

  let post: PostType | null = null;

  if (data && data.length > 0) {
    post = data[0];
  }

  return { post, isLoading, fetchError };
};

export default usePostById;