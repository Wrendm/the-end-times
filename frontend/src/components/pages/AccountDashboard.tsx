import { useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../../context/authcontext";
import PostFeed from "../features/posts/PostFeed.tsx";
import DataState from "../DataState";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import type { PostType } from "../../types/index";
import { MdOutlineEditNote, MdOutlineAdminPanelSettings, MdLogout } from "react-icons/md";
import { BsBrush } from "react-icons/bs";

const Dashboard = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    if (auth.loading) {
        return <div className="loader">
            <p>Don't worry, it'll load, it just takes a second because I'm on the free tier :P</p>
            <p>Tell enough of your friends and maybe I'll start paying for it</p>
        </div>;
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
                <div className="ProfileActionsWrapper">
                    <h2 className='AccountAction'><Link to={`/users/${userId}/edit`}><MdOutlineEditNote />Edit Account</Link></h2>
                    <h2 className='AccountAction'><Link to="/posts/create"><BsBrush />Create a Post</Link></h2>
                    {auth.user.roles.includes("Admin") && (
                        <h2 className='AccountAction'>
                            <Link to="/admin"><MdOutlineAdminPanelSettings />Admin Dashboard</Link>
                        </h2>
                    )}
                    <div className="AccountAction">
                        <button onClick={auth.logout} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <MdLogout />Logout
                        </button>
                    </div>
                </div>
            </div>
            <div className="ProfileInfo">
                <h4>@{auth.user.username}</h4>
                {auth.user.bio && (
                    <div><p className='bio'>
                        {auth.user.bio}
                    </p></div>
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
        </div>
    );
};

export default Dashboard;