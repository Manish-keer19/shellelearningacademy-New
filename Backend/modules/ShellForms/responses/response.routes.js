const express = require("express");
const router = express.Router();
const responseController = require("./response.controller");
const { auth, isAdmin } = require("../../../middlewares/auth");

// Admin routes
router.get("/form/:formId", auth, responseController.getResponses);

// Public route for form submission is handled in a separate public router usually
// but we can put it here or as a separate file.
// The user requested: POST /api/public/forms/:slug/submit

module.exports = router;
