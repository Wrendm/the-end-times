import type { UserType } from '../../types';
import { Link } from 'react-router-dom';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import DataState from '../DataState';

const SideBar = () => {
  const { data, fetchError, isLoading } = useAxiosFetch<UserType[]>(
    `/categories`
  );

  const userList = data ?? [];

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={userList.length === 0 && !isLoading && !fetchError}
      emptyMessage="No categories to display. You should make one!"
    >
      <div className="SideBar">
        {userList.toReversed().map(user => (
          <div className="" key={user.id}>
            <Link to={`/users/${user.id}`}><p>{user.username}</p></Link>
          </div>
        ))}
      </div>
    </DataState>
  );
};

export default SideBar;

