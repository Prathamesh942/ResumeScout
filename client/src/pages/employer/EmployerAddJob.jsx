import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerAddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const navigate = useNavigate();

  const addJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/jobs",
        { title, description, company, location, salary },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/employer/jobs");
    } catch (error) {
      alert("Error adding job");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Add New Job</h2>
      <form onSubmit={addJob} className="mt-4">
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 mb-2 w-full"
          placeholder="Job Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Job Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          className="border p-2 mb-2 w-full"
          type="number"
          placeholder="Salary (in ₹)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
        <button className="bg-green-500 text-white p-2 w-full">Add Job</button>
      </form>
    </div>
  );
};

export default EmployerAddJob;
