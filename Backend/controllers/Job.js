const Job = require("../models/Job");

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const { title, department, jobType, location, city, experience, description, salaryRange, responsibilities, requirements, benefits, email, emailText } =
      req.body;
    const newJob = new Job({
      title,
      department,
      jobType,
      location,
      city,
      experience,
      description,
      salaryRange,
      responsibilities: responsibilities || [],
      requirements: requirements || [],
      benefits: benefits || [],
      email: email || "careers@shellelearningacademy.com",
      emailText: emailText || "Please send your resume and cover letter to apply for this position.",
    });
    const savedJob = await newJob.save();
    res.status(201).json({
      success: true,
      data: savedJob,
      message: "Job created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      data: jobs,
      message: "All jobs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve jobs",
      error: error.message,
    });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      data: job,
      message: "Job retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve job",
      error: error.message,
    });
  }
};

// Update a job by ID
exports.updateJob = async (req, res) => {
  try {
    const { title, department, jobType, location, city, experience, description, salaryRange, responsibilities, requirements, benefits, email, emailText } =
      req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, department, jobType, location, city, experience, description, salaryRange, responsibilities: responsibilities || [], requirements: requirements || [], benefits: benefits || [], email: email || "careers@shellelearningacademy.com", emailText: emailText || "Please send your resume and cover letter to apply for this position." },
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedJob,
      message: "Job updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
