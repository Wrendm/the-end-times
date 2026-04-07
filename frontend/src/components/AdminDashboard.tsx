import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/authcontext";
import DataState from "./DataState";
import DataTable from "./DataTable";
import useAxiosFetch from "../hooks/useAxiosFetch";
import type { PostType, UserType, CategoryType } from "../types/index";
import { userColumns, postColumns, categoryColumns } from "../types/columns";

type TabType = "users" | "posts" | "categories";

const AdminDashboard = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [tab, setTab] = useState<TabType>("users");

    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    if (!auth.user) return <div>Not authenticated</div>;
    if (!auth.user.roles.includes("Admin")) return <div>Forbidden</div>;

    const {
        data: postsData,
        fetchError: fetchPostsError,
        isLoading: isPostsLoading,
    } = useAxiosFetch<PostType[]>("/posts");

    const {
        data: usersData,
        fetchError: fetchUsersError,
        isLoading: isUsersLoading,
    } = useAxiosFetch<UserType[]>("/users");

    const {
        data: categoryData,
        fetchError: fetchCategoriesError,
        isLoading: isCategoriesLoading,
    } = useAxiosFetch<CategoryType[]>("/categories");

    useEffect(() => {
        if (postsData) setPosts(postsData);
    }, [postsData]);

    useEffect(() => {
        if (usersData) setUsers(usersData);
    }, [usersData]);

    useEffect(() => {
        if (categoryData) setCategories(categoryData);
    }, [categoryData]);

    const isLoading = isPostsLoading || isUsersLoading || isCategoriesLoading;
    const error = fetchPostsError || fetchUsersError || fetchCategoriesError;

    const isEmpty =
        !isLoading &&
        !error &&
        (tab === "users"
            ? users.length === 0
            : tab === "posts"
                ? posts.length === 0
                : categories.length === 0);

    return (
        <div className="ProfilePage">
            <div className="ProfileHeader">
                <h1>Welcome, {auth.user.roles.join(', ')} {auth.user.name}</h1>
            </div>
            <div className="AdminSubNav">
                <ul className='tabs'>
                    <li className='tab' onClick={() => { setTab('users'); }}>Users</li>
                    <li className='tab' onClick={() => { setTab('posts'); }}>Posts</li>
                    <li className='tab' onClick={() => { setTab('categories'); }}>Categories</li>
                </ul>
            </div>

            <DataState
                isLoading={isLoading}
                error={error}
                isEmpty={isEmpty}
                emptyMessage="No data to display"
            >
                {tab === "users" && <DataTable<'users'> dataset={users} columns={userColumns} />}
                {tab === "posts" && <DataTable<'posts'> dataset={posts} columns={postColumns} />}
                {tab === "categories" && <DataTable<'categories'> dataset={categories} columns={categoryColumns} />}
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