import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import { useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const Paintings = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data,
    fetchError,
    isLoading,
  } = useAxiosFetch<PostType[]>('/posts?postCategory=painting');

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isLoading) return <div className="loader"></div>;
  if (fetchError) return <div className="FetchError"><h1>Error: {fetchError}</h1></div>;
  return (
    <div className="Paintings">
      <PostFeed posts={posts} />
    </div>
  );
};

export default Paintings;
