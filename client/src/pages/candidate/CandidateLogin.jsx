import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../App.css";

function CandidateLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password, role: "candidate" }
      );
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "candidate");
      navigate("/jobs"); // Redirect to candidate job listings
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">Candidate Login</h2>
        <input
          className="border p-2 mb-2 w-full"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 w-full cursor-pointer"
          type="submit"
        >
          Login
        </button>
        <Link to={"/candidate/register"}>
          <button className=" p-2 w-full cursor-pointer">
            Don't have an account? Register
          </button>
        </Link>
      </form>
    </div>
  );
}

export default CandidateLogin;
