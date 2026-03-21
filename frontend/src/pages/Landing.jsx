import { Link, useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  // Landing is the public entry page that introduces the app before authentication.
  return (
    <section className="landing-screen">
      <div className="landing-shell">
        <div className="landing-copy">
          <span className="eyebrow">Smart learning paths for focused growth</span>
          <h1>SkillRoute</h1>
          <p>Build your learning journey, step by step.</p>
          <div className="landing-actions">
            <button className="primary-button landing-button" type="button" onClick={() => navigate("/signup")}>
              Get Started
            </button>
            {/* Link keeps navigation inside the React app without a full page reload. */}
            <Link className="landing-link" to="/login">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Landing;
