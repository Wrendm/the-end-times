import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';

import type { PostType } from '../../types';
import Post from '../features/posts/Post';

const SearchResults = () => {
  const location = useLocation();

  const q = new URLSearchParams(location.search).get('q') ?? '';

  const [results, setResults] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q.trim()) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get<PostType[]>('/posts/search', {
          params: { q }
        });

        setResults(res.data);
      } catch {
        setError('Failed to fetch results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <div>
      <h2>Results for "{q}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && results.length === 0 && <p>No results found.</p>}

      {results.map((post) => (
        <div key={post.id} className="PostCard">
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default SearchResults;