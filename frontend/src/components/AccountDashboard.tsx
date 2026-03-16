import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import PostFeed from "./PostFeed";
import DataState from "./DataState";
import useAxiosFetch from "../hooks/useAxiosFetch";
import type { PostType } from "../types/index";

const Dashboard = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    // Only fetch posts if the user is loaded
    const userId = auth.user?._id || null;

    const { data: postsData, fetchError: fetchPostsError, isLoading: isPostsLoading } =
        useAxiosFetch<PostType[]>(
            userId ? "/posts" : null,   // skip fetch if no user
            userId ? { params: { user: userId } } : undefined // send query param safely
        );

    const posts: PostType[] = postsData ?? [];

    return (
        <div className="ProfilePage">
            <div className="ProfileHeader">
                <h1>Welcome, {auth.user?.name}</h1>
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
            <div>
                <button className="btn" onClick={auth.logout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;