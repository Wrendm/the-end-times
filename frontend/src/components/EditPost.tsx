import { useState, useContext, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { updatePost } from "../api/postApi";
import DataState from "./DataState";
import { AuthContext } from "../context/authcontext";
import useAxiosFetch from "../hooks/useAxiosFetch";
import usePostById from '../hooks/usePostById';
import type { CategoryType } from "../types/index";

export default function EditPost() {
  const [form, setForm] = useState({
    title: "",
    postCategory: "",
    imgSrc: "",
    postContent: "",
    published: false,
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext)!;
  const { id } = useParams<{ id: string }>();
  const { post, isLoading: isLoadingPost, fetchError: fetchErrorPost } = usePostById(id!);
  const { data: categoryData, fetchError, isLoading } = useAxiosFetch<CategoryType[]>(`/categories`);
  const categories: CategoryType[] = categoryData ?? [];

  useEffect(() => {
    if (fetchError) setError(fetchError);
  }, [fetchError]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!post) return;
    setForm({
      title: post.title,
      postCategory: post.postCategory.id,
      imgSrc: post.imgSrc || "",
      postContent: post.postContent || "",
      published: post.published,
    });
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updatePost(id!, { ...form });
      setSuccess(true);
      setError("");
    } catch (err: any) {
      const res = err.response?.data;
      setError(res?.message || "Update failed");
      setErrors(Array.isArray(res?.errors) ? res.errors : []);
    }
  };

  if (auth.loading || isLoadingPost) {
    return <div className="loader" />;
  }

  if (!auth.user) {
    return <div>Not authenticated</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  if (auth.user.id !== post.user.id) {
    return <Navigate to="/" replace />;
  }

  return (
    <DataState
      isLoading={isLoadingPost}
      error={fetchErrorPost}
      isEmpty={!post && !isLoading && !fetchError}
      emptyMessage="That post fell in the void!"
    >
      <div className="Form">
        <h1>Edit Post</h1>
        {success && <div className="success">Post Edited!</div>}
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
        {loading && <div className="loader" />}
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
          <label>Category</label>
          <select name="postCategory" value={form.postCategory} onChange={handleChange}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option value={cat.id} key={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label>Image Source</label>
          <input name="imgSrc" value={form.imgSrc} onChange={handleChange} />
          <label>Post Content</label>
          <textarea name="postContent" value={form.postContent} onChange={handleChange} />
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
            <label>
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
          <button className="btn" type="submit">
            Save Edits
          </button>
        </form>
      </div>
    </DataState>
  );
}