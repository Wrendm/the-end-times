import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DataState from "../../DataState";
import { AuthContext } from "../../../context/authcontext";
import useUserById from "../../../hooks/useUserById";
import { updateUser } from "../../../api/userApi";
import api from "../../../api/axios";

export default function EditUser() {
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        bio: ""
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const auth = useContext(AuthContext)!;

    const {
        user: selectedUser,
        isLoading,
        fetchError
    } = useUserById(id!);

    const navigate = useNavigate();

    useEffect(() => {
        if (fetchError) setError(fetchError);
    }, [fetchError]);

    useEffect(() => {
        if (!selectedUser) return;
        setForm({
            name: selectedUser.name,
            username: selectedUser.username,
            password: "",
            bio: selectedUser.bio || ""
        });
    }, [selectedUser]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/dashboard");
            }, 5000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Only include password if it has a value
        const payload = {
            name: form.name,
            username: form.username,
            bio: form.bio,
            ...(form.password ? { password: form.password } : {})
        };

        try {
            await updateUser(id!, payload);
            const me = await api.get("/auth/me");
            auth.login(me.data.data);
            setForm((prev) => ({
                ...prev,
                bio: payload.bio,
                name: payload.name,
                username: payload.username
            }));
            setSuccess(true);
            setError("");
            setErrors([]);
        } catch (err: any) {
            const res = err.response?.data;
            setError(res?.message || "Update failed");
            setErrors(Array.isArray(res?.errors) ? res.errors : []);
        }
    };

    if (auth.loading || isLoading) return     <div>
      <div className="loader"></div>
      <p>Don't worry, it'll load, it just takes a second because I'm on the free tier :P</p>
      <p>Tell enough of your friends and maybe I'll start paying for it</p>
    </div>;
    if (!auth.user) return <div>Not authenticated</div>;
    if (!selectedUser && !isLoading && !fetchError) return <div>User not found</div>;
    if (auth.user.id !== selectedUser?.id && !auth.user?.roles.includes("Admin")) return <Navigate to="/" replace />;

    return (
        <DataState
            isLoading={isLoading}
            error={fetchError}
            isEmpty={!selectedUser && !isLoading && !fetchError}
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
                        {form.bio}
                        {form.name}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="label">Name</label>
                    <input className="input" type="text" name="name" value={form.name} onChange={handleChange} />

                    <label className="label">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                    />

                    <label className="label">Username</label>
                    <input className="input" type="text" name="username" value={form.username} onChange={handleChange} />

                    <label className="label">Password</label>
                    <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" />

                    <button className="fullWidth-btn" type="submit">Submit</button>
                </form>
            </div>
        </DataState>
    );
}