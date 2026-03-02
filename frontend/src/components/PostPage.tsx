import { useParams } from "react-router-dom";
import usePostById from '../hooks/usePostById';


const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  const { post, isLoading, fetchError } = usePostById(id ?? '');

  if (!id || !post) return <h1>That post fell in the void!</h1>;
  if (isLoading) return <p>Loading…</p>;
  if (fetchError) return <p>{fetchError}</p>;

  return (
    <>
      <div className="PostContentArea">
        {post.title == '' ? (<h1>Untitled</h1>) : (<h1>{post.title}</h1>)}
        <div><h2>{post.user.username}</h2></div>
        <div><h3>{new Date(post.createdAt).toLocaleDateString()}</h3></div>
        <div className="ContentRow">
          {post.imgSrc == '' ? (<br />) : (<p className='imagecontent'> <img src={post.imgSrc} width="400px" /> </p>)}
          {post.postContent == '' ? (<br />) : (<p className='textcontent' style={{ width: "400px" }} >{post.postContent}</p>)}
        </div>
      </div>
    </>
  )
}

export default PostPage;