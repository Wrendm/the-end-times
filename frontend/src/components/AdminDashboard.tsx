import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import PostFeed from "./PostFeed";
import DataState from "./DataState";
import useAxiosFetch from "../hooks/useAxiosFetch";
import type { PostType } from "../types/index";

const AdminDashboard = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");
    if (!auth.user) {
        return <div>Not authenticated</div>;
    }
    if (!auth.user.roles.includes("Admin")) {
        return <div>Forbidden</div>;
    }

    const { data: postsData, fetchError: fetchPostsError, isLoading: isPostsLoading } = useAxiosFetch<PostType[]>('/posts');

    const posts = postsData ?? [];

    return (
        <div className="ProfilePage">
            <div className="ProfileHeader">
                <h1>Welcome, {auth.user.roles.join(', ')} {auth.user.name}</h1>
            </div>

            <DataState
                isLoading={isPostsLoading}
                error={fetchPostsError}
                isEmpty={posts.length === 0 && !isPostsLoading && !fetchPostsError}
                emptyMessage="No posts to display"
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

export default AdminDashboard;