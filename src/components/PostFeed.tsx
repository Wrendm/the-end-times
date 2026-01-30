import Post from './Post';

const PostFeed = ({ posts }: {posts: any[]}) => {
  return (
    <div className="PostFeed">
        {posts.toReversed().map(post => (
          <div className="PostCard" key={post.id}>
            <Post post={post}/>
          </div>
        ))}
    </div>
  );
};

export default PostFeed;
