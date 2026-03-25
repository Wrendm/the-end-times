import { useState, useEffect } from 'react'
import { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import api from '../api/axios';

const useAxiosFetch = <T,>(url: string | null, config?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [fetchError, setFetchError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(url, { ...config, signal: controller.signal });
        if (isMounted) {
          setData(response.data.data);
          setFetchError('');
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        if (err instanceof AxiosError) setFetchError(err.message);
        else if (err instanceof Error) setFetchError(err.message);
        else setFetchError('Unknown error');
        setData(null);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url, config]);

  return { data, fetchError, isLoading };
};

export default useAxiosFetch;