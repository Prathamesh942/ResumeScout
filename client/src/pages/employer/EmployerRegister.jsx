import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function EmployerRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "employer",
      });
      navigate("/employer/login");
    } catch (error) {
      alert("Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-xl mb-4">Employer Register</h2>
        <input
          className="border p-2 mb-2 w-full"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className="bg-green-500 text-white p-2 w-full" type="submit">
          Register
        </button>
        <Link to={"/employer/login"}>
          <button className=" p-2 w-full cursor-pointer">
            Already have an account? Login
          </button>
        </Link>
      </form>
    </div>
  );
}

export default EmployerRegister;
