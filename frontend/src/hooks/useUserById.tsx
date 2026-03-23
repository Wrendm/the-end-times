import useAxiosFetch from './useAxiosFetch';
import type { UserType } from '../types/index';

const useUserById = (userId?: string) => {
  const shouldFetch = !!userId;

  const { data, isLoading, fetchError } = useAxiosFetch<UserType>(
    shouldFetch ? `/users/${userId}` : null
  );

  return {
    user: data ?? null,
    isLoading,
    fetchError
  };
};

export default useUserById;