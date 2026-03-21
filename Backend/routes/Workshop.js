const express = require("express");
const router = express.Router();

// Import Workshop Controller
const {
    createWorkshop,
    getAllWorkshops,
    getAllWorkshopsAdmin,
    getWorkshopDetails,
    enrollWorkshop,
    updateWorkshop,
    deleteWorkshop,
} = require("../controllers/Workshop");

// Import Workshop Registration Controller
const {
    registerForWorkshop,
    getAllWorkshopRegistrations,
    getWorkshopRegistrations,
    getMyWorkshopRegistrations,
} = require("../controllers/WorkshopRegistration");

// Import Middlewares
const { auth, isAdmin, isStudent } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Workshop Routes
// ********************************************************************************************************

// Create Workshop (Admin Only)
router.post("/createWorkshop", auth, isAdmin, createWorkshop);

// Get All Workshops (Public or Authenticated)
router.get("/getAllWorkshops", getAllWorkshops);

// Get Single Workshop Details
router.post("/getWorkshopDetails", getWorkshopDetails);

// Enroll in Workshop (Student Only)
router.post("/enrollWorkshop", auth, isStudent, enrollWorkshop);

// Get All Workshops for Admin (Admin Only - includes drafts)
router.get("/getAllWorkshopsAdmin", auth, isAdmin, getAllWorkshopsAdmin);

// Update Workshop (Admin Only)
router.put("/updateWorkshop/:workshopId", auth, isAdmin, updateWorkshop);

// Delete Workshop (Admin Only)
router.delete("/deleteWorkshop/:workshopId", auth, isAdmin, deleteWorkshop);

// ********************************************************************************************************
//                                      Workshop Registration Routes
// ********************************************************************************************************

// Register for Workshop (Public - No login required)
router.post("/registerForWorkshop", registerForWorkshop);

// Get All Workshop Registrations (Admin Only)
router.get("/getAllRegistrations", auth, isAdmin, getAllWorkshopRegistrations);

// Get Registrations for Specific Workshop (Admin Only)
router.get("/getWorkshopRegistrations/:workshopId", auth, isAdmin, getWorkshopRegistrations);

// Get My Workshop Registrations (Student)
router.get("/myRegistrations", auth, getMyWorkshopRegistrations);

module.exports = router;
