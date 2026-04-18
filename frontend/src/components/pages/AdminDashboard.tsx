import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authcontext";
import DataState from "../DataState";
import DataTable from "../table/DataTable";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import type { PostType, UserType, CategoryType } from "../../types/index";
import { postColumns } from "../../types/postColumns";
import { userColumns } from "../../types/userColumns";
import { categoryColumns } from "../../types/categoryColumns";
import { deletePost } from "../../api/postApi";
import { deleteUser } from "../../api/userApi";
import { deleteCategory } from "../../api/categoryApi";
import { Link } from "react-router-dom";

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
    } = useAxiosFetch<PostType[]>("/admin/posts");

    const {
        data: usersData,
        fetchError: fetchUsersError,
        isLoading: isUsersLoading,
    } = useAxiosFetch<UserType[]>("/admin/users");

    const {
        data: categoryData,
        fetchError: fetchCategoriesError,
        isLoading: isCategoriesLoading,
    } = useAxiosFetch<CategoryType[]>("/admin/categories");

    useEffect(() => {
        if (postsData) setPosts(postsData);
    }, [postsData]);

    useEffect(() => {
        if (usersData) setUsers(usersData);
    }, [usersData]);

    useEffect(() => {
        if (categoryData) setCategories(categoryData);
    }, [categoryData]);

    const handleDeletePost = async (id: string) => {
        try {
            await deletePost(id);
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err) { console.error(err); alert("Failed to delete post"); }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) { console.error(err); alert("Failed to delete user"); }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (err) { console.error(err); alert("Failed to delete category"); }
    };

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

            <DataState isLoading={isLoading} error={error} isEmpty={isEmpty} emptyMessage="No data to display">
                {tab === "users" && <DataTable<UserType>
                    dataset={users}
                    columns={userColumns(handleDeleteUser)}
                />}
                {tab === "posts" && <DataTable<PostType>
                    dataset={posts}
                    columns={postColumns(handleDeletePost)}
                />
                }
                {tab === "categories" &&
                    <h4 className='AccountAction' style={{margin: "20px 80px"}}>
                        <Link to={`admin/categories/create`}>
                        New Category</Link>
                    </h4>
                }
                {tab === "categories" && <DataTable<CategoryType>
                    dataset={categories}
                    columns={categoryColumns(handleDeleteCategory)}
                />}
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