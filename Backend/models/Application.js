const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  coverMessage: {
    type: String,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
