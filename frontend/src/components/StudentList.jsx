import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");   // input box ki value
  const [keyword, setKeyword] = useState(""); // Search button dabane par set hoti he
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data.students);
    } catch (error) {
      console.log(error.message);
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
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(search);
  };

  // Frontend me filter (backend change nahi kiya)
  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.email}`
      .toLowerCase()
      .includes(keyword.trim().toLowerCase())
  );

  return (
    <div>
      <h1>Student List</h1>

      <div className="d-flex justify-content-between mb-3">
        <form className="d-flex" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <button className="btn btn-primary" onClick={() => navigate("/add")}>
          Add Student
        </button>
      </div>

      <table className="table">
        <thead className="table-dark">
          <tr>
            <th>Student First Name</th>
            <th>Student Last Name</th>
            <th>Student Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No students found
              </td>
            </tr>
          ) : (
            filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/edit/${student._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
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
  );
}

export default StudentList;