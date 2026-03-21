const jwt = require("jsonwebtoken");
require("dotenv").config();
// Access Token (short expiry)
exports.generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_SECRET, {
        expiresIn: "25d"
    });
};

// Refresh Token (long expiry)
exports.generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_SECRET, {
        expiresIn: "30d"
    });
};


exports.generateEnrollmentToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_SECRET, {
        expiresIn: "30d" // Long life token for enrollment only
    });
};