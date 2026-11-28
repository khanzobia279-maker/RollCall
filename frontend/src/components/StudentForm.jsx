import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://roll-call-sooty.vercel.app/api/students";

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
    setError("");
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
    <div className="dash-form-card">
      {/* Left panel */}
      <div className="dash-form-left">
        <span className="dash-blob b1"></span>
        <span className="dash-blob b2"></span>
        <span className="dash-blob b3"></span>
        <span className="dash-blob b4"></span>

        <button
          type="button"
          className="dash-back dash-z"
          onClick={() => navigate("/")}
        >
          ‹ Back to list
        </button>

        <div className="dash-z">
          <h1>{id ? "Update Student" : "Add Student"}</h1>
          <p>
            {id
              ? "Edit the student details"
              : "Fill in the details to add a new student"}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="dash-form-right">
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="dash-form-row">
            <div className="dash-field-wrap">
              <label className="dash-label">First Name</label>
              <div className="dash-field">
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={student.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="dash-field-wrap">
              <label className="dash-label">Last Name</label>
              <div className="dash-field">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Smith"
                  value={student.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="dash-field-wrap">
            <label className="dash-label">Email</label>
            <div className="dash-field">
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={student.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="dash-form-buttons">
            <button type="submit" className="dash-btn" disabled={saving}>
              {saving ? "Saving..." : id ? "Update Student" : "Save Student"}
            </button>
            <button
              type="button"
              className="dash-btn dash-btn-ghost"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;