import DataState from "../DataState";
import { useParams, Link } from "react-router-dom";
import usePostById from '../../hooks/usePostById';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    throw new Error('Post ID is required');
  }

  const { post, isLoading, fetchError } = usePostById(id);

  if (post && !post.createdAt) {
    throw new Error('Post is missing createdAt');
  }

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={!post && !isLoading && !fetchError}
      emptyMessage="That post fell in the void!"
    >
      {post && (
        <div className="ContentArea">
          <h1>{post.title || 'Untitled'}</h1>
          <div>
            {post.user?.id ? (
              <Link to={`/users/${post.user.id}`}>
                <h2>{post.user.username}</h2>
              </Link>
            ) : (
              <h2>Unknown User</h2>
            )}
          </div>

          <div>
            <h3>{new Date(post.createdAt).toLocaleDateString()}</h3>
          </div>

          <div className="ContentRow">
            {post.imgSrc ? (
              <p className="imagecontent">
                <img src={post.imgSrc} width="400px" />
              </p>
            ) : <br />}

            {post.postContent ? (
              <p className="textcontent">{post.postContent}</p>
            ) : <br />}
          </div>
        </div>
      )}
    </DataState>
  );
};

export default PostPage;