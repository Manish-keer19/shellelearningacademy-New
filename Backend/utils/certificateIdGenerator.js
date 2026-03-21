const CertificateCounter = require("../models/CertificateCounter");

/**
 * Generate unique Certificate ID for Shell E-Learning Academy
 * Format: SEA-{COURSE_CODE}-{YEAR}-{SEQUENCE}
 * Example: SEA-DM-2025-1, SEA-DM-2025-1000, SEA-DM-2025-99999
 * 
 * UNLIMITED SEQUENCE NUMBERS - No 3-digit restriction!
 * Uses atomic counter to prevent race conditions and ensure uniqueness
 */

// Course code mapping
const COURSE_CODES = {
    "Digital Marketing": "DM",
    "Web Development": "WD",
    "Data Science": "DS",
    "Graphic Design": "GD",
    "Python Programming": "PP",
    "Java Programming": "JP",
    "Mobile App Development": "MAD",
    "UI/UX Design": "UX",
    "Cloud Computing": "CC",
    "Cyber Security": "CS",
    "Machine Learning": "ML",
    "Artificial Intelligence": "AI",
    "Blockchain": "BC",
    "DevOps": "DO",
    "Full Stack Development": "FSD",
    "Content Writing": "CW",
    "SEO & SEM": "SEO",
    "Video Editing": "VE",
    "Photography": "PHO",
    "Business Analytics": "BA",
    "Project Management": "PM",
    "Excel & Data Analysis": "EDA",
    // Add more courses as needed
};

/**
 * Get course code from course name
 * @param {string} courseName - Full course name
 * @returns {string} - Course code (2-3 letters)
 */
const getCourseCode = (courseName) => {
    // Check if exact match exists
    if (COURSE_CODES[courseName]) {
        return COURSE_CODES[courseName];
    }

    // Try partial match (case-insensitive)
    const lowerCourseName = courseName.toLowerCase();
    for (const [key, value] of Object.entries(COURSE_CODES)) {
        if (lowerCourseName.includes(key.toLowerCase())) {
            return value;
        }
    }

    // Generate code from first letters if no match
    const words = courseName.trim().split(/\s+/); // Split by any whitespace
    if (words.length >= 2) {
        return words
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    }

    // Fallback: first 2 letters
    return courseName.substring(0, 2).toUpperCase();
};

/**
 * Generate unique certificate ID using atomic counter
 * This prevents race conditions when multiple certificates are created simultaneously
 * 
 * Format: SEA-{COURSE_CODE}-{YEAR}-{SEQUENCE}
 * - Sequences 1-9999: Padded to 4 digits (0001, 0002, ..., 9999)
 * - Sequences 10000+: No padding (10000, 10001, ...)
 * 
 * @param {string} courseName - Course name
 * @param {Date} issueDate - Certificate issue date (optional, defaults to now)
 * @returns {Promise<string>} - Unique certificate ID
 */
const generateCertificateId = async (courseName, issueDate = new Date()) => {
    try {
        const courseCode = getCourseCode(courseName);
        const year = issueDate.getFullYear();

        // Get next sequence number atomically (prevents race conditions)
        const sequence = await CertificateCounter.getNextSequence(courseCode, year);

        // Format sequence with 4-digit padding for numbers 1-9999
        // For 10000+, use the number as-is (no padding needed)
        // Examples: 0001, 0002, 0999, 9999, 10000, 10001
        const sequenceStr = sequence < 10000
            ? sequence.toString().padStart(4, "0")
            : sequence.toString();

        // Generate certificate ID
        // Examples: SEA-DM-2025-0001, SEA-DM-2025-0002, SEA-DM-2025-10000
        const certificateId = `SEA-${courseCode}-${year}-${sequenceStr}`;

        return certificateId;
    } catch (error) {
        console.error("Error generating certificate ID:", error);
        throw new Error("Failed to generate certificate ID");
    }
};

/**
 * Validate certificate ID format
 * Accepts both 4-digit padded (0001-9999) and unlimited (10000+) formats
 * 
 * Valid formats:
 * - SEA-DM-2025-0001 (4-digit padded)
 * - SEA-DM-2025-9999 (4-digit padded)
 * - SEA-DM-2025-10000 (unlimited)
 * 
 * @param {string} certificateId - Certificate ID to validate
 * @returns {boolean} - True if valid format
 */
const validateCertificateIdFormat = (certificateId) => {
    // Pattern: SEA-{2-3 letters}-{4 digits year}-{4+ digits sequence}
    // Accepts: 0001, 0002, 9999, 10000, 99999, etc.
    const pattern = /^SEA-[A-Z]{2,3}-\d{4}-\d{4,}$/;
    return pattern.test(certificateId);
};

/**
 * Get certificate statistics for a course and year
 * @param {string} courseCode - Course code
 * @param {number} year - Year
 * @returns {Promise<Object>} - Statistics object
 */
const getCertificateStats = async (courseCode, year) => {
    try {
        const key = `${courseCode}-${year}`;
        const counter = await CertificateCounter.findOne({ key });

        return {
            courseCode,
            year,
            totalCertificates: counter ? counter.sequence : 0,
            lastUpdated: counter ? counter.updatedAt : null,
        };
    } catch (error) {
        console.error("Error getting certificate stats:", error);
        return {
            courseCode,
            year,
            totalCertificates: 0,
            lastUpdated: null,
        };
    }
};

module.exports = {
    generateCertificateId,
    validateCertificateIdFormat,
    getCourseCode,
    getCertificateStats,
    COURSE_CODES,
};
