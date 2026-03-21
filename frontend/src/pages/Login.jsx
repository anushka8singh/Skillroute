import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  // Keep both fields in one state object so the form is easy to extend later.
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If the user is already logged in, skip the login page.
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (event) => {
    // Reuse one change handler by matching the input name to the state key.
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send credentials to the backend login endpoint.
      const response = await API.post("/auth/login", formData);
      // Store the JWT so protected routes and authenticated API calls work after login.
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-shell">
        <div className="auth-hero">
          <span className="eyebrow">SkillRoute</span>
          <h1>Pick up where your learning left off.</h1>
          <p>
            Sign in to manage your roadmap, track completed steps, and keep every
            resource one click away.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Login</h2>
            <p>Welcome back to your personalized learning dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="primary-button auth-submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
