import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';
import useAxiosFetch from '../hooks/useAxiosFetch';
import DataState from '../components/DataState';

const Home = () => {
  // Fetch posts directly
  const { data, fetchError, isLoading } = useAxiosFetch<PostType[]>('/posts');

  // Ensure posts is always an array
  const posts = data ?? [];

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={posts.length === 0}
      emptyMessage="No posts to display. You should make one!"
    >
      <PostFeed posts={posts} />
    </DataState>
  );
};

export default Home;