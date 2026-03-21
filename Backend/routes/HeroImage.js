const express = require("express");
const router = express.Router();

const {
    getActiveHeroImages,
    getAllHeroImages,
    uploadHeroImage,
    updateHeroImage,
    deleteHeroImage,
    toggleHeroImageStatus,
} = require("../controllers/HeroImage");

const { auth, isAdmin } = require("../middlewares/auth");

// ──────────────────────────────────────────────────────────────────────────────
//  PUBLIC ROUTES (No Auth Required)
// ──────────────────────────────────────────────────────────────────────────────

// GET all active hero images for public hero section
router.get("/active", getActiveHeroImages);

// ──────────────────────────────────────────────────────────────────────────────
//  ADMIN ROUTES (Requires Auth + Admin Role)
// ──────────────────────────────────────────────────────────────────────────────

// GET all hero images (including inactive) for admin management
router.get("/all", auth, isAdmin, getAllHeroImages);

// POST upload a new hero image
router.post("/upload", auth, isAdmin, uploadHeroImage);

// PUT update hero image details (title, subtitle, order, status, new image)
router.put("/update/:id", auth, isAdmin, updateHeroImage);

// DELETE a hero image
router.delete("/delete/:id", auth, isAdmin, deleteHeroImage);

// PATCH toggle active/inactive
router.patch("/toggle/:id", auth, isAdmin, toggleHeroImageStatus);

module.exports = router;
