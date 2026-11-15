import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

function StudentForm() {
  const { id } = useParams(); // id ho to Update, nahi to Add
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });
  const [error, setError] = useState("");

  // Update mode me purana data form me bharo
  useEffect(() => {
    if (id) {
      axios
        .get(`${API_URL}/${id}`)
        .then((res) =>
          setStudent({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email
          })
        )
        .catch((err) => setError(err.response?.data?.message || err.message));
    }
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, student);
      } else {
        await axios.post(API_URL, student);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="col-md-6">
      <h1>{id ? "Update Student" : "Add Student"}</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={student.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={student.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {id ? "Update" : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
