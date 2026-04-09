import { useState, useContext, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import DataState from "./DataState";
import { AuthContext } from "../context/authcontext";
import useUserById from "../hooks/useUserById";
import { updateUser } from "../api/userApi";

export default function EditUser() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const auth = useContext(AuthContext)!;
    const { id } = useParams<{ id: string }>();
    const { user, isLoading, fetchError } = useUserById(id!);

    const navigate = useNavigate();

    useEffect(() => {
        if (fetchError) setError(fetchError);
    }, [fetchError]);

    useEffect(() => {
        if (!user) return;
        setForm({
            name: user.name,
            username: user.username,
            password: ""
        });
    }, [user]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/dashboard");
            }, 5000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Only include password if it has a value
        const payload = {
            name: form.name,
            username: form.username,
            ...(form.password ? { password: form.password } : {})
        };

        try {
            await updateUser(id!, payload);
            setSuccess(true);
            setError("");
            setErrors([]);
        } catch (err: any) {
            const res = err.response?.data;
            setError(res?.message || "Update failed");
            setErrors(Array.isArray(res?.errors) ? res.errors : []);
        }
    };

    if (auth.loading || isLoading) return <div className="loader" />;
    if (!auth.user) return <div>Not authenticated</div>;
    if (!user && !isLoading && !fetchError) return <div>User not found</div>;
    if (auth.user.id !== user?.id && !auth.user?.roles.includes("Admin")) return <Navigate to="/" replace />;

    return (
        <DataState
            isLoading={isLoading}
            error={fetchError}
            isEmpty={!user && !isLoading && !fetchError}
            emptyMessage="That user fell in the void!"
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

                    <label className="label">Username</label>
                    <input className="input" type="text" name="username" value={form.username} onChange={handleChange} />

                    <label className="label">Password</label>
                    <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" />

                    <button className="btn" type="submit">Submit</button>
                </form>
            </div>
        </DataState>
    );
}