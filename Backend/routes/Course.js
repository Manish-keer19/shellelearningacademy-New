// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  getFullCourseDetails,
  deleteCourse,
  searchCourse,
  markLectureAsComplete,
  getCourseNamesAndIds,
  getCoursesBasicInfo,
  updateAllCoursesStudentCount,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
  addCourseToCategory,
  getAllCatagoryAndItsCourseCount,
  updateCategory,
  deleteCategory,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviews")

// Importing Middlewares
const { auth, isAdmin, isStudent } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Admins
router.post("/createCourse", auth, isAdmin, createCourse)
//Add a Section to a Course
router.post("/addSection", auth, isAdmin, createSection)
// Update a Section
router.post("/updateSection", auth, isAdmin, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isAdmin, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isAdmin, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isAdmin, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isAdmin, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get basic course info (ID, name, thumbnail, description) - Lightweight endpoint
router.get("/getCoursesBasicInfo", getCoursesBasicInfo)
// Get course names and IDs only
router.get("/getCourseNamesAndIds", getCourseNamesAndIds)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Edit a Course
router.post("/editCourse", auth, isAdmin, editCourse)
// Get all Courses of a Specific Admin
router.get("/getAdminCourses", auth, isAdmin, getInstructorCourses)
//Get full course details
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
router.delete("/deleteCourse", auth, isAdmin, deleteCourse)
// Search Courses
router.post("/searchCourse", searchCourse);
//mark lecture as complete
router.post("/updateCourseProgress", auth, isStudent, markLectureAsComplete);
// Update all courses student count
router.get("/updateAllStudentsCount", updateAllCoursesStudentCount);



// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.get("/get-all-categories-and-course-count", getAllCatagoryAndItsCourseCount)
router.post("/getCategoryPageDetails", categoryPageDetails)
router.post("/addCourseToCategory", auth, isAdmin, addCourseToCategory);
router.post("/updateCategory", auth, isAdmin, updateCategory);
router.post("/deleteCategory", auth, isAdmin, deleteCategory);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router;