import { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DataState from "../../DataState";
import { AuthContext } from "../../../context/authcontext";
import useUserById from "../../../hooks/useUserById";
import { updateUserRoles } from "../../../api/userApi";
type EditUserProps = {
  id: string;
};


export default function EditUserRoles({ id }: EditUserProps) {
    const [form, setForm] = useState<{
        roles: string[];
    }>({
        roles: []
    });
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);

    const auth = useContext(AuthContext)!;
    const { user, isLoading, fetchError } = useUserById(id!);

    const navigate = useNavigate();

    const rolesEnum = ['Contributor', 'Admin', 'Editor'];

    useEffect(() => {
        if (fetchError) setError(fetchError);
    }, [fetchError]);

    useEffect(() => {
        if (!user) return;
        setForm({
            roles: user.roles
        });
    }, [user]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/admin");
            }, 5000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);

    const handleRoleChange = (role: string) => {
        setForm(prev => {
            const exists = prev.roles.includes(role);

            return {
                ...prev,
                roles: exists
                    ? prev.roles.filter(r => r !== role)
                    : [...prev.roles, role]
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Only include password if it has a value
        const payload = {
            roles: form.roles
        };

        try {
            await updateUserRoles(id!, payload);
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
                    <label className="label">Roles</label>

                    {rolesEnum.map(role => (
                        <label key={role}>
                            <input
                                type="checkbox"
                                checked={form.roles.includes(role)}
                                onChange={() => handleRoleChange(role)}
                            />
                            {role}
                        </label>
                    ))}

                    <button className="btn" type="submit">Submit</button>
                </form>
            </div>
        </DataState>
    );
}