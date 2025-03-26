import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function EmployerApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/applications/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sortedApplications = response.data.sort(
          (a, b) => b.score - a.score
        );
        setApplications(sortedApplications);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  console.log(applications);

  return (
    <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <div className="max-w-2xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--color-primary)" }}
        >
          Job Applications
        </h2>
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <ul>
            {applications.map((app) => (
              <li
                key={app._id}
                className="p-4 border-b border-gray-300 dark:border-gray-600 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {app.candidate.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {app.candidate.email}
                  </p>
                </div>
                <div>{Math.ceil(app.score * 100)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
