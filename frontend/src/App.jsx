import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function App() {
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

  return (
    <>
      <nav className="navbar app-navbar mb-4">
        <div className="container">
      <Link to="/" className="navbar-brand brand">
  📋 RollCall
</Link>
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
  );
}

export default App;