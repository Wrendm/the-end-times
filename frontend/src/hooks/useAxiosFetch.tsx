import { useState, useEffect } from 'react'
import axios from 'axios';

const useAxiosFetch = <T,>(dataUrl: string) => {
    const [data, setData] = useState<T | null>(null);
    const [fetchError, setFetchError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchData = async (url: string) => {
            setIsLoading(true);
            try {
                const response = await axios.get(url, { signal: controller.signal });
                if (isMounted) {
                    setData(response.data);
                    setFetchError('');
                }
            } catch (err: unknown) {
                if (!isMounted) return;

                if (axios.isAxiosError(err)) {
                    setFetchError(err.message);
                } else if (err instanceof Error) {
                    setFetchError(err.message);
                } else {
                    setFetchError('Unknown error');
                }

                setData(null);
            } finally {
                isMounted && setIsLoading(false);
            }
        }
        fetchData(dataUrl);

        const cleanUp = () => {
            isMounted = false;
            controller.abort();
        }
        return cleanUp;
    }, [dataUrl]);
    return { data, fetchError, isLoading };
}

export default useAxiosFetch;