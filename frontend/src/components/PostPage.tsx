import { useParams, Link } from "react-router-dom";
import usePostById from '../hooks/usePostById';


const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  const { post, isLoading, fetchError } = usePostById(id ?? '');

  if (isLoading) return <div className="loader"></div>;
  if (fetchError) return <p>{fetchError}</p>;
  if (!id) return <h1>That post fell in the void!</h1>;
  if (!post) return <h1>That post fell in the void!</h1>;

  return (
    <>
      <div className="ContentArea">
        {post.title == '' ? (<h1>Untitled</h1>) : (<h1>{post.title}</h1>)}
        <div><Link to={`/users/${post.user._id}`}><h2>{post.user.username}</h2></Link></div>
        <div><h3>{new Date(post.createdAt).toLocaleDateString()}</h3></div>
        <div className="ContentRow">
          {post.imgSrc == '' ? (<br />) : (<p className='imagecontent'> <img src={post.imgSrc} width="400px" /> </p>)}
          {post.postContent == '' ? (<br />) : (<p className='textcontent'>{post.postContent}</p>)}
        </div>
      </div>
    </>
  )
}

export default PostPage;