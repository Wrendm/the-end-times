import { Link } from 'react-router-dom';
import type { UserType } from '../../../types/index';

interface UserCardProps {
  user: UserType;
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="UserCard">
      <Link to={`/users/${user.id}`}>
        <p style={{ fontWeight: "bold" }}>{user.username}</p>
      </Link>
      <p>{user.name}</p>

    </div>
  );
};

export default UserCard;