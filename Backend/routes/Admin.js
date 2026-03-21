const express = require("express");
const router = express.Router();

// Import controllers
const {
    createUserAndEnroll,
    enrollUserInCourse,
    getAllUsers,
    getAllCoursesForEnrollment,
} = require("../controllers/Admin");

// Import middleware
const { auth, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Admin Routes
// ********************************************************************************************************

// Route to create a new user and optionally enroll them in a course
router.post("/create-user-and-enroll", auth, isAdmin, createUserAndEnroll);

// Route to enroll an existing user in a course
router.post("/enroll-user", auth, isAdmin, enrollUserInCourse);

// Route to get all users
router.get("/users", auth, isAdmin, getAllUsers);

// Route to get all courses for enrollment
router.get("/courses", auth, isAdmin, getAllCoursesForEnrollment);

module.exports = router;
