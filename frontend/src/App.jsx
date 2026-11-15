import { Routes, Route } from "react-router-dom";
import StudentList from "./components/StudentList";
import StudentForm from "./components/StudentForm";

function App() {
  return (
    <div className="container mt-3">
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/add" element={<StudentForm />} />
        <Route path="/edit/:id" element={<StudentForm />} />
      </Routes>
    </div>
  );
}

export default App;