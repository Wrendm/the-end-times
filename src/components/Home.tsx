import PostFeed from "./PostFeed";
import type { PostType } from '../types/index';

type HomeProps = {
  posts: PostType[];
  isLoading: boolean;
  fetchError: string;
};

const Home = ({ posts, isLoading, fetchError }: HomeProps) => {
  if (isLoading) return <p>Loading posts...</p>;
  if (fetchError) return <p>Error: {fetchError}</p>;
  return (
    <div className="Home">
      <PostFeed posts={posts} />
    </div>
  );
};

export default Home;
