import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import api from '../api/axios';

type Params = Record<string, string | number | boolean | undefined>;

const useAxiosFetch = <T,>(
  url: string | null,
  config?: AxiosRequestConfig,
  params?: Params
) => {
  const [data, setData] = useState<T | null>(null);
  const [fetchError, setFetchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);

    try {
      const response = await api.get(url, {
        ...config,
        params,
      });

      setData(response.data.data);
      setFetchError('');
    } catch (err: unknown) {
      setData(null);

      if (err instanceof AxiosError) {
        const response = err.response?.data;
        const message = response?.message || err.message;
        const errors = response?.errors;

        if (errors && Array.isArray(errors)) {
          setFetchError(`${message}\n${errors.join('\n')}`);
        } else {
          setFetchError(message);
        }
      } else if (err instanceof Error) {
        setFetchError(err.message);
      } else {
        setFetchError('Unknown error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, config, params]);

  // initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // manual refetch trigger
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, fetchError, isLoading, refetch };
};

export default useAxiosFetch;