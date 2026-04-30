import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DataState from "../../DataState";
import { AuthContext } from "../../../context/authcontext";
import useCategoryById from "../../../hooks/useCategoryById";
import { updateCategory } from "../../../api/categoryApi";

export default function EditCategory({id}:{id:string}) {
    const [form, setForm] = useState({
        name: "",
        published: false
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const auth = useContext(AuthContext)!;
    if (!id) return <div>Post not found</div>;
    const { category, isLoading, fetchError } = useCategoryById(id);

    const navigate = useNavigate();

    useEffect(() => {
        if (fetchError) setError(fetchError);
    }, [fetchError]);

    useEffect(() => {
        if (!category) return;
        setForm({
            name: category.name,
            published: category.published
        });
    }, [category]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/admin");
            }, 2000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const isPublished = auth.user?.roles.includes("Admin") ? form.published : false;

            const payload = {
                name: form.name,
                published: isPublished,
            };

            await updateCategory(id, payload);

            setSuccess(true);
            setError("");
            setForm({ name: "", published: false });
        } catch (err: any) {
            const res = err.response?.data;
            setError(res?.message || "Creation failed");
            setErrors(Array.isArray(res?.errors) ? res.errors : []);
        }
    };

    if (auth.loading || isLoading) return <div className="loader">
              <p>Don't worry, it'll load, it just takes a second because I'm on the free tier :P</p>
      <p>Tell enough of your friends and maybe I'll start paying for it</p>
    </div>;
    if (!auth.user) return <div>Not authenticated</div>;
    if (!category && !isLoading && !fetchError) return <div>User not found</div>;
    if (!auth.user?.roles.includes("Admin")) return <Navigate to="/" replace />;

    return (
        <DataState
            isLoading={isLoading}
            error={fetchError}
            isEmpty={!category && !isLoading && !fetchError}
            emptyMessage="That category fell in the void!"
        >
            <div className="Form">
                <h1>Edit Account</h1>

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

                {success && (
                    <div className="success">
                        <h2>Account Updated!</h2>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="label">Name</label>
                    <input className="input" type="text" name="name" value={form.name} onChange={handleChange} />

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

                    <button className="fullWidth-btn" type="submit">Submit</button>
                </form>
            </div>
        </DataState>
    );
}