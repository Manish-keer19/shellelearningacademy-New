const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middlewares/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  updatePassword,
} = require("../controllers/Profile")
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// Update Password
router.put("/updatePassword", auth, updatePassword)
//get admin dashboard details
router.get("/getAdminDashboardDetails", auth, isAdmin, instructorDashboard)

module.exports = router;