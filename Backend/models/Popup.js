const mongoose = require("mongoose");

const popupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Popup", popupSchema);