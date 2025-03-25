import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CandidateJobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/jobs/${id}`
        );
        setJob(data);
      } catch (err) {
        setError("Failed to fetch job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const applyForJob = async () => {
    if (!resume) {
      alert("Please upload your resume before applying.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resume);

      await axios.post(
        `http://localhost:5000/api/applications/${id}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Application submitted successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to apply. Please try again.");
    }
  };

  if (loading)
    return <p className="text-gray-500 dark:text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          {job.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Company:</strong> {job.company}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          <strong>Salary:</strong> ₹{job.salary.toLocaleString()}
        </p>
        <p className="text-gray-700 dark:text-gray-300">{job.description}</p>

        {/* File Upload Input */}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mt-4"
        />

        <button
          onClick={applyForJob}
          className="mt-4 px-4 py-2 rounded text-white font-semibold transition-all duration-300"
          style={{
            backgroundColor: "var(--color-primary)",
            borderColor: "var(--color-primary)",
          }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default CandidateJobDetails;
