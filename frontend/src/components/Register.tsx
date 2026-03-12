import { useState } from "react";
import api from '../api/axios';

export default function Form() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setSubmitted(false);
    };

    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        setSubmitted(false);
    };

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setSubmitted(false);
    };

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setSubmitted(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', {
                name,
                username,
                email,
                password
            })

            setSuccess(true)
            setSubmitted(true)
            setError('')
            setName('')
            setUsername('')
            setEmail('')
            setPassword('')

            console.log(data.message)
        } catch (err: any) {
            if (err.response) {
                // Backend responded with an error code
                setError(err.response.data.message || 'Registration failed')
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
                <h1>User {name} successfully registered!</h1>
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
                <h1>User Registration</h1>
            </div>
            <div className="Messages">
                {errorMessage()}
                {success ? (submitted && successMessage()) : ''}
            </div>

            <form onSubmit={handleSubmit}>
                <label className="label">Name</label>
                <input onChange={handleName} className="input" value={name} type="text"/>

                <label className="label">Username</label>
                <input onChange={handleUsername} className="input" value={username} type="text"/>

                <label className="label">Email</label>
                <input onChange={handleEmail} className="input" value={email} type="email"/>

                <label className="label">Password</label>
                <input onChange={handlePassword} className="input" value={password} type="password"/>

                <button className="btn" type="submit">Submit</button>
            </form>
        </div>
    );
}