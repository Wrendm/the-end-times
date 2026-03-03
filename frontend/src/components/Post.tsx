import { Link } from 'react-router-dom';
import type { PostType } from '../types/index';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {

  return (
    <>
      <div className="TopRow">
        <div><Link to={`/users/${post.user._id}`}><p>{post.user.username}</p></Link></div>
        <div><p>{new Date(post.createdAt).toLocaleDateString()}</p></div>
      </div>
      <div className="ContentRow">
        {post.postType === 'image' && (<p className='imagecontent'><Link to={`/post/${post._id}`}> <img src={post.imgSrc} width="400px"/></Link> </p>)}
        {post.postCategory === 'poem' && (<p className='textcontent' style={{width: "400px"}} >{post.postContent}</p>)}
        {post.postCategory === 'essay' && post.postContent && (<><p className='textcontent' style={{width: "400px"}} >{post.postContent.slice(0, 270)}</p><Link to={`/post/${post._id}`}><p>Continue reading...</p></Link></>)}
      </div>
    </>
  )
}

export default Post;