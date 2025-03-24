import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);

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
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
      <Link to="/employer/jobs/add" className="bg-green-500 text-white p-2">
        Add Job
      </Link>
      {jobs.map((job) => (
        <div key={job._id} className="border p-4 mt-2">
          <h3 className="text-xl">{job.title}</h3>
          <p>{job.description}</p>
          <Link to={`/employer/jobs/edit/${job._id}`} className="text-blue-500">
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
};

export default EmployerJobs;
