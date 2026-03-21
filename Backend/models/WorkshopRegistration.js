const mongoose = require("mongoose");

const workshopRegistrationSchema = new mongoose.Schema(
    {
        workshop: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Workshop",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        college: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WorkshopRegistration", workshopRegistrationSchema);
