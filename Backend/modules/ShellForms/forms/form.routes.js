const express = require("express");
const router = express.Router();
const formController = require("./form.controller");
const { auth, isAdmin } = require("../../../middlewares/auth");

// Admin routes
router.post("/", auth, isAdmin, formController.createForm);
router.get("/", auth, isAdmin, formController.getForms);
router.get("/:id", auth, isAdmin, formController.getFormById);
router.put("/:id", auth, isAdmin, formController.updateForm);
router.delete("/:id", auth, isAdmin, formController.deleteForm);

module.exports = router;
