const express = require("express");
const router = express.Router();

const formRoutes = require("./forms/form.routes");
const questionRoutes = require("./questions/question.routes");
const responseRoutes = require("./responses/response.routes");
const formController = require("./forms/form.controller");
const responseController = require("./responses/response.controller");

// Admin routes (mounted at /api/shellforms)
router.use("/forms", formRoutes);
router.use("/questions", questionRoutes);
router.use("/responses", responseRoutes);

// Public routes (typically we'd want these on a different prefix, but let's expose them here too if needed, 
// or the user can mount this module's public parts differently)
// router.get("/public/:slug", formController.getPublicFormBySlug);
// router.post("/public/:slug/submit", responseController.submitResponse);

module.exports = {
	adminRouter: router,
	publicRoutes: {
		getForm: formController.getPublicFormBySlug,
		submitForm: responseController.submitResponse
	}
};
