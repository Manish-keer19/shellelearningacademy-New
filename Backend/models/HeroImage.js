const mongoose = require("mongoose");

const heroImageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        cloudinaryPublicId: {
            type: String,
            required: true,
        },
        order: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("HeroImage", heroImageSchema);
