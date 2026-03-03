import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import { useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const Poetry = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data,
    fetchError,
    isLoading,
  } = useAxiosFetch<PostType[]>('/posts?postCategory=poem');

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isLoading) return <div className="loader"></div>;
  if (fetchError) return <p>Error: {fetchError}</p>;
  return (
    <div className="Poetry">
      <PostFeed posts={posts} />
    </div>
  );
};

export default Poetry;
