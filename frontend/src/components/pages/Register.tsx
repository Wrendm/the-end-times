import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 5000);

            return () => clearTimeout(timer); // cleanup
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const data = await registerUser(form);

            setSuccess(true);
            setError("");
            setMessage(data.message);

            setForm({
                name: "",
                username: "",
                email: "",
                password: ""
            });


        } catch (err: any) {
            if (err.response) {
                const res = err.response.data;

                setError(res.message || "Registration failed");

                if (res.errors && Array.isArray(res.errors)) {
                    setErrors(res.errors);
                } else {
                    setErrors([]);
                }

            } else if (err.request) {
                setError("No response from server");
                setErrors([]);
            } else {
                setError("Network error");
                setErrors([]);
            }
        }
    };

    return (
        <div className="Form">
            <h1>User Registration</h1>

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
                    <h2>Success!</h2>
                    <h2>{message}</h2>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label className="label">Name</label>
                <input className="input" type="text" name="name" value={form.name} onChange={handleChange} />

                <label className="label">Username</label>
                <input className="input" type="text" name="username" value={form.username} onChange={handleChange} />

                <label className="label">Email</label>
                <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />

                <label className="label">Password</label>
                <input className="input" type="password" name="password" value={form.password} onChange={handleChange} />

                <button className="fullWidth-btn" type="submit">Submit</button>
            </form>
        </div>
    );
}
