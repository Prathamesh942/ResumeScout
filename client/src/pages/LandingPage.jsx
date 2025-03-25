import { Link } from "react-router-dom";
import { Briefcase, User } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] text-[var(--color-text-primary)] px-6 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[var(--color-background)] to-[#0d0d0d] opacity-80"></div>

      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] z-10">
        ResumeScout
      </h1>
      <p className="text-lg text-[var(--color-text-secondary)] text-center max-w-lg mb-10 z-10">
        The AI-powered job portal for smarter hiring & career growth.
      </p>

      {/* Card Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 z-10">
        {/* Employer Card */}
        <Link to="/employer/login" className="group">
          <div className="relative bg-[var(--color-card)] border border-[var(--color-primary)] rounded-xl p-6 shadow-lg backdrop-blur-lg transition-all transform hover:scale-105 hover:shadow-[var(--color-primary)]/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[var(--color-primary)]/20">
                <Briefcase className="text-[var(--color-primary)]" size={36} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-[var(--color-primary)]">
                  Employer Portal
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Post jobs, track applicants & find the best talent.
                </p>
              </div>
            </div>
          </div>
        </Link>

        {/* Candidate Card */}
        <Link to="/candidate/login" className="group">
          <div className="relative bg-[var(--color-card)] border border-[var(--color-secondary)] rounded-xl p-6 shadow-lg backdrop-blur-lg transition-all transform hover:scale-105 hover:shadow-[var(--color-secondary)]/50">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[var(--color-secondary)]/20">
                <User className="text-[var(--color-secondary)]" size={36} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white group-hover:text-[var(--color-secondary)]">
                  Candidate Portal
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Browse jobs, apply easily, and land your dream job.
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
