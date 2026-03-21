import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Signup() {
  // Controlled form state makes validation and debugging easier as the form grows.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Signed-in users do not need to see the signup screen again.
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (event) => {
    // Update whichever field triggered the event without duplicating handlers.
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
      // Create the account first, then redirect to login where the JWT is issued.
      await API.post("/auth/signup", formData);
      navigate("/login");
    } catch (requestError) {
      setError(requestError.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-screen">
      <div className="auth-shell">
        <div className="auth-hero">
          <span className="eyebrow">SkillRoute</span>
          <h1>Turn ambitious goals into clear next steps.</h1>
          <p>
            Create your account to generate focused learning paths, save progress,
            and build momentum every day.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Signup</h2>
            <p>Start your journey with a clean, guided dashboard.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
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
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Signup;
