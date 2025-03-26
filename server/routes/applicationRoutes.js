const express = require("express");
const axios = require("axios");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const Application = require("../models/Application");
const Job = require("../models/Job");
const {
  verifyToken,
  verifyCandidate,
  verifyEmployer,
} = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const router = express.Router();

// Configure Multer for resume uploads
const storage = multer.diskStorage({
  destination: "./uploads/resumes/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".pdf", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Only PDF or DOCX files are allowed"));
    }
    cb(null, true);
  },
});

function extractQuestions(text) {
  return text
    .split("\n") // Split by new lines
    .filter((line) => /^\d+\./.test(line)) // Keep only lines that start with a number
    .map((line) => line.replace(/^\d+\.\s*/, "").trim()); // Remove the number and trim spaces
}

// Apply for a job (Candidate Only) with Resume Upload
router.post(
  "/:jobId/apply",
  verifyToken,
  verifyCandidate,
  upload.single("resume"),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      const existingApplication = await Application.findOne({
        job: job._id,
        candidate: req.user.id,
      });
      if (existingApplication) {
        return res
          .status(400)
          .json({ message: "You have already applied for this job" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Resume is required" });
      }

      const resumePath = req.file.path;
      let resumeText = "";

      // Extract text from resume
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === ".pdf") {
        const dataBuffer = fs.readFileSync(resumePath);
        const pdfData = await pdfParse(dataBuffer);
        resumeText = pdfData.text;
      } else if (ext === ".docx") {
        const dataBuffer = fs.readFileSync(resumePath);
        const docxData = await mammoth.extractRawText({ buffer: dataBuffer });
        resumeText = docxData.value;
      } else {
        return res
          .status(400)
          .json({ message: "Only PDF and DOCX files are supported" });
      }
      // console.log(job);

      // Send resumeText and jobDescription to external server
      const jobDescription = job.description;
      // console.log(jobDescription, resumeText);

      const externalResponse = await axios.post("http://127.0.0.1:5001/", {
        jobDescription,
        resume: resumeText,
      });

      // Check response from external server
      if (externalResponse.status !== 200) {
        return res.status(400).json({ message: "Failed to process resume" });
      }

      //questionarrie
      try {
        const resai = await groq.chat.completions.create({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that generates interview questions based on job descriptions and resumes.",
            },
            {
              role: "user",
              content: `Generate 5 one line answer technical interview questions for a backend developer. 
              Job Description: ${jobDescription} 
              Candidate's Resume: ${resumeText}RETURN ARRAY OF 5 QUESTIONS ONLY DO NOT RESPOND WITH ANYTHING ELSE BESIDES QUESTIONS`,
            },
          ],
        });
        const jsonString = resai.choices[0].message.content;
        const questionnarieList = extractQuestions(jsonString);
        return res.status(200).json({
          message: "interview",
          interview: questionnarieList,
          resumeScore: externalResponse.data.similarityScore,
        });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Error generating questionnarie", error });
      }

      // Save application
      const application = new Application({
        job: job._id,
        candidate: req.user.id,
        status: "applied",
        resumeText,
        score: externalResponse.data.similarityScore,
      });

      await application.save();
      res
        .status(201)
        .json({ message: "Application submitted successfully", application });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

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
      "name email"
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

router.post(
  "/:id/submitinterview",
  verifyToken,
  verifyCandidate,
  async (req, res) => {
    try {
      const { questions, answers, resumeScore, jobId } = req.body;
      console.log("Received Data:", req.body);

      // Validate required fields
      if (!questions || !answers || !resumeScore || !jobId) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // AI Evaluation
      const aiResponse = await groq.chat.completions.create({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that evaluates interview answers. Return a score between 0 and 1.",
          },
          {
            role: "user",
            content: `Evaluate the following answers for the given questions. Only return a single numerical score between 0 and 1.
        
        Questions: ${JSON.stringify(questions)}
        Answers: ${JSON.stringify(answers)}
        
        Score:`,
          },
        ],
      });

      const aiScore = parseFloat(aiResponse.choices[0].message.content.trim());

      // Ensure the AI returns a valid number
      if (isNaN(aiScore) || aiScore < 0 || aiScore > 1) {
        return res.status(500).json({ error: "Invalid AI response score." });
      }

      // Compute final score
      const finalScore = resumeScore * 0.7 + aiScore * 0.3;
      console.log("Final Score:", finalScore);

      // Create Application Entry
      const application = new Application({
        job: jobId,
        candidate: req.user.id,
        status: "applied",
        score: finalScore,
      });

      await application.save();

      res.status(201).json({
        message: "Application submitted successfully",
        application,
        aiScore,
      });
    } catch (error) {
      console.error("Error submitting interview:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

module.exports = router;
