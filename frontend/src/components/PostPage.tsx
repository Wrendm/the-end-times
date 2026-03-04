import DataState from "./DataState";
import { useParams, Link } from "react-router-dom";
import usePostById from '../hooks/usePostById';

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  const { post, isLoading, fetchError } = usePostById(id ?? '');

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={!post}
      emptyMessage="That post fell in the void!"
    >
      <div className="ContentArea">
        <h1>{post?.title || 'Untitled'}</h1>

        <div>
          <Link to={`/users/${post!.user._id}`}>
            <h2>{post!.user.username}</h2>
          </Link>
        </div>

        <div>
          <h3>{new Date(post!.createdAt).toLocaleDateString()}</h3>
        </div>

        <div className="ContentRow">
          {post!.imgSrc ? (
            <p className="imagecontent">
              <img src={post!.imgSrc} width="400px" />
            </p>
          ) : <br />}
          
          {post!.postContent ? (
            <p className="textcontent">{post!.postContent}</p>
          ) : <br />}
        </div>
      </div>
    </DataState>
  );
};

export default PostPage;