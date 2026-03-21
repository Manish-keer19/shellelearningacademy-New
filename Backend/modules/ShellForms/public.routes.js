const express = require("express");
const router = express.Router();
const formController = require("./forms/form.controller");
const responseController = require("./responses/response.controller");

router.get("/:slug", formController.getPublicFormBySlug);
router.post("/upload", responseController.uploadFile);
router.post("/:slug/submit", responseController.submitResponse);

module.exports = router;
