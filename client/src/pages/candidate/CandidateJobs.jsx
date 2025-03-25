import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/jobs");
        setJobs(data);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--color-primary)" }}
      >
        Available Jobs
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

      {/* No Jobs Message */}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">
          No jobs available at the moment.
        </p>
      )}

      {/* Job List */}
      {!loading &&
        !error &&
        jobs.map((job) => (
          <div
            key={job._id}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-md bg-white dark:bg-gray-800"
          >
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--color-secondary)" }}
            >
              {job.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {job.description}
            </p>
            <Link
              to={`/jobs/${job._id}`}
              className="inline-block mt-2 text-white px-4 py-2 rounded transition-all duration-300"
              style={{
                backgroundColor: "var(--color-primary)",
                borderColor: "var(--color-primary)",
              }}
            >
              View Details
            </Link>
          </div>
        ))}
    </div>
  );
};

export default CandidateJobs;
