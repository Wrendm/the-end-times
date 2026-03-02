import Post from './Post';

const PostFeed = ({ posts }: { posts: any[] }) => {
  if (!posts || posts.length === 0) {
    return <h1>No posts found for this category. You should make one!</h1>;
  }
  return (
    <div className="PostFeed">
      {posts.toReversed().map(post => (
        <div className="PostCard" key={post._id}>
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
