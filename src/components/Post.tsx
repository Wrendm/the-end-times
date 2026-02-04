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
        {post.postType === 'text' && (<p className='imagecontent'>{post.postContent}</p>)}
        {post.postType === 'image' && (<p className='imagecontent'> <img src={post.imgSrc} height="400"/> </p>)}
      </div>
    </>
  )
}

export default Post;