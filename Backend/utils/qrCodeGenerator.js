const QRCode = require("qrcode");

/**
 * QR Code Generator for Certificate Verification
 * Generates QR codes that link to public certificate verification pages
 */

/**
 * Generate QR code as Data URL (base64)
 * @param {string} certificateId - Certificate ID
 * @param {string} baseUrl - Base URL of the application (e.g., https://shellelearningacademy.com/)
 * @returns {Promise<string>} - QR code as data URL
 */
const generateQRCodeDataURL = async (certificateId, baseUrl) => {
    try {
        // Construct verification URL
        const verificationUrl = `${baseUrl}/certificate/${certificateId}`;

        // Generate QR code with high error correction
        const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: "H", // High error correction
            type: "image/png",
            quality: 1,
            margin: 2,
            width: 400,
            color: {
                dark: "#000000", // Black dots
                light: "#FFFFFF", // White background
            },
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error("Error generating QR code:", error);
        throw new Error("Failed to generate QR code");
    }
};

/**
 * Generate QR code as buffer (for file upload)
 * @param {string} certificateId - Certificate ID
 * @param {string} baseUrl - Base URL of the application
 * @returns {Promise<Buffer>} - QR code as buffer
 */
const generateQRCodeBuffer = async (certificateId, baseUrl) => {
    try {
        const verificationUrl = `${baseUrl}/certificate/${certificateId}`;

        const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
            errorCorrectionLevel: "H",
            type: "png",
            quality: 1,
            margin: 2,
            width: 400,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        return qrCodeBuffer;
    } catch (error) {
        console.error("Error generating QR code buffer:", error);
        throw new Error("Failed to generate QR code buffer");
    }
};

/**
 * Generate QR code with custom styling (Shell E-Learning branding)
 * @param {string} certificateId - Certificate ID
 * @param {string} baseUrl - Base URL of the application
 * @returns {Promise<string>} - QR code as data URL with branding
 */
const generateBrandedQRCode = async (certificateId, baseUrl) => {
    try {
        const verificationUrl = `${baseUrl}/certificate/${certificateId}`;

        // Generate with Shell E-Learning brand colors
        const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
            errorCorrectionLevel: "H",
            type: "image/png",
            quality: 1,
            margin: 3,
            width: 500,
            color: {
                dark: "#1a365d", // Shell E-Learning primary color (dark blue)
                light: "#FFFFFF",
            },
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error("Error generating branded QR code:", error);
        throw new Error("Failed to generate branded QR code");
    }
};

/**
 * Validate QR code URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
const validateQRCodeUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.pathname.startsWith("/certificate/");
    } catch (error) {
        return false;
    }
};

module.exports = {
    generateQRCodeDataURL,
    generateQRCodeBuffer,
    generateBrandedQRCode,
    validateQRCodeUrl,
};
