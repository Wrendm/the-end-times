import useAxiosFetch from './useAxiosFetch';
import type { UserType } from '../types/index';


const useUserById = (userID: string) => {
  const { data, isLoading, fetchError } = useAxiosFetch<UserType[]>(`http://localhost:3500/users?id=${userID}`);
  
  let user: UserType | null = null;

  if (data && data.length > 0) {
    user = data[0];
  }

  const username = user ? user.username : null;

  return { user, username, isLoading, fetchError};
};

export default useUserById;