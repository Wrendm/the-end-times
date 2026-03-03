import useAxiosFetch from './useAxiosFetch';
import type { UserType } from '../types/index';

const useUserById = (userId?: string) => {
  if (!userId) return { user: null, isLoading: false, fetchError: '' }

  const { data: user, isLoading, fetchError } = useAxiosFetch<UserType>(`/users/${userId}`);

  return { user, isLoading, fetchError};
};

export default useUserById;