import { useState, useContext, useEffect } from "react";
import { createPost } from "../api/postApi";
import { AuthContext } from "../context/authcontext";
import useAxiosFetch from "../hooks/useAxiosFetch";
import type { CategoryType } from "../types/index";

export default function CreatePost() {
    const [form, setForm] = useState({
        title: "",
        postCategory: "",
        postContent: "",
        published: false,
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found");

    if (auth.loading) {
        return <div className="loader"></div>;
    }

    if (!auth.user) {
        return <div>Not authenticated</div>;
    }

    const { data: categoryData, fetchError, isLoading } =
        useAxiosFetch<CategoryType[]>(`/categories`);

    const categories: CategoryType[] = categoryData ?? [];

    useEffect(() => {
        if (fetchError) {
            setError(fetchError);
        }
    }, [fetchError]);
    useEffect(() => {
        if (isLoading) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [isLoading]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("postCategory", form.postCategory);
            formData.append("postContent", form.postContent);
            formData.append("published", String(form.published));
            if (file) formData.append("image", file);

            await createPost(formData);

            setSuccess(true);
            setError("");
            setForm({ title: "", postCategory: "", postContent: "", published: false });
            setFile(null);
        } catch (err: any) {
            const res = err.response?.data;
            setError(res?.message || "Creation failed");
            setErrors(Array.isArray(res?.errors) ? res.errors : []);
        }
    };

    return (
        <div className="Form">
            <h1>Create Post</h1>
            {success && <div className="success">Post Created!</div>}
            {error && (
                <div className="error">
                    <h2>Error!</h2>
                    <h3>{error}</h3>
                    {errors.length > 0 && (
                        <ul>
                            {errors.map((errMsg, i) => (
                                <li key={i}>{errMsg}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            {loading && (
                <div className="loader">
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} />
                <label>Category</label>
                <select
                    name="postCategory"
                    value={form.postCategory}
                    onChange={handleChange}
                >
                    <option value="">Select a category</option>

                    {categories.map((cat) => (
                        <option value={cat.id} key={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <label>Image</label>
                <input type="file" onChange={handleFileChange} />
                <label>Post Content</label>
                <textarea
                    name="postContent"
                    value={form.postContent}
                    onChange={handleChange}
                />
                <label>Published</label>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="published"
                            value="true"
                            checked={form.published === true}
                            onChange={() => setForm({ ...form, published: true })}
                        />
                        True
                    </label>
                    <label >
                        <input
                            type="radio"
                            name="published"
                            value="false"
                            checked={form.published === false}
                            onChange={() => setForm({ ...form, published: false })}
                        />
                        False
                    </label>
                </div>

                <button className="btn" type="submit">Create Post</button>
            </form>
        </div>
    );
}