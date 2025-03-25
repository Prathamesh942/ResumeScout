import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      console.log(token);

      const { data } = await axios.post(
        "http://localhost:5000/api/jobs/employer",
        {}, // Empty body (if no data needs to be sent)
        { headers: { Authorization: `Bearer ${token}` } } // Headers go here
      );
      console.log(data);

      setJobs(data.jobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Employer Dashboard
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          Welcome! Here you can manage your job listings and track applications.
        </p>

        {/* Create Job Button */}
        <div className="mt-6">
          <Link
            to="/employer/jobs/add"
            className="inline-block px-4 py-2 rounded text-white font-semibold transition-all duration-300"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Post a New Job
          </Link>
        </div>

        {/* Jobs List */}
        <h3 className="text-2xl font-semibold mt-8">Your Job Listings</h3>
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No jobs posted yet.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border p-4 rounded-lg dark:bg-gray-800"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {job.description}
                </p>

                {/* Job Actions */}
                <div className="mt-2 flex gap-4">
                  <Link
                    to={`/employer/jobs/${job._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Applications
                  </Link>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
