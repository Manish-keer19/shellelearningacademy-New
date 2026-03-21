const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: ["Full-time", "Part-time", "Internship", "Campus Ambassador"],
    required: true,
  },
  location: {
    type: String,
    enum: ["Remote", "On-site", "Hybrid"],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salaryRange: {
    type: String,
    required: false,
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
