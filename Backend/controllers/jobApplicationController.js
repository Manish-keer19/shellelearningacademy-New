const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const uploadImageToCloudinary = require("../utils/imageUploader");

// Submit job application
exports.submitJobApplication = async (req, res) => {
  try {
    const { jobId, fullName, email, mobileNumber, experienceYears, currentLocation, coverLetter } = req.body;

    // Validate required fields
    if (!jobId || !fullName || !email || !mobileNumber || !experienceYears || !currentLocation) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if resume file is uploaded
    if (!req.files || !req.files.resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // Upload resume to cloudinary
    const resumeFile = req.files.resumeFile;
    const resumeUpload = await uploadImageToCloudinary(
      resumeFile,
      process.env.FOLDER_NAME || "resumes"
    );

    // Create job application
    const jobApplication = await JobApplication.create({
      jobId,
      fullName,
      email,
      mobileNumber,
      experienceYears: parseInt(experienceYears),
      currentLocation,
      resumeUrl: resumeUpload.secure_url,
      coverLetter: coverLetter || "",
    });

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: jobApplication,
    });
  } catch (error) {
    console.error("Error submitting job application:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all applications for a job (Admin only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await JobApplication.find({ jobId })
      .populate("jobId", "title department")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all applications (Admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobId", "title department")
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};