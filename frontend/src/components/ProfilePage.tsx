import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import type { PostType } from '../types/index';
import PostFeed from "./PostFeed";
import useUserById from '../hooks/useUserById';
import useAxiosFetch from '../hooks/useAxiosFetch';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  const { user, fetchError: fetchUserError, isLoading: isUserLoading } = useUserById(id ?? '');

  const [posts, setPosts] = useState<PostType[]>([]);
  const postsUrl = user ? `/posts?user=${user._id}` : null;

  const {data, fetchError: fetchPostsError, isLoading: isPostsLoading} = useAxiosFetch<PostType[]>(postsUrl);

  useEffect(() => {
    if (data) {
      setPosts(data);
    }
  }, [data]);

  if (isUserLoading) return <p>Loading…</p>;
  if (fetchUserError) return <p>{fetchUserError}</p>;

  if (isPostsLoading) return <p>Loading posts...</p>;
  if (fetchPostsError) return <p>Error: {fetchPostsError}</p>;

  
  if (!id) return <h1>That user fell in the void!</h1>;
  if (!user) return <h1>That user fell in the void!</h1>;
  if (!data) return <h1>That user's posts fell in the void!</h1>;

  return (
    <>
      <div>
        <div className="ProfileHeader">
          <h1>{user.username}</h1>
          <h4>{user.name}</h4>
        </div>
        <div className="ProfilePosts">
          <PostFeed posts={posts} />
        </div>
      </div>
    </>
  )
}

export default ProfilePage;