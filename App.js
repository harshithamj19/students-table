import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

function App() {

  const initialData = [
    { id: 1, name: "Rahul", email: "rahul@gmail.com", age: 20 },
    { id: 2, name: "Priya", email: "priya@gmail.com", age: 21 },
    { id: 3, name: "Aman", email: "aman@gmail.com", age: 22 }
  ];

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    age: ""
  });

  useEffect(() => {
    setTimeout(() => {
      setStudents(initialData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.age) {
      alert("All fields are required");
      return;
    }

    if (!validateEmail(form.email)) {
      alert("Invalid email format");
      return;
    }

    if (editing) {
      setStudents(
        students.map((s) =>
          s.id === editing ? { ...form, id: editing } : s
        )
      );
      setEditing(null);
    } else {
      setStudents([...students, { ...form, id: Date.now() }]);
    }

    setForm({ name: "", email: "", age: "" });
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditing(student.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelData = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelData], {
      type: "application/octet-stream"
    });

    saveAs(blob, "students.xlsx");
  };

  if (loading) {
    return <h2>Loading Students...</h2>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Students Table</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <button type="submit">
          {editing ? "Update Student" : "Add Student"}
        </button>
      </form>

      <button onClick={downloadExcel}>
        Download Excel
      </button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>

              <td>
                <button onClick={() => handleEdit(s)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}