const express = require("express");
const router = express.Router();

// Import Controller
const {
    createLead,
    getAllLeads,
    getLeadStats,
} = require("../controllers/Lead");

// Import Middlewares
const { auth, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Lead Routes
// ********************************************************************************************************

// Create Lead (Public - no auth required)
router.post("/createLead", createLead);

// Get All Leads (Admin Only)
router.get("/getAllLeads", auth, isAdmin, getAllLeads);

// Get Lead Stats (Admin Only)
router.get("/getLeadStats", auth, isAdmin, getLeadStats);

module.exports = router;
