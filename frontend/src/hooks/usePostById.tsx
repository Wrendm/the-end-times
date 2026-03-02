import useAxiosFetch from './useAxiosFetch'
import type { PostType } from '../types/index'

const usePostById = (postId?: string) => {
  if (!postId) return { post: null, isLoading: false, fetchError: '' }

  const { data: post, isLoading, fetchError } = useAxiosFetch<PostType>(`/posts/${postId}`)

  return { post, isLoading, fetchError }
}

export default usePostById