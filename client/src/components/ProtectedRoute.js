import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || userRole !== role) {
      console.log("Unauthorized access, redirecting...");
      navigate(`/${role}/login`);
    }
  }, [token, userRole, role, navigate]);

  if (!token || userRole !== role) {
    return null; // Prevent rendering children before navigation
  }

  return children;
};

export default ProtectedRoute;
