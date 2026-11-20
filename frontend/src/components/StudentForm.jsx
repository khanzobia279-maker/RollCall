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
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
      if (id) {
        await axios.put(`${API_URL}/${id}`, student);
      } else {
        await axios.post(API_URL, student);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSaving(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6 col-md-8">
        <div className="mb-4">
          <h2 className="page-title">
            {id ? "Update Student" : "Add Student"}
          </h2>
          <p className="page-subtitle">
            {id
              ? "Edit the student details below"
              : "Fill in the details to add a new student"}
          </p>
        </div>

        <div className="card-box p-4">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="John "
                  value={student.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Smith"
                  value={student.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="name@example.com"
                value={student.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-gradient"
                disabled={saving}
              >
                {saving ? "Saving..." : id ? "Update Student" : "Save Student"}
              </button>
              <button
                type="button"
                className="btn btn-soft-primary"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;