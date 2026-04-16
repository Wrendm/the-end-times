import { useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/authcontext";
import PostFeed from "../features/posts/PostFeed.tsx";
import DataState from "../DataState";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import type { PostType } from "../../types/index";

const Dashboard = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    if (auth.loading) {
        return <div className="loader"></div>;
    }

    if (!auth.user) {
        return <div>Not authenticated</div>;
    }
    const userId = auth.user.id;

    const { data: postsData, fetchError: fetchPostsError, isLoading: isPostsLoading } =
        useAxiosFetch<PostType[]>(`/posts?user=${userId}`);

    const posts: PostType[] = postsData ?? [];

    return (
        <div className="ProfilePage">
            <div className="ProfileHeader">
                <h1>Welcome, {auth.user.name}</h1>
                <h2><Link to={`/users/${userId}/edit`}>Edit Account</Link></h2>
                <h2><Link to="/posts/create">Create a Post</Link></h2>
                {auth.user.roles.includes("Admin") && (
                    <h3>
                        <Link to="/admin">Admin Dashboard</Link>
                    </h3>
                )}
            </div>

            <DataState
                isLoading={isPostsLoading}
                error={fetchPostsError}
                isEmpty={posts.length === 0 && !isPostsLoading && !fetchPostsError}
                emptyMessage="Once you start making posts, you'll see them here!"
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