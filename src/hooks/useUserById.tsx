import useAxiosFetch from './useAxiosFetch';
import type { UserType } from '../types/index';


const useUserById = (userID: string) => {
  const { data } = useAxiosFetch<UserType[]>(`http://localhost:3500/users?id=${userID}`);

  const user = data?.[0];

  return { user, username:user?.username};
};

export default useUserById;