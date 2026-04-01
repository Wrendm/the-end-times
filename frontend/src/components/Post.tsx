import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authcontext';
import type { PostType } from '../types/index';
import { deletePost } from "../api/postApi";

interface PostProps {
  post: PostType;
  onDelete?: (id: string) => void; 
}

const Post = ({ post, onDelete }: PostProps) => {
  const auth = useContext(AuthContext);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleDelete = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Confirmation popup
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await deletePost(post.id);
      setSuccess(true);
      setError("");
      onDelete?.(post.id); // notify parent to remove the post
    } catch (err: any) {
      const res = err.response?.data;
      setError(res?.message || "Delete failed");
      setErrors(Array.isArray(res?.errors) ? res.errors : []);
    }
  };

  // Hide post if successfully deleted
  if (success) return null;

  return (
    <>
      {auth?.user?.id === post.user.id && (
        <div className="OptionRow">
          <p>{post.published !== true ? 'Draft' : 'Published'}</p>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          <div className="ButtonRow">
            <Link to={`/post/${post.id}/edit`}>
              <button className="btn EditButton">Edit</button>
            </Link>
            <button className="btn DeleteButton" onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}

      {auth?.user?.id !== post.user.id && (
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
        {post.postCategory.type === 'Image' && (
          <p className='imagecontent'>
            <Link to={`/post/${post.id}`}>
              <img src={post.imgSrc} width="400px" />
            </Link>
          </p>
        )}
        {post.postCategory.name === 'Poetry' && (
          <p className='textcontent' style={{ width: "400px" }}>
            {post.postContent}
          </p>
        )}
        {post.postCategory.name === 'Essay' && post.postContent && (
          <>
            <p className='textcontent' style={{ width: "400px" }}>
              {post.postContent.slice(0, 270)}
            </p>
            <Link to={`/post/${post.id}`}><p>Continue reading...</p></Link>
          </>
        )}
      </div>
    </>
  );
};

export default Post;