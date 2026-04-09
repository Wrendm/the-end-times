import useAxiosFetch from './useAxiosFetch';
import type { CategoryType } from '../types/index';

const useCategoryById = (categoryId?: string) => {
  const shouldFetch = !!categoryId;

  const { data, isLoading, fetchError } = useAxiosFetch<CategoryType>(
    shouldFetch ? `/categorys/${categoryId}` : null
  );

  return {
    category: data ?? null,
    isLoading,
    fetchError
  };
};

export default useCategoryById;