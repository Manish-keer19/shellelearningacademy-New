const mongoose = require("mongoose");

/**
 * Certificate Schema for Shell E-Learning Academy
 * Stores certificate information with unique certificate IDs
 */
const certificateSchema = new mongoose.Schema(
    {
        // Student Information
        studentName: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        studentContact: {
            type: String,
            required: [true, "Student email or mobile is required"],
            trim: true,
        },

        // Course Information
        courseName: {
            type: String,
            required: [true, "Course name is required"],
            trim: true,
        },
        courseDuration: {
            type: String,
            required: [true, "Course duration is required"],
            trim: true,
        },

        // Certificate Details
        certificateId: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            index: true, // Index for fast lookup
        },
        issueDate: {
            type: Date,
            required: true,
            default: Date.now,
        },

        // Primary Certificate File (Required)
        certificateFile: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
            fileType: {
                type: String,
                enum: ["pdf", "image"],
                required: true,
            },
        },

        // Secondary Certificate File (Optional - for dual certificates)
        secondaryCertificateFile: {
            url: {
                type: String,
            },
            publicId: {
                type: String,
            },
            fileType: {
                type: String,
                enum: ["pdf", "image"],
            },
        },

        // Number of certificates assigned (1 or 2)
        certificateCount: {
            type: Number,
            enum: [1, 2],
            default: 1,
            required: true,
        },

        // Status Management
        status: {
            type: String,
            enum: ["VERIFIED", "REVOKED", "SUSPENDED"],
            default: "VERIFIED",
            required: true,
        },

        // QR Code
        qrCodeUrl: {
            type: String,
        },

        // Public Verification URL
        verificationUrl: {
            type: String,
            required: true,
        },

        // Admin who created this certificate
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        // Metadata
        remarks: {
            type: String,
            trim: true,
        },
        revocationReason: {
            type: String,
            trim: true,
        },
        revokedAt: {
            type: Date,
        },
        revokedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Index for efficient queries
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ studentContact: 1 });
certificateSchema.index({ createdAt: -1 });

// Virtual for public verification page URL
certificateSchema.virtual("publicUrl").get(function () {
    return `/certificate/${this.certificateId}`;
});

// Method to check if certificate is valid
certificateSchema.methods.isValid = function () {
    return this.status === "VERIFIED";
};

// Method to revoke certificate
certificateSchema.methods.revoke = function (reason, adminId) {
    this.status = "REVOKED";
    this.revocationReason = reason;
    this.revokedAt = new Date();
    this.revokedBy = adminId;
    return this.save();
};

// Static method to find valid certificate
certificateSchema.statics.findValidCertificate = function (certificateId) {
    return this.findOne({
        certificateId: certificateId.toUpperCase(),
        status: "VERIFIED",
    });
};

module.exports = mongoose.model("Certificate", certificateSchema);
