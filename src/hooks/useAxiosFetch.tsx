import {useState, useEffect} from 'react'
import axios from 'axios';

const useAxiosFetch = <T,>(dataUrl: string) => {
    const [data, setData] = useState<T | null>(null);
    const [fetchError, setFetchError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        const source = axios.CancelToken.source();

        const fetchData = async (url: string) => {
            setIsLoading(true);
            try{
                const response = await axios.get(url, {cancelToken: source.token});
                if(isMounted){
                    setData(response.data);
                    setFetchError('');
                }
            }catch (err: unknown){
                if(isMounted){
                    if(err instanceof Error){
                        setFetchError(err.message);
                    }
                
                setData(null);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
        }
        fetchData(dataUrl);

        const cleanUp = () => {
            isMounted = false;
            source.cancel();
        }
        return cleanUp;
    }, [dataUrl]);
    return {data, fetchError, isLoading};
}

export default useAxiosFetch;