import PostFeed from "../features/posts/PostFeed.tsx";
import type { PostType } from '../../types/index';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import DataState from '../DataState';
import SideBar from "../layout/Sidebar.tsx";

const Home = () => {
  // Fetch posts directly
  const { data, fetchError, isLoading } = useAxiosFetch<PostType[]>('/posts');

  // Ensure posts is always an array
  const posts = data ?? [];

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={posts.length === 0 && !isLoading && !fetchError}
      emptyMessage="No posts to display. You should make one!"
    >
      <PostFeed posts={posts} />
      <SideBar />
    </DataState>
  );
};

export default Home;