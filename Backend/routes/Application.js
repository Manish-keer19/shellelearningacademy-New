const express = require("express");
const router = express.Router();

const { createApplication } = require("../controllers/Application");

router.post("/createApplication", createApplication);

module.exports = router;
