import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

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
      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="page-title">Student List</h2>
          <p className="page-subtitle">Manage all your students in one place</p>
        </div>
        <span className="count-badge">{students.length} Students</span>
      </div>

      {/* Toolbar */}
      <div className="card-box p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <form className="d-flex gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control"
            style={{ minWidth: "260px" }}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-gradient">
            Search
          </button>
          {keyword && (
            <button
              type="button"
              className="btn btn-soft-primary"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </form>

        <button className="btn btn-gradient" onClick={() => navigate("/add")}>
          + Add Student
        </button>
      </div>

      {/* Error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table */}
      <div className="card-box overflow-hidden">
        <div className="table-responsive">
          <table className="table table-modern">
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
                    <div className="empty-state">Loading students...</div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
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
                      <span className="avatar">{getInitials(student)}</span>
                    </td>
                    <td className="fw-medium">{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td className="text-muted">{student.email}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-soft-primary btn-sm me-2"
                        onClick={() => navigate(`/edit/${student._id}`)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-soft-danger btn-sm"
                        onClick={() => deleteStudent(student._id)}
                      >
                        Delete
                      </button>
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