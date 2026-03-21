const express = require("express");
const router = express.Router();
const questionController = require("./question.controller");
const { auth, isAdmin } = require("../../../middlewares/auth");

// Admin routes
router.post("/", auth, isAdmin, questionController.addQuestion);
router.put("/:id", auth, isAdmin, questionController.updateQuestion);
router.delete("/:id", auth, isAdmin, questionController.deleteQuestion);
router.put("/reorder/:formId", auth, isAdmin, questionController.reorderQuestions);
router.get("/form/:formId", auth, isAdmin, questionController.getQuestionsByFormId);

module.exports = router;
