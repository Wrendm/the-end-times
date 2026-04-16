import { useState } from 'react';
import Post from '../../features/posts/Post';
import type { PostType } from '../../../types';

interface PostFeedProps {
  posts: PostType[];
}

const PostFeed = ({ posts }: PostFeedProps) => {
  // Convert posts prop to state so we can update it on deletion
  const [postList, setPostList] = useState<PostType[]>([...posts]);

  // Callback to remove a post when deleted
  const handleDeletePost = (id: string) => {
    setPostList(prev => prev.filter(post => post.id !== id));
  };

  return (
    <div className="PostFeed">
      {postList.toReversed().map(post => (
        <div className="PostCard" key={post.id}>
          <Post post={post} onDelete={handleDeletePost} />
        </div>
      ))}
    </div>
  );
};

export default PostFeed;