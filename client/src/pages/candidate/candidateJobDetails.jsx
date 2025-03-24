import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CandidateJobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(data);
    };
    fetchJob();
  }, [id]);

  const applyForJob = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/applications/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted!");
    } catch (error) {
      console.log(error);
      alert("Failed to apply");
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{job.title}</h2>
      <p>{job.description}</p>
      <button onClick={applyForJob} className="bg-blue-500 text-white p-2 mt-4">
        Apply Now
      </button>
    </div>
  );
};

export default CandidateJobDetails;
