import type { PostType } from '../types/index';
import useUserById from '../hooks/useUserById';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {
  const { username } = useUserById(post.userId);
  return (
    <>
      <div className="TopRow">
        <div><p>{username}</p></div>
        <div><p>{post.postdate}</p></div>
      </div>
      <div className="ContentRow">
        <p>{post.postContent}</p>
      </div>
    </>
  )
}

export default Post;