import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerAddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const addJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/jobs",
        { title, description, company, location, salary },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("✅ Job added successfully!");
      setTimeout(() => navigate("/employer/dashboard"), 2000);
    } catch (error) {
      setError("❌ Error adding job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Add New Job
        </h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <form onSubmit={addJob} className="mt-4 space-y-3">
          <input
            className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            type="text"
            placeholder="Job Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            className="border p-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            type="number"
            placeholder="Salary (in ₹)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`p-2 w-full font-semibold text-white rounded transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Adding..." : "Add Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerAddJob;
