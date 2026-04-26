import { useParams } from "react-router-dom";
import type { PostType } from '../../types/index';
import PostFeed from "../features/posts/PostFeed.tsx";
import DataState from "../DataState";
import PageNotFound from "./PageNotFound";
import useUserById from '../../hooks/useUserById';
import useAxiosFetch from '../../hooks/useAxiosFetch';

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <h1>That user fell in the void!</h1>;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return <PageNotFound />;
  }

  const { user, fetchError: fetchUserError, isLoading: isUserLoading } = useUserById(id);

  const postsUrl = user ? `/posts?user=${user.id}` : null;

  const {
    data: postsData,
    fetchError: fetchPostsError,
    isLoading: isPostsLoading,
  } = useAxiosFetch<PostType[]>(postsUrl);

  const posts: PostType[] = postsData ?? [];

  return (
    <DataState
      isLoading={isUserLoading}
      error={fetchUserError}
      isEmpty={!user}
      emptyMessage="That user could not be found!"
    >
      {user && (
        <div className="ProfilePage">
          <div className="ProfileInfo">
            <h1>{user.username}</h1>
            <h4>{user.name}</h4>
          </div>
          <div className="ProfileInfo">
            {user.bio && <p>{user.bio}</p>}
          </div>

          <DataState
            isLoading={isPostsLoading}
            error={fetchPostsError}
            isEmpty={posts.length === 0 && !isPostsLoading && !fetchPostsError}
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