import { useParams } from "react-router-dom";
import type { PostType } from '../types/index';
import PostFeed from "./PostFeed";
import DataState from "./DataState";
import useUserById from '../hooks/useUserById';
import useAxiosFetch from '../hooks/useAxiosFetch';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch the user by ID
  const { user, fetchError: fetchUserError, isLoading: isUserLoading } = useUserById(id ?? '');

  // Determine posts URL only if user exists
  const postsUrl = user ? `/posts?user=${user._id}` : null;
  const { data: postsData, fetchError: fetchPostsError, isLoading: isPostsLoading } = useAxiosFetch<PostType[]>(postsUrl);

  // Normalize posts so PostFeed always gets an array
  const posts: PostType[] = postsData ?? [];

  // Handle missing ID immediately
  if (!id) return <h1>That user fell in the void!</h1>;

  return (
    <DataState
      isLoading={isUserLoading}
      error={fetchUserError}
      isEmpty={!user}
      emptyMessage="That user could not be found!"
    >
      {user && (
        <div className="ProfilePage">
          <div className="ProfileHeader">
            <h1>{user.username}</h1>
            <h4>{user.name}</h4>
          </div>

          <DataState
            isLoading={isPostsLoading}
            error={fetchPostsError}
            isEmpty={posts.length === 0}
            emptyMessage="This user hasn't made any posts yet."
          >
            <div className="ProfilePosts">
              <PostFeed posts={posts} />
            </div>
          </DataState>
        </div>
      )}
    </DataState>
  );
};

export default ProfilePage;