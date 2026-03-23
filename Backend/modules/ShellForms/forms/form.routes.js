const express = require("express");
const router = express.Router();
const formController = require("./form.controller");
const { auth, isAdmin } = require("../../../middlewares/auth");

// Admin routes
router.post("/", auth, formController.createForm);
router.get("/", auth, formController.getForms);
router.get("/:id", auth, formController.getFormById);
router.put("/:id", auth, formController.updateForm);
router.delete("/:id", auth, formController.deleteForm);

module.exports = router;
