import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

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
              <nav className="navbar app-navbar mb-4">
                <div className="container">
                  <Link to="/" className="navbar-brand brand">
                    📋 RollCall
                  </Link>

                  <div className="d-flex align-items-center gap-2">
                    <span className="theme-toggle d-none d-md-inline">
                      👤 {user?.name}
                    </span>

                    <button
                      className="theme-toggle"
                      onClick={toggleTheme}
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? "🌙" : "☀️"}
                      <span className="d-none d-sm-inline ms-1">
                        {theme === "light" ? "Dark" : "Light"}
                      </span>
                    </button>

                    <button className="theme-toggle" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </nav>

              <div className="container pb-5">
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