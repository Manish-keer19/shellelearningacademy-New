const mongoose = require("mongoose");

const targetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        month: {
            type: Number, // 0-11 or 1-12. Let's use 1-12 for clarity or match JS Date. Let's Use 1-12.
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        targetAmount: {
            type: Number,
            default: 0,
        },
        achievedAmount: {
            type: Number,
            default: 0,
        },
        totalCommissionEarned: {
            type: Number,
            default: 0,
        },
        // Optional: History of specific deals contributing to this could be referenced or just purely aggregated
    },
    { timestamps: true }
);

// Ensure one target per user per month
targetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Target", targetSchema);
