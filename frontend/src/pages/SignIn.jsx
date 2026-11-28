import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const AUTH_URL = "https://roll-call-sooty.vercel.app/api/auth";

function SignIn({ onAuth, theme, toggleTheme }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${AUTH_URL}/login`, form);
      onAuth(res.data); // token + user App.jsx ko de do
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <button
        className="auth-theme"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="auth-card">
        {/* Left panel */}
        <div className="auth-left">
          <span className="blob blob-1"></span>
          <span className="blob blob-2"></span>
          <span className="blob blob-3"></span>
          <span className="blob blob-4"></span>

          <div className="auth-brand">
            <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2563eb" />
                  <stop offset="0.5" stopColor="#9333ea" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="24" fill="url(#logoGrad)" />
              <rect x="28" y="28" width="38" height="50" rx="6" fill="none" stroke="#fff" strokeWidth="6" />
              <rect x="38" y="22" width="18" height="12" rx="3" fill="#fff" />
              <path d="M50 62 L58 70 L76 48" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>RollCall</span>
          </div>

          <div className="auth-welcome">
            <h1>Welcome Back</h1>
            <p>Sign in to continue access</p>
          </div>

          <div className="auth-foot">Student management made simple</div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <h2 className="auth-title">Sign In</h2>

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field has-toggle">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              <span>{loading ? "Please wait..." : "Sign In"}</span>
              <span className="arrow">›</span>
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;