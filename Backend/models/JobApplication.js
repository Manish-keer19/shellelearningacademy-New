const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  currentLocation: {
    type: String,
    required: true,
    trim: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "shortlisted", "rejected"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);