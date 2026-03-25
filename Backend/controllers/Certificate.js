const Certificate = require("../models/Certificate");
const { uploadFileToCloudinary } = require("../utils/imageUploader");
const {
    generateCertificateId,
    validateCertificateIdFormat,
} = require("../utils/certificateIdGenerator");
const {
    generateQRCodeDataURL,
    generateBrandedQRCode,
} = require("../utils/qrCodeGenerator");

/**
 * Certificate Controller
 * Handles all certificate-related operations
 */

// ============================================
// ADMIN OPERATIONS (Protected Routes)
// ============================================

/**
 * Create new certificate
 * @route POST /api/v1/certificate/create
 * @access Admin only
 */
exports.createCertificate = async (req, res) => {
    try {
        const {
            studentName,
            studentContact,
            courseName,
            courseDuration,
            issueDate,
            remarks,
            certificateCount = 1, // Default to 1 certificate
        } = req.body;

        // Validation
        if (!studentName || !studentContact || !courseName || !courseDuration) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Check if primary certificate file is uploaded
        if (!req.files || !req.files.certificateFile) {
            return res.status(400).json({
                success: false,
                message: "Primary certificate file is required",
            });
        }

        const certificateFile = req.files.certificateFile;
        const secondaryCertificateFile = req.files.secondaryCertificateFile;

        // Validate certificate count
        const certCount = parseInt(certificateCount);
        if (certCount === 2 && !secondaryCertificateFile) {
            return res.status(400).json({
                success: false,
                message: "Secondary certificate file is required when certificate count is 2",
            });
        }

        // Validate file types
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        if (!allowedTypes.includes(certificateFile.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only PDF and image files are allowed for primary certificate",
            });
        }

        if (secondaryCertificateFile && !allowedTypes.includes(secondaryCertificateFile.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Only PDF and image files are allowed for secondary certificate",
            });
        }

        // Generate unique certificate ID using atomic counter
        console.log(`[Certificate Creation] Generating ID for course: ${courseName}`);
        const certificateId = await generateCertificateId(
            courseName,
            issueDate ? new Date(issueDate) : new Date()
        );
        console.log(`[Certificate Creation] Generated unique ID: ${certificateId}`);


        // Upload primary certificate file to Cloudinary
        const uploadedFile = await uploadFileToCloudinary(
            certificateFile,
            process.env.FOLDER_NAME || "certificates",
            1000,
            80
        );

        // Determine primary file type
        const fileType = certificateFile.mimetype === "application/pdf" ? "pdf" : "image";

        // Upload secondary certificate if provided
        let uploadedSecondaryFile = null;
        let secondaryFileType = null;

        if (certCount === 2 && secondaryCertificateFile) {
            uploadedSecondaryFile = await uploadFileToCloudinary(
                secondaryCertificateFile,
                process.env.FOLDER_NAME || "certificates",
                1000,
                80
            );
            secondaryFileType = secondaryCertificateFile.mimetype === "application/pdf" ? "pdf" : "image";
        }

        // Get base URL for QR code
        const baseUrl =
            process.env.FRONTEND_URL || "https://shellelearningacademy.com";

        // Generate verification URL
        const verificationUrl = `${baseUrl}/certificate/${certificateId}`;

        // Generate QR code
        const qrCodeUrl = await generateBrandedQRCode(certificateId, baseUrl);

        // Prepare certificate data
        const certificateData = {
            studentName,
            studentContact,
            courseName,
            courseDuration,
            certificateId,
            issueDate: issueDate || new Date(),
            certificateFile: {
                url: uploadedFile.secure_url,
                publicId: uploadedFile.public_id,
                fileType,
            },
            certificateCount: certCount,
            status: "VERIFIED",
            qrCodeUrl,
            verificationUrl,
            createdBy: req.user.id,
            remarks,
        };

        // Add secondary certificate if exists
        if (uploadedSecondaryFile) {
            certificateData.secondaryCertificateFile = {
                url: uploadedSecondaryFile.secure_url,
                publicId: uploadedSecondaryFile.public_id,
                fileType: secondaryFileType,
            };
        }

        // Create certificate record
        try {
            const certificate = await Certificate.create(certificateData);
            console.log(`[Certificate Creation] Successfully created certificate: ${certificateId}`);

            return res.status(201).json({
                success: true,
                message: `Certificate${certCount === 2 ? 's' : ''} created successfully`,
                data: {
                    certificate,
                    qrCode: qrCodeUrl,
                    verificationUrl,
                },
            });
        } catch (dbError) {
            // Handle duplicate key error specifically
            if (dbError.code === 11000) {
                console.error(`[Certificate Creation] DUPLICATE KEY ERROR for ID: ${certificateId}`, dbError);
                return res.status(409).json({
                    success: false,
                    message: "Certificate ID already exists. This should not happen with atomic counters. Please contact support.",
                    error: "Duplicate certificate ID",
                    certificateId,
                });
            }
            throw dbError; // Re-throw other database errors
        }
    } catch (error) {
        console.error("[Certificate Creation] Error creating certificate:", error);

        // Provide specific error messages
        let errorMessage = "Failed to create certificate";
        if (error.message.includes("certificate ID")) {
            errorMessage = "Failed to generate unique certificate ID";
        } else if (error.message.includes("Cloudinary")) {
            errorMessage = "Failed to upload certificate file";
        }

        return res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message,
        });
    }
};

/**
 * Get all certificates (Admin dashboard)
 * @route GET /api/v1/certificate/all
 * @access Admin only
 */
exports.getAllCertificates = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            search,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        // Build query
        const query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: "i" } },
                { studentContact: { $regex: search, $options: "i" } },
                { certificateId: { $regex: search, $options: "i" } },
                { courseName: { $regex: search, $options: "i" } },
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get certificates
        const certificates = await Certificate.find(query)
            .sort({ [sortBy]: order === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("createdBy", "fullName email")
            .populate("revokedBy", "fullName email");

        // Get total count
        const total = await Certificate.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                certificates,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certificates",
            error: error.message,
        });
    }
};

/**
 * Get certificate by ID (Admin)
 * @route GET /api/v1/certificate/admin/:certificateId
 * @access Admin only
 */
exports.getCertificateByIdAdmin = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            certificateId: certificateId.toUpperCase(),
        })
            .populate("createdBy", "fullName email")
            .populate("revokedBy", "fullName email");

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: certificate,
        });
    } catch (error) {
        console.error("Error fetching certificate:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certificate",
            error: error.message,
        });
    }
};

/**
 * Update certificate details (Admin only)
 * @route PUT /api/v1/certificate/admin/:certificateId
 * @access Admin only
 */
exports.updateCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const { studentName, studentContact, courseName, courseDuration, issueDate, remarks } = req.body;

        const certificate = await Certificate.findOne({
            certificateId: certificateId.toUpperCase(),
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // Update basic details if provided
        if (studentName) certificate.studentName = studentName;
        if (studentContact) certificate.studentContact = studentContact;
        if (courseName) certificate.courseName = courseName;
        if (courseDuration) certificate.courseDuration = courseDuration;
        if (issueDate) certificate.issueDate = new Date(issueDate);
        if (remarks !== undefined) certificate.remarks = remarks;

        // Ensure we handle file updates well
        if (req.files) {
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/jpg",
                "image/png",
            ];

            const certificateFile = req.files.certificateFile;
            const secondaryCertificateFile = req.files.secondaryCertificateFile;

            if (certificateFile) {
                if (!allowedTypes.includes(certificateFile.mimetype)) {
                    return res.status(400).json({
                        success: false,
                        message: "Only PDF and image files are allowed for certificate",
                    });
                }
                const uploadedFile = await uploadFileToCloudinary(
                    certificateFile,
                    process.env.FOLDER_NAME || "certificates",
                    1000,
                    80
                );

                certificate.certificateFile = {
                    url: uploadedFile.secure_url,
                    publicId: uploadedFile.public_id,
                    fileType: certificateFile.mimetype === "application/pdf" ? "pdf" : "image",
                };
            }

            if (secondaryCertificateFile) {
                if (!allowedTypes.includes(secondaryCertificateFile.mimetype)) {
                    return res.status(400).json({
                        success: false,
                        message: "Only PDF and image files are allowed for certificate",
                    });
                }
                const uploadedSecondaryFile = await uploadFileToCloudinary(
                    secondaryCertificateFile,
                    process.env.FOLDER_NAME || "certificates",
                    1000,
                    80
                );

                certificate.secondaryCertificateFile = {
                    url: uploadedSecondaryFile.secure_url,
                    publicId: uploadedSecondaryFile.public_id,
                    fileType: secondaryCertificateFile.mimetype === "application/pdf" ? "pdf" : "image",
                };

                // Also update count if it was 1
                if (certificate.certificateCount === 1) {
                    certificate.certificateCount = 2;
                }
            }
        }

        await certificate.save();

        return res.status(200).json({
            success: true,
            message: "Certificate updated successfully",
            data: certificate,
        });

    } catch (error) {
        console.error("Error updating certificate:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update certificate",
            error: error.message,
        });
    }
};

/**
 * Update certificate status (Revoke/Suspend/Verify)
 * @route PUT /api/v1/certificate/status/:certificateId
 * @access Admin only
 */
exports.updateCertificateStatus = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const { status, reason } = req.body;

        // Validate status
        const validStatuses = ["VERIFIED", "REVOKED", "SUSPENDED"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const certificate = await Certificate.findOne({
            certificateId: certificateId.toUpperCase(),
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // Update status
        certificate.status = status;

        if (status === "REVOKED") {
            certificate.revocationReason = reason;
            certificate.revokedAt = new Date();
            certificate.revokedBy = req.user.id;
        }

        await certificate.save();

        return res.status(200).json({
            success: true,
            message: `Certificate ${status.toLowerCase()} successfully`,
            data: certificate,
        });
    } catch (error) {
        console.error("Error updating certificate status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update certificate status",
            error: error.message,
        });
    }
};

/**
 * Delete certificate
 * @route DELETE /api/v1/certificate/:certificateId
 * @access Admin only
 */
exports.deleteCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOneAndDelete({
            certificateId: certificateId.toUpperCase(),
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        // TODO: Delete file from Cloudinary if needed
        // await cloudinary.uploader.destroy(certificate.certificateFile.publicId);

        return res.status(200).json({
            success: true,
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting certificate:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete certificate",
            error: error.message,
        });
    }
};

/**
 * Regenerate QR code for certificate
 * @route POST /api/v1/certificate/regenerate-qr/:certificateId
 * @access Admin only
 */
exports.regenerateQRCode = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            certificateId: certificateId.toUpperCase(),
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        const baseUrl = process.env.FRONTEND_URL || "https://shellelearningacademy.com";
        const qrCodeUrl = await generateBrandedQRCode(certificateId, baseUrl);

        certificate.qrCodeUrl = qrCodeUrl;
        await certificate.save();

        return res.status(200).json({
            success: true,
            message: "QR code regenerated successfully",
            data: {
                qrCodeUrl,
            },
        });
    } catch (error) {
        console.error("Error regenerating QR code:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to regenerate QR code",
            error: error.message,
        });
    }
};

// ============================================
// PUBLIC OPERATIONS (No Authentication)
// ============================================

/**
 * Verify certificate (Public route)
 * @route GET /api/v1/certificate/verify/:certificateId
 * @access Public
 */
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        // Validate format
        if (!validateCertificateIdFormat(certificateId.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid certificate ID format",
            });
        }

        // Find certificate
        const certificate = await Certificate.findOne({
            certificateId: certificateId.toUpperCase(),
        }).select(
            "studentName studentContact courseName courseDuration certificateId issueDate status certificateFile.url certificateFile.fileType secondaryCertificateFile.url secondaryCertificateFile.fileType certificateCount verificationUrl"
        );

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found or invalid",
            });
        }

        // Check if certificate is valid
        const isValid = certificate.status === "VERIFIED";

        return res.status(200).json({
            success: true,
            data: {
                certificate,
                isValid,
                status: certificate.status,
            },
        });
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify certificate",
            error: error.message,
        });
    }
};

/**
 * Get certificate statistics (Admin dashboard)
 * @route GET /api/v1/certificate/stats
 * @access Admin only
 */
exports.getCertificateStats = async (req, res) => {
    try {
        const totalCertificates = await Certificate.countDocuments();
        const verifiedCertificates = await Certificate.countDocuments({
            status: "VERIFIED",
        });
        const revokedCertificates = await Certificate.countDocuments({
            status: "REVOKED",
        });
        const suspendedCertificates = await Certificate.countDocuments({
            status: "SUSPENDED",
        });

        // Get certificates issued this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthCertificates = await Certificate.countDocuments({
            createdAt: { $gte: startOfMonth },
        });

        // Get top courses
        const topCourses = await Certificate.aggregate([
            {
                $group: {
                    _id: "$courseName",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalCertificates,
                verifiedCertificates,
                revokedCertificates,
                suspendedCertificates,
                thisMonthCertificates,
                topCourses,
            },
        });
    } catch (error) {
        console.error("Error fetching certificate stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch certificate statistics",
            error: error.message,
        });
    }
};