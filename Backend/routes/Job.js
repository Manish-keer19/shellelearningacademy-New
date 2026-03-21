const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/Job");

// Middleware
const { auth, isAdmin } = require("../middlewares/auth");

// Routes
router.post("/create", auth, isAdmin, createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", auth, isAdmin, updateJob);
router.delete("/:id", auth, isAdmin, deleteJob);

module.exports = router;
