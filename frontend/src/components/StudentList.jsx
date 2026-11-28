import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://roll-call-sooty.vercel.app/api/students";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");   // input box ki value
  const [keyword, setKeyword] = useState(""); // Search button dabane par set hoti he
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data.students);
      setError("");
    } catch (err) {
      setError("Could not load students. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(search);
  };

  const clearSearch = () => {
    setSearch("");
    setKeyword("");
  };

  // Frontend me filter (backend change nahi kiya)
  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`
      .toLowerCase()
      .includes(keyword.trim().toLowerCase())
  );

  const getInitials = (s) =>
    `${s.firstName?.[0] || ""}${s.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div>
      {/* Hero banner */}
      <div className="dash-hero">
        <span className="dash-blob b1"></span>
        <span className="dash-blob b2"></span>
        <span className="dash-blob b3"></span>
        <span className="dash-blob b4"></span>

        <div className="dash-z">
          <h1>Student List</h1>
          <p>Manage all your students in one place</p>
        </div>

        <div className="dash-hero-actions dash-z">
          <span className="dash-count">{students.length} Students</span>
          <button
            className="dash-btn dash-btn-light"
            onClick={() => navigate("/add")}
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Toolbar + Table */}
      <div className="dash-card">
        <div className="dash-toolbar">
          <form className="dash-search" onSubmit={handleSearch}>
            <div className="dash-field">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="dash-btn">
              Search
            </button>
            {keyword && (
              <button
                type="button"
                className="dash-btn dash-btn-ghost"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        <div className="table-responsive">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5">
                    <div className="dash-empty">Loading students...</div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="dash-empty">
                      <div className="emoji">🔍</div>
                      <div className="fw-semibold mt-2">No students found</div>
                      <div>Try a different search or add a new student.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <span className="dash-avatar">{getInitials(student)}</span>
                    </td>
                    <td className="fw-medium" data-label="First Name">
                      {student.firstName}
                    </td>
                    <td data-label="Last Name">{student.lastName}</td>
                    <td className="dash-muted" data-label="Email">
                      {student.email}
                    </td>
                    <td>
                      <div className="dash-actions">
                        <button
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => navigate(`/edit/${student._id}`)}
                        >
                          Update
                        </button>
                        <button
                          className="dash-btn dash-btn-danger dash-btn-sm"
                          onClick={() => deleteStudent(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentList;