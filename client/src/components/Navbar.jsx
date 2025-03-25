import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check who is logged in
    const candidateToken = localStorage.getItem("candidateToken");
    const employerToken = localStorage.getItem("employerToken");

    if (candidateToken) {
      setUser({ role: "candidate" });
    } else if (employerToken) {
      setUser({ role: "employer" });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("candidateToken");
    localStorage.removeItem("employerToken");
    setUser(null);
    navigate("/"); // Redirect to home
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <Link to="/" className="text-xl font-bold">
        Job Portal
      </Link>

      <div className="space-x-4">
        {user?.role === "candidate" ? (
          <>
            <Link to="/jobs" className="hover:underline">
              Find Jobs
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : user?.role === "employer" ? (
          <>
            <Link to="/employer/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/employer/jobs" className="hover:underline">
              Manage Jobs
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/candidate/login" className="hover:underline">
              Candidate Login
            </Link>
            <Link to="/employer/login" className="hover:underline">
              Employer Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
