const mongoose = require("mongoose");

/**
 * Certificate Counter Schema
 * Used to generate unique sequential certificate IDs atomically
 * This prevents race conditions when multiple certificates are created simultaneously
 */
const certificateCounterSchema = new mongoose.Schema(
    {
        // Composite key: courseCode-year (e.g., "DM-2025")
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        courseCode: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        // Current sequence number (unlimited - no 3-digit restriction)
        sequence: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for efficient queries
certificateCounterSchema.index({ courseCode: 1, year: 1 });

/**
 * Get next sequence number atomically
 * This method uses findOneAndUpdate with atomic increment to prevent race conditions
 * @param {string} courseCode - Course code (e.g., "DM")
 * @param {number} year - Year (e.g., 2025)
 * @returns {Promise<number>} - Next sequence number
 */
certificateCounterSchema.statics.getNextSequence = async function (
    courseCode,
    year
) {
    const key = `${courseCode}-${year}`;

    // Use findOneAndUpdate with $inc to atomically increment the counter
    // This ensures that even if multiple requests happen simultaneously,
    // each will get a unique sequence number
    const counter = await this.findOneAndUpdate(
        { key },
        {
            $inc: { sequence: 1 },
            $setOnInsert: {
                courseCode,
                year,
            },
        },
        {
            new: true, // Return the updated document
            upsert: true, // Create if doesn't exist
            runValidators: true,
        }
    );

    return counter.sequence;
};

module.exports = mongoose.model("CertificateCounter", certificateCounterSchema);
