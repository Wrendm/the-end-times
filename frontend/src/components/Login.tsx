import { useState } from "react";
import api from '../api/axios';

export default function Form() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setSubmitted(false);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Sending login payload:", { username, password });
        try {
            const { data } = await api.post('/auth/login', {
                username,
                password
            })

            setSuccess(true)
            setSubmitted(true)
            setError('')

            setUsername('')
            setPassword('')

            console.log(data.message)
            console.log("JWT Token:", data.token)
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

    // Showing success message
    const successMessage = () => {
        if (!submitted) return null;
        return (
            <div className="success">
                <h1>Login successful!</h1>
            </div>
        )
    }

    const errorMessage = () => {
        if (!error) return null;
        return (
            <div className="error">
                <h1>{error}</h1>
            </div>
        )
    }

    return (
        <div className="Form">
            <div>
                <h1>User Login</h1>
            </div>
            <div className="Messages">
                {errorMessage()}
                {success ? (submitted && successMessage()) : ''}
            </div>

            <form onSubmit={handleSubmit}>
                <label className="label">Username</label>
                <input onChange={handleUsername} className="input" value={username} type="text"/>

                <label className="label">Password</label>
                <input onChange={handlePassword} className="input" value={password} type="password"/>

                <button className="btn" type="submit">Login</button>
            </form>
        </div>
    );
}