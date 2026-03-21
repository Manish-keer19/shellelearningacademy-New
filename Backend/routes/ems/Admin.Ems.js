const express = require("express");
const router = express.Router();

// Import controllers
const {
    createUser,
    getAllStaff,
    getUserById,
    updateUser,
    deleteUser,
    resetUserPassword,
    getDashboardStats,
    createLead,
    getAllLeads,
    updateLead,
    assignTarget,
    requestEnrollment,
    verifyEnrollment,
} = require("../../controllers/EMS/Admin.Ems.controller");

// Import middlewares
const { auth } = require("../../middlewares/auth");

// ********************************************************************************************************
//                                      Admin EMS Routes
// ********************************************************************************************************

// User Management (Super Admin & Managers)
router.post("/create-user", auth, createUser);
router.get("/staff", auth, getAllStaff);
router.get("/user/:userId", auth, getUserById);
router.put("/user/:userId", auth, updateUser);
router.delete("/user/:userId", auth, deleteUser); // Controller restricts to SA
router.post("/reset-password/:userId", auth, resetUserPassword);
router.get("/dashboard-stats", auth, getDashboardStats);
router.post("/assign-target", auth, assignTarget);

// Lead Management
router.post("/leads/create", auth, createLead);
router.get("/leads", auth, getAllLeads);
router.put("/leads/:leadId", auth, updateLead);
router.post("/leads/enroll", auth, requestEnrollment);
router.post("/leads/verify-enrollment", auth, verifyEnrollment);


module.exports = router;
