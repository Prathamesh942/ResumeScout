import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function CandidateRegister() {
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
        role: "candidate",
      });
      navigate("/candidate/login");
    } catch (error) {
      alert("Error registering");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-background)]">
      <form
        onSubmit={handleRegister}
        className="bg-[var(--color-card)] border border-[var(--color-primary)] text-[var(--color-text-primary)] p-6 rounded-lg shadow-lg backdrop-blur-md w-80"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Candidate Register
        </h2>

        {/* Name Input */}
        <input
          className="border border-[var(--color-primary)] bg-transparent p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email Input */}
        <input
          className="border border-[var(--color-primary)] bg-transparent p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Input */}
        <input
          className="border border-[var(--color-primary)] bg-transparent p-2 mb-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Register Button */}
        <button
          className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-background)] p-2 w-full rounded cursor-pointer transition-all duration-300"
          type="submit"
        >
          Register
        </button>

        {/* Login Link */}
        <Link to={"/candidate/login"}>
          <button className="mt-3 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] p-2 w-full transition-all duration-300">
            Already have an account? Login
          </button>
        </Link>
      </form>
    </div>
  );
}

export default CandidateRegister;
