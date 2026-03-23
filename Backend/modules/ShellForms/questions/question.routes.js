const express = require("express");
const router = express.Router();
const questionController = require("./question.controller");
const { auth, isAdmin } = require("../../../middlewares/auth");

// Admin routes
router.post("/", auth, questionController.addQuestion);
router.put("/:id", auth, questionController.updateQuestion);
router.delete("/:id", auth, questionController.deleteQuestion);
router.put("/reorder/:formId", auth, questionController.reorderQuestions);
router.get("/form/:formId", auth, questionController.getQuestionsByFormId);

module.exports = router;
