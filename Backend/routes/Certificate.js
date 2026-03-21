const express = require("express");
const router = express.Router();

// Import controllers
const {
    createCertificate,
    getAllCertificates,
    getCertificateByIdAdmin,
    updateCertificate,
    updateCertificateStatus,
    deleteCertificate,
    regenerateQRCode,
    verifyCertificate,
    getCertificateStats,
} = require("../controllers/Certificate");

// Import middleware
const { auth, isAdmin } = require("../middlewares/auth");

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

/**
 * @route   GET /api/v1/certificate/verify/:certificateId
 * @desc    Verify certificate by ID (Public)
 * @access  Public
 */
router.get("/verify/:certificateId", verifyCertificate);

// ============================================
// ADMIN ROUTES (Authentication Required)
// ============================================

/**
 * @route   POST /api/v1/certificate/create
 * @desc    Create new certificate
 * @access  Admin only
 */
router.post("/create", auth, isAdmin, createCertificate);

/**
 * @route   GET /api/v1/certificate/all
 * @desc    Get all certificates with pagination and filters
 * @access  Admin only
 */
router.get("/all", auth, isAdmin, getAllCertificates);

/**
 * @route   GET /api/v1/certificate/stats
 * @desc    Get certificate statistics
 * @access  Admin only
 */
router.get("/stats", auth, isAdmin, getCertificateStats);

/**
 * @route   GET /api/v1/certificate/admin/:certificateId
 * @desc    Get certificate details by ID (Admin view)
 * @access  Admin only
 */
router.get("/admin/:certificateId", auth, isAdmin, getCertificateByIdAdmin);

/**
 * @route   PUT /api/v1/certificate/admin/:certificateId
 * @desc    Update certificate details (Admin view)
 * @access  Admin only
 */
router.put("/admin/:certificateId", auth, isAdmin, updateCertificate);

/**
 * @route   PUT /api/v1/certificate/status/:certificateId
 * @desc    Update certificate status (Verify/Revoke/Suspend)
 * @access  Admin only
 */
router.put("/status/:certificateId", auth, isAdmin, updateCertificateStatus);

/**
 * @route   DELETE /api/v1/certificate/:certificateId
 * @desc    Delete certificate
 * @access  Admin only
 */
router.delete("/:certificateId", auth, isAdmin, deleteCertificate);

/**
 * @route   POST /api/v1/certificate/regenerate-qr/:certificateId
 * @desc    Regenerate QR code for certificate
 * @access  Admin only
 */
router.post("/regenerate-qr/:certificateId", auth, isAdmin, regenerateQRCode);

module.exports = router;
