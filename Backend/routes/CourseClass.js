const express = require("express");
const router = express.Router();
const { auth, isAdmin, isStudent } = require("../middlewares/auth");
const {
    createClass,
    updateClass,
    deleteClass,
    getClassesByCourse,
    markClassAsComplete,
} = require("../controllers/CourseClass");

router.post("/create", auth, isAdmin, createClass);
router.put("/update", auth, isAdmin, updateClass);
router.delete("/delete", auth, isAdmin, deleteClass);
router.get("/get/:courseId", auth, getClassesByCourse);
router.post("/mark-complete", auth, isStudent, markClassAsComplete);

module.exports = router;
