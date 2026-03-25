import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../context/authcontext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const auth = useContext(AuthContext);
  if (!auth) return <div>Loading auth...</div>;

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      auth.login(data.data, data.token);
      setSuccess(true);
      setError("");
      setForm({ username: "", password: "" });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="Form">
      <h1>Login</h1>
      {success && <div className="success">Login successful!</div>}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <button className="btn" type="submit">Login</button>
      </form>
      <p>No Account?</p>
      <button className="btn-secondary"><Link to='/register'>Register</Link></button>
    </div>
  );
}