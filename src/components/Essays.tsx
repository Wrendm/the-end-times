import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import { useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const Essays = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data,
    fetchError,
    isLoading,
  } = useAxiosFetch<PostType[]>('http://localhost:3500/posts?postCategory=essay');

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isLoading) return <p>Loading posts...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;
  return (
    <div className="Essays">
      <PostFeed posts={posts} />
    </div>
  );
};

export default Essays;
