import { useState } from "react";
import api from '../api/axios';

export default function Login() {
    const [form, setForm] = useState({
        username: "",
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
            const { data } = await api.post('/auth/login', form)

            setSuccess(true);
            setError("");
            setMessage(data.message);

            setForm({
                username: "",
                password: ""
            });
            
        } catch (err: any) {
            if (err.response) {
                // Backend responded with an error code
                setError(err.response.data.message || 'Login failed')
            } else if (err.request) {
                // Request made but no response
                setError('No response from server')
            } else {
                setError('Network error')
            }
        }
    }

    return (
        <div className="Form">
            <div>
                <h1>User Login</h1>
            </div>

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
                <label className="label">Username</label>
                <input onChange={handleChange} className="input" name="username" value={form.username} type="text" />

                <label className="label">Password</label>
                <input onChange={handleChange} className="input" name="password" value={form.password} type="password" />

                <button className="btn" type="submit">Login</button>
            </form>
        </div>
    );
}