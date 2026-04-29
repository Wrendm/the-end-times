import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/authcontext';
import type { PostType } from '../../../types/index';
import EditPost from './EditPost';
import PostOptionsMenu from './PostOptionsMenu';
import { deletePost } from "../../../api/postApi";
import Popup from '../../ui/Popup';

interface PostProps {
  post: PostType;
  onDelete?: (id: string) => void;
}

const Post = ({ post, onDelete }: PostProps) => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [editPopup, setEditPopup] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await deletePost(post.id);
      setError("");
      onDelete?.(post.id);
    } catch (err: any) {
      const res = err.response?.data;
      setError(res?.message || "Delete failed");
      setErrors(Array.isArray(res?.errors) ? res.errors : []);
    }
  };

  return (
    <>
      {error && <p className="error">{error}</p>}
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
      {(auth?.user?.id === post.user.id) && (
        <div className="OptionRow">
          <p>{post.published !== true ? 'Draft' : 'Published'} {new Date(post.createdAt).toLocaleDateString()}</p>
          <PostOptionsMenu
            onEdit={() => setEditPopup(true)}
            onDelete={handleDelete}
          />
        </div>
      )}

      {(auth?.user?.id !== post.user.id) && (
        <div className="TopRow">
          <div>
            <Link to={`/users/${post.user.id}`}><p>{post.user.username}</p></Link>
          </div>
          <div>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <div className="ContentRow">
        {post.title && (
          <Link to={`/posts/${post.id}`} className='title'><h4>
            {post.title}
          </h4></Link>
        )}
        {post.postCategory.type === 'Image' && (
          <div className='imagecontent'>
            <Link to={`/posts/${post.id}`}>
              <img src={post.imgSrc} />
            </Link>
          </div>
        )}
        {post.postCategory.type === 'Video' && (
          <div className='videocontent'>
            <iframe width="400" height="300" src={post.videoSrc}></iframe>
          </div>
        )}
        {post.postCategory.name === 'Poetry' && (
          <p className='textcontent'>
            {post.postContent}
          </p>
        )}
        {post.postCategory.name === 'Essay' && post.postContent && (
          <>
            <p className='textcontent'>
              {post.postContent.slice(0, 270)}
            </p>
            <Link to={`/posts/${post.id}`} className='readmore'><p>Continue reading...</p></Link>
          </>
        )}
        <Popup trigger={editPopup} setTrigger={setEditPopup}>
          <EditPost />
        </Popup>
      </div>
    </>
  );
};

export default Post;