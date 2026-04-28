import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';

import type { PostType, UserType } from '../../types';
import Post from '../features/posts/Post';
import UserCard from '../features/users/UserCard';

const SearchResults = () => {
  const location = useLocation();

  const q = new URLSearchParams(location.search).get('q') ?? '';

  const [postResults, setPostResults] = useState<PostType[]>([]);
  const [userResults, setUserResults] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const postRes = await api.get<PostType[]>('/posts/search', {
          params: { q }
        });

        setPostResults(postRes.data);

        const userRes = await api.get<UserType[]>('/users/search', {
          params: { q }
        });

        setUserResults(userRes.data);
      } catch {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div className='ContentArea'>
      <h2>User Results for "{q}"</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="UserFeed">
        {!loading && userResults.length === 0 && <p>No users found.</p>}

        {userResults.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <h2>Post Results for "{q}"</h2>
      {loading && <p>Loading...</p>}
      <div className="PostFeed">
        {!loading && postResults.length === 0 && <p>No posts found.</p>}

        {postResults.map((post) => (
          <div className="PostCard">
            <Post key={post.id} post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;