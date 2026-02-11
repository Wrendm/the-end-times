import { Link } from 'react-router-dom';
import type { PostType } from '../types/index';

interface PostProps {
  post: PostType;
}

const Post = ({ post }: PostProps) => {

  return (
    <>
      <div className="TopRow">
        <div><p>{post.username}</p></div>
        <div><p>{post.postdate}</p></div>
      </div>
      <div className="ContentRow">
        {post.postType === 'image' && (<p className='imagecontent'><Link to={`/post/${post.id}`}> <img src={post.imgSrc} width="400px"/></Link> </p>)}
        {post.postCategory === 'poem' && (<p className='textcontent' style={{width: "400px"}} >{post.postContent}</p>)}
        {post.postCategory === 'essay' && (<><p className='textcontent' style={{width: "400px"}} >{post.postContent.slice(0, 270)}</p><Link to={`/post/${post.id}`}><p>Continue reading...</p></Link></>)}
      </div>
    </>
  )
}

export default Post;