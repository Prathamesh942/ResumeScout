const express = require("express");
const Job = require("../models/Job");
const { verifyToken, verifyEmployer } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new job (Employer Only)
router.post("/", verifyToken, verifyEmployer, async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      postedBy: req.user.id,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a job (Employer Only)
router.put("/:id", verifyToken, verifyEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(job, req.body);
    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a job (Employer Only)
router.delete("/:id", verifyToken, verifyEmployer, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
