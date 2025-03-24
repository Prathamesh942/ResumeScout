import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EmployerEditJob = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setTitle(data.title);
      setDescription(data.description);
    };
    fetchJob();
  }, [id]);

  const updateJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/${id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/employer/jobs");
    } catch (error) {
      alert("Error updating job");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Edit Job</h2>
      <form onSubmit={updateJob}>
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 mb-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 w-full">
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EmployerEditJob;
