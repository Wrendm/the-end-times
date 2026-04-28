import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import { AuthContext } from "../../context/authcontext";
import { setAccessToken } from "../../api/axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
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
    const res = await loginUser(form);

    const { user, token } = res.data;

    // ONLY give token to Axios (single source of truth)
    setAccessToken(token);

    // Context only stores user
    auth.login(user);

    setSuccess(true);
    setError("");
    setForm({ username: "", password: "" });

    navigate("/dashboard");
  } catch (err: any) {
    if (err.response) {
      const res = err.response.data;

      setError(res.message || "Login failed");

      setErrors(Array.isArray(res.errors) ? res.errors : []);
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
      <h1>Login</h1>
      {success && <div className="success">Login successful!</div>}
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
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} />
        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        <button className="fullWidth-btn" type="submit">Login</button>
      </form>
      <p>No Account?</p>
      <button className="btn-secondary"><Link to='/register'>Register</Link></button>
    </div>
  );
}