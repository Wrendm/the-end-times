import { useState } from "react";
import api from "../api/axios";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

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
            const { data } = await api.post("/auth/register", form);

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
                setError(err.response.data.message || "Registration failed");
            } else if (err.request) {
                setError("No response from server");
            } else {
                setError("Network error");
            }
        }
    };

    return (
        <div className="Form">
            <h1>User Registration</h1>

            {error && (
                <div className="error">
                    <h2>Error!</h2>
                    <h2>{error}</h2>
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

                <button className="btn" type="submit">Submit</button>
            </form>
        </div>
    );
}
