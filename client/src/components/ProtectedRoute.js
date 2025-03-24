import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  if (!token || userRole !== role) {
    navigate(`/${role}/login`);
  }

  return children;
};

export default ProtectedRoute;
