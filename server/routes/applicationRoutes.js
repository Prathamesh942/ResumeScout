const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const {
  verifyToken,
  verifyCandidate,
  verifyEmployer,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job (Candidate Only)
router.post("/:jobId/apply", verifyToken, verifyCandidate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const existingApplication = await Application.findOne({
      job: job._id,
      candidate: req.user.id,
    });
    if (existingApplication)
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });

    const application = new Application({
      job: job._id,
      candidate: req.user.id,
      status: "applied",
    });

    await application.save();
    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all applications for a specific job (Employer Only)
router.get("/:jobId", verifyToken, verifyEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const applications = await Application.find({ job: job._id }).populate(
      "candidate",
      "name email resume"
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all jobs applied by the candidate
router.get(
  "/my/applications",
  verifyToken,
  verifyCandidate,
  async (req, res) => {
    try {
      const applications = await Application.find({
        candidate: req.user.id,
      }).populate("job");
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Employer can update application status
router.put(
  "/:applicationId/status",
  verifyToken,
  verifyEmployer,
  async (req, res) => {
    try {
      const application = await Application.findById(
        req.params.applicationId
      ).populate("job");
      if (!application)
        return res.status(404).json({ message: "Application not found" });

      if (application.job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      application.status = req.body.status;
      await application.save();

      res.json({ message: "Application status updated", application });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
