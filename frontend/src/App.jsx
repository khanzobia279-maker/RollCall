import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import "./components/Dashboard.css";
// Page load par saved token axios me laga do
const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

function App() {
  const navigate = useNavigate();

  const [token, setToken] = useState(savedToken);
  const [user, setUser] = useState(getSavedUser());

  // Pehle saved theme dekho, nahi mila to system ki preference lo
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Theme change hone par html tag par set karo aur save karo
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Sign in ya sign up success hone par
  const handleAuth = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  // Token expire ho jaye (401) to apne aap logout
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401 && localStorage.getItem("token")) {
          handleLogout();
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, []);

  const isLoggedIn = !!token;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <SignIn
              onAuth={handleAuth}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <SignUp
              onAuth={handleAuth}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )
        }
      />

      {/* Baaki saare pages sirf login ke baad */}
      <Route
        path="/*"
        element={
          isLoggedIn ? (
            <>
              <nav className="dash-nav">
                <div className="container dash-nav-inner">
                  <Link to="/" className="dash-brand">
                    <svg width="38" height="38" viewBox="0 0 100 100" aria-hidden="true">
                      <defs>
                        <linearGradient id="navLogoGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#2563eb" />
                          <stop offset="0.5" stopColor="#9333ea" />
                          <stop offset="1" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      <rect width="100" height="100" rx="24" fill="url(#navLogoGrad)" />
                      <rect x="28" y="28" width="38" height="50" rx="6" fill="none" stroke="#fff" strokeWidth="6" />
                      <rect x="38" y="22" width="18" height="12" rx="3" fill="#fff" />
                      <path d="M50 62 L58 70 L76 48" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>RollCall</span>
                  </Link>

                  <div className="dash-nav-right">
                    <span className="dash-user d-none d-md-inline-flex">
                      <span className="dash-user-dot">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                      {user?.name}
                    </span>

                    <button
                      className="dash-icon-btn"
                      onClick={toggleTheme}
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? "🌙" : "☀️"}
                    </button>

                    <button className="dash-logout" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </nav>

              <div className="container pb-5 dash-page">
                <Routes>
                  <Route path="/" element={<StudentList />} />
                  <Route path="/add" element={<StudentForm />} />
                  <Route path="/edit/:id" element={<StudentForm />} />
                </Routes>
              </div>
            </>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;