import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import { useState, useEffect } from 'react';
import useAxiosFetch from '../hooks/useAxiosFetch';

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  const {
    data,
    fetchError,
    isLoading,
  } = useAxiosFetch<PostType[]>('/posts');

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (!isLoading && posts.length === 0) return <h1 style={{  display: "flex", justifyContent: "center", paddingTop: "50px", minHeight:"80%"}}> No posts to display. You should make one!</h1>;
  if (isLoading) return <div className="loader"></div>;
  if (fetchError) return <div className="FetchError"><h1>Error: {fetchError}</h1></div>;
  return (
    <div className="Home">
      <PostFeed posts={posts} />
    </div>
  );
};

export default Home;
