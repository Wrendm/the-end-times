import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { updatePost } from "../../../api/postApi";
import DataState from "../../DataState";
import { AuthContext } from "../../../context/authcontext";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import usePostById from '../../../hooks/usePostById';
import type { CategoryType } from "../../../types/index";

type EditPostProps = {
  id: string;
};

export default function EditPost({ id }: EditPostProps) {
  const [form, setForm] = useState({ title: "", postCategory: "", postContent: "", published: false });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = useContext(AuthContext)!;
  const { post, isLoading: isLoadingPost, fetchError: fetchErrorPost } = usePostById(id!);
  const { data: categoryData, fetchError, isLoading } = useAxiosFetch<CategoryType[]>(`/categories`);
  const categories: CategoryType[] = categoryData ?? [];

  const navigate = useNavigate();

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
      postContent: post.postContent || "",
      published: post.published,
    });
  }, [post]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 2000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("postCategory", form.postCategory);
    formData.append("postContent", form.postContent);
    formData.append("published", String(form.published));
    if (file) formData.append("image", file);

    try {
      await updatePost(id!, formData);
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

  if (auth.user.id !== post.user.id && !auth.user?.roles.includes("Admin")) {
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
          <Link to={`/categories/create`} className='readmore'><p>Is something missing? Submit an option!</p></Link>
          <select name="postCategory" value={form.postCategory} onChange={handleChange}>
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