const express = require("express");
const router = express.Router();

const {
  submitJobApplication,
  getJobApplications,
  getAllApplications,
} = require("../controllers/jobApplicationController");

// Submit job application
router.post("/submit", submitJobApplication);

// Get applications for a specific job (Admin only)
router.get("/job/:jobId", getJobApplications);

// Get all applications (Admin only)
router.get("/all", getAllApplications);

module.exports = router;