import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CandidateJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await axios.get("http://localhost:5000/api/jobs");
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.map((job) => (
        <div key={job._id} className="border p-4 mb-2">
          <h3 className="text-xl">{job.title}</h3>
          <p>{job.description}</p>
          <Link to={`/jobs/${job._id}`} className="text-blue-500">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CandidateJobs;
