const express = require("express");
const router = express.Router();

const { createPopup } = require("../controllers/Popup");

router.post("/createPopup", createPopup);

module.exports = router;