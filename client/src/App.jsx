import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CandidateLogin from "./pages/candidate/CandidateLogin";
import CandidateRegister from "./pages/candidate/CandidateRegister";
import EmployerLogin from "./pages/employer/EmployerLogin";
import EmployerRegister from "./pages/employer/EmployerRegister";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerJobs from "./pages/employer/EmployerJobs";
import EmployerAddJob from "./pages/employer/EmployerAddJob";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Candidate Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/candidate/register" element={<CandidateRegister />} />

        {/* Employer Auth */}
        <Route path="/employer/login" element={<EmployerLogin />} />
        <Route path="/employer/register" element={<EmployerRegister />} />

        {/* Candidate Pages */}
        <Route path="/jobs" element={<CandidateJobs />} />
        <Route path="/jobs/:id" element={<CandidateJobDetails />} />

        {/* Employer Pages (Protected) */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute role="employer">
              <EmployerJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/jobs/add"
          element={
            <ProtectedRoute role="employer">
              <EmployerAddJob />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
